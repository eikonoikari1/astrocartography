/**
 * transits.js — Transit search engine
 *
 * Finds exact dates when transit planets form aspects to target positions.
 * Uses geocentric ecliptic longitudes with bisection for sub-minute accuracy.
 * Handles retrograde multi-hit patterns (up to 3 passes per aspect).
 */
import * as Astronomy from "astronomy-engine";

const TRANSIT_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

const ASPECTS = [
  { name: "conjunction", angle: 0 },
  { name: "sextile",     angle: 60 },
  { name: "square",      angle: 90 },
  { name: "trine",       angle: 120 },
  { name: "opposition",  angle: 180 },
];

/**
 * Get geocentric ecliptic longitude in degrees [0, 360).
 */
function geoEclLon(body, time) {
  if (body === "Sun") {
    return Astronomy.SunPosition(time).elon;
  }
  const geo = Astronomy.GeoVector(body, time, true);
  return Astronomy.Ecliptic(geo).elon;
}

/**
 * Signed angular difference: how far `a` is from `b`, range (-180, 180].
 */
function angleDiff(a, b) {
  let d = ((a - b) % 360 + 540) % 360 - 180;
  return d;
}

/**
 * Separation from exact aspect: how far the transit-natal angular separation
 * is from the target aspect angle. Returns signed value for bisection.
 * Range: (-180, 180]
 */
function aspectSeparation(transitLon, natalLon, aspectAngle) {
  const sep = angleDiff(transitLon, natalLon);
  // For conjunction (0°), we want sep to reach 0
  // For opposition (180°), we want sep to reach ±180
  // For others, we check both +angle and -angle
  // We return the distance to the nearest target
  if (aspectAngle === 0) return sep;
  if (aspectAngle === 180) {
    // Opposition: signed distance from 180°.
    // sep is in (-180, 180]. We want a value that crosses zero
    // when |sep| passes through 180. Use (180 - |sep|) with sign of sep.
    const absSep = Math.abs(sep);
    return (180 - absSep) * Math.sign(sep || 1);
  }
  // For sextile/square/trine: check both +angle and -angle
  const d1 = angleDiff(sep, aspectAngle);   // applying from one side
  const d2 = angleDiff(sep, -aspectAngle);  // applying from other side
  return Math.abs(d1) < Math.abs(d2) ? d1 : d2;
}

/**
 * Bisect to find exact time when separation crosses zero.
 * @param {string} body - transit planet
 * @param {number} natalLon - natal ecliptic longitude (degrees)
 * @param {number} aspectAngle - target aspect angle
 * @param {AstroTime} t1 - start time (separation has one sign)
 * @param {AstroTime} t2 - end time (separation has opposite sign)
 * @returns {AstroTime} - exact moment of aspect
 */
function bisect(body, natalLon, aspectAngle, t1, t2) {
  let lo = t1, hi = t2;
  const sLo = aspectSeparation(geoEclLon(body, lo), natalLon, aspectAngle);
  for (let i = 0; i < 40; i++) {
    const midUt = (lo.ut + hi.ut) / 2;
    const mid = Astronomy.MakeTime(midUt);
    const sMid = aspectSeparation(geoEclLon(body, mid), natalLon, aspectAngle);
    if (Math.sign(sMid) === Math.sign(sLo)) lo = mid;
    else hi = mid;
  }
  return Astronomy.MakeTime((lo.ut + hi.ut) / 2);
}

/**
 * Determine if a transit is applying (getting closer) or separating.
 */
function isApplying(body, natalLon, aspectAngle, time) {
  const dt = 0.01; // ~15 minutes
  const lon1 = geoEclLon(body, time);
  const lon2 = geoEclLon(body, Astronomy.MakeTime(time.ut + dt));
  const sep1 = Math.abs(aspectSeparation(lon1, natalLon, aspectAngle));
  const sep2 = Math.abs(aspectSeparation(lon2, natalLon, aspectAngle));
  return sep2 < sep1;
}

/**
 * Search for transits within a date range.
 *
 * @param {Object} natalLongitudes - { Sun: 185.23, Moon: 81.50, ... } ecliptic degrees
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {Object} [options]
 * @param {number} [options.orb=1] - orb in degrees for reporting
 * @param {string[]} [options.transitPlanets] - which planets to use as transiting bodies
 * @param {string[]} [options.natalPlanets] - which natal points to check against
 * @param {string[]} [options.aspects] - aspect names to include
 * @param {number} [options.stepDays=1] - step size in days (use 0.5 for Moon)
 * @returns {Array<{transitPlanet, natalPlanet, aspect, exactDate, applying, orb, transitLon}>}
 */
export function searchTransits(targetLongitudes, startDate, endDate, options = {}) {
  const {
    orb = 1,
    transitPlanets = TRANSIT_PLANETS,
    natalPlanets = Object.keys(targetLongitudes),
    aspects: aspectFilter,
    stepDays,
  } = options;

  const activeAspects = aspectFilter
    ? ASPECTS.filter(a => aspectFilter.includes(a.name))
    : ASPECTS;

  const results = [];
  const tStart = Astronomy.MakeTime(startDate);
  const tEnd = Astronomy.MakeTime(endDate);

  for (const tBody of transitPlanets) {
    // Moon moves ~13°/day, needs finer stepping
    const step = stepDays ?? (tBody === "Moon" ? 0.25 : 1);

    for (const nBody of natalPlanets) {
      const natalLon = targetLongitudes[nBody];

      for (const aspect of activeAspects) {
        // Skip self-transits except conjunctions (planetary returns)
        if (tBody === nBody && aspect.angle !== 0) continue;
        // Step through the date range, looking for zero-crossings of aspectSeparation
        let prevTime = tStart;
        let prevSep = aspectSeparation(geoEclLon(tBody, prevTime), natalLon, aspect.angle);

        let t = Astronomy.MakeTime(tStart.ut + step);
        while (t.ut <= tEnd.ut) {
          const lon = geoEclLon(tBody, t);
          const sep = aspectSeparation(lon, natalLon, aspect.angle);

          // Zero crossing detected
          if (Math.sign(sep) !== Math.sign(prevSep) && Math.abs(sep) < 30 && Math.abs(prevSep) < 30) {
            const exactTime = bisect(tBody, natalLon, aspect.angle, prevTime, t);
            const exactLon = geoEclLon(tBody, exactTime);
            const exactOrb = Math.abs(aspectSeparation(exactLon, natalLon, aspect.angle));

            if (exactOrb <= orb) {
              results.push({
                transitPlanet: tBody,
                natalPlanet: nBody,
                aspect: aspect.name,
                exactDate: exactTime.date,
                applying: isApplying(tBody, natalLon, aspect.angle, Astronomy.MakeTime(exactTime.ut - 0.5)),
                orb: exactOrb,
                transitLon: exactLon,
              });
            }
          }

          prevTime = t;
          prevSep = sep;
          t = Astronomy.MakeTime(t.ut + step);
        }
      }
    }
  }

  // Sort by date
  results.sort((a, b) => a.exactDate - b.exactDate);

  // Deduplicate: when a sample lands near exact, zero-crossings on both sides
  // produce two hits for the same event. Keep the one with the smaller orb.
  const deduped = [];
  for (const r of results) {
    const prev = deduped[deduped.length - 1];
    if (prev &&
        prev.transitPlanet === r.transitPlanet &&
        prev.natalPlanet === r.natalPlanet &&
        prev.aspect === r.aspect &&
        Math.abs(r.exactDate - prev.exactDate) < 86400000) { // within 1 day
      // Keep the one with smaller orb
      if (r.orb < prev.orb) deduped[deduped.length - 1] = r;
    } else {
      deduped.push(r);
    }
  }
  return deduped;
}

/**
 * Convenience: find transits of slow planets (Jupiter–Pluto) to natal chart.
 */
export function searchMajorTransits(natalLongitudes, startDate, endDate, options = {}) {
  return searchTransits(natalLongitudes, startDate, endDate, {
    ...options,
    transitPlanets: ["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"],
  });
}

/**
 * Convenience wrapper for rectification workflows that target natal angles.
 */
export function searchAngleTransits(angleLongitudes, startDate, endDate, options = {}) {
  return searchTransits(angleLongitudes, startDate, endDate, options).map(hit => ({
    transitPlanet: hit.transitPlanet,
    targetPoint: hit.natalPlanet,
    aspect: hit.aspect,
    exactDate: hit.exactDate,
    applying: hit.applying,
    orb: hit.orb,
    transitLon: hit.transitLon,
  }));
}

export { ASPECTS, TRANSIT_PLANETS };
