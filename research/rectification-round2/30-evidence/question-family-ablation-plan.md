# Question Family Ablation Plan

This plan defines how to compare question families honestly so we can tell actual signal from interface effects, user agreement, and selection bias.

## Goal

Measure which question families improve rectification after controlling for:
- chart prior strength
- source quality
- user verbosity
- adaptivity
- question count
- control conditions

The question is not "does the family feel plausible." The question is "does it move the posterior more than the alternatives."

## Experimental Setup

Use held-out known-time charts only.

Keep these rules fixed before comparison:
- same chart engine
- same triage thresholds
- same candidate-time grid
- same stopping rule
- same total question budget
- same calibration method

Do not tune wording or thresholds after seeing holdout results.

## Ablation Levels

### Level 1: Single-Family Runs
Run each family by itself against the same baseline pipeline.

Compare:
- career axis only
- relationship axis only
- family duty only
- mobility only
- crisis pattern only
- identity pressure only
- work style only
- emotional posture only
- body/style only
- public biography only

This answers which families can stand on their own.

### Level 2: Leave-One-Out From Full Stack
Start with the best-performing core bundle, then remove one family at a time.

This answers which families are actually carrying the posterior contraction.

### Level 3: Family Cluster Ablations
Compare conceptually related bundles:
- life-structure bundle: career, relationship, family duty, mobility
- temporal-shape bundle: crisis pattern, identity pressure
- role bundle: work style, career axis
- presentation bundle: body/style, emotional posture
- weak-signal bundle: public biography, generic temperament

This answers which conceptual clusters are redundant.

### Level 4: Format Ablations
Keep the family constant, vary the presentation:
- absolute item
- forced-choice item
- pairwise chart comparison
- contradiction probe present or absent

This answers whether the gain comes from the family content or from the format.

## Comparison Conditions

Every family should be compared against:
- random-question control
- static questionnaire control
- biography-only baseline
- event-only baseline where relevant
- shuffled-family-label control
- placebo family with similar wording but no meaningful chart distinction

## Priority for Ablation Order

Ablate in this order:
1. mood / temperament self-report
2. optional text / voice / image cues
3. public biography
4. body / style
5. emotional posture
6. work style
7. identity pressure
8. crisis pattern
9. mobility
10. family duty
11. relationship axis
12. career axis

The lower half of the list is not "unimportant"; it is the set most likely to be redundant, noisy, or confounded.

## Metrics To Report

Primary:
- posterior entropy reduction per question
- top-1 time error
- `% within ±2 min`
- `% within ±5 min`
- `% within ±10 min`
- calibration error
- abstention rate

Secondary:
- contradiction rate
- response-time stability
- selected-set coverage
- full-population coverage
- increment over baseline

## Honest Comparison Rules

1. Use the same user and chart budget across conditions.
2. Keep question count fixed when comparing families.
3. Report both selected-set and full-population metrics.
4. Freeze triage before holdout evaluation.
5. Evaluate on person-level splits only.
6. Report when a family only helps after the posterior is already narrow.
7. Treat broad agreement as weak evidence unless it improves posterior sharpness.

## Stop Rules

Remove or delay a family if:
- it improves comfort but not calibration
- it only works on a tiny subset
- it disappears under a placebo or shuffled-label control
- it adds redundant information already captured by a stronger family
- its effect depends too much on wording polish

## Recommended Readout Table

For each family, report:
- standalone performance
- leave-one-out delta from the full stack
- performance inside each family cluster
- format sensitivity
- calibration delta
- contribution to abstention quality

## Interpretation Rule

A family is worth keeping only if it improves either:
- discrimination
- calibration
- or posterior contraction

and does so without raising false confidence.

## Source Anchors

- [Active Learning Literature Survey](https://burrsettles.com/pub/settles.activelearning.pdf)
- [Bayesian Experimental Design: A Review](https://people.eecs.berkeley.edu/~jordan/courses/260-spring10/readings/chaloner-verdinelli.pdf)
- [Forced-choice inventories and faking resistance, meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC8511514/)
- [Cognitive interviewing to refine questionnaire items](https://pmc.ncbi.nlm.nih.gov/articles/PMC9524256/)
- [Careless responding detection revisited](https://link.springer.com/article/10.3758/s13428-024-02484-3)
