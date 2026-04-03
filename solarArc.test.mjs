/**
 * solarArc.test.mjs — Test solar arc helpers
 * Run: node solarArc.test.mjs
 */
import { castChart } from "./chartCaster.js";
import { progressedChart } from "./progressions.js";
import {
  NAIBOD_DEGREES_PER_YEAR,
  SOLAR_ARC_METHODS,
  directSolarArcLongitude,
  directSolarArcRecord,
  meanSolarArc,
  normalize360,
  solarArcAtAge,
  solarArcForChart,
  solarArcFromLongitudes,
} from "./solarArc.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

const angularDiff = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

const birthDate = new Date("2002-09-28T12:45:00Z");
const natalChart = castChart(birthDate);

console.log("\n═══ Test 1: Default true solar arc ═══");
const arc0 = solarArcAtAge(birthDate, 0);
assert("Default method is true", arc0.method === SOLAR_ARC_METHODS.TRUE);
assert("Age 0 arc is 0", Math.abs(arc0.arc) < 1e-12, `arc=${arc0.arc}`);
assert("Progressed date exists", arc0.progressedDate instanceof Date);

console.log("\n═══ Test 2: True solar arc matches progressed Sun ═══");
const age = 10;
const progression = progressedChart(birthDate, age);
const expectedTrueArc = solarArcFromLongitudes(
  natalChart.eclipticLongitudes.Sun,
  progression.eclipticLongitudes.Sun
);
const arc10 = solarArcAtAge(birthDate, age);
console.log(`  True arc: ${arc10.arc.toFixed(8)}°`);
console.log(`  Expected: ${expectedTrueArc.toFixed(8)}°`);
assert("True solar arc matches progressed Sun", angularDiff(arc10.arc, expectedTrueArc) < 1e-10,
  `diff=${angularDiff(arc10.arc, expectedTrueArc).toExponential(3)}`);
const arc10Explicit = solarArcAtAge(birthDate, age, {
  natalSunLon: natalChart.eclipticLongitudes.Sun,
  progressedSunLon: progression.eclipticLongitudes.Sun,
});
assert("Explicit longitude path matches chart path", angularDiff(arc10Explicit.arc, arc10.arc) < 1e-12,
  `diff=${angularDiff(arc10Explicit.arc, arc10.arc).toExponential(3)}`);

console.log("\n═══ Test 3: Mean / Naibod mode ═══");
const mean10 = solarArcAtAge(birthDate, age, { method: "naibod" });
const expectedMean = normalize360(age * NAIBOD_DEGREES_PER_YEAR);
console.log(`  Mean arc: ${mean10.arc.toFixed(8)}°`);
console.log(`  Expected: ${expectedMean.toFixed(8)}°`);
assert("Mean method normalizes to mean", mean10.method === SOLAR_ARC_METHODS.MEAN);
assert("Mean arc matches Naibod constant", Math.abs(mean10.arc - expectedMean) < 1e-12,
  `diff=${Math.abs(mean10.arc - expectedMean).toExponential(3)}`);
assert("meanSolarArc helper matches", Math.abs(meanSolarArc(age) - expectedMean) < 1e-12);

console.log("\n═══ Test 4: Directed longitude helper ═══");
assert("0° + arc wraps correctly", Math.abs(directSolarArcLongitude(0, 12.5) - 12.5) < 1e-12);
assert("359° + 5° wraps across 360", Math.abs(directSolarArcLongitude(359, 5) - 4) < 1e-12);

console.log("\n═══ Test 5: Directed record helper ═══");
const sampleRecord = {
  Sun: 359.5,
  Moon: 81.5,
  Mercury: 183.64,
};
const directed = directSolarArcRecord(sampleRecord, 12.75);
assert("Directed record keeps keys", Object.keys(directed).length === 3);
assert("Directed Sun wraps", Math.abs(directed.Sun - 12.25) < 1e-12, `got ${directed.Sun}`);
assert("Directed Moon shifts", Math.abs(directed.Moon - normalize360(81.5 + 12.75)) < 1e-12);
assert("Directed Mercury shifts", Math.abs(directed.Mercury - normalize360(183.64 + 12.75)) < 1e-12);

console.log("\n═══ Test 6: Chart convenience wrapper ═══");
const chartArc = solarArcForChart(birthDate, age, natalChart, { method: "true" });
assert("Wrapper returns directedLongitudes", !!chartArc.directedLongitudes);
assert("Wrapper returns natalLongitudes", !!chartArc.natalLongitudes);
assert("Wrapper returns natal Sun longitude", typeof chartArc.natalSunLon === "number");
assert("Wrapper returns progressed Sun longitude", typeof chartArc.progressedSunLon === "number");
assert("Wrapper directed Sun matches helper", Math.abs(chartArc.directedLongitudes.Sun - directSolarArcLongitude(natalChart.eclipticLongitudes.Sun, chartArc.arc)) < 1e-12);

console.log("\n═══ Test 7: Long-form arithmetic consistency ═══");
const reverseCheck = solarArcFromLongitudes(185.218784, 195.065197);
assert("solarArcFromLongitudes normalizes difference", Math.abs(reverseCheck - 9.846413) < 1e-6, `got ${reverseCheck}`);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
