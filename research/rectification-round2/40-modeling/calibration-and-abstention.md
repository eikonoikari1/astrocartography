# Calibration And Abstention

## Principle
The system should be allowed to say “not enough evidence yet.”

For rectification, a confident wrong answer is worse than a calibrated interval. The model should therefore output both a posterior distribution and a stop/abstain decision.

## Calibration Methods Worth Testing
- Temperature scaling for softmax-style scores.
- Isotonic calibration when enough validation data exists.
- Conformal prediction for finite-sample interval guarantees.
- Deep ensembles only if they improve calibration and not just accuracy.

## Abstention Rules
- Abstain when posterior entropy remains high after the last question.
- Abstain when the expected gain from another question is below the cost.
- Abstain when the top interval is not stable across bootstraps or resamples.
- Abstain when evidence quality is too weak or too contradictory.

## Output Forms
- Single best minute, only when confidence is very high and the interval is narrow.
- Highest-posterior-density interval.
- Top-K candidate windows with probabilities.
- Explicit “insufficient evidence” result.

## Metrics To Report
- Calibration error, such as ECE or reliability curves.
- NLL or proper scoring rule on the posterior.
- Coverage versus interval width.
- Selective risk versus coverage.
- Abstention rate at fixed risk thresholds.

## Why Conformal Prediction Is Useful Here
Conformal methods are attractive because they convert point predictions into valid prediction regions under exchangeability assumptions. That is a good fit for a system that must avoid overclaiming minute-level precision when the evidence is weak.

## Sources
- [Guo et al., On Calibration of Modern Neural Networks](https://proceedings.mlr.press/v70/guo17a/guo17a.pdf)
- [Conformal Prediction: A Unified Review of Theory and New Challenges](https://arxiv.org/abs/2005.07972)
- [Introduction to Conformal Predictors](https://www.sciencedirect.com/science/article/pii/S003132032100683X)
- [Survey on Leveraging Uncertainty Estimation Toward Trustworthy Deep Neural Networks](https://arxiv.org/abs/2304.04906)
- [Selective Classification / Reject Option survey entry](https://arxiv.org/abs/2101.12523)

