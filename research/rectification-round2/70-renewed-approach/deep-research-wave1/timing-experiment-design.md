# Timing Experiment Design

## Purpose

Define the first corpus-scale experiment for the renewed rectification approach.

The goal is not to prove rectification in general.
The goal is narrower:

Can full-day candidate scoring produce stable, measurable concentration near the true birth time on an audited known-time corpus?

If the answer is weak, the project should narrow its claim before adding more machinery.

## Core Premise

The birth time starts unknown over the full 24-hour frame.

The experiment must therefore begin with:
- a full-day candidate grid
- no pre-chosen AM/PM shortcut
- no early narrowing to a small window
- no interview rescue assumption

The score surface should be allowed to stay multimodal. A case can have several live regions at once.

## Corpus Reality Check

Open biographies are easier to find than open exact birth times.

That means the corpus will likely have two different source layers:

### Layer 1: Open biography and event evidence
Use openly accessible sources for:
- structured life facts
- biographies
- event timelines
- public recognition dates
- career transitions
- death dates

Good open sources for this layer:
- [Wikidata](https://www.wikidata.org/wiki/Wikidata%3AData_access) for structured facts
- [Wikidata SPARQL service](https://www.wikidata.org/wiki/Wikidata%3ASPARQL_query_service) for targeted extraction
- [Wikipedia dumps and licensing guidance](https://dumps.wikimedia.org/legal.html)
- [Pantheon 1.0](https://www.nature.com/articles/sdata201575) for manually verified famous-biography structure
- [Library of Congress JSON/YAML API](https://www.loc.gov/apis/json-and-yaml/)
- [Chronicling America API](https://www.loc.gov/apis/additional-apis/chronicling-america-api/)

### Layer 2: Known-time label sources
Exact birth times are the bottleneck.

For labels, use only records with explicit provenance and auditability.
If a source is public but not bulk-open, treat it as a manual label source rather than pretending it is a clean open dataset.

Important constraint:
- [Astro-Databank](https://www.astro.com/astro-databank/Astro-Databank%3ACopyright) is publicly accessible, but spidering is not permitted.
- It is useful as a provenance index and label reference, not as a bulk-open scraper target.

That means the first benchmark slice will probably be smaller than the biography corpus.
That is acceptable.
Small and audited is better than large and contaminated.

## Corpus Design

Build a stratified known-time corpus with these slices:
- strict gold
- challenge
- low-provenance stress
- public-figure-rich
- sparse-biography

The point is to see where the system genuinely works and where it only looks good because the biographies are unusually rich.

## Experimental Unit

The unit of analysis is:

`person x candidate_time_bin x technique x evidence_packet`

This matters because the project is not trying to classify people.
It is trying to rank birth-time candidates using timing coherence.

## Evidence Packet Structure

Extract and store:
- exact events
- date windows
- life periods
- profession and role transitions
- marriage or partnership windows
- relocation windows
- major illness or crisis periods
- public recognition periods
- death date where relevant

Each item should preserve:
- source text span
- source identity
- date precision class
- whether the source is contemporaneous or retrospective
- provenance strength

Do not collapse life periods into fake exact dates.
Do not collapse weak sources into clean labels.

## Candidate Grid Plan

The first full-day sweep should be coarse enough to be feasible and fine enough to detect structure.

Recommended ladder:
1. full-day grid at 10-minute bins
2. refine the top 1 to 3 regions to 2-minute bins
3. refine near-ties or high-value cases to 30-second bins only if the score surface remains promising

Why this order:
- 10-minute bins reveal whether the day contains any obvious structure
- 2-minute bins test the core claim
- 30-second bins are a stress test, not the default

Do not start at 2 minutes for the entire day if the corpus is still small.
Do not reduce to a single window before you know the surface is unimodal.

## Scoring Framework

For each candidate time:
1. cast the chart deterministically
2. compute timing outputs for the chosen technique pack
3. compare predicted activations to the evidence packet
4. produce a candidate score

The score should have separate channels:
- exact event match
- date-window overlap
- life-period coherence
- profession / role coherence
- annual chapter coherence

### Event scoring
Exact events should receive the strongest weight.
Use a kernel or distance penalty around the evidence window rather than a binary hit/miss rule.

### Period scoring
Life periods should be scored by overlap with predicted activation windows and by continuity of theme.

### Aggregation
Per technique, produce a score surface over the candidate bins.
Then normalize within person before combining across techniques.

That prevents one verbose technique from dominating just because it emits more output.

## Per-Person Score Surfaces

For each person, store:
- score by bin
- top-3 candidate windows
- number of distinct local maxima
- width of the strongest peak
- gap between first and second peak
- true-bin rank
- selected-set versus full-population score

The surface should be visualizable as a heatmap or ridgeline plot.
It should also be exportable as a simple vector for benchmarking.

## Fast Separability Test

The first experiment should try to falsify separability quickly.

Run this sequence:
1. Freeze the audited corpus.
2. Pick the strongest 30 to 50 cases first.
3. Score each case with one technique at a time.
4. Compare the true-bin rank and peak structure against shuffled and placebo controls.
5. Only then test bundles.

If no single technique creates meaningful concentration on the strict gold slice, do not add complexity yet.

## Technique Resolution Ladder

Test each technique at multiple target resolutions:
- 24h
- 4h
- 1h
- 30m
- 10m
- 2m

This shows where each technique actually starts to help.

The key question is not just whether a technique works.
It is:

At what resolution does it begin to work?

## Controls

Every timing experiment should include:
- shuffled birth times
- shuffled event assignments
- biography-only baseline
- placebo features
- event-date fuzzing

This is the only way to tell timing structure from biography structure or archive artifacts.

## Statistical Design

Use person-level splits only.
Use paired comparisons within person.
Use bootstrap confidence intervals by person, not by bin.
Use permutation tests for technique lift.

Do not report only a few case studies.
Do not report only the selected easy subset.

## What Counts As A Positive Signal

A technique or bundle is only promising if it:
- concentrates near the true time on a non-trivial audited subset
- beats biography-only baselines
- survives shuffled and placebo controls
- remains calibrated under fuzzing

## What Fails The Experiment

The experiment fails if:
- the surface is flat
- the best peaks are mostly artifacts of source richness
- the selected subset looks good but the full population does not
- the signal disappears under small date fuzzing
- the baseline is as good as the timing system

## How To Apply This Against The Execution Plan

### Phase 1: Corpus And Audit
Use the source layers above to build the audited benchmark slice.
Do not start scoring until the provenance and heaping audits are done.

### Phase 2: Deterministic Full-Day Scoring
Run the 10-minute full-day sweep first.
Then refine only the promising cases.

### Phase 3: Baselines And Controls
Compare against biography-only and shuffled controls before expanding techniques.

### Phase 4: Separability And Triage Validation
Estimate how large the high-separability subset really is.
If the subset is tiny, the product target must narrow.

### Phase 5: Incremental Additions
Only after the core timing sweep earns its keep should interviews or doctrine expansion enter the core path.

## Recommended First Milestone

The first milestone should be:

"A corpus-scale timing behavior report that shows which techniques create measurable score concentration near the true time on audited known-time figures."

That is the right truth test.
