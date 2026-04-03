# Solar Returns

## Current Engine Fit

- The current engine already has a solar-return entry point in [solarReturn.js](/Users/eiko/astrocartography/solarReturn.js) and exposes it through `node astro.mjs solar-return` in [astro.mjs](/Users/eiko/astrocartography/astro.mjs).
- The implementation already does the two essential steps: find the return moment and cast a chart at a chosen location.
- The fit is strong for annual overlay work and weak for minute-level rectification by itself. Solar returns can help rank candidate years and confirm themes, but they do not materially separate nearby birth-time candidates unless other evidence families already narrowed the window.
- The current house computation in [houses.js](/Users/eiko/astrocartography/houses.js) is sufficient for return-angle work because the return chart is just another chart cast at a known moment and location.
- The current documentation in [research/techniques/timing/solar-returns.md](/Users/eiko/astrocartography/research/techniques/timing/solar-returns.md) already frames solar returns as an annual overlay, not a standalone verdict.
- The main integration gap is not chart generation. It is structured scoring: return angle contacts, natal overlays, event-window scoring, and traceable confidence.

## Mathematical Model

### Return Finding

- Let `λ☉,nat` be the natal apparent geocentric ecliptic longitude of the Sun at birth.
- Let `λ☉(t)` be the apparent geocentric ecliptic longitude of the Sun at candidate time `t`.
- The solar return is the root of:

```text
f(t) = wrap180(λ☉(t) - λ☉,nat)
```

where `wrap180` maps angle differences into `(-180°, +180°]`.

- The target is the time `t*` such that `f(t*) = 0`.
- This is the same root-finding pattern used in Astronomy Engine: `SearchSunLongitude(targetLon, startTime, limitDays)` searches for the time the Sun reaches a target longitude, using a root search with bisection and quadratic interpolation.
- Astronomy Engine’s source notes that the search window should be small enough that there is only one root in the interval, and recommends keeping the window roughly in the `1-10 day` range when possible. The current code uses a `30 day` limit in [solarReturn.js](/Users/eiko/astrocartography/solarReturn.js); that works in practice but is looser than the library guidance.
- For this engine, the safest implementation is:

```text
start = UTC(year, natal_birth_month, natal_birth_day - 5)
limitDays = 10
```

or a similarly tight birthday-centered bracket.

### Return Chart Geometry

- Once `t*` is found, cast the chart for `t*` using the existing `castChart()` path.
- Compute houses and angles for the selected return location with the existing `computeHouses(gmst, obliquity, lat, lon)` function.
- That gives the return Ascendant, MC, IC, DSC, and the return-house structure for the chosen relocation point.

### Annual-Angle Scoring

- Use a normalized angular distance:

```text
d(a, b) = min(|a - b|, 360° - |a - b|)
```

- Use a fixed orb kernel for contacts:

```text
k(d, orb) = max(0, 1 - d/orb)^2
```

- Score an annual return feature as:

```text
score = Σ_i w_i * k(d_i, orb_i) * m_i
```

where:
- `w_i` is a frozen feature weight
- `d_i` is the angular separation for a specific contact
- `orb_i` is the allowed orb for that contact type
- `m_i` is a modifier from natal strength or return-chart condition

- For solar returns, the highest-value contacts are:
  - return Ascendant / MC to natal planets
  - return planets on return angles
  - return Ascendant ruler and return Moon
  - return angle contacts to natal angles

- The scoring should be return-chart-centric, not natal-chart-only. A solar return is a chart of the year, so the score should look at how the annual angles and annual ruler themes map onto natal structure.

### Sensitivity

- Solar returns are poor minute discriminators because the Sun moves about `0.9856°/day`, which is roughly `0.0411°/hour`.
- A 1-hour error in natal birth time shifts natal solar longitude by roughly `0.041°`, which corresponds to about 1 minute of return-time shift.
- So the return moment itself changes only slightly with minute-level birth errors.
- That is why solar returns should be treated as annual confirmation and year-level pruning, not as the primary exact-time rectifier.

## Candidate-Grid Implications

- Do not place solar returns inside the fine 2-minute candidate grid as a first-pass discriminator.
- Use them after the grid has already been narrowed by stronger minute-sensitive layers.
- At most, use solar returns to:
  - prune candidate years
  - confirm annual themes for a narrow candidate cluster
  - compare location-dependent annual emphasis across a small set of candidate birth profiles
- Because the return moment is almost invariant under small birth-time perturbations, caching should happen at the year and natal-Sun-longitude level, not per 2-minute candidate bin.
- If the rectification pipeline needs a year-level branch, the candidate object should store:
  - natal Sun longitude
  - return year
  - return location
  - return chart contact summary
  - annual theme score
- The best design is a coarse-to-fine pipeline where solar returns are a yearly overlay, and transits / progressions / solar arc handle the time-sensitive discrimination.

## Open-Source Implementations

- `openastro2` exposes solar return variants such as `Solar`, `SolarNext`, `SolarPrev`, and `SolarNear`, with logic in `openastro2/openastromod/local_to.py` and orchestration in `openastro2.py`.
- Its implementation uses a mean tropical year constant (`31556925.51` seconds) and iterative correction from Sun longitude differences. That is useful as a workflow reference, but it is not the most exact possible method.
- Kerykeion explicitly documents `PlanetaryReturnFactory` for solar and lunar returns, and its docs describe return charts as being cast for a precise moment and a chosen return location. The library and the derived Astrologer API expose solar-return chart generation and solar-return context endpoints.
- Immanuel (`theriftlab/immanuel-python`) provides solar-return chart generation on top of Swiss Ephemeris. Its `forecast.solar_return()` seeds the search from a mean-year estimate and then iteratively corrects using the Sun longitude error and instantaneous solar speed.
- These open-source solutions agree on the product shape:
  - pick a return location
  - find the return moment
  - cast the return chart
  - expose the chart as a structured payload
- None of the open-source solutions found here provide a rectification posterior or a transparent event-scoring model. That scoring layer should be implemented in this codebase.

## Integration Plan

### Phase 1: Make Return Data Structured

- Keep [solarReturn.js](/Users/eiko/astrocartography/solarReturn.js) as the solar-return computation entry point.
- Tighten the search window and document the root-finding assumptions.
- Return a structured object that includes:
  - return time
  - return location
  - return angles
  - return houses
  - natal Sun longitude
  - return Sun longitude
  - a short contact list of annual-angle hits
- Add a small helper in a separate rectification folder, for example `rectification/features/returns.js`, that extracts contacts between return angles and natal points.

### Phase 2: Add Annual Scoring

- Add a dedicated scorer, for example `rectification/scoring/solarReturnScorer.js`.
- Score return Ascendant, MC, Moon, and angular planets against natal planets and natal angles.
- Use frozen orbs and traceable weights.
- Keep the return score separate from the natal astrocartography score in `natalScoring.js`.

### Phase 3: Wire Into Rectification

- Add a rectification pipeline that treats solar returns as one evidence family among several.
- Use solar returns to boost or suppress candidate years and to provide annual confirmation after minute-sensitive methods have already narrowed the field.
- Keep solar return evidence as explicit objects with support interval, source grade, and confidence, not as an implicit side effect of chart generation.

### Phase 4: Cache And Reuse

- Cache by `(natal Sun longitude, year, return location)` rather than by full minute grid.
- Reuse the existing house and chart math rather than introducing a second ephemeris path.
- If this engine later supports multiple locations, keep solar-return location handling explicit and local to the rectification subsystem.

### Recommended Code Changes

- Add a return-contact extractor in a new rectification module.
- Add an annual-angle scorer with fixed orbs.
- Tighten `SearchSunLongitude` windowing in [solarReturn.js](/Users/eiko/astrocartography/solarReturn.js) to match the library guidance.
- Keep the current CLI command, but add rectification-facing programmatic APIs instead of expanding the CLI first.

## Risks

- Solar returns are easy to over-read. A single angular return contact should not be treated as decisive.
- Return charts are location-sensitive, so a return chart computed for the wrong relocation point will produce misleading angular contacts.
- If the search window is too wide or the root is not uniquely bracketed, the search can fail or return the wrong event.
- Because the Sun moves slowly, this technique is weak for exact birth-minute discrimination and should never be the only rectification layer.
- Different house systems change the return angles and house emphasis. The system choice must be explicit in the return payload.

## Validation And Tests

- Compare the return moment against `SearchSunLongitude` on known natal charts and verify the root is within a strict tolerance.
- Cross-check a sample of solar-return moments against Kerykeion and Immanuel outputs to confirm that the time and chart structure are within expected library tolerances.
- Add tests for:
  - return-time root correctness
  - return house computation at a fixed location
  - angular contact scoring
  - cache reuse across tiny birth-time perturbations
  - search-window safety
- Add a regression test showing that a 1-hour natal birth-time perturbation changes the return time by about 1 minute, which confirms the technique is annual-layer sensitive but weakly minute-sensitive.

## Sources With Links

- Current engine solar-return implementation: [solarReturn.js](/Users/eiko/astrocartography/solarReturn.js)
- Current engine CLI hook: [astro.mjs](/Users/eiko/astrocartography/astro.mjs)
- Current engine timing docs: [research/techniques/timing/solar-returns.md](/Users/eiko/astrocartography/research/techniques/timing/solar-returns.md)
- Astronomy Engine source for Sun-longitude search and root-finding semantics: https://github.com/cosinekitty/astronomy/blob/master/source/c/astronomy.c#L6598-L6627 and https://github.com/cosinekitty/astronomy/blob/master/source/c/astronomy.c#L6737-L6793
- OpenAstro2 solar-return implementation: https://github.com/dimmastro/openastro2/blob/main/openastro2/openastromod/local_to.py#L476-L566 and https://github.com/dimmastro/openastro2/blob/main/openastro2/openastro2.py#L1183-L1223
- Kerykeion solar-return factory docs: https://kerykeion.net/content/docs/planetary_return_factory
- Kerykeion repository: https://github.com/g-battaglia/kerykeion
- Astrologer API docs with solar-return endpoints: https://kerykeion.net/content/docs/astrologer-api
- Immanuel repository: https://github.com/theriftlab/immanuel-python
