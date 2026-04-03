# Chart Narrative Generation Constraints

This document defines how to generate pairwise chart narratives that are discriminative without becoming leading.

## Goal
The narrative generator should create comparable chart descriptions that help the user discriminate between candidates without leaking the preferred answer through style, length, or emotional tone.

## Core Constraint
Pairwise narratives must differ in chart meaning, not in superficial attractiveness.

That means the system should not make one candidate sound more polished, more flattering, more dramatic, or more coherent than the other unless that difference is the actual distinction being tested.

## Required Symmetry
For each candidate pair:
- match narrative length closely
- match grammatical style
- match specificity level
- match emotional temperature
- match amount of uncertainty language
- cover the same life domains
- avoid one-sided positive or negative framing

If the texts are not parallel, the comparison is contaminated.

## Allowed Differences
The narratives may differ in:
- which life domain is foregrounded
- which axis appears dominant
- which recurring pattern is emphasized
- which contradiction is more likely to appear

The narratives should not differ in:
- verbosity
- rhetorical force
- charisma
- moral valence
- level of confidence

## Generation Pipeline
1. Select the candidate pair to compare.
2. Identify the single chart distinction under test.
3. Generate two parallel narratives from the same template.
4. Run a symmetry check for length and tone.
5. Run a leakage check to ensure the narratives do not reveal the model's preference.
6. If the pair still feels obviously lopsided, regenerate or discard it.

## Narrative Template
Use the same slots for both candidates:
- life orientation
- work and visibility
- relationships
- family or duty
- mobility or stability
- crisis or transition style

Only the emphasis should change.

## Leakage Rules
Do not let the narrative:
- name the chart placements directly
- mention the exact reason the system prefers one candidate
- use loaded adjectives that cue the answer
- include extra details in one narrative just to make it seem richer
- summarize the user's prior answers in a way that points to the expected choice

## Preference Bias Controls
Pairwise comparison can be biased by superficial features, so the generator must avoid easy visual or lexical wins.

Controls:
- randomize the order of presentation
- keep sentence count aligned
- keep domain coverage aligned
- avoid one candidate having more concrete examples than the other
- avoid making one narrative more "novel" than the other

## When To Use Pairwise Narratives
Use them only when:
- the candidate set is already narrowed
- the system needs a sharper split than absolute self-report can provide
- the two candidates are genuinely plausible

Do not use them for broad first-pass screening.

## Validation Checklist
Before shipping a narrative pair, check whether:
- a blind reader can compare them without guessing the target
- neither narrative is obviously more flattering
- the difference remains when surface wording is normalized
- the pair still discriminates after a cognitive pretest

## Fallback Rule
If a narrative pair cannot be made symmetric without losing the distinction, do not use pairwise narrative comparison for that candidate set.

## Source Anchors
- [Active Learning Ranking from Pairwise Preferences with Almost Optimal Query Complexity](https://papers.nips.cc/paper/4428-active-learning-ranking-from-pairwise-preferences-with-almost-optimal-query-complexity)
- [Real-time Multiattribute Bayesian Preference Elicitation with Pairwise Comparison Queries](https://proceedings.mlr.press/v9/guo10b.html)
- [The Comparative Trap: Pairwise Comparisons Amplifies Biased Preferences of LLM Evaluators](https://arxiv.org/abs/2406.12319)
- [Cognitive interviewing to refine questionnaire items](https://pmc.ncbi.nlm.nih.gov/articles/PMC9524256/)
- [Leading question bias in surveys](https://link.springer.com/article/10.1007/s11135-024-01934-6)
