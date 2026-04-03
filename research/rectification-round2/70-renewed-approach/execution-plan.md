# Execution Plan

## Objective

Move from research specification to the smallest empirical program that can justify or kill the rectification thesis quickly.

## Phase 1: Corpus And Audit

### Goal
Build the first open-source known-time benchmark slice with provenance-aware labels.

### Tasks
- [ ] Define target source list for open-source public figures and historical people.
- [ ] Build ingestion scripts for structured metadata, biography text, and dated events.
- [ ] Apply the gold/challenge/quarantine/reject audit workflow to the available birth-time records.
- [ ] Run minute-heaping and provenance audits before any modeling.
- [ ] Freeze a first benchmark cohort with person-level splits.

### Output
- audited corpus manifest
- gold set
- challenge set
- source and provenance report

## Phase 2: Deterministic Full-Day Scoring

### Goal
Measure timing-technique behavior across the whole 24-hour frame.

### Tasks
- [ ] Implement a candidate grid over the full day at coarse resolution first.
- [ ] Compute deterministic chart features for every bin.
- [ ] Implement the first small set of timing techniques.
- [ ] Score each candidate bin against extracted event and life-period evidence.
- [ ] Produce per-person and corpus-level score surfaces.

### Output
- full-day timing score maps
- true-bin rank summaries
- technique-by-technique behavior reports

## Phase 3: Baselines And Controls

### Goal
Determine whether the timing engine beats strong non-astrological alternatives.

### Tasks
- [ ] Implement the strongest biography-only baseline allowed by the evidence budget.
- [ ] Run shuffled-label, shuffled-event, and placebo-feature controls.
- [ ] Evaluate both selected and full-population performance.
- [ ] Test robustness under date fuzzing and provenance stratification.

### Output
- baseline comparison report
- leakage and shortcut report
- control-condition benchmark table

## Phase 4: Separability And Triage Validation

### Goal
Check whether the subset thesis holds in the real corpus.

### Tasks
- [ ] Estimate weighted prevalence of high-separability cases.
- [ ] Validate the triage rule on the frozen cohort.
- [ ] Compare selected-set and full-population metrics.
- [ ] Quantify false-high and missed-high rates.

### Output
- separability prevalence report
- triage validation report
- decision on whether `±2 min` remains viable

## Phase 5: Incremental Additions Only If Earned

### Goal
Add complexity only where there is proven empirical lift.

### Candidate additions
- structured interview families
- pairwise candidate comparisons
- extra timing techniques
- extra doctrine experts

### Rule
No addition enters the core path unless it improves:
- discrimination
- calibration
- or posterior contraction

without increasing false confidence.

## Build Priority

If time is limited, do this order only:
1. corpus and audit
2. full-day deterministic scoring
3. biography-only baseline
4. separability reporting
5. everything else

## What To Avoid

- building the full interview engine before timing signal is demonstrated
- adding multimodal inputs early
- treating public-figure richness as representative
- expanding doctrine coverage before one strong baseline works
- optimizing for elegant architecture before the benchmark proves the core claim
