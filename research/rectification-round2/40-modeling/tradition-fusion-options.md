# Tradition Fusion Options

## Question
Should Western, Vedic, or other doctrine families be modeled as separate experts, blended features, or staged inference layers?

## Why This Matters
Doctrine families do not use the same primitives, timing semantics, or interpretive priorities. A fusion strategy that is too early can destroy signal, while a strategy that is too separate can miss cross-tradition agreement.

## Recommended Answer
Use staged inference with doctrine-specific experts feeding a shared latent birth-time posterior.

## Architecture Options

### 1. Blended Features
Combine all doctrine-specific features into one joint model.
- Strength: simplest to deploy.
- Weakness: it assumes the traditions share feature semantics early enough for fusion to be harmless.
- Risk: doctrinal differences get flattened into noisy averages.

### 2. Separate Experts With Late Fusion
Build one expert per doctrine family and combine their outputs at the posterior layer.
- Strength: preserves doctrinal structure and supports ablation.
- Weakness: needs a gate or calibration layer to decide how much to trust each expert.
- Risk: experts may disagree without a principled arbitration rule.

### 3. Staged Inference Layers
Use a generalist layer for shared geometry and evidence quality, then route into doctrine-specific specialists for timing and interpretation.
- Strength: matches how rectification is actually reasoned about.
- Weakness: more design work up front.
- Risk: over-engineering if the dataset is too small.

## Recommended Structure
1. Shared deterministic chart engine.
2. Doctrine-specific feature heads.
3. Doctrine-specific likelihood heads.
4. A gating or weighting module that chooses how much each expert contributes.
5. A shared calibration layer over the final time posterior.

This is effectively a Bayesian or sparsely gated mixture-of-experts design, with a hierarchy:
- generalist layer for broad chart geometry and evidence quality
- specialist layer for doctrine-specific timing semantics
- posterior fusion layer for final calibration and abstention

## Why Separate Experts Make Sense
- Western and Vedic systems do not always map the same event to the same feature family.
- Some traditions are angle- and house-centric, while others are period- and divisional-chart centric.
- Separate experts make it easier to measure which tradition actually adds signal.
- Separate experts keep doctrine-specific assumptions auditable.

## Why Pure Blending Is Risky
- Early fusion assumes shared semantics that may not exist.
- It can hide which doctrine is helping and which is just adding noise.
- It makes model debugging harder because a failure is no longer attributable to one system.

## When Blending Is Acceptable
Blend only at the level of shared latent quantities:
- normalized candidate-time bins
- event uncertainty objects
- posterior logits or log-likelihoods
- calibration outputs

Do not blend raw doctrine-specific primitives before they have been validated independently.

## Routing Policy
The gate should depend on evidence availability and fit quality, not on the target birth time.

Useful routing inputs:
- source quality
- availability of event windows
- presence of exact or approximate timing evidence
- whether the user supplied Vedic-specific or Western-specific biographical anchors
- prior performance of the expert on similar cases

## Model-Selection Guidance
The HME literature is a good fit here because it treats the architecture as a divide-and-conquer problem and supports pruning unused components. That is useful if one doctrine family turns out to be weak for a given case.

The right operational question is not "which doctrine is true." It is:
which expert family improves calibration, interval coverage, and posterior contraction on this case type?

## Recommended Decision
Start with separate doctrine experts and a shared posterior. Add staged routing if the data supports it. Avoid early feature blending unless the features are already normalized to the same semantic space.

## Failure Modes
- Doctrine heads become redundant and overfit the same signal.
- The gate learns dataset artifacts instead of evidence quality.
- One tradition dominates because it has more features, not because it is more informative.
- Cross-doctrine disagreement is forced too early and washes out useful asymmetry.

## Sources
- [Bayesian Hierarchical Mixtures of Experts](https://www.research.ed.ac.uk/en/publications/bayesian-hierarchical-mixtures-of-experts/)
- [A Bayesian Approach to Model Selection in Hierarchical Mixtures-of-Experts Architectures](https://doi.org/10.1016/S0893-6080(96)00050-0)
- [Evaluating Mixture-of-Experts Architectures for Network Aggregation](https://link.springer.com/chapter/10.1007/978-3-031-01233-4_11)
- [Sparsely Activated Mixture-of-Experts are Robust Multi-Task Learners](https://arxiv.org/abs/2204.07689)

