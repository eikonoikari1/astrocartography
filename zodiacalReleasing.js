/**
 * zodiacalReleasing.js — Zodiacal Releasing from the Lot of Fortune
 *
 * Computes L1-L4 time-lord periods based on the Hellenistic technique.
 * Uses the DOMICILE ruler → period years mapping from the traditional system.
 */
import { computeHouses } from "./houses.js";
import { getHouse } from "./houses.js";

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

// Traditional domicile rulers (not modern)
const SIGN_RULER = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

// Period years for each traditional ruler
const RULER_YEARS = {
  Sun: 19, Moon: 25, Mercury: 20, Venus: 8,
  Mars: 15, Jupiter: 12, Saturn: 27,
};

// Period in years for each sign (via its traditional ruler)
const SIGN_YEARS = {};
for (const sign of SIGNS) {
  SIGN_YEARS[sign] = RULER_YEARS[SIGN_RULER[sign]];
}

/**
 * Get the zodiac sign and degree from ecliptic longitude.
 */
function lonToSign(lonDeg) {
  const norm = ((lonDeg % 360) + 360) % 360;
  const idx = Math.floor(norm / 30);
  return { sign: SIGNS[idx], degree: norm % 30, index: idx };
}

/**
 * Compute the Lot of Fortune.
 * Day chart: ASC + Moon - Sun
 * Night chart: ASC + Sun - Moon
 *
 * @param {number} ascLon - Ascendant ecliptic longitude in degrees
 * @param {number} sunLon - Sun ecliptic longitude in degrees
 * @param {number} moonLon - Moon ecliptic longitude in degrees
 * @param {boolean} isDayChart - true if Sun is above horizon
 * @returns {number} Lot of Fortune ecliptic longitude in degrees [0, 360)
 */
export function lotOfFortune(ascLon, sunLon, moonLon, isDayChart) {
  const lot = isDayChart
    ? ascLon + moonLon - sunLon
    : ascLon + sunLon - moonLon;
  return ((lot % 360) + 360) % 360;
}

export function lotOfSpirit(ascLon, sunLon, moonLon, isDayChart) {
  const lot = isDayChart
    ? ascLon + sunLon - moonLon
    : ascLon + moonLon - sunLon;
  return ((lot % 360) + 360) % 360;
}

/**
 * Determine if the chart is a day chart (Sun above horizon).
 * Sun is above horizon if it's in houses 7-12 (between DSC and ASC going through MC).
 */
export function isDayChart(sunLon, ascLon) {
  const dscLon = (ascLon + 180) % 360;
  // Sun is above horizon if it's between DSC and ASC going through MC
  // In ecliptic terms: going from DSC counterclockwise to ASC (the upper half)
  if (dscLon < ascLon) {
    return sunLon >= dscLon && sunLon < ascLon;
  } else {
    return sunLon >= dscLon || sunLon < ascLon;
  }
}

export function isDayChartByHouse(sunLon, cusps) {
  const house = getHouse(sunLon, cusps);
  return house >= 7 && house <= 12;
}

/**
 * Generate zodiacal releasing periods.
 *
 * @param {number} lotLon - Lot of Fortune ecliptic longitude in degrees
 * @param {Date} birthDate - birth date
 * @param {number} [years=80] - how many years of periods to generate
 * @param {number} [maxLevel=2] - max depth (1=L1 only, 2=L1+L2, etc.)
 * @returns {Array<{level, sign, ruler, startDate, endDate, years, months}>}
 */
export function generatePeriods(lotLon, birthDate, years = 80, maxLevel = 2) {
  const results = [];
  const endLimit = new Date(birthDate);
  endLimit.setFullYear(endLimit.getFullYear() + years);

  const lotSign = lonToSign(lotLon);
  let startIdx = lotSign.index;

  // Generate L1 periods
  let l1Start = new Date(birthDate);
  for (let cycle = 0; cycle < 5 && l1Start < endLimit; cycle++) {
    for (let i = 0; i < 12 && l1Start < endLimit; i++) {
      const signIdx = (startIdx + i) % 12;
      const sign = SIGNS[signIdx];
      const periodYears = SIGN_YEARS[sign];
      const l1End = new Date(l1Start);
      l1End.setFullYear(l1End.getFullYear() + periodYears);

      if (l1End > endLimit) {
        // Truncate
        results.push({
          level: 1, sign, ruler: SIGN_RULER[sign],
          startDate: new Date(l1Start), endDate: new Date(endLimit),
          years: periodYears, months: periodYears * 12,
        });

        if (maxLevel >= 2) {
          generateSubPeriods(results, sign, signIdx, l1Start,
            l1End > endLimit ? endLimit : l1End, 2, maxLevel);
        }
        l1Start = endLimit;
        break;
      }

      results.push({
        level: 1, sign, ruler: SIGN_RULER[sign],
        startDate: new Date(l1Start), endDate: new Date(l1End),
        years: periodYears, months: periodYears * 12,
      });

      if (maxLevel >= 2) {
        generateSubPeriods(results, sign, signIdx, l1Start, l1End, 2, maxLevel);
      }

      l1Start = l1End;
    }
  }

  return results;
}

/**
 * Generate sub-periods (L2, L3, L4) within a parent period.
 */
function generateSubPeriods(results, parentSign, parentSignIdx, parentStart, parentEnd, level, maxLevel) {
  const totalMs = parentEnd - parentStart;
  let subStart = new Date(parentStart);

  // Sub-periods cycle through signs starting from the parent sign
  // Each sub-period's duration is proportional to its sign's years
  const totalYears = SIGNS.reduce((sum, s) => sum + SIGN_YEARS[s], 0); // 126 years per full cycle

  for (let cycle = 0; cycle < 3 && subStart < parentEnd; cycle++) {
    for (let i = 0; i < 12 && subStart < parentEnd; i++) {
      const signIdx = (parentSignIdx + i) % 12;
      const sign = SIGNS[signIdx];
      const fraction = SIGN_YEARS[sign] / totalYears;
      const subDurationMs = fraction * totalMs;
      const subEnd = new Date(subStart.getTime() + subDurationMs);

      const actualEnd = subEnd > parentEnd ? parentEnd : subEnd;

      results.push({
        level, sign, ruler: SIGN_RULER[sign],
        startDate: new Date(subStart), endDate: new Date(actualEnd),
        years: SIGN_YEARS[sign],
        months: (actualEnd - subStart) / (1000 * 60 * 60 * 24 * 30.44),
      });

      if (level < maxLevel && subStart < actualEnd) {
        generateSubPeriods(results, sign, signIdx, subStart, actualEnd, level + 1, maxLevel);
      }

      subStart = actualEnd;
    }
  }
}

/**
 * Convenience: compute ZR from a full chart.
 */
export function zodiacalReleasingFromChart(chart, birthLatDeg, birthLonDeg, birthDate, options = {}) {
  const houses = computeHouses(chart.gmst, chart.obliquity, birthLatDeg, birthLonDeg);
  const sunLon = chart.eclipticLongitudes.Sun;
  const moonLon = chart.eclipticLongitudes.Moon;
  const ascLon = houses.asc;
  const dayChartStrategy = options.dayChartStrategy ?? "house";
  const dayChart = dayChartStrategy === "hemisphere"
    ? isDayChart(sunLon, ascLon)
    : isDayChartByHouse(sunLon, houses.cusps);
  const lotType = options.lotType ?? "fortune";
  const lot = lotType === "spirit"
    ? lotOfSpirit(ascLon, sunLon, moonLon, dayChart)
    : lotOfFortune(ascLon, sunLon, moonLon, dayChart);

  return {
    lotOfFortune: lot,
    lotSign: lonToSign(lot),
    isDayChart: dayChart,
    lotType,
    calendar: options.calendar ?? "schematic360",
    periods: generatePeriods(lot, birthDate, options.years || 80, options.maxLevel || 2),
  };
}

export { SIGNS, SIGN_RULER, SIGN_YEARS, lonToSign };
