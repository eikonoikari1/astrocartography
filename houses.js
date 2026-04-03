/**
 * houses.js — Placidus house system calculation
 *
 * Algorithm ported from Swiss Ephemeris (swehouse.c).
 * Falls back to equal houses at latitudes >60° where Placidus breaks down.
 */

const toRad = d => d * Math.PI / 180;
const toDeg = r => r * 180 / Math.PI;
const norm360 = x => ((x % 360) + 360) % 360;

const VERY_SMALL = 1e-10;
const VERY_SMALL_ITER = 1.0 / 360000.0;

// Trig helpers in degrees
const sind = d => Math.sin(toRad(d));
const cosd = d => Math.cos(toRad(d));
const tand = d => Math.tan(toRad(d));
const asind = x => toDeg(Math.asin(Math.max(-1, Math.min(1, x))));
const atand = x => toDeg(Math.atan(x));

/**
 * Asc2: Core calculation — intersection of a great circle with the ecliptic.
 * Port of Swiss Ephemeris Asc2().
 */
function Asc2(x, f, sine, cose) {
  let ass = -tand(f) * sine + cose * cosd(x);
  if (Math.abs(ass) < VERY_SMALL) ass = 0;
  let sinx = sind(x);
  if (Math.abs(sinx) < VERY_SMALL) sinx = 0;
  if (sinx === 0) {
    ass = ass < 0 ? -VERY_SMALL : VERY_SMALL;
  } else if (ass === 0) {
    ass = sinx < 0 ? -90 : 90;
  } else {
    ass = atand(sinx / ass);
  }
  if (ass < 0) ass = 180 + ass;
  return ass;
}

/**
 * Asc1: Quadrant-aware ecliptic longitude from RAMC offset and pole height.
 * Port of Swiss Ephemeris Asc1().
 */
function Asc1(x1, f, sine, cose) {
  x1 = norm360(x1);
  const n = Math.floor(x1 / 90) + 1;
  if (Math.abs(90 - f) < VERY_SMALL) return 180;
  if (Math.abs(90 + f) < VERY_SMALL) return 0;
  let ass;
  if (n === 1) ass = Asc2(x1, f, sine, cose);
  else if (n === 2) ass = 180 - Asc2(180 - x1, -f, sine, cose);
  else if (n === 3) ass = 180 + Asc2(x1 - 180, -f, sine, cose);
  else ass = 360 - Asc2(360 - x1, f, sine, cose);
  ass = norm360(ass);
  if (Math.abs(ass - 90) < VERY_SMALL) ass = 90;
  if (Math.abs(ass - 180) < VERY_SMALL) ass = 180;
  if (Math.abs(ass - 270) < VERY_SMALL) ass = 270;
  if (Math.abs(ass - 360) < VERY_SMALL) ass = 0;
  return ass;
}

/**
 * Compute a single Placidus cusp via iteration.
 * @param {number} rectasc - RAMC offset in degrees
 * @param {number} fh - initial pole height guess
 * @param {number} divisor - semi-arc fraction divisor (3 or 1.5)
 * @param {number} tanfi - tan(latitude)
 * @param {number} sine - sin(obliquity)
 * @param {number} cose - cos(obliquity)
 * @returns {number} ecliptic longitude of cusp in degrees
 */
function placidusCusp(rectasc, fh, divisor, tanfi, sine, cose) {
  let cusp = Asc1(rectasc, fh, sine, cose);
  for (let i = 1; i <= 100; i++) {
    const tant = tand(asind(sine * sind(cusp)));
    if (Math.abs(tant) < VERY_SMALL) break;
    const f = atand(sind(asind(tanfi * tant) / divisor) / tant);
    const prev = cusp;
    cusp = Asc1(rectasc, f, sine, cose);
    if (i > 1 && Math.abs(norm360(cusp - prev + 180) - 180) < VERY_SMALL_ITER) break;
  }
  return cusp;
}

/**
 * Compute equal house cusps from ASC.
 */
function equalHouses(asc) {
  return Array.from({ length: 12 }, (_, i) => norm360(asc + i * 30));
}

/**
 * Compute Placidus house cusps.
 * @param {number} gmstRad - Greenwich Apparent Sidereal Time in radians
 * @param {number} obliquityRad - obliquity of ecliptic in radians
 * @param {number} latitudeDeg - geographic latitude in degrees
 * @param {number} longitudeDeg - geographic longitude in degrees
 * @returns {{ cusps: number[], mc: number, asc: number, ic: number, dsc: number, system: string }}
 */
export function computeHouses(gmstRad, obliquityRad, latitudeDeg, longitudeDeg) {
  const fi = latitudeDeg;
  const e = toDeg(obliquityRad);
  const th = norm360(toDeg(gmstRad) + longitudeDeg); // ARMC (local sidereal time in degrees)

  const sine = sind(e);
  const cose = cosd(e);
  const tane = tand(e);
  const tanfi = tand(fi);

  // MC and ASC
  const mc = Asc1(th, 0, sine, cose); // pole height 0 = MC
  const asc = Asc1(th + 90, fi, sine, cose); // pole height = latitude for ASC
  const ic = norm360(mc + 180);
  const dsc = norm360(asc + 180);

  // Fallback to equal houses at extreme latitudes
  if (Math.abs(fi) > 60) {
    const cusps = equalHouses(asc);
    return { cusps, mc, asc, ic, dsc, system: "equal" };
  }

  // Pole heights for Placidus intermediate cusps
  const a = asind(tanfi * tane);
  const fh1 = atand(sind(a / 3) / tane);
  const fh2 = atand(sind(a * 2 / 3) / tane);

  // Compute intermediate cusps
  const cusp11 = placidusCusp(norm360(30 + th), fh1, 3, tanfi, sine, cose);
  const cusp12 = placidusCusp(norm360(60 + th), fh2, 1.5, tanfi, sine, cose);
  const cusp2  = placidusCusp(norm360(120 + th), fh2, 1.5, tanfi, sine, cose);
  const cusp3  = placidusCusp(norm360(150 + th), fh1, 3, tanfi, sine, cose);

  // Opposite cusps
  const cusp5 = norm360(cusp11 + 180);
  const cusp6 = norm360(cusp12 + 180);
  const cusp8 = norm360(cusp2 + 180);
  const cusp9 = norm360(cusp3 + 180);

  const cusps = [asc, cusp2, cusp3, ic, cusp5, cusp6, dsc, cusp8, cusp9, mc, cusp11, cusp12];

  return { cusps, mc, asc, ic, dsc, system: "placidus" };
}

/**
 * Determine which house a planet falls in given house cusps.
 * @param {number} longitude - planet's ecliptic longitude in degrees
 * @param {number[]} cusps - 12 cusp longitudes
 * @returns {number} house number 1-12
 */
export function getHouse(longitude, cusps) {
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    if (start < end) {
      if (longitude >= start && longitude < end) return i + 1;
    } else {
      if (longitude >= start || longitude < end) return i + 1;
    }
  }
  return 1;
}
