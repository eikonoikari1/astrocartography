/**
 * profections.js — Annual profections (whole-sign)
 *
 * One completed year advances the Ascendant by one sign.
 * This module keeps the math explicit and exports small helpers
 * that a CLI layer can call directly.
 */

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const TRADITIONAL_PLANETS = [
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
];

const SIGN_RULER = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

function assertDate(name, value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError(`${name} must be a valid Date`);
  }
}

function normalizeSignIndex(index) {
  return ((index % 12) + 12) % 12;
}

export function signIndexFromLongitude(longitude) {
  if (typeof longitude !== "number" || !Number.isFinite(longitude)) {
    throw new TypeError("longitude must be a finite number");
  }
  const norm = ((longitude % 360) + 360) % 360;
  return normalizeSignIndex(Math.floor(norm / 30));
}

export function signFromLongitude(longitude) {
  const index = signIndexFromLongitude(longitude);
  return { sign: SIGNS[index], index };
}

export function resolveSignIndex(value) {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("ascendant must be a finite number, sign name, or sign index");
    }
    if (Number.isInteger(value) && value >= 0 && value < 12) {
      return value;
    }
    return signIndexFromLongitude(value);
  }

  if (typeof value === "string") {
    const index = SIGNS.indexOf(value);
    if (index >= 0) return index;
  }

  throw new TypeError("ascendant must be a finite number, sign name, or sign index");
}

function dateAtSameTimeInYear(referenceDate, year) {
  return new Date(Date.UTC(
    year,
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate(),
    referenceDate.getUTCHours(),
    referenceDate.getUTCMinutes(),
    referenceDate.getUTCSeconds(),
    referenceDate.getUTCMilliseconds()
  ));
}

export function completedAgeAtDate(birthDate, targetDate) {
  assertDate("birthDate", birthDate);
  assertDate("targetDate", targetDate);
  if (targetDate < birthDate) {
    throw new RangeError("targetDate must be on or after birthDate");
  }

  let age = targetDate.getUTCFullYear() - birthDate.getUTCFullYear();
  const birthdayThisYear = dateAtSameTimeInYear(birthDate, targetDate.getUTCFullYear());
  if (targetDate < birthdayThisYear) age -= 1;
  return age;
}

export function profectionBoundaryDate(birthDate, completedAge) {
  assertDate("birthDate", birthDate);
  if (!Number.isInteger(completedAge) || completedAge < 0) {
    throw new RangeError("completedAge must be a non-negative integer");
  }
  return dateAtSameTimeInYear(birthDate, birthDate.getUTCFullYear() + completedAge);
}

export function profectedSignIndex(ascendant, completedAge) {
  const ascIndex = resolveSignIndex(ascendant);
  if (!Number.isInteger(completedAge) || completedAge < 0) {
    throw new RangeError("completedAge must be a non-negative integer");
  }
  return normalizeSignIndex(ascIndex + completedAge);
}

export function profectedSign(ascendant, completedAge) {
  const index = profectedSignIndex(ascendant, completedAge);
  return { sign: SIGNS[index], index };
}

export function profectedHouse(ascendant, completedAge) {
  const ascIndex = resolveSignIndex(ascendant);
  const signIndex = profectedSignIndex(ascendant, completedAge);
  return normalizeSignIndex(signIndex - ascIndex) + 1;
}

export function yearLordForSign(sign) {
  const signName = typeof sign === "number"
    ? SIGNS[normalizeSignIndex(sign)]
    : sign;
  const ruler = SIGN_RULER[signName];
  if (!ruler) {
    throw new TypeError("sign must be a valid zodiac sign name or sign index");
  }
  return ruler;
}

export function profectionAtAge(ascendant, completedAge) {
  const ascIndex = resolveSignIndex(ascendant);
  const signIndex = profectedSignIndex(ascIndex, completedAge);
  return {
    ascendantSignIndex: ascIndex,
    completedAge,
    profectedSignIndex: signIndex,
    profectedSign: SIGNS[signIndex],
    profectedHouse: normalizeSignIndex(signIndex - ascIndex) + 1,
    yearLord: SIGN_RULER[SIGNS[signIndex]],
  };
}

export function profectionAtDate(ascendant, birthDate, targetDate) {
  assertDate("birthDate", birthDate);
  assertDate("targetDate", targetDate);
  const completedAge = completedAgeAtDate(birthDate, targetDate);
  const periodStartDate = profectionBoundaryDate(birthDate, completedAge);
  const periodEndDate = profectionBoundaryDate(birthDate, completedAge + 1);
  return {
    ...profectionAtAge(ascendant, completedAge),
    birthDate: new Date(birthDate.getTime()),
    targetDate: new Date(targetDate.getTime()),
    periodStartDate,
    periodEndDate,
  };
}

export function profectionTimeline(ascendant, birthDate, startAge, endAge, stepYears = 1) {
  assertDate("birthDate", birthDate);
  if (!Number.isInteger(startAge) || startAge < 0) {
    throw new RangeError("startAge must be a non-negative integer");
  }
  if (!Number.isInteger(endAge) || endAge < startAge) {
    throw new RangeError("endAge must be an integer >= startAge");
  }
  if (!Number.isInteger(stepYears) || stepYears < 1) {
    throw new RangeError("stepYears must be a positive integer");
  }

  const results = [];
  for (let age = startAge; age <= endAge; age += stepYears) {
    const periodStartDate = profectionBoundaryDate(birthDate, age);
    const periodEndDate = profectionBoundaryDate(birthDate, age + stepYears);
    results.push({
      ...profectionAtAge(ascendant, age),
      birthDate: new Date(birthDate.getTime()),
      periodStartDate,
      periodEndDate,
    });
  }
  return results;
}

export {
  SIGNS,
  TRADITIONAL_PLANETS,
  SIGN_RULER,
};
