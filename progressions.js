/**
 * progressions.js — Secondary Progressions (day-for-a-year)
 *
 * Each day after birth corresponds to one year of life.
 * The progressed chart is cast for the progressed date at the birth location.
 */
import { castChart } from "./chartCaster.js";
import { computeHouses } from "./houses.js";

const MS_PER_DAY = 86400000;
const TROPICAL_YEAR_DAYS = 365.2422;

/**
 * Compute the progressed date for a given age.
 * @param {Date} birthDate - birth date/time (UTC)
 * @param {number} ageYears - age in years (can be fractional)
 * @returns {Date} progressed date
 */
export function progressedDate(birthDate, ageYears) {
  const days = ageYears; // 1 year = 1 day in secondary progressions
  return new Date(birthDate.getTime() + days * MS_PER_DAY);
}

/**
 * Cast a progressed chart.
 * @param {Date} birthDate - birth date/time (UTC)
 * @param {number} ageYears - age in years
 * @returns {Object} chart object from castChart()
 */
export function progressedChart(birthDate, ageYears) {
  const pDate = progressedDate(birthDate, ageYears);
  return castChart(pDate);
}

/**
 * Convert a concrete event datetime into symbolic age years using a frozen
 * tropical-year convention so progression comparisons stay reproducible.
 */
export function progressedAgeForEvent(birthDate, eventDate, yearLengthDays = TROPICAL_YEAR_DAYS) {
  return (eventDate.getTime() - birthDate.getTime()) / (MS_PER_DAY * yearLengthDays);
}

/**
 * Compute progressed angles and houses by casting the progressed chart
 * directly at the progressed datetime for the natal birthplace.
 */
export function progressedAnglesAtAge(birthDate, ageYears, latitudeDeg, longitudeDeg) {
  const chart = progressedChart(birthDate, ageYears);
  const houses = computeHouses(chart.gmst, chart.obliquity, latitudeDeg, longitudeDeg);
  return {
    age: ageYears,
    date: progressedDate(birthDate, ageYears),
    chart,
    houses,
    angles: {
      asc: houses.asc,
      mc: houses.mc,
      dsc: houses.dsc,
      ic: houses.ic,
    },
  };
}

/**
 * Get progressed positions for a range of ages.
 * Useful for tracking progressed Moon through signs.
 * @param {Date} birthDate
 * @param {number} startAge
 * @param {number} endAge
 * @param {number} [stepYears=1]
 * @returns {Array<{age, date, positions, eclipticLongitudes}>}
 */
export function progressionTimeline(birthDate, startAge, endAge, stepYears = 1) {
  const results = [];
  for (let age = startAge; age <= endAge; age += stepYears) {
    const chart = progressedChart(birthDate, age);
    results.push({
      age,
      date: progressedDate(birthDate, age),
      positions: chart.positions,
      eclipticLongitudes: chart.eclipticLongitudes,
    });
  }
  return results;
}

export { TROPICAL_YEAR_DAYS };
