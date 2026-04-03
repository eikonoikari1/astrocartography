/**
 * progressions.test.mjs — Test secondary progressions (day-for-a-year)
 * Run: node progressions.test.mjs
 */
import { progressedAgeForEvent, progressedAnglesAtAge, progressedDate, progressedChart, progressionTimeline, TROPICAL_YEAR_DAYS } from "./progressions.js";

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
const MS_PER_DAY = 86400000;

// ═══ Test 1: progressedDate formula ═══
console.log("\n═══ Test 1: progressedDate (day-for-a-year) ═══");

// Age 0 → birth date
const d0 = progressedDate(birthDate, 0);
assert("Age 0 = birth date", d0.getTime() === birthDate.getTime());

// Age 1 → 1 day after birth
const d1 = progressedDate(birthDate, 1);
const diffMs = d1.getTime() - birthDate.getTime();
assert("Age 1 = birth + 1 day", Math.abs(diffMs - MS_PER_DAY) < 1000, `diff=${diffMs}ms`);

// Age 10 → 10 days after birth
const d10 = progressedDate(birthDate, 10);
const diff10 = d10.getTime() - birthDate.getTime();
assert("Age 10 = birth + 10 days", Math.abs(diff10 - 10 * MS_PER_DAY) < 1000);

// Age 30 → 30 days after birth
const d30 = progressedDate(birthDate, 30);
const diff30 = d30.getTime() - birthDate.getTime();
assert("Age 30 = birth + 30 days", Math.abs(diff30 - 30 * MS_PER_DAY) < 1000);

// ═══ Test 2: progressedChart returns positions ═══
console.log("\n═══ Test 2: progressedChart output ═══");
const charts = progressionTimeline(birthDate, 0, 30, 10);

assert("Returns array", Array.isArray(charts));
assert("Returns 4 entries", charts.length === 4);

for (const entry of charts) {
  assert(`Age ${entry.age} has positions`, !!entry.positions);
  assert(`Age ${entry.age} has eclipticLongitudes`, !!entry.eclipticLongitudes);
  assert(`Age ${entry.age} has date`, entry.date instanceof Date);
}

// ═══ Test 3: Progressed Sun movement ═══
// The Sun moves ~1° per day, so the progressed Sun should move ~1° per year of age
console.log("\n═══ Test 3: Progressed Sun moves ~1°/year ═══");
const sunAge0 = charts[0].eclipticLongitudes.Sun;
const sunAge10 = charts[1].eclipticLongitudes.Sun;
const sunAge20 = charts[2].eclipticLongitudes.Sun;
const sunAge30 = charts[3].eclipticLongitudes.Sun;

console.log(`  Sun age 0:  ${sunAge0.toFixed(4)}°`);
console.log(`  Sun age 10: ${sunAge10.toFixed(4)}°`);
console.log(`  Sun age 20: ${sunAge20.toFixed(4)}°`);
console.log(`  Sun age 30: ${sunAge30.toFixed(4)}°`);

// 10 years ≈ 10° of solar arc (roughly, Sun moves ~0.95-1.02° per day)
const sun0to10 = angularDiff(sunAge0, sunAge10);
assert("Sun moves 8-12° in 10 progressed years", sun0to10 >= 8 && sun0to10 <= 12, `moved ${sun0to10.toFixed(2)}°`);

const sun10to20 = angularDiff(sunAge10, sunAge20);
assert("Sun moves 8-12° from age 10-20", sun10to20 >= 8 && sun10to20 <= 12, `moved ${sun10to20.toFixed(2)}°`);

// ═══ Test 4: Progressed Moon movement ═══
// Moon moves ~13° per day → progressed Moon moves ~13° per year
console.log("\n═══ Test 4: Progressed Moon moves ~13°/year ═══");
const moonAge0 = charts[0].eclipticLongitudes.Moon;
const moonAge10 = charts[1].eclipticLongitudes.Moon;

const moonDiff = angularDiff(moonAge0, moonAge10);
console.log(`  Moon age 0: ${moonAge0.toFixed(4)}° → age 10: ${moonAge10.toFixed(4)}° diff=${moonDiff.toFixed(2)}°`);
// 10 days of Moon movement ≈ 120-140° (Moon moves 11-15° per day)
assert("Moon moves 100-150° in 10 progressed years", moonDiff >= 100 && moonDiff <= 150, `moved ${moonDiff.toFixed(2)}°`);

// ═══ Test 5: Age 0 chart matches birth chart ═══
console.log("\n═══ Test 5: Age 0 = birth chart ═══");
const birthSun = charts[0].eclipticLongitudes.Sun;
// Should be the same as casting the chart directly
import { castChart } from "./chartCaster.js";
const directChart = castChart(birthDate);
const sunDiff = angularDiff(birthSun, directChart.eclipticLongitudes.Sun);
assert("Age 0 Sun matches direct birth chart", sunDiff < 0.001, `diff=${sunDiff.toFixed(6)}°`);

// ═══ Test 6: Progressed dates are sequential ═══
console.log("\n═══ Test 6: Dates are sequential ═══");
for (let i = 0; i < charts.length - 1; i++) {
  assert(`Age ${charts[i].age} < Age ${charts[i+1].age}`, charts[i].date < charts[i+1].date);
}

// ═══ Test 7: Event age and progressed angles ═══
console.log("\n═══ Test 7: Event age and progressed angles ═══");
const eventDate = new Date("2012-09-28T12:45:00Z");
const eventAge = progressedAgeForEvent(birthDate, eventDate);
assert("Ten years maps to tropical-year age", Math.abs(eventAge - (3653 / TROPICAL_YEAR_DAYS)) < 0.001, `age=${eventAge.toFixed(6)}`);
const withAngles = progressedAnglesAtAge(birthDate, 10, 56.01, 92.867);
assert("Progressed angles return houses", !!withAngles.houses);
assert("Progressed angles return asc", typeof withAngles.angles.asc === "number");
assert("Progressed angles return mc", typeof withAngles.angles.mc === "number");
assert("Progressed angle chart date is progressed date", withAngles.date instanceof Date);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
