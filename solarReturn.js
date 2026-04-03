/**
 * solarReturn.js — Solar Return chart calculation
 *
 * Finds the exact moment when the Sun returns to its natal ecliptic longitude,
 * then casts a chart for that moment at a chosen location.
 */
import * as Astronomy from "astronomy-engine";
import { castChart } from "./chartCaster.js";
import { computeHouses } from "./houses.js";

/**
 * Find the exact solar return moment for a given year.
 * Uses astronomy-engine's SearchSunLongitude for sub-minute accuracy.
 *
 * @param {number} natalSunLon - natal Sun ecliptic longitude in degrees
 * @param {number} year - the year of the solar return
 * @param {Date} birthDate - birth date (to find the approximate search start)
 * @returns {Date} exact moment of the solar return
 */
export function findSolarReturn(natalSunLon, year, birthDate, options = {}) {
  const searchWindowDays = options.searchWindowDays ?? 10;
  // Start searching a few days before the birthday in the target year
  const searchStart = new Date(Date.UTC(year, birthDate.getUTCMonth(), birthDate.getUTCDate() - searchWindowDays));
  const startTime = Astronomy.MakeTime(searchStart);

  const result = Astronomy.SearchSunLongitude(natalSunLon, startTime, searchWindowDays * 2 + 1);
  if (!result) {
    throw new Error(`Could not find solar return for year ${year}`);
  }
  return result.date;
}

/**
 * Cast a full solar return chart.
 *
 * @param {number} natalSunLon - natal Sun ecliptic longitude in degrees
 * @param {number} year - year of the return
 * @param {Date} birthDate - birth date
 * @param {number} latitudeDeg - latitude for the return chart
 * @param {number} longitudeDeg - longitude for the return chart
 * @returns {{ returnDate, chart, houses, natalSunLon, returnSunLon }}
 */
export function solarReturnChart(natalSunLon, year, birthDate, latitudeDeg, longitudeDeg, options = {}) {
  const returnDate = findSolarReturn(natalSunLon, year, birthDate, options);
  const chart = castChart(returnDate);
  const houses = computeHouses(chart.gmst, chart.obliquity, latitudeDeg, longitudeDeg);

  return {
    returnDate,
    chart,
    houses,
    natalSunLon,
    returnSunLon: chart.eclipticLongitudes.Sun,
    returnLocationPolicy: options.returnLocationPolicy ?? "specified",
  };
}
