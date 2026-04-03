# Core Thesis

## Position

The project should be rebuilt around one central question:

Can a full-day candidate grid be meaningfully narrowed by reverse-engineering real biographies through advanced timing techniques, under strict provenance control and against strong non-astrological baselines?

If the answer is weak, the rest of the architecture does not matter.

## What Changes

The prior research stack was strongest in audit discipline, benchmark design, and uncertainty handling. It was weaker in proving that the required signal exists. The renewed approach fixes that imbalance.

The project should now assume:
- the birth time is fully unknown at the start
- the full 24-hour frame remains live until evidence removes regions
- minute-level claims are earned only when local geometry and life-history coherence justify them
- vague self-report is weak evidence
- public biographies are useful mainly for structured event and period extraction

## Core Methodological Shift

The main engine should be reverse-timing coherence, not interview-led narrowing.

For each candidate time across the day:
- build the chart
- compute timing outputs across chosen techniques
- compare predicted activation structure against observed events and life periods
- score coherence

Then compare the entire day, not just a pre-narrowed window.

This turns rectification into a structured ranking problem over the full day.

## What Stays

The following parts of the earlier research remain correct and important:
- provenance is part of the label
- gold/challenge/quarantine/reject routing
- minute-heaping audits
- calibrated interval output
- abstention
- strict biography-only and shuffled baselines
- selected-set and full-population reporting

## What Is Demoted

### Adaptive QA
Adaptive QA is no longer treated as a primary narrowing engine.

It becomes an add-on only after:
- timing-only and corpus-based scoring show real separation
- interview items prove incremental value against controls

### Pairwise narratives
Useful only if the benchmark later shows that they improve posterior contraction beyond timing-only and structured biography inputs.

### Doctrine fusion
Early multi-school fusion is unnecessary complexity.
Start with a small number of techniques and schools, benchmark them separately, and only fuse later if the lift is real.

### Multimodal inputs
Appearance, voice, and free-form text should stay out of the core path. They are high-risk for proxy leakage and low-priority for the first truth test.

## Practical Thesis

The project should behave like this:

1. Build a trustworthy known-time corpus.
2. Score the full day with deterministic timing-based methods.
3. Measure separability across techniques, event types, and data-quality strata.
4. Benchmark against strong non-astrological alternatives.
5. Only then decide whether the interview layer deserves core status.

## Main Scientific Risk

The main risk is not that the model will be underpowered.
The main risk is that the apparent signal will come from:
- provenance artifacts
- rounding artifacts
- public-figure documentation density
- biography regularities
- retrospective narrative fit

This renewed approach is built to force those risks into the open early.
