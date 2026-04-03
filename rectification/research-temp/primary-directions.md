# Primary Directions

## Current-Engine Fit And Incompatibilities

- Primary directions are the least compatible rectification technique in this repo’s current stack.
- The existing engine is optimized for:
  - geocentric ecliptic longitudes
  - chart casting at civil datetimes
  - house and angle computation from sidereal time
  - transit and progression workflows that map cleanly to UTC timestamps
- Primary directions need a different core representation:
  - right ascension and declination for promissors and significators
  - RAMC as a first-class quantity
  - semi-arcs, meridian distance, and oblique ascension
  - doctrine-specific choices for zodiacal versus mundane directions
  - explicit time-key selection
- The current engine does not yet expose enough of that geometry as reusable primitives.

Specific incompatibilities with the current code:
- [chartCaster.js](/Users/eiko/astrocartography/chartCaster.js) gives RA and declination for planets, but the rest of the engine is longitude-first and does not carry equatorial geometry forward into higher-level APIs.
- [houses.js](/Users/eiko/astrocartography/houses.js) returns ecliptic cusps and angles, but not the directional quantities primary directions actually need, such as RAMC, meridian distance, semi-arc fractions, or oblique ascensions.
- [transits.js](/Users/eiko/astrocartography/transits.js) and [progressions.js](/Users/eiko/astrocartography/progressions.js) are time-search tools. Primary directions are arc-search tools whose event dates are derived only after the arc is computed.
- The current rectification plan under [rectification/README.md](/Users/eiko/astrocartography/rectification/README.md) is built around candidate birth-time bins, event windows, and longitude-based feature extraction. Primary directions need a separate directional geometry layer before they can plug into that pipeline.
- The strongest practitioner variant in the repo’s research, Topocentric / Polich-Page primaries, is especially incompatible because the current engine does not implement topocentric primary-direction geometry or the related doctrine boundaries.

Bottom line:
- transits, progressions, solar arc, profections, solar returns, and zodiacal releasing can reuse the current engine directly
- primary directions need either a sidecar engine or a new isolated geometry subsystem

## Mathematical Model

Primary directions model the Earth’s axial rotation as the fundamental symbolic motion. The promissor advances by diurnal rotation until it reaches the significator. The resulting arc is converted into years by a time key.

### Core Equatorial Quantities

For each directed point, define:
- right ascension `RA`
- declination `δ`
- geographic latitude `φ`
- right ascension of the meridian `RAMC`

Useful formulas from the open-source direction engines:

Ascensional difference:

```text
AD = asin(tan(δ) * tan(φ))
```

Semi-arcs:

```text
DSA = 90° + AD
NSA = 90° - AD
```

Meridian distance:

```text
MD = wrap180(RA - RAMC)
```

Oblique ascension:

```text
OA = RA - AD
```

These quantities drive the two main implementation families.

### Zodiacal Directions

Zodiacal directions project the motion onto the ecliptic frame. In the open-source Stellium implementation, the arc is the difference between oblique ascensions:

```text
arc_zodiacal = wrap360(OA_promissor - OA_significator)
```

This is the easier path to implement because it stays closer to longitude-based chart models, but it is still equatorial geometry under the hood.

### Mundane Directions

Mundane directions use semi-arcs and the point’s current place in house space.

For a point:

```text
mundane_ratio = |MD| / current_semi_arc
```

The directed arc is then computed by moving the promissor to the significator’s mundane proportion or to a special angular target such as the MC or ASC.

This is more faithful to Placidus-style and related 3D approaches, but it is also materially harder to integrate and validate.

### Time Keys

The arc is not yet an age. A time key converts arc degrees into years.

Ptolemy key:

```text
age_years = arc_degrees
```

Naibod key:

```text
mean_solar_motion = 0.98564733° per year-day
age_years = arc_degrees / 0.98564733
          ≈ arc_degrees * 1.01456
```

Dynamic keys also exist, but they should not be part of phase 1.

### Direct And Converse

Primary directions can be direct or converse. The implementation has to preserve the sign of the arc and the direction mode explicitly. This cannot be inferred safely later from the event date.

## Directional Variants And Doctrine Choices

Primary directions are not one technique. They are a family of related techniques with incompatible choices.

The integration has to freeze these choices before scoring:
- zodiacal versus mundane
- aspectual contacts versus body-to-body contacts only
- direct versus converse
- time key: Ptolemy, Naibod, or dynamic
- promissor and significator set
- house framework and pole handling

Important variant families:

### 1. Zodiacal / Regiomontanus-Style

- 2D projection style
- easier to implement
- useful as a research gateway
- still requires equatorial conversions and time-key handling

### 2. Mundane / Placidus-Style

- 3D semi-arc style
- requires meridian-distance and semi-arc geometry
- much closer to full traditional primary-direction practice
- significantly harder to validate and maintain

### 3. Topocentric / Polich-Page

- highly specialized rectification tradition
- often paired with very small operative orbs
- not a drop-in extension of the repo’s current house math
- best treated as a separate research track even if basic zodiacal directions are implemented

### 4. Dynamic Keys

- convert arc to time using astronomical motion instead of a static rate
- increase implementation complexity substantially
- should remain out of scope until the static-key implementation is benchmarked

## Open-Source Implementations

### Stellium

The strongest open-source reference found is Stellium’s directions engine:
- [Stellium directions source](https://stellium.readthedocs.io/en/latest/_modules/stellium/engines/directions.html)
- It explicitly supports:
  - zodiacal directions
  - mundane directions
  - Ptolemy and Naibod keys
  - direct and converse handling
- It models:
  - equatorial points
  - mundane positions
  - direction results with arc, age, and date

This is the best reference for a mathematically serious implementation shape.

### Astrolog

[Astrolog source](https://github.com/koson/astrolog-3) is useful as an implementation oracle for direction and solar-arc workflows:
- it contains explicit logic for arcs, progression keys, and direction-style chart advancement
- it is valuable for cross-checking date conversion behavior and CLI/API exposure
- it is less clean as an architectural template than Stellium, but still useful for regression comparison

### OpenAstro2

[OpenAstro2](https://github.com/dimmastro/openastro2) exposes “Direction” modes, but the code path found is closer to symbolic degree-per-time advancement than to a full primary-direction geometry engine. It is useful as a workflow reference, not as the main mathematical oracle.

## Integration Options

### Option A: Sidecar Direction Engine

Build primary directions as an isolated subsystem backed by Swiss Ephemeris or a direction engine that already models the needed equatorial geometry.

Shape:
- `rectification/research/primary-directions/adapter.*`
- external or embedded sidecar
- current JS engine calls into it only after candidate pruning

Pros:
- best mathematical integrity
- easiest way to compare against mature implementations
- keeps complex doctrine choices isolated

Cons:
- adds deployment complexity
- cross-language integration if the sidecar is not JS

### Option B: Native JS Zodiacal-Only Research Implementation

Implement only zodiacal primary directions first, with:
- equatorial conversion
- oblique ascension
- static keys only
- direct/converse support

Pros:
- easier to integrate into the current stack
- lower complexity than full mundane directions

Cons:
- still a substantial new subsystem
- not equivalent to Topocentric / Polich-Page rectification practice
- likely to disappoint if marketed as “full primary directions”

### Option C: Full Native Zodiacal Plus Mundane Engine

Implement both zodiacal and mundane directions in JS inside the current repo.

Pros:
- one codebase
- no sidecar

Cons:
- highest risk
- hardest to validate
- most likely to stall the broader rectification roadmap

## Recommended Path

Recommended path:

1. Do not place primary directions in phase 1 of the main rectification engine.
2. Build or integrate them as a research-only subsystem under:

```text
rectification/research/primary-directions/
```

3. Start with Option A or Option B, not Option C.
4. If a native path is required, implement zodiacal directions first and keep the method label explicit in every output.
5. Defer mundane and Topocentric / Polich-Page variants until the baseline zodiacal implementation has been benchmarked against external references.

That path preserves the current engine’s momentum while keeping primary directions available for serious research.

## Minimum Method Bundle To Freeze First

If the team decides to implement a reviewable research prototype, the first frozen bundle should be:

- method: zodiacal only
- mode: direct and converse, both explicit in output
- time key: Naibod default, Ptolemy optional
- promissors: classical planets plus `ASC` and `MC`
- significators: `ASC`, `MC`, classical planets
- contact set: body-to-angle and body-to-body first, no aspect families beyond the core conjunction path until benchmarked
- status: research-only, not part of the main rectification posterior

This keeps the first build narrow enough to validate and prevents the implementation from silently drifting into a mixed-school primary-direction engine.

## Concrete Integration Plan

### Phase 1: Geometry Layer

Add a new isolated module family that computes:
- RAMC
- equatorial points for promissors and significators
- ascensional difference
- semi-arcs
- meridian distance
- oblique ascension

Do not mix this into the existing transit or progression modules.

### Phase 2: Zodiacal Direction Engine

Implement:
- `calculateZodiacalArc(promissor, significator, latitude, ramc)`
- `arcToAge(arc, key)`
- `direct(promissor, significator, { method, key, direction })`

Limit the scope to:
- static keys
- direct and converse
- ASC/MC/DSC/IC plus classical planets

### Phase 3: Research Benchmarking

Benchmark the output against:
- Stellium
- Astrolog
- any documented worked examples the team chooses to freeze

Only after that should the result be allowed into the main rectification posterior.

### Phase 4: Mundane And Topocentric Research

Treat mundane and Topocentric variants as separate feature tracks with separate validation gates.

## Risks

- False precision risk is extreme. A one-minute birth-time error can shift predictions by roughly a year under some primary-direction assumptions.
- Doctrine ambiguity is high. If the system hides its method choice, the output becomes unauditable.
- Circumpolar cases and high latitudes require careful handling.
- Open-source implementations disagree in places because of method choices, not because one is simply wrong.
- Full native implementation could absorb the team’s bandwidth and delay the more compatible rectification layers.

## Validation And Tests

Minimum validation requirements:
- compare direct zodiacal arcs against Stellium for a fixed benchmark set
- compare date conversion under both Ptolemy and Naibod keys
- test direct and converse directions separately
- test angle targets, especially ASC and MC
- test circumpolar and high-latitude behavior
- test that method labels remain explicit and stable in output

Rectification-specific validation:
- do not use primary directions as a minute solver before candidate pruning
- require held-out event evaluation
- compare against simpler methods to ensure primary directions are adding real signal instead of only complexity

## Sources With Links

- [Astrodienst Astrowiki: Primary Direction](https://www.astro.com/astrowiki/en/Primary_Direction)
- [Astrodienst Astrowiki: Directions](https://www.astro.com/astrowiki/en/Directions)
- [Stellium directions source](https://stellium.readthedocs.io/en/latest/_modules/stellium/engines/directions.html)
- [Stellium repository](https://github.com/katelouie/stellium)
- [Astrolog source repository](https://github.com/koson/astrolog-3)
- [OpenAstro2 repository](https://github.com/dimmastro/openastro2)
- [Current chart caster](/Users/eiko/astrocartography/chartCaster.js)
- [Current house solver](/Users/eiko/astrocartography/houses.js)
- [Current progressions module](/Users/eiko/astrocartography/progressions.js)
- [Current rectification plan](/Users/eiko/astrocartography/rectification/README.md)
