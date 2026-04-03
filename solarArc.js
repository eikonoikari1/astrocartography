/**
 * solarArc.js — Solar Arc direction helpers
 *
 * True solar arc is the default. Mean / Naibod is an explicit alternate mode.
 * The module stays longitude-first so a CLI layer can consume the results
 * without needing a separate direction engine yet.
 */
import { castChart } from "./chartCaster.js";
import { progressedChart, progressedDate } from "./progressions.js";

export const SOLAR_ARC_METHODS = Object.freeze({
  TRUE: "true",
  MEAN: "mean",
});

export const NAIBOD_DEGREES_PER_YEAR = 0.98564733;

export function normalize360(value) {
  return ((value % 360) + 360) % 360;
}

function assertFiniteNumber(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }
}

function assertDate(name, value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError(`${name} must be a valid Date`);
  }
}

function normalizeMethod(method = SOLAR_ARC_METHODS.TRUE) {
  const token = String(method).trim().toLowerCase();
  if (token === "true" || token === "actual" || token === "true-solar" || token === "solar") {
    return SOLAR_ARC_METHODS.TRUE;
  }
  if (token === "mean" || token === "naibod" || token === "naibodic") {
    return SOLAR_ARC_METHODS.MEAN;
  }
  throw new TypeError(`method must be one of: ${Object.values(SOLAR_ARC_METHODS).join(", ")} or Naibod aliases`);
}

function extractLongitudes(source, label = "source") {
  if (source == null || typeof source !== "object" || Array.isArray(source)) {
    throw new TypeError(`${label} must be an object`);
  }

  const record = source.eclipticLongitudes && typeof source.eclipticLongitudes === "object"
    ? source.eclipticLongitudes
    : source;

  const out = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError(`${label}.${key} must be a finite number`);
    }
    out[key] = value;
  }
  return out;
}

export function solarArcFromLongitudes(natalSunLon, progressedSunLon) {
  assertFiniteNumber("natalSunLon", natalSunLon);
  assertFiniteNumber("progressedSunLon", progressedSunLon);
  return normalize360(progressedSunLon - natalSunLon);
}

export function meanSolarArc(ageYears) {
  assertFiniteNumber("ageYears", ageYears);
  return normalize360(ageYears * NAIBOD_DEGREES_PER_YEAR);
}

export function directSolarArcLongitude(longitude, arcDegrees) {
  assertFiniteNumber("longitude", longitude);
  assertFiniteNumber("arcDegrees", arcDegrees);
  return normalize360(longitude + arcDegrees);
}

export function directSolarArcRecord(longitudes, arcDegrees) {
  const record = extractLongitudes(longitudes, "longitudes");
  const directed = {};
  for (const [key, longitude] of Object.entries(record)) {
    directed[key] = directSolarArcLongitude(longitude, arcDegrees);
  }
  return directed;
}

export function solarArcAtAge(birthDate, ageYears, options = {}) {
  assertDate("birthDate", birthDate);
  assertFiniteNumber("ageYears", ageYears);

  const method = normalizeMethod(options.method);
  const result = {
    method,
    ageYears,
    progressedDate: progressedDate(birthDate, ageYears),
  };

  if (method === SOLAR_ARC_METHODS.MEAN) {
    result.arc = meanSolarArc(ageYears);
    return result;
  }

  const natalSunLon = options.natalSunLon;
  const progressedSunLon = options.progressedSunLon;

  if (natalSunLon != null && progressedSunLon != null) {
    assertFiniteNumber("natalSunLon", natalSunLon);
    assertFiniteNumber("progressedSunLon", progressedSunLon);
    result.natalSunLon = natalSunLon;
    result.progressedSunLon = progressedSunLon;
    result.arc = solarArcFromLongitudes(natalSunLon, progressedSunLon);
    return result;
  }

  const natalChart = options.natalChart ?? castChart(birthDate);
  const progressed = options.progressedChart ?? progressedChart(birthDate, ageYears);

  result.natalSunLon = natalChart.eclipticLongitudes.Sun;
  result.progressedSunLon = progressed.eclipticLongitudes.Sun;
  result.arc = solarArcFromLongitudes(result.natalSunLon, result.progressedSunLon);
  return result;
}

export function solarArcForChart(birthDate, ageYears, source, options = {}) {
  const arcInfo = solarArcAtAge(birthDate, ageYears, options);
  const natalLongitudes = extractLongitudes(source, "source");
  return {
    ...arcInfo,
    natalLongitudes,
    directedLongitudes: directSolarArcRecord(natalLongitudes, arcInfo.arc),
  };
}
