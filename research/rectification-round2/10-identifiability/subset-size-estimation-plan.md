# High-Separability Subset Size Estimation Plan

## Question
How large is the subset of charts that can plausibly support minute-level rectification, and how important is that subset in practice?

## Why This Matters
The project needs a prevalence estimate, not just a success story. If the high-separability subset is tiny, then minute-level rectification is a special-case product. If it is meaningful in size, it can justify a dedicated inference path.

## What We Are Trying To Estimate
We want at least three estimands:

1. `P(high separability)` in the target population.
2. `P(high separability | source quality tier, evidence richness tier, tradition family)`.
3. Practical utility of triage, meaning the share of charts for which minute-level effort would actually improve the final interval enough to justify the cost.

## Core Idea
Do not estimate subset size from the charts that were already accepted by triage. That gives the acceptance rate, not the prevalence.

Instead:
- define the target population first
- freeze the triage rule
- sample from the full population with known inclusion probabilities or a documented audit design
- independently audit whether each sampled chart is truly minute-eligible
- estimate prevalence with weights and uncertainty intervals

## Recommended Estimation Design

### 1. Define The Population
Split the population into strata that matter for rectification:
- strict documentary records
- approximate or rounded records
- rectified or reconstructed records
- rich-event cases
- sparse-event cases
- Western-leaning, Vedic-leaning, and mixed cases if relevant

This lets the estimate answer a practical question: how much of the population is even eligible for fine work under each data regime?

### 2. Freeze The Triage Rule
The triage classifier must be fixed before estimating prevalence. Otherwise the subset estimate will drift with model tuning.

The triage output should only tell us where to spend audit effort. It should not define the truth label.

### 3. Draw A Stratified Audit Sample
Oversample:
- charts predicted `high`
- borderline `medium` cases
- charts with weak provenance or sparse evidence

Undersample:
- obvious `low` cases that are expensive to audit and unlikely to change the estimate

Record each unit’s inclusion probability. Without that, the estimate is descriptive only.

### 4. Audit Separability Independently
For each sampled chart, assess whether it actually belongs in the minute-level subset using frozen criteria:
- documentary or near-documentary provenance
- timezone and DST auditability
- enough dated events or strong non-event evidence
- local geometry that changes meaningfully in narrow bins

This audit must not use the same score that produced the triage label.

### 5. Estimate Prevalence With Design Weights
Use inverse-probability or Horvitz-Thompson style weighting to recover the target population from the audited sample.

If weights are unstable, add a calibrated or Hájek-style normalization and report the sensitivity to alternate weighting schemes.

The estimand should be reported at minimum as:
- weighted prevalence
- confidence or credible interval
- prevalence by stratum

### 6. Quantify Practical Importance
Prevalence alone is not enough. Also estimate:
- expected number of minute-eligible cases per 100 charts
- expected question budget saved by triage
- expected calibration gain from coarse-to-fine routing
- false-high cost, meaning how often triage spends effort on charts that later fail the separability audit

This turns “how many” into “how much does it matter?”

## Recommended Estimators

### Horvitz-Thompson Or Hájek
Use these when inclusion probabilities are known or can be estimated well enough from the sampling design.

### Post-Stratification Or Calibration Weighting
Use these when the audited sample is imbalanced but auxiliary counts are known for provenance strata or source-quality bins.

### Sensitivity-Analysis Bounds
Use these when exact inclusion probabilities are not trustworthy. Report best-case, worst-case, and plausible-range estimates instead of a single number.

### Hierarchical Bayesian Prevalence Model
Use this when you want prevalence to vary by source quality, evidence richness, or tradition family, while shrinking noisy strata toward the global mean.

## Practical Reporting Targets
Report prevalence separately for:
- strict gold candidates
- challenge-set candidates
- documentary sources only
- approximate or rounded sources
- high, medium, and low triage strata

This matters because the subset size may be very different depending on what part of the population you mean.

## Failure Modes
- Estimating prevalence only among triage-accepted charts.
- Tuning triage thresholds until the subset looks larger than it is.
- Treating high triage precision as evidence of high prevalence.
- Ignoring audit burden and concluding that a tiny subset is practically large.
- Mixing documentary records with rectified or rounded records and then calling the result a gold estimate.

## Recommended Next Experiment
Run a small audit pilot on a stratified sample and compare three prevalence estimates:
- naive acceptance rate
- weighted prevalence from the audit sample
- a conservative lower-bound estimate

If these disagree sharply, the triage rule or the gold definition is still too loose.

## Sources
- [Horvitz and Thompson, 1952](https://www.tandfonline.com/doi/abs/10.1080/01621459.1952.10483446)
- [Weighting in survey analysis under informative sampling](https://academic.oup.com/biomet/article-pdf/100/2/385/523599/ass085.pdf)
- [Biased-sample empirical likelihood weighting for missing data problems](https://academic.oup.com/jrsssb/article-abstract/85/1/67/7008591)
- [Correcting prevalence estimation for biased sampling with testing errors](https://pubmed.ncbi.nlm.nih.gov/37655557/)
- [Bayesian Experimental Design: A Review](https://people.eecs.berkeley.edu/~jordan/courses/260-spring10/readings/chaloner-verdinelli.pdf)
