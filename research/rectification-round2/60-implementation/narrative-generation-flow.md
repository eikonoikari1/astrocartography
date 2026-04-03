# Narrative Generation Flow

## Purpose
Define how to generate candidate narratives for pairwise comparison without leading the user or leaking the model preference.

## Scope
This flow applies only when the interview engine has already narrowed the posterior enough to justify pairwise comparison.

It does not apply to early coarse pruning.

## Inputs
The generator should receive:
- candidate bin A
- candidate bin B
- chart feature summaries for A and B
- the single chart distinction under test
- evidence families already observed
- allowed life domains for the prompt
- symmetry constraints

## Output
Produce two parallel narratives that are:
- discriminative
- symmetric
- neutral
- comparable in tone and detail

The narratives should help the user compare plausible life-shapes, not guess the intended answer.

## Generation Flow
1. Pick the candidate pair and the exact distinction being tested.
2. Choose a shared narrative template.
3. Fill both sides using the same domain slots.
4. Normalize tone, length, and uncertainty language.
5. Run symmetry and leakage checks.
6. If the pair remains lopsided, regenerate or discard it.

## Narrative Template
Each narrative should cover the same slots:
- life orientation
- work and visibility
- relationships
- family or duty
- mobility or stability
- crisis or transition style

Only the emphasis should change.

## Symmetry Rules
The two narratives must match closely on:
- sentence count
- specificity level
- grammatical style
- emotional temperature
- uncertainty language
- domain coverage

Allowed differences:
- which domain is foregrounded
- which recurring pattern is emphasized
- which contradiction is more likely

Disallowed differences:
- more flattering wording
- more charisma
- more dramatic tone
- more certainty
- richer detail for one side

## Leakage Rules
The generator must not:
- mention chart placements directly
- name the model's preferred candidate
- reveal the exact reason one candidate is favored
- smuggle in extra clues through tone or length
- echo the user's previous answers in a way that points to the target

## Rendering Rules
The prompt should:
- randomize presentation order
- hide the system preference
- keep the same visual structure for both candidates
- avoid typographic cues that imply ranking

## Quality Checks
Before a pair can be shown to the user, verify:
- a blind reader cannot infer the answer from style alone
- neither side is obviously more flattering
- the distinction survives wording normalization
- the pair still discriminates after cognitive pretesting

## Pairwise Prompt Types

### Balanced Narrative Pair
Use when the two candidate regions are both plausible and close.

### Narrative Plus Contradiction Probe
Use when the system wants the user to compare two plausible shapes and then state where neither fits perfectly.

### Narrative Skip
Use when the pair cannot be made symmetric without losing the distinction.

## Fallback Rules
Do not force a pairwise narrative if:
- the distinction is too subtle to render without leakage
- the candidate pair is too far apart
- the prompt would become a disguised explanation
- the pair cannot be made symmetric after one regeneration attempt

In those cases, fall back to absolute or forced-choice prompts.

## Response Handling
After the user responds:
- record the preferred narrative
- record any uncertainty or caveats
- record whether the user rejected both narratives
- attach the response to the candidate bins and evidence family

This response should update the posterior, not just the narrative score.

## Validation Hooks
The narrative generator should be tested against:
- symmetry checks
- blind-reader checks
- cognitive pretest feedback
- discrimination lift over absolute items
- leakage detection on held-out prompts

## Failure Modes
- one narrative sounds more polished than the other
- one side becomes a subtle hint of the correct answer
- the pair over-explains the chart distinction
- the prompt leaks the current posterior
- the system uses pairwise narratives before the posterior is narrow enough

## Acceptance Criteria
The flow is acceptable if:
- it produces symmetric narrative pairs reliably
- it avoids leading the user
- it supports discrimination better than absolute prompts in the narrow phase
- it remains auditable and replayable

