# Deep Research Plan

## Purpose

Define the exact research program needed to test the renewed rectification thesis under real data conditions.

This document is not an implementation spec.
It is the research-operating manual that says:
- what to collect
- what to compute
- what to compare
- what to measure
- what would justify continuing
- what would force a narrower claim

## Core Research Objective

Determine whether deterministic timing-based scoring over a full-day candidate grid produces reproducible, calibrated concentration near the true birth time on an audited open-source corpus of known-time public and historical figures.

## Research Principles

1. Start with the full 24-hour frame.
2. Treat provenance as part of the target.
3. Prefer structured externally anchored evidence over self-description.
4. Benchmark techniques separately before combining them.
5. Compare against strong non-astrological baselines from the start.
6. Report full-population and selected-subset metrics separately.
7. Add complexity only after empirical lift is shown.

## Research Tracks

### Track A: Corpus Construction
Build an audited benchmark slice from open-source known-time figures.

Key questions:
- Which sources can supply enough known-time cases with traceable provenance?
- Which classes of people are overrepresented?
- How often do exact-looking times turn out to be rounded or weakly sourced?

Deliverables:
- source inventory
- provenance rubric
- audited gold/challenge/quarantine manifests
- cohort bias report

### Track B: Evidence Extraction
Turn biographies into timing-relevant evidence packets.

Key questions:
- Which event classes are extractable reliably enough to benchmark?
- Which life periods can be encoded without forcing fake exact dates?
- How should date precision and provenance be preserved at extraction time?

Deliverables:
- event schema
- life-period schema
- extraction protocol
- extraction QA rubric

### Track C: Timing-Technique Behavior
Measure how individual techniques behave across the full day.

Key questions:
- Which techniques produce useful score gradients?
- Which techniques only help once the time is already almost known?
- Which techniques collapse under fuzzy date windows?

Deliverables:
- technique-specific scoring functions
- per-technique behavior reports
- corpus-level separability maps

### Track D: Baselines And Controls
Pressure-test the timing engine against non-astrological competitors and fake-signal conditions.

Key questions:
- How much signal survives against biography-only baselines?
- Are gains robust under label shuffling, event fuzzing, and provenance stratification?
- Is the system learning timing structure or corpus artifacts?

Deliverables:
- biography-only baseline
- shuffled and placebo controls
- leakage and shortcut report

### Track E: Separability And Subset Validation
Test whether a high-separability subset exists and matters in practice.

Key questions:
- How common are minute-eligible cases in the audited population?
- Does triage identify them without hiding failure?
- How much of the project’s apparent performance depends on selected easy cases?

Deliverables:
- weighted subset prevalence estimate
- triage validation report
- selected vs full-population score table

### Track F: Incremental Additions
Test whether any added layer deserves inclusion in the core path.

Candidate additions:
- structured interview families
- pairwise candidate comparisons
- extra timing techniques
- doctrine-specific experts

Deliverables:
- marginal lift reports
- calibration impact reports
- keep/cut decisions

## Research Questions By Order Of Importance

### Q1. Does timing-based scoring create real full-day concentration near the true time?
This is the core question. If the answer is mostly no, the project should narrow its target.

### Q2. Which techniques are most discriminative at which resolution?
Need to know whether a technique helps at:
- 24h to 4h
- 4h to 30m
- 30m to 10m
- 10m to 2m

### Q3. Which event and period types drive the most useful signal?
Need to separate:
- marriage and partnership windows
- relocation periods
- profession transitions
- public recognition periods
- health crisis windows
- death dates

### Q4. How much of the apparent signal survives strong baselines and controls?
This determines whether there is any astrology-specific value to pursue.

### Q5. How large is the practically relevant high-separability subset?
This determines whether `±2 min` is a niche feature or a real product path.

### Q6. Does structured interview data add real value on top of timing-based scoring?
This should be tested only after the timing core is characterized.

## Research Sequence

### Sequence 1: Corpus Audit Before Modeling
Do not score anything before:
- provenance audits
- local-time preservation checks
- timezone and DST checks
- minute-heaping checks

### Sequence 2: Individual Techniques Before Bundles
Do not combine multiple techniques before measuring each one in isolation.

### Sequence 3: Full-Day Surfaces Before Narrow-Window Experiments
Do not let the system start in an already narrowed window. First prove that the true region stands out across the full day.

### Sequence 4: Baselines Before Additions
Do not add interviews or extra doctrines until the timing-only system has been benchmarked against strong non-astrological baselines.

## Research Outputs Needed For Each Sequence

### After Sequence 1
- audited corpus statistics
- source quality distribution
- gold/challenge cohort manifest

### After Sequence 2
- technique-by-technique score distributions
- resolution-specific performance table
- event-family contribution table

### After Sequence 3
- full-day rank distributions
- multimodality analysis
- separability maps

### After Sequence 4
- baseline comparison report
- control-condition report
- go/no-go decision on incremental additions

## Decision Gates

### Gate 1: Corpus Gate
Proceed only if the audited corpus is large and diverse enough to support evaluation by provenance strata.

### Gate 2: Timing Gate
Proceed only if at least one small technique bundle shows non-trivial full-day concentration on the strict gold set.

### Gate 3: Baseline Gate
Proceed only if the timing bundle beats biography-only baselines under the same evidence budget.

### Gate 4: Subset Gate
Proceed with `±2 min` research only if the high-separability subset has both:
- measurable prevalence
- practical significance

### Gate 5: Interview Gate
Proceed with interactive research only if structured interview additions improve timing-based posteriors on the frozen benchmark.

## Strong Recommendation

The first deep-research milestone should not be "a working rectification app."
It should be:

"A corpus-scale timing behavior report that shows which techniques produce real separability across the full day on audited known-time figures."

That is the cleanest place to learn whether the thesis deserves larger investment.
