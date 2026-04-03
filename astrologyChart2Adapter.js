import { BODIES, castChart, getEclipticLongitude, norm360 } from "./chartCaster.js";
import { computeHouses } from "./houses.js";

const DEFAULT_RETROGRADE_STEP_HOURS = 6;
const MS_PER_HOUR = 3600000;

function assertAdapter(condition, message) {
  if (!condition) throw new TypeError(message);
}

function signedAngularDelta(fromDegrees, toDegrees) {
  const normalized = norm360(toDegrees - fromDegrees);
  return normalized > 180 ? normalized - 360 : normalized;
}

export function isBodyRetrograde(body, datetime, stepHours = DEFAULT_RETROGRADE_STEP_HOURS) {
  assertAdapter(BODIES.includes(body), `Unsupported astrology body: ${body}`);
  assertAdapter(datetime instanceof Date && !Number.isNaN(datetime.getTime()), "datetime must be a valid Date");
  assertAdapter(Number.isFinite(stepHours) && stepHours > 0, "stepHours must be a finite number > 0");

  const stepMs = stepHours * MS_PER_HOUR;
  const before = getEclipticLongitude(body, new Date(datetime.getTime() - stepMs));
  const after = getEclipticLongitude(body, new Date(datetime.getTime() + stepMs));
  return signedAngularDelta(before, after) < 0;
}

export function toAstrologyChart2Data(eclipticLongitudes, cusps, retrogradeByBody = {}) {
  assertAdapter(eclipticLongitudes && typeof eclipticLongitudes === "object", "eclipticLongitudes must be an object");
  assertAdapter(Array.isArray(cusps), "cusps must be an array");
  assertAdapter(cusps.length === 12, "cusps must contain 12 house cusp angles");

  const points = BODIES.map(body => {
    const angle = eclipticLongitudes[body];
    assertAdapter(Number.isFinite(angle), `eclipticLongitudes.${body} must be a finite number`);

    const point = { name: body, angle: norm360(angle) };
    if (retrogradeByBody[body] === true) point.isRetrograde = true;
    return point;
  });

  return {
    points,
    cusps: cusps.map((angle, index) => {
      assertAdapter(Number.isFinite(angle), `cusps[${index}] must be a finite number`);
      return { angle: norm360(angle) };
    }),
  };
}

export function buildAstrologyChart2Data(datetime, latitudeDeg, longitudeDeg, options = {}) {
  const {
    includeRetrograde = true,
    retrogradeStepHours = DEFAULT_RETROGRADE_STEP_HOURS,
  } = options;

  assertAdapter(datetime instanceof Date && !Number.isNaN(datetime.getTime()), "datetime must be a valid Date");
  assertAdapter(Number.isFinite(latitudeDeg), "latitudeDeg must be a finite number");
  assertAdapter(Number.isFinite(longitudeDeg), "longitudeDeg must be a finite number");

  const chart = castChart(datetime);
  const houses = computeHouses(chart.gmst, chart.obliquity, latitudeDeg, longitudeDeg);
  const retrogradeByBody = {};

  if (includeRetrograde) {
    for (const body of BODIES) {
      retrogradeByBody[body] = isBodyRetrograde(body, datetime, retrogradeStepHours);
    }
  }

  return {
    chart,
    houses,
    retrogradeByBody,
    data: toAstrologyChart2Data(chart.eclipticLongitudes, houses.cusps, retrogradeByBody),
  };
}
