# Implementation Readiness Brief

## What Is Now Ready
The project has enough structure to move from research into implementation planning.

The following are now specified:
- the target claim and its limits
- the hypothesis board and open questions
- the triage logic for `high`, `medium`, and `low` separability
- the audit and label workflow for `gold`, `challenge`, `quarantine`, and `reject`
- the evidence object model with separate value, confidence, and provenance layers
- the inference architecture from ingestion through posterior fusion and abstention
- the benchmark pipeline with selected-set and full-population reporting
- the interview engine with staged question families, pairwise narratives, and contradiction probes

## Stable Decisions
These decisions are now strong enough to build around:

1. Minute-level rectification is a subset capability.
2. Provenance is part of the target, not background metadata.
3. The core interview should prioritize life-structure families.
4. Multimodal cues stay outside the core posterior unless they clear strict ablation.
5. Doctrine-specific experts should stay separate until late fusion.
6. The output must be calibrated interval-or-abstain by default.
7. The benchmark must report both selected and full-population performance.

## Suggested Build Order

### Step 1
Implement the data schema and evidence object model.

### Step 2
Implement the audit and labeling workflow for source routing and strict gold assignment.

### Step 3
Implement the deterministic chart engine and candidate-bin grid interfaces.

### Step 4
Implement the triage layer and frozen triage reporting.

### Step 5
Implement the interview engine with the ranked question families only:
- career axis
- relationship axis
- family duty
- mobility
- crisis pattern
- identity pressure

### Step 6
Implement the first posterior path:
- event windows
- interview responses
- pairwise comparisons
- one doctrine expert at a time if needed for staged rollout

### Step 7
Implement calibration, abstention, and benchmark reporting.

### Step 8
Only after the benchmark is stable, add doctrine fusion and optional research-only modalities.

## Best MVP Definition
The MVP should aim to prove four things:
- the triage layer does not hide failure
- the interview layer contracts the posterior more than controls
- the system beats a strong biography-only baseline on the gold set
- the returned intervals are calibrated

If the MVP cannot prove those four things, more architecture will not save it.

## Immediate Next Step
The next productive move is to convert this brief and the files in `60-implementation` into a concrete engineering build plan with tasks, interfaces, and a minimal benchmark-first milestone.
