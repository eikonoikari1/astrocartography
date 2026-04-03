/**
 * profections.test.mjs — Test annual profections
 * Run: node profections.test.mjs
 */
import {
  SIGNS,
  TRADITIONAL_PLANETS,
  SIGN_RULER,
  signIndexFromLongitude,
  signFromLongitude,
  completedAgeAtDate,
  profectedSignIndex,
  profectedSign,
  profectedHouse,
  yearLordForSign,
  profectionAtAge,
  profectionAtDate,
  profectionTimeline,
} from "./profections.js";
import { castChart } from "./chartCaster.js";
import { computeHouses } from "./houses.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

const birthDate = new Date("2002-09-28T12:45:00Z");
const chart = castChart(birthDate);
const houses = computeHouses(chart.gmst, chart.obliquity, 56.01, 92.867);
const ascSignIndex = signIndexFromLongitude(houses.asc);
const expectedPlanets = new Set(["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"]);
const actualPlanets = new Set(TRADITIONAL_PLANETS);

console.log(`Ascendant longitude: ${houses.asc.toFixed(6)}°`);
console.log(`Ascendant sign: ${SIGNS[ascSignIndex]}`);

// ═══ Test 1: Sign and ruler tables ═══
console.log("\n═══ Test 1: Tables ═══");
assert("12 signs present", SIGNS.length === 12);
assert("7 traditional planets present", TRADITIONAL_PLANETS.length === 7);
assert(
  "Traditional planet set is exact",
  actualPlanets.size === expectedPlanets.size && [...expectedPlanets].every(planet => actualPlanets.has(planet)),
  [...actualPlanets].join(", ")
);
assert("Aries ruled by Mars", SIGN_RULER.Aries === "Mars");
assert("Taurus ruled by Venus", SIGN_RULER.Taurus === "Venus");
assert("Cancer ruled by Moon", SIGN_RULER.Cancer === "Moon");
assert("Leo ruled by Sun", SIGN_RULER.Leo === "Sun");
assert("Scorpio ruled by Mars", SIGN_RULER.Scorpio === "Mars");
assert("Pisces ruled by Jupiter", SIGN_RULER.Pisces === "Jupiter");
assert("No modern rulers in table", new Set(Object.values(SIGN_RULER)).size === 7);

// ═══ Test 2: Longitude helpers ═══
console.log("\n═══ Test 2: Longitude helpers ═══");
assert("0° -> Aries", signFromLongitude(0).sign === "Aries");
assert("29.99° -> Aries", signFromLongitude(29.99).sign === "Aries");
assert("30° -> Taurus", signFromLongitude(30).sign === "Taurus");
assert("359.99° -> Pisces", signFromLongitude(359.99).sign === "Pisces");
assert("Sign index from longitude is Taurus for ASC", ascSignIndex === 1, `got ${ascSignIndex}`);

// ═══ Test 3: Completed-age math ═══
console.log("\n═══ Test 3: Completed age ═══");
assert(
  "Age before birthday is prior year",
  completedAgeAtDate(birthDate, new Date("2005-09-28T12:44:59Z")) === 2
);
assert(
  "Age at birthday boundary increments",
  completedAgeAtDate(birthDate, new Date("2005-09-28T12:45:00Z")) === 3
);
assert(
  "Age after birthday increments",
  completedAgeAtDate(birthDate, new Date("2005-09-29T00:00:00Z")) === 3
);

// ═══ Test 4: Age-based profection cycle ═══
console.log("\n═══ Test 4: Age-based profections ═══");
const age0 = profectionAtAge(ascSignIndex, 0);
const age1 = profectionAtAge(ascSignIndex, 1);
const age11 = profectionAtAge(ascSignIndex, 11);
const age12 = profectionAtAge(ascSignIndex, 12);

assert("Age 0 starts in Asc sign", age0.profectedSign === SIGNS[ascSignIndex], `got ${age0.profectedSign}`);
assert("Age 0 house is 1", age0.profectedHouse === 1, `got ${age0.profectedHouse}`);
assert("Age 0 year lord matches sign ruler", age0.yearLord === yearLordForSign(age0.profectedSign), `got ${age0.yearLord}`);
assert("Age 1 advances one sign", age1.profectedSign === SIGNS[(ascSignIndex + 1) % 12], `got ${age1.profectedSign}`);
assert("Age 1 house is 2", age1.profectedHouse === 2, `got ${age1.profectedHouse}`);
assert("Age 11 lands on 12th house", age11.profectedHouse === 12, `got ${age11.profectedHouse}`);
assert("Age 12 cycles back to Asc sign", age12.profectedSign === SIGNS[ascSignIndex], `got ${age12.profectedSign}`);
assert("Age 12 cycles back to house 1", age12.profectedHouse === 1, `got ${age12.profectedHouse}`);

// ═══ Test 5: Date-based API ═══
console.log("\n═══ Test 5: Date-based profections ═══");
const atBirthday = profectionAtDate(ascSignIndex, birthDate, new Date("2005-09-28T12:45:00Z"));
assert("Date API reports completed age 3", atBirthday.completedAge === 3, `got ${atBirthday.completedAge}`);
assert("Date API reports Leo for age 3", atBirthday.profectedSign === "Leo", `got ${atBirthday.profectedSign}`);
assert("Date API reports house 4 for age 3", atBirthday.profectedHouse === 4, `got ${atBirthday.profectedHouse}`);
assert("Date API reports Sun as year lord", atBirthday.yearLord === "Sun", `got ${atBirthday.yearLord}`);
assert("Date API start date is birthday boundary", atBirthday.periodStartDate.toISOString() === "2005-09-28T12:45:00.000Z", atBirthday.periodStartDate.toISOString());
assert("Date API end date is next birthday boundary", atBirthday.periodEndDate.toISOString() === "2006-09-28T12:45:00.000Z", atBirthday.periodEndDate.toISOString());

// ═══ Test 6: Timeline output ═══
console.log("\n═══ Test 6: Timeline ═══");
const timeline = profectionTimeline(ascSignIndex, birthDate, 0, 3);
assert("Timeline returns 4 entries", timeline.length === 4, `got ${timeline.length}`);
assert("Timeline ages are ordered", timeline.every((item, idx) => item.completedAge === idx), JSON.stringify(timeline.map(t => t.completedAge)));
assert("Timeline preserves start date for age 0", timeline[0].periodStartDate.toISOString() === "2002-09-28T12:45:00.000Z");
assert("Timeline preserves start date for age 1", timeline[1].periodStartDate.toISOString() === "2003-09-28T12:45:00.000Z");
assert("Timeline age 3 is Leo", timeline[3].profectedSign === "Leo", `got ${timeline[3].profectedSign}`);

// ═══ Test 7: Error handling ═══
console.log("\n═══ Test 7: Error handling ═══");
let threw = false;
try {
  completedAgeAtDate(birthDate, new Date("2000-01-01T00:00:00Z"));
} catch {
  threw = true;
}
assert("Rejects target dates before birth", threw);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
