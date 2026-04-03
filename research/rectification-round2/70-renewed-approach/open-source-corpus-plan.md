# Open-Source Corpus Plan

## Goal

Build a reproducible benchmark corpus of known-time public and historical figures suitable for provenance-aware rectification research.

## Corpus Design Principles

1. Birth-time labels need provenance, not just precision formatting.
2. Biography text should mainly feed structured extraction, not direct prediction.
3. Public figures are a benchmark slice, not the whole target population.
4. Source diversity matters because one archive can create one artifact regime.

## Source Layers

### Layer 1: Structured Metadata
Use for:
- birth date
- death date
- birth and death place
- occupation
- positions held
- spouse and family relations
- citizenship
- awards

Preferred candidates:
- Wikidata
- structured archival APIs

### Layer 2: Biography Text
Use for:
- extracting dated events
- extracting life periods
- extracting role transitions

Preferred candidates:
- Wikipedia pages
- public encyclopedia biographies
- digitized archive summaries

### Layer 3: Contemporaneous Support
Use for:
- verifying event dates
- reducing retrospective distortions
- anchoring major transitions

Preferred candidates:
- newspaper archives
- public library archives
- public chronologies

### Layer 4: Birth-Time Provenance
Use for:
- known-time labels
- source note audits
- routing into gold or challenge

Preferred candidates:
- public repositories or pages that preserve source notes and provenance classes
- public scans where available

## Person Inclusion Criteria

A person enters the candidate pool if:
- they have a retrievable birth date and place
- they have a plausible known-time source or explicit time-status record
- they have enough biography or event evidence to support full-day scoring

## Person Exclusion Criteria

Exclude or defer people when:
- the time is only repeated without provenance
- the biography is too sparse for any timing evaluation
- the person is only represented by astrology-specific retellings
- the text corpus is too repetitive or near-duplicate

## Evidence Packet Design

For each person, create:
- structured metadata packet
- event packet
- life-period packet
- provenance packet
- birth-time audit packet

These should be stored separately so the benchmark can ablate them cleanly.

## Event Classes To Prioritize

Prioritize event and period classes most likely to be externally anchorable:
- marriage
- divorce or separation
- death
- relocation
- career appointment
- major publication or breakthrough
- imprisonment or legal crisis
- severe illness or surgery
- award or public recognition

Delay weaker classes until later:
- mood descriptions
- broad personality summaries
- appearance descriptors

## Corpus Slices

At minimum create:
- strict gold slice
- challenge slice
- public-figure-rich slice
- sparse-biography slice
- different provenance-tier slices

This makes it possible to see where the system is truly working.

## Extraction QA

For each extracted event or period, store:
- source text span
- extracted normalized value
- date precision class
- extraction method
- reviewer status
- source provenance

Run manual QA on a sampled subset before trusting large-scale extraction.

## Biases To Measure Early

- profession skew
- geography skew
- language skew
- century skew
- public-visibility skew
- source-family skew

The corpus report should show these explicitly.

## First Corpus Milestone

The first acceptable corpus milestone is not "large."
It is:

"small, audited, provenance-aware, and diverse enough to expose whether timing-based separability exists."

## Immediate Next Task

Create a source inventory spreadsheet or manifest with columns for:
- source name
- access method
- license
- data type
- provenance quality
- birth-time usefulness
- event usefulness
- archive bias risk
