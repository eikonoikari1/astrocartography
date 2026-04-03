import { CATEGORY_KEYS, CATEGORY_META, computePlanetStrength, getCategoryMeta, resolveCategoryKey, scoreWithNatalContext } from "./natalScoring.js";
import { computeLines } from "./lines.js";
import { DEFAULT_PROFILE } from "./profile.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

console.log("\n═══ Test 1: Category metadata is centralized and unique ═══");
const uniqueKeys = new Set(CATEGORY_KEYS);
assert("Category keys are unique", uniqueKeys.size === CATEGORY_KEYS.length);
assert("Category meta and keys stay aligned", CATEGORY_META.length === CATEGORY_KEYS.length);
assert("Expanded partnership label resolves", resolveCategoryKey("Partnership & Deep Connection") === "Partnership");
assert("Expanded growth label resolves", resolveCategoryKey("Growth & Transformation") === "Growth");
assert("Expanded excitement label resolves", resolveCategoryKey("Excitement & Instability") === "Excitement");
assert("Category meta exposes display label", getCategoryMeta("Partnership")?.label === "Partnership & Deep Connection");

console.log("\n═══ Test 2: Score output keys match category registry ═══");
const dt = new Date(DEFAULT_PROFILE.birth.datetime);
const { lines } = computeLines(dt);
const strengths = {};
for (const planet of Object.keys(DEFAULT_PROFILE.natal.planets)) {
  strengths[planet] = computePlanetStrength(planet, DEFAULT_PROFILE.natal);
}
const result = scoreWithNatalContext(56.01, 92.867, lines, DEFAULT_PROFILE.natal, strengths);
assert("Score keys match category registry", JSON.stringify(Object.keys(result.scores)) === JSON.stringify(CATEGORY_KEYS), JSON.stringify(Object.keys(result.scores)));

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
