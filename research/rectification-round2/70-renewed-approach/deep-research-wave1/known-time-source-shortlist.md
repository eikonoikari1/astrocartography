# Known-Time Source Shortlist

## Ranking Principle

Rank sources by how much they help answer the actual question:

Can we test timing behavior on known-time people without leaking labels or overfitting to biography density?

## Shortlist

| Rank | Source | Why it belongs here | Main use | Main caveat | Benchmark role |
|---|---|---|---|---|---|
| 1 | [Astro-Databank](https://www.astro.com/astro-databank/Astro-Databank%3AHandbook_chapter_01) | It is the only source in this set that directly targets birth-time provenance and source notes at scale | Known-time labels, source-note audit, gold/challenge routing | Not open-source; export/reuse is license-constrained; celebrity bias is strong | Primary birth-time truth anchor |
| 2 | [Wikidata](https://www.wikidata.org/wiki/Wikidata:Data_access) | Best open structured source for people, dates, places, occupations, relations, and external links | Seed lists, structured features, cohort building | Birth times are usually absent; quality varies by item | Metadata backbone |
| 3 | [Wikipedia / Wikimedia dumps](https://dumps.wikimedia.org/legal.html) | Broadest public biography text source with machine-accessible dumps and APIs | Event extraction, life-period extraction, text support | License and attribution obligations; text quality varies | Biography evidence layer |
| 4 | [Chronicling America](https://www.loc.gov/collections/chronicling-america/about-this-collection/rights-and-access/) | Strong contemporaneous public archive for dated events around historical people | Event verification, death notices, career news, relocations | U.S.-centric and OCR noisy | Event anchor layer |
| 5 | [Pantheon 1.0 / 2.0](https://www.nature.com/articles/sdata201575) | Clean benchmark slice for globally notable biographies with manually verified demographics and occupations | Famous-person validation slice, occupation and popularity stratification | Selection bias toward global fame and Wikipedia presence | Validation and stratification slice |
| 6 | [CBDB](https://input.cbdb.fas.harvard.edu/cbdbapi/index.html) | Large historical biography database with relational structure and strong documentary density for Chinese history | Historical figure slice, kinship and office transitions, event structure | Non-commercial share-alike license, Chinese historical elite skew, no direct birth-time truth | Support and challenge slice |

## How To Use The Shortlist

### If the goal is gold-label training
Start with Astro-Databank plus any individually verified public records that can be independently checked. Do not assume the rest of the corpus can substitute for exact birth-time provenance.

### If the goal is open-source benchmark construction
Start with Wikidata, Wikipedia, Chronicling America, Pantheon, and CBDB. Then attach provenance classes and use them to build challenge sets and event packets.

### If the goal is corpus-scale behavior analysis
Use all six, but keep the roles separate:
- Astro-Databank for known-time truth
- Wikidata for person graph and metadata
- Wikipedia for biography text
- Chronicling America for contemporaneous events
- Pantheon for globally notable people
- CBDB for dense historical Chinese biography

## What Each Source Can And Cannot Do

### Astro-Databank
Can:
- provide birth-time labels with source notes
- support strict provenance audits
- seed gold and challenge sets

Cannot:
- be assumed open-source
- be treated as a clean truth oracle
- stand in for open-world population coverage

### Wikidata
Can:
- scale well
- seed a large person list
- provide structured dates and relations

Cannot:
- certify exact birth time in most cases
- replace a provenance-rich known-time source

### Wikipedia / Wikimedia
Can:
- give broad biographies and life narratives
- support event extraction
- cover many languages and historical periods

Cannot:
- guarantee exact date truth
- guarantee license-free redistribution of raw text

### Chronicling America
Can:
- verify and anchor events contemporaneously
- add strong historical date support

Cannot:
- produce birth-time truth directly
- represent non-U.S. lives well

### Pantheon
Can:
- give a cleaner famous-person slice
- support demographic and occupation stratification

Cannot:
- replace a known-time source
- reduce public-figure bias on its own

### CBDB
Can:
- provide dense historical biography and relational structure
- help with non-Western corpus coverage

Cannot:
- provide direct birth-time provenance for most figures
- be used commercially without respecting its license

## Best First Corpus Composition

If I were building the first deep research corpus, I would use:
- Astro-Databank for known-time anchors
- Wikidata for cohort seeding and structured facts
- Wikipedia / Wikimedia dumps for biography text
- Chronicling America for contemporaneous event confirmation
- Pantheon for a famous-person validation slice
- CBDB for a non-Western historical slice

That mix gives the project one truth source, several support sources, and multiple bias checks.

## What To Avoid

- building the corpus around only famous Western figures
- assuming Wikipedia text quality is uniform
- using Pantheon as a substitute for provenance
- using CBDB as if it contained birth-time truth
- treating Astro-Databank as freely open source when rights still matter

## Recommended First Test Set

The first test set should include:
- a small strict gold slice from Astro-Databank-like provenance
- a broader public-figure challenge slice from Wikidata/Wikipedia/Pantheon/CBDB
- a contemporaneous-archive slice from Chronicling America or similar public archives

That structure will show whether the system is learning timing or merely learning biography density.
