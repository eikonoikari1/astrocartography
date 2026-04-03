# Experiment Matrix

This matrix defines the exact experiments that should be run against the renewed approach.

## Experiment E1: Source Inventory And Licensing Audit

- Purpose: identify usable open-source corpora and any reuse constraints.
- Inputs: Wikidata, Wikipedia, public archives, public historical datasets, any known-time public figure sources with explicit provenance.
- Output: approved source list, prohibited source list, source-risk notes.
- Success condition: enough sources to build a benchmark without licensing ambiguity.
- Failure condition: open-source known-time labels are too scarce or too weakly documented.

## Experiment E2: Provenance Audit Pilot

- Purpose: test how many known-time records survive strict gold/challenge routing.
- Inputs: first 200 to 500 candidate people from open-source sources.
- Output: audit labels, reason-code frequencies, heaping rates.
- Success condition: strict gold subset exists in useful numbers.
- Failure condition: exact-looking times mostly collapse into challenge, quarantine, or reject.

## Experiment E3: Event Extraction Reliability Pilot

- Purpose: measure whether biographies can be turned into structured timing evidence accurately enough.
- Inputs: biography text, structured metadata, manually reviewed sample.
- Output: extraction precision by event class and date precision class.
- Success condition: a small set of event and period classes can be extracted reliably.
- Failure condition: extraction is too noisy or too dependent on public-figure formatting conventions.

## Experiment E4: Full-Day Technique Behavior Sweep

- Purpose: measure how one technique behaves across the full 24-hour candidate grid.
- Inputs: audited gold cohort, one technique, structured evidence packets.
- Output: per-person score surfaces, true-bin rank, mode count, error distributions.
- Success condition: score concentration near true time is better than null on a non-trivial subset.
- Failure condition: surfaces are flat, random, or highly unstable.

## Experiment E5: Resolution Ladder Test

- Purpose: determine which techniques help at which precision regime.
- Inputs: same as E4, evaluated at 24h, 4h, 30m, 10m, 2m targets.
- Output: technique-resolution matrix.
- Success condition: at least some techniques show predictable operating ranges.
- Failure condition: no technique shows reliable lift at the fine-resolution stages.

## Experiment E6: Date Fuzzing Robustness Test

- Purpose: see how sensitive techniques are to realistic event-date uncertainty.
- Inputs: event packets with original dates and systematically fuzzed variants.
- Output: performance degradation curves by technique and evidence type.
- Success condition: useful techniques degrade gracefully.
- Failure condition: signal disappears under small date uncertainty.

## Experiment E7: Biography-Only Baseline

- Purpose: establish a serious non-astrological competitor.
- Inputs: same biography and structured evidence budget, but no chart-derived features.
- Output: baseline score tables on same cohorts and metrics.
- Success condition: the timing system beats this baseline on strict gold.
- Failure condition: biography-only matches or exceeds the timing system.

## Experiment E8: Leakage And Shortcut Controls

- Purpose: detect fake success from corpus artifacts.
- Inputs: shuffled labels, shuffled events, collector holdouts, public-figure holdouts, placebo features.
- Output: control-condition failure map.
- Success condition: timing-based gains survive the controls.
- Failure condition: apparent gains collapse under controls.

## Experiment E9: Technique Bundle Test

- Purpose: see whether combining a small technique set improves over single techniques.
- Inputs: top-performing techniques from E4 and E5.
- Output: bundle-vs-single-technique comparison.
- Success condition: calibrated lift beyond the best single technique.
- Failure condition: bundle adds variance or false confidence.

## Experiment E10: High-Separability Prevalence Estimate

- Purpose: estimate how common minute-eligible cases are.
- Inputs: frozen audited sample, triage-independent separability audit, weights.
- Output: weighted prevalence estimate and confidence interval.
- Success condition: subset prevalence and practical utility are both non-trivial.
- Failure condition: subset exists but is too small or too selected to justify the target.

## Experiment E11: Triage Validation

- Purpose: test whether triage finds separable cases without hiding difficulty.
- Inputs: frozen triage rule and frozen benchmark cohort.
- Output: false-high, missed-high, selection rate, selected and full-population performance.
- Success condition: triage improves efficiency without distorting claims.
- Failure condition: selected-set success hides weak full-population performance.

## Experiment E12: Interview Increment Test

- Purpose: determine whether structured question families add value after timing-based scoring.
- Inputs: timing-based posterior plus ranked interview families.
- Output: posterior contraction delta, calibration delta, question-budget efficiency.
- Success condition: interview adds measurable value over timing-only.
- Failure condition: interview mostly adds narrative smoothness or false confidence.

## Experiment E13: Doctrine Expansion Test

- Purpose: decide whether extra schools or doctrine-specific experts deserve inclusion.
- Inputs: strongest base system plus one added doctrine path at a time.
- Output: marginal lift report.
- Success condition: added doctrine improves discrimination or calibration.
- Failure condition: added doctrine increases flexibility without reliable lift.

## Recommended Experiment Order

1. E1
2. E2
3. E3
4. E4
5. E5
6. E6
7. E7
8. E8
9. E9
10. E10
11. E11
12. E12
13. E13

## Core Rule

Do not run E12 or E13 as core-product research until E4 through E8 show real timing-based signal.
