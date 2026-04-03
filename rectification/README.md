# Rectification Integration Plan

## Goal

Add a rectification subsystem that can score candidate birth times against dated life events without destabilizing the current engine.

The existing engine already covers several required primitives:
- deterministic chart casting via `chartCaster.js`
- houses and angles via `houses.js`
- transits via `transits.js`
- secondary progressions via `progressions.js`
- solar returns via `solarReturn.js`
- zodiacal releasing via `zodiacalReleasing.js`
- timezone normalization via `profile.js`

That makes a practical first release feasible without replacing the current stack.

## What To Implement First

The research supports a coarse-to-fine workflow.

Recommended first-wave techniques:
- angle-focused transits to natal angles and angle rulers
- secondary progressions with progressed angles and houses
- solar arc directions derived from secondary progression solar motion
- annual profections as a coarse yearly filter
- solar returns as annual confirmation
- zodiacal releasing as an optional coarse chapter filter

Recommended later-wave techniques:
- lunations and eclipses as trigger overlays
- prenatal syzygy lookup as a non-decisive hypothesis generator

Recommended research-only technique:
- primary directions, especially Topocentric / Polich-Page variants

Primary directions should not be in phase 1. The current engine is built around geocentric longitudes, RA, sidereal time, and house math that is good for lines, transits, returns, and progression-based work. Primary directions need a separate mathematical layer, stricter doctrine locking, and stronger validation before shipping.

## Why This Fits The Current Engine

The current codebase already uses the same astronomy primitives that the first-wave rectification stack needs:
- `Equator`, `GeoVector`, `Ecliptic`, and `SiderealTime` from Astronomy Engine
- deterministic UTC input handling
- explicit house calculation
- exact-search style transit solving

The main gap is not astronomy. The main gap is a rectification-specific scoring pipeline that can:
- generate candidate birth-time grids
- compute time-sensitive chart features for each candidate
- ingest dated evidence cleanly
- score candidates with fixed rules
- return a ranked time interval instead of a single forced answer

## Proposed Folder Layout

New work should live in a separate top-level folder:

```text
rectification/
  README.md
  index.js
  types.js
  time/
    candidateGrid.js
    timezoneAudit.js
  data/
    evidenceModel.js
    eventNormalizer.js
  features/
    candidateChart.js
    angleTargets.js
    profections.js
    solarArc.js
    progressions.js
    returns.js
    zr.js
  scoring/
    transitScorer.js
    progressionScorer.js
    solarArcScorer.js
    returnScorer.js
    fusion.js
  pipeline/
    triage.js
    rectify.js
    explain.js
```

This keeps rectification logic out of `astro.mjs`, `transits.js`, and `progressions.js` except for small reusable exports.

## Reuse vs New Code

### Reuse With Minimal Changes

`chartCaster.js`
- keep as the single astronomy entrypoint
- expose any missing helpers needed by rectification instead of re-calling Astronomy Engine directly everywhere

`houses.js`
- reuse as-is for candidate angle generation
- add tests around minute-to-minute ASC and MC movement before depending on it for scoring

`transits.js`
- keep the exact-search machinery
- extend target support so transiting planets can hit non-planet points such as `ASC`, `MC`, `DSC`, `IC`, selected house cusps, and lots

`progressions.js`
- keep `progressedDate`
- add progressed chart features that include houses and angles at the birth location for each candidate time

`solarReturn.js`
- keep solar return solving
- add return-to-natal contact extraction instead of only returning a chart snapshot

`zodiacalReleasing.js`
- keep current period generation
- use only as a coarse filter or tie-breaker, not as the dominant evidence family

### Add New Rectification-Specific Modules

`candidateGrid.js`
- generate 24-hour grids at 2-minute resolution
- support refinement windows at 1 minute and 30 seconds
- preserve both local timestamp and UTC timestamp for every candidate

`evidenceModel.js`
- store event evidence as intervals, not forced point dates
- separate provenance, precision, and reliability from semantic content
- match the repo’s rectification research docs

`angleTargets.js`
- compute natal sensitive points for each candidate
- start with `ASC`, `MC`, `DSC`, `IC`
- optionally include selected whole-sign or quadrant house cusps later

`profections.js`
- add whole-sign annual profection support
- return profected house, activated sign, and lord of the year
- use as yearly pruning, not minute-level scoring

`solarArc.js`
- compute solar arc as `progressedSunLon - natalSunLon`
- direct all natal points by the same arc
- support both `directed angles -> natal planets` and `directed planets -> natal angles`

`returns.js`
- derive return features that are useful for rectification
- start with solar return angles to natal planets and annual rulers

`fusion.js`
- combine technique scores with fixed weights and trace output
- return top candidates plus an interval

## Technique Implementation Notes

### 1. Angle-Focused Transit Scoring

This should be the first scoring family because it fits the current transit solver and because the report consistently treats angle activation as the practical first-tier rectification tool.

Implementation:
- keep planet longitude transit search exact-search logic
- allow natal targets beyond planets
- prioritize outer-planet hits to angles for major life events
- store direct, retrograde, and final pass clusters together
- score event windows against all passes inside the admissible interval

Rules:
- do not score every transit equally
- prioritize angle hits over generic planet-to-planet hits
- keep orb rules fixed in config
- log which exact contacts drove a candidate score

### 2. Secondary Progressions With Angles

The current progression module only returns planetary longitudes. Rectification needs angle-sensitive progressions.

Implementation:
- compute the progressed date for an age or event date
- cast the progressed chart
- compute houses for the birth location using each candidate birth time
- extract progressed `ASC`, `MC`, and key angular contacts

Focus first on:
- progressed angles to natal planets
- progressed Moon to natal angles
- progressed sign changes and station-like slowdowns as supporting context

### 3. Solar Arc Directions

This should be implemented as a thin layer on top of the progression module.

Implementation:
- derive the solar arc from the progressed Sun
- add the same arc to natal planets, angles, and selected points
- normalize to `[0, 360)`
- score exactness against event dates

Why this is a good fit:
- no separate ephemeris engine is needed
- it reuses existing progression math
- it matches the repo’s own research notes that call solar arc a practical first-tier rectification tool

### 4. Annual Profections

This is a pruning and ranking helper, not a minute solver.

Implementation:
- use whole-sign houses only
- derive profected house from age
- identify the lord of the year
- boost event scoring when the event topic matches the profected house and ruler family

This module should stay doctrine-explicit. Do not mix whole-sign profections with quadrant-house interpretation inside the same score without a flag.

### 5. Solar Returns

The current module already finds the return moment. The missing piece is structured scoring.

Implementation:
- compute the solar return chart for the event year
- extract return angles, return ruler emphasis, and angular return planets
- score contact patterns involving natal angles, natal rulers, and the profected lord

Use this as annual confirmation, not the main fine-tuning engine.

### 6. Zodiacal Releasing

The current implementation is enough for a coarse chapter layer.

Use it to:
- identify broad life-phase shifts
- check whether candidate times near lot sign boundaries materially change chapter structure
- break ties inside already-narrow candidate windows

Do not let zodiacal releasing dominate early ranking unless candidate times actually cross a lot boundary.

### 7. Primary Directions

Treat this as a separate R&D track.

Reasons:
- the repo does not yet have a direction engine
- the calculation choices are under-specified and school-dependent
- research support is thinner and overfitting risk is higher
- reliable implementation probably needs either a Swiss Ephemeris-backed subsystem or a carefully validated standalone direction math layer

If implemented later, it should live under:

```text
rectification/research/primaryDirections/
```

and ship only after benchmark comparison against simpler methods.

## Rectification Pipeline

The repo’s own rectification research already points to the right runtime shape. The product pipeline should be:

1. Normalize birth date, place, timezone, DST, and provenance.
2. Build a 24-hour candidate grid at 2-minute resolution.
3. Compute candidate-sensitive features for each bin.
4. Score coarse families first: profections, zodiacal releasing, annual return context.
5. Score fine families next: transits, progressed angles, solar arc.
6. Refine around the top mass at 1 minute, then 30 seconds if justified.
7. Return a ranked interval and an explanation payload.
8. Abstain when the posterior stays flat or unstable.

## Suggested CLI Additions

Add rectification commands without polluting existing timing commands:

```text
node astro.mjs rectification-grid '{...}'
node astro.mjs rectify-events '{...}'
node astro.mjs rectify-explain '{...}'
node astro.mjs profections '{...}'
node astro.mjs solar-arc '{...}'
```

The existing `transits`, `progressions`, and `solar-return` commands should stay focused and reusable.

## Data Contract

Every event should be stored with:
- event type
- topic family
- local start and end date
- precision class
- source grade
- provenance note
- optional confidence fields

Do not collapse uncertain events to single timestamps just because scoring code is simpler.

Do not store rectified times in the same field shape as documentary times.

## Scoring Strategy

Use explicit, auditable scoring before anything statistical or learned.

Recommended first-pass scoring:
- per-technique score per candidate bin
- event-family weights frozen in config
- strict separation between content score and reliability weight
- final fused score plus trace object

Return:
- top candidate bins
- best interval
- entropy or dispersion metric
- abstain flag
- explanation trace listing the strongest contributing hits

## Delivery Phases

### Phase 1

Build the rectification skeleton and ship deterministic scoring:
- candidate grid
- evidence model
- angle target extraction
- profections
- transit-to-angle scoring
- progressed-angle scoring
- solar arc scoring
- fused ranking output

### Phase 2

Add annual overlays and refinement controls:
- solar return scorer
- optional lunation and eclipse triggers
- posterior-based local refinement
- explanation payloads

### Phase 3

Benchmark and harden:
- known-time evaluation set
- fit vs validate event splits
- abstention thresholds
- calibration metrics

### Phase 4

Research-only expansion:
- primary directions
- prenatal syzygy experiments
- any doctrine-specific expert branches

## Source Notes

Implementation choices above are aligned with:
- the repo’s rectification architecture docs under `research/rectification-round2/60-implementation/`
- the repo’s timing workflow docs under `research/workflows/` and `research/techniques/timing/`
- Astronomy Engine documentation for `SiderealTime`, `SearchSunLongitude`, `SearchHourAngle`, equatorial/ecliptic coordinate transforms, and deterministic UTC handling
- Swiss Ephemeris house-system documentation for the Topocentric / Polich-Page house-system distinction
- TimePassages manual notes that frame rectification around angle sensitivity and event matching, while also showing that chart-time adjustment is usually comparative and iterative

## Bottom Line

The right first integration is not a monolithic “rectification engine”.

The right first integration is a separate `rectification/` subsystem that reuses the existing deterministic chart code, adds candidate-grid and evidence layers, and focuses phase 1 on angle-based transits, progressed angles, solar arc, profections, and solar returns.
