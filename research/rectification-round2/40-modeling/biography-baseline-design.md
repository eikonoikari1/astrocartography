# Biography-Only Baseline Design

## Purpose
The biography-only baseline should answer a narrow question: how much apparent rectification signal remains if the model sees only non-astrological life structure and none of the chart-derived features?

The baseline must be strong enough to be a real competitor. If it is too weak, the benchmark will exaggerate the value of astrology-specific machinery.

## Core Principle
Use the same raw evidence budget that a human interviewer would have, but forbid any chart features, angles, houses, timing triggers, or derived astrological labels.

That means the baseline can use biography and life history, but not any information encoded from the chart itself.

## Recommended Inputs
- Career history and work style.
- Relationship history and family structure.
- Major moves, relocations, and stability patterns.
- Health crises and turning points.
- Public biography or self-description when available.
- Interview answers from the same question families used in the rectification system, provided they are re-encoded without chart features.
- Textual summaries of life themes, if the benchmark supports them.

## Inputs To Exclude
- Birth time, chart features, or chart-derived labels.
- Astrology vocabulary in source notes when it directly reveals the target.
- Any timing cue extracted from a chart comparison.
- Any metadata field that encodes rectification status, source grade, or exact minute quality in a way the model could exploit as a proxy label.

## Recommended Model Family
Use the strongest non-astrological model that remains interpretable enough to audit.

Practical options:
- regularized linear model over structured life-history features
- gradient-boosted trees over structured features
- text encoder over biography and interview summaries
- hybrid model that combines structured features and text

The baseline should not be a toy logistic regression if a richer model is feasible. It should be a credible competitor that can discover non-astrological structure.

## Baseline Variants To Compare
### 1. Structured biography baseline
Use counts, durations, and categorical summaries from life history.

### 2. Text-only biography baseline
Use only biography text or interview text, with no chart metadata.

### 3. Hybrid biography baseline
Combine structured life-history variables with free-text summaries.

### 4. Minimal heuristic baseline
Use simple handcrafted rules to detect whether a case looks career-heavy, relationship-heavy, mobile, crisis-prone, or stable.

The hybrid version is the most important baseline because it is the hardest to dismiss as weak.

## Training Objective
Predict candidate birth-time bins or intervals from non-astrological evidence only.

Two valid targets:
- ranked candidate-time bins
- calibrated interval or posterior over bins

The baseline should be evaluated in exactly the same scoring framework as the rectification model.

## Why This Baseline Is Necessary
Biography often contains enough structure to create false confidence. A model may learn:
- public-fame patterns
- demographic regularities
- life-stage artifacts
- writing style or verbosity
- collection artifacts from the dataset itself

If the astrology model only beats a weak baseline, the result is not meaningful.

## Reporting Requirements
Report all of the following:
- top-1 time error
- `% within ±2 min`
- `% within ±5 min`
- calibration error
- interval width
- selective risk or abstention behavior
- performance by evidence richness and source grade

Also report the same metrics for the astrology-aware model, so the lift is visible rather than implied.

## Design Constraints
- Train and evaluate on person-level splits only.
- Keep the same input budget as the rectification system where possible.
- Do not leak chart-derived labels into feature engineering.
- Use a frozen feature schema before final evaluation.
- Keep a random baseline and a shuffled-label baseline beside the biography baseline.

## Recommended Ablations
- remove text, keep structure only
- remove structure, keep text only
- remove event history, keep personality-like descriptors only
- remove public biography, keep private life structure only
- remove demographic fields

These ablations show whether the baseline is really learning life structure or just exploiting one easy shortcut.

## Acceptance Rule
If the rectification model does not beat the strongest biography-only baseline, the project should not claim astrology-specific value yet.

## Sources
- [Machine and deep learning for personality traits detection: a comprehensive survey and open research challenges](https://link.springer.com/article/10.1007/s10462-025-11245-3)
- [An Effective Personality-Based Model for Short Text Sentiment Classification Using BiLSTM and Self-Attention](https://www.mdpi.com/2079-9292/12/15/3274)
- [Selective Prediction-Set Models with Coverage Rate Guarantees](https://academic.oup.com/biometrics/article-abstract/79/2/811/7513980)
- [Conformal Prediction: A Unified Review of Theory and New Challenges](https://arxiv.org/abs/2005.07972)
