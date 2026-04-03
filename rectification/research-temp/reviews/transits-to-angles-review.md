# Transit To Angles Review

## Verdict

The brief is coherent and mostly mathematically sound for phase-1 transit-to-angle rectification. It correctly recognizes that the engine already has the needed astronomy primitives and that the real problem is candidate birth-time search around angle-sensitive targets. The main gap is that the implementation plan is still too close to the existing transit solver and does not fully spell out the candidate-birth-time scoring loop.

## Mathematically Sound Points

- The separation model `wrap180(λ_p(t) - λ_a(b) - α)` is correct for an ecliptic-longitude aspect test, provided `λ_a(b)` is computed from the candidate chart.
- Using `ASC`, `MC`, `DSC`, and `IC` as candidate-dependent targets fits the current `houses.js` and `chartCaster.js` math.
- Preserving applying/separating state and using root-finding for exact hits is aligned with the current `transits.js` design.
- A coarse-to-fine grid of 2 minutes, then 1 minute, then 30 seconds is reasonable for angle rectification because ASC and MC move fast with birth time.

## Issues Or Caveats

- The score definition `min_{t in I_e} |d(t; b, p, a, α)|` is under-specified for real event windows. A pure minimum lets a wide interval hide many misses, so the brief should distinguish exact event timestamps, point-in-window evidence, and interval likelihood.
- The integration plan says to extend the transit search API, but rectification is not just a new target list. It needs a candidate-birth-time evaluator that recomputes angles per bin and then scores fixed events against those bins.
- The brief mentions cusp extensions, but the current engine falls back to equal houses above 60° latitude. That makes cusp-based rectification materially weaker than angle-based rectification and should stay out of phase 1.
- The open-source section mixes true OSS references with proprietary workflow references. That is acceptable as background, but the brief should be explicit that TimePassages is a workflow reference only, not an implementation source.

## Required Corrections

- Reframe the scoring loop around candidate birth-time bins first, then transit hits second. The candidate chart is the variable; the transit bodies are fixed at the event time.
- Replace the raw interval minimum with a stricter event model: exact timestamp when available, otherwise interval-censored scoring with a frozen orb table and an explicit pass-count policy.
- Limit phase 1 to `ASC`/`MC` plus `DSC`/`IC` mirrors. Defer cusp and lots extensions until the candidate scorer has been validated at low latitude.
- Define the aspect/orb policy as configuration, not as an implicit default, so validation can compare one frozen rule set against another.

## Final Recommendation

Approve this brief as a phase-1 integration plan after the corrections above. The math is right at the aspect-separation level, but the implementation plan should be tightened so it scores candidate birth times explicitly instead of looking like a generic transit search with angle targets bolted on.
