# Empirical Method

## Goal

Measure how open-source known-time corpora behave under timing techniques across the full 24-hour frame.

This is the first real truth test for the project.

## Core Research Question

For a given person with known birth time hidden from the model, do advanced timing techniques produce a meaningfully better score near the true time than elsewhere across the day?

## Corpus Strategy

Use open-source, publicly documented people and historical figures as the initial benchmark slice.

Priority sources:
- structured facts from Wikidata
- biography text and timelines from Wikipedia or comparable sources
- contemporaneous newspapers or archives when available
- known birth-time sources with provenance and audit notes

Use public figures as a benchmark slice, not as the whole population model.

## Unit Of Analysis

The unit is not just the person.
The key unit is:

`person x candidate time bin x timing technique x evidence packet`

This allows the system to learn how techniques behave across the full day instead of only at the final selected time.

## Evidence Types

The first-pass corpus should extract:
- exact events
- date windows
- life periods
- profession and role transitions
- marriage or partnership windows
- relocation windows
- major illness, crisis, or public visibility periods
- death date where applicable

Each item should preserve:
- original source
- date precision
- provenance
- whether the item is contemporaneous or retrospective

## Timing Behavior Analysis

For each person and each candidate time across the day:
- compute the chart
- compute selected timing outputs
- compare those outputs against the evidence packet
- produce a coherence score

Then summarize:
- where the true time ranks
- whether the score surface has one peak or several
- whether nearby regions are separable
- which techniques contribute useful structure

## First Technique Set

Keep the first set small and technically defensible.

Suggested starting set:
- transits
- secondary progressions
- solar arcs
- profections
- one more advanced method only if its birth-time sensitivity is explicit and auditable

Do not start with every school and every technique.

## Metrics

Measure at least:
- true-bin rank over the full day
- `% within ±2 min`
- `% within ±5 min`
- `% within ±10 min`
- `% within ±30 min`
- posterior entropy reduction
- number of distinct posterior modes
- technique contribution by event type
- performance by provenance tier
- selected-set and full-population performance

## What Counts As A Positive Result

A technique or technique bundle is promising only if:
- it creates real score concentration near the true time on a non-trivial audited subset
- it beats biography-only baselines
- it remains useful after date fuzzing and leakage controls
- it stays calibrated

## What Does Not Count

The following are not enough:
- one or two compelling case studies
- performance only on public figures with rich biographies
- success only after heavy triage
- strong selected-set results with weak full-population results
- apparent gains that vanish under shuffled or counterfactual controls

## Role Of Interview Data

The interview should enter only after timing behavior is characterized.

At that point, the question becomes:

Can structured interview answers improve a timing-based posterior that already shows real separation?

That is a much cleaner test than asking whether interviews can rescue an unproven timing core.
