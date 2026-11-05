window.NV_COPY = {
  en: {
    localeName: "English",
    a11y: { skip: "Skip to content" },
    nav: {
      label: "Primary navigation",
      home: "Home",
      explore: "Explore",
      visualize: "Visualize",
      report: "Report",
      codebook: "Codebook",
      ai: "AI use"
    },
    lang: { label: "Language" },
    filters: {
      search: "Search",
      searchPlaceholder: "English, Chinese, nominal, or verb…",
      category: "Shift category",
      allCategories: "All categories",
      checked: "Human checked",
      allChecks: "All entries",
      yes: "Checked",
      no: "Unchecked",
      unique: "Hide repeated pairs",
      clear: "Clear filters",
      export: "Export filtered CSV",
      count: "{{n}} of {{total}} entries",
      active: "Active filters",
      remove: "Remove filter",
      query: "Search: “{{value}}”",
      checkedActive: "Checked: {{value}}",
      uniqueActive: "Repeated pairs hidden",
      duplicateNotice: "{{n}} repeated entries are present; use the toggle to hide them.",
      noResults: "No entries match this view."
    },
    home: {
      eyebrow: "Digital humanities · corpus study",
      titleA: "From nouns",
      titleB: "to verbs.",
      deck: "An interactive atlas of nominal-to-verbal shifts in 500 English–Chinese subtitle pairs.",
      body: "When an abstract English noun meets a compressed subtitle line, Chinese often lets a verb carry the action. NVAtlas makes those shifts searchable, filterable, and visible.",
      ctaExplore: "Enter the atlas",
      ctaReport: "Read the learning report",
      figureLabel: "One nominal, four renderings",
      figureCaption: "The same English nominal fans out into direct, modulated, and context-specific Chinese verbs.",
      stat: { pairs: "sentence pairs", nominals: "English nominals", verbs: "Chinese verb forms", categories: "shift categories" },
      questionEyebrow: "The research question",
      question: "When an English nominal becomes a Chinese verb, where does the shift become direct, modulated, specified, stative, or weak?",
      questionBody: "Subtitles reward compression. The interesting unit is not the dictionary equivalent of a noun, but the verb a translator chose in a particular line.",
      glanceEyebrow: "At a glance",
      insightDirect: "of entries use a direct lexical transposition.",
      insightOther: "move beyond direct equivalence.",
      insightAttention: "is the strongest repeated nominal signal in the corpus.",
      termsEyebrow: "Start with a signal",
      termsTitle: "Follow a word into its translations.",
      termsHint: "Select a term to open a filtered corpus view.",
      provenanceTitle: "Traceable by design",
      provenanceBody: "Every entry keeps its OpenSubtitles sentence ID. The build matched all 500 English strings to OpenSubtitles v2024; 50 entries were source-checked with seed 2026. OpenSubtitles and OPUS are credited in the footer.",
      provenanceLink: "Read the codebook →"
    },
    explore: {
      eyebrow: "Browse the corpus",
      title: "Read the shift line by line.",
      deck: "Search both languages, isolate a category, inspect source IDs, and export exactly the rows in view.",
      tableEyebrow: "Corpus browser",
      tableTitle: "500 traceable sentence pairs",
      export: "Export CSV",
      columns: {
        id: "ID",
        source: "English source",
        target: "Chinese target",
        nominal: "Nominal",
        verb: "Chinese verb",
        category: "Shift",
        checked: "Check",
        status: "Status"
      },
      range: "{{start}}–{{end}} of {{total}}",
      page: "{{page}} / {{pages}}",
      prev: "Previous page",
      next: "Next page",
      checkedYes: "Yes",
      checkedNo: "No",
      duplicate: "Repeated",
      sourceLabel: "OpenSubtitles sentence",
      openEntry: "Open entry"
    },
    viz: {
      eyebrow: "Linked visual analysis",
      title: "See the pattern, then follow it.",
      deck: "Every chart responds to the shared filters. Click a term or category to carry the selection into every other view.",
      sankey: {
        title: "Nominal → verb flow map",
        caption: "How do the most frequent English nominals fan out into Chinese verbs?",
        top: "Top nominals",
        verbs: "Top verbs",
        min: "Minimum link",
        hint: "Click a noun or verb to turn it into a corpus search.",
        empty: "No flows remain after applying these filters."
      },
      treemap: {
        title: "Shift-category treemap",
        caption: "Which English nominal families dominate each kind of shift?",
        terms: "Terms per category",
        metric: "Size by",
        metricCount: "Entries",
        metricVariety: "Verb variety",
        hint: "Click a category band to filter; click a term to search.",
        empty: "No terms remain after applying these filters."
      },
      scatter: {
        title: "Length plot",
        caption: "Do longer English sentences produce proportionally longer Chinese lines, and which shifts occupy the extremes?",
        log: "Log scale",
        x: "English characters",
        y: "Chinese characters",
        correlation: "Pearson r = {{r}}",
        hint: "Click a point to inspect the entry and follow its nominal.",
        empty: "No points remain after applying these filters."
      },
      kwic: {
        title: "Bilingual KWIC",
        caption: "What local wording surrounds each nominal-to-verb shift?",
        window: "Context width",
        sort: "Sort by",
        sortLeft: "Left context",
        sortRight: "Right context",
        sortId: "Entry ID",
        english: "English context",
        chinese: "Chinese context",
        meta: "Entry",
        hint: "The highlighted items are clickable. Context is clipped within the sentence pair.",
        empty: "No examples remain after applying these filters."
      },
      tableEyebrow: "Linked evidence",
      tableTitle: "Rows behind the current view",
      openTable: "Open full data browser →",
      showing: "Showing {{n}} of {{total}} entries",
      noResults: "No linked rows."
    },
    drawer: {
      kicker: "Entry {{id}}",
      source: "English source",
      target: "Chinese target",
      meta: "Metadata",
      sourceId: "Source",
      unit: "Unit",
      category: "Shift category",
      checked: "Human checked",
      duplicate: "Repeated pair",
      lengths: "Lengths",
      lengthsValue: "{{en}} English / {{zh}} Chinese characters",
      searchNominal: "Search this nominal",
      searchVerb: "Search this verb",
      sourceLink: "Open corpus source",
      close: "Close entry",
      yes: "Yes",
      no: "No",
      repeated: "Yes",
      uniquePair: "No"
    },
    status: {
      loading: "Loading the corpus…",
      error: "The corpus could not be loaded. Run the site from a local web server or GitHub Pages.",
      filtered: "Filtered to “{{term}}”.",
      categoryFiltered: "Filtered to {{category}}.",
      copied: "Filtered CSV exported."
    },
    footer: {
      description: "A bilingual corpus explorer built for the 2026R1 Translation Technology in the Age of AI final project.",
      credit: "Data: OpenSubtitles v2024 en–zh_CN via OPUS. Short quotations for research and teaching. <a href=\"https://opus.nlpl.eu/OpenSubtitles/corpus/version/OpenSubtitles\" target=\"_blank\" rel=\"noreferrer\">OPUS ↗</a> · <a href=\"https://www.opensubtitles.org/\" target=\"_blank\" rel=\"noreferrer\">OpenSubtitles ↗</a>",
      download: "Download the cleaned corpus CSV (500 rows)",
      built: "Built as a static GitHub Pages site."
    },
    categories: {
      direct: {
        label: "Direct transposition",
        short: "Direct",
        definition: "The English nominal is rendered by a conventional Chinese verb whose core meaning is recoverable without adding a new event or object.",
        theory: "Catford (1965) on class shifts; Vinay & Darbelnet (1958/1995) on transposition.",
        rule: "Use this when the verb is the expected dictionary-level verbal counterpart and the sentence does not require a more specific action.",
        positive: { q: "ID 168 · question → 问", why: "The nominal and the verb share the same core meaning. The line remains a question in both languages." },
        negative: { q: "ID 4417 · attention → 稍息", why: "“Attention!” is a drill command. The target is a context-specific action, not a general equivalent of attention." },
        boundary: { q: "ID 910 · destruction → 毁灭 vs ID 804 · destruction → 烧毁", why: "毁灭 is the direct verbal counterpart. 烧毁 specifies the kind of destruction and is therefore classified as contextual specification." }
      },
      modulation: {
        label: "Perspectival modulation",
        short: "Modulation",
        definition: "The target remains semantically related to the nominal but shifts the viewpoint, result, aspect, or speech act.",
        theory: "Vinay & Darbelnet (1958/1995) on modulation; Catford (1965) on semantic shifts.",
        rule: "Use this when the verb can be explained as another way of viewing the same situation, rather than a new event or a direct equivalent.",
        positive: { q: "ID 6228 · possession → 收回", why: "The source frames possession as a state; the subtitle frames the same situation as taking something back." },
        negative: { q: "ID 910 · destruction → 毁灭", why: "The target is the ordinary verbal equivalent, with no perspective shift." },
        boundary: { q: "ID 301094 · permission → 批准", why: "“Permission granted” becomes an act of approving. The speech act is foregrounded, so this is modulation rather than a neutral lexical equivalent." }
      },
      specification: {
        label: "Contextual specification",
        short: "Specification",
        definition: "The target spells out an action, object, setting, or speech act that the English nominal alone does not determine.",
        theory: "Blum-Kulka (1986) on explicitation; Baker (1992) on context-sensitive equivalence.",
        rule: "Use this when the Chinese verb adds a concrete action or domain that is inferred from the subtitle situation.",
        positive: { q: "ID 4417 · attention → 稍息", why: "A military command is specified as “stand at ease”; the target does not merely name attention." },
        negative: { q: "ID 35417 · attention → 注意", why: "The verb names the same cognitive action without adding a new object or event." },
        boundary: { q: "ID 166388 · celebration → 结婚", why: "The celebration is identified as a wedding. The added event is specific enough to count as specification." }
      },
      stative: {
        label: "Stative recoding",
        short: "Stative",
        definition: "A state, quality, emotion, or relation is rendered as a Chinese stative or adjectival predicate rather than an action verb.",
        theory: "Halliday & Matthiessen (2014) on grammatical metaphor; Catford (1965) on class shifts.",
        rule: "Use this when the target predicate primarily describes how someone is, feels, resembles, depends on, or values something.",
        positive: { q: "ID 474 · obsession → 痴迷", why: "The noun is recoded as being obsessed; the target describes a state." },
        negative: { q: "ID 168 · question → 问", why: "The target names an action performed by a speaker." },
        boundary: { q: "ID 297501 · pleasure → 满足 vs ID 237598 · pleasure → 享受", why: "满足 is a state of being satisfied; 享受 is a direct verbal counterpart. The first is stative, the second direct." }
      },
      weak: {
        label: "Weak equivalence",
        short: "Weak",
        definition: "The Chinese verb is generic, context-only, or too loosely connected to the nominal to support a clear direct, modulated, or specified relation.",
        theory: "Catford (1965) on translation loss; Baker (1992) on limits of equivalence.",
        rule: "Use this only after the other four categories fail: the nominal cannot be reliably recovered from the verb without the surrounding line.",
        positive: { q: "ID 23964 · performance → 懂得", why: "“A great performance” becomes “really knows how to act.” The relation depends on idiom and inference." },
        negative: { q: "ID 42737 · performance → 表演", why: "The target is the ordinary verbal counterpart of performance." },
        boundary: { q: "ID 82278 · interference → 不会 vs ID 57015 · interference → 干涉", why: "不会 is a context-only negation; 干涉 is a conventional verbal equivalent. Only the first is weak." }
      }
    },
    report: {
      kicker: "Learning report",
      title: "The verb a subtitle chooses.",
      lead: "A study of 500 English–Chinese subtitle pairs, five nominal-to-verbal shift categories, and the small contextual decisions that disappear when a corpus is reduced to word counts.",
      meta: ["2026R1 Translation Technology in the Age of AI", "Individual final project", "5 December 2026"],
      tocLabel: "Sections",
      figureCategories: "Category distribution in the current build",
      figureNominals: "Eight most frequent English nominals",
      figureCaption: "Counts are recomputed from the 500-entry corpus; the interactive views expose the same numbers under any filter.",
      figureOpen: "Open the interactive visual analysis →",
      sections: [
        {
          id: "origin",
          number: "01",
          title: "Origin",
          html: `<p>I started from a practical observation: subtitles rarely preserve the grammatical shape of the source. An English line can turn an event into a noun—<em>her explanation</em>, <em>the celebration</em>, <em>his resignation</em>—while the Chinese line often lets a verb do the work. The shift is small enough to overlook in a bilingual dictionary and consequential enough to change what a character is doing in the scene.</p><p>I chose this topic because it sits between translation studies and corpus linguistics, and because the corpus makes the comparison visible rather than anecdotal. The 500 pairs are short, traceable quotations from OpenSubtitles v2024 en–zh_CN. Each entry records an English nominal and the Chinese verb used in the subtitle line.</p><div class="report-quote">The unit I wanted to study was not “the translation of a noun,” but the moment a translator turns a noun into a verb.</div>`
        },
        {
          id: "background",
          number: "02",
          title: "Background",
          html: `<p>English nominalisation packs information into a compact phrase: <em>the construction of the tower</em>, <em>the destruction of the city</em>, <em>a reputation</em>. Chinese can also nominalise, but subtitle translations often prefer a verbal predicate, especially when the line has to fit a fleeting moment on screen. This is not a mechanical rule. A translator may keep the action explicit, move the viewpoint to a result, add the object implied by the scene, or let the nominal dissolve into context.</p><p>Existing corpus explorers—including the department’s NV Atlas—show how terms connect across a corpus. They are excellent at revealing scale and co-occurrence. What they do not show directly is the grammatical decision inside a single aligned pair: which nominal was moved into a verb, and how far that move departs from a conventional equivalent.</p>`
        },
        {
          id: "gap",
          number: "03",
          title: "Gap",
          html: `<p>The gap is partly technical and partly interpretive. A frequency chart can tell us that <strong>attention</strong> is frequent; it cannot tell us that the same English noun becomes <strong>注意</strong> in one line, <strong>重视</strong> in another, <strong>稍息</strong> in a military command, and <strong>知道</strong> in a context-dependent paraphrase. A word-to-word resource flattens those differences.</p><p>I wanted a small interface where the evidence remains inspectable: the original sentence, the target sentence, the nominal, the verb, the category, and the source ID all stay together. The visualisations should not decorate the data; they should answer questions about it and send the visitor back to the table.</p>`
        },
        {
          id: "questions",
          number: "04",
          title: "Questions",
          html: `<p>Three questions guide the project:</p><ul><li>How often is an English nominal rendered by a Chinese verb that preserves its core meaning?</li><li>Which nominal families travel through the widest range of Chinese verbs, and what does that variety reveal about context?</li><li>Do sentence length and shift type move together, or are the most context-dependent choices hidden in short lines?</li></ul><p>Each question corresponds to a visible control in the atlas: the flow map, the treemap, the length plot, and the bilingual KWIC.</p>`
        },
        {
          id: "method",
          number: "05",
          title: "Method",
          html: `<p><strong>Corpus.</strong> The supplied CSV contains 500 English–Chinese pairs with OpenSubtitles sentence IDs between 168 and 304,712. It has 195 English nominal types, 277 normalised Chinese verb forms, and 492 unique sentence pairs after duplicate checking. All fields are non-empty. The eight repeated entries are kept because they are separate source rows; the interface can hide them without changing the corpus.</p><p><strong>Sampling note.</strong> The supplied CSV arrived without a documented selection seed, pre-filter, or rejection count. I therefore do not claim that it is a fresh random sample; I retained all 500 supplied rows rather than substituting preferred examples. Its provenance is traceable at sentence-ID level, but the selection procedure remains an inherited limitation of the dataset.</p><p><strong>Source check.</strong> The build matched all 500 English strings and sentence IDs against the OpenSubtitles v2024 en–zh_CN release. All English lines matched. Nineteen Chinese-side source lines contained stray English fragments or punctuation differences caused by alignment; the CSV’s cleaner target strings were retained and the artefacts are recorded as a limitation. The fixed 50-entry sample (seed 2026) found no mismatched IDs or English strings requiring correction after normalising those artefacts. The 50 entries are marked as a source-assisted check, not as the author’s personal verification; the author must repeat the sample by hand before submission.</p><p><strong>Codebook.</strong> I used five categories: direct transposition, perspectival modulation, contextual specification, stative recoding, and weak equivalence. The categories are defined in the Codebook page with decision rules, boundary cases, and the revision log shown below. I tested the first version on 20–30 entries before extending it to the full set. The main revision was to separate <em>contextual specification</em> from <em>perspectival modulation</em>: a target that adds a concrete object or event (for example, <strong>celebration → 结婚</strong>) is not the same as one that changes the viewpoint on the same event (for example, <strong>possession → 收回</strong>).</p><p><strong>System.</strong> The site is static HTML, CSS, and JavaScript with a JSON build of the CSV. Search, category filtering, check-status filtering, the linked charts, the table, and the URL state share one data model. The charts are redrawn from the filtered rows rather than from cached totals, so the table and every chart answer the same view.</p>`
        },
        {
          id: "analysis",
          number: "06",
          title: "Analysis",
          html: `<p>The most obvious result is that direct transposition dominates: <strong>{{direct}} of {{entries}} entries ({{directPct}}%)</strong> use a conventional verbal counterpart. This is the baseline that makes the other categories meaningful. The remaining <strong>{{nonDirect}} entries ({{nonDirectPct}}%)</strong> are where the subtitle’s context becomes visible.</p><h3>Figure 1 · Nominal → verb flow map</h3><p>The flow map shows the top nominals and the Chinese verbs connected to them. <strong>attention</strong> is the strongest repeated signal with <strong>45 entries</strong>, followed by <strong>permission</strong> (17), <strong>vacation</strong> and <strong>protection</strong> (12 each), and <strong>performance</strong> (11). The top ten nominals account for <strong>{{top10Pct}}%</strong> of all entries; the top twenty account for <strong>{{top20Pct}}%</strong>. The long tail matters, but a small set of recurring subtitle actions carries much of the corpus.</p><h3>Figure 2 · Shift-category treemap</h3><p>The treemap shows how the corpus divides across categories: <strong>{{modulation}} modulation</strong>, <strong>{{specification}} specification</strong>, <strong>{{stative}} stative</strong>, and <strong>{{weak}} weak</strong> entries. It also exposes internal variety. <strong>confession</strong> has the widest set of renderings (five forms, including 认罪, 招供, and 自首); <strong>performance</strong>, <strong>question</strong>, and <strong>pleasure</strong> also each have five, while <strong>permission</strong> has four. The variation is not evenly spread across topics; it clusters around speech acts, social situations, and evaluative nouns.</p><h3>Figure 3 · Length plot</h3><p>The English source averages <strong>{{avgEn}} characters</strong> and the Chinese target <strong>{{avgZh}} characters</strong>; the Chinese line is about <strong>{{ratio}}</strong> of the English character length. The correlation is <strong>r = {{r}}</strong>, a moderate positive relationship, not a proportional one. The shortest lines tend to carry the weakest equivalents: weak entries average <strong>{{weakEn}} English characters</strong> and <strong>{{weakZh}} Chinese characters</strong>, while direct entries average <strong>{{directEn}}</strong> and <strong>{{directZh}}</strong>. Character counts are not word counts, and English and Chinese measure different units, so the plot is a diagnostic rather than a linguistic law.</p><h3>Figure 4 · Bilingual KWIC</h3><p>The KWIC view makes the local decision visible. In the same corpus, <strong>attention → 注意</strong> belongs to ordinary requests for focus, <strong>attention → 稍息</strong> belongs to a military command, and <strong>attention → 知道</strong> is an idiomatic paraphrase. The highlighted pair is a reminder that the category is attached to the whole line, not to an isolated word. The same pattern appears with <strong>performance</strong>: 表演 and 演出 are direct, 奉献 is a contextual specification, and 懂得 is weak because the line’s meaning is carried by idiom.</p><p>Read together, the four views support a cautious conclusion: nominal-to-verbal shift in subtitles is real and frequent, but it is not one operation. Direct transposition is the centre of gravity; modulation and specification are where the translator’s interpretation becomes visible; stative and weak cases mark the edges where the nominal begins to lose its independent shape.</p>`
        },
        {
          id: "conclusion",
          number: "07",
          title: "Conclusion",
          html: `<p>NVAtlas meets the project’s core requirement: a visitor can search the corpus, filter by category and human-check status, inspect a linked table, and use four interactive visualisations—a flow map, a treemap, a length plot, and a bilingual KWIC. Clicking a term or category carries the view across the site, and the current state is stored in the URL.</p><p>The analysis shows that English nominals are usually verbalised in a relatively stable way, but the exceptions are not noise. They are concentrated in context-sensitive domains: commands, social rituals, evaluations, and compressed lines where the translator must choose a concrete action. The corpus explorer makes those choices legible without pretending that every pair has a single correct category.</p>`
        },
        {
          id: "reflection",
          number: "08",
          title: "Reflection",
          html: `<p>The hardest part was not building the charts; it was defining categories that could survive contact with 500 real lines. A first-pass rule such as “use the dictionary equivalent” sounds clean until a line contains an idiom, a military command, or a noun whose English meaning changes with negation. I learned to treat the codebook as a living instrument: test it, find the boundary cases, write down the decision, and keep the table close to the evidence.</p><p>I also learned that AI is useful for scale but dangerous as a substitute for judgement. It can extract, normalise, count, and scaffold an interface quickly. It can also flatten a context-sensitive pair into a plausible-looking category. The duplicate audit and the source check caught issues that a purely visual demo would have hidden. The 50-entry sample and the full corpus both need human confirmation before submission.</p><p>If I extended the project, I would add second-coder agreement, a larger and more balanced sample, a proper source-metadata field for collection date and sampling seed, and support for more genres beyond film dialogue. I would also separate the author’s reading of individual examples from the automated category counts in the report so readers can see the interpretive distance between them.</p>`
        }
      ]
    },
    codebook: {
      kicker: "Method · codebook",
      title: "Five ways a noun becomes a verb.",
      lead: "The categories are analytical tools, not verdicts. Each rule is applied to a sentence pair, with the original English and Chinese kept beside the decision.",
      introTitle: "How to read this codebook",
      intro: "A category answers a single question: how does the Chinese verb relate to the English nominal in this line? The categories are mutually exclusive at the level of the pair. When two categories appear possible, the decision order below determines the result. The log records changes made after testing the first 20–30 entries.",
      decisionTitle: "Decision order",
      decision: [
        "Ask whether the target is primarily a state, quality, emotion, or relation. If yes, use stative recoding.",
        "If the target is a conventional verbal counterpart without a new object or event, use direct transposition.",
        "If the target adds a concrete action, object, setting, or speech act, use contextual specification.",
        "If the target changes viewpoint, result, aspect, or speech act while keeping the same situation, use perspectival modulation.",
        "If the nominal cannot be reliably recovered from the verb without the surrounding line, use weak equivalence."
      ],
      categoriesTitle: "Categories",
      categoryFields: {
        definition: "Definition",
        theory: "Theory source",
        rule: "Decision rule",
        positive: "Positive example",
        negative: "Negative example",
        boundary: "Boundary case"
      },
      logTitle: "Codebook log",
      log: [
        "v1.0 · Four categories: direct, modulation, specification, stative. Weak cases were initially folded into modulation.",
        "v1.1 · Split weak equivalence into its own category after reviewing idiomatic lines such as performance → 懂得.",
        "v1.1 · Added the rule that a target adding a new event (celebration → 结婚) is specification, not modulation.",
        "v1.1 · Required a source-ID check before a pair could be marked human_checked. Fifty entries were selected with seed 2026."
      ],
      referencesTitle: "Theory references",
      dataUseTitle: "Copyright and data use",
      dataUseText: "The site reproduces 500 short subtitle sentence pairs from OpenSubtitles v2024 en–zh_CN via OPUS for research and teaching. It does not redistribute complete subtitle files or episodes. Short quotations are attributed to OpenSubtitles and OPUS; the original corpus remains subject to the source’s current terms of use. No personal data are included. Before reusing the corpus outside this coursework, check the current OpenSubtitles and OPUS terms.",
      references: [
        "Baker, M. (1992). In Other Words: A Coursebook on Translation.",
        "Blum-Kulka, S. (1986). Shifts of cohesion and coherence in translation.",
        "Catford, J. C. (1965). A Linguistic Theory of Translation.",
        "Halliday, M. A. K., & Matthiessen, C. M. I. M. (2014). Halliday's Introduction to Functional Grammar.",
        "Vinay, J.-P., & Darbelnet, J. (1958/1995). Comparative Stylistics of French and English."
      ]
    },
    ai: {
      kicker: "Transparency · AI use declaration",
      title: "What the agent did, and what it could not do.",
      lead: "This page records the division of labour behind the site. The corpus data are quotations from an existing source; they were not generated.",
      sections: [
        {
          title: "Tools used",
          html: "<p><strong>OpenAI Codex coding agent</strong> in the desktop environment. The exact underlying model identifier was not exposed by the environment. No LLM is called when a visitor uses the site, and no sentence, translation, source, or ID in the corpus was generated by the site.</p>"
        },
        {
          title: "What I asked the agent to do",
          html: "<ul><li>Read the project brief and turn its requirements into a build checklist.</li><li>Inspect the supplied 500-row CSV and the source brief.</li><li>Check source IDs against OpenSubtitles v2024 and report alignment artefacts.</li><li>Draft and apply the five-category codebook; build the static corpus explorer, linked charts, bilingual interface, report, codebook, and AI declaration.</li><li>Test the site locally, verify the chart totals against the table, and prepare the GitHub Pages deployment.</li></ul>"
        },
        {
          title: "What the author did and what still needs checking",
          html: "<p>The author supplied the corpus and the brief, chose the project direction, and is responsible for the final argument. The agent performed the source and category checks and recorded the limitations. Before submission, the author should inspect the 50 checked entries, confirm the category assignments in context, and revise the report voice where needed.</p>"
        },
        {
          title: "Example prompts that worked",
          html: "<div class=\"prompt-box\">Read the final-project brief and extract every website, report, codebook, source-check, licensing, and grading requirement. Then map the existing CSV to those requirements without inventing entries.</div><div class=\"prompt-box\">Build a single-page static corpus explorer with URL state, category and human-check filters, at least three linked visualisations, a bilingual interface, and a report that refers to each chart by name.</div>"
        },
        {
          title: "One thing the agent got wrong",
          html: "<p>The first pass described the CSV as 500 unique pairs. A duplicate audit showed 492 unique pairs: seven repeated-pair clusters and eight repeated entries. The interface now reports both counts and can hide repeated pairs. A second correction was category wording: the initial scheme mixed “adds a new event” with “changes viewpoint.” The codebook log records the split.</p>"
        }
      ]
    }
  },
  "zh-Hant": {
    localeName: "繁體中文",
    a11y: { skip: "跳到內容" },
    nav: {
      label: "主要導覽",
      home: "首頁",
      explore: "探索",
      visualize: "視覺化",
      report: "學習報告",
      codebook: "編碼簿",
      ai: "AI 使用聲明"
    },
    lang: { label: "語言" },
    filters: {
      search: "搜尋",
      searchPlaceholder: "英文、中文、名詞或動詞…",
      category: "轉換類別",
      allCategories: "所有類別",
      checked: "人工核對",
      allChecks: "全部條目",
      yes: "已核對",
      no: "未核對",
      unique: "隱藏重複句對",
      clear: "清除篩選",
      export: "匯出目前 CSV",
      count: "{{n}} / {{total}} 筆",
      active: "目前篩選",
      remove: "移除篩選",
      query: "搜尋：「{{value}}」",
      checkedActive: "核對狀態：{{value}}",
      uniqueActive: "已隱藏重複句對",
      duplicateNotice: "語料中有 {{n}} 筆重複條目；可使用開關隱藏。",
      noResults: "目前條件下沒有條目。"
    },
    home: {
      eyebrow: "數位人文 · 語料研究",
      titleA: "從名詞",
      titleB: "到動詞。",
      deck: "500 對英中字幕句對中，名詞轉動詞的互動圖譜。",
      body: "當英語抽象名詞遇上壓縮的字幕句，中文常讓動詞承擔動作。NVAtlas 讓這些轉換可以被搜尋、篩選與觀察。",
      ctaExplore: "進入圖譜",
      ctaReport: "閱讀學習報告",
      figureLabel: "一個名詞，四種譯法",
      figureCaption: "同一個英語名詞，會展開成直接、視角調整與語境具體化的中文動詞。",
      stat: { pairs: "句對", nominals: "英語名詞", verbs: "中文動詞形式", categories: "轉換類別" },
      questionEyebrow: "研究問題",
      question: "當英語名詞變成中文動詞，轉換會在何時成為直接對應、視角調整、語境具體化、狀態化，或失去清楚對應？",
      questionBody: "字幕要求壓縮。真正值得觀察的單位不是名詞的字典對應，而是譯者在某一句裡選了哪個動詞。",
      glanceEyebrow: "快速觀察",
      insightDirect: "的條目使用直接詞類轉換。",
      insightOther: "跳脫直接對應。",
      insightAttention: "是語料中最強的反覆名詞訊號。",
      termsEyebrow: "從一個訊號開始",
      termsTitle: "跟著一個詞，走進它的譯法。",
      termsHint: "選擇詞語，開啟篩選後的語料檢視。",
      provenanceTitle: "可追溯的設計",
      provenanceBody: "每一筆都保留 OpenSubtitles 的句號。建置時已將 500 條英語字串全部對回 OpenSubtitles v2024；並以 seed 2026 抽樣核對 50 筆。OpenSubtitles 與 OPUS 的來源標示於頁尾。",
      provenanceLink: "閱讀編碼簿 →"
    },
    explore: {
      eyebrow: "瀏覽語料",
      title: "逐句讀出轉換。",
      deck: "同時搜尋兩種語言、隔離類別、檢視來源句號，並匯出目前檢視的所有列。",
      tableEyebrow: "語料瀏覽器",
      tableTitle: "500 對可追溯句對",
      export: "匯出 CSV",
      columns: {
        id: "編號",
        source: "英語原文",
        target: "中文譯文",
        nominal: "名詞",
        verb: "中文動詞",
        category: "轉換",
        checked: "核對",
        status: "狀態"
      },
      range: "第 {{start}}–{{end}} 筆，共 {{total}} 筆",
      page: "{{page}} / {{pages}}",
      prev: "上一頁",
      next: "下一頁",
      checkedYes: "是",
      checkedNo: "否",
      duplicate: "重複",
      sourceLabel: "OpenSubtitles 句號",
      openEntry: "開啟條目"
    },
    viz: {
      eyebrow: "連動的視覺分析",
      title: "看見模式，再跟著它走。",
      deck: "所有圖表都回應同一組篩選。點選詞語或類別，會把選取帶到其他檢視。",
      sankey: {
        title: "名詞 → 動詞流圖",
        caption: "最常見的英語名詞如何展開成中文動詞？",
        top: "名詞數量",
        verbs: "動詞數量",
        min: "最小連結",
        hint: "點選名詞或動詞，即以此詞搜尋語料。",
        empty: "目前篩選下沒有可繪製的流向。"
      },
      treemap: {
        title: "轉換類別矩形圖",
        caption: "哪些英語名詞家族主導各類轉換？",
        terms: "每類詞數",
        metric: "面積依據",
        metricCount: "條目數",
        metricVariety: "動詞多樣性",
        hint: "點選類別帶可篩選；點選詞語可搜尋。",
        empty: "目前篩選下沒有詞語。"
      },
      scatter: {
        title: "長度散佈圖",
        caption: "較長的英語句子是否會帶來等比例較長的中文句？哪些轉換位於極端？",
        log: "對數尺度",
        x: "英語字元數",
        y: "中文字元數",
        correlation: "Pearson r = {{r}}",
        hint: "點選資料點，檢視條目並追蹤其名詞。",
        empty: "目前篩選下沒有資料點。"
      },
      kwic: {
        title: "雙語 KWIC",
        caption: "每個名詞轉動詞的個案，周圍出現哪些語境？",
        window: "語境寬度",
        sort: "排序",
        sortLeft: "左語境",
        sortRight: "右語境",
        sortId: "條目編號",
        english: "英語語境",
        chinese: "中文語境",
        meta: "條目",
        hint: "反白詞語可點選。語境只截取句對內部。",
        empty: "目前篩選下沒有例子。"
      },
      tableEyebrow: "連動證據",
      tableTitle: "目前檢視背後的列",
      openTable: "開啟完整資料瀏覽器 →",
      showing: "顯示 {{n}} / {{total}} 筆",
      noResults: "沒有連動的列。"
    },
    drawer: {
      kicker: "條目 {{id}}",
      source: "英語原文",
      target: "中文譯文",
      meta: "後設資料",
      sourceId: "來源",
      unit: "單位",
      category: "轉換類別",
      checked: "人工核對",
      duplicate: "重複句對",
      lengths: "長度",
      lengthsValue: "英語 {{en}} 字元 / 中文 {{zh}} 字元",
      searchNominal: "搜尋此名詞",
      searchVerb: "搜尋此動詞",
      sourceLink: "開啟語料來源",
      close: "關閉條目",
      yes: "是",
      no: "否",
      repeated: "是",
      uniquePair: "否"
    },
    status: {
      loading: "正在載入語料…",
      error: "無法載入語料。請透過本機網頁伺服器或 GitHub Pages 開啟。",
      filtered: "已篩選「{{term}}」。",
      categoryFiltered: "已篩選 {{category}}。",
      copied: "已匯出目前篩選的 CSV。"
    },
    footer: {
      description: "為 2026R1「Translation Technology in the Age of AI」期末作業建置的雙語語料探索器。",
      credit: "資料：透過 OPUS 取得的 OpenSubtitles v2024 en–zh_CN。短引文用於研究與教學。<a href=\"https://opus.nlpl.eu/OpenSubtitles/corpus/version/OpenSubtitles\" target=\"_blank\" rel=\"noreferrer\">OPUS ↗</a> · <a href=\"https://www.opensubtitles.org/\" target=\"_blank\" rel=\"noreferrer\">OpenSubtitles ↗</a>",
      download: "下載整理後的語料 CSV（500 列）",
      built: "以靜態 GitHub Pages 網站建置。"
    },
    categories: {
      direct: {
        label: "直接詞類轉換",
        short: "直接",
        definition: "英語名詞以常規中文動詞表達；不新增事件或賓語，核心意義可以直接復原。",
        theory: "Catford（1965）的詞類轉換；Vinay & Darbelnet（1958/1995）的 transposition。",
        rule: "當動詞是名詞的預期字面對應，且句子不需要更具體的動作時使用。",
        positive: { q: "ID 168 · question → 问", why: "名詞與動詞共享同一核心意義；兩邊都仍是一個提問。" },
        negative: { q: "ID 4417 · attention → 稍息", why: "Attention! 是口令；譯文是具體動作，不是 attention 的一般對應。" },
        boundary: { q: "ID 910 · destruction → 毁灭 vs ID 804 · destruction → 烧毁", why: "毁灭 是直接動詞對應；烧毁 指明破壞方式，因此歸為語境具體化。" }
      },
      modulation: {
        label: "視角調整",
        short: "視角",
        definition: "譯文仍與名詞有清楚語意關聯，但轉換了觀點、結果、體貌或言語行為。",
        theory: "Vinay & Darbelnet（1958/1995）的 modulation；Catford（1965）的語意轉換。",
        rule: "當動詞可解釋為同一情境的另一種看法，而不是新事件或直接對應時使用。",
        positive: { q: "ID 6228 · possession → 收回", why: "原文以狀態框定佔有；字幕改以「取回」的行動框定同一情境。" },
        negative: { q: "ID 910 · destruction → 毁灭", why: "譯文是普通動詞對應，沒有視角轉移。" },
        boundary: { q: "ID 301094 · permission → 批准", why: "Permission granted 變成批准的言語行為；焦點移到行為本身，故為視角調整。" }
      },
      specification: {
        label: "語境具體化",
        short: "具體化",
        definition: "譯文把名詞本身無法決定的動作、賓語、場景或言語行為說清楚。",
        theory: "Blum-Kulka（1986）的明示化；Baker（1992）的語境等值。",
        rule: "當中文動詞加入由字幕情境推得的具體行動或領域時使用。",
        positive: { q: "ID 4417 · attention → 稍息", why: "軍事口令被具體化為「稍息」；譯文不是單純命名 attention。" },
        negative: { q: "ID 35417 · attention → 注意", why: "動詞命名同一個認知動作，沒有新增賓語或事件。" },
        boundary: { q: "ID 166388 · celebration → 结婚", why: "慶祝被具體化成婚禮；新增事件足夠具體，因此算語境具體化。" }
      },
      stative: {
        label: "狀態化改寫",
        short: "狀態",
        definition: "狀態、性質、情緒或關係以中文狀態或形容詞性謂語表達，而非動作動詞。",
        theory: "Halliday & Matthiessen（2014）的語法隱喻；Catford（1965）的詞類轉換。",
        rule: "當譯文謂語主要在描述某人如何、感受、相似、依賴或評價某事時使用。",
        positive: { q: "ID 474 · obsession → 痴迷", why: "名詞被改寫成「著迷」的狀態；譯文描述狀態。" },
        negative: { q: "ID 168 · question → 问", why: "譯文命名說話者執行的動作。" },
        boundary: { q: "ID 297501 · pleasure → 满足 vs ID 237598 · pleasure → 享受", why: "满足 是被滿足的狀態；享受 是直接動詞對應。前者為狀態化，後者為直接。" }
      },
      weak: {
        label: "弱對應",
        short: "弱對應",
        definition: "中文動詞過於泛化、只依賴語境，或與名詞的連結不足以支持清楚的直接、視角或具體化關係。",
        theory: "Catford（1965）的翻譯損失；Baker（1992）的等值限制。",
        rule: "只有在其他四類都不成立，且必須依靠整句才能復原名詞時使用。",
        positive: { q: "ID 23964 · performance → 懂得", why: "A great performance 變成「真懂得做戲」；關係依賴慣用語與推論。" },
        negative: { q: "ID 42737 · performance → 表演", why: "譯文是 performance 的普通動詞對應。" },
        boundary: { q: "ID 82278 · interference → 不会 vs ID 57015 · interference → 干涉", why: "不会 是依賴語境的否定；干涉 是常規動詞對應。只有前者算弱對應。" }
      }
    },
    report: {
      kicker: "學習報告",
      title: "字幕選擇的那個動詞。",
      lead: "透過 500 對英中字幕、五類名詞轉動詞的轉換，以及把語料簡化成詞頻時容易消失的細小語境判斷。",
      meta: ["2026R1 Translation Technology in the Age of AI", "個人期末作業", "2026 年 12 月 5 日"],
      tocLabel: "章節",
      figureCategories: "本版語料的類別分布",
      figureNominals: "最常見的八個英語名詞",
      figureCaption: "數字由 500 筆語料重新計算；互動檢視在任何篩選下都會顯示同一組統計。",
      figureOpen: "開啟互動視覺分析 →",
      sections: [
        {
          id: "origin",
          number: "01",
          title: "緣起",
          html: `<p>我從一個很實際的觀察開始：字幕很少保留原文的文法形狀。英語句子可以把事件名詞化——<em>her explanation</em>、<em>the celebration</em>、<em>his resignation</em>——中文卻常讓動詞承擔動作。這種轉換小到在雙語字典裡容易被忽略，又大到會改變角色在場景裡正在做什麼。</p><p>我選擇這個題目，因為它位在翻譯研究與語料語言學之間，也因為語料能讓比較變得可見，而不只是軼事。500 對短引文來自 OpenSubtitles v2024 en–zh_CN；每一筆都保留英語名詞與字幕實際使用的中文動詞。</p><div class="report-quote">我想研究的單位不是「一個名詞的翻譯」，而是譯者把名詞變成動詞的那一刻。</div>`
        },
        {
          id: "background",
          number: "02",
          title: "背景",
          html: `<p>英語名詞化把資訊壓進緊湊片語：<em>the construction of the tower</em>、<em>the destruction of the city</em>、<em>a reputation</em>。中文當然也能名詞化，但字幕翻譯常偏好動詞謂語，尤其在句子必須在螢幕上快速掠過時。這不是機械規則。譯者可以保留明確動作、把視角移到結果、補出場景暗示的賓語，或讓名詞消融在語境裡。</p><p>既有語料探索器——包括本系的 NV Atlas——很擅長呈現詞語如何在大規模語料中連結，也能揭示頻率與共現。它們較少直接呈現單一句對內部的文法決定：哪個名詞被移進動詞，以及這個移動離常規對應多遠。</p>`
        },
        {
          id: "gap",
          number: "03",
          title: "研究缺口",
          html: `<p>缺口一部分是技術性的，一部分是詮釋性的。頻率圖可以告訴我們 <strong>attention</strong> 很常見，卻不能告訴我們同一個英語名詞在某一幕變成 <strong>注意</strong>、在另一幕變成 <strong>重视</strong>、在軍事口令裡變成 <strong>稍息</strong>，又在依賴語境的改寫裡變成 <strong>知道</strong>。逐詞對應的資源會把這些差異壓平。</p><p>我想要一個小型介面，讓證據保持可檢視：原文、譯文、名詞、動詞、類別與來源句號都留在一起。視覺化不應只是裝飾資料，而要回答問題，並把訪客帶回表格。</p>`
        },
        {
          id: "questions",
          number: "04",
          title: "問題",
          html: `<p>本專案由三個問題引導：</p><ul><li>英語名詞以中文動詞表達時，有多少情況保留了核心意義？</li><li>哪些名詞家族跨越最多中文動詞？這種多樣性如何揭示語境？</li><li>句長與轉換類型會一起變動，或最具語境依賴性的選擇其實藏在短句裡？</li></ul><p>每個問題都對應圖譜中的一個可見控制：流向圖、矩形圖、長度散佈圖與雙語 KWIC。</p>`
        },
        {
          id: "method",
          number: "05",
          title: "方法",
          html: `<p><strong>語料。</strong>提供的 CSV 有 500 對英中句對，OpenSubtitles 句號介於 168 與 304,712。內含 195 個英語名詞類型、277 個正規化中文動詞形式；去除重複後為 492 對唯一句對。所有欄位皆非空。八筆重複條目被保留，因為它們是不同來源列；介面可以隱藏它們而不改動語料。</p><p><strong>抽樣說明。</strong>提供的 CSV 沒有附上可查的抽樣種子、預先篩選條件或淘汰數量。因此我不主張它是重新抽取的隨機樣本；我保留全部 500 列，而不是替換成偏好的例子。資料可在句號層級追溯，但原始選樣程序仍是這份資料集的限制。</p><p><strong>來源核對。</strong>建置時把 500 條英語字串與句號對回 OpenSubtitles v2024 en–zh_CN。500 條英語原文全部吻合。中文來源有 19 行因對齊而夾帶零碎英文或標點差異；本專案保留 CSV 中較乾淨的中文譯文，並把這些對齊痕跡列為限制。固定 50 筆樣本（種子 2026）在正常化這些差異後，沒有發現句號或英語原文錯誤。這 50 筆標為來源輔助核對，而不是作者親自核對；提交前作者必須親手重做這個樣本。</p><p><strong>編碼簿。</strong>我使用五類：直接詞類轉換、視角調整、語境具體化、狀態化改寫、弱對應。每一類都在編碼簿頁面列出定義、判斷規則、邊界案例，以及下方修訂日誌。第一版先在 20–30 筆上測試，再擴展到全部。最主要的修訂是把「語境具體化」與「視角調整」分開：譯文新增具體物件或事件（例如 <strong>celebration → 结婚</strong>）不同於改變同一事件的觀點（例如 <strong>possession → 收回</strong>）。</p><p><strong>系統。</strong>網站是靜態 HTML、CSS、JavaScript 與由 CSV 建置的 JSON。搜尋、類別篩選、核對狀態、連動圖表、表格與 URL 狀態共用同一個資料模型。圖表每次都從篩選後的列重繪，而不是使用快取總數，因此表格與所有圖表回答的是同一個檢視。</p>`
        },
        {
          id: "analysis",
          number: "06",
          title: "分析",
          html: `<p>最明顯的結果是直接詞類轉換占多數：<strong>{{direct}} / {{entries}} 筆（{{directPct}}%）</strong>使用常規動詞對應。這個基準讓其他類別變得有意義。其餘 <strong>{{nonDirect}} 筆（{{nonDirectPct}}%）</strong>正是字幕語境變得可見的地方。</p><h3>圖一 · 名詞 → 動詞流圖</h3><p>流向圖呈現最常見的名詞與其連結的中文動詞。<strong>attention</strong> 是最強的反覆訊號，共 <strong>45 筆</strong>，其次是 <strong>permission</strong>（17）、<strong>vacation</strong> 與 <strong>protection</strong>（各 12）、<strong>performance</strong>（11）。前十大名詞占全部條目的 <strong>{{top10Pct}}%</strong>，前二十占 <strong>{{top20Pct}}%</strong>。長尾很重要，但少數反覆出現的字幕動作承載了語料的一大部分。</p><h3>圖二 · 轉換類別矩形圖</h3><p>矩形圖顯示五類的分布：<strong>{{modulation}} 筆視角調整</strong>、<strong>{{specification}} 筆語境具體化</strong>、<strong>{{stative}} 筆狀態化</strong>、<strong>{{weak}} 筆弱對應</strong>。它也揭露類別內部的多樣性。<strong>confession</strong> 的譯法最多（五種，包括 认罪、招供、自首）；<strong>performance</strong>、<strong>question</strong> 與 <strong>pleasure</strong> 也各有五種，<strong>permission</strong> 則有四種。變化並非平均分布，而是集中在言語行為、社交情境與評價性名詞。</p><h3>圖三 · 長度散佈圖</h3><p>英語原文平均 <strong>{{avgEn}} 字元</strong>，中文譯文平均 <strong>{{avgZh}} 字元</strong>；中文長度約為英語的 <strong>{{ratio}}</strong>。相關係數為 <strong>r = {{r}}</strong>，是中度正相關，而不是等比例關係。最短的句子往往承載最弱的對應：弱對應平均 <strong>{{weakEn}} 個英語字元</strong>與 <strong>{{weakZh}} 個中文字元</strong>，直接對應則是 <strong>{{directEn}}</strong> 與 <strong>{{directZh}}</strong>。字元數不是詞數，英語與中文也使用不同單位，因此這張圖是診斷工具，不是語言定律。</p><h3>圖四 · 雙語 KWIC</h3><p>KWIC 讓局部決定變得可見。在同一個語料裡，<strong>attention → 注意</strong> 屬於一般的專注要求，<strong>attention → 稍息</strong> 屬於軍事口令，<strong>attention → 知道</strong> 則是依賴慣用語的改寫。反白詞對提醒我們：類別附著於整句，而不是孤立詞語。同樣的模式也出現在 <strong>performance</strong>：表演與演出屬直接，奉献屬語境具體化，懂得則是弱對應，因為句意主要由慣用語承擔。</p><p>四個檢視合起來支持一個謹慎的結論：字幕中的名詞轉動詞真實且常見，但不是單一操作。直接轉換是重心；視角調整與語境具體化讓譯者的詮釋浮現；狀態化與弱對應則標出名詞開始失去獨立形狀的邊緣。</p>`
        },
        {
          id: "conclusion",
          number: "07",
          title: "結論",
          html: `<p>NVAtlas 達成專案的核心要求：訪客可以搜尋語料、依類別與人工核對狀態篩選、檢視連動表格，並使用四種互動視覺化——流向圖、矩形圖、長度散佈圖與雙語 KWIC。點選詞語或類別會把檢視帶到整個網站，目前狀態也會保存在 URL 中。</p><p>分析顯示，英語名詞通常以相對穩定的方式動詞化，但例外不是雜訊。它們集中在語境敏感領域：命令、社會儀式、評價，以及譯者必須選擇具體動作的壓縮句。語料探索器讓這些選擇可讀，同時不假裝每一對都只有唯一正確的類別。</p>`
        },
        {
          id: "reflection",
          number: "08",
          title: "反思",
          html: `<p>最難的部分不是做圖，而是定義能承受 500 條真實句子考驗的類別。「使用字典對應」聽起來很乾淨，直到句子裡出現慣用語、軍事口令，或英語名詞因否定而改變意義。我學會把編碼簿當成活的工具：測試、找出邊界案例、寫下決定，並讓表格緊貼證據。</p><p>我也學到，AI 很適合處理規模，卻不能取代判斷。它可以快速抽取、正規化、計數與搭建介面，也可能把一個高度依賴語境的句對壓成看起來合理的類別。重複檢查與來源核對抓到了純視覺展示會掩蓋的問題。50 筆抽樣與全部語料在提交前仍需要作者確認。</p><p>如果延伸這個專案，我會加入第二位編碼者與一致性檢定、更大且更平衡的樣本、完整的蒐集日期與抽樣種子欄位，以及電影對白以外的文類。我也會把作者對個別例子的閱讀與自動類別計數分開呈現，讓讀者看見兩者之間的詮釋距離。</p>`
        }
      ]
    },
    codebook: {
      kicker: "方法 · 編碼簿",
      title: "名詞變成動詞的五種方式。",
      lead: "類別是分析工具，不是判決。每一條規則都套用在句對上，英語原文與中文譯文始終放在決定旁邊。",
      introTitle: "如何閱讀這份編碼簿",
      intro: "每個類別回答同一個問題：在這一句裡，中文動詞與英語名詞是什麼關係？在句對層級上，各類別互斥。若兩個類別似乎都成立，就依下方判斷順序決定。日誌記錄了測試前 20–30 筆後所做的修改。",
      decisionTitle: "判斷順序",
      decision: [
        "先問譯文謂語是否主要在描述狀態、性質、情緒或關係。若是，歸為狀態化改寫。",
        "若譯文是常規動詞對應，且沒有新增賓語或事件，歸為直接詞類轉換。",
        "若譯文新增具體動作、賓語、場景或言語行為，歸為語境具體化。",
        "若譯文改變觀點、結果、體貌或言語行為，但仍是同一情境，歸為視角調整。",
        "若必須依靠整句才能可靠復原名詞，歸為弱對應。"
      ],
      categoriesTitle: "類別",
      categoryFields: {
        definition: "定義",
        theory: "理論來源",
        rule: "判斷規則",
        positive: "正例",
        negative: "反例",
        boundary: "邊界案例"
      },
      logTitle: "編碼簿日誌",
      log: [
        "v1.0 · 四類：直接、視角、具體化、狀態化。弱對應原先併入視角調整。",
        "v1.1 · 檢視 performance → 懂得 等慣用句後，把弱對應拆成獨立類別。",
        "v1.1 · 新增規則：若譯文新增事件（celebration → 结婚），歸為語境具體化，而非視角調整。",
        "v1.1 · 句對必須通過來源句號核對，才可標為 human_checked。以 seed 2026 選出 50 筆。"
      ],
      referencesTitle: "理論參考",
      dataUseTitle: "著作權與資料使用",
      dataUseText: "本網站為研究與教學重現 OpenSubtitles v2024 en–zh_CN（經 OPUS）的 500 條短字幕句對，不重新散布完整字幕檔或整集內容。短引文標明 OpenSubtitles 與 OPUS；原始語料仍受來源現行使用條款約束。資料不含個人資訊。若要在本課程之外重用語料，請先查核 OpenSubtitles 與 OPUS 的最新條款。",
      references: [
        "Baker, M. (1992). In Other Words: A Coursebook on Translation.",
        "Blum-Kulka, S. (1986). Shifts of cohesion and coherence in translation.",
        "Catford, J. C. (1965). A Linguistic Theory of Translation.",
        "Halliday, M. A. K., & Matthiessen, C. M. I. M. (2014). Halliday's Introduction to Functional Grammar.",
        "Vinay, J.-P., & Darbelnet, J. (1958/1995). Comparative Stylistics of French and English."
      ]
    },
    ai: {
      kicker: "透明性 · AI 使用聲明",
      title: "AI 做了什麼，又做不到什麼。",
      lead: "本頁記錄網站背後的勞動分工。語料是既有來源的引文，不是生成出來的資料。",
      sections: [
        {
          title: "使用工具",
          html: "<p><strong>桌面環境中的 OpenAI Codex 編碼代理</strong>。環境未公開確切的底層模型識別碼。訪客使用網站時不會呼叫任何 LLM；語料中的句子、翻譯、來源與編號也都不是由網站生成的。</p>"
        },
        {
          title: "我請代理做什麼",
          html: "<ul><li>閱讀專案簡介，把要求整理成建置清單。</li><li>檢查提供的 500 列 CSV 與來源簡介。</li><li>把來源句號對回 OpenSubtitles v2024，並回報對齊痕跡。</li><li>草擬並套用五類編碼簿；建置靜態語料探索器、連動圖表、雙語介面、報告、編碼簿與 AI 聲明。</li><li>在本機測試網站、核對圖表與表格總數，並準備 GitHub Pages 部署。</li></ul>"
        },
        {
          title: "作者做了什麼，還有什麼要檢查",
          html: "<p>作者提供語料與簡介、選擇專案方向，並對最終論證負責。代理執行來源與類別檢查，並記錄限制。提交前，作者應檢視 50 筆已核對條目、在語境中確認類別，並在需要處修改報告語氣。</p>"
        },
        {
          title: "有效的提示範例",
          html: "<div class=\"prompt-box\">閱讀期末專案簡介，抽取所有網站、報告、編碼簿、來源核對、授權與評分要求；再把現有 CSV 對應到這些要求，不要發明條目。</div><div class=\"prompt-box\">建立單頁靜態語料探索器，支援 URL 狀態、類別與人工核對篩選、至少三種連動視覺化、雙語介面，以及逐一指涉圖表的報告。</div>"
        },
        {
          title: "代理做錯的一件事",
          html: "<p>第一輪把 CSV 說成 500 對唯一句對。重複檢查發現只有 492 對唯一句對：七組重複群、八筆重複條目。介面現在同時顯示兩個數字，並可隱藏重複。第二個修正是類別措辭：初版把「新增事件」與「改變觀點」混在一起；編碼簿日誌記錄了拆分過程。</p>"
        }
      ]
    }
  }
};
