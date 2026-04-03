/**
 * horary.js — Horary astrology chart analysis
 *
 * Casts a chart for the moment a question is asked, identifies significators
 * from house rulers, evaluates dignity, and checks aspects between them.
 */
import { castChart } from "./chartCaster.js";
import { computeHouses, getHouse } from "./houses.js";

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

// Traditional rulers only (no Uranus/Neptune/Pluto)
const SIGN_RULER = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

const DOMICILE = {
  Sun: ["Leo"], Moon: ["Cancer"], Mercury: ["Gemini", "Virgo"],
  Venus: ["Taurus", "Libra"], Mars: ["Aries", "Scorpio"],
  Jupiter: ["Sagittarius", "Pisces"], Saturn: ["Capricorn", "Aquarius"],
};

const DETRIMENT = {
  Sun: ["Aquarius"], Moon: ["Capricorn"], Mercury: ["Sagittarius", "Pisces"],
  Venus: ["Aries", "Scorpio"], Mars: ["Taurus", "Libra"],
  Jupiter: ["Gemini", "Virgo"], Saturn: ["Cancer", "Leo"],
};

const EXALTATION = {
  Sun: "Aries", Moon: "Taurus", Mercury: "Virgo", Venus: "Pisces",
  Mars: "Capricorn", Jupiter: "Cancer", Saturn: "Libra",
};

const FALL = {
  Sun: "Libra", Moon: "Scorpio", Mercury: "Pisces", Venus: "Virgo",
  Mars: "Cancer", Jupiter: "Capricorn", Saturn: "Aries",
};

function lonToSign(lon) {
  const norm = ((lon % 360) + 360) % 360;
  return SIGNS[Math.floor(norm / 30)];
}

/**
 * Evaluate essential dignity of a planet in a sign.
 */
function evaluateDignity(planet, sign) {
  if ((DOMICILE[planet] || []).includes(sign)) return "domicile";
  if (EXALTATION[planet] === sign) return "exaltation";
  if ((DETRIMENT[planet] || []).includes(sign)) return "detriment";
  if (FALL[planet] === sign) return "fall";
  return "peregrine";
}

/**
 * Check if a planet is combust (within 8° of the Sun).
 */
function isCombust(planetLon, sunLon) {
  let diff = Math.abs(planetLon - sunLon);
  if (diff > 180) diff = 360 - diff;
  return diff < 8;
}

/**
 * Classify the aspect between two ecliptic longitudes.
 */
function classifyAspect(lon1, lon2, orb = 8) {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;

  const aspects = [
    { name: "conjunction", angle: 0 },
    { name: "sextile", angle: 60 },
    { name: "square", angle: 90 },
    { name: "trine", angle: 120 },
    { name: "opposition", angle: 180 },
  ];

  for (const asp of aspects) {
    const aspOrb = Math.abs(diff - asp.angle);
    if (aspOrb <= orb) {
      return { name: asp.name, type: asp.name, orb: aspOrb, exact: aspOrb < 1 };
    }
  }
  return null;
}

/**
 * Analyze a horary chart.
 *
 * @param {Date} questionTime - when the question was asked (UTC)
 * @param {number} latitudeDeg - latitude where the question was asked
 * @param {number} longitudeDeg - longitude
 * @param {Object} [options]
 * @param {number} [options.querentHouse=1] - house of the querent
 * @param {number} [options.quesitedHouse=7] - house of the quesited
 * @returns {Object} horary analysis
 */
export function analyzeHorary(questionTime, latitudeDeg, longitudeDeg, options = {}) {
  const { querentHouse = 1, quesitedHouse = 7 } = options;

  const chart = castChart(questionTime);
  const houses = computeHouses(chart.gmst, chart.obliquity, latitudeDeg, longitudeDeg);
  const lons = chart.eclipticLongitudes;

  // Find rulers of querent and quesited houses
  const querentCuspSign = lonToSign(houses.cusps[querentHouse - 1]);
  const quesitedCuspSign = lonToSign(houses.cusps[quesitedHouse - 1]);
  const querentRuler = SIGN_RULER[querentCuspSign];
  const quesitedRuler = SIGN_RULER[quesitedCuspSign];

  // Evaluate significators
  const querentSign = lonToSign(lons[querentRuler]);
  const quesitedSign = lonToSign(lons[quesitedRuler]);

  const querentDignity = evaluateDignity(querentRuler, querentSign);
  const quesitedDignity = evaluateDignity(quesitedRuler, quesitedSign);

  const querentHouseNum = getHouse(lons[querentRuler], houses.cusps);
  const quesitedHouseNum = getHouse(lons[quesitedRuler], houses.cusps);

  // Check aspects between significators
  const aspect = classifyAspect(lons[querentRuler], lons[quesitedRuler]);

  // Moon as co-significator of querent
  const moonSign = lonToSign(lons.Moon);
  const moonHouse = getHouse(lons.Moon, houses.cusps);
  const moonToQuesited = classifyAspect(lons.Moon, lons[quesitedRuler]);

  // Combustion check
  const querentCombust = querentRuler !== "Sun" && isCombust(lons[querentRuler], lons.Sun);
  const quesitedCombust = quesitedRuler !== "Sun" && isCombust(lons[quesitedRuler], lons.Sun);

  return {
    chart,
    houses,
    querent: {
      house: querentHouse,
      cuspSign: querentCuspSign,
      ruler: querentRuler,
      rulerSign: querentSign,
      rulerHouse: querentHouseNum,
      dignity: querentDignity,
      combust: querentCombust,
      longitude: lons[querentRuler],
    },
    quesited: {
      house: quesitedHouse,
      cuspSign: quesitedCuspSign,
      ruler: quesitedRuler,
      rulerSign: quesitedSign,
      rulerHouse: quesitedHouseNum,
      dignity: quesitedDignity,
      combust: quesitedCombust,
      longitude: lons[quesitedRuler],
    },
    aspect,
    moon: {
      sign: moonSign,
      house: moonHouse,
      longitude: lons.Moon,
      aspectToQuesited: moonToQuesited,
    },
    allPositions: lons,
  };
}
