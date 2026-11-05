# NVAtlas

**From nouns to verbs.** An interactive, bilingual corpus explorer for 500
English–Chinese subtitle sentence pairs from OpenSubtitles v2024 en–zh_CN.

Live site: <https://hsuchinwai.github.io/nvatlas-test/>

The project was built for the 2026R1 *Translation Technology in the Age of AI*
final project. It is a static site: HTML, CSS, JavaScript, and a JSON data file.
No server, database, charting library, or runtime LLM is used.

## Features

- Search across English source text, Chinese target text, nominal, verb, and ID.
- Filter by all five shift categories, `human_checked`, and repeated pairs.
- Four linked visualizations: a nominal-to-verb flow map, a nested category
  treemap, an English/Chinese length scatter plot, and a bilingual KWIC viewer.
- A sortable, paginated corpus browser with row drawer and filtered CSV export.
- Shareable URL state for view, language, search term, filters, sorting, page,
  and the open entry.
- English and Traditional Chinese interface, report, codebook, and AI-use page.
- An eight-section learning report with data-driven figures and codebook log.

## Local preview

Run from the repository root so `fetch("corpus.json")` works:

```bash
python3 -m http.server 4173
```

Open <http://127.0.0.1:4173/>. The site also works from GitHub Pages.

## Data files

- `corpus.json` — the site data file, with 500 entries and corpus metadata.
- `NVAtlas-corpus.csv` — the same cleaned dataset with all required fields.
- `NVAtlas-AI-Agent.csv` — the original supplied five-column CSV.
- `data/NVAtlas-AI-Agent.csv` — an earlier repository copy of the supplied CSV.
- `docs/2026R1-tt-final-project-brief.pdf` — the project brief.

Required fields in the published data are `source_text`, `target_text`,
`source`, `category`, and `human_checked`. Optional analysis fields include
`unit`, `key_term`, `target_verb`, `source_id`, `duplicate`, and character
lengths.

### Corpus totals

| Measure | Value |
| --- | ---: |
| Entries | 500 |
| Unique sentence pairs | 492 |
| Repeated entries | 8 extra rows in 7 repeated-pair clusters |
| English nominal types | 195 |
| Normalised Chinese verb forms | 277 |
| Categories | 5 |
| Source-assisted checked entries | 50 (seed 2026) |
| Pearson length correlation | 0.674 |

Category totals: direct 334, modulation 70, specification 55, stative 27,
weak 14.

## Reproducible build and checks

The category map and data build live in `scripts/build_data.py`:

```bash
python3 scripts/build_data.py
python3 scripts/verify.py
```

`build_data.py` regenerates `corpus.json` and `NVAtlas-corpus.csv` from the
original CSV and the auditable pair-level category map. `verify.py` asserts the
500/492 totals, category distribution, required fields, 50 checked entries,
character correlation, and JSON/CSV agreement.

## Source and limitations

The corpus is from **OpenSubtitles v2024 en–zh_CN**, distributed through
[OPUS](https://opus.nlpl.eu/OpenSubtitles/corpus/version/OpenSubtitles) and
originally published by [OpenSubtitles](https://www.opensubtitles.org/). The
site reproduces only 500 short sentence pairs for research and teaching; it does
not redistribute complete subtitle files. Attribution is repeated in the site
footer and the codebook page.

All 500 English strings and source sentence IDs were matched against the v2024
release. Nineteen Chinese-side source records contained alignment artefacts
(appended English fragments or punctuation differences); the cleaner target
strings from the supplied CSV were retained and the difference is documented.

The supplied CSV did not include a selection seed, pre-filter, or rejection log.
This repository therefore does **not** claim that the 500 rows are a fresh
random sample. All supplied rows were retained rather than replaced with
preferred examples; this is an inherited limitation. The 50 entries marked
`human_checked = yes` are a fixed-seed, source-assisted check (seed 2026), not a
claim that the author personally verified them. Before submission, the author
must repeat that sample by hand, confirm the category decisions in context, and
rewrite the codebook definitions in their own words.

## Deploying to GitHub Pages

1. Push `index.html`, `styles.css`, `content.js`, `app.js`, `corpus.json`, and
   the CSV data file to the repository's `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, `main`, and
   `/ (root)`.
4. Save and wait for the Pages deployment to finish.

Expected URL: <https://hsuchinwai.github.io/nvatlas-test/>

## AI use

The site contains a full AI-use declaration. In brief: OpenAI Codex in the
desktop environment was used to inspect the brief and CSV, check source IDs,
draft and apply the codebook, build the interface and visualizations, and run
verification. No LLM is called when a visitor uses the site. The author is
responsible for the final argument, source checks, category review, and report
voice.
