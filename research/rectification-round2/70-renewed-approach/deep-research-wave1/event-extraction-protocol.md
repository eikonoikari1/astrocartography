# Event Extraction Protocol

## Goal

Extract biography evidence that is actually useful for rectification, not just text that looks structured.

The key rule is simple: if an extracted item would not help discriminate candidate birth times, do not spend extraction budget on it early.

## Best Source Stack

Use sources in this order:

1. `Wikidata` for structured facts and large-scale person coverage. It is CC0 and has a SPARQL endpoint plus dump access for large result sets.
2. `Wikipedia` page text and revision history for biography narratives, dates, and timeline fragments. Use page exports or revision histories when provenance matters.
3. `Library of Congress` and `Chronicling America` for contemporaneous date anchors, especially for public events, appointments, awards, legal actions, and deaths.
4. `Pantheon` as a seed list for public figures and historical figures, mainly for cohort construction and occupation stratification.

My inference from these sources is that the best corpus is hybrid: structured metadata for coverage, biography text for event extraction, and archival text for temporal grounding.

## Event Classes Ranked By Recoverability

### Tier 1: High-recoverability, high-value events
These should be the first extraction targets.

- birth and death
- marriage and partnership start/end
- divorce and separation
- education and graduation
- appointment, office held, promotion, or institutional role changes
- awards and honors
- publication, release, or debut dates
- relocation, residence changes, migration, and exile periods
- major legal events, arrests, trials, or imprisonment
- major illness, surgery, disability onset, or recovery windows

Why these first:
- they are usually dateable
- they are often externally corroborated
- they are easier to align with timing techniques
- they tend to recur in structured sources as well as narrative biography

### Tier 2: Medium-recoverability life periods
These are useful when encoded as intervals rather than fake exact dates.

- career phases
- institutional affiliation periods
- city or country residence periods
- political or public-office eras
- creative or publication phases
- family-duty phases
- visibility or obscurity windows
- crisis-heavy or stable life periods

Why these matter:
- they often carry enough timing signal even when exact dates are missing
- they are more stable than single vague sentiment statements
- they help the system score broad coherence across a life, not only isolated events

### Tier 3: Low-value or research-only signals
These should not drive the core benchmark.

- mood or temperament adjectives
- appearance descriptors
- vague self-characterization
- generic personality summaries
- unanchored “important period” language without date support

These can be useful later as weak corroboration, but they are too easy to overfit and too hard to audit cleanly.

## What To Extract First

If extraction budget is tight, start with:

1. exact birth/death facts
2. marriage/partnership and divorce windows
3. office, appointment, education, and career transitions
4. relocations and residence periods
5. awards, publications, and public recognition
6. illness, legal, or crisis events
7. derived life periods only after the base events are stable

This ordering is deliberate. It gives the benchmark the highest-provenance facts first.

## Source Retrieval Strategy

### Wikidata
Use Wikidata for structured retrieval when the target set is large or when the query is well specified.

Useful retrieval modes:
- SPARQL for known property patterns
- dumps for large-scale traversal
- REST/API for direct entity retrieval in smaller batches

Wikidata properties that are especially useful for person benchmark construction include:
- date of birth and death
- place of birth and death
- spouse
- occupation
- educated at
- award received
- residence
- position held
- country of citizenship

### Wikipedia
Use page text for narrative event extraction and revision history for provenance.

The important thing is not to trust the latest prose blindly. Preserve:
- article URL
- revision ID
- page history or export source
- text span used for extraction

### Chronological archives
Use archives like Chronicling America when an event can be anchored to a contemporary mention.
This is especially valuable for:
- appointments
- public recognition
- deaths
- legal events
- relocations

### Pantheon
Use Pantheon as a cohort seed and occupation taxonomy anchor, not as the main event source.
It is useful when you want a known set of historically prominent figures, but it does not replace event extraction.

## Extraction Pipeline

### Step 1: Source normalization
Store:
- source URL
- source type
- access date
- revision ID or dump version
- license or reuse note

### Step 2: Entity resolution
Link the biography text and structured facts to the same person id.
Deduplicate aliases, cross-language duplicates, and repeated biographies.

### Step 3: Candidate sentence or span generation
Identify sentences or spans with:
- date expressions
- event verbs
- title/office markers
- relation markers such as spouse, married, divorced, moved, appointed, awarded, published, graduated, jailed, died

### Step 4: Normalize to controlled event types
Map spans to controlled event classes and date shapes:
- point event
- interval event
- period event
- uncertain event

### Step 5: Preserve provenance
Every extracted item should keep:
- source text span
- revision or archive reference
- date precision class
- extractor version
- reviewer status

### Step 6: Assign confidence and precision
Do not force a precise date when the source only supports a range.
Prefer an interval with confidence over a point estimate with fake certainty.

### Step 7: Human QA on a stratified sample
Spot-check or double-annotate:
- borderline event types
- high-impact events
- low-confidence extractions
- public-figure-heavy slices
- sparse-biography slices

## Realistic QA Process

The QA process should be tiered, not fully manual.

### Automatic pass
Use rules or model-assisted extraction for the full corpus.

### Manual validation pass
Audit a stratified sample by:
- source type
- century
- language
- biography density
- event class
- extraction confidence

### Adjudication pass
Double-annotate ambiguous items and resolve disagreements with a reviewer.

This is realistic because prior biography-event work has used small annotated corpora successfully. The event guidelines paper reported 1,000 annotated sentences with 4 annotators and an average inter-annotator agreement of 0.825, which is strong enough to justify a sampled human-audit layer rather than total manual labeling.

## What To Measure In QA

Measure quality by event class, not just overall.

Track:
- precision of event type
- precision of date shape
- provenance capture completeness
- entity-linking accuracy
- span alignment accuracy
- period boundary accuracy
- reviewer disagreement rate

For rectification, precision matters more than raw recall. Missing a marginal event is less damaging than admitting a false one that poisons timing alignment.

## Date Precision Rules

Preserve date precision explicitly:
- exact day
- month-only
- year-only
- interval
- approximate
- unknown

Never collapse a period into a point just because downstream code prefers it.

If the source is retrospective or vague, represent the uncertainty directly.

## Recommended Corpus Behavior

The corpus should end up as a mixture of:
- exact facts for hard anchors
- intervals for life periods
- sparse but high-confidence events for timing tests
- rejected or quarantined records for noisy cases

That is enough for a serious benchmark. It is not enough to pretend every biography is equally crisp.

## Source Anchors

- [Wikidata data access and dump guidance](https://www.wikidata.org/wiki/Help:Data_access)
- [Wikidata SPARQL query service](https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service)
- [Wikidata infobox mappings for person properties](https://www.wikidata.org/wiki/Wikidata:Infobox_mappings)
- [Wikipedia export and revision history guidance](https://www.mediawiki.org/wiki/Help:Export)
- [Chronicling America API via the Library of Congress](https://www.loc.gov/apis/additional-apis/chronicling-america-api/)
- [Library of Congress JSON/YAML API](https://www.loc.gov/apis/json-and-yaml/)
- [Guidelines and a Corpus for Extracting Biographical Events](https://arxiv.org/abs/2206.03547)
- [BiographyNet: Extracting Relations Between People and Events](https://research.vu.nl/en/publications/biographynet-extracting-relations-between-people-and-events-2/)
- [EventKG+BT: Generation of Interactive Biography Timelines from a Knowledge Graph](https://arxiv.org/abs/2012.06306)
- [Paths of A Million People: Extracting Life Trajectories from Wikipedia](https://arxiv.org/abs/2406.00032)
