# Wave 3 Findings

## Main Shifts
Wave 3 narrowed the remaining uncertainty in four important ways.

First, the high-separability subset must be estimated as a prevalence problem, not read off the triage acceptance rate. That means the project now needs weighted audit sampling and selection-aware reporting.

Second, the interview layer is now ranked. The core families are:
- career axis
- relationship axis
- family duty
- mobility

The next tier is:
- crisis pattern
- identity pressure
- work style
- emotional posture

Everything below that is delayed, corroborative, or research-only.

Third, multimodal cues are now constrained sharply. Appearance, voice, and free-form text should stay out of the core posterior unless they survive strict ablation against simpler alternatives. Public biography remains useful mainly as structured event extraction.

Fourth, the baseline and leakage story is now much stronger. The system has to beat a serious biography-only competitor while surviving counterfactual tests, leakage checks, and selection-aware reporting.

## What This Means For The Project
The project is becoming narrower and stronger at the same time.

It is narrower because:
- the target population is being defined more precisely
- the core interview families are being reduced to the strongest ones
- multimodal ambition is being deferred

It is stronger because:
- the prevalence question is now statistically well-posed
- the baseline story can expose fake success
- the interview layer can now be benchmarked family by family

## Best Next Move
Move into an implementation-ready architecture pass focused on:
- one shared data schema
- one evidence object model
- one triage flow
- one benchmark pipeline
- one interview engine protocol

That should be the next wave.
