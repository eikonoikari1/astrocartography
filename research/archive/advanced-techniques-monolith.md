# Advanced Astrological Techniques: Research Report
*Generated: 2026-03-29 | Sources: 40+ | Confidence: High*

## Executive Summary

This report maps advanced astrological techniques — descriptive, predictive, and timing — against the capabilities of the astrocartography engine (`astro.mjs`). The engine already provides planetary positions, ecliptic longitudes, house cusps, essential dignity scoring, aspect analysis, astrocartography lines, transits, secondary progressions, solar returns, and zodiacal releasing. Many powerful techniques are either already supported or implementable with minimal additional computation on top of existing data.

Techniques are organized into three tiers:
- **Tier 1 — Already Available**: techniques the CLI can answer today
- **Tier 2 — Derivable**: techniques computable from existing CLI output with light math
- **Tier 3 — Needs New Code**: techniques requiring new module development

---

## Tier 1: Already Available via `astro.mjs`

### 1.1 Natal Planet Strength Scoring
**Command:** `natal-strength`
Already computes per-planet intensity/harmony/growth from essential dignity (domicile, exaltation, detriment, fall, triplicity, terms, face), sect, aspects, house angularity, retrograde status, and degree theory. The three-axis model is richer than Lilly's single-score system.

### 1.2 Astrocartography Lines (MC/IC/AS/DS)
**Command:** `lines`, `score`, `score-cities`
Full ACG computation for all 10 planets across 4 angles. Location scoring uses quadratic proximity falloff within 7° orb, weighted by natal planet strength and mapped to life categories (Love, Partnership, Career, Growth, etc.).

### 1.3 Transit Search
**Command:** `transits`
Finds exact dates when transit planets form major aspects (conjunction, opposition, trine, square, sextile) to natal ecliptic longitudes. Bisection algorithm for sub-minute accuracy. Handles retrograde multi-hit patterns (up to 3 passes). Supports filtering to outer-planet-only transits.

### 1.4 Secondary Progressions
**Command:** `progressions`
Day-for-a-year progression of all planetary positions. Returns ecliptic longitudes per year of age.

### 1.5 Solar Return Charts
**Command:** `solar-return`
Finds exact solar return moment via `Astronomy.SearchSunLongitude`, casts the chart, computes Placidus houses for any location. Returns full ecliptic longitudes and house cusps.

### 1.6 Zodiacal Releasing
**Command:** `zodiacal-releasing`
Computes L1-L2 periods from Lot of Fortune using traditional sign-based period years. Supports day/night chart distinction for lot calculation.

### 1.7 Horary Chart
**Command:** `horary`
Casts a chart for a question moment, identifies significators from house rulers, evaluates dignity, checks aspects between querent and quesited rulers plus Moon.

### 1.8 House Cusps
**Command:** `houses`
Placidus house system with equal-house fallback above 60° latitude.

---

## Tier 2: Derivable from Existing CLI Output

These techniques require no new modules — they can be computed by combining existing CLI outputs.

### 2.1 Annual Profections
**Calculation:** `(age % 12) + 1` = profected house number. The ruler of the whole-sign house at that position becomes Lord of the Year.
**What you need from CLI:** Age (from birth date), natal data (planets by sign/house).
**Formula:**
```
profectedHouse = (currentAge % 12) + 1
lordOfYear = ruler of the sign on that whole-sign house cusp
```
Activated planets = any natal planet in that house. The Lord of the Year's natal condition (from `natal-strength`) reveals the year's quality. Transits to/from the Lord carry outsized significance.

**Source:** [The Astrology Podcast](https://theastrologypodcast.com/transcripts/ep-153-annual-profections-an-ancient-time-lord-technique/), [Patrick Watson](https://patrickwatsonastrology.com/what-are-annual-profections/)

### 2.2 Relocated Charts
**Calculation:** Run `houses` for a new lat/lon with the natal datetime. The ecliptic longitudes stay the same — only angles and house cusps shift.
**What you need from CLI:** `chart` (positions stay fixed) + `houses` at new location = full relocated chart. Then use `getHouse()` to find which house each planet falls in at the new location.

**Source:** [My Astro Diaries](https://myastrodiary.com/diary/astrocartography-vs-relocation-chart), [Alice Bell](https://alicebell.substack.com/p/astrocartography-and-relocation-charts)

### 2.3 Cyclocartography (Transit Lines on Maps)
**Calculation:** Run `lines` for a transit date instead of the birth date. Overlay on natal lines. Where transit lines cross or coincide with natal lines = temporally activated locations.
**What you need from CLI:** `lines` at birth datetime + `lines` at transit datetime. Compare line longitudes to find convergences.
**Use case:** "When is Jupiter's MC line passing through my city?" → run `lines` for successive dates, check proximity.

**Source:** [Helena Woods](https://helenawoods.com/timing-your-move-travels-cyclocartography-101/), [Astrodienst](https://www.astro.com/astrowiki/en/Cyclo*Carto*Graphy)

### 2.4 Progressed Lunation Cycle
**Calculation:** From `progressions` output, take progressed Sun and Moon ecliptic longitudes. The angular separation (Moon - Sun, normalized 0-360) determines the phase:
```
0-45°     = New Moon (fresh start)
45-90°    = Crescent (building momentum)
90-135°   = First Quarter (commitment/obstacles)
135-180°  = Gibbous (refinement)
180-225°  = Full Moon (culmination)
225-270°  = Disseminating (sharing/teaching)
270-315°  = Last Quarter (reassessment)
315-360°  = Balsamic (closure/preparation)
```
Each phase lasts ~3.5 years. The Progressed New Moon (~every 29 years) marks a major new life chapter.

**Source:** [Cafe Astrology](https://cafeastrology.com/progressedlunarphases.html), [Astro.com](https://www.astro.com/astrology/in_progmoon_e.htm)

### 2.5 Solar Arc Directions
**Calculation:** From `progressions` output at a target age, compute `solar_arc = progressed_Sun_lon - natal_Sun_lon`. Add this arc to every natal planet and angle longitude. Check which solar-arc-directed planets form aspects (conjunction, square, opposition, trine, sextile) to natal positions within 1° orb.
**What you need from CLI:** `progressions` (for progressed Sun longitude) + `chart` (for natal longitudes).

**Source:** [Alabe](https://www.alabe.com/solararc.html), [Two Wander](https://www.twowander.com/blog/how-to-use-solar-arcs-in-astrology)

### 2.6 Lots / Arabic Parts
**Formulas** (all modulo 360°):
| Lot | Day Chart | Night Chart |
|-----|-----------|-------------|
| **Fortune** | Asc + Moon - Sun | Asc + Sun - Moon |
| **Spirit** | Asc + Sun - Moon | Asc + Moon - Sun |
| **Eros** | Asc + Venus - Spirit | reversed |
| **Necessity** | Asc + Mercury - Fortune | reversed |
| **Courage** | Asc + Mars - Fortune | reversed |
| **Victory** | Asc + Jupiter - Spirit | reversed |
| **Nemesis** | Asc + Saturn - Fortune | reversed |
| **Marriage (M)** | Asc + Venus - Saturn | — |
| **Marriage (F)** | Asc + Saturn - Venus | — |

**What you need from CLI:** `houses` (for Ascendant longitude) + `chart` (for ecliptic longitudes of all planets). Plug into formulas.

**Source:** [Seven Stars Astrology](https://sevenstarsastrology.com/twelve-easy-lessons-for-beginners-7-the-lots/), [Astrology X-Files](https://www.astrology-x-files.com/x-files/arabic-parts.html)

### 2.7 Planetary Return Charts
**Calculation:** Use the transit search engine to find the exact moment a transiting planet returns to its natal ecliptic longitude, then cast a chart + houses for that moment.
**What you need from CLI:** `transits` (search for conjunction of planet to its own natal longitude) → get exact date → `chart` + `houses` at that date and location.
**Key returns:**
- Lunar return: ~monthly (Moon returns to natal Moon longitude)
- Mars return: ~22 months
- Jupiter return: ~12 years (ages ~12, 24, 36, 48, 60)
- Saturn return: ~29.5 years (ages ~29, 58, 87)

**Source:** [Thalira](https://thalira.com/blogs/quantum-codex/planetary-returns-astrology-guide), [Mastering the Zodiac](https://masteringthezodiac.com/planetary-returns)

### 2.8 Timing Funnel (Stacking Techniques)
The most powerful predictive approach layers techniques from broadest to narrowest:
1. **Zodiacal Releasing** → decades-long life chapters, peak periods
2. **Firdaria** → multi-year planetary ruler (see Tier 3)
3. **Annual Profections** → Lord of the Year
4. **Solar Return** → yearly chart overlay
5. **Transits** → final event triggers

**Key insight:** Transits are triggers, not causes. A transit only produces major events when the transited planet is already activated by profections, ZR, or firdaria. When 3+ techniques converge on the same planet/theme, prediction confidence is high.

**Source:** [HeloAstro](https://www.heloastro.com/blog/timing-in-astrology), [NightFall Astrology](https://nightfallastrology.com/annual-profections-one-of-the-most-efficient-forecasting-techniques-in-traditional-astrology/)

---

## Tier 3: Needs New Code

### 3.1 Firdaria (Planetary Periods)
Divides life into 75-year planetary periods. No astronomical calculation needed — pure table lookup based on birth date and sect.

**Day chart sequence:** Sun(10y) → Venus(8) → Mercury(13) → Moon(9) → Saturn(11) → Jupiter(12) → Mars(7) → NNode(3) → SNode(2)
**Night chart sequence:** Moon(9) → Saturn(11) → Jupiter(12) → Mars(7) → Sun(10) → Venus(8) → Mercury(13) → NNode(3) → SNode(2)

Each major period has 7 equal sub-periods (one per traditional planet, starting from the major ruler in Chaldean order).

**Implementation effort:** Low. Pure date arithmetic.

**Source:** [Two Wander](https://www.twowander.com/blog/how-to-use-firdaria-timing-technique), [Ada Pembroke](https://www.adapembroke.com/blog/firdaria-outline-the-chapters-of-your-life)

### 3.2 Paran Lines
Horizontal latitude bands where two planets are simultaneously angular. Unlike standard ACG lines (one planet, one angle), parans combine two planetary energies.

**Calculation:** For each planet pair, sweep latitudes -89° to +89° and check if both planets are on any angle (AS/DS/MC/IC) simultaneously at that latitude at the birth moment. This requires solving the hour angle equation for each planet at each latitude.

**Implementation effort:** Medium. Similar math to existing line computation but checking pairs.

**Source:** [My Astro Diaries](https://myastrodiary.com/diary/paran-latitude-lines), [Sensitive Nomad](https://www.sensitivenomad.com/posts/parans-astrocartography)

### 3.3 Almuten Figuris
Identifies the single most powerful planet in the chart using Ibn Ezra's point-scoring system across 5 key chart points (Sun, Moon, Ascendant, Part of Fortune, Prenatal Lunation) plus temporal rulerships (day ruler, hour ruler) and house position.

**Implementation effort:** Low-medium. Scoring tables + existing dignity data.

**Source:** [Stars in Their Courses](https://starsintheircourses.com/calculation-of-the-almuten-figuris/), [Medieval Astrology Guide](https://www.medievalastrologyguide.com/ruler-of-the-chart)

### 3.4 Temperament Calculation
Derives sanguine/choleric/melancholic/phlegmatic from 5 factors: Ascendant sign, 1st house planets, Moon sign+phase, season, almuten. Tallies Hot/Cold/Moist/Dry qualities.

**Implementation effort:** Low. Pure lookup tables.

**Source:** [Medieval Astrology Guide](https://www.medievalastrologyguide.com/medieval-temperaments)

### 3.5 Fixed Stars
Conjunction of natal planets/angles to major fixed stars (Regulus, Spica, Algol, Sirius, etc.). Stars only operate by conjunction with 1° orb.

**Implementation effort:** Low. Static table of ~30 star positions (precession-corrected epoch) + conjunction check against natal longitudes.

**Key stars and positions (~2025 epoch):**
| Star | Longitude | Nature |
|------|-----------|--------|
| Algol | 26° Taurus | Saturn/Mars — violence, misfortune |
| Aldebaran | 10° Gemini | Mars — courage, integrity |
| Rigel | 17° Gemini | Jupiter/Saturn — inventiveness |
| Sirius | 14° Cancer | Jupiter/Mars — honors, fame |
| Regulus | 0° Virgo | Mars/Jupiter — leadership, authority |
| Spica | 24° Libra | Venus/Mercury — brilliance, wealth |
| Antares | 10° Sagittarius | Mars/Jupiter — boldness, warrior |
| Vega | 15° Capricorn | Venus/Mercury — idealism, refinement |
| Fomalhaut | 4° Pisces | Venus/Mercury — mystical fame |

**Source:** [Medieval Astrology Guide](https://www.medievalastrologyguide.com/fixed-stars), [Astrology King](https://astrologyking.com/fixed-stars/)

### 3.6 Eclipse Cycle Analysis
Track eclipses hitting natal chart points. The prenatal solar/lunar eclipse degrees remain sensitive throughout life.

**Implementation effort:** Medium. Requires eclipse search via astronomy-engine (`Astronomy.SearchLunarEclipse`, `Astronomy.SearchSolarEclipse`) plus natal point comparison.

**Source:** [Cafe Astrology](https://cafeastrology.com/transits-eclipses.html), [Mel Priestley](https://melpriestley.substack.com/p/eclipses-and-saros-cycles-in-astronomy)

### 3.7 ZR Advanced: Lot of Spirit + Loosing of the Bond + Peak Periods
The existing ZR implementation uses Lot of Fortune. Adding:
- **Lot of Spirit** releasing (career/agency timing)
- **Peak period detection**: L1 signs angular to Fortune = career peak
- **Loosing of the Bond**: when L2 sub-periods exhaust within an L1 period and jump to the opposite sign = major life transition

**Implementation effort:** Low-medium. Lot of Spirit is `Asc + Sun - Moon` (day) / reversed (night). Peak detection is comparing activated signs to Fortune's angular signs. Loosing of the bond is detecting the L2 rollover point.

**Source:** [The Astrology Podcast](https://theastrologypodcast.com/2019/02/11/zodiacal-releasing-an-ancient-timing-technique/), [Helena Woods](https://helenawoods.com/zodiacal-releasing-how-to-time-your-lifes-chapters-and-peak-periods/)

### 3.8 Ingress Charts (Mundane)
Chart cast for the exact moment the Sun enters 0° Aries (or other cardinal signs). Used for mundane/world-event prediction.

**Implementation effort:** Low. Use `Astronomy.SearchSunLongitude(0, startTime, 30)` to find the Aries ingress moment, then cast chart + houses for a capital city.

**Source:** [Skyscript](https://www.skyscript.co.uk/ingresses.html), [Edmonton Astrological Society](https://astrologyedmonton.com/ingress-charts-in-mundane-astrology/)

### 3.9 Local Space Astrology
Projects planetary positions to horizon coordinates (azimuth/altitude) from a specific location. Produces compass bearings of planetary energy radiating outward.

**Implementation effort:** Medium. Requires converting RA/Dec to Alt/Az using observer latitude, longitude, and local sidereal time. The math is standard spherical astronomy.

**Source:** [Astro.com](https://www.astro.com/astrology/in_localspace_e.htm), [Astrolocality](https://astrolocality.wordpress.com/2018/01/24/astrology-of-local-space/)

---

## Priority Implementation Roadmap

Based on interpretive power vs. implementation effort:

| Priority | Technique | Effort | Value |
|----------|-----------|--------|-------|
| 1 | Annual Profections | Derivable | Very High — foundational timing |
| 2 | Lots (Fortune, Spirit, Eros) | Derivable | High — unlocks ZR from Spirit |
| 3 | Firdaria | Low code | High — life chapter mapping |
| 4 | Progressed Lunation Cycle | Derivable | High — 30-year phase ID |
| 5 | Solar Arc Directions | Derivable | High — event-level prediction |
| 6 | Fixed Stars | Low code | Medium — natal delineation depth |
| 7 | ZR from Spirit + Peak Periods | Low-med code | Very High — career timing |
| 8 | Relocated Charts | Derivable | High — complements ACG |
| 9 | Paran Lines | Medium code | Medium — ACG depth |
| 10 | Eclipse Cycles | Medium code | Medium — event triggers |

---

## Sources

### Astrocartography & Location
- [My Astro Diaries: Paran Lines Explained](https://myastrodiary.com/diary/paran-latitude-lines)
- [Sensitive Nomad: Parans in Astrocartography](https://www.sensitivenomad.com/posts/parans-astrocartography)
- [Helena Woods: Cyclocartography 101](https://helenawoods.com/timing-your-move-travels-cyclocartography-101/)
- [Astro.com: Local Space Techniques](https://www.astro.com/astrology/in_localspace_e.htm)
- [Alice Bell: Relocation Charts](https://alicebell.substack.com/p/astrocartography-and-relocation-charts)

### Hellenistic Timing
- [The Astrology Podcast: Annual Profections](https://theastrologypodcast.com/transcripts/ep-153-annual-profections-an-ancient-time-lord-technique/)
- [Patrick Watson: What Are Annual Profections?](https://patrickwatsonastrology.com/what-are-annual-profections/)
- [Two Wander: How to Use Firdaria](https://www.twowander.com/blog/how-to-use-firdaria-timing-technique)
- [The Astrology Podcast: Zodiacal Releasing](https://theastrologypodcast.com/2019/02/11/zodiacal-releasing-an-ancient-timing-technique/)
- [Helena Woods: ZR Peak Periods](https://helenawoods.com/zodiacal-releasing-how-to-time-your-lifes-chapters-and-peak-periods/)
- [HeloAstro: Timing in Astrology](https://www.heloastro.com/blog/timing-in-astrology)

### Predictive Methods
- [Alabe: Solar Arc Directions](https://www.alabe.com/solararc.html)
- [Astro.com: Tectonic Triggers — Station Points](https://www.astro.com/astrology/in_stations_e.htm)
- [Cafe Astrology: Progressed Lunar Phases](https://cafeastrology.com/progressedlunarphases.html)
- [Cafe Astrology: Eclipse Transits](https://cafeastrology.com/transits-eclipses.html)
- [Skyscript: Ingress Charts](https://www.skyscript.co.uk/ingresses.html)
- [Thalira: Planetary Returns Guide](https://thalira.com/blogs/quantum-codex/planetary-returns-astrology-guide)

### Natal Scoring & Tradition
- [Skyscript: Dignity Point-Scoring](https://www.skyscript.co.uk/dig5.html)
- [Stars in Their Courses: Almuten Figuris](https://starsintheircourses.com/calculation-of-the-almuten-figuris/)
- [Medieval Astrology Guide: Temperaments](https://www.medievalastrologyguide.com/medieval-temperaments)
- [Seven Stars Astrology: The Lots](https://sevenstarsastrology.com/twelve-easy-lessons-for-beginners-7-the-lots/)
- [Medieval Astrology Guide: Fixed Stars](https://www.medievalastrologyguide.com/fixed-stars)
- [Astrology King: Fixed Stars](https://astrologyking.com/fixed-stars/)
- [Astrology X-Files: Advanced Eminence](https://astrology-x-files.com/x-files/advancedeminence.html)

## Methodology
Searched 20+ queries across web sources. Analyzed 40+ articles and reference pages. Sub-questions investigated: paran lines, local space, geodetic charts, relocated charts, cyclocartography, eclipse mapping, annual profections, firdaria, ZR advanced, timing funnel, solar return interpretation, solar arc directions, planetary stations, eclipse cycles, ingress charts, progressed lunation, planetary returns, Lilly/Bonatti scoring, almuten figuris, temperament, eminence/doryphory, lots/Arabic parts, fixed stars.
