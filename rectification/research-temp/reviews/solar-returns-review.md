# Solar Returns Review

## Verdict

The brief is coherent and mostly aligned with the current engine. The proposed integration path matches the existing `solarReturn.js` / `astro.mjs` shape, and the core return-finding math is correct. I would approve the plan with one required correction: the sensitivity example in the brief is numerically wrong.

## Mathematically Sound Points

- The return root formulation `wrap180(λ☉(t) - λ☉,nat) = 0` matches the current `SearchSunLongitude(...)` implementation in [solarReturn.js](/Users/eiko/astrocartography/solarReturn.js#L20) and the `solar-return` CLI hook in [astro.mjs](/Users/eiko/astrocartography/astro.mjs#L235).
- The use of a fixed angular kernel `k(d, orb) = max(0, 1 - d/orb)^2` is mathematically reasonable for a scoring layer, provided orbs are frozen before evaluation.
- The recommendation to treat solar returns as annual confirmation rather than minute-level rectification is consistent with the engine’s current design and with the existing timing docs.
- The suggestion to tighten the search bracket is directionally correct. The current code uses a `30` day limit in [solarReturn.js](/Users/eiko/astrocartography/solarReturn.js#L20), so a narrower birthday-centered bracket is a better fit for unique-root safety.

## Issues Or Caveats

- The sensitivity claim on [solar-returns.md](/Users/eiko/astrocartography/rectification/research-temp/solar-returns.md#L80) is wrong by about a factor of 60. A `1` hour natal birth-time error changes natal solar longitude by about `0.041°`, which maps to about `1` hour of solar-return shift, not `1` minute.
- The brief implies the return moment is “almost invariant” under small birth-time perturbations. That is only true in the narrow sense that the Sun moves slowly; numerically, the return time still shifts roughly one-for-one with the natal Sun longitude error. The weak part of the technique is not the return solve itself, but the annual-scoring discriminative power.
- The plan assumes the return location is an explicit input, but it does not lock down the policy for rectification runs. If location varies across candidate years or user profiles, the scorer can blur birth-time evidence with relocation evidence.

## Required Corrections

- Replace the line `A 1-hour error ... corresponds to about 1 minute of return-time shift` with `about 1 hour of return-time shift`.
- Make the return-location policy explicit in the integration plan: fixed canonical location, user-supplied annual residence, or per-case chosen return location. Do not let that choice drift implicitly inside the scorer.
- If the new rectification helper caches return results, key it by the exact natal Sun longitude used for the search, not just by year and location.
- Keep the tighter bracket recommendation, but express it as an implementation policy rather than a mathematical guarantee, since `SearchSunLongitude` still depends on root uniqueness inside the chosen window.

## Final Recommendation

Proceed with the solar-return integration, but revise the sensitivity wording and lock the location policy before implementation. Once those two points are corrected, the brief is consistent with the current engine and gives a sensible path for a separate `rectification/` scoring layer.
