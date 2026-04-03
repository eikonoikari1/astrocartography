#!/usr/bin/env node
/**
 * astro.mjs — CLI for the astrocartography engine
 *
 * Usage:  node astro.mjs <command> [options as JSON]
 *
 * Commands:
 *   chart          Cast a chart for a datetime
 *   chart-svg      Render a natal-style SVG wheel for a datetime/location
 *   lines          Compute astrocartography lines for a datetime
 *   score          Score a location against natal data
 *   score-cities   Score multiple cities against natal data
 *   natal-strength Compute planet strengths from natal data
 *   transits       Find transits to natal positions in a date range
 *   transits-to-angles  Find transits to natal angles in a date range
 *   horary         Cast a horary chart
 *   progressions   Compute secondary progressions
 *   solar-arc      Compute solar arc directions
 *   solar-return   Compute a solar return chart
 *   profections    Compute annual profections
 *   zodiacal-releasing  Compute ZR periods from Lot of Fortune
 *   rectify        Search candidate birth times from dated events
 *   houses         Compute house cusps for a location/time
 *
 * All output is JSON to stdout. Pass options as a JSON string argument.
 */

import { castChart, toDeg } from "./chartCaster.js";
import { buildAstrologyChart2Data } from "./astrologyChart2Adapter.js";
import { writeAstrologyChart2SvgFile } from "./chartSvgRenderer.js";
import { CATEGORY_META, computePlanetStrength, resolveCategoryKey, scoreWithNatalContext } from "./natalScoring.js";
import { computeHouses } from "./houses.js";
import { analyzeHorary } from "./horary.js";
import { searchAngleTransits, searchTransits, searchMajorTransits } from "./transits.js";
import { progressedAgeForEvent, progressedAnglesAtAge, progressionTimeline } from "./progressions.js";
import { SIGN_RULER, profectionAtAge, profectionAtDate, profectionTimeline, signFromLongitude } from "./profections.js";
import { rectifyBirthTime } from "./rectification/index.js";
import { solarReturnChart } from "./solarReturn.js";
import { NAIBOD_DEGREES_PER_YEAR, SOLAR_ARC_METHODS, directSolarArcRecord, solarArcAtAge } from "./solarArc.js";
import { lotOfFortune, lotOfSpirit, isDayChart as zrIsDayChart, generatePeriods, lonToSign } from "./zodiacalReleasing.js";
import { computeLines, summarizeLines } from "./lines.js";
import {
  DEFAULT_PROFILE,
  isFiniteNumber,
  isPlainObject,
  parseIsoDate,
  resolveDateInput,
  validateCityList,
  validateNatalData,
} from "./profile.js";

const cmd = process.argv[2];
const rawOpts = process.argv[3];
const ANGLE_KEYS = ["ASC", "MC", "DSC", "IC"];

function parseOpts() {
  if (!rawOpts) return {};
  try {
    const parsed = JSON.parse(rawOpts);
    if (!isPlainObject(parsed)) die("Options JSON must be an object");
    return parsed;
  }
  catch { die(`Invalid JSON options: ${rawOpts}`); }
}

function die(msg) {
  console.error(JSON.stringify({ error: msg }));
  process.exit(1);
}

function out(data) {
  console.log(JSON.stringify(data, null, 2));
}

function requireFiniteNumber(name, value, { min, max, integer = false } = {}) {
  if (!isFiniteNumber(value)) die(`${name} must be a finite number`);
  if (integer && !Number.isInteger(value)) die(`${name} must be an integer`);
  if (min != null && value < min) die(`${name} must be >= ${min}`);
  if (max != null && value > max) die(`${name} must be <= ${max}`);
  return value;
}

function validateLatitude(name, value) {
  return requireFiniteNumber(name, value, { min: -90, max: 90 });
}

function validateLongitude(name, value) {
  return requireFiniteNumber(name, value, { min: -180, max: 180 });
}

function validateBoolean(name, value) {
  if (value == null) return undefined;
  if (typeof value !== "boolean") die(`${name} must be a boolean`);
  return value;
}

function validateLongitudesRecord(name, value) {
  if (!isPlainObject(value)) die(`${name} must be an object`);
  for (const [key, number] of Object.entries(value)) {
    if (!isFiniteNumber(number)) die(`${name}.${key} must be a finite number`);
  }
  return value;
}

function validateAngleKeys(value) {
  if (value == null) return ANGLE_KEYS;
  if (!Array.isArray(value) || value.length === 0) die("angles must be a non-empty array");
  const normalized = value.map(angle => {
    if (typeof angle !== "string") die("angles must contain strings");
    const key = angle.trim().toUpperCase();
    if (!ANGLE_KEYS.includes(key)) die(`angles must be one of: ${ANGLE_KEYS.join(", ")}`);
    return key;
  });
  return [...new Set(normalized)];
}

function parseSecondOfDay(value, label) {
  if (typeof value !== "string" || !/^\d{2}:\d{2}(?::\d{2})?$/.test(value)) {
    die(`${label} must be in HH:MM or HH:MM:SS format`);
  }
  const [hourText, minuteText, secondText = "00"] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) die(`${label} hour must be between 00 and 23`);
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) die(`${label} minute must be between 00 and 59`);
  if (!Number.isInteger(second) || second < 0 || second > 59) die(`${label} second must be between 00 and 59`);
  return hour * 3600 + minute * 60 + second;
}

function buildAngleTargets(datetime, lat, lon, requestedAngles = ANGLE_KEYS) {
  const chart = castChart(datetime);
  const houses = computeHouses(chart.gmst, chart.obliquity, lat, lon);
  const allTargets = {
    ASC: houses.asc,
    MC: houses.mc,
    DSC: houses.dsc,
    IC: houses.ic,
  };
  const angleTargets = Object.fromEntries(requestedAngles.map(key => [key, allTargets[key]]));
  return { chart, houses, angleTargets };
}

function buildPlanetStrengths(natal) {
  const strengths = {};
  for (const planet of Object.keys(natal.planets)) {
    strengths[planet] = computePlanetStrength(planet, natal);
  }
  return strengths;
}

function cleanPlanetStrengths(planetStrengths) {
  const cleaned = {};
  for (const [planet, strength] of Object.entries(planetStrengths)) {
    cleaned[planet] = {
      intensity: strength.intensity,
      harmony: strength.harmony,
      growth: strength.growth,
    };
  }
  return cleaned;
}

function resolveScoreCategory(value) {
  if (value == null) return "Love & Romance";
  const category = resolveCategoryKey(value);
  if (!category) {
    die(
      `category must be one of: ${CATEGORY_META.map(meta => `"${meta.key}" or "${meta.label}"`).join(", ")}`
    );
  }
  return category;
}

// ── Commands ────────────────────────────────────────────────────────────────

async function main() {
  if (!cmd) die("Usage: node astro.mjs <command> [options-json]\nCommands: chart, chart-svg, lines, score, score-cities, natal-strength, transits, transits-to-angles, horary, progressions, solar-arc, solar-return, profections, zodiacal-releasing, rectify, houses");

  const opts = parseOpts();

  switch (cmd) {
    case "chart": {
      const dt = resolveDateInput(opts, { isoKey: "datetime", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const chart = castChart(dt);
      // Convert positions to degrees for readability
      const positions = {};
      for (const [name, { ra, dec }] of Object.entries(chart.positions)) {
        positions[name] = { ra_deg: toDeg(ra), dec_deg: toDeg(dec) };
      }
      out({
        datetime: dt.toISOString(),
        positions,
        eclipticLongitudes: chart.eclipticLongitudes,
        gmst_deg: toDeg(chart.gmst),
        obliquity_deg: toDeg(chart.obliquity),
      });
      break;
    }

    case "chart-svg": {
      const dt = resolveDateInput(opts, { isoKey: "datetime", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const lat = validateLatitude("lat", opts.lat ?? DEFAULT_PROFILE.birth.lat);
      const lon = validateLongitude("lon", opts.lon ?? DEFAULT_PROFILE.birth.lon);
      if (opts.outputPath != null && (typeof opts.outputPath !== "string" || opts.outputPath.trim().length === 0)) {
        die("outputPath must be a non-empty string");
      }

      const natal = opts.natal ? validateNatalData(opts.natal) : DEFAULT_PROFILE.natal;
      const wheel = buildAstrologyChart2Data(dt, lat, lon);
      const file = await writeAstrologyChart2SvgFile(wheel.data, {
        aspects: natal.aspects,
        datetime: dt,
        outputPath: opts.outputPath?.trim(),
      });

      out({
        datetime: dt.toISOString(),
        lat,
        lon,
        outputPath: file.outputPath,
        svgBytes: file.bytes,
        houses: {
          system: wheel.houses.system,
          asc: wheel.houses.asc,
          mc: wheel.houses.mc,
        },
        pointCount: wheel.data.points.length,
      });
      break;
    }

    case "lines": {
      const dt = resolveDateInput(opts, { isoKey: "datetime", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const { lines, eclipticLongitudes } = computeLines(dt);
      const summary = summarizeLines(lines);
      out({ datetime: dt.toISOString(), eclipticLongitudes, lines: summary, lineCount: lines.length });
      break;
    }

    case "score": {
      const dt = resolveDateInput(opts, { isoKey: "datetime", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const lat = validateLatitude("lat", opts.lat);
      const lon = validateLongitude("lon", opts.lon);
      const natal = validateNatalData(opts.natal);
      const { lines } = computeLines(dt);
      const planetStrengths = buildPlanetStrengths(natal);
      const result = scoreWithNatalContext(lat, lon, lines, natal, planetStrengths);
      out({ lat, lon, natalScores: result.scores, dominantLines: result.dominantLines, planetStrengths: cleanPlanetStrengths(planetStrengths) });
      break;
    }

    case "score-cities": {
      const dt = resolveDateInput(opts, { isoKey: "datetime", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const natal = validateNatalData(opts.natal);
      const cities = validateCityList(opts.cities);
      const category = resolveScoreCategory(opts.category);
      const { lines } = computeLines(dt);
      const planetStrengths = buildPlanetStrengths(natal);
      const results = cities.map(c => {
        const s = scoreWithNatalContext(c.lat, c.lon, lines, natal, planetStrengths);
        return { name: c.name, lat: c.lat, lon: c.lon, natalScores: s.scores, dominantLines: s.dominantLines };
      });
      results.sort((a, b) => (b.natalScores[category]?.blended || 0) - (a.natalScores[category]?.blended || 0));
      out({ category, cities: results });
      break;
    }

    case "natal-strength": {
      const natal = validateNatalData(opts.natal);
      out(cleanPlanetStrengths(buildPlanetStrengths(natal)));
      break;
    }

    case "transits": {
      const natalLons = validateLongitudesRecord("natalLongitudes", opts.natalLongitudes);
      const start = opts.start ? parseIsoDate(opts.start, "start", { allowDateOnly: true }) : new Date();
      const end = opts.end ? parseIsoDate(opts.end, "end", { allowDateOnly: true }) : new Date(Date.now() + 90 * 86400000);
      if (end < start) die("end must be after start");
      const majorOnly = opts.majorOnly ?? true;
      validateBoolean("majorOnly", opts.majorOnly);
      const results = majorOnly
        ? searchMajorTransits(natalLons, start, end, opts)
        : searchTransits(natalLons, start, end, opts);
      out({ start: start.toISOString(), end: end.toISOString(), majorOnly, transits: results });
      break;
    }

    case "transits-to-angles": {
      const birthDate = resolveDateInput(opts, { isoKey: "birthDate", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const lat = validateLatitude("lat", opts.lat ?? DEFAULT_PROFILE.birth.lat);
      const lon = validateLongitude("lon", opts.lon ?? DEFAULT_PROFILE.birth.lon);
      const start = opts.start ? parseIsoDate(opts.start, "start", { allowDateOnly: true }) : new Date();
      const end = opts.end ? parseIsoDate(opts.end, "end", { allowDateOnly: true }) : new Date(Date.now() + 90 * 86400000);
      if (end < start) die("end must be after start");
      const majorOnly = opts.majorOnly ?? true;
      validateBoolean("majorOnly", opts.majorOnly);
      const requestedAngles = validateAngleKeys(opts.angles);
      const { angleTargets } = buildAngleTargets(birthDate, lat, lon, requestedAngles);
      const transitOptions = majorOnly
        ? { ...opts, transitPlanets: ["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"] }
        : opts;
      const results = searchAngleTransits(angleTargets, start, end, transitOptions);
      out({
        birthDate: birthDate.toISOString(),
        lat,
        lon,
        start: start.toISOString(),
        end: end.toISOString(),
        majorOnly,
        angleTargets,
        transits: results,
      });
      break;
    }

    case "horary": {
      const dt = resolveDateInput(opts, { isoKey: "datetime", fallbackIso: new Date().toISOString(), localKey: "moment" });
      const lat = validateLatitude("lat", opts.lat ?? 35.68);
      const lon = validateLongitude("lon", opts.lon ?? 139.69);
      const querentHouse = requireFiniteNumber("querentHouse", opts.querentHouse ?? 1, { integer: true, min: 1, max: 12 });
      const quesitedHouse = requireFiniteNumber("quesitedHouse", opts.quesitedHouse ?? 7, { integer: true, min: 1, max: 12 });
      const result = analyzeHorary(dt, lat, lon, { querentHouse, quesitedHouse });
      out(result);
      break;
    }

    case "progressions": {
      const birthDate = resolveDateInput(opts, { isoKey: "birthDate", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const startAge = requireFiniteNumber("startAge", opts.startAge ?? 20, { min: 0 });
      const endAge = requireFiniteNumber("endAge", opts.endAge ?? 30, { min: startAge });
      const includeAngles = opts.includeAngles ?? (opts.lat != null || opts.lon != null);
      validateBoolean("includeAngles", opts.includeAngles);
      const angleMethod = String(opts.angleMethod ?? "dateCast");
      if (!["dateCast", "solarArcMC"].includes(angleMethod)) die('angleMethod must be "dateCast" or "solarArcMC"');
      const results = progressionTimeline(birthDate, startAge, endAge, opts.stepYears ?? 1);
      // Convert positions to degrees
      let natalAngles;
      let progressionLat;
      let progressionLon;
      if (includeAngles) {
        progressionLat = validateLatitude("lat", opts.lat ?? DEFAULT_PROFILE.birth.lat);
        progressionLon = validateLongitude("lon", opts.lon ?? DEFAULT_PROFILE.birth.lon);
        natalAngles = buildAngleTargets(birthDate, progressionLat, progressionLon).angleTargets;
      }
      const cleaned = results.map(r => {
        const lons = {};
        for (const [name, lon] of Object.entries(r.eclipticLongitudes)) {
          lons[name] = lon;
        }
        const entry = { age: r.age, date: r.date.toISOString(), eclipticLongitudes: lons };
        if (includeAngles) {
          if (angleMethod === "dateCast") {
            const withAngles = progressedAnglesAtAge(birthDate, r.age, progressionLat, progressionLon);
            entry.houses = {
              cusps: withAngles.houses.cusps,
              asc: withAngles.houses.asc,
              mc: withAngles.houses.mc,
              dsc: withAngles.houses.dsc,
              ic: withAngles.houses.ic,
              system: withAngles.houses.system,
            };
            entry.angleMethod = angleMethod;
          } else {
            const arcInfo = solarArcAtAge(birthDate, r.age, { method: SOLAR_ARC_METHODS.TRUE });
            entry.houses = {
              asc: (natalAngles.ASC + arcInfo.arc) % 360,
              mc: (natalAngles.MC + arcInfo.arc) % 360,
              dsc: (natalAngles.DSC + arcInfo.arc) % 360,
              ic: (natalAngles.IC + arcInfo.arc) % 360,
              system: "solarArcMC-approximation",
            };
            entry.angleMethod = angleMethod;
            entry.solarArcDegrees = arcInfo.arc;
          }
        }
        return entry;
      });
      out(cleaned);
      break;
    }

    case "solar-arc": {
      const birthDate = resolveDateInput(opts, { isoKey: "birthDate", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const eventDate = opts.eventDate ? parseIsoDate(opts.eventDate, "eventDate", { allowDateOnly: true }) : null;
      const ageYears = opts.ageYears != null
        ? requireFiniteNumber("ageYears", opts.ageYears, { min: 0 })
        : (eventDate ? progressedAgeForEvent(birthDate, eventDate) : null);
      if (ageYears == null) die("Provide ageYears or eventDate");
      const method = String(opts.method ?? SOLAR_ARC_METHODS.TRUE);
      const natalChart = castChart(birthDate);
      const arcInfo = solarArcAtAge(birthDate, ageYears, { method, natalChart });
      const sourceLongitudes = opts.longitudes ? validateLongitudesRecord("longitudes", opts.longitudes) : natalChart.eclipticLongitudes;
      const directedLongitudes = directSolarArcRecord(sourceLongitudes, arcInfo.arc);
      const result = {
        method: arcInfo.method,
        ageYears,
        eventDate: eventDate?.toISOString(),
        progressedDate: arcInfo.progressedDate.toISOString(),
        arcDegrees: arcInfo.arc,
        natalSunLon: arcInfo.natalSunLon,
        progressedSunLon: arcInfo.progressedSunLon,
        naibodDegreesPerYear: NAIBOD_DEGREES_PER_YEAR,
        directedLongitudes,
      };
      if (opts.lat != null || opts.lon != null) {
        const lat = validateLatitude("lat", opts.lat ?? DEFAULT_PROFILE.birth.lat);
        const lon = validateLongitude("lon", opts.lon ?? DEFAULT_PROFILE.birth.lon);
        const angleTargets = buildAngleTargets(birthDate, lat, lon).angleTargets;
        result.directedAngles = directSolarArcRecord(angleTargets, arcInfo.arc);
        result.angleMode = "ecliptic-approximation";
      }
      out(result);
      break;
    }

    case "solar-return": {
      const birthDate = resolveDateInput(opts, { isoKey: "birthDate", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const natalSunLon = requireFiniteNumber("natalSunLon", opts.natalSunLon ?? 185.23);
      const year = requireFiniteNumber("year", opts.year ?? new Date().getFullYear(), { integer: true, min: 1 });
      const lat = validateLatitude("lat", opts.lat ?? 35.68);
      const lon = validateLongitude("lon", opts.lon ?? 139.69);
      const searchWindowDays = requireFiniteNumber("searchWindowDays", opts.searchWindowDays ?? 10, { integer: true, min: 1, max: 30 });
      const returnLocationPolicy = String(opts.returnLocationPolicy ?? "specified");
      const result = solarReturnChart(natalSunLon, year, birthDate, lat, lon, { searchWindowDays, returnLocationPolicy });
      out({
        year,
        returnDate: result.returnDate.toISOString(),
        natalSunLon: result.natalSunLon,
        returnSunLon: result.returnSunLon,
        returnLocationPolicy: result.returnLocationPolicy,
        searchWindowDays,
        eclipticLongitudes: result.chart.eclipticLongitudes,
        houses: { cusps: result.houses.cusps, mc: result.houses.mc, asc: result.houses.asc, system: result.houses.system },
      });
      break;
    }

    case "profections": {
      const birthDate = resolveDateInput(opts, { isoKey: "birthDate", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      let ascLon = opts.ascLon;
      if (ascLon == null) {
        const lat = validateLatitude("lat", opts.lat ?? DEFAULT_PROFILE.birth.lat);
        const lon = validateLongitude("lon", opts.lon ?? DEFAULT_PROFILE.birth.lon);
        ascLon = buildAngleTargets(birthDate, lat, lon).angleTargets.ASC;
      } else {
        ascLon = requireFiniteNumber("ascLon", ascLon);
      }
      const ascSign = signFromLongitude(ascLon);
      if (opts.startAge != null || opts.endAge != null) {
        const startAge = requireFiniteNumber("startAge", opts.startAge ?? 0, { integer: true, min: 0 });
        const endAge = requireFiniteNumber("endAge", opts.endAge ?? startAge, { integer: true, min: startAge });
        const timeline = profectionTimeline(ascLon, birthDate, startAge, endAge).map(item => ({
          ...item,
          birthDate: item.birthDate.toISOString(),
          periodStartDate: item.periodStartDate.toISOString(),
          periodEndDate: item.periodEndDate.toISOString(),
        }));
        out({ ascLon, ascSign, rulership: SIGN_RULER, timeline });
        break;
      }
      if (opts.targetDate != null) {
        const targetDate = parseIsoDate(opts.targetDate, "targetDate", { allowDateOnly: true });
        const result = profectionAtDate(ascLon, birthDate, targetDate);
        out({
          ascLon,
          ascSign,
          ...result,
          birthDate: result.birthDate.toISOString(),
          targetDate: result.targetDate.toISOString(),
          periodStartDate: result.periodStartDate.toISOString(),
          periodEndDate: result.periodEndDate.toISOString(),
        });
        break;
      }
      const age = requireFiniteNumber("age", opts.age ?? 0, { integer: true, min: 0 });
      out({ ascLon, ascSign, ...profectionAtAge(ascLon, age) });
      break;
    }

    case "zodiacal-releasing": {
      const birthDate = resolveDateInput(opts, { isoKey: "birthDate", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const sunLon = requireFiniteNumber("sunLon", opts.sunLon ?? 185.23);
      const moonLon = requireFiniteNumber("moonLon", opts.moonLon ?? 81.50);
      const ascLon = requireFiniteNumber("ascLon", opts.ascLon ?? 300);
      const years = requireFiniteNumber("years", opts.years ?? 80, { integer: true, min: 1 });
      const maxLevel = requireFiniteNumber("maxLevel", opts.maxLevel ?? 2, { integer: true, min: 1, max: 4 });
      const lotType = String(opts.lotType ?? "fortune").toLowerCase();
      if (!["fortune", "spirit"].includes(lotType)) die('lotType must be "fortune" or "spirit"');
      const dayChart = opts.dayChart != null ? validateBoolean("dayChart", opts.dayChart) : zrIsDayChart(sunLon, ascLon);
      const lot = lotType === "spirit"
        ? lotOfSpirit(ascLon, sunLon, moonLon, dayChart)
        : lotOfFortune(ascLon, sunLon, moonLon, dayChart);
      const periods = generatePeriods(lot, birthDate, years, maxLevel).map(p => ({
        ...p,
        startDate: p.startDate instanceof Date ? p.startDate.toISOString() : p.startDate,
        endDate: p.endDate instanceof Date ? p.endDate.toISOString() : p.endDate,
      }));
      out({
        lotType,
        lotOfFortune: lot,
        lotLongitude: lot,
        lotSign: lonToSign(lot),
        isDayChart: dayChart,
        calendar: opts.calendar ?? "schematic360",
        periods,
      });
      break;
    }

    case "rectify": {
      const birthDate = typeof opts.birthDate === "string" ? opts.birthDate : DEFAULT_PROFILE.birth.date;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) die("birthDate must be an ISO local date string");
      const lat = validateLatitude("lat", opts.lat ?? DEFAULT_PROFILE.birth.lat);
      const lon = validateLongitude("lon", opts.lon ?? DEFAULT_PROFILE.birth.lon);
      if (!Array.isArray(opts.events) || opts.events.length === 0) die("events must be a non-empty array");
      const stepMinutes = requireFiniteNumber("stepMinutes", opts.stepMinutes ?? 10, { integer: true, min: 1, max: 120 });
      const stepSeconds = opts.stepSeconds == null
        ? stepMinutes * 60
        : requireFiniteNumber("stepSeconds", opts.stepSeconds, { integer: true, min: 1, max: 86400 });
      const topN = requireFiniteNumber("topN", opts.topN ?? 10, { integer: true, min: 1, max: 100 });
      const intervalFraction = opts.intervalFraction == null
        ? 0.9
        : requireFiniteNumber("intervalFraction", opts.intervalFraction, { min: 0, max: 1 });
      const timezone = opts.timezone ?? resolveTimezone({ lat, lon }, "rectification");
      const startSecond = opts.startTime != null
        ? parseSecondOfDay(opts.startTime, "startTime")
        : requireFiniteNumber("startSecond", opts.startSecond ?? ((opts.startMinute ?? 0) * 60), { integer: true, min: 0, max: 86399 });
      const endSecond = opts.endTime != null
        ? parseSecondOfDay(opts.endTime, "endTime")
        : requireFiniteNumber("endSecond", opts.endSecond ?? ((opts.endMinute ?? 1440) * 60), { integer: true, min: startSecond + 1, max: 86400 });
      const startMinute = Math.floor(startSecond / 60);
      const endMinute = Math.ceil(endSecond / 60);
      out(rectifyBirthTime({
        birthDate,
        lat,
        lon,
        timezone,
        events: opts.events,
        stepMinutes,
        stepSeconds,
        startMinute,
        endMinute,
        startSecond,
        endSecond,
        topN,
        intervalFraction,
        techniques: opts.techniques,
      }));
      break;
    }

    case "houses": {
      const dt = resolveDateInput(opts, { isoKey: "datetime", fallbackIso: DEFAULT_PROFILE.birth.datetime });
      const lat = validateLatitude("lat", opts.lat ?? 35.68);
      const lon = validateLongitude("lon", opts.lon ?? 139.69);
      const chart = castChart(dt);
      const houses = computeHouses(chart.gmst, chart.obliquity, lat, lon);
      out({ datetime: dt.toISOString(), lat, lon, ...houses });
      break;
    }

    default:
      die(`Unknown command: ${cmd}. Available: chart, chart-svg, lines, score, score-cities, natal-strength, transits, transits-to-angles, horary, progressions, solar-arc, solar-return, profections, zodiacal-releasing, rectify, houses`);
  }
}

main().catch(e => die(e.message));
