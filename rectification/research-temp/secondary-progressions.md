# Secondary Progressions

## Current-Engine Fit

- The current engine already has the right primitives for secondary progressions: deterministic chart casting in `chartCaster.js`, house/angle math in `houses.js`, and a progression timeline in `progressions.js`.
- `astro.mjs` already exposes a `progressions` command, but it only serializes progressed longitudes. Rectification needs angle-aware output, event comparison, and candidate scoring, so the rectification layer should live in a separate `rectification/` subtree instead of expanding the CLI into a monolith.
- The cleanest integration point is a new feature module that wraps the existing progression math and adds location-aware progressed charts, progressed angle extraction, and progressed-to-natal scoring.
- Birth-time rectification makes progressions sensitive enough to matter at minute resolution. A one-minute birth shift propagates into the progressed chart as a one-minute shift in the progressed datetime, which is large enough to move progressed angles and cusps by a noticeable fraction of a degree.

## Mathematical Model

- Core rule: one day after birth symbolizes one year of life.
- For a birth moment `B` and an age `a` in years, the progressed moment is:

```text
P = B + a days
```

- If the age comes from a real event timestamp `E`, use a frozen year-length convention and keep it explicit in config. A practical form is:

```text
elapsed_days = (E - B) / 1 day
a = elapsed_days / 365.2422
P = B + a days
```

- Planetary secondary progressions are then just the chart cast for `P`:

```text
lambda_prog(body, a) = lambda_body(P)
```

where `lambda_body(P)` is the geocentric ecliptic longitude of the body at the progressed datetime.

- The same idea applies to right ascension, declination, and any other ephemeris-derived coordinate you choose to compare against events.
- Progressed angles need an explicit method choice because software differs. There are two relevant conventions:
  - Cast the full progressed chart for `P` at the natal birthplace and derive `ASC/MC/IC/DSC` from the progressed sidereal time and location.
  - Advance natal angles by the Sun’s solar arc, then derive the progressed Ascendant from the progressed Midheaven.
- In solar-arc angle mode, the core longitude math is:

```text
arc = normalize(lambda_sun_prog - lambda_sun_nat)
lambda_mc_prog = normalize(lambda_mc_nat + arc)
lambda_asc_prog = derive_from_mc(lambda_mc_prog, latitude, obliquity)
```

- The second approach is the one TimePassages describes for its standard secondary-progression display, and it is also the source of vendor differences with astro.com. That means the implementation should expose the angle method as a strategy, not hard-code an assumption and call it universal.
- For rectification, the safest math layer is:
  - planets: standard day-for-year progressed chart
  - angles: selectable method with a documented default
  - comparisons: exact angular separations to event-trigger points with fixed orbs and fixed candidate windows

## Candidate-Grid Implications

- Secondary progressions are not a coarse yearly-only technique once angles are involved. Progressed Moon, progressed angles, and progressed planets all benefit from minute-level natal time precision.
- The rectification grid should therefore stay aligned with the existing fine-grain workflow:
  - 2-minute bins for the full day
  - 1-minute refinement around top candidates
  - 30-second refinement only when multiple events agree and the posterior is already narrow
- The grid should preserve the full birth timestamp, not only date-level age, because the progressed datetime is derived from the birth moment itself.
- Use the natal birthplace as the default location for progressed charts. Relocating the progressed chart to the current location should stay optional and outside the core rectification path.
- When secondary progressions are used as a scoring feature, they should be combined with other timing layers instead of treated as a standalone answer. This avoids overfitting to a single progressed contact.

## Open-Source Implementations

- [Astrolog](https://github.com/koson/astrolog-3) is a long-running freeware/source-available astrology engine with secondary progressions and solar-arc progressions in its feature set. It is a useful reference for CLI shape, chart-display conventions, and how older engines expose progressions alongside transits.
- [Stellium](https://github.com/katelouie/stellium) includes progression and solar-arc cookbook code. It is a useful modern reference for how a library packages the feature, even if the exact internals differ.
- [OpenAstro2](https://github.com/dimmastro/openastro2) exposes progression charts and directions on top of Swiss Ephemeris. It is a useful reference for architecture around chart generation and UI-level progression views.
- [Immanuel](https://github.com/theriftlab/immanuel-python) is a helpful reference because its docs describe the same basic secondary-progression structure and mention that its progressed MC/ASC method is intentionally different from astro.com’s.
- [TimePassages Manual](https://www.astrograph.com/doc/Manual6.pdf) is not open source, but it is a strong implementation reference for the exact day-for-year description and for the solar-arc-based angle handling used by one widely deployed product.

## Integration Plan

- Add a new rectification feature module, preferably under `rectification/features/secondaryProgressions.js`, instead of teaching `progressions.js` to do everything.
- Keep `progressions.js` as the low-level provider of progressed planetary longitudes, then wrap it with a rectification-specific helper that also computes progressed angles and houses.
- Add an explicit `progressedChartAtAge` or `progressedChartAtEvent` API that accepts birth datetime, natal location, target age or event datetime, and an angle-method option.
- Add a `progressionAngleMethod` config with at least two modes:
  - `dateCast` for a fully progressed chart cast at the progressed datetime
  - `solarArcMC` for the solar-arc-driven angle convention used by some software
- Add a scorer that compares progressed angles and progressed planets against dated events, with separate hooks for:
  - progressed Sun and Moon
  - progressed angles to natal planets
  - progressed planets to natal angles
  - sign changes and station-like slowdowns as supporting features
- Keep the CLI boundary thin. `astro.mjs` should continue to provide raw progression output, while rectification should get a dedicated command that returns ranked candidate birth times and an explanation payload.
- Reuse the existing house math for angle calculations whenever the chosen progression method calls for a fully cast progressed chart. If the selected angle method uses a solar-arc MC, make the inverse-mapping logic explicit and test it independently.

## Risks

- Progressed-angle conventions are not fully standardized across software. If the method is not explicit, cross-software validation will fail even when the math is internally consistent.
- Secondary progressions are easy to overfit when event dates are vague. Tight orbs and a fixed event window policy are necessary.
- If the implementation only supports progressed planets and ignores angles, it will miss most of the practical rectification value.
- If the implementation supports too many angle methods without a default and without test vectors, the system becomes impossible to validate.
- Minute-scale birth-time errors matter. That means the scoring layer must be calibrated to abstain when the evidence is too weak, rather than forcing a chart to fit.

## Validation / Tests

- Verify that age `0` returns the natal chart.
- Verify that `1` progressed year equals `1` symbolic day after birth, with fractional ages mapping to fractional days.
- Verify that progressed Sun motion is approximately `1 degree per year` across sample charts, allowing for orbital variation.
- Verify that progressed Moon movement is in the expected multi-degree-per-year range and crosses sign boundaries at plausible times.
- Verify that progressed angles match a chosen reference implementation for a small benchmark set of known-time charts.
- Verify that a one-minute birth-time shift changes progressed angles enough to matter, but not so much that the output becomes numerically unstable.
- Compare at least one set of outputs against a reference software baseline, ideally one of the OSS solutions above and one vendor reference such as TimePassages or astro.com.
- Add a regression test that locks the selected angle method so the engine does not silently drift between conventions.

## Sources With Links

- [TimePassages Manual 6 PDF](https://www.astrograph.com/doc/Manual6.pdf)
- [Astrograph support article on secondary-progression differences vs astro.com](https://support.astrograph.com/support/solutions/articles/66000519170-why-are-timepassage-s-secondary-progressions-different-than-astro-com-s-)
- [Astrolog repository](https://github.com/koson/astrolog-3)
- [Stellium repository](https://github.com/katelouie/stellium)
- [OpenAstro2 repository](https://github.com/dimmastro/openastro2)
- [Immanuel repository](https://github.com/theriftlab/immanuel-python)
- [Current engine progression module](../../progressions.js)
- [Current engine chart caster](../../chartCaster.js)
- [Current engine house calculator](../../houses.js)
