# Separability Benchmark Protocol

## Purpose
Turn the separability idea into an evaluation-ready procedure that decides when minute-level refinement is justified.

The protocol must answer two questions:
- Can the system distinguish nearby candidate times?
- Does the triage step identify the cases where minute-level refinement is actually worth doing?

## Core Benchmark Objects

### Candidate-Time Grid
- Full-day grid over the birth date and location.
- Default resolution: `2` minutes.
- Refinement resolution: `30` seconds or `1` minute only inside the top posterior mass.

### Chart Neighborhoods
For every chart, evaluate local neighborhoods at:
- `2` minutes
- `5` minutes
- `10` minutes
- `15` minutes

These are the separability scales reported in the benchmark.

### Evidence Families
Evaluate the same chart under these evidence bundles:
- geometry only
- event windows only
- life-structure interview only
- pairwise candidate comparisons only
- combined evidence

## Dataset Partitioning
- Split by person, not by session.
- Keep all sessions for one person in the same fold.
- Preserve provenance labels and noise strata.
- Separate the strict gold set from the broader challenge set.
- Do not mix documentary times, quoted times, and rectified times in the same core score without stratification.

## Step 1: Triage Before Refinement
Run the triage classifier on every chart before any adaptive questioning.

Record:
- triage label
- triage score
- reasons for the label
- whether the chart was admitted to minute-level refinement

This step must be frozen before model comparison so the benchmark does not cherry-pick easy cases after seeing outcomes.

## Step 2: Local Separability Estimation
For each chart, compute a local separability profile across the neighborhood grid.

Recommended measures:
- adjacent-bin likelihood ratio
- posterior entropy drop after each evidence family
- top-1 versus top-2 posterior gap
- chart-feature delta across the local neighborhood
- stability under bootstrap resampling

Define a chart as minute-level eligible only if the separability profile and provenance quality both clear the validation threshold:
- the `2`-minute neighborhood produces a meaningfully different posterior than the center bin, or
- the `5`-minute neighborhood materially changes the ranking of candidate bins, or
- other evidence bundles produce a consistent contraction pattern under bootstrap resampling

The triage classifier should predict this eligibility, not define it. That keeps the benchmark non-circular.

The exact threshold should be set on a validation fold and then frozen.

## Step 3: Run Refinement Tracks
Run three tracks on the same held-out charts:
- fixed policy
- adaptive policy
- geometry-only policy

Within each track, report results at the same separability scales.

## Step 4: Score Two Populations

### Selected Population
Charts admitted by triage.

Measure:
- top-1 minute error
- `% within ±2 min`
- `% within ±5 min`
- `% within ±10 min`
- interval width
- posterior entropy reduction per question
- calibrated coverage

### Full Population
All charts, including low-separability cases.

Measure:
- abstention rate
- coarse interval width
- false `high` rate from triage
- selection bias impact
- conditional coverage on selected charts

Because triage is a selection step, report both unconditional and selection-conditional coverage. A good selector can otherwise hide failure by only admitting easy cases.

## Step 5: Negative Controls
Every benchmark run must include:
- shuffled birth times
- shuffled evidence assignments
- biography-only baseline
- random question ordering
- rounded or corrupted timestamps
- placebo geometry features with no expected predictive value

The benchmark fails if the model only improves on the selected set under weak or corrupted controls.

## Step 6: Decision Thresholds
Set the minute-level refinement threshold using validation data only.

Recommended decision rule:
- `high`: enters minute-level refinement
- `medium`: coarse-to-fine only
- `low`: abstain or coarse interval only

Do not change thresholds after test evaluation begins.

## Primary Metrics
- `% within ±2 min`
- `% within ±5 min`
- `% within ±10 min`
- median absolute minute error
- top-K coverage
- posterior entropy reduction per question
- calibration error
- interval width
- selective risk at fixed coverage
- abstention rate

## Separability Metrics
- local separability score at each spacing
- rank stability across `2`, `5`, `10`, `15` minute neighborhoods
- geometric sensitivity score
- evidence-family contribution score
- disagreement between geometry-only and evidence-conditioned runs

## Protocol Stop Rules
Treat the benchmark as a hard negative if any of these hold:
- nearby bins remain indistinguishable under all evidence bundles
- adaptive questioning does not beat static questioning
- the model only looks good on rounded or noisy labels
- the triage classifier produces many false `high` selections
- calibration collapses once the selected subset is isolated

## Reporting Format
Every run should report:
- dataset version
- provenance strata used
- triage label distribution
- selected versus full-population metrics
- evidence bundles enabled
- calibration method
- abstention rule
- full metric table by spacing
- failure analysis for the worst cases

## Recommended Implementation Order
1. Freeze the triage classifier and its thresholds.
2. Build the separability matrix on the strict gold set.
3. Add the broader challenge set for abstention and robustness.
4. Compare fixed, adaptive, and geometry-only policies.
5. Only then tune learned query selection.

## Validation Checks
- triage labels should correlate with eventual posterior contraction
- selected-set coverage should remain calibrated
- high-separability claims should survive bootstrap resampling
- performance should degrade under label-noise stress
- the system should abstain on low-separability charts instead of hallucinating precision

## Source Anchors
- [Bayesian Experimental Design: A Review](https://people.eecs.berkeley.edu/~jordan/courses/260-spring10/readings/chaloner-verdinelli.pdf)
- [Active Learning Literature Survey](https://burrsettles.com/pub/settles.activelearning.pdf)
- [Conformal Prediction: A Unified Review of Theory and New Challenges](https://arxiv.org/abs/2005.07972)
- [On Calibration of Modern Neural Networks](https://proceedings.mlr.press/v70/guo17a/guo17a.pdf)
- [Optimal strategies for reject option classifiers](https://arxiv.org/abs/2101.12523)
- [Confidence on the Focal: Conformal Prediction with Selection-Conditional Coverage](https://arxiv.org/abs/2403.03868)
