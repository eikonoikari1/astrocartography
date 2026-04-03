# Benchmark Spec

## Benchmark Goal
Measure whether a rectification system can narrow a 24-hour uncertainty range into a calibrated, defensible interval, not just produce a persuasive story.

## Dataset Rules
- Split by person, not by session.
- Keep all sessions for one person on the same side of the split.
- Preserve source provenance and data-quality flags.
- Track whether each birth time is exact, timed official, approximate, or rectified.
- Do not mix training and evaluation on the same person.

## Benchmark Tasks
1. Full-day rectification from a broad prior.
2. Narrow-window refinement after a coarse posterior exists.
3. Event-only timing.
4. Adaptive QA with and without pairwise questions.
5. Baseline comparison against biography-only and random controls.
6. Robustness to label noise and rounded timestamps.

## Primary Metrics
- Top-1 absolute time error in minutes.
- Median absolute error.
- `% within ±2 min`.
- `% within ±5 min`.
- `% within ±10 min`.
- Top-K coverage.
- Posterior entropy reduction per question.

## Calibration And Interval Metrics
- Coverage of the reported interval.
- Average interval width.
- Selective risk at fixed coverage.
- Risk-coverage curve.
- Expected calibration error for the posterior or final confidence scores.

## Efficiency Metrics
- Questions needed to reach a target interval width.
- Human effort per successful rectification.
- Marginal information gain per question family.

## Control Metrics
- Performance on shuffled-label controls.
- Performance on biography-only baseline.
- Performance on static questionnaire baseline.
- Leakage checks for repeated people, duplicated biographies, or repeated event patterns.

## Acceptance Criteria
The benchmark is only meaningful if:
- The model beats the strongest non-astrological baseline.
- The reported intervals are calibrated.
- The system can abstain rather than force a false exact time.
- Results remain stable under bootstrap resampling and label-noise stress tests.

## Reporting Format
Every benchmark run should report:
- Dataset version.
- Split protocol.
- Evidence families enabled.
- Calibration method.
- Abstention rule.
- Full metric table.

## Source Anchors
- [Settles, Active Learning Literature Survey](https://burrsettles.com/pub/settles.activelearning.pdf)
- [Chaloner & Verdinelli, Bayesian Experimental Design: A Review](https://people.eecs.berkeley.edu/~jordan/courses/260-spring10/readings/chaloner-verdinelli.pdf)
- [Conformal Prediction: A Unified Review of Theory and New Challenges](https://arxiv.org/abs/2005.07972)
- [On Calibration of Modern Neural Networks](https://proceedings.mlr.press/v70/guo17a/guo17a.pdf)
