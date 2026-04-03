# Selection Bias Risks

## Question
How can triage distort perceived success, and what should the benchmark report so that we do not confuse selection effects with real rectification ability?

## Why This Matters
Once a triage step is added, the evaluation population changes. That can make a system look better simply because it only sees easy cases.

## Main Risk
The accepted subset is not the full problem. It is a filtered problem.

If the triage rule selects charts with better provenance, richer events, or stronger geometry, the benchmark will overstate performance unless it separately reports the full population.

## Selection Bias Mechanisms

### Spectrum Bias
Easy cases are more likely to be admitted, so performance rises even if the model is unchanged.

### Provenance Bias
High-grade documentary records are overrepresented among accepted cases, which makes minute-level success look more common than it is in the real pool.

### Evidence-Richness Bias
Charts with many dated events are easier to refine, so triage can quietly turn a hard benchmark into a biography-rich benchmark.

### Geometry Bias
Charts with sharper local sensitivity are easier to solve, but that does not mean the population prevalence of high-separability cases is high.

### Confidence Leakage
If the triage score is reused downstream as a feature, the model can learn the selector instead of the chart.

### Threshold Tuning Bias
If thresholds are tuned on the test set, the benchmark becomes a threshold search exercise.

## Why Selection-Conditional Coverage Matters
Coverage on the selected subset is not enough.

If the system only reports coverage after triage, it can hide failure on rejected or borderline cases. We need both:
- marginal coverage on the full population
- selection-conditional coverage on the admitted subset

This is the same basic issue studied in conformal prediction under selection: the selected unit is a conditioned population, and the guarantee must be stated for that conditioned set, not assumed from the unconditional metric.

## What The Benchmark Must Report

### Full Population
- selection rate
- false-high rate
- abstention rate
- calibration on all charts
- interval width on all charts

### Selected Population
- coverage among admitted charts
- minute error among admitted charts
- posterior contraction per question
- conditional calibration

### Stratified By Triage Outcome
- `high`
- `medium`
- `low`

This lets us see whether the system is improving because it is better or because it is better at avoiding difficult charts.

## The Key Distinction
High triage precision is not the same thing as high prevalence.

A selector can be very accurate and still cover only a small, narrow corner of the population. In that case, the system is useful, but only for a subset.

## How To Reduce The Bias
- Freeze triage thresholds before testing.
- Keep selection probabilities or design weights.
- Report both unconditional and conditional metrics.
- Use a challenge set that includes weak provenance and sparse evidence.
- Include negative controls with shuffled or placebo labels.
- Evaluate false-high and missed-high rates, not just top-line accuracy.

## Evaluation Traps
- Reporting only the selected subset.
- Comparing a full-population baseline to a triaged model on admitted cases only.
- Calling a high success rate evidence of general validity.
- Reusing the same data to define triage, train the model, and claim prevalence.
- Treating a reduction in question budget as proof of better rectification when it may just be stronger filtering.

## Recommended Statistical Tools
- inverse probability weighting
- calibration weighting
- bootstrap intervals stratified by triage label
- conditional coverage analysis
- sensitivity analysis for alternate triage thresholds
- conservative lower-bound reporting when selection probabilities are uncertain

## Practical Rule
Whenever triage is present, ask two separate questions:
1. How good is the model on the charts it accepted?
2. How much of the target population did those charts represent?

If those answers are not both reported, the benchmark is incomplete.

## Recommended Next Experiment
Run the benchmark twice:
- once on the admitted subset
- once on the full population with selection-aware reporting

If the first run looks strong and the second collapses, the triage policy is hiding the real difficulty.

## Sources
- [Confidence on the Focal: Conformal Prediction with Selection-Conditional Coverage](https://arxiv.org/abs/2403.03868)
- [Selective Prediction-Set Models with Coverage Rate Guarantees](https://academic.oup.com/biometrics/article/79/2/811/7513980)
- [Sample Selection Bias in Evaluation of Prediction Performance of Causal Models](https://pmc.ncbi.nlm.nih.gov/articles/PMC9053600/)
- [Weighting in survey analysis under informative sampling](https://academic.oup.com/biomet/article-pdf/100/2/385/523599/ass085.pdf)
- [Non-random sampling leads to biased estimates of transcriptome association](https://www.nature.com/articles/s41598-020-62575-x)
