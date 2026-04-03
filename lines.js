import { castChart, norm360, toDeg, toRad } from "./chartCaster.js";

function assertLineOption(condition, message) {
  if (!condition) throw new TypeError(message);
}

export function computeLinesFromChart(chart, options = {}) {
  const {
    minLatitude = -89,
    maxLatitude = 89,
    stepDegrees = 0.5,
  } = options;

  assertLineOption(Number.isFinite(minLatitude) && minLatitude >= -90 && minLatitude <= 90, "minLatitude must be in [-90, 90]");
  assertLineOption(Number.isFinite(maxLatitude) && maxLatitude >= -90 && maxLatitude <= 90, "maxLatitude must be in [-90, 90]");
  assertLineOption(minLatitude <= maxLatitude, "minLatitude must be <= maxLatitude");
  assertLineOption(Number.isFinite(stepDegrees) && stepDegrees > 0, "stepDegrees must be > 0");

  const { positions, eclipticLongitudes, gmst } = chart;
  const lines = [];

  for (const [name, { ra, dec }] of Object.entries(positions)) {
    const mcN = norm360(toDeg(ra - gmst));
    const mc = mcN > 180 ? mcN - 360 : mcN;
    const icN = norm360(mcN + 180);
    const ic = icN > 180 ? icN - 360 : icN;
    lines.push({ planet: name, angle: "MC", type: "vertical", longitude: mc });
    lines.push({ planet: name, angle: "IC", type: "vertical", longitude: ic });

    const asPoints = [];
    const dsPoints = [];
    for (let lat = minLatitude; lat <= maxLatitude; lat += stepDegrees) {
      const cosH = -Math.tan(dec) * Math.tan(toRad(lat));
      if (Math.abs(cosH) > 1) continue;
      const H = Math.acos(cosH);
      const asN = norm360(toDeg(ra + H - gmst));
      asPoints.push([asN > 180 ? asN - 360 : asN, lat]);
      const dsN = norm360(toDeg(ra - H - gmst));
      dsPoints.push([dsN > 180 ? dsN - 360 : dsN, lat]);
    }

    if (asPoints.length > 1) lines.push({ planet: name, angle: "AS", type: "curve", points: asPoints });
    if (dsPoints.length > 1) lines.push({ planet: name, angle: "DS", type: "curve", points: dsPoints });
  }

  return { lines, eclipticLongitudes };
}

export function computeLines(datetime, options = {}) {
  const chart = castChart(datetime);
  return { chart, ...computeLinesFromChart(chart, options) };
}

export function summarizeLines(lines) {
  return lines.map(line => {
    if (line.type === "vertical") return line;
    return {
      planet: line.planet,
      angle: line.angle,
      type: line.type,
      pointCount: line.points.length,
      latRange: [line.points[0][1], line.points[line.points.length - 1][1]],
    };
  });
}
