# Evidence Confidence Encoding

## Question
How should the model encode confidence in each evidence item so that weak evidence does not masquerade as hard truth?

## Why This Matters
Rectification will fail if a vague clue receives the same weight as a documentary fact. Confidence needs to be a modeled quantity, not a commentary field.

## Recommended Answer
Represent evidence confidence as a first-class probabilistic object attached to each evidence item, then propagate that uncertainty into the posterior.

## Core Idea
Each observation should carry two different uncertainties:
- uncertainty in the observed value itself
- uncertainty in how much the model should trust that observation

These should not be conflated.

## Suggested Schema
For each evidence item, store:
- `value`
- `support_interval`
- `precision_class`
- `source_grade`
- `collector_confidence`
- `model_reliability_weight`
- `evidence_family`

This lets the system distinguish a precise but unreliable item from a fuzzy but trustworthy one.

## Encoding Options

### 1. Soft-label probabilities
Use a probability distribution over possible values or bins.
- Best when the support set is known.
- Good fit for uncertain dates and partially observed labels.

### 2. Ordinal confidence classes
Map evidence to ordered strata such as documentary, near-documentary, family memory, hearsay, and rectified.
- Best when exact probabilities are unavailable.
- Easy to audit.

### 3. Latent reliability variables
Give each evidence family or source an inferred trust parameter.
- Best when source quality varies systematically.
- Useful when many observations come from the same collector or archive.

### 4. Dual-channel encoding
Separate semantic content from confidence metadata.
- Best for preventing the model from confusing label quality with label value.
- Strongly recommended here.

## What The Model Should Learn
- Which evidence families are reliable for which chart regions.
- Which source grades tend to be overconfident.
- How much to downweight fuzzy evidence without discarding it completely.

## What The Model Should Not Learn
- That round numbers are inherently meaningful.
- That documentary-looking metadata guarantees correctness.
- That confidence metadata can substitute for the evidence itself.

## Practical Rule
Confidence should change the width of the posterior and the abstention threshold before it changes the raw point estimate.

That keeps the system conservative when evidence is weak and sharp only when the input genuinely supports sharpness.

## Calibration Implication
Confidence encoding should be validated by:
- posterior calibration
- coverage under abstention
- robustness to label-noise stress tests
- stability of the top interval under resampling

If better confidence modeling does not improve those metrics, it is overfitted metadata.

## Recommended Integration Order
1. Encode evidence confidence explicitly at ingestion.
2. Let the evidence encoder produce a confidence-weighted latent representation.
3. Aggregate evidence into the posterior.
4. Calibrate the posterior on held-out known-time charts.
5. Stress test with rounded, missing, and contradictory evidence.

## Failure Modes
- Confidence metadata becomes a proxy for the target.
- The model over-trusts high-grade sources and ignores legitimate disagreements.
- The system treats every low-confidence item as noise instead of as weak evidence.
- Source-grade labels differ across datasets and become non-comparable.

## Sources
- [UNCERTAIN DATA IN MACHINE LEARNING](https://proceedings.mlr.press/v179/destercke22a/destercke22a.pdf)
- [Bayesian Regression Models for Interval-censored Data in R](https://journal.r-project.org/articles/RJ-2017-050/)
- [Learning with confidence: training better classifiers from soft labels](https://arxiv.org/abs/2409.16071)
- [Harmless label noise and informative soft-labels in supervised classification](https://www.sciencedirect.com/science/article/pii/S0167947321000876)

