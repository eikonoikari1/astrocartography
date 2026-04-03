# Question Family Validation Spec

This document defines how to test whether a question family actually helps rectification.

## Goal
Treat every question family as a hypothesis. A family is only useful if it improves discrimination, calibration, and posterior contraction more than nearby alternatives.

## What A Question Family Is
A question family is a small set of items intended to separate the same chart distinction.

Examples:
- career visibility vs private work
- partnership centrality vs independence
- early duty vs freer development
- settled continuity vs mobility and reinvention

If two items are meant to test different chart distinctions, they belong to different families.

## Validation Stages

### Stage 1: Concept Validation
Check whether the family is well-formed before asking users anything.

Required checks:
- The family names a specific chart distinction.
- The distinction is observable in life structure, not just in mood adjectives.
- The wording can be made neutral.
- The family has a clear contradiction path.
- The family is not redundant with an existing family.

If any of these fail, the family stays in draft status.

### Stage 2: Cognitive Validation
Run cognitive interviews before field use.

Use probes to test:
- how the user interprets the wording
- whether the item feels leading
- whether the answer choices are truly distinct
- whether the item can be answered without guessing what the system wants

This is the point to revise wording, not after a failed benchmark run.

### Stage 3: Pilot Discrimination Test
Compare the family against:
- a random-question control
- a static questionnaire control
- nearby families that test related chart distinctions

Measure:
- pairwise choice stability
- response-time distribution
- contradiction rate
- posterior contraction per item
- calibration of the resulting interval

### Stage 4: Holdout Validation
Use held-out known-time charts and keep the family blinded until evaluation.

Acceptance requires all of the following:
- better discrimination than the control conditions
- no major calibration loss
- no obvious dependence on flattering or generic answers
- stable performance across multiple chart types

## Validation Metrics

| Metric | What it tells us | Why it matters |
|---|---|---|
| Posterior contraction per item | How fast the candidate set shrinks | core utility signal |
| Pairwise discrimination rate | Whether the item splits plausible candidates | tells us if the family is doing real work |
| Contradiction rate | How often the item exposes mismatch | guards against smooth false fits |
| Response-time stability | Whether the item is being answered thoughtfully | flags careless or mechanical responding |
| Calibration error | Whether confidence matches correctness | prevents persuasive overclaiming |
| Increment over baseline | Whether the family beats random or static items | filters out decorative questions |

## Promotion Rules
A family can move from draft to active only if:
- it survives cognitive pretesting
- it improves at least one core metric against baseline
- it does not degrade calibration
- it can be phrased neutrally
- it has a documented contradiction probe

## Demotion Rules
Demote or remove a family if:
- it produces broad agreement without discrimination
- it is highly sensitive to wording polish
- it only works when the chart has already been almost solved
- it adds confidence without improving posterior sharpness

## Operational Guidance
1. Validate families one at a time.
2. Keep absolute items and pairwise items in separate tracks.
3. Never assume a family is useful because it sounds astrologically plausible.
4. Treat user agreement as weak evidence unless it changes the posterior.
5. Keep a record of which exact chart distinctions each family was supposed to split.

## Source Anchors
- [Cognitive interviewing to refine questionnaire items](https://pmc.ncbi.nlm.nih.gov/articles/PMC9524256/)
- [Gallup approach to cognitive interviews](https://news.gallup.com/opinion/methodology/328058/gallup-approach-cognitive-interviews.aspx)
- [Forced-choice inventories and faking resistance, meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC8511514/)
- [Careless responding detection revisited](https://link.springer.com/article/10.3758/s13428-024-02484-3)
