// ─── NATAL-AWARE ASTROCARTOGRAPHY SCORING ENGINE ────────────────────────────
// Three-axis scoring: Intensity, Harmony, Growth
// Each planet's line influence is modulated by its natal condition.

// ─── SIGN UTILITIES ─────────────────────────────────────────────────────────

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const SIGN_INDEX = Object.fromEntries(SIGNS.map((s, i) => [s, i]));

const ELEMENTS = {
  Fire:  ["Aries","Leo","Sagittarius"],
  Earth: ["Taurus","Virgo","Capricorn"],
  Air:   ["Gemini","Libra","Aquarius"],
  Water: ["Cancer","Scorpio","Pisces"],
};

function signElement(sign) {
  for (const [el, signs] of Object.entries(ELEMENTS)) {
    if (signs.includes(sign)) return el;
  }
  return null;
}

function oppositeSign(sign) {
  const i = SIGN_INDEX[sign];
  return SIGNS[(i + 6) % 12];
}

// ─── ESSENTIAL DIGNITY TABLES ───────────────────────────────────────────────

const DOMICILE = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mercury: ["Gemini", "Virgo"],
  Venus: ["Taurus", "Libra"],
  Mars: ["Aries", "Scorpio"],
  Jupiter: ["Sagittarius", "Pisces"],
  Saturn: ["Capricorn", "Aquarius"],
  Uranus: ["Aquarius"],   // modern
  Neptune: ["Pisces"],     // modern
  Pluto: ["Scorpio"],      // modern
};

const EXALTATION = {
  Sun: "Aries",
  Moon: "Taurus",
  Mercury: "Virgo",
  Venus: "Pisces",
  Mars: "Capricorn",
  Jupiter: "Cancer",
  Saturn: "Libra",
  // No traditional exaltations for outers
};

const FALL = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mercury: "Pisces",
  Venus: "Virgo",
  Mars: "Cancer",
  Jupiter: "Capricorn",
  Saturn: "Aries",
};

// Detriment = opposite of domicile signs
function isDetriment(planet, sign) {
  const dom = DOMICILE[planet];
  if (!dom) return false;
  return dom.some(d => oppositeSign(d) === sign);
}

function isFall(planet, sign) {
  return FALL[planet] === sign;
}

function isDomicile(planet, sign) {
  return (DOMICILE[planet] || []).includes(sign);
}

function isExaltation(planet, sign) {
  return EXALTATION[planet] === sign;
}

// ─── TRIPLICITY RULERS (Dorothean) ──────────────────────────────────────────
// [day ruler, night ruler, participating ruler]
const TRIPLICITY_RULERS = {
  Fire:  ["Sun", "Jupiter", "Saturn"],
  Earth: ["Venus", "Moon", "Mars"],
  Air:   ["Saturn", "Mercury", "Jupiter"],
  Water: ["Venus", "Mars", "Moon"],
};

function getTriplicityDignity(planet, sign, isDayChart) {
  const el = signElement(sign);
  if (!el) return null;
  const rulers = TRIPLICITY_RULERS[el];
  if (rulers[0] === planet) return isDayChart ? "triplicity_sect" : "triplicity_non_sect";
  if (rulers[1] === planet) return isDayChart ? "triplicity_non_sect" : "triplicity_sect";
  if (rulers[2] === planet) return "triplicity_participating";
  return null;
}

// ─── EGYPTIAN TERMS (BOUNDS) ────────────────────────────────────────────────
// Format: [end_degree, planet] — ranges from previous end (or 0) to end_degree
const EGYPTIAN_TERMS = {
  Aries:       [[6,"Jupiter"],[12,"Venus"],[20,"Mercury"],[25,"Mars"],[30,"Saturn"]],
  Taurus:      [[8,"Venus"],[14,"Mercury"],[22,"Jupiter"],[27,"Saturn"],[30,"Mars"]],
  Gemini:      [[6,"Mercury"],[12,"Jupiter"],[17,"Venus"],[24,"Mars"],[30,"Saturn"]],
  Cancer:      [[7,"Mars"],[13,"Venus"],[19,"Mercury"],[26,"Jupiter"],[30,"Saturn"]],
  Leo:         [[6,"Jupiter"],[11,"Venus"],[18,"Saturn"],[24,"Mercury"],[30,"Mars"]],
  Virgo:       [[7,"Mercury"],[17,"Venus"],[21,"Jupiter"],[28,"Mars"],[30,"Saturn"]],
  Libra:       [[6,"Saturn"],[14,"Mercury"],[21,"Jupiter"],[28,"Venus"],[30,"Mars"]],
  Scorpio:     [[7,"Mars"],[11,"Venus"],[19,"Mercury"],[24,"Jupiter"],[30,"Saturn"]],
  Sagittarius: [[12,"Jupiter"],[17,"Venus"],[21,"Mercury"],[26,"Saturn"],[30,"Mars"]],
  Capricorn:   [[7,"Mercury"],[14,"Jupiter"],[22,"Venus"],[26,"Saturn"],[30,"Mars"]],
  Aquarius:    [[7,"Mercury"],[13,"Venus"],[20,"Jupiter"],[25,"Mars"],[30,"Saturn"]],
  Pisces:      [[12,"Venus"],[16,"Jupiter"],[19,"Mercury"],[28,"Mars"],[30,"Saturn"]],
};

function isInOwnTerms(planet, sign, degree) {
  const terms = EGYPTIAN_TERMS[sign];
  if (!terms) return false;
  let prev = 0;
  for (const [end, ruler] of terms) {
    if (degree >= prev && degree < end) {
      return ruler === planet;
    }
    prev = end;
  }
  return false;
}

// ─── CHALDEAN FACES (DECANS) ────────────────────────────────────────────────
// Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon (repeating)
const CHALDEAN_ORDER = ["Mars","Sun","Venus","Mercury","Moon","Saturn","Jupiter"];
// Starting from Aries decan 1 = Mars
const FACE_TABLE = {};
{
  let idx = 0;
  for (const sign of SIGNS) {
    FACE_TABLE[sign] = [
      CHALDEAN_ORDER[idx % 7],
      CHALDEAN_ORDER[(idx + 1) % 7],
      CHALDEAN_ORDER[(idx + 2) % 7],
    ];
    idx += 3;
  }
}

function isInOwnFace(planet, sign, degree) {
  const faces = FACE_TABLE[sign];
  if (!faces) return false;
  const decan = Math.min(2, Math.floor(degree / 10));
  return faces[decan] === planet;
}

// ─── GET ESSENTIAL DIGNITY ──────────────────────────────────────────────────

function getEssentialDignity(planet, sign, degree, isDayChart) {
  // Check major dignities (only highest applies)
  let major = null;
  if (isDomicile(planet, sign)) major = "domicile";
  else if (isExaltation(planet, sign)) major = "exaltation";
  else if (isDetriment(planet, sign)) major = "detriment";
  else if (isFall(planet, sign)) major = "fall";

  // Check minor dignities (stack if peregrine)
  const minor = [];
  const tripl = getTriplicityDignity(planet, sign, isDayChart);
  if (tripl) minor.push(tripl);
  if (isInOwnTerms(planet, sign, degree)) minor.push("terms");
  if (isInOwnFace(planet, sign, degree)) minor.push("face");

  return { major, minor };
}

// ─── DIGNITY → 3-AXIS SCORES ───────────────────────────────────────────────

const DIGNITY_AXIS_SCORES = {
  //                        intensity, harmony, growth
  domicile:                [  0.5,      3.0,    -0.5  ],
  exaltation:              [  0.5,      2.5,     0.0  ],
  detriment:               [  1.0,     -3.0,     1.5  ],
  fall:                    [ -0.5,     -2.5,     1.0  ],
  triplicity_sect:         [  0.5,      1.5,     0.0  ],
  triplicity_non_sect:     [  0.3,      0.5,     0.0  ],
  triplicity_participating:[  0.2,      0.3,     0.0  ],
  terms:                   [  0.3,      1.0,     0.0  ],
  face:                    [  0.2,      0.5,     0.0  ],
};

function computeDignityScores(dignity) {
  let intensity = 0, harmony = 0, growth = 0;

  if (dignity.major) {
    const s = DIGNITY_AXIS_SCORES[dignity.major];
    if (s) { intensity += s[0]; harmony += s[1]; growth += s[2]; }
  }

  // Minor dignities only add if no major dignity (peregrine case) OR add on top
  // Traditional: minor dignities always count
  for (const m of dignity.minor) {
    const s = DIGNITY_AXIS_SCORES[m];
    if (s) { intensity += s[0]; harmony += s[1]; growth += s[2]; }
  }

  return { intensity, harmony, growth };
}

// ─── ASPECT SCORING ─────────────────────────────────────────────────────────

const BENEFICS = new Set(["Jupiter", "Venus"]);
const MALEFICS = new Set(["Saturn", "Mars"]);

const ASPECT_AXIS = {
  //                          intensity, harmony, growth, maxOrb
  conjunction_benefic:       [  2.5,      3.0,     1.0,   8 ],
  conjunction_malefic:       [  2.5,     -2.5,     2.0,   8 ],
  conjunction_neutral:       [  1.5,      1.0,     1.0,   8 ],
  trine:                     [  1.5,      2.0,     0.5,   8 ],
  sextile:                   [  0.5,      1.0,     0.5,   6 ],
  square:                    [  2.5,     -2.5,     3.0,   7 ],
  opposition:                [  2.0,     -1.5,     2.5,   8 ],
};

function classifyConjunction(otherPlanet) {
  if (BENEFICS.has(otherPlanet)) return "conjunction_benefic";
  if (MALEFICS.has(otherPlanet)) return "conjunction_malefic";
  return "conjunction_neutral";
}

function computeAspectScores(planet, aspects) {
  let intensity = 0, harmony = 0, growth = 0;

  for (const asp of aspects) {
    // Find the other planet in this aspect
    let other = null;
    if (asp.p1 === planet) other = asp.p2;
    else if (asp.p2 === planet) other = asp.p1;
    else continue;

    let key = asp.type;
    if (key === "conjunction") key = classifyConjunction(other);

    const scores = ASPECT_AXIS[key];
    if (!scores) continue;

    const [baseI, baseH, baseG, maxOrb] = scores;
    const tightness = Math.max(0, 1 - asp.orb / maxOrb);

    intensity += baseI * tightness;
    harmony += baseH * tightness;
    growth += baseG * tightness;
  }

  // Combust check: planet conjunct Sun within 8° (except Mercury within 5°)
  if (planet !== "Sun" && planet !== "Moon") {
    for (const asp of aspects) {
      let other = null;
      if (asp.p1 === planet && asp.p2 === "Sun") other = "Sun";
      if (asp.p2 === planet && asp.p1 === "Sun") other = "Sun";
      if (other && asp.type === "conjunction" && asp.orb < 8) {
        const combustOrb = planet === "Mercury" ? 5 : 8;
        if (asp.orb < combustOrb) {
          const combustFactor = 1 - asp.orb / combustOrb;
          harmony -= 1.5 * combustFactor;
          intensity += 0.5 * combustFactor;
        }
      }
    }
  }

  // Clamp to [-4, +4]
  return {
    intensity: Math.max(-4, Math.min(4, intensity)),
    harmony: Math.max(-4, Math.min(4, harmony)),
    growth: Math.max(-4, Math.min(4, growth)),
  };
}

// ─── SECT SCORING ───────────────────────────────────────────────────────────

function computeSectScores(planet, isDayChart) {
  //                 intensity, harmony, growth
  const SECT_TABLE = {
    benefic_of_sect:        [0.5,  1.5,  0.0],
    benefic_contrary:       [0.5,  0.5,  0.5],
    malefic_of_sect:        [0.5, -0.5,  0.5],
    malefic_contrary:       [1.0, -1.5,  1.0],
    sect_light:             [0.5,  1.0,  0.0],
    contrary_light:         [0.5, -0.5,  0.5],
    neutral:                [0.0,  0.0,  0.0],
  };

  let key = "neutral";

  if (planet === "Sun") {
    key = isDayChart ? "sect_light" : "contrary_light";
  } else if (planet === "Moon") {
    key = isDayChart ? "contrary_light" : "sect_light";
  } else if (planet === "Jupiter") {
    key = isDayChart ? "benefic_of_sect" : "benefic_contrary";
  } else if (planet === "Venus") {
    key = isDayChart ? "benefic_contrary" : "benefic_of_sect";
  } else if (planet === "Saturn") {
    key = isDayChart ? "malefic_of_sect" : "malefic_contrary";
  } else if (planet === "Mars") {
    key = isDayChart ? "malefic_contrary" : "malefic_of_sect";
  }
  // Mercury, Uranus, Neptune, Pluto → neutral

  const [i, h, g] = SECT_TABLE[key];
  return { intensity: i, harmony: h, growth: g };
}

// ─── HOUSE SCORING ──────────────────────────────────────────────────────────

function computeHouseScores(house) {
  const ANGULAR = new Set([1, 4, 7, 10]);
  const CADENT = new Set([3, 6, 9, 12]);

  if (ANGULAR.has(house)) return { intensity: 0.5, harmony: 0.5, growth: -0.5 };
  if (CADENT.has(house))  return { intensity: 0.5, harmony: -0.5, growth: 1.0 };
  return { intensity: 0, harmony: 0, growth: 0 }; // succedent
}

// ─── RETROGRADE SCORING ─────────────────────────────────────────────────────

function computeRxScores(isRetrograde) {
  if (isRetrograde) return { intensity: -0.5, harmony: -0.3, growth: 0.5 };
  return { intensity: 0, harmony: 0, growth: 0 };
}

// ─── DEGREE SCORING ─────────────────────────────────────────────────────────

const CRITICAL_CARDINAL = new Set([0, 13, 26]);
const CRITICAL_FIXED = new Set([8, 9, 21, 22]);
const CRITICAL_MUTABLE = new Set([4, 17]);

function computeDegreeScores(degree, sign) {
  const d = Math.floor(degree);
  let intensity = 0, harmony = 0, growth = 0;

  // Anaretic degree (29°)
  if (d === 29) { intensity += 1.0; harmony -= 1.0; growth += 1.0; }
  // Fresh degree (0°)
  else if (d === 0) { intensity += 0.5; harmony += 0.5; growth += 0.5; }
  // Mid-sign (15°)
  else if (d === 15) { intensity += 0.5; harmony += 0.5; }

  // Critical degrees
  const el = signElement(sign);
  const isCritical = (
    (["Aries","Cancer","Libra","Capricorn"].includes(sign) && CRITICAL_CARDINAL.has(d)) ||
    (["Taurus","Leo","Scorpio","Aquarius"].includes(sign) && CRITICAL_FIXED.has(d)) ||
    (["Gemini","Virgo","Sagittarius","Pisces"].includes(sign) && CRITICAL_MUTABLE.has(d))
  );
  if (isCritical) { intensity += 0.5; harmony -= 0.5; growth += 0.5; }

  return { intensity, harmony, growth };
}

// ─── COMPOSITE PLANET STRENGTH ──────────────────────────────────────────────

const AXIS_WEIGHTS = {
  intensity: { aspects: 0.40, dignity: 0.15, sect: 0.20, house: 0.10, rx: 0.10, degree: 0.05 },
  harmony:   { aspects: 0.35, dignity: 0.30, sect: 0.20, house: 0.05, rx: 0.05, degree: 0.05 },
  growth:    { aspects: 0.35, dignity: 0.20, sect: 0.15, house: 0.20, rx: 0.05, degree: 0.05 },
};

function normalize(value, min, max) {
  return Math.max(-1, Math.min(1, (value - (min + max) / 2) / ((max - min) / 2)));
}

export function computePlanetStrength(planet, natalData) {
  const pd = natalData.planets[planet];
  if (!pd) return { intensity: 1.0, harmony: 1.0, growth: 1.0 };

  const dignity = getEssentialDignity(planet, pd.sign, pd.degree, natalData.dayChart);
  const dignityScores = computeDignityScores(dignity);
  const aspectScores = computeAspectScores(planet, natalData.aspects);
  const sectScores = computeSectScores(planet, natalData.dayChart);
  const houseScores = computeHouseScores(pd.house);
  const rxScores = computeRxScores(pd.retrograde);
  const degreeScores = computeDegreeScores(pd.degree, pd.sign);

  const result = {};
  for (const axis of ["intensity", "harmony", "growth"]) {
    const w = AXIS_WEIGHTS[axis];
    const raw = (
      w.aspects * normalize(aspectScores[axis], -4, 4)
      + w.dignity * normalize(dignityScores[axis], -3, 3)
      + w.sect * normalize(sectScores[axis], -1.5, 1.5)
      + w.house * normalize(houseScores[axis], -0.5, 1.0)
      + w.rx * normalize(rxScores[axis], -0.5, 0.5)
      + w.degree * normalize(degreeScores[axis], -1.0, 1.0)
    );
    // Map [-1, +1] → [0.3, 1.7]
    result[axis] = 1.0 + 0.7 * Math.max(-1, Math.min(1, raw));
  }

  // Attach debug info
  result._debug = { dignity, dignityScores, aspectScores, sectScores, houseScores, rxScores, degreeScores };

  return result;
}

// ─── CATEGORY DEFINITIONS ───────────────────────────────────────────────────

export const CATEGORY_META = [
  { id: "love_romance", key: "Love & Romance", label: "Love & Romance", aliases: [] },
  { id: "partnership", key: "Partnership", label: "Partnership & Deep Connection", aliases: ["Partnership & Deep Connection"] },
  { id: "vocation_career", key: "Vocation & Career", label: "Vocation & Career", aliases: [] },
  { id: "friendship_family", key: "Friendship & Family", label: "Friendship & Family", aliases: [] },
  { id: "excitement", key: "Excitement", label: "Excitement & Instability", aliases: ["Excitement & Instability"] },
  { id: "growth", key: "Growth", label: "Growth & Transformation", aliases: ["Growth & Transformation"] },
];

const CATEGORY_META_BY_KEY = new Map(CATEGORY_META.map(meta => [meta.key, meta]));

export const CATEGORY_KEYS = CATEGORY_META.map(meta => meta.key);

function normalizeCategoryToken(value) {
  return String(value).trim().toLowerCase();
}

export function getCategoryMeta(key) {
  return CATEGORY_META_BY_KEY.get(key) ?? null;
}

export function resolveCategoryKey(value) {
  if (value == null) return null;
  const normalized = normalizeCategoryToken(value);
  const match = CATEGORY_META.find(meta =>
    normalizeCategoryToken(meta.key) === normalized ||
    normalizeCategoryToken(meta.label) === normalized ||
    meta.id === normalized ||
    meta.aliases.some(alias => normalizeCategoryToken(alias) === normalized)
  );
  return match?.key ?? null;
}

const CATEGORY_WEIGHTS = [
  // Love & Romance
  { planet:"Venus", angle:"DS", cats:{ "Love & Romance": 100 }},
  { planet:"Venus", angle:"AS", cats:{ "Love & Romance": 90 }},
  { planet:"Moon",  angle:"DS", cats:{ "Love & Romance": 80 }},
  { planet:"Sun",   angle:"DS", cats:{ "Love & Romance": 60 }},
  { planet:"Jupiter", angle:"DS", cats:{ "Love & Romance": 80 }},
  { planet:"Mars",  angle:"DS", cats:{ "Love & Romance": 40 }},
  { planet:"Neptune", angle:"DS", cats:{ "Love & Romance": 70 }},
  { planet:"Pluto", angle:"DS", cats:{ "Love & Romance": 50 }},

  // Partnership & Deep Connection
  { planet:"Venus", angle:"DS", cats:{ "Partnership": 100 }},
  { planet:"Venus", angle:"AS", cats:{ "Partnership": 80 }},
  { planet:"Moon",  angle:"DS", cats:{ "Partnership": 70 }},
  { planet:"Mars",  angle:"DS", cats:{ "Partnership": 70 }},
  { planet:"Mars",  angle:"AS", cats:{ "Partnership": 50 }},
  { planet:"Jupiter", angle:"DS", cats:{ "Partnership": 60 }},
  { planet:"Pluto", angle:"DS", cats:{ "Partnership": 60 }},
  { planet:"Pluto", angle:"AS", cats:{ "Partnership": 40 }},
  { planet:"Sun",   angle:"DS", cats:{ "Partnership": 40 }},
  { planet:"Saturn", angle:"DS", cats:{ "Partnership": 30 }},
  { planet:"Neptune", angle:"DS", cats:{ "Partnership": 50 }},

  // Vocation & Career
  { planet:"Sun",   angle:"MC", cats:{ "Vocation & Career": 100 }},
  { planet:"Saturn", angle:"MC", cats:{ "Vocation & Career": 70 }},
  { planet:"Mars",  angle:"MC", cats:{ "Vocation & Career": 90 }},
  { planet:"Jupiter", angle:"MC", cats:{ "Vocation & Career": 80 }},
  { planet:"Venus", angle:"MC", cats:{ "Vocation & Career": 50 }},
  { planet:"Pluto", angle:"MC", cats:{ "Vocation & Career": 50 }},
  { planet:"Uranus", angle:"MC", cats:{ "Vocation & Career": 40 }},
  { planet:"Neptune", angle:"MC", cats:{ "Vocation & Career": 30 }},
  { planet:"Mercury", angle:"MC", cats:{ "Vocation & Career": 60 }},

  // Friendship & Family
  { planet:"Moon",  angle:"IC", cats:{ "Friendship & Family": 100 }},
  { planet:"Moon",  angle:"AS", cats:{ "Friendship & Family": 80 }},
  { planet:"Sun",   angle:"AS", cats:{ "Friendship & Family": 40 }},
  { planet:"Jupiter", angle:"AS", cats:{ "Friendship & Family": 80 }},
  { planet:"Jupiter", angle:"IC", cats:{ "Friendship & Family": 70 }},
  { planet:"Venus", angle:"IC", cats:{ "Friendship & Family": 80 }},
  { planet:"Venus", angle:"AS", cats:{ "Friendship & Family": 60 }},
  { planet:"Saturn", angle:"IC", cats:{ "Friendship & Family": 40 }},
  { planet:"Mercury", angle:"AS", cats:{ "Friendship & Family": 40 }},

  // Excitement & Instability
  { planet:"Uranus", angle:"AS", cats:{ "Excitement": 100 }},
  { planet:"Uranus", angle:"MC", cats:{ "Excitement": 70 }},
  { planet:"Mars",  angle:"AS", cats:{ "Excitement": 100 }},
  { planet:"Pluto", angle:"AS", cats:{ "Excitement": 80 }},
  { planet:"Pluto", angle:"MC", cats:{ "Excitement": 60 }},
  { planet:"Mars",  angle:"DS", cats:{ "Excitement": 70 }},
  { planet:"Neptune", angle:"AS", cats:{ "Excitement": 50 }},

  // Growth & Transformation
  { planet:"Pluto", angle:"AS", cats:{ "Growth": 100 }},
  { planet:"Pluto", angle:"DS", cats:{ "Growth": 90 }},
  { planet:"Pluto", angle:"MC", cats:{ "Growth": 80 }},
  { planet:"Pluto", angle:"IC", cats:{ "Growth": 70 }},
  { planet:"Saturn", angle:"AS", cats:{ "Growth": 80 }},
  { planet:"Saturn", angle:"MC", cats:{ "Growth": 70 }},
  { planet:"Uranus", angle:"AS", cats:{ "Growth": 70 }},
  { planet:"Neptune", angle:"AS", cats:{ "Growth": 60 }},
  { planet:"Mars",  angle:"AS", cats:{ "Growth": 50 }},
  { planet:"Jupiter", angle:"MC", cats:{ "Growth": 40 }},
];

// How each category blends the three axes into a final score
const CATEGORY_AXIS_BLEND = {
  "Love & Romance":       { intensity: 0.35, harmony: 0.40, growth: 0.25 },
  "Partnership":          { intensity: 0.30, harmony: 0.30, growth: 0.40 },
  "Vocation & Career":    { intensity: 0.30, harmony: 0.45, growth: 0.25 },
  "Friendship & Family":  { intensity: 0.20, harmony: 0.55, growth: 0.25 },
  "Excitement":           { intensity: 0.60, harmony: 0.10, growth: 0.30 },
  "Growth":               { intensity: 0.20, harmony: 0.10, growth: 0.70 },
};

const ALL_CATEGORIES = CATEGORY_KEYS;

const ORB_DEGREES = 7;

// ─── DISTANCE HELPERS FOR LINE PROXIMITY SCORING ────────────────────────────

function distToVertical(lat, lon, lineLon) {
  const dLon = Math.abs(lon - lineLon);
  const d = dLon > 180 ? 360 - dLon : dLon;
  return d;
}

function distToCurve(lat, lon, points) {
  let minDist = Infinity;
  for (const [pLon, pLat] of points) {
    const dLat = pLat - lat;
    let dLon = pLon - lon;
    if (dLon > 180) dLon -= 360;
    if (dLon < -180) dLon += 360;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    if (dist < minDist) minDist = dist;
  }
  return minDist;
}

// ─── MAIN SCORING FUNCTION ──────────────────────────────────────────────────

export function scoreWithNatalContext(lat, lon, lines, natalData, planetStrengths) {
  // Build distance map: planet+angle → distance in degrees
  const distMap = {};
  for (const line of lines) {
    const key = `${line.planet}|${line.angle}`;
    let dist;
    if (line.type === "vertical") {
      dist = distToVertical(lat, lon, line.longitude);
    } else if (line.type === "curve" && line.points?.length) {
      dist = distToCurve(lat, lon, line.points);
    } else continue;
    distMap[key] = dist;
  }

  // Accumulate scores per category, per axis
  const rawScores = {};    // { category: { intensity, harmony, growth } }
  const maxPossible = {};  // { category: number }

  for (const cat of ALL_CATEGORIES) {
    rawScores[cat] = { intensity: 0, harmony: 0, growth: 0 };
    maxPossible[cat] = 0;
  }

  for (const entry of CATEGORY_WEIGHTS) {
    const dist = distMap[`${entry.planet}|${entry.angle}`] ?? Infinity;

    for (const [cat, weight] of Object.entries(entry.cats)) {
      if (!CATEGORY_AXIS_BLEND[cat]) continue;
      maxPossible[cat] += weight;

      if (dist < ORB_DEGREES) {
        const proximity = (1 - dist / ORB_DEGREES) ** 2;
        const ps = planetStrengths[entry.planet] || { intensity: 1, harmony: 1, growth: 1 };

        rawScores[cat].intensity += proximity * weight * ps.intensity;
        rawScores[cat].harmony += proximity * weight * ps.harmony;
        rawScores[cat].growth += proximity * weight * ps.growth;
      }
    }
  }

  // Normalize to 0-1000 per axis, then blend
  const scores = {};
  for (const cat of ALL_CATEGORIES) {
    const max = maxPossible[cat];
    if (max === 0) { scores[cat] = { intensity: 0, harmony: 0, growth: 0, blended: 0 }; continue; }

    // Normalize each axis independently
    // Max possible per axis = max * 1.7 (if all planets at ceiling strength)
    const maxAxis = max * 1.7;
    const i = Math.round(Math.min(1000, (rawScores[cat].intensity / maxAxis) * 1000));
    const h = Math.round(Math.min(1000, (rawScores[cat].harmony / maxAxis) * 1000));
    const g = Math.round(Math.min(1000, (rawScores[cat].growth / maxAxis) * 1000));

    const blend = CATEGORY_AXIS_BLEND[cat];
    const blended = Math.round(i * blend.intensity + h * blend.harmony + g * blend.growth);

    scores[cat] = { intensity: i, harmony: h, growth: g, blended };
  }

  // Dominant lines info
  const dominantLines = {};
  for (const entry of CATEGORY_WEIGHTS) {
    const dist = distMap[`${entry.planet}|${entry.angle}`] ?? Infinity;
    if (dist >= ORB_DEGREES) continue;
    for (const cat of Object.keys(entry.cats)) {
      if (!dominantLines[cat] || dist < dominantLines[cat].dist) {
        dominantLines[cat] = { planet: entry.planet, angle: entry.angle, dist };
      }
    }
  }

  return { scores, dominantLines };
}
