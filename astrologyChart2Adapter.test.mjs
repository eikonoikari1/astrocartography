import { DEFAULT_PROFILE } from "./profile.js";
import { buildAstrologyChart2Data, isBodyRetrograde, toAstrologyChart2Data } from "./astrologyChart2Adapter.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

console.log("\n═══ Test 1: Adapter maps engine output to AstrologyChart2 payload ═══");
const mapped = toAstrologyChart2Data(
  { Sun: 185.23, Moon: 81.5, Mercury: 183.63, Venus: 222.95, Mars: 169.05, Jupiter: 131.72, Saturn: 88.93, Uranus: 325.45, Neptune: 308.35, Pluto: 255.17 },
  [300, 330, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270],
  { Mercury: true, Saturn: false }
);
assert("Ten bodies become ten points", mapped.points.length === 10, mapped.points.length);
assert("House cusps become angle objects", mapped.cusps.length === 12 && mapped.cusps[0].angle === 300, JSON.stringify(mapped.cusps[0]));
assert("True retrograde flag is preserved", mapped.points.find(point => point.name === "Mercury")?.isRetrograde === true);
assert("False retrograde flag is omitted", !("isRetrograde" in mapped.points.find(point => point.name === "Saturn")), JSON.stringify(mapped.points.find(point => point.name === "Saturn")));

console.log("\n═══ Test 2: Combined builder returns one wheel payload ═══");
const dt = new Date(DEFAULT_PROFILE.birth.datetime);
const built = buildAstrologyChart2Data(dt, DEFAULT_PROFILE.birth.lat, DEFAULT_PROFILE.birth.lon);
assert("Builder returns chart data", built.chart?.eclipticLongitudes?.Sun != null);
assert("Builder returns houses data", built.houses?.cusps?.length === 12, built.houses?.cusps?.length);
assert("Builder returns AstrologyChart2 payload", built.data.points.length === 10 && built.data.cusps.length === 12);

console.log("\n═══ Test 3: Dynamic retrograde detection works for current engine ═══");
assert("Mercury is retrograde for the default profile date", isBodyRetrograde("Mercury", dt) === true);
assert("Venus is direct for the default profile date", isBodyRetrograde("Venus", dt) === false);
assert("Sun is direct for the default profile date", isBodyRetrograde("Sun", dt) === false);

console.log("\n═══ Test 4: Invalid cusp counts fail fast ═══");
let cuspError;
try {
  toAstrologyChart2Data({ Sun: 0, Moon: 0, Mercury: 0, Venus: 0, Mars: 0, Jupiter: 0, Saturn: 0, Uranus: 0, Neptune: 0, Pluto: 0 }, [0, 30]);
} catch (err) {
  cuspError = err;
}
assert("Invalid cusp count throws", cuspError instanceof TypeError, cuspError?.message);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
