# Fuzzy Event Likelihoods

## Question
How should uncertain life-event dates be encoded in the rectification posterior without leaking information or pretending fuzzy evidence is exact?

## Why This Matters
Event timing is only useful if the model knows how uncertain each event really is. If the system collapses fuzzy dates into point labels, it can learn rounding artifacts, collector bias, or hindsight reconstruction instead of rectification signal.

## Recommended Answer
Treat every event as an uncertain observation with an explicit support interval or probability distribution over possible dates, then marginalize over that uncertainty inside the likelihood.

## Core Principle
Use the event packet that would have been available at inference time only. Do not let later normalization, narrative enrichment, or the final birth-time label leak into the event representation.

## Evidence Model
Represent each event `e_i` with:
- a semantic type, such as marriage, move, surgery, promotion, loss, or crisis
- an observed date or date interval
- a source-grade or provenance field
- a precision field, such as exact day, month, season, year, or unknown
- an optional confidence field supplied by the collector or user

Then define the event likelihood as a marginalization over the latent true event date:

`L_i(t_birth) = \int p(e_i | t_birth, t_event) p(t_event | observed interval, source precision, confidence) dt_event`

This makes the event uncertainty explicit instead of smuggling it into a single hard timestamp.

## Practical Encoding Options

### 1. Interval-censored event encoding
Best when the user can name a bounded date range or a day with modest uncertainty.
- Example: marriage sometime in late June 2008.
- Model: uniform or triangular density over the stated interval.

### 2. Soft-label event encoding
Best when the system can estimate a probability distribution over candidate dates.
- Example: a date with a high-probability center and tapering tails.
- Model: categorical probabilities over date bins or a piecewise density.

### 3. Set-valued event encoding
Best when the evidence only supports a candidate set.
- Example: one of three months, but not the exact month.
- Model: partial-label likelihood over a finite support set.

### 4. Hierarchical confidence encoding
Best when source quality is as important as the date itself.
- Example: exact date from a birth certificate versus a remembered month from family lore.
- Model: separate latent reliability and date-precision variables.

## What To Avoid
- Do not convert fuzzy dates into single hard labels during preprocessing.
- Do not derive precision from prose if the user did not explicitly provide it.
- Do not let downstream chart features infer a more exact event date than the source supports.
- Do not mix rectified event times with documentary event times in the same evidence stratum.

## Leakage Controls
1. Freeze the event packet before rectification scoring begins.
2. Store the original user-visible date, the normalized interval, and the provenance field separately.
3. Keep text extraction, if any, outside the scoring loop or audit it against the original packet.
4. Use person-level splits so the same event narrative cannot appear in both training and evaluation.
5. Keep label-quality metadata in the model, but never use the true birth time to refine event precision.

## How This Connects To Known Methods
This problem is closer to interval-censored data and soft-label learning than to ordinary single-label classification.

That framing is supported by the uncertain-data literature:
- uncertain observations can be modeled as sets or probability distributions
- interval-censored outcomes are less informative than exact outcomes
- partial-label and soft-label frameworks already treat ambiguous supervision as first-class

## Recommended Implementation Pattern
1. Normalize every event into a canonical uncertainty object.
2. Convert the uncertainty object into a date-time density over candidate bins.
3. Evaluate the timing engine against the density, not against a single guessed day.
4. Keep separate weights for semantic relevance and source reliability.
5. Calibrate the final posterior on held-out known-time cases.

## Failure Modes
- The model learns rounding conventions instead of event timing.
- Vague event dates dominate the posterior because they are overcounted.
- LLM extraction introduces hidden exactness that the user never supplied.
- Collector metadata becomes a shortcut label.

## Sources
- [Bayesian Regression Models for Interval-censored Data in R](https://journal.r-project.org/articles/RJ-2017-050/)
- [A unified nonparametric fiducial approach to interval-censored data](https://arxiv.org/abs/2111.14061)
- [UNCERTAIN DATA IN MACHINE LEARNING](https://proceedings.mlr.press/v179/destercke22a/destercke22a.pdf)
- [Learning from Multiple Noisy Partial Labelers](https://proceedings.mlr.press/v151/yu22c.html)
- [Progressive Identification of True Labels for Partial-Label Learning](https://proceedings.mlr.press/v119/lv20a.html)

