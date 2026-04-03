# Execution Plan Application

This document maps the renewed execution plan to exact research work.

## Phase 1: Corpus And Audit

### Research Goal
Determine whether a usable audited corpus can be built from open-source public and historical figures.

### Exact Research Work
- Run E1 source inventory and licensing audit.
- Run E2 provenance audit pilot on the first candidate pool.
- Run E3 event extraction reliability pilot.

### What To Test
- source usability
- birth-time provenance strength
- event extraction quality
- date precision distribution
- heaping behavior by source family

### Outputs Needed To Proceed
- approved source list
- first audited cohort
- extraction QA report
- gold/challenge routing statistics

## Phase 2: Deterministic Full-Day Scoring

### Research Goal
Measure whether timing techniques create full-day separability on the audited cohort.

### Exact Research Work
- Run E4 full-day technique behavior sweep.
- Run E5 resolution ladder test.
- Run E6 date fuzzing robustness test.

### What To Test
- true-bin rank
- local peak sharpness
- multimodality
- technique sensitivity to date fuzziness
- contribution by event type and evidence packet type

### Outputs Needed To Proceed
- technique ranking
- resolution operating ranges
- separability maps
- failure cases by provenance tier

## Phase 3: Baselines And Controls

### Research Goal
Determine whether timing-based scoring is doing more than biography-driven ranking.

### Exact Research Work
- Run E7 biography-only baseline.
- Run E8 leakage and shortcut controls.
- Run E9 technique bundle test.

### What To Test
- timing system versus biography-only
- robustness under shuffled and placebo conditions
- whether bundles outperform singles
- calibration changes under controls

### Outputs Needed To Proceed
- baseline comparison report
- control failure map
- justified base technique bundle

## Phase 4: Separability And Triage Validation

### Research Goal
Check whether the subset thesis is true and practically relevant.

### Exact Research Work
- Run E10 high-separability prevalence estimate.
- Run E11 triage validation.

### What To Test
- weighted subset prevalence
- false-high rate
- missed-high rate
- selected versus full-population performance
- practical utility of triage in question and compute savings

### Outputs Needed To Proceed
- prevalence estimate with interval
- triage utility report
- decision on the viability of `±2 min`

## Phase 5: Incremental Additions Only If Earned

### Research Goal
Only add new layers that produce real lift.

### Exact Research Work
- Run E12 interview increment test.
- Run E13 doctrine expansion test.

### What To Test
- posterior contraction delta
- calibration delta
- interval-width delta
- failure under controls
- complexity cost relative to lift

### Outputs Needed To Proceed
- keep/cut decision on interview layer
- keep/cut decision on doctrine expansion

## Recommended Weekly Cadence

### Week 1
- source inventory
- provenance audit pilot
- event extraction pilot

### Week 2
- first audited cohort freeze
- first single-technique full-day sweep

### Week 3
- resolution ladder
- date fuzzing
- first baseline build

### Week 4
- leakage controls
- technique bundle test
- first separability report

### Week 5+
- prevalence estimate
- triage validation
- incremental additions only if earned

## Decision Discipline

At the end of each phase, ask one narrow question:

- Phase 1: Do we have a corpus worth modeling?
- Phase 2: Do timing techniques create real separation?
- Phase 3: Does that separation beat strong non-astrological alternatives?
- Phase 4: Is the separable subset large and useful enough to matter?
- Phase 5: Does added complexity earn its keep?

If a phase cannot answer its question positively, narrow the project before moving forward.
