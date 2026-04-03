/**
 * validate_swap.test.mjs — Validate chartCaster (astronomy-engine) against known reference values
 *
 * Reference: JPL Horizons geocentric apparent positions for 2002-09-28T12:45:00 UTC
 * Run: node validate_swap.test.mjs
 */
import { castChart, getEclipticLongitude, getGMST, norm360 } from "./chartCaster.js";

const toDeg = r => r * 180 / Math.PI;
const angularDiff = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

// Birth data: Sep 28, 2002, 12:45 UTC
const dt = new Date("2002-09-28T12:45:00Z");
const chart = castChart(dt);

// ═══ Test 1: Chart casts without error ═══
console.log("\n═══ Test 1: Chart casts without error ═══");
assert("Chart has positions", !!chart.positions);
assert("Chart has eclipticLongitudes", !!chart.eclipticLongitudes);
assert("Chart has gmst", typeof chart.gmst === "number");
assert("Chart has obliquity", typeof chart.obliquity === "number");

// ═══ Test 2: Sun ecliptic longitude ═══
// Sun on Sep 28, 2002 should be ~5° Libra = ~185° ecliptic
console.log("\n═══ Test 2: Sun position ═══");
const sunLon = chart.eclipticLongitudes.Sun;
console.log(`  Sun ecliptic longitude: ${sunLon.toFixed(4)}°`);
assert("Sun in Libra (180-210°)", sunLon >= 180 && sunLon < 210, `got ${sunLon.toFixed(2)}°`);
// JPL Horizons: Sun at ~184.9° on this date
assert("Sun near 185° (±1°)", angularDiff(sunLon, 185.0) < 1.0, `got ${sunLon.toFixed(4)}°`);

// ═══ Test 3: Moon ecliptic longitude ═══
// Moon on Sep 28, 2002 12:45 UTC at ~81.5° (Gemini)
console.log("\n═══ Test 3: Moon position ═══");
const moonLon = chart.eclipticLongitudes.Moon;
console.log(`  Moon ecliptic longitude: ${moonLon.toFixed(4)}°`);
assert("Moon in Gemini (60-90°)", moonLon >= 60 && moonLon < 90, `got ${moonLon.toFixed(2)}°`);

// ═══ Test 4: All bodies present ═══
console.log("\n═══ Test 4: All bodies present ═══");
const expected = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"];
for (const body of expected) {
  assert(`${body} has ecliptic longitude`, typeof chart.eclipticLongitudes[body] === "number");
  assert(`${body} lon in [0,360)`, chart.eclipticLongitudes[body] >= 0 && chart.eclipticLongitudes[body] < 360);
}

// ═══ Test 5: GMST sanity ═══
console.log("\n═══ Test 5: GMST sanity ═══");
const gmstDeg = toDeg(chart.gmst);
console.log(`  GMST: ${gmstDeg.toFixed(4)}° (${(gmstDeg / 15).toFixed(4)} hours)`);
// GMST at 12:45 UTC on Sep 28, 2002 should be roughly 12h + sidereal offset ≈ 13h
const gmstHours = gmstDeg / 15;
assert("GMST between 10-16 hours", gmstHours >= 10 && gmstHours <= 16, `got ${gmstHours.toFixed(2)}h`);

// ═══ Test 6: Ecliptic longitude consistency ═══
// getEclipticLongitude standalone vs castChart should match
console.log("\n═══ Test 6: Standalone vs chart ecliptic longitudes ═══");
for (const body of ["Sun", "Mars", "Jupiter"]) {
  const standalone = getEclipticLongitude(body, dt);
  const fromChart = chart.eclipticLongitudes[body];
  const diff = angularDiff(standalone, fromChart);
  assert(`${body} standalone matches chart (diff=${diff.toFixed(6)}°)`, diff < 0.001);
}

// ═══ Test 7: Obliquity sanity ═══
console.log("\n═══ Test 7: Obliquity sanity ═══");
const oblDeg = toDeg(chart.obliquity);
console.log(`  Obliquity: ${oblDeg.toFixed(4)}°`);
assert("Obliquity near 23.44° (±0.1°)", Math.abs(oblDeg - 23.44) < 0.1, `got ${oblDeg.toFixed(4)}°`);

// ═══ Test 8: MC line computation ═══
console.log("\n═══ Test 8: MC lines ═══");
const birth_lon = 92.867; // Krasnoyarsk
for (const body of ["Sun", "Mercury", "Venus", "Mars", "Jupiter"]) {
  const mcLon = norm360(toDeg(chart.positions[body].ra - chart.gmst));
  console.log(`  ${body.padEnd(8)} MC line longitude: ${mcLon.toFixed(2)}°`);
  assert(`${body} MC in [0,360)`, mcLon >= 0 && mcLon < 360);
}

// ═══ Test 9: Different dates produce different results ═══
console.log("\n═══ Test 9: Different dates differ ═══");
const chart2 = castChart(new Date("2025-01-01T00:00:00Z"));
const sunDiff = angularDiff(chart.eclipticLongitudes.Sun, chart2.eclipticLongitudes.Sun);
assert("Sun position differs across dates", sunDiff > 10, `diff=${sunDiff.toFixed(2)}°`);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
