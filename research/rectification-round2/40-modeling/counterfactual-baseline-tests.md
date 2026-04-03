# Counterfactual Baseline Tests

## Purpose
The benchmark needs tests that make spurious success collapse. A model should only be trusted if it stays useful after obvious shortcuts are removed and if its performance drops when the signal is intentionally broken.

## Test Family 1: Label Permutation
Shuffle birth times across people while keeping the rest of the dataset fixed.

What it tests:
- whether the model is learning real signal or memorizing dataset structure

Expected result:
- performance should fall to chance or near-chance

Failure sign:
- the model still reports strong exact-minute accuracy

## Test Family 2: Biography Paraphrase
Replace biographies with paraphrases that preserve meaning but change wording.

What it tests:
- whether the model depends on surface phrasing, verbosity, or collector style

Expected result:
- meaningful but not inflated drop if the text encoder is real

Failure sign:
- performance is unchanged after meaning-preserving rewrite, suggesting the model is using hidden metadata or leakage

## Test Family 3: Biography Redaction
Remove names, dates, locations, family names, occupations, and explicit event wording.

What it tests:
- whether the model is exploiting named entities or easy identifiers

Expected result:
- performance should degrade if those fields were carrying signal, but not collapse if the baseline truly uses structure

Failure sign:
- near-perfect performance with redacted content

## Test Family 4: Event Fuzzing
Jitter event dates by a few days, weeks, or months depending on the source precision.

What it tests:
- whether the system depends on overly exact event dates

Expected result:
- sharp timing methods should degrade gracefully

Failure sign:
- exact-minute predictions stay strong even when event dates are heavily fuzzed

## Test Family 5: Source-Grade Swap
Swap or mask source-grade labels during evaluation.

What it tests:
- whether the model is using provenance metadata as a shortcut

Expected result:
- provenance should matter for calibration, not as a fake predictor

Failure sign:
- performance survives even when label-grade information is removed

## Test Family 6: Collector Holdout
Hold out a collector, archive, or source family not seen during training.

What it tests:
- whether the model has learned archive-specific style or conventions

Expected result:
- some degradation is acceptable; collapse is not

Failure sign:
- performance craters, showing overfitting to collection habits

## Test Family 7: Control Features Only
Use demographic and biography-only features with no chart data, then compare against the full system.

What it tests:
- how much of the signal is non-astrological

Expected result:
- baseline should be materially weaker than a genuinely informative rectification system

Failure sign:
- biography-only controls match the full system

## Test Family 8: Placebo Chart Features
Use chart features that should not matter, or randomize sensitive chart inputs while preserving non-astrological inputs.

What it tests:
- whether the model is reacting to arbitrary chart noise

Expected result:
- predictive power should vanish

Failure sign:
- the model still produces narrow intervals

## Test Family 9: Pairwise Inversion
Reverse the order of pairwise chart narratives or swap the left and right candidates.

What it tests:
- whether the comparison interface is symmetrical and not leading

Expected result:
- rankings should remain stable except for random noise

Failure sign:
- the model prefers whichever option is presented first

## Test Family 10: Selection-Conditioned Evaluation
Evaluate only charts admitted by triage, then separately report the full population.

What it tests:
- whether the model is hiding behind easy-case selection

Expected result:
- selected-set metrics should be accompanied by full-population coverage and false-high rates

Failure sign:
- strong selected-set results with poor unconditional performance

## Minimum Reporting
For each test, report:
- metric delta versus the clean benchmark
- calibration change
- interval width change
- abstention rate change
- whether the result suggests leakage, shortcut learning, or genuine robustness

## Decision Rule
If the baseline remains strong after biography redaction is relaxed, event fuzzing is applied, and source-grade labels are removed, the rectification model is probably leaning on shortcuts rather than chart structure.

## Sources
- [Counterfactual Invariance to Spurious Correlations](https://proceedings.neurips.cc/paper_files/paper/2021/file/8710ef761bbb29a6f9d12e4ef8e4379c-Paper.pdf)
- [Spawrious: A Benchmark for Fine Control of Spurious Correlation Biases](https://arxiv.org/abs/2303.05470)
- [Confidence on the Focal: Conformal Prediction with Selection-Conditional Coverage](https://arxiv.org/abs/2403.03868)
- [Selective Prediction-Set Models with Coverage Rate Guarantees](https://academic.oup.com/biometrics/article-abstract/79/2/811/7513980)
