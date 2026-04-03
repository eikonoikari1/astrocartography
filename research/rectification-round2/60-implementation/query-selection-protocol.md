# Query Selection Protocol

## Purpose
Define how the interview engine chooses the next question, next family, and next format in a way that is informative, calibrated, and not circular.

## Selection Inputs
The selector should read:
- current posterior over candidate bins
- triage label and triage score
- current evidence family coverage
- response quality history
- source quality tier
- remaining question budget
- stage of the interview
- whether the case is in coarse pruning, refinement, or confirmation

## Candidate Generation
The selector should generate a small set of candidate prompts from the current state:
- one or more high-priority absolute items
- one or more forced-choice items
- one contradiction probe if the current fit is too smooth
- one pairwise prompt only if the posterior is already narrow enough

Do not enumerate every possible prompt. Generate a bounded candidate slate so scoring stays stable and auditable.

## Primary Objective
Choose the prompt with the highest expected gain in posterior quality per unit cost.

Posterior quality should mean:
- lower entropy
- better calibration
- narrower interval width when appropriate
- better separation between nearby bins

## Scoring Functions
Use a weighted score over the candidate slate.

Recommended score components:
- expected entropy reduction
- expected rank stability improvement
- expected calibration benefit
- contradiction yield
- cost penalty for user burden
- diversity penalty for repeating the same family

The selector should prefer the prompt that best improves the posterior, not the prompt that sounds most insightful.

## Family Priority Rules
The selector should follow the research ranking:
- career axis
- relationship axis
- family duty
- mobility
- crisis pattern
- identity pressure
- work style
- emotional posture
- body/style only late
- public biography only late

If a family has already been asked and did not move the posterior, downweight it unless the current posterior has changed enough to make it newly relevant.

## Format Selection Rules

### Use Absolute Items When
- the user is still in coarse pruning
- the distinction is broad and concrete
- the posterior is not yet narrow enough for pairwise comparison

### Use Forced-Choice Items When
- two plausible life-shapes remain in play
- one answer is better than a long narrative
- the engine needs a discriminative split with low user burden

### Use Pairwise Narrative Prompts When
- the posterior is already narrow
- the two candidates are genuinely close
- the narrative generator can pass symmetry checks

### Use Contradiction Probes When
- the answer set looks too clean
- the current posterior may be overconfident
- a family needs a negative control before it is trusted

## Query Selection Algorithm
1. Compute the current posterior and candidate-bin neighborhoods.
2. Identify the families that are not yet saturated.
3. Generate a bounded slate of prompts by family and format.
4. Reject prompts that repeat a recently used family without a new reason.
5. Score each prompt by expected gain minus cost and diversity penalty.
6. Choose the top prompt subject to stage constraints.
7. Log the candidate slate and the score breakdown.

## Stage Constraints

### Coarse Pruning
Prioritize:
- core families
- absolute items
- forced-choice items

Avoid:
- pairwise narratives
- highly detailed event timing

### Refinement
Prioritize:
- pairwise narratives
- contradiction probes
- targeted absolute items around the boundary

Avoid:
- generic broad questions that do not split the remaining bins

### Confirmation
Prioritize:
- event windows
- fuzzy timing evidence
- contradiction checks on the current favorite candidate

Avoid:
- adding new families unless the posterior is still moving

## Budget Rules
The selector should stop asking if:
- expected gain falls below a threshold
- the posterior is stable across multiple prompt types
- the remaining uncertainty is below the reporting threshold
- the case is triaged as low-separability and the budget is better spent elsewhere

## Tie-Breaking
When two prompts score similarly:
- prefer the one with lower user burden
- prefer the one with higher auditability
- prefer the one that covers an uncovered family
- prefer the one that helps the benchmark comparison

## Anti-Circularity Rules
The selector must not:
- reuse triage score as a downstream feature unless explicitly logged and isolated
- choose prompts based on hidden chart labels
- let previously learned doctrine preferences dominate before the family has been tested
- tune its own thresholds on the holdout set

## Selection Logging
For every selected prompt, log:
- candidate slate
- score decomposition
- chosen prompt
- rejected alternatives
- posterior before selection
- posterior after response
- stage and family

This is required for ablation and counterfactual replay.

## Failure Modes
- over-asking the same family
- selecting prompts because they are easy to render, not because they are informative
- confusing user confidence with model confidence
- letting a single family dominate early
- using pairwise narratives too soon

## Acceptance Criteria
The selection protocol is acceptable if it:
- produces consistent prompt choices under replay
- improves posterior quality faster than random or static ordering
- respects stage constraints
- avoids circular dependence on triage or labels

