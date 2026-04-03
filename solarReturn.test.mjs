/**
 * solarReturn.test.mjs — Test solar return chart calculation
 * Run: node solarReturn.test.mjs
 */
import { solarReturnChart, findSolarReturn } from "./solarReturn.js";
import { castChart } from "./chartCaster.js";

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
const birthChart = castChart(birthDate);
const natalSunLon = birthChart.eclipticLongitudes.Sun;

console.log(`Natal Sun: ${natalSunLon.toFixed(6)}°`);

// ═══ Test 1: Solar return for 2025 ═══
console.log("\n═══ Test 1: Solar Return 2025 ═══");
const sr2025 = solarReturnChart(natalSunLon, 2025, birthDate, 56.01, 92.867);

assert("returnDate exists", sr2025.returnDate instanceof Date);
assert("chart exists", !!sr2025.chart);
assert("houses exists", !!sr2025.houses);
assert("natalSunLon recorded", typeof sr2025.natalSunLon === "number");
assert("returnSunLon recorded", typeof sr2025.returnSunLon === "number");

console.log(`  Return date: ${sr2025.returnDate.toISOString()}`);
console.log(`  Natal Sun:  ${sr2025.natalSunLon.toFixed(6)}°`);
console.log(`  Return Sun: ${sr2025.returnSunLon.toFixed(6)}°`);

// ═══ Test 2: Sun returns to exact natal degree ═══
console.log("\n═══ Test 2: Precision of Sun return ═══");
const sunDiff = angularDiff(sr2025.natalSunLon, sr2025.returnSunLon);
console.log(`  Sun position difference: ${sunDiff.toFixed(6)}°`);
assert("Sun matches natal within 0.001°", sunDiff < 0.001, `diff=${sunDiff.toFixed(6)}°`);
assert("Sun matches natal within 0.0001°", sunDiff < 0.0001, `diff=${sunDiff.toFixed(6)}°`);

// ═══ Test 3: Return date is in the correct year ═══
console.log("\n═══ Test 3: Return date in correct year ═══");
assert("Return in 2025", sr2025.returnDate.getFullYear() === 2025);
// Should be near Sep 28 (±2 days)
const month = sr2025.returnDate.getMonth(); // 0-indexed
const day = sr2025.returnDate.getDate();
console.log(`  Return month/day: ${month + 1}/${day}`);
assert("Return in September", month === 8); // Sep = 8
assert("Return near Sep 28 (±2 days)", Math.abs(day - 28) <= 2, `day=${day}`);

// ═══ Test 4: Solar return for 2020 ═══
console.log("\n═══ Test 4: Solar Return 2020 ═══");
const sr2020 = solarReturnChart(natalSunLon, 2020, birthDate, 40.71, -74.01, {
  searchWindowDays: 7,
  returnLocationPolicy: "relocated",
});

const diff2020 = angularDiff(sr2020.natalSunLon, sr2020.returnSunLon);
console.log(`  Return date: ${sr2020.returnDate.toISOString()}`);
console.log(`  Sun diff: ${diff2020.toFixed(6)}°`);
assert("2020 Sun within 0.001°", diff2020 < 0.001);
assert("2020 return in correct year", sr2020.returnDate.getFullYear() === 2020);
assert("Return policy is preserved", sr2020.returnLocationPolicy === "relocated");

// ═══ Test 5: Different years produce different return dates ═══
console.log("\n═══ Test 5: Different years differ ═══");
const timeDiff = Math.abs(sr2025.returnDate - sr2020.returnDate);
const daysDiff = timeDiff / 86400000;
console.log(`  Days between 2020 and 2025 returns: ${daysDiff.toFixed(1)}`);
assert("Returns are ~5 years apart", daysDiff > 1800 && daysDiff < 1830);

// ═══ Test 6: Houses are computed for return ═══
console.log("\n═══ Test 6: Return chart houses ═══");
assert("Houses have cusps", sr2025.houses.cusps.length === 12);
assert("Houses have MC", typeof sr2025.houses.mc === "number");
assert("Houses have ASC", typeof sr2025.houses.asc === "number");

// ═══ Test 7: Chart has all planets ═══
console.log("\n═══ Test 7: Return chart planets ═══");
const planets = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"];
for (const p of planets) {
  assert(`${p} in return chart`, typeof sr2025.chart.eclipticLongitudes[p] === "number");
}

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
