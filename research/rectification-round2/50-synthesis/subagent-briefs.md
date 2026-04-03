# Active Subagent Briefs

## Brief 1: Identifiability And Minute-Level Feasibility
- Core question: Under what conditions can nearby candidate birth times be meaningfully distinguished?
- Deliverables:
  - `practitioner-minute-claims.md`
  - `feature-sensitivity-map.md`
  - `separability-simulation-spec.md`
  - `high-separability-subsets.md`
- Required focus:
  - Separate claimed precision from measured precision.
  - Identify chart features that can change at `2`, `5`, `10`, and `15` minute shifts.
  - Look for conditions where minute-level rectification is more plausible.

## Brief 2: Ground-Truth And Label-Quality Audit
- Core question: How trustworthy are exact-minute birth-time labels in real datasets?
- Deliverables:
  - `provenance-and-sources.md`
  - `label-noise-risks.md`
  - `gold-subset-criteria.md`
  - `missing-ground-truth.md`
- Required focus:
  - Rodden ratings, hospital rounding, certificate quality, timezone and DST ambiguity, minute-heaping.
  - Distinguish source classes clearly.

## Brief 3: Interview Design And Evidence Families
- Core question: Which non-event signals and question formats are most likely to help without manufacturing confidence?
- Deliverables:
  - `evidence-taxonomy.md`
  - `forced-choice-and-adaptive-qa.md`
  - `response-bias-risks.md`
  - `item-bank-v1.md`
  - `pairwise-candidate-comparisons.md`
- Required focus:
  - Life-structure signals versus personality signals.
  - Forced-choice, pairwise judgment, contradiction checks, and invalid-response detection.

## Brief 4: Modeling, Baselines, And Evaluation
- Core question: What modeling and benchmark structure is strict enough to test the project honestly?
- Deliverables:
  - `posterior-architecture.md`
  - `query-policy-options.md`
  - `baselines-and-negative-controls.md`
  - `calibration-and-abstention.md`
  - `benchmark-spec.md`
- Required focus:
  - Strong non-astrological baselines.
  - Calibration, interval outputs, abstention.
  - Posterior contraction per question.
