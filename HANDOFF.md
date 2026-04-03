# Astrocartography Engine — Handoff Note

## What This Is

A natal-aware astrocartography scoring engine built on `astronomy-engine`. It computes planetary lines and scores locations with one canonical three-axis natal model.

## How to Run

```bash
cd ~/astrocartography

# Compute lines + natal-aware 3-axis scoring (intensity/harmony/growth)
node run_natal.mjs

# Use the JSON CLI
node astro.mjs <command> '<options-json>'
```

## Files

| File | Purpose |
|------|---------|
| `astro.mjs` | JSON CLI entrypoint for charts, lines, scoring, transits, horary, progressions, solar returns, zodiacal releasing, and houses. |
| `run_natal.mjs` | Main runner. Contains birth data, natal data (signs, houses, aspects, sect), computes lines + planet strengths + city scores. **Edit this to change the native.** |
| `natalScoring.js` | The scoring engine. Essential dignity tables (domicile, exaltation, detriment, fall, triplicity, Egyptian terms, Chaldean faces), aspect scoring, sect, house, retrograde, degree theory. Exports `computePlanetStrength()` and `scoreWithNatalContext()`. |

## Architecture

### Line Computation

Planetary positions are computed via `astronomy-engine`. For each planet:
- **MC/IC lines**: vertical lines at `longitude = RA - GMST` (converted to geographic coordinates)
- **AS/DS lines**: curved lines computed by solving the hour angle equation at 0.5° latitude steps

### Birth Data

Current native: **Sep 28, 2002, 20:45 Krasnoyarsk Summer Time (UTC+8)**

Krasnoyarsk was on DST in September 2002 (clocks changed Oct 27, 2002). UTC offset = +8, so UTC time = 12:45.

The UTC time is hardcoded in `run_natal.mjs` line: `new Date("2002-09-28T12:45:00Z")`. To change the native, update both the UTC datetime AND the `natalData` object (planets, aspects, dayChart).

### Three-Axis Scoring Model

Each planet gets three modifiers derived from natal condition:

- **Intensity** [0.3–1.7]: How strongly the energy manifests. Driven by aspects (40%), sect (20%), dignity (15%).
- **Harmony** [0.3–1.7]: How pleasant/smooth. Driven by aspects (35%), dignity (30%), sect (20%).
- **Growth** [0.3–1.7]: Transformative potential. Driven by aspects (35%), house (20%), dignity (20%).

Key design principle: **hard aspects (squares, oppositions) score HIGH on intensity and growth, LOW on harmony.** A difficult natal condition doesn't mute the line — it amplifies it in uncomfortable but transformative ways. Detriment scores +1.0 intensity and +1.5 growth because a planet in detriment doesn't go quiet, it goes weird.

### Scoring Factors

| Factor | What it does | Weight |
|--------|-------------|--------|
| **Aspects** | Trine = +harmony, Square = +intensity +growth -harmony. Orb-weighted. Benefic/malefic conjunction distinction. Combust penalty. | 35-40% |
| **Essential dignity** | Domicile = +harmony. Detriment = +intensity +growth -harmony. Full Egyptian terms + Chaldean faces. | 15-30% |
| **Sect** | Night chart: Venus = benefic of sect (+harmony), Mars = contrary malefic (+intensity +growth -harmony). | 15-20% |
| **House** | Angular = +harmony. Cadent = +growth (dormant energy being activated). | 5-20% |
| **Retrograde** | -intensity, -harmony, +growth (internalized expression). | 5-10% |
| **Degree** | 29° anaretic, 0° fresh, 15° peak, critical degrees. Minimal weight — low empirical backing. | 5% |

### Categories

Each category blends the three axes with custom weights:

| Category | Intensity | Harmony | Growth |
|----------|-----------|---------|--------|
| Love & Romance | 0.35 | 0.40 | 0.25 |
| Partnership & Deep Connection | 0.30 | 0.30 | 0.40 |
| Vocation & Career | 0.30 | 0.45 | 0.25 |
| Friendship & Family | 0.20 | 0.55 | 0.25 |
| Excitement & Instability | 0.60 | 0.10 | 0.30 |
| Growth & Transformation | 0.20 | 0.10 | 0.70 |

## Known Limitations

- **No parans (latitude crossings)** — only angular lines (MC/IC/AS/DS)
- **No local space astrology** — only astrocartography (relocated angles)
- **Placidus falls back to equal houses above 60° latitude** — high-latitude callers still get house cusps, but under a different system
- **Outer planet dignity is modern** (Uranus = Aquarius domicile, etc.) — chosen by the user
- **Degree theory weighted at 5%** — honest about low empirical support
- **City list is hardcoded** — add cities by appending to the `cities` array in `run_natal.mjs`
- **Orb for line influence is 7°** (~770km at equator) — standard astrocartography practice

## Provenance

- Planetary computation: [astronomy-engine](https://www.npmjs.com/package/astronomy-engine)
- Natal scoring model: custom, built from Hellenistic/traditional astrology principles (essential dignity, sect, Dorothean triplicity, Egyptian terms, Chaldean faces) with modern three-axis framework
