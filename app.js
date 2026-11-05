(function () {
  "use strict";

  const CATEGORY_KEYS = ["direct", "modulation", "specification", "stative", "weak"];
  const CATEGORY_COLORS = {
    direct: "#2a9d8f",
    modulation: "#e76f51",
    specification: "#396f8f",
    stative: "#8f6b87",
    weak: "#b8862e"
  };
  const PAGE_SIZE = 25;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const VIEWS = ["home", "explore", "visualize", "report", "codebook", "ai"];
  const SORT_KEYS = ["id", "source", "target", "nominal", "verb", "category", "checked", "duplicate"];

  const state = {
    view: "home",
    lang: "en",
    q: "",
    cat: "",
    checked: "",
    unique: false,
    entry: null,
    page: 1,
    sort: { key: "id", dir: "asc" },
    chart: {
      sankeyTop: 10,
      sankeyVerbs: 12,
      sankeyMin: 1,
      treemapTerms: 8,
      treemapMetric: "count",
      scatterLog: false,
      kwicWindow: 8,
      kwicSort: "id"
    }
  };

  let corpus = null;
  let allRows = [];
  let toastTimer = null;
  let searchTimer = null;
  let lastFocus = null;
  const els = {};

  const EXTRA = {
    en: {
      entries: "entries",
      entrySingular: "entry",
      uniquePairs: "unique pairs",
      uniquePairSingular: "unique pair",
      checkedEntries: "checked",
      other: "Other",
      verbs: "verbs",
      nounColumn: "English nominal",
      verbColumn: "Chinese verb",
      filterByTerm: "Filter the corpus by this term",
      filterByCategory: "Filter by this category",
      categoryLegend: "Colour marks shift category",
      flowLegend: "Link colour marks the dominant shift category",
      sankeyShown: "{{n}} of {{total}} filtered entries appear in the visible links; the top controls set this chart's scope.",
      resizeNote: "Click a label to search; click a category band to filter.",
      corpusFilters: "Corpus filters",
      reportFigures: "Data portraits"
    },
    "zh-Hant": {
      entries: "筆",
      entrySingular: "筆",
      uniquePairs: "對唯一句對",
      uniquePairSingular: "對唯一句對",
      checkedEntries: "已核對",
      other: "其他",
      verbs: "種動詞",
      nounColumn: "英語名詞",
      verbColumn: "中文動詞",
      filterByTerm: "以此詞篩選語料",
      filterByCategory: "以此類別篩選",
      categoryLegend: "顏色代表轉換類別",
      flowLegend: "連線顏色代表主要轉換類別",
      sankeyShown: "目前連線呈現 {{total}} 筆篩選結果中的 {{n}} 筆；上方控制可調整圖表範圍。",
      resizeNote: "點選標籤可搜尋；點選類別色帶可篩選。",
      corpusFilters: "語料篩選",
      reportFigures: "資料切面"
    }
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function getCopy(path) {
    let value = window.NV_COPY[state.lang];
    for (const key of path.split(".")) {
      value = value == null ? value : value[key];
    }
    if (value == null) {
      value = window.NV_COPY.en;
      for (const key of path.split(".")) {
        value = value == null ? value : value[key];
      }
    }
    return value == null ? path : value;
  }

  function fmt(template, values) {
    if (typeof template !== "string") return "";
    return template.replace(/\{\{(\w+)\}\}/g, function (_, key) {
      return values[key] == null ? "" : String(values[key]);
    });
  }

  function extra(key) {
    return (EXTRA[state.lang] && EXTRA[state.lang][key]) || EXTRA.en[key] || key;
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function truncate(value, limit) {
    const text = String(value == null ? "" : value);
    if (text.length <= limit) return text;
    return text.slice(0, Math.max(1, limit - 1)).trimEnd() + "…";
  }

  function formatNumber(value) {
    return new Intl.NumberFormat(state.lang === "en" ? "en" : "zh-Hant").format(value);
  }

  function percent(value, total) {
    return total ? (value / total) * 100 : 0;
  }

  function mean(values) {
    if (!values.length) return 0;
    return values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
  }

  function pearson(rows) {
    if (rows.length < 2) return null;
    const xs = rows.map(function (row) { return row.english_chars; });
    const ys = rows.map(function (row) { return row.chinese_chars; });
    const mx = mean(xs);
    const my = mean(ys);
    let numerator = 0;
    let dx2 = 0;
    let dy2 = 0;
    rows.forEach(function (row, index) {
      const dx = xs[index] - mx;
      const dy = ys[index] - my;
      numerator += dx * dy;
      dx2 += dx * dx;
      dy2 += dy * dy;
    });
    if (!dx2 || !dy2) return null;
    return numerator / Math.sqrt(dx2 * dy2);
  }

  function countBy(rows, key) {
    const counts = new Map();
    rows.forEach(function (row) {
      counts.set(row[key], (counts.get(row[key]) || 0) + 1);
    });
    return counts;
  }

  function uniquePairCount(rows) {
    const seen = new Set();
    rows.forEach(function (row) {
      seen.add(row.source_text + "\u0000" + row.target_text);
    });
    return seen.size;
  }

  function uniqueRows(rows) {
    const seen = new Set();
    return rows.filter(function (row) {
      const key = row.source_text + "\u0000" + row.target_text;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function categoryInfo(key) {
    return getCopy("categories." + key);
  }

  function categoryShort(key) {
    return categoryInfo(key).short;
  }

  function categoryLabel(key) {
    return categoryInfo(key).label;
  }

  function categoryColor(key) {
    return CATEGORY_COLORS[key] || CATEGORY_COLORS.direct;
  }

  function searchHaystack(row) {
    return [
      row.id,
      row.source_id,
      row.source_text,
      row.target_text,
      row.key_term,
      row.target_verb,
      row.target_verb_raw,
      row.category,
      categoryLabel(row.category),
      categoryShort(row.category)
    ].join(" ").toLocaleLowerCase(state.lang);
  }

  function currentRows() {
    let rows = allRows;
    if (state.unique) rows = uniqueRows(rows);
    if (state.q) {
      const query = state.q.trim().toLocaleLowerCase(state.lang);
      if (query) {
        rows = rows.filter(function (row) {
          return searchHaystack(row).includes(query);
        });
      }
    }
    if (state.cat) rows = rows.filter(function (row) { return row.category === state.cat; });
    if (state.checked) rows = rows.filter(function (row) { return row.human_checked === state.checked; });
    return rows;
  }

  function collator() {
    return new Intl.Collator(state.lang === "en" ? "en" : "zh-Hant", { numeric: true, sensitivity: "base" });
  }

  function sortRows(rows) {
    const key = state.sort.key;
    const direction = state.sort.dir === "desc" ? -1 : 1;
    const compareText = collator();
    const categoryOrder = new Map(CATEGORY_KEYS.map(function (name, index) { return [name, index]; }));
    return rows.slice().sort(function (a, b) {
      let av;
      let bv;
      if (key === "id") {
        av = a.id;
        bv = b.id;
      } else if (key === "source") {
        av = a.source_text;
        bv = b.source_text;
      } else if (key === "target") {
        av = a.target_text;
        bv = b.target_text;
      } else if (key === "nominal") {
        av = a.key_term;
        bv = b.key_term;
      } else if (key === "verb") {
        av = a.target_verb;
        bv = b.target_verb;
      } else if (key === "category") {
        av = categoryOrder.get(a.category);
        bv = categoryOrder.get(b.category);
      } else if (key === "checked") {
        av = a.human_checked;
        bv = b.human_checked;
      } else {
        av = a.duplicate ? 1 : 0;
        bv = b.duplicate ? 1 : 0;
      }
      let result;
      if (typeof av === "number" && typeof bv === "number") result = av - bv;
      else result = compareText.compare(String(av || ""), String(bv || ""));
      if (result === 0) result = a.id - b.id;
      return result * direction;
    });
  }

  function statsFor(rows) {
    const total = rows.length;
    const categoryCounts = {};
    CATEGORY_KEYS.forEach(function (key) { categoryCounts[key] = 0; });
    rows.forEach(function (row) {
      if (categoryCounts[row.category] == null) categoryCounts[row.category] = 0;
      categoryCounts[row.category] += 1;
    });
    const nominalCounts = Array.from(countBy(rows, "key_term").entries()).sort(function (a, b) {
      return b[1] - a[1] || a[0].localeCompare(b[0]);
    });
    const verbCounts = Array.from(countBy(rows, "target_verb").entries()).sort(function (a, b) {
      return b[1] - a[1] || a[0].localeCompare(b[0]);
    });
    const topTen = nominalCounts.slice(0, 10).reduce(function (sum, item) { return sum + item[1]; }, 0);
    const topTwenty = nominalCounts.slice(0, 20).reduce(function (sum, item) { return sum + item[1]; }, 0);
    const categoryMeans = {};
    CATEGORY_KEYS.forEach(function (key) {
      const subset = rows.filter(function (row) { return row.category === key; });
      categoryMeans[key] = {
        count: subset.length,
        en: mean(subset.map(function (row) { return row.english_chars; })),
        zh: mean(subset.map(function (row) { return row.chinese_chars; }))
      };
    });
    return {
      total: total,
      unique: uniquePairCount(rows),
      checked: rows.filter(function (row) { return row.human_checked === "yes"; }).length,
      categoryCounts: categoryCounts,
      nominalCounts: nominalCounts,
      verbCounts: verbCounts,
      topTenPct: percent(topTen, total),
      topTwentyPct: percent(topTwenty, total),
      avgEn: mean(rows.map(function (row) { return row.english_chars; })),
      avgZh: mean(rows.map(function (row) { return row.chinese_chars; })),
      ratio: mean(rows.map(function (row) { return row.chinese_chars; })) / (mean(rows.map(function (row) { return row.english_chars; })) || 1),
      r: pearson(rows),
      categoryMeans: categoryMeans
    };
  }

  function readURL() {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    state.view = VIEWS.includes(requestedView) ? requestedView : "home";
    state.lang = params.get("lang") === "zh-Hant" ? "zh-Hant" : "en";
    state.q = (params.get("q") || params.get("term") || "").trim();
    state.cat = CATEGORY_KEYS.includes(params.get("cat")) ? params.get("cat") : "";
    state.checked = ["yes", "no"].includes(params.get("checked")) ? params.get("checked") : "";
    state.unique = params.get("unique") === "1";
    const page = Number(params.get("page"));
    state.page = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const sortKey = params.get("sort");
    state.sort.key = SORT_KEYS.includes(sortKey) ? sortKey : "id";
    state.sort.dir = params.get("dir") === "desc" ? "desc" : "asc";
    const entry = Number(params.get("entry"));
    state.entry = Number.isFinite(entry) && entry > 0 ? entry : null;
  }

  function syncURL(push) {
    const params = new URLSearchParams();
    if (state.view !== "home") params.set("view", state.view);
    if (state.lang !== "en") params.set("lang", state.lang);
    if (state.q) params.set("q", state.q);
    if (state.cat) params.set("cat", state.cat);
    if (state.checked) params.set("checked", state.checked);
    if (state.unique) params.set("unique", "1");
    if (state.page > 1) params.set("page", String(state.page));
    if (state.sort.key !== "id" || state.sort.dir !== "asc") {
      params.set("sort", state.sort.key);
      params.set("dir", state.sort.dir);
    }
    if (state.entry) params.set("entry", String(state.entry));
    const query = params.toString();
    const url = window.location.pathname + (query ? "?" + query : "");
    window.history[push ? "pushState" : "replaceState"]({}, "", url);
  }

  function cacheElements() {
    [
      "filter-dock", "global-search", "category-filter", "checked-filter", "unique-filter",
      "clear-filters", "result-count", "active-filters", "export-csv", "browse-table",
      "table-export", "table-view-count", "table-range", "page-label", "page-prev",
      "page-next", "explore-summary", "mini-table", "home-term-chips", "sankey-chart",
      "sankey-top", "sankey-verbs", "sankey-min", "treemap-chart", "treemap-terms",
      "treemap-metric", "scatter-chart", "scatter-log", "scatter-correlation", "kwic-chart",
      "kwic-window", "kwic-sort", "report-content", "codebook-content", "ai-content",
      "drawer-backdrop", "entry-drawer", "drawer-close", "drawer-content", "toast",
      "loading-state"
    ].forEach(function (id) {
      els[id] = document.getElementById(id);
    });
  }

  function applyStaticCopy() {
    document.documentElement.lang = state.lang;
    $all("[data-i18n]").forEach(function (node) {
      const value = getCopy(node.getAttribute("data-i18n"));
      if (typeof value === "string") node.textContent = value;
    });
    $all("[data-i18n-html]").forEach(function (node) {
      const value = getCopy(node.getAttribute("data-i18n-html"));
      if (typeof value === "string") node.innerHTML = value;
    });
    $all("[data-i18n-placeholder]").forEach(function (node) {
      const value = getCopy(node.getAttribute("data-i18n-placeholder"));
      if (typeof value === "string") node.setAttribute("placeholder", value);
    });
    $all("[data-i18n-aria-label]").forEach(function (node) {
      const value = getCopy(node.getAttribute("data-i18n-aria-label"));
      if (typeof value === "string") node.setAttribute("aria-label", value);
    });
    $all("[data-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lang") === state.lang));
    });
    if (els["filter-dock"]) els["filter-dock"].setAttribute("aria-label", extra("corpusFilters"));
    if (els["drawer-close"]) els["drawer-close"].setAttribute("aria-label", getCopy("drawer.close"));
    if (els["page-prev"]) els["page-prev"].setAttribute("aria-label", getCopy("explore.prev"));
    if (els["page-next"]) els["page-next"].setAttribute("aria-label", getCopy("explore.next"));
    const description = $('meta[name="description"]');
    if (description) description.setAttribute("content", getCopy("home.deck"));
    updateDocumentTitle();
  }

  function updateDocumentTitle() {
    if (state.view === "home") {
      document.title = "NVAtlas · From nouns to verbs";
    } else {
      document.title = getCopy("nav." + state.view) + " · NVAtlas";
    }
  }

  function populateChartControls() {
    const numberOptions = function (select, values, selected) {
      select.innerHTML = values.map(function (value) {
        return '<option value="' + value + '">' + value + "</option>";
      }).join("");
      select.value = String(selected);
    };
    numberOptions(els["sankey-top"], [5, 10, 15, 20], state.chart.sankeyTop);
    numberOptions(els["sankey-verbs"], [6, 12, 18, 25], state.chart.sankeyVerbs);
    numberOptions(els["sankey-min"], [1, 2, 3, 4, 5, 8], state.chart.sankeyMin);
    numberOptions(els["treemap-terms"], [5, 8, 12, 20], state.chart.treemapTerms);
    els["treemap-metric"].innerHTML =
      '<option value="count">' + escapeHTML(getCopy("viz.treemap.metricCount")) + "</option>" +
      '<option value="variety">' + escapeHTML(getCopy("viz.treemap.metricVariety")) + "</option>";
    els["treemap-metric"].value = state.chart.treemapMetric;
    numberOptions(els["kwic-window"], [3, 5, 8, 12, 20], state.chart.kwicWindow);
    els["kwic-sort"].innerHTML =
      '<option value="left">' + escapeHTML(getCopy("viz.kwic.sortLeft")) + "</option>" +
      '<option value="right">' + escapeHTML(getCopy("viz.kwic.sortRight")) + "</option>" +
      '<option value="id">' + escapeHTML(getCopy("viz.kwic.sortId")) + "</option>";
    els["kwic-sort"].value = state.chart.kwicSort;
    els["scatter-log"].checked = state.chart.scatterLog;
  }

  function renderFilterControls() {
    els["global-search"].value = state.q;
    els["unique-filter"].checked = state.unique;
    els["category-filter"].innerHTML = '<option value="">' + escapeHTML(getCopy("filters.allCategories")) + "</option>" +
      CATEGORY_KEYS.map(function (key) {
        return '<option value="' + key + '">' + escapeHTML(categoryLabel(key)) + "</option>";
      }).join("");
    els["category-filter"].value = state.cat;
    els["checked-filter"].value = state.checked;
    populateChartControls();
  }

  function renderActiveFilters() {
    const shown = currentRows();
    const base = state.unique ? uniqueRows(allRows) : allRows;
    els["result-count"].textContent = fmt(getCopy("filters.count"), {
      n: formatNumber(shown.length),
      total: formatNumber(base.length)
    });
    const chips = [];
    if (state.q) {
      chips.push({ key: "q", label: fmt(getCopy("filters.query"), { value: state.q }) });
    }
    if (state.cat) {
      chips.push({ key: "cat", label: categoryLabel(state.cat) });
    }
    if (state.checked) {
      chips.push({
        key: "checked",
        label: fmt(getCopy("filters.checkedActive"), {
          value: state.checked === "yes" ? getCopy("filters.yes") : getCopy("filters.no")
        })
      });
    }
    if (state.unique) chips.push({ key: "unique", label: getCopy("filters.uniqueActive") });
    els["active-filters"].innerHTML = chips.map(function (chip) {
      return '<span class="filter-chip">' + escapeHTML(chip.label) +
        '<button type="button" data-remove-filter="' + chip.key + '" aria-label="' +
        escapeHTML(getCopy("filters.remove")) + '">×</button></span>';
    }).join("");
    if (!state.unique) {
      const duplicateExcess = allRows.length - uniquePairCount(allRows);
      if (duplicateExcess > 0) {
        const note = document.createElement("span");
        note.className = "filter-note";
        note.textContent = fmt(getCopy("filters.duplicateNotice"), { n: duplicateExcess });
        els["active-filters"].appendChild(note);
      }
    }
  }

  function displayView(scroll) {
    $all("[data-view]").forEach(function (section) {
      section.hidden = section.getAttribute("data-view") !== state.view;
    });
    els["filter-dock"].hidden = !(state.view === "explore" || state.view === "visualize");
    $all(".site-nav a").forEach(function (link) {
      const active = link.getAttribute("data-view-link") === state.view;
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    updateDocumentTitle();
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigate(view, options) {
    if (!VIEWS.includes(view)) return;
    const opts = options || {};
    closeDrawer({ sync: false, restore: false });
    state.view = view;
    if (opts.q != null) state.q = String(opts.q);
    state.entry = null;
    displayView(true);
    if (opts.q != null) {
      state.page = 1;
      renderFilterControls();
      renderLinkedViews();
    }
    syncURL(true);
  }

  function renderHome() {
    if (!allRows.length) return;
    const stats = statsFor(allRows);
    const statValues = $all(".stat-strip strong");
    if (statValues.length === 4) {
      statValues[0].textContent = formatNumber(allRows.length);
      statValues[1].textContent = formatNumber(new Set(allRows.map(function (row) { return row.key_term; })).size);
      statValues[2].textContent = formatNumber(new Set(allRows.map(function (row) { return row.target_verb; })).size);
      statValues[3].textContent = "5";
    }
    const insights = $all(".insight-list strong");
    if (insights.length >= 3) {
      insights[0].textContent = percent(stats.categoryCounts.direct, stats.total).toFixed(1) + "%";
      insights[1].textContent = (100 - percent(stats.categoryCounts.direct, stats.total)).toFixed(1) + "%";
      const top = stats.nominalCounts[0];
      insights[2].textContent = top ? top[0] + " × " + top[1] : "—";
    }
    const topTerms = stats.nominalCounts.slice(0, 8);
    els["home-term-chips"].innerHTML = topTerms.map(function (item) {
      return '<button class="term-chip" type="button" data-term="' + escapeHTML(item[0]) +
        '" title="' + escapeHTML(extra("filterByTerm")) + '"><em>' + escapeHTML(item[0]) +
        "</em><small>" + formatNumber(item[1]) + "</small></button>";
    }).join("");
  }

  function tableHeaderHTML(columns, sortable) {
    const labels = {
      id: columns.id,
      source: columns.source,
      target: columns.target,
      nominal: columns.nominal,
      verb: columns.verb,
      category: columns.category,
      checked: columns.checked,
      duplicate: columns.status
    };
    const widths = [72, 286, 228, 112, 84, 128, 76, 86];
    const cols = widths.map(function (width) {
      return '<col style="width:' + width + 'px">';
    }).join("");
    const cells = SORT_KEYS.map(function (key, index) {
      const active = state.sort.key === key;
      const marker = active ? (state.sort.dir === "asc" ? " ↑" : " ↓") : "";
      const ariaSort = active ? ' aria-sort="' + (state.sort.dir === "asc" ? "ascending" : "descending") + '"' : "";
      if (!sortable) return "<th scope=\"col\">" + escapeHTML(labels[key]) + "</th>";
      return "<th scope=\"col\"" + ariaSort + '><button type="button" data-sort="' + key + '">' +
        escapeHTML(labels[key]) + '<span class="sort-indicator" aria-hidden="true">' + marker + "</span></button></th>";
    }).join("");
    return "<colgroup>" + cols + "</colgroup><thead><tr>" + cells + "</tr></thead>";
  }

  function tableRowsHTML(rows) {
    if (!rows.length) {
      return '<tbody><tr><td class="empty-state" colspan="8">' + escapeHTML(getCopy("filters.noResults")) + "</td></tr></tbody>";
    }
    const body = rows.map(function (row) {
      const checked = row.human_checked === "yes" ? getCopy("explore.checkedYes") : getCopy("explore.checkedNo");
      return '<tr data-entry-id="' + row.id + '" tabindex="0" aria-label="' +
        escapeHTML(getCopy("explore.openEntry") + " " + row.id) + '">' +
        '<td class="cell-id">' + escapeHTML(row.id) + "</td>" +
        '<td class="cell-source" lang="en">' + escapeHTML(row.source_text) + "</td>" +
        '<td class="cell-target" lang="zh-Hans">' + escapeHTML(row.target_text) + "</td>" +
        '<td class="cell-term" lang="en">' + escapeHTML(row.key_term) + "</td>" +
        '<td class="cell-verb" lang="zh-Hans">' + escapeHTML(row.target_verb) + "</td>" +
        '<td class="cell-cat"><span class="category-dot" style="--cat-color:' + categoryColor(row.category) + '"></span>' +
        escapeHTML(categoryShort(row.category)) + "</td>" +
        '<td class="cell-check"><span class="check-badge ' + (row.human_checked === "yes" ? "yes" : "no") + '">' +
        escapeHTML(checked) + "</span></td>" +
        '<td class="cell-status">' + (row.duplicate
          ? '<span class="check-badge duplicate">' + escapeHTML(getCopy("explore.duplicate")) + "</span>"
          : "—") + "</td></tr>";
    }).join("");
    return "<tbody>" + body + "</tbody>";
  }

  function renderTable(rows) {
    const ordered = sortRows(rows);
    const pages = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
    state.page = Math.min(Math.max(1, state.page), pages);
    const start = ordered.length ? (state.page - 1) * PAGE_SIZE : 0;
    const pageRows = ordered.slice(start, start + PAGE_SIZE);
    els["browse-table"].innerHTML = tableHeaderHTML(getCopy("explore.columns"), true) + tableRowsHTML(pageRows);
    els["table-view-count"].textContent = fmt(getCopy("viz.showing"), {
      n: formatNumber(ordered.length),
      total: formatNumber(ordered.length)
    });
    els["table-range"].textContent = fmt(getCopy("explore.range"), {
      start: ordered.length ? formatNumber(start + 1) : "0",
      end: formatNumber(start + pageRows.length),
      total: formatNumber(ordered.length)
    });
    els["page-label"].textContent = fmt(getCopy("explore.page"), { page: state.page, pages: pages });
    els["page-prev"].disabled = state.page <= 1;
    els["page-next"].disabled = state.page >= pages;
    return ordered;
  }

  function renderMiniTable(rows) {
    const ordered = sortRows(rows).slice(0, 8);
    els["mini-table"].innerHTML = tableHeaderHTML(getCopy("explore.columns"), false) + tableRowsHTML(ordered);
  }

  function renderExploreSummary(rows) {
    const stats = statsFor(rows);
    const pills = [
      '<span class="summary-pill"><strong>' + formatNumber(stats.total) + "</strong> " + escapeHTML(extra(stats.total === 1 ? "entrySingular" : "entries")) + "</span>",
      '<span class="summary-pill"><strong>' + formatNumber(stats.unique) + "</strong> " + escapeHTML(extra(stats.unique === 1 ? "uniquePairSingular" : "uniquePairs")) + "</span>",
      '<span class="summary-pill"><strong>' + formatNumber(stats.checked) + "</strong> " + escapeHTML(extra("checkedEntries")) + "</span>"
    ];
    CATEGORY_KEYS.forEach(function (key) {
      if (!stats.categoryCounts[key]) return;
      pills.push('<button type="button" class="summary-pill summary-filter" data-cat-filter="' + key +
        '" title="' + escapeHTML(extra("filterByCategory")) + '"><span class="category-dot" style="--cat-color:' +
        categoryColor(key) + '"></span>' + escapeHTML(categoryShort(key)) + " <strong>" +
        formatNumber(stats.categoryCounts[key]) + "</strong></button>");
    });
    els["explore-summary"].innerHTML = pills.join("");
  }

  function makeSVG(tag, attrs, text) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (attrs[key] != null) node.setAttribute(key, attrs[key]);
      });
    }
    if (text != null) node.textContent = text;
    return node;
  }

  function makeSvgRoot(box, width, height, label) {
    const svg = makeSVG("svg", {
      viewBox: "0 0 " + width + " " + height,
      role: "img",
      "aria-label": label,
      preserveAspectRatio: "xMidYMid meet"
    });
    box.appendChild(svg);
    return svg;
  }

  function activateNode(node, handler) {
    node.setAttribute("tabindex", "0");
    node.setAttribute("role", "button");
    node.classList.add("clickable");
    node.addEventListener("click", handler);
    node.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handler(event);
      }
    });
  }

  function chartEmpty(box, message) {
    box.innerHTML = '<div class="chart-empty">' + escapeHTML(message) + "</div>";
  }

  function appendLegend(box, rows) {
    if (!rows.length) return;
    const counts = countBy(rows, "category");
    const legend = document.createElement("div");
    legend.className = "chart-legend";
    CATEGORY_KEYS.forEach(function (key) {
      if (!counts.get(key)) return;
      const item = document.createElement("span");
      item.className = "legend-item";
      const dot = document.createElement("i");
      dot.className = "legend-swatch";
      dot.style.background = categoryColor(key);
      item.appendChild(dot);
      item.appendChild(document.createTextNode(categoryShort(key) + " " + counts.get(key)));
      legend.appendChild(item);
    });
    box.appendChild(legend);
  }

  function renderSankey(rows) {
    const box = els["sankey-chart"];
    box.innerHTML = "";
    if (!rows.length) return chartEmpty(box, getCopy("viz.sankey.empty"));
    const nounCounts = Array.from(countBy(rows, "key_term").entries()).sort(function (a, b) {
      return b[1] - a[1] || a[0].localeCompare(b[0]);
    }).slice(0, state.chart.sankeyTop);
    if (!nounCounts.length) return chartEmpty(box, getCopy("viz.sankey.empty"));
    const nouns = nounCounts.map(function (item) { return item[0]; });
    const nounSet = new Set(nouns);
    const nounRows = rows.filter(function (row) { return nounSet.has(row.key_term); });
    const verbCounts = Array.from(countBy(nounRows, "target_verb").entries()).sort(function (a, b) {
      return b[1] - a[1] || a[0].localeCompare(b[0]);
    }).slice(0, state.chart.sankeyVerbs);
    const verbs = verbCounts.map(function (item) { return item[0]; });
    const verbSet = new Set(verbs);
    const flowMap = new Map();
    nounRows.forEach(function (row) {
      if (!verbSet.has(row.target_verb)) return;
      const key = row.key_term + "\u0000" + row.target_verb;
      if (!flowMap.has(key)) flowMap.set(key, { noun: row.key_term, verb: row.target_verb, count: 0, cats: {} });
      const flow = flowMap.get(key);
      flow.count += 1;
      flow.cats[row.category] = (flow.cats[row.category] || 0) + 1;
    });
    const links = Array.from(flowMap.values()).filter(function (link) {
      return link.count >= state.chart.sankeyMin;
    }).map(function (link) {
      const dominant = Object.entries(link.cats).sort(function (a, b) { return b[1] - a[1]; })[0];
      link.category = dominant ? dominant[0] : "direct";
      return link;
    });
    if (!links.length) return chartEmpty(box, getCopy("viz.sankey.empty"));

    const activeNouns = nouns.filter(function (noun) {
      return links.some(function (link) { return link.noun === noun; });
    });
    const activeVerbs = verbs.filter(function (verb) {
      return links.some(function (link) { return link.verb === verb; });
    });
    const width = 1000;
    const height = 500;
    const top = 62;
    const bottom = 22;
    const gap = Math.max(7, Math.min(13, 120 / Math.max(activeNouns.length, activeVerbs.length)));
    const sourceX = 300;
    const targetX = 700;
    const sourceTotals = new Map();
    const targetTotals = new Map();
    links.forEach(function (link) {
      sourceTotals.set(link.noun, (sourceTotals.get(link.noun) || 0) + link.count);
      targetTotals.set(link.verb, (targetTotals.get(link.verb) || 0) + link.count);
    });
    const sourceSum = Array.from(sourceTotals.values()).reduce(function (sum, value) { return sum + value; }, 0);
    const targetSum = Array.from(targetTotals.values()).reduce(function (sum, value) { return sum + value; }, 0);
    const sourceScale = (height - top - bottom - gap * Math.max(0, activeNouns.length - 1)) / Math.max(1, sourceSum);
    const targetScale = (height - top - bottom - gap * Math.max(0, activeVerbs.length - 1)) / Math.max(1, targetSum);
    const sourcePositions = new Map();
    let sourceY = top;
    activeNouns.forEach(function (noun) {
      const count = sourceTotals.get(noun) || 0;
      const h = count * sourceScale;
      sourcePositions.set(noun, { y: sourceY, h: h, count: count });
      sourceY += h + gap;
    });
    const targetPositions = new Map();
    let targetY = top;
    activeVerbs.forEach(function (verb) {
      const count = targetTotals.get(verb) || 0;
      const h = count * targetScale;
      targetPositions.set(verb, { y: targetY, h: h, count: count });
      targetY += h + gap;
    });
    const sourceOffsets = new Map();
    activeNouns.forEach(function (noun) {
      sourceOffsets.set(noun, sourcePositions.get(noun).y);
    });
    const targetOffsets = new Map();
    activeVerbs.forEach(function (verb) {
      targetOffsets.set(verb, targetPositions.get(verb).y);
    });
    links.sort(function (a, b) {
      return nouns.indexOf(a.noun) - nouns.indexOf(b.noun) || b.count - a.count;
    });
    const svg = makeSvgRoot(box, width, height, getCopy("viz.sankey.title"));
    svg.appendChild(makeSVG("text", { x: sourceX, y: 25, "text-anchor": "end", class: "svg-label small" }, extra("nounColumn")));
    svg.appendChild(makeSVG("text", { x: targetX, y: 25, class: "svg-label small" }, extra("verbColumn")));
    links.forEach(function (link) {
      const sy = sourceOffsets.get(link.noun);
      const ty = targetOffsets.get(link.verb);
      const thS = Math.max(1.2, link.count * sourceScale);
      const thT = Math.max(1.2, link.count * targetScale);
      const x1 = sourceX + 8;
      const x2 = targetX - 8;
      const curve = (x1 + x2) / 2;
      const path = makeSVG("path", {
        d: "M " + x1 + " " + sy + " C " + curve + " " + sy + " " + curve + " " + ty + " " + x2 + " " + ty +
          " L " + x2 + " " + (ty + thT) + " C " + curve + " " + (ty + thT) + " " + curve + " " + (sy + thS) + " " + x1 + " " + (sy + thS) + " Z",
        fill: categoryColor(link.category),
        opacity: "0.34",
        class: "svg-link"
      });
      const title = makeSVG("title", null, link.noun + " → " + link.verb + " · " + link.count);
      path.appendChild(title);
      svg.appendChild(path);
      sourceOffsets.set(link.noun, sy + thS);
      targetOffsets.set(link.verb, ty + thT);
    });
    activeNouns.forEach(function (noun) {
      const position = sourcePositions.get(noun);
      const group = makeSVG("g");
      const rect = makeSVG("rect", {
        x: sourceX - 2,
        y: position.y,
        width: 10,
        height: Math.max(3, position.h),
        rx: 4,
        class: "svg-node-source"
      });
      const label = makeSVG("text", {
        x: sourceX - 17,
        y: position.y + position.h / 2 + 4,
        "text-anchor": "end",
        class: "svg-label"
      }, truncate(noun, 23) + " · " + position.count);
      group.appendChild(rect);
      group.appendChild(label);
      activateNode(group, function () { applyTerm(noun); });
      const title = makeSVG("title", null, fmt(extra("filterByTerm"), {}) + ": " + noun);
      group.appendChild(title);
      svg.appendChild(group);
    });
    activeVerbs.forEach(function (verb) {
      const position = targetPositions.get(verb);
      const group = makeSVG("g");
      const rect = makeSVG("rect", {
        x: targetX - 8,
        y: position.y,
        width: 10,
        height: Math.max(3, position.h),
        rx: 4,
        class: "svg-node-target"
      });
      const label = makeSVG("text", {
        x: targetX + 17,
        y: position.y + position.h / 2 + 4,
        class: "svg-label"
      }, truncate(verb, 18) + " · " + position.count);
      group.appendChild(rect);
      group.appendChild(label);
      activateNode(group, function () { applyTerm(verb); });
      svg.appendChild(group);
    });
    svg.appendChild(makeSVG("text", {
      x: 16,
      y: height - 8,
      class: "svg-label small"
    }, extra("flowLegend")));
    const legendRows = [];
    links.forEach(function (link) {
      for (let index = 0; index < link.count; index += 1) legendRows.push({ category: link.category });
    });
    appendLegend(box, legendRows);
    const visibleEntries = links.reduce(function (sum, link) { return sum + link.count; }, 0);
    const note = document.createElement("p");
    note.className = "chart-note";
    note.textContent = fmt(extra("sankeyShown"), { n: visibleEntries, total: rows.length });
    box.appendChild(note);
  }

  function renderTreemap(rows) {
    const box = els["treemap-chart"];
    box.innerHTML = "";
    if (!rows.length) return chartEmpty(box, getCopy("viz.treemap.empty"));
    const metric = state.chart.treemapMetric;
    const groups = CATEGORY_KEYS.map(function (key) {
      const subset = rows.filter(function (row) { return row.category === key; });
      if (!subset.length) return null;
      const nouns = Array.from(countBy(subset, "key_term").entries()).map(function (item) {
        const termRows = subset.filter(function (row) { return row.key_term === item[0]; });
        return {
          term: item[0],
          count: item[1],
          variety: new Set(termRows.map(function (row) { return row.target_verb; })).size
        };
      });
      nouns.sort(function (a, b) {
        return (metric === "count" ? b.count - a.count : b.variety - a.variety) || a.term.localeCompare(b.term);
      });
      const top = nouns.slice(0, state.chart.treemapTerms);
      const rest = nouns.slice(state.chart.treemapTerms);
      if (rest.length) {
        const terms = new Set(rest.map(function (item) { return item.term; }));
        const restRows = subset.filter(function (row) { return terms.has(row.key_term); });
        top.push({
          term: null,
          count: restRows.length,
          variety: new Set(restRows.map(function (row) { return row.target_verb; })).size,
          other: true
        });
      }
      top.forEach(function (item) {
        item.metric = metric === "count" ? item.count : item.variety;
      });
      return {
        key: key,
        rows: subset,
        items: top.filter(function (item) { return item.metric > 0; }),
        metric: top.reduce(function (sum, item) { return sum + item.metric; }, 0)
      };
    }).filter(Boolean);
    if (!groups.length) return chartEmpty(box, getCopy("viz.treemap.empty"));
    const width = 820;
    const height = 560;
    const top = 38;
    const left = 10;
    const right = 10;
    const bottom = 8;
    const bodyHeight = height - top - bottom;
    const weights = groups.map(function (group) { return Math.sqrt(Math.max(1, group.metric)); });
    const weightSum = weights.reduce(function (sum, value) { return sum + value; }, 0);
    const svg = makeSvgRoot(box, width, height, getCopy("viz.treemap.title"));
    svg.appendChild(makeSVG("text", { x: left, y: 22, class: "svg-label small" }, extra("resizeNote")));
    let y = top;
    groups.forEach(function (group, groupIndex) {
      const bandHeight = (weights[groupIndex] / weightSum) * bodyHeight;
      const color = categoryColor(group.key);
      const bg = makeSVG("rect", {
        x: left,
        y: y,
        width: width - left - right,
        height: Math.max(12, bandHeight - 5),
        rx: 8,
        fill: color,
        opacity: "0.08",
        stroke: color,
        "stroke-opacity": "0.22"
      });
      bg.classList.add("clickable");
      const title = makeSVG("title", null, categoryLabel(group.key) + " · " + group.rows.length);
      bg.appendChild(title);
      bg.addEventListener("click", function () { applyCategory(group.key); });
      bg.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          applyCategory(group.key);
        }
      });
      bg.setAttribute("tabindex", "0");
      bg.setAttribute("role", "button");
      svg.appendChild(bg);
      svg.appendChild(makeSVG("text", {
        x: left + 10,
        y: y + 15,
        class: "svg-label",
        fill: color,
        "font-weight": "750",
        "pointer-events": "none"
      }, categoryShort(group.key) + " · " + group.rows.length));
      const contentX = left + 5;
      const contentY = y + 20;
      const contentWidth = width - left - right - 10;
      const contentHeight = Math.max(2, bandHeight - 27);
      let itemX = contentX;
      const totalMetric = group.items.reduce(function (sum, item) { return sum + item.metric; }, 0) || 1;
      group.items.forEach(function (item, index) {
        const itemWidth = (item.metric / totalMetric) * contentWidth;
        const cellColor = color;
        const cell = makeSVG("rect", {
          x: itemX + 1,
          y: contentY,
          width: Math.max(1, itemWidth - 2),
          height: contentHeight,
          rx: 4,
          fill: cellColor,
          opacity: String(0.20 + (index % 4) * 0.09),
          stroke: "rgba(255,253,248,0.55)",
          "stroke-width": "0.8"
        });
        cell.classList.add("clickable");
        const cellTitle = makeSVG("title", null,
          (item.other ? extra("other") : item.term) + " · " + item.count + " " + extra("entries") +
          " · " + item.variety + " " + extra("verbs"));
        cell.appendChild(cellTitle);
        cell.addEventListener("click", function (event) {
          event.stopPropagation();
          if (!item.other) applyTerm(item.term);
          else applyCategory(group.key);
        });
        cell.setAttribute("tabindex", "0");
        cell.setAttribute("role", "button");
        cell.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!item.other) applyTerm(item.term);
            else applyCategory(group.key);
          }
        });
        svg.appendChild(cell);
        if (itemWidth > 50 && contentHeight > 26) {
          const maxChars = Math.max(2, Math.floor((itemWidth - 10) / 6.4));
          const labelText = item.other ? extra("other") : item.term;
          const label = makeSVG("text", {
            x: itemX + 6,
            y: contentY + 16,
            class: "svg-label",
            "pointer-events": "none"
          }, truncate(labelText, maxChars));
          svg.appendChild(label);
          if (contentHeight > 42) {
            svg.appendChild(makeSVG("text", {
              x: itemX + 6,
              y: contentY + 30,
              class: "svg-label small",
              "pointer-events": "none"
            }, item.metric + " " + (metric === "count" ? extra("entries") : extra("verbs"))));
          }
        }
        itemX += itemWidth;
      });
      y += bandHeight;
    });
  }

  function logTicks(maxValue) {
    const candidates = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    return candidates.filter(function (value) { return value <= maxValue; });
  }

  function linearTicks(maxValue) {
    if (maxValue <= 0) return [0];
    const rawStep = maxValue / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalized = rawStep / magnitude;
    const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;
    const ticks = [];
    for (let value = 0; value <= maxValue + step * 0.1; value += step) ticks.push(Math.round(value));
    return ticks;
  }

  function renderScatter(rows) {
    const box = els["scatter-chart"];
    box.innerHTML = "";
    const r = pearson(rows);
    els["scatter-correlation"].textContent = r == null ? "—" : fmt(getCopy("viz.scatter.correlation"), { r: r.toFixed(2) });
    if (!rows.length) return chartEmpty(box, getCopy("viz.scatter.empty"));
    const width = 960;
    const height = 430;
    const margin = { top: 20, right: 22, bottom: 56, left: 62 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const log = state.chart.scatterLog;
    const xValues = rows.map(function (row) { return row.english_chars; });
    const yValues = rows.map(function (row) { return row.chinese_chars; });
    const xMax = Math.max.apply(null, xValues) * 1.05;
    const yMax = Math.max.apply(null, yValues) * 1.08;
    const xMin = log ? 1 : 0;
    const yMin = log ? 1 : 0;
    const transformX = function (value) {
      return log ? Math.log10(Math.max(1, value)) : value;
    };
    const transformY = function (value) {
      return log ? Math.log10(Math.max(1, value)) : value;
    };
    const x0 = transformX(xMin);
    const x1 = transformX(xMax);
    const y0 = transformY(yMin);
    const y1 = transformY(yMax);
    const sx = function (value) {
      return margin.left + ((transformX(value) - x0) / (x1 - x0 || 1)) * plotWidth;
    };
    const sy = function (value) {
      return margin.top + plotHeight - ((transformY(value) - y0) / (y1 - y0 || 1)) * plotHeight;
    };
    const svg = makeSvgRoot(box, width, height, getCopy("viz.scatter.title"));
    const xTicks = log ? logTicks(xMax) : linearTicks(xMax);
    const yTicks = log ? logTicks(yMax) : linearTicks(yMax);
    xTicks.forEach(function (tick) {
      const x = sx(tick);
      svg.appendChild(makeSVG("line", {
        x1: x, x2: x, y1: margin.top, y2: margin.top + plotHeight, class: "svg-grid"
      }));
      svg.appendChild(makeSVG("text", {
        x: x, y: height - 26, "text-anchor": "middle", class: "svg-label small"
      }, tick));
    });
    yTicks.forEach(function (tick) {
      const y = sy(tick);
      svg.appendChild(makeSVG("line", {
        x1: margin.left, x2: margin.left + plotWidth, y1: y, y2: y, class: "svg-grid"
      }));
      svg.appendChild(makeSVG("text", {
        x: margin.left - 12, y: y + 3, "text-anchor": "end", class: "svg-label small"
      }, tick));
    });
    svg.appendChild(makeSVG("line", {
      x1: margin.left, x2: margin.left + plotWidth, y1: margin.top + plotHeight, y2: margin.top + plotHeight, class: "svg-axis"
    }));
    svg.appendChild(makeSVG("line", {
      x1: margin.left, x2: margin.left, y1: margin.top, y2: margin.top + plotHeight, class: "svg-axis"
    }));
    svg.appendChild(makeSVG("text", {
      x: margin.left + plotWidth / 2, y: height - 6, "text-anchor": "middle", class: "svg-label small"
    }, getCopy("viz.scatter.x")));
    const axisY = makeSVG("text", {
      x: 15, y: margin.top + plotHeight / 2, "text-anchor": "middle", class: "svg-label small",
      transform: "rotate(-90 15 " + (margin.top + plotHeight / 2) + ")"
    }, getCopy("viz.scatter.y"));
    svg.appendChild(axisY);
    rows.forEach(function (row) {
      const hash = function (seed) {
        const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return value - Math.floor(value);
      };
      const jitterX = (hash(row.id) - 0.5) * 4;
      const jitterY = (hash(row.id + 91) - 0.5) * 4;
      const circle = makeSVG("circle", {
        cx: sx(row.english_chars) + jitterX,
        cy: sy(row.chinese_chars) + jitterY,
        r: 4.2,
        fill: categoryColor(row.category),
        opacity: "0.66",
        stroke: "#fffdf8",
        "stroke-width": "0.8",
        class: "scatter-point"
      });
      circle.setAttribute("data-entry-id", row.id);
      circle.setAttribute("tabindex", "0");
      circle.setAttribute("role", "button");
      circle.setAttribute("aria-label", row.id + " · " + row.key_term + " → " + row.target_verb);
      const title = makeSVG("title", null, row.id + " · " + row.key_term + " → " + row.target_verb + " · " + row.english_chars + "/" + row.chinese_chars);
      circle.appendChild(title);
      const inspectPoint = function () {
        if (state.q !== row.key_term) {
          state.q = row.key_term;
          state.page = 1;
          renderFilterControls();
          renderLinkedViews();
          syncURL(false);
        }
        openEntry(row.id, true);
      };
      circle.addEventListener("click", inspectPoint);
      circle.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inspectPoint();
        }
      });
      svg.appendChild(circle);
    });
    appendLegend(box, rows);
  }

  function clippedEnglish(row, width) {
    const text = row.source_text;
    const term = row.key_term;
    const index = text.toLocaleLowerCase().indexOf(term.toLocaleLowerCase());
    if (index < 0) return escapeHTML(clippedText(text, width * 2));
    const match = text.slice(index, index + term.length);
    const beforeWords = text.slice(0, index).trimEnd().split(/\s+/).filter(Boolean);
    const afterWords = text.slice(index + term.length).trimStart().split(/\s+/).filter(Boolean);
    const leftWords = beforeWords.slice(-width);
    const rightWords = afterWords.slice(0, width);
    const left = (beforeWords.length > width ? "… " : "") + leftWords.join(" ");
    const right = rightWords.join(" ") + (afterWords.length > width ? " …" : "");
    return '<span class="left">' + escapeHTML(left ? left + " " : "") + "</span>" +
      '<button type="button" class="term-link" data-term="' + escapeHTML(term) + '">' + escapeHTML(match) + "</button>" +
      '<span class="right">' + escapeHTML(right ? " " + right : "") + "</span>";
  }

  function clippedChinese(row, width) {
    const text = row.target_text;
    const verb = row.target_verb;
    const index = text.indexOf(verb);
    if (index < 0) return escapeHTML(clippedText(text, width * 2));
    const start = Math.max(0, index - width);
    const end = Math.min(text.length, index + verb.length + width);
    return '<span class="left">' + escapeHTML((start > 0 ? "…" : "") + text.slice(start, index)) + "</span>" +
      '<button type="button" class="term-link verb" data-term="' + escapeHTML(verb) + '">' + escapeHTML(verb) + "</button>" +
      '<span class="right">' + escapeHTML(text.slice(index + verb.length, end) + (end < text.length ? "…" : "")) + "</span>";
  }

  function clippedText(text, limit) {
    return text.length <= limit ? text : text.slice(0, limit).trimEnd() + "…";
  }

  function renderKWIC(rows) {
    const box = els["kwic-chart"];
    box.innerHTML = "";
    if (!rows.length) return chartEmpty(box, getCopy("viz.kwic.empty"));
    const width = state.chart.kwicWindow;
    const sortMode = state.chart.kwicSort;
    const indexed = rows.map(function (row) {
      const index = row.source_text.toLocaleLowerCase().indexOf(row.key_term.toLocaleLowerCase());
      return {
        row: row,
        left: index >= 0 ? row.source_text.slice(0, index).trim() : row.source_text,
        right: index >= 0 ? row.source_text.slice(index + row.key_term.length).trim() : ""
      };
    });
    indexed.sort(function (a, b) {
      if (sortMode === "left") return collator().compare(a.left, b.left) || a.row.id - b.row.id;
      if (sortMode === "right") return collator().compare(a.right, b.right) || a.row.id - b.row.id;
      return a.row.id - b.row.id;
    });
    const visible = indexed.slice(0, 40);
    visible.forEach(function (item) {
      const row = item.row;
      const div = document.createElement("div");
      div.className = "kwic-row";
      div.innerHTML = '<div class="kwic-text" lang="en">' + clippedEnglish(row, width) + "</div>" +
        '<div class="kwic-text" lang="zh-Hans">' + clippedChinese(row, Math.max(2, Math.ceil(width / 2))) + "</div>" +
        '<div class="kwic-meta"><span>ID ' + escapeHTML(row.id) + "</span><span><i class=\"category-dot\" style=\"--cat-color:" +
        categoryColor(row.category) + "\"></i>" + escapeHTML(categoryShort(row.category)) + "</span></div>";
      box.appendChild(div);
    });
    if (rows.length > visible.length) {
      const more = document.createElement("div");
      more.className = "kwic-more";
      more.innerHTML = '<span class="muted">' + escapeHTML(fmt(getCopy("viz.showing"), {
        n: visible.length,
        total: rows.length
      })) + "</span>";
      box.appendChild(more);
    }
  }

  function renderCharts(rows) {
    renderSankey(rows);
    renderTreemap(rows);
    renderScatter(rows);
    renderKWIC(rows);
  }

  function renderLinkedViews() {
    renderActiveFilters();
    const rows = currentRows();
    renderExploreSummary(rows);
    renderTable(rows);
    renderMiniTable(rows);
    renderCharts(rows);
  }

  function figureBars(items, useCategoryColor) {
    const maxValue = Math.max.apply(null, items.map(function (item) { return item.value; }).concat([1]));
    return items.map(function (item) {
      const color = useCategoryColor ? categoryColor(item.key) : "#e76f51";
      return '<div class="bar-row"><span>' + escapeHTML(item.label) + '</span><div class="bar-track"><div class="bar-fill" style="--bar:' +
        (percent(item.value, maxValue) * 100).toFixed(1) + "%;--cat-color:" + color + '"></div></div><span class="bar-value">' +
        formatNumber(item.value) + "</span></div>";
    }).join("");
  }

  function reportFigureHTML() {
    const stats = statsFor(allRows);
    const categoryItems = CATEGORY_KEYS.map(function (key) {
      return { key: key, label: categoryShort(key), value: stats.categoryCounts[key] || 0 };
    });
    const nominalItems = stats.nominalCounts.slice(0, 8).map(function (item) {
      return { key: null, label: item[0], value: item[1] };
    });
    return '<div class="report-figure-grid">' +
      '<figure class="report-figure"><h3>' + escapeHTML(getCopy("report.figureCategories")) + "</h3>" +
      '<div class="bar-list">' + figureBars(categoryItems, true) + "</div><figcaption>" +
      escapeHTML(getCopy("report.figureCaption")) + "</figcaption></figure>" +
      '<figure class="report-figure"><h3>' + escapeHTML(getCopy("report.figureNominals")) + "</h3>" +
      '<div class="bar-list">' + figureBars(nominalItems, false) + "</div><figcaption>" +
      escapeHTML(getCopy("report.figureCaption")) + "</figcaption></figure></div>" +
      '<p class="figure-link"><a class="text-link" href="?view=visualize" data-view-link="visualize">' +
      escapeHTML(getCopy("report.figureOpen")) + "</a></p>";
  }

  function reportMethodLogHTML() {
    const copy = getCopy("codebook");
    return '<section class="report-log"><h3>' + escapeHTML(copy.logTitle) + "</h3><ul>" +
      copy.log.map(function (item) { return "<li>" + escapeHTML(item) + "</li>"; }).join("") +
      "</ul></section>";
  }

  function reportTemplateValues() {
    const stats = statsFor(allRows);
    const direct = stats.categoryCounts.direct || 0;
    const nonDirect = stats.total - direct;
    return {
      direct: formatNumber(direct),
      entries: formatNumber(stats.total),
      directPct: percent(direct, stats.total).toFixed(1),
      nonDirect: formatNumber(nonDirect),
      nonDirectPct: percent(nonDirect, stats.total).toFixed(1),
      top10Pct: stats.topTenPct.toFixed(1),
      top20Pct: stats.topTwentyPct.toFixed(1),
      modulation: formatNumber(stats.categoryCounts.modulation || 0),
      specification: formatNumber(stats.categoryCounts.specification || 0),
      stative: formatNumber(stats.categoryCounts.stative || 0),
      weak: formatNumber(stats.categoryCounts.weak || 0),
      avgEn: stats.avgEn.toFixed(1),
      avgZh: stats.avgZh.toFixed(1),
      ratio: stats.ratio.toFixed(2),
      r: stats.r == null ? "—" : stats.r.toFixed(2),
      weakEn: stats.categoryMeans.weak.en.toFixed(1),
      weakZh: stats.categoryMeans.weak.zh.toFixed(1),
      directEn: stats.categoryMeans.direct.en.toFixed(1),
      directZh: stats.categoryMeans.direct.zh.toFixed(1)
    };
  }

  function longformHeader(kicker, title, lead, meta) {
    return '<header class="longform-header"><p class="eyebrow">' + escapeHTML(kicker) + "</p><h1>" +
      escapeHTML(title) + '</h1><p class="lead">' + escapeHTML(lead) + "</p>" +
      (meta && meta.length ? '<div class="longform-meta">' + meta.map(function (item) {
        return "<span>" + escapeHTML(item) + "</span>";
      }).join("") + "</div>" : "") + "</header>";
  }

  function renderReport() {
    const copy = getCopy("report");
    const values = reportTemplateValues();
    const toc = '<nav class="toc" aria-label="' + escapeHTML(copy.tocLabel) + '">' + copy.sections.map(function (section) {
      return '<a href="#' + escapeHTML(section.id) + '">' + escapeHTML(section.number + " · " + section.title) + "</a>";
    }).join("") + "</nav>";
    const sections = copy.sections.map(function (section) {
      const content = fmt(section.html, values);
      return '<section class="report-section" id="' + escapeHTML(section.id) + '"><h2><span class="section-number">' +
        escapeHTML(section.number) + "</span><span>" + escapeHTML(section.title) + "</span></h2>" + content +
        (section.id === "method" ? reportFigureHTML() + reportMethodLogHTML() : "") + "</section>";
    }).join("");
    els["report-content"].innerHTML = longformHeader(copy.kicker, copy.title, copy.lead, copy.meta) + toc + sections;
  }

  function exampleHTML(example) {
    if (!example) return "";
    return '<span class="example-pair">' + escapeHTML(example.q) + "</span>" + escapeHTML(example.why);
  }

  function renderCodebook() {
    const copy = getCopy("codebook");
    const stats = statsFor(allRows);
    const intro = '<section class="codebook-intro"><h2><span class="section-number">00</span><span>' +
      escapeHTML(copy.introTitle) + "</span></h2><p>" + escapeHTML(copy.intro) + '</p><h2><span class="section-number">01</span><span>' +
      escapeHTML(copy.decisionTitle) + '</span></h2><div class="decision-order">' + copy.decision.map(function (item) {
        return "<div>" + escapeHTML(item) + "</div>";
      }).join("") + "</div></section>";
    const cards = '<h2 class="codebook-heading"><span class="section-number">02</span><span>' +
      escapeHTML(copy.categoriesTitle) + "</span></h2>" + CATEGORY_KEYS.map(function (key, index) {
        const info = categoryInfo(key);
        const count = stats.categoryCounts[key] || 0;
        return '<section class="category-card" style="--cat-color:' + categoryColor(key) +
          '"><div class="category-card-head"><h3>' + escapeHTML(info.label) +
          '</h3><span class="category-count">' + formatNumber(count) + " · " +
          percent(count, stats.total).toFixed(1) + "%</span></div><dl>" +
          "<dt>" + escapeHTML(copy.categoryFields.definition) + "</dt><dd>" + escapeHTML(info.definition) + "</dd>" +
          "<dt>" + escapeHTML(copy.categoryFields.theory) + "</dt><dd>" + escapeHTML(info.theory) + "</dd>" +
          "<dt>" + escapeHTML(copy.categoryFields.rule) + "</dt><dd>" + escapeHTML(info.rule) + "</dd>" +
          "<dt>" + escapeHTML(copy.categoryFields.positive) + "</dt><dd>" + exampleHTML(info.positive) + "</dd>" +
          "<dt>" + escapeHTML(copy.categoryFields.negative) + "</dt><dd>" + exampleHTML(info.negative) + "</dd>" +
          "<dt>" + escapeHTML(copy.categoryFields.boundary) + "</dt><dd>" + exampleHTML(info.boundary) + "</dd>" +
          "</dl></section>";
      }).join("");
    const log = '<section class="codebook-log"><h3>' + escapeHTML(copy.logTitle) + "</h3><ul>" + copy.log.map(function (item) {
      return "<li>" + escapeHTML(item) + "</li>";
    }).join("") + "</ul></section>";
    const references = '<section class="codebook-intro codebook-references"><h2><span class="section-number">03</span><span>' +
      escapeHTML(copy.referencesTitle) + '</span></h2><ol>' + copy.references.map(function (item) {
        return "<li>" + escapeHTML(item) + "</li>";
      }).join("") + "</ol></section>";
    const dataUse = '<section class="codebook-intro codebook-references"><h2><span class="section-number">04</span><span>' +
      escapeHTML(copy.dataUseTitle) + '</span></h2><p>' + escapeHTML(copy.dataUseText) + "</p></section>";
    els["codebook-content"].innerHTML = longformHeader(copy.kicker, copy.title, copy.lead) + intro + cards + log + references + dataUse;
  }

  function renderAI() {
    const copy = getCopy("ai");
    const stats = statsFor(allRows);
    const inline = '<div class="inline-stats"><div><strong>' + formatNumber(stats.total) + "</strong><span>" +
      escapeHTML(getCopy("home.stat.pairs")) + "</span></div><div><strong>" + formatNumber(stats.unique) +
      "</strong><span>" + escapeHTML(extra("uniquePairs")) + "</span></div><div><strong>" + formatNumber(stats.checked) +
      "</strong><span>" + escapeHTML(extra("checkedEntries")) + "</span></div><div><strong>" +
      formatNumber(new Set(allRows.map(function (row) { return row.key_term; })).size) + "</strong><span>" +
      escapeHTML(getCopy("home.stat.nominals")) + "</span></div></div>";
    const sections = copy.sections.map(function (section, index) {
      return '<section class="ai-section"><h2><span class="section-number">0' + (index + 1) + "</span><span>" +
        escapeHTML(section.title) + "</span></h2>" + section.html + "</section>";
    }).join("");
    els["ai-content"].innerHTML = longformHeader(copy.kicker, copy.title, copy.lead) + inline + sections;
  }

  function renderDrawer(row) {
    const copy = getCopy("drawer");
    const info = categoryInfo(row.category);
    const checked = row.human_checked === "yes" ? copy.yes : copy.no;
    const duplicate = row.duplicate ? copy.repeated : copy.uniquePair;
    els["drawer-content"].innerHTML =
      '<p class="drawer-kicker">' + escapeHTML(fmt(copy.kicker, { id: row.id })) + "</p>" +
      '<h2 class="drawer-title" id="drawer-title" lang="en">' + escapeHTML(row.key_term) + " → " +
      '<span lang="zh-Hans">' + escapeHTML(row.target_verb) + "</span></h2>" +
      '<div class="drawer-pair"><div><span>' + escapeHTML(copy.source) + '</span><p lang="en">' +
      escapeHTML(row.source_text) + '</p></div><div><span>' + escapeHTML(copy.target) +
      '</span><p lang="zh-Hans">' + escapeHTML(row.target_text) + "</p></div></div>" +
      '<dl class="drawer-meta"><dt>' + escapeHTML(copy.sourceId) + "</dt><dd>" + escapeHTML(row.source_id) + "</dd>" +
      "<dt>" + escapeHTML(copy.unit) + "</dt><dd>" + escapeHTML(row.unit) + "</dd>" +
      "<dt>" + escapeHTML(copy.category) + '</dt><dd><span class="category-dot" style="--cat-color:' +
      categoryColor(row.category) + '"></span>' + escapeHTML(info.label) + "</dd>" +
      "<dt>" + escapeHTML(copy.checked) + "</dt><dd>" + escapeHTML(checked) + "</dd>" +
      "<dt>" + escapeHTML(copy.duplicate) + "</dt><dd>" + escapeHTML(duplicate) + "</dd>" +
      "<dt>" + escapeHTML(copy.lengths) + "</dt><dd>" + escapeHTML(fmt(copy.lengthsValue, {
        en: row.english_chars,
        zh: row.chinese_chars
      })) + "</dd></dl>" +
      '<div class="drawer-actions"><button type="button" class="button outline compact" data-term="' +
      escapeHTML(row.key_term) + '">' + escapeHTML(copy.searchNominal) + "</button>" +
      '<button type="button" class="button outline compact" data-term="' + escapeHTML(row.target_verb) + '">' +
      escapeHTML(copy.searchVerb) + "</button>" +
      '<a class="button text compact" href="' + escapeHTML((corpus.metadata && corpus.metadata.source_url) || "https://opus.nlpl.eu/") +
      '" target="_blank" rel="noreferrer">' + escapeHTML(copy.sourceLink) + " ↗</a></div>";
  }

  function openEntry(id, push) {
    const row = allRows.find(function (item) { return item.id === Number(id); });
    if (!row) {
      state.entry = null;
      return;
    }
    lastFocus = document.activeElement;
    state.entry = row.id;
    renderDrawer(row);
    els["entry-drawer"].hidden = false;
    els["drawer-backdrop"].hidden = false;
    document.body.style.overflow = "hidden";
    syncURL(Boolean(push));
    window.setTimeout(function () { els["drawer-close"].focus(); }, 0);
  }

  function closeDrawer(options) {
    const opts = options || {};
    if (els["entry-drawer"].hidden) return;
    els["entry-drawer"].hidden = true;
    els["drawer-backdrop"].hidden = true;
    document.body.style.overflow = "";
    state.entry = null;
    if (opts.sync !== false) syncURL(false);
    if (opts.restore !== false && lastFocus && lastFocus.isConnected) lastFocus.focus();
  }

  function showToast(message) {
    if (!message) return;
    els["toast"].textContent = message;
    els["toast"].hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      els["toast"].hidden = true;
    }, 2600);
  }

  function applyTerm(term) {
    if (!term) return;
    if (!els["entry-drawer"].hidden) closeDrawer({ sync: false, restore: false });
    state.q = String(term);
    state.page = 1;
    state.entry = null;
    const changingView = !(state.view === "explore" || state.view === "visualize");
    if (changingView) state.view = "explore";
    renderFilterControls();
    displayView(changingView);
    renderLinkedViews();
    syncURL(true);
    showToast(fmt(getCopy("status.filtered"), { term: term }));
  }

  function applyCategory(key) {
    if (!key) return;
    if (!els["entry-drawer"].hidden) closeDrawer({ sync: false, restore: false });
    state.cat = state.cat === key ? "" : key;
    state.page = 1;
    state.entry = null;
    renderFilterControls();
    renderLinkedViews();
    syncURL(false);
    showToast(state.cat
      ? fmt(getCopy("status.categoryFiltered"), { category: categoryLabel(state.cat) })
      : getCopy("filters.clear"));
  }

  function mutateFilters(patch, fromInput) {
    Object.keys(patch).forEach(function (key) { state[key] = patch[key]; });
    state.page = 1;
    if (!fromInput) renderFilterControls();
    syncURL(false);
    renderLinkedViews();
  }

  function clearFilters() {
    state.q = "";
    state.cat = "";
    state.checked = "";
    state.unique = false;
    state.page = 1;
    renderFilterControls();
    syncURL(false);
    renderLinkedViews();
  }

  function csvCell(value) {
    const text = String(value == null ? "" : value);
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function exportCSV() {
    const rows = sortRows(currentRows());
    if (!rows.length) {
      showToast(getCopy("filters.noResults"));
      return;
    }
    const header = [
      "id", "source_text", "target_text", "source", "source_id", "category", "human_checked",
      "unit", "key_term", "target_verb", "target_verb_raw", "duplicate", "english_chars", "chinese_chars"
    ];
    const lines = [header.map(csvCell).join(",")];
    rows.forEach(function (row) {
      lines.push([
        row.id,
        row.source_text,
        row.target_text,
        row.source,
        row.source_id,
        row.category,
        row.human_checked,
        row.unit,
        row.key_term,
        row.target_verb,
        row.target_verb_raw,
        row.duplicate ? "yes" : "no",
        row.english_chars,
        row.chinese_chars
      ].map(csvCell).join(","));
    });
    const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "NVAtlas-filtered-" + rows.length + ".csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 500);
    showToast(getCopy("status.copied"));
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      const viewLink = event.target.closest("[data-view-link]");
      if (viewLink && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
        event.preventDefault();
        navigate(viewLink.getAttribute("data-view-link"));
        return;
      }
      const termButton = event.target.closest("[data-term]");
      if (termButton) {
        event.preventDefault();
        applyTerm(termButton.getAttribute("data-term"));
        return;
      }
      const categoryButton = event.target.closest("[data-cat-filter]");
      if (categoryButton) {
        event.preventDefault();
        applyCategory(categoryButton.getAttribute("data-cat-filter"));
        return;
      }
      const removeButton = event.target.closest("[data-remove-filter]");
      if (removeButton) {
        event.preventDefault();
        const key = removeButton.getAttribute("data-remove-filter");
        if (key === "q") mutateFilters({ q: "" });
        else if (key === "cat") mutateFilters({ cat: "" });
        else if (key === "checked") mutateFilters({ checked: "" });
        else if (key === "unique") mutateFilters({ unique: false });
      }
    });

    $all("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        const lang = button.getAttribute("data-lang");
        if (lang === state.lang) return;
        state.lang = lang;
        syncURL(false);
        applyStaticCopy();
        renderFilterControls();
        renderHome();
        renderReport();
        renderCodebook();
        renderAI();
        renderLinkedViews();
        if (state.entry) {
          const row = allRows.find(function (item) { return item.id === state.entry; });
          if (row) renderDrawer(row);
        }
      });
    });

    els["global-search"].addEventListener("input", function (event) {
      state.q = event.target.value.trim();
      state.page = 1;
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () {
        syncURL(false);
        renderLinkedViews();
      }, 120);
    });
    els["global-search"].addEventListener("search", function (event) {
      state.q = event.target.value.trim();
      state.page = 1;
      syncURL(false);
      renderLinkedViews();
    });
    els["category-filter"].addEventListener("change", function (event) {
      mutateFilters({ cat: event.target.value });
    });
    els["checked-filter"].addEventListener("change", function (event) {
      mutateFilters({ checked: event.target.value });
    });
    els["unique-filter"].addEventListener("change", function (event) {
      mutateFilters({ unique: event.target.checked });
    });
    els["clear-filters"].addEventListener("click", clearFilters);
    els["export-csv"].addEventListener("click", exportCSV);
    els["table-export"].addEventListener("click", exportCSV);

    els["browse-table"].addEventListener("click", function (event) {
      const sortButton = event.target.closest("[data-sort]");
      if (sortButton) {
        const key = sortButton.getAttribute("data-sort");
        if (state.sort.key === key) state.sort.dir = state.sort.dir === "asc" ? "desc" : "asc";
        else {
          state.sort.key = key;
          state.sort.dir = "asc";
        }
        state.page = 1;
        renderTable(currentRows());
        renderMiniTable(currentRows());
        syncURL(false);
        return;
      }
      const row = event.target.closest("tr[data-entry-id]");
      if (row) openEntry(Number(row.getAttribute("data-entry-id")), true);
    });
    els["browse-table"].addEventListener("keydown", function (event) {
      const row = event.target.closest("tr[data-entry-id]");
      if (row && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openEntry(Number(row.getAttribute("data-entry-id")), true);
      }
    });
    els["mini-table"].addEventListener("click", function (event) {
      const row = event.target.closest("tr[data-entry-id]");
      if (row) openEntry(Number(row.getAttribute("data-entry-id")), true);
    });
    els["mini-table"].addEventListener("keydown", function (event) {
      const row = event.target.closest("tr[data-entry-id]");
      if (row && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openEntry(Number(row.getAttribute("data-entry-id")), true);
      }
    });
    els["page-prev"].addEventListener("click", function () {
      if (state.page > 1) {
        state.page -= 1;
        renderTable(currentRows());
        syncURL(false);
      }
    });
    els["page-next"].addEventListener("click", function () {
      state.page += 1;
      renderTable(currentRows());
      syncURL(false);
    });

    els["sankey-top"].addEventListener("change", function (event) {
      state.chart.sankeyTop = Number(event.target.value);
      renderCharts(currentRows());
    });
    els["sankey-verbs"].addEventListener("change", function (event) {
      state.chart.sankeyVerbs = Number(event.target.value);
      renderCharts(currentRows());
    });
    els["sankey-min"].addEventListener("change", function (event) {
      state.chart.sankeyMin = Number(event.target.value);
      renderCharts(currentRows());
    });
    els["treemap-terms"].addEventListener("change", function (event) {
      state.chart.treemapTerms = Number(event.target.value);
      renderCharts(currentRows());
    });
    els["treemap-metric"].addEventListener("change", function (event) {
      state.chart.treemapMetric = event.target.value;
      renderCharts(currentRows());
    });
    els["scatter-log"].addEventListener("change", function (event) {
      state.chart.scatterLog = event.target.checked;
      renderCharts(currentRows());
    });
    els["kwic-window"].addEventListener("change", function (event) {
      state.chart.kwicWindow = Number(event.target.value);
      renderCharts(currentRows());
    });
    els["kwic-sort"].addEventListener("change", function (event) {
      state.chart.kwicSort = event.target.value;
      renderCharts(currentRows());
    });
    els["drawer-close"].addEventListener("click", function () { closeDrawer(); });
    els["drawer-backdrop"].addEventListener("click", function () { closeDrawer(); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !els["entry-drawer"].hidden) closeDrawer();
    });
    window.addEventListener("popstate", function () {
      readURL();
      applyStaticCopy();
      renderFilterControls();
      renderHome();
      renderReport();
      renderCodebook();
      renderAI();
      displayView(false);
      renderLinkedViews();
      if (state.entry) openEntry(state.entry, false);
      else closeDrawer({ sync: false, restore: false });
    });
  }

  function validateCorpus(payload) {
    if (!payload || !Array.isArray(payload.entries) || !payload.entries.length) {
      throw new Error("Corpus payload has no entries");
    }
    const required = ["id", "source_text", "target_text", "key_term", "target_verb", "category", "human_checked"];
    payload.entries.forEach(function (row, index) {
      required.forEach(function (key) {
        if (row[key] == null || row[key] === "") throw new Error("Missing " + key + " at row " + index);
      });
      if (!CATEGORY_KEYS.includes(row.category)) throw new Error("Unknown category at entry " + row.id);
      if (!Number.isFinite(Number(row.id))) throw new Error("Non-numeric ID at row " + index);
    });
    return payload;
  }

  async function boot() {
    cacheElements();
    readURL();
    bindEvents();
    applyStaticCopy();
    displayView(false);
    try {
      const response = await fetch("corpus.json", { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      corpus = validateCorpus(await response.json());
      allRows = corpus.entries.slice().sort(function (a, b) { return a.id - b.id; });
      renderFilterControls();
      renderHome();
      renderReport();
      renderCodebook();
      renderAI();
      displayView(false);
      renderLinkedViews();
      els["loading-state"].hidden = true;
      if (state.entry) {
        const row = allRows.find(function (item) { return item.id === state.entry; });
        if (row) openEntry(state.entry, false);
        else state.entry = null;
      }
    } catch (error) {
      console.error(error);
      if (els["loading-state"]) {
        els["loading-state"].classList.add("error");
        els["loading-state"].textContent = getCopy("status.error");
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
