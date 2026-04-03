import { DateTime, IANAZone } from "luxon";
import tzLookup from "tz-lookup";

const REQUIRED_PLANETS = [
  "Sun", "Moon", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
];
const REQUIRED_PLANET_SET = new Set(REQUIRED_PLANETS);

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];
const ASPECT_TYPES = new Set(["conjunction", "sextile", "square", "trine", "opposition"]);
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME_WITH_TZ_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

export const BIRTH_TIME_CONFIDENCE = ["exact", "approximate", "unknown"];

export const DEFAULT_PROFILE = {
  id: "sample-london-2001-01-15",
  birth: {
    date: "2001-01-15",
    time: "12:00",
    timezone: "Europe/London",
    lat: 51.5074,
    lon: -0.1278,
    confidence: "approximate",
    datetime: "2001-01-15T12:00:00Z",
    placeName: "London",
  },
  natal: {
    planets: {
      Sun: { sign: "Aries", degree: 12.4, house: 1, retrograde: false },
      Moon: { sign: "Cancer", degree: 8.9, house: 4, retrograde: false },
      Mercury: { sign: "Pisces", degree: 27.1, house: 12, retrograde: true },
      Venus: { sign: "Taurus", degree: 18.2, house: 2, retrograde: false },
      Mars: { sign: "Capricorn", degree: 9.6, house: 10, retrograde: false },
      Jupiter: { sign: "Leo", degree: 3.5, house: 5, retrograde: false },
      Saturn: { sign: "Aquarius", degree: 14.8, house: 11, retrograde: false },
      Uranus: { sign: "Capricorn", degree: 22.3, house: 10, retrograde: true },
      Neptune: { sign: "Capricorn", degree: 15.4, house: 10, retrograde: true },
      Pluto: { sign: "Scorpio", degree: 19.7, house: 8, retrograde: false },
    },
    aspects: [
      { p1: "Sun", p2: "Moon", type: "square", orb: 3.5 },
      { p1: "Sun", p2: "Jupiter", type: "trine", orb: 1.2 },
      { p1: "Sun", p2: "Mars", type: "square", orb: 2.8 },
      { p1: "Moon", p2: "Venus", type: "sextile", orb: 1.6 },
      { p1: "Mercury", p2: "Uranus", type: "sextile", orb: 4.9 },
      { p1: "Venus", p2: "Mars", type: "trine", orb: 0.9 },
      { p1: "Mars", p2: "Saturn", type: "conjunction", orb: 5.2 },
      { p1: "Jupiter", p2: "Saturn", type: "opposition", orb: 1.1 },
      { p1: "Saturn", p2: "Pluto", type: "square", orb: 4.9 },
      { p1: "Neptune", p2: "Pluto", type: "sextile", orb: 4.0 },
    ],
    dayChart: true,
  },
};

export const DEFAULT_CITY_SETS = {
  cli: [
    { name: "Tokyo", lat: 35.68, lon: 139.69 },
    { name: "Osaka", lat: 34.69, lon: 135.50 },
    { name: "Seoul", lat: 37.57, lon: 126.98 },
    { name: "London", lat: 51.51, lon: -0.13 },
    { name: "Paris", lat: 48.86, lon: 2.35 },
    { name: "Berlin", lat: 52.52, lon: 13.41 },
    { name: "Lisbon", lat: 38.72, lon: -9.14 },
    { name: "Barcelona", lat: 41.39, lon: 2.17 },
    { name: "Istanbul", lat: 41.01, lon: 28.98 },
    { name: "Tbilisi", lat: 41.69, lon: 44.83 },
    { name: "Dubai", lat: 25.20, lon: 55.27 },
    { name: "New York", lat: 40.71, lon: -74.01 },
    { name: "San Francisco", lat: 37.77, lon: -122.42 },
    { name: "Los Angeles", lat: 34.05, lon: -118.24 },
    { name: "Chicago", lat: 41.88, lon: -87.63 },
    { name: "Austin", lat: 30.27, lon: -97.74 },
    { name: "Mexico City", lat: 19.43, lon: -99.13 },
    { name: "Buenos Aires", lat: -34.60, lon: -58.38 },
    { name: "Sao Paulo", lat: -23.55, lon: -46.63 },
    { name: "Sydney", lat: -33.87, lon: 151.21 },
    { name: "Melbourne", lat: -37.81, lon: 144.96 },
    { name: "Bangkok", lat: 13.76, lon: 100.50 },
    { name: "Singapore", lat: 1.35, lon: 103.82 },
    { name: "Mumbai", lat: 19.08, lon: 72.88 },
    { name: "Miami", lat: 25.76, lon: -80.19 },
    { name: "Denver", lat: 39.74, lon: -104.98 },
    { name: "Seattle", lat: 47.61, lon: -122.33 },
    { name: "Honolulu", lat: 21.31, lon: -157.86 },
    { name: "Novosibirsk", lat: 55.03, lon: 82.92 },
    { name: "Almaty", lat: 43.24, lon: 76.95 },
    { name: "Antalya", lat: 36.90, lon: 30.70 },
    { name: "Cairo", lat: 30.04, lon: 31.24 },
    { name: "Rome", lat: 41.90, lon: 12.50 },
    { name: "Amsterdam", lat: 52.37, lon: 4.90 },
    { name: "Vienna", lat: 48.21, lon: 16.37 },
    { name: "Prague", lat: 50.08, lon: 14.44 },
    { name: "Zurich", lat: 47.38, lon: 8.54 },
    { name: "Stockholm", lat: 59.33, lon: 18.07 },
    { name: "Helsinki", lat: 60.17, lon: 24.94 },
    { name: "Athens", lat: 37.98, lon: 23.73 },
    { name: "Taipei", lat: 25.03, lon: 121.57 },
    { name: "Hong Kong", lat: 22.32, lon: 114.17 },
    { name: "Shanghai", lat: 31.23, lon: 121.47 },
    { name: "Beijing", lat: 39.90, lon: 116.40 },
    { name: "Hanoi", lat: 21.03, lon: 105.85 },
    { name: "Ho Chi Minh", lat: 10.82, lon: 106.63 },
    { name: "Jakarta", lat: -6.21, lon: 106.85 },
    { name: "Kuala Lumpur", lat: 3.14, lon: 101.69 },
    { name: "Cape Town", lat: -33.93, lon: 18.42 },
    { name: "Nairobi", lat: -1.29, lon: 36.82 },
  ],
};

function assert(condition, message, ErrorType = TypeError) {
  if (!condition) throw new ErrorType(message);
}

export function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function parseIsoDate(value, label, { allowDateOnly = false } = {}) {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty ISO datetime string`);
  const text = value.trim();
  const isDateOnly = ISO_DATE_RE.test(text);
  const isDateTimeWithTimezone = ISO_DATETIME_WITH_TZ_RE.test(text);

  assert(
    isDateTimeWithTimezone || (allowDateOnly && isDateOnly),
    allowDateOnly
      ? `${label} must be an ISO date or datetime string with an explicit timezone offset`
      : `${label} must be an ISO datetime string with an explicit timezone offset`
  );

  const date = new Date(text);
  assert(!Number.isNaN(date.getTime()), `${label} must be a valid ISO date or datetime string`);
  return date;
}

export function validateBirthTimeConfidence(value, label = "birth.confidence") {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string`);
  const normalized = value.trim().toLowerCase();
  assert(BIRTH_TIME_CONFIDENCE.includes(normalized), `${label} must be one of: ${BIRTH_TIME_CONFIDENCE.join(", ")}`);
  return normalized;
}

export function resolveTimezone(input, label = "birth") {
  const hasLat = input.lat != null;
  const hasLon = input.lon != null;
  assert(hasLat === hasLon, `${label}.lat and ${label}.lon must be provided together`);

  if (input.timezone != null) {
    assert(typeof input.timezone === "string" && input.timezone.trim().length > 0, `${label}.timezone must be a non-empty string`);
    assert(IANAZone.isValidZone(input.timezone), `${label}.timezone must be a valid IANA timezone`);
    if (isFiniteNumber(input.lat) && isFiniteNumber(input.lon)) {
      const lookedUpTimezone = tzLookup(input.lat, input.lon);
      assert(
        input.allowTimezoneOverride === true || input.timezone === lookedUpTimezone,
        `${label}.timezone does not match coordinates; pass allowTimezoneOverride=true to force it`
      );
    }
    return input.timezone;
  }

  assert(isFiniteNumber(input.lat), `${label}.lat must be a finite number when timezone is not provided`);
  assert(isFiniteNumber(input.lon), `${label}.lon must be a finite number when timezone is not provided`);
  return tzLookup(input.lat, input.lon);
}

export function resolveLocalMoment(input, label = "birth") {
  assert(isPlainObject(input), `${label} must be an object`);
  const dateText = input.date ?? input.localDate;
  const timeText = input.time ?? input.localTime;
  assert(typeof dateText === "string" && dateText.trim().length > 0, `${label}.date must be a non-empty ISO date string`);
  assert(typeof timeText === "string" && timeText.trim().length > 0, `${label}.time must be a non-empty local time string`);

  const timezone = resolveTimezone(input, label);
  const localMoment = DateTime.fromISO(`${dateText}T${timeText}`, { zone: timezone });
  assert(localMoment.isValid, `${label} could not be resolved: ${localMoment.invalidExplanation || localMoment.invalidReason}`);

  return {
    date: localMoment.toUTC().toJSDate(),
    timezone,
    confidence: validateBirthTimeConfidence(input.confidence ?? "exact", `${label}.confidence`),
  };
}

export function resolveDateInput(opts, {
  isoKey = "datetime",
  localKey = "birth",
  fallbackIso = DEFAULT_PROFILE.birth.datetime,
} = {}) {
  if (opts?.[isoKey] != null) return parseIsoDate(opts[isoKey], isoKey);
  if (opts?.[localKey] != null) return resolveLocalMoment(opts[localKey], localKey).date;
  return new Date(fallbackIso);
}

export function getDefaultCitySet(name = "cli") {
  const cities = DEFAULT_CITY_SETS[name];
  assert(Array.isArray(cities), `Unknown city set: ${name}`);
  return cities;
}

export function validateCityList(cities, label = "cities") {
  if (cities == null) return getDefaultCitySet("cli");
  assert(Array.isArray(cities), `${label} must be an array`);
  for (const [index, city] of cities.entries()) {
    assert(isPlainObject(city), `${label}[${index}] must be an object`);
    assert(typeof city.name === "string" && city.name.trim().length > 0, `${label}[${index}].name must be a non-empty string`);
    assert(isFiniteNumber(city.lat) && city.lat >= -90 && city.lat <= 90, `${label}[${index}].lat must be in [-90, 90]`);
    assert(isFiniteNumber(city.lon) && city.lon >= -180 && city.lon <= 180, `${label}[${index}].lon must be in [-180, 180]`);
  }
  return cities;
}

export function validateNatalData(natal, label = "natal") {
  if (natal == null) return DEFAULT_PROFILE.natal;

  assert(isPlainObject(natal), `${label} must be an object`);
  assert(isPlainObject(natal.planets), `${label}.planets must be an object`);
  assert(Array.isArray(natal.aspects), `${label}.aspects must be an array`);
  assert(typeof natal.dayChart === "boolean", `${label}.dayChart must be a boolean`);

  for (const planet of REQUIRED_PLANETS) {
    const placement = natal.planets[planet];
    assert(isPlainObject(placement), `${label}.planets.${planet} must be an object`);
    assert(SIGNS.includes(placement.sign), `${label}.planets.${planet}.sign must be a valid zodiac sign`);
    assert(isFiniteNumber(placement.degree) && placement.degree >= 0 && placement.degree < 30,
      `${label}.planets.${planet}.degree must be in [0, 30)`);
    assert(Number.isInteger(placement.house) && placement.house >= 1 && placement.house <= 12,
      `${label}.planets.${planet}.house must be an integer in [1, 12]`);
    assert(typeof placement.retrograde === "boolean", `${label}.planets.${planet}.retrograde must be a boolean`);
  }

  for (const [index, aspect] of natal.aspects.entries()) {
    assert(isPlainObject(aspect), `${label}.aspects[${index}] must be an object`);
    assert(typeof aspect.p1 === "string" && REQUIRED_PLANET_SET.has(aspect.p1), `${label}.aspects[${index}].p1 must be a supported planet`);
    assert(typeof aspect.p2 === "string" && REQUIRED_PLANET_SET.has(aspect.p2), `${label}.aspects[${index}].p2 must be a supported planet`);
    assert(typeof aspect.type === "string" && ASPECT_TYPES.has(aspect.type), `${label}.aspects[${index}].type must be a supported aspect`);
    assert(isFiniteNumber(aspect.orb) && aspect.orb >= 0, `${label}.aspects[${index}].orb must be a non-negative number`);
  }

  return natal;
}
