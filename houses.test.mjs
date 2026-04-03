/**
 * houses.test.mjs — Test Placidus house system + equal house fallback
 * Run: node houses.test.mjs
 */
import { computeHouses, getHouse } from "./houses.js";
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

// ═══ Test 1: Basic Placidus computation ═══
console.log("\n═══ Test 1: Placidus for Krasnoyarsk (56°N, 92.87°E) ═══");
const dt = new Date("2002-09-28T12:45:00Z");
const chart = castChart(dt);
const h = computeHouses(chart.gmst, chart.obliquity, 56.01, 92.867);

assert("Returns 12 cusps", h.cusps.length === 12);
assert("System is Placidus", h.system === "placidus");
assert("MC defined", typeof h.mc === "number");
assert("ASC defined", typeof h.asc === "number");
assert("IC = MC + 180 (±0.01°)", angularDiff(h.ic, (h.mc + 180) % 360) < 0.01);
assert("DSC = ASC + 180 (±0.01°)", angularDiff(h.dsc, (h.asc + 180) % 360) < 0.01);

console.log(`  MC=${h.mc.toFixed(2)}° ASC=${h.asc.toFixed(2)}° IC=${h.ic.toFixed(2)}° DSC=${h.dsc.toFixed(2)}°`);
for (let i = 0; i < 12; i++) {
  console.log(`  Cusp ${(i+1).toString().padStart(2)}: ${h.cusps[i].toFixed(2)}°`);
}

// ═══ Test 2: Cusps are in order (monotonically increasing modulo 360) ═══
console.log("\n═══ Test 2: Cusps are in zodiacal order ═══");
let ordered = true;
for (let i = 0; i < 12; i++) {
  const curr = h.cusps[i];
  const next = h.cusps[(i + 1) % 12];
  // Each cusp should be "after" the previous in zodiacal order
  // Allow wrapping around 360
  const diff = (next - curr + 360) % 360;
  if (diff <= 0 || diff >= 180) {
    ordered = false;
    console.log(`  Cusp ${i+1}→${(i%12)+2} gap=${diff.toFixed(2)}° (unexpected)`);
  }
}
assert("All cusps in zodiacal order", ordered);

// ═══ Test 3: Cusp 1 = ASC, Cusp 10 = MC ═══
console.log("\n═══ Test 3: Cusp alignment ═══");
assert("Cusp 1 = ASC", angularDiff(h.cusps[0], h.asc) < 0.01, `cusp1=${h.cusps[0].toFixed(4)} asc=${h.asc.toFixed(4)}`);
assert("Cusp 10 = MC", angularDiff(h.cusps[9], h.mc) < 0.01, `cusp10=${h.cusps[9].toFixed(4)} mc=${h.mc.toFixed(4)}`);
assert("Cusp 4 = IC", angularDiff(h.cusps[3], h.ic) < 0.01, `cusp4=${h.cusps[3].toFixed(4)} ic=${h.ic.toFixed(4)}`);
assert("Cusp 7 = DSC", angularDiff(h.cusps[6], h.dsc) < 0.01, `cusp7=${h.cusps[6].toFixed(4)} dsc=${h.dsc.toFixed(4)}`);

// ═══ Test 4: Equal house fallback at high latitude ═══
console.log("\n═══ Test 4: Equal house fallback (70°N) ═══");
const hHigh = computeHouses(chart.gmst, chart.obliquity, 70, 25);
assert("System is equal at 70°N", hHigh.system === "equal");
assert("12 cusps returned", hHigh.cusps.length === 12);
for (let i = 0; i < 11; i++) {
  const gap = ((hHigh.cusps[i + 1] - hHigh.cusps[i]) + 360) % 360;
  assert(`Equal cusp ${i+1}→${i+2} gap=30°`, Math.abs(gap - 30) < 0.01, `gap=${gap.toFixed(4)}°`);
}

// ═══ Test 5: Placidus at moderate latitudes ═══
console.log("\n═══ Test 5: Placidus at 40°N (New York) ═══");
const hNY = computeHouses(chart.gmst, chart.obliquity, 40.71, -74.01);
assert("Placidus at 40°N", hNY.system === "placidus");
// Cusps should NOT all be 30° apart (that's equal house)
let allEqual = true;
for (let i = 0; i < 11; i++) {
  const gap = ((hNY.cusps[i + 1] - hNY.cusps[i]) + 360) % 360;
  if (Math.abs(gap - 30) > 1.0) allEqual = false;
}
assert("Cusps are not all 30° (Placidus ≠ equal)", !allEqual);

// ═══ Test 6: getHouse placement ═══
console.log("\n═══ Test 6: getHouse ═══");
// A longitude exactly at cusp 1 should be house 1
assert("Longitude at cusp 1 → house 1", getHouse(h.cusps[0], h.cusps) === 1);
// A longitude 1° past cusp 1 should be house 1
assert("1° past cusp 1 → house 1", getHouse((h.cusps[0] + 1) % 360, h.cusps) === 1);
// A longitude 1° before cusp 2 should be house 1
const beforeCusp2 = (h.cusps[1] - 1 + 360) % 360;
assert("1° before cusp 2 → house 1", getHouse(beforeCusp2, h.cusps) === 1);
// At cusp 10 → house 10
assert("Longitude at cusp 10 → house 10", getHouse(h.cusps[9], h.cusps) === 10);

// ═══ Test 7: Different times produce different houses ═══
console.log("\n═══ Test 7: Different times produce different ASC ═══");
const chart2 = castChart(new Date("2002-09-28T00:00:00Z"));
const h2 = computeHouses(chart2.gmst, chart2.obliquity, 56.01, 92.867);
const ascDiff = angularDiff(h.asc, h2.asc);
console.log(`  ASC diff between 12:45 and 00:00 UTC: ${ascDiff.toFixed(2)}°`);
assert("ASC differs by time of day", ascDiff > 10);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
