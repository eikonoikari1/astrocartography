/**
 * chartCaster.js — shared astronomy module wrapping astronomy-engine
 *
 * All planetary computation goes through this module.
 * astronomy-engine returns: RA in hours, Dec in degrees, ecliptic lon in degrees.
 * This module normalizes RA/Dec to radians and keeps ecliptic longitudes in degrees.
 */
import * as Astronomy from "astronomy-engine";

const PI2 = 2 * Math.PI;
const toRad = d => d * Math.PI / 180;
const toDeg = r => r * 180 / Math.PI;
const normRad = x => ((x % PI2) + PI2) % PI2;
const norm360 = x => ((x % 360) + 360) % 360;

const HOUR2RAD = Math.PI / 12; // 1 hour = 15° = π/12 rad

const BODIES = [
  "Sun", "Moon", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
];

// Geocentric observer at Earth's center (for geocentric equatorial coords)
const GEOCENTRIC = new Astronomy.Observer(0, 0, 0);

/**
 * Get equatorial coordinates (geocentric, apparent/of-date, with aberration).
 * @returns {{ ra: number, dec: number }} ra and dec in radians
 */
export function getPlanetEquatorial(body, datetime) {
  const time = Astronomy.MakeTime(datetime);
  const eq = Astronomy.Equator(body, time, GEOCENTRIC, true, true);
  return {
    ra: eq.ra * HOUR2RAD,   // hours → radians
    dec: toRad(eq.dec),      // degrees → radians
  };
}

/**
 * Get geocentric ecliptic longitude in degrees [0, 360).
 * Uses GeoVector→Ecliptic for all bodies (EclipticLongitude is heliocentric for planets).
 */
export function getEclipticLongitude(body, datetime) {
  const time = Astronomy.MakeTime(datetime);
  if (body === "Sun") {
    return Astronomy.SunPosition(time).elon;
  }
  const geo = Astronomy.GeoVector(body, time, true);
  return Astronomy.Ecliptic(geo).elon;
}

/**
 * Get ecliptic coordinates (longitude and latitude) in degrees.
 */
export function getEclipticCoords(body, datetime) {
  const time = Astronomy.MakeTime(datetime);
  if (body === "Sun") {
    const sp = Astronomy.SunPosition(time);
    return { lon: sp.elon, lat: sp.elat };
  }
  const geo = Astronomy.GeoVector(body, time, true);
  const ecl = Astronomy.Ecliptic(geo);
  return { lon: ecl.elon, lat: ecl.elat };
}

/**
 * Greenwich Apparent Sidereal Time in radians.
 */
export function getGMST(datetime) {
  const time = Astronomy.MakeTime(datetime);
  const hours = Astronomy.SiderealTime(time);
  return hours * HOUR2RAD;
}

/**
 * Mean obliquity of the ecliptic in radians.
 */
export function getObliquity(datetime) {
  const time = Astronomy.MakeTime(datetime);
  return toRad(Astronomy.e_tilt(time).mobl);
}

/**
 * Get equatorial positions for all 10 bodies. Each has { ra, dec } in radians.
 */
export function getAllPositions(datetime) {
  const positions = {};
  for (const body of BODIES) {
    positions[body] = getPlanetEquatorial(body, datetime);
  }
  return positions;
}

/**
 * Cast a full chart: positions + gmst + obliquity + ecliptic longitudes.
 */
export function castChart(datetime) {
  const time = Astronomy.MakeTime(datetime);
  const positions = {};
  const eclipticLongitudes = {};
  for (const body of BODIES) {
    const eq = Astronomy.Equator(body, time, GEOCENTRIC, true, true);
    positions[body] = {
      ra: eq.ra * HOUR2RAD,
      dec: toRad(eq.dec),
    };
    if (body === "Sun") {
      eclipticLongitudes[body] = Astronomy.SunPosition(time).elon;
    } else {
      const geo = Astronomy.GeoVector(body, time, true);
      eclipticLongitudes[body] = Astronomy.Ecliptic(geo).elon;
    }
  }
  const gastHours = Astronomy.SiderealTime(time);
  const tilt = Astronomy.e_tilt(time);

  return {
    positions,
    eclipticLongitudes,
    gmst: gastHours * HOUR2RAD,
    obliquity: toRad(tilt.mobl),
    datetime,
  };
}

export { Astronomy, BODIES, normRad, norm360, toRad, toDeg };
