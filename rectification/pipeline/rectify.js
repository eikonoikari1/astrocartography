import { castChart } from "../../chartCaster.js";
import { computeHouses } from "../../houses.js";
import { progressedAgeForEvent, progressedAnglesAtAge } from "../../progressions.js";
import { directSolarArcRecord, SOLAR_ARC_METHODS, solarArcAtAge } from "../../solarArc.js";
import { searchAngleTransits } from "../../transits.js";
import { resolveTimezone } from "../../profile.js";
import { buildCandidateGrid } from "../time/candidateGrid.js";
import { normalizeRectificationEvents } from "../data/evidenceModel.js";

const ANGLE_KEYS = ["ASC", "MC", "DSC", "IC"];
const ASPECTS = [
  { name: "conjunction", angle: 0 },
  { name: "sextile", angle: 60 },
  { name: "square", angle: 90 },
  { name: "trine", angle: 120 },
  { name: "opposition", angle: 180 },
];

function normalize360(value) {
  return ((value % 360) + 360) % 360;
}

function angleDistance(a, b) {
  return Math.abs(((a - b + 540) % 360) - 180);
}

function aspectDistance(a, b, aspectAngle) {
  const sep = angleDistance(a, b);
  return Math.abs(sep - aspectAngle);
}

function normalizeAngleKeys(angleKeys) {
  if (angleKeys == null) return ANGLE_KEYS;
  if (!Array.isArray(angleKeys) || angleKeys.length === 0) throw new TypeError("angleKeys must be a non-empty array");
  return [...new Set(angleKeys.map(key => {
    const normalized = String(key).trim().toUpperCase();
    if (!ANGLE_KEYS.includes(normalized)) throw new TypeError(`Unsupported angle key: ${key}`);
    return normalized;
  }))];
}

function normalizeAspectNames(aspectNames) {
  if (aspectNames == null) return ASPECTS;
  if (!Array.isArray(aspectNames) || aspectNames.length === 0) throw new TypeError("aspects must be a non-empty array");
  const active = ASPECTS.filter(item => aspectNames.includes(item.name));
  if (active.length === 0) throw new TypeError("No supported aspects requested");
  return active;
}

function angleRecordFromHouses(houses) {
  return {
    ASC: houses.asc,
    MC: houses.mc,
    DSC: houses.dsc,
    IC: houses.ic,
  };
}

function buildNatalCandidate(candidateUtcDate, lat, lon) {
  const chart = castChart(candidateUtcDate);
  const houses = computeHouses(chart.gmst, chart.obliquity, lat, lon);
  return {
    chart,
    houses,
    angles: angleRecordFromHouses(houses),
  };
}

function defaultTechniqueConfig(overrides = {}) {
  return {
    transit: {
      enabled: true,
      weight: 1,
      orbDegrees: 1,
      maxWindowDays: 14,
      transitPlanets: ["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"],
      aspects: ASPECTS.map(item => item.name),
      angleKeys: ANGLE_KEYS,
      ...overrides.transit,
    },
    progressions: {
      enabled: true,
      weight: 0.8,
      orbDegrees: 1.5,
      angleMethod: "dateCast",
      angleKeys: ANGLE_KEYS,
      targetPlanets: ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"],
      aspects: ASPECTS.map(item => item.name),
      ...overrides.progressions,
    },
    solarArc: {
      enabled: true,
      weight: 0.7,
      orbDegrees: 1.5,
      method: SOLAR_ARC_METHODS.TRUE,
      angleMode: "ecliptic-approximation",
      angleKeys: ANGLE_KEYS,
      targetPlanets: ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"],
      aspects: ASPECTS.map(item => item.name),
      ...overrides.solarArc,
    },
  };
}

function scoreMagnitude(distance, orbDegrees) {
  if (distance > orbDegrees) return 0;
  return 1 - (distance / orbDegrees);
}

function windowPrecisionFactor(event, maxWindowDays) {
  if (event.kind === "timestamp") return 1;
  if (event.kind === "date") return 0.8;
  if (event.durationDays > maxWindowDays) return 0;
  return Math.max(0.2, 1 - (event.durationDays / maxWindowDays) * 0.8);
}

function scoreTransitTechnique(candidateAngles, event, config) {
  if (!config.enabled) return { score: 0, trace: [] };

  const precisionFactor = windowPrecisionFactor(event, config.maxWindowDays);
  if (precisionFactor === 0) {
    return {
      score: 0,
      trace: [{
        technique: "transits-to-angles",
        eventId: event.id,
        eventLabel: event.label,
        skipped: true,
        reason: `event window exceeds ${config.maxWindowDays} days`,
      }],
    };
  }

  const angleTargets = Object.fromEntries(
    normalizeAngleKeys(config.angleKeys).map(key => [key, candidateAngles[key]])
  );
  const hits = searchAngleTransits(angleTargets, event.start, event.end, {
    orb: config.orbDegrees,
    transitPlanets: config.transitPlanets,
    aspects: config.aspects,
  });

  if (hits.length === 0) {
    return {
      score: 0,
      trace: [{
        technique: "transits-to-angles",
        eventId: event.id,
        eventLabel: event.label,
        hits: 0,
      }],
    };
  }

  const representativeMs = event.representativeDate.getTime();
  const scoredHits = hits.map(hit => {
    const timeDistanceDays = Math.abs(hit.exactDate.getTime() - representativeMs) / 86400000;
    const timeFactor = event.kind === "timestamp"
      ? Math.max(0, 1 - (timeDistanceDays / 3))
      : 1;
    const orbFactor = scoreMagnitude(hit.orb, config.orbDegrees);
    return {
      ...hit,
      hitScore: precisionFactor * timeFactor * orbFactor,
      timeDistanceDays,
    };
  }).sort((a, b) => b.hitScore - a.hitScore);

  const bestHit = scoredHits[0];
  return {
    score: bestHit.hitScore * config.weight,
    trace: [{
      technique: "transits-to-angles",
      eventId: event.id,
      eventLabel: event.label,
      score: bestHit.hitScore * config.weight,
      precisionFactor,
      selectedHit: {
        transitPlanet: bestHit.transitPlanet,
        targetPoint: bestHit.targetPoint,
        aspect: bestHit.aspect,
        exactDate: bestHit.exactDate.toISOString(),
        orb: bestHit.orb,
        timeDistanceDays: bestHit.timeDistanceDays,
      },
      competingHitCount: scoredHits.length,
    }],
  };
}

function scoreAngleContacts({ technique, event, directedAngles, natalLongitudes, config, extraTrace = {} }) {
  const aspectSet = normalizeAspectNames(config.aspects);
  const activeAngles = normalizeAngleKeys(config.angleKeys);

  let best = null;
  for (const angleKey of activeAngles) {
    for (const targetPlanet of config.targetPlanets) {
      for (const aspect of aspectSet) {
        const distance = aspectDistance(directedAngles[angleKey], natalLongitudes[targetPlanet], aspect.angle);
        const baseScore = scoreMagnitude(distance, config.orbDegrees);
        if (baseScore === 0) continue;
        const scored = {
          angleKey,
          targetPlanet,
          aspect: aspect.name,
          distance,
          score: baseScore * event.reliability * config.weight,
        };
        if (!best || scored.score > best.score) best = scored;
      }
    }
  }

  if (!best) {
    return {
      score: 0,
      trace: [{
        technique,
        eventId: event.id,
        eventLabel: event.label,
        hits: 0,
        ...extraTrace,
      }],
    };
  }

  return {
    score: best.score,
    trace: [{
      technique,
      eventId: event.id,
      eventLabel: event.label,
      score: best.score,
      contact: {
        angleKey: best.angleKey,
        targetPlanet: best.targetPlanet,
        aspect: best.aspect,
        distance: best.distance,
      },
      ...extraTrace,
    }],
  };
}

function scoreProgressionsTechnique(candidateUtcDate, natalLongitudes, lat, lon, event, config) {
  if (!config.enabled) return { score: 0, trace: [] };
  if (config.angleMethod !== "dateCast") {
    throw new TypeError('progressions.angleMethod must be "dateCast"');
  }

  const ageYears = progressedAgeForEvent(candidateUtcDate, event.representativeDate);
  const progressed = progressedAnglesAtAge(candidateUtcDate, ageYears, lat, lon);
  const directedAngles = Object.fromEntries(
    normalizeAngleKeys(config.angleKeys).map(key => [key, normalize360(progressed.angles[key.toLowerCase()])])
  );

  return scoreAngleContacts({
    technique: "secondary-progressions",
    event,
    directedAngles,
    natalLongitudes,
    config,
    extraTrace: {
      angleMethod: "dateCast",
      progressedDate: progressed.date.toISOString(),
      ageYears,
    },
  });
}

function scoreSolarArcTechnique(candidateUtcDate, candidateAngles, natalLongitudes, event, config) {
  if (!config.enabled) return { score: 0, trace: [] };

  const ageYears = progressedAgeForEvent(candidateUtcDate, event.representativeDate);
  const arcInfo = solarArcAtAge(candidateUtcDate, ageYears, { method: config.method });
  const directedAngles = directSolarArcRecord(
    Object.fromEntries(normalizeAngleKeys(config.angleKeys).map(key => [key, candidateAngles[key]])),
    arcInfo.arc
  );

  return scoreAngleContacts({
    technique: "solar-arc",
    event,
    directedAngles,
    natalLongitudes,
    config,
    extraTrace: {
      method: arcInfo.method,
      angleMode: config.angleMode,
      arcDegrees: arcInfo.arc,
      progressedDate: arcInfo.progressedDate.toISOString(),
      ageYears,
    },
  });
}

export function rectifyBirthTime(input) {
  const {
    birthDate,
    lat,
    lon,
    timezone = resolveTimezone({ lat, lon }, "rectification"),
    stepMinutes = 10,
    stepSeconds = stepMinutes * 60,
    startMinute = 0,
    endMinute = 24 * 60,
    startSecond = startMinute * 60,
    endSecond = endMinute * 60,
    topN = 10,
    intervalFraction = 0.9,
    events,
    techniques,
  } = input;

  if (typeof birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new TypeError("birthDate must be an ISO local date string");
  }
  if (typeof lat !== "number" || !Number.isFinite(lat)) throw new TypeError("lat must be a finite number");
  if (typeof lon !== "number" || !Number.isFinite(lon)) throw new TypeError("lon must be a finite number");
  if (!Number.isInteger(stepSeconds) || stepSeconds <= 0) throw new TypeError("stepSeconds must be a positive integer");
  if (!Number.isInteger(startSecond) || startSecond < 0 || startSecond >= 24 * 60 * 60) throw new TypeError("startSecond must be within the local day");
  if (!Number.isInteger(endSecond) || endSecond <= startSecond || endSecond > 24 * 60 * 60) throw new TypeError("endSecond must be within the local day");
  if (!Number.isInteger(topN) || topN <= 0) throw new TypeError("topN must be a positive integer");

  const normalizedEvents = normalizeRectificationEvents(events);
  const candidateGrid = buildCandidateGrid({ birthDate, timezone, stepSeconds, startSecond, endSecond });
  const config = defaultTechniqueConfig(techniques);

  const scoredCandidates = candidateGrid.map(candidate => {
    const natal = buildNatalCandidate(candidate.utcDate, lat, lon);
    const candidateTrace = [];
    const techniqueScores = {
      transitsToAngles: 0,
      progressions: 0,
      solarArc: 0,
    };

    for (const event of normalizedEvents) {
      const transitScore = scoreTransitTechnique(natal.angles, event, config.transit);
      const progressionScore = scoreProgressionsTechnique(candidate.utcDate, natal.chart.eclipticLongitudes, lat, lon, event, config.progressions);
      const solarArcScore = scoreSolarArcTechnique(candidate.utcDate, natal.angles, natal.chart.eclipticLongitudes, event, config.solarArc);

      techniqueScores.transitsToAngles += transitScore.score;
      techniqueScores.progressions += progressionScore.score;
      techniqueScores.solarArc += solarArcScore.score;
      candidateTrace.push(...transitScore.trace, ...progressionScore.trace, ...solarArcScore.trace);
    }

    const score = techniqueScores.transitsToAngles + techniqueScores.progressions + techniqueScores.solarArc;
    return {
      candidate,
      score,
      techniqueScores,
      angles: natal.angles,
      explanationTrace: candidateTrace,
    };
  }).sort((a, b) => b.score - a.score);

  const bestScore = scoredCandidates[0]?.score ?? 0;
  const threshold = bestScore > 0 ? bestScore * intervalFraction : 0;
  const intervalCandidates = scoredCandidates.filter(entry => entry.score >= threshold);
  const sortedIntervalByTime = [...intervalCandidates].sort((a, b) => a.candidate.minuteOfDay - b.candidate.minuteOfDay);

  return {
    birthDate,
    timezone,
    lat,
    lon,
    candidateCount: scoredCandidates.length,
    stepMinutes,
    stepSeconds,
    startMinute,
    endMinute,
    startSecond,
    endSecond,
    eventCount: normalizedEvents.length,
    techniqueConfig: config,
    topCandidates: scoredCandidates.slice(0, topN).map((entry, index) => ({
      rank: index + 1,
      localTime: entry.candidate.localTime,
      localTimeWithSeconds: entry.candidate.localTimeWithSeconds,
      localDateTime: entry.candidate.localDateTime,
      utcDateTime: entry.candidate.utcISOString,
      minuteOfDay: entry.candidate.minuteOfDay,
      secondOfDay: entry.candidate.secondOfDay,
      score: entry.score,
      techniqueScores: entry.techniqueScores,
      angles: entry.angles,
      explanationTrace: entry.explanationTrace,
    })),
    uncertaintyInterval: sortedIntervalByTime.length === 0 ? null : {
      scoreThreshold: threshold,
      candidateCount: sortedIntervalByTime.length,
      startLocalTime: sortedIntervalByTime[0].candidate.localTime,
      startLocalTimeWithSeconds: sortedIntervalByTime[0].candidate.localTimeWithSeconds,
      endLocalTime: sortedIntervalByTime[sortedIntervalByTime.length - 1].candidate.localTime,
      endLocalTimeWithSeconds: sortedIntervalByTime[sortedIntervalByTime.length - 1].candidate.localTimeWithSeconds,
      startUtcDateTime: sortedIntervalByTime[0].candidate.utcISOString,
      endUtcDateTime: sortedIntervalByTime[sortedIntervalByTime.length - 1].candidate.utcISOString,
    },
  };
}
