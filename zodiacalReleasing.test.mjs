/**
 * zodiacalReleasing.test.mjs — Test Zodiacal Releasing from the Lot of Fortune
 * Run: node zodiacalReleasing.test.mjs
 */
import { zodiacalReleasingFromChart, lotOfFortune, lotOfSpirit, isDayChart, isDayChartByHouse, generatePeriods, SIGNS, SIGN_RULER, SIGN_YEARS, lonToSign } from "./zodiacalReleasing.js";
import { castChart } from "./chartCaster.js";
import { computeHouses } from "./houses.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

// ═══ Test 1: lonToSign ═══
console.log("\n═══ Test 1: lonToSign mapping ═══");
assert("0° → Aries", lonToSign(0).sign === "Aries");
assert("29.99° → Aries", lonToSign(29.99).sign === "Aries");
assert("30° → Taurus", lonToSign(30).sign === "Taurus");
assert("90° → Cancer", lonToSign(90).sign === "Cancer");
assert("180° → Libra", lonToSign(180).sign === "Libra");
assert("270° → Capricorn", lonToSign(270).sign === "Capricorn");
assert("359.99° → Pisces", lonToSign(359.99).sign === "Pisces");
assert("lonToSign returns degree", typeof lonToSign(45).degree === "number");
assert("lonToSign 45° degree = 15", Math.abs(lonToSign(45).degree - 15) < 0.01);

// ═══ Test 2: SIGN_YEARS table completeness ═══
console.log("\n═══ Test 2: Period years table ═══");
const expectedSignYears = {
  Aries: 15, Taurus: 8, Gemini: 20, Cancer: 25,
  Leo: 19, Virgo: 20, Libra: 8, Scorpio: 15,
  Sagittarius: 12, Capricorn: 27, Aquarius: 27, Pisces: 12,
};
for (const [sign, years] of Object.entries(expectedSignYears)) {
  assert(`${sign} period = ${years} years`, SIGN_YEARS[sign] === years, `got ${SIGN_YEARS[sign]}`);
}

// ═══ Test 3: SIGN_RULER table completeness ═══
console.log("\n═══ Test 3: Sign rulers ═══");
assert("12 signs in SIGN_RULER", Object.keys(SIGN_RULER).length === 12);
assert("Aries → Mars", SIGN_RULER.Aries === "Mars");
assert("Taurus → Venus", SIGN_RULER.Taurus === "Venus");
assert("Cancer → Moon", SIGN_RULER.Cancer === "Moon");
assert("Leo → Sun", SIGN_RULER.Leo === "Sun");
assert("Scorpio → Mars", SIGN_RULER.Scorpio === "Mars");
assert("Pisces → Jupiter", SIGN_RULER.Pisces === "Jupiter");

// ═══ Test 4: Lot of Fortune calculation ═══
// Day chart: Lot = ASC + Moon - Sun
// Night chart: Lot = ASC + Sun - Moon
console.log("\n═══ Test 4: Lot of Fortune ═══");
const birthDate = new Date("2002-09-28T12:45:00Z");
const chart = castChart(birthDate);
const houses = computeHouses(chart.gmst, chart.obliquity, 56.01, 92.867);
const sunLon = chart.eclipticLongitudes.Sun;
const moonLon = chart.eclipticLongitudes.Moon;

const result = zodiacalReleasingFromChart(chart, 56.01, 92.867, birthDate, { years: 80, maxLevel: 2 });

assert("lotOfFortune is a number", typeof result.lotOfFortune === "number");
assert("lotOfFortune in [0,360)", result.lotOfFortune >= 0 && result.lotOfFortune < 360);
assert("lotSign is a valid sign object", typeof result.lotSign === "object" && SIGNS.includes(result.lotSign.sign));
assert("isDayChart is boolean", typeof result.isDayChart === "boolean");
console.log(`  Lot of Fortune: ${result.lotOfFortune.toFixed(2)}° (${result.lotSign.sign})`);
console.log(`  Day chart: ${result.isDayChart}`);

// Verify Lot formula manually
const norm360 = x => ((x % 360) + 360) % 360;
let expectedLot;
if (result.isDayChart) {
  expectedLot = norm360(houses.asc + moonLon - sunLon);
} else {
  expectedLot = norm360(houses.asc + sunLon - moonLon);
}
const lotDiff = Math.abs(result.lotOfFortune - expectedLot);
assert("Lot matches formula (±0.01°)", lotDiff < 0.01, `got ${result.lotOfFortune.toFixed(4)} expected ${expectedLot.toFixed(4)}`);

const spirit = lotOfSpirit(houses.asc, sunLon, moonLon, result.isDayChart);
assert("Lot of Spirit is finite", Number.isFinite(spirit));
assert("Lot of Spirit differs from Fortune for this chart", Math.abs(spirit - result.lotOfFortune) > 0.01);
assert("House-based day chart helper matches chart result", isDayChartByHouse(sunLon, houses.cusps) === result.isDayChart);

// ═══ Test 5: L1 periods ═══
console.log("\n═══ Test 5: L1 periods ═══");
assert("Periods array exists", Array.isArray(result.periods));
assert("Has at least 3 L1 periods", result.periods.filter(p => p.level === 1).length >= 3);

const l1Periods = result.periods.filter(p => p.level === 1);
console.log(`  ${l1Periods.length} L1 periods generated`);

// First L1 period should start at or near birth
const firstL1 = l1Periods[0];
assert("First L1 level is 1", firstL1.level === 1);
assert("First L1 has sign", SIGNS.includes(firstL1.sign));
assert("First L1 has ruler", typeof firstL1.ruler === "string");
assert("First L1 has startDate", firstL1.startDate instanceof Date);
assert("First L1 has endDate", firstL1.endDate instanceof Date);
assert("First L1 start near birth", Math.abs(firstL1.startDate - birthDate) < 86400000); // within 1 day

// Check that L1 periods tile without gaps
for (let i = 0; i < l1Periods.length - 1; i++) {
  const gap = Math.abs(l1Periods[i].endDate - l1Periods[i + 1].startDate);
  assert(`L1 period ${i+1}→${i+2} no gap`, gap < 1000, `gap=${gap}ms`);
}

// First L1 sign should be the sign of the Lot of Fortune
assert("First L1 sign = Lot sign", firstL1.sign === result.lotSign.sign, `L1=${firstL1.sign} Lot=${result.lotSign.sign}`);

// L1 period duration should match the sign's years
const expectedDuration = SIGN_YEARS[firstL1.sign] * 365.25 * 86400000;
const actualDuration = firstL1.endDate - firstL1.startDate;
const durationDiff = Math.abs(actualDuration - expectedDuration) / 86400000; // in days
assert("First L1 duration matches ruler years (±1 day)", durationDiff < 1, `diff=${durationDiff.toFixed(2)} days`);

// ═══ Test 6: L2 sub-periods ═══
console.log("\n═══ Test 6: L2 sub-periods ═══");
const l2Periods = result.periods.filter(p => p.level === 2);
assert("Has L2 periods", l2Periods.length > 0);
console.log(`  ${l2Periods.length} L2 sub-periods generated`);

// L2 periods within the first L1 should start from the first sign of that L1
const l2InFirst = l2Periods.filter(p => p.startDate >= firstL1.startDate && p.startDate < firstL1.endDate);
assert("L2 periods exist within first L1", l2InFirst.length > 0);

// L2 periods should cycle through all 12 signs within an L1
if (l2InFirst.length >= 12) {
  const signs = new Set(l2InFirst.slice(0, 12).map(p => p.sign));
  assert("First 12 L2 periods cover 12 signs", signs.size === 12);
}

// ═══ Test 7: Signs cycle in zodiacal order ═══
console.log("\n═══ Test 7: L1 signs cycle in order ═══");
let inOrder = true;
for (let i = 0; i < l1Periods.length - 1; i++) {
  const currIdx = SIGNS.indexOf(l1Periods[i].sign);
  const nextIdx = SIGNS.indexOf(l1Periods[i + 1].sign);
  if ((currIdx + 1) % 12 !== nextIdx) {
    inOrder = false;
    console.log(`  ${l1Periods[i].sign} → ${l1Periods[i + 1].sign} (expected ${SIGNS[(currIdx + 1) % 12]})`);
  }
}
assert("L1 periods cycle zodiacally", inOrder);

// ═══ Test 8: Spirit lot and metadata options ═══
console.log("\n═══ Test 8: Spirit lot and metadata ═══");
const spiritResult = zodiacalReleasingFromChart(chart, 56.01, 92.867, birthDate, {
  years: 10,
  maxLevel: 4,
  lotType: "spirit",
  calendar: "tropical365",
});
assert("Spirit lot type is preserved", spiritResult.lotType === "spirit");
assert("Calendar metadata is preserved", spiritResult.calendar === "tropical365");
assert("Max level 4 produces deeper periods", spiritResult.periods.some(p => p.level === 4));

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
