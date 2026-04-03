import { DateTime } from "luxon";

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

export function buildCandidateGrid({
  birthDate,
  timezone,
  stepMinutes = 10,
  stepSeconds = stepMinutes * 60,
  startMinute = 0,
  endMinute = 24 * 60,
  startSecond = startMinute * 60,
  endSecond = endMinute * 60,
}) {
  assert(typeof birthDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(birthDate), "birthDate must be an ISO date string");
  assert(typeof timezone === "string" && timezone.trim().length > 0, "timezone must be a non-empty string");
  assert(Number.isInteger(stepSeconds) && stepSeconds > 0, "stepSeconds must be a positive integer");
  assert(Number.isInteger(startSecond) && startSecond >= 0 && startSecond < 24 * 60 * 60, "startSecond must be within the local day");
  assert(Number.isInteger(endSecond) && endSecond > startSecond && endSecond <= 24 * 60 * 60, "endSecond must be within the local day");

  const dayStart = DateTime.fromISO(`${birthDate}T00:00`, { zone: timezone });
  assert(dayStart.isValid, `birthDate could not be resolved in timezone ${timezone}`);

  const candidates = [];
  for (let secondOfDay = startSecond; secondOfDay < endSecond; secondOfDay += stepSeconds) {
    const localMoment = dayStart.plus({ seconds: secondOfDay });
    candidates.push({
      index: candidates.length,
      minuteOfDay: Math.floor(secondOfDay / 60),
      secondOfDay,
      localDateTime: localMoment.toISO({ suppressMilliseconds: true }),
      localTime: localMoment.toFormat("HH:mm"),
      localTimeWithSeconds: localMoment.toFormat("HH:mm:ss"),
      utcDate: localMoment.toUTC().toJSDate(),
      utcISOString: localMoment.toUTC().toISO({ suppressMilliseconds: true }),
    });
  }

  return candidates;
}
