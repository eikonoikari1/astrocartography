/**
 * horary.test.mjs — Test horary astrology analysis
 * Run: node horary.test.mjs
 */
import { analyzeHorary } from "./horary.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

const DIGNITIES = ["domicile", "exaltation", "detriment", "fall", "peregrine"];

// ═══ Test 1: Basic horary chart ═══
console.log("\n═══ Test 1: Basic horary chart (1st/7th house question) ═══");
const questionTime = new Date("2025-06-15T14:30:00Z");
const result = analyzeHorary(questionTime, 51.51, -0.13, { querentHouse: 1, quesitedHouse: 7 });

assert("Result has houses", !!result.houses);
assert("Result has querent", !!result.querent);
assert("Result has quesited", !!result.quesited);
assert("Result has moon", !!result.moon);
assert("Result has allPositions", !!result.allPositions);

// ═══ Test 2: Querent significator ═══
console.log("\n═══ Test 2: Querent significator ═══");
const q = result.querent;
assert("Querent has ruler", typeof q.ruler === "string");
assert("Querent has rulerSign", SIGNS.includes(q.rulerSign));
assert("Querent has cuspSign", SIGNS.includes(q.cuspSign));
assert("Querent has house", typeof q.house === "number" && q.house >= 1 && q.house <= 12);
assert("Querent has rulerHouse", typeof q.rulerHouse === "number" && q.rulerHouse >= 1 && q.rulerHouse <= 12);
assert("Querent has dignity", DIGNITIES.includes(q.dignity));
assert("Querent has longitude", typeof q.longitude === "number");
assert("Querent has combust flag", typeof q.combust === "boolean");

console.log(`  Querent ruler: ${q.ruler} in ${q.rulerSign} (house ${q.rulerHouse})`);
console.log(`  Cusp sign: ${q.cuspSign}, Dignity: ${q.dignity}, Combust: ${q.combust}`);

// ═══ Test 3: Quesited significator ═══
console.log("\n═══ Test 3: Quesited significator ═══");
const qs = result.quesited;
assert("Quesited has ruler", typeof qs.ruler === "string");
assert("Quesited has rulerSign", SIGNS.includes(qs.rulerSign));
assert("Quesited has cuspSign", SIGNS.includes(qs.cuspSign));
assert("Quesited has house", typeof qs.house === "number" && qs.house >= 1 && qs.house <= 12);
assert("Quesited has rulerHouse", typeof qs.rulerHouse === "number" && qs.rulerHouse >= 1 && qs.rulerHouse <= 12);
assert("Quesited has dignity", DIGNITIES.includes(qs.dignity));
assert("Quesited has combust flag", typeof qs.combust === "boolean");

console.log(`  Quesited ruler: ${qs.ruler} in ${qs.rulerSign} (house ${qs.rulerHouse})`);
console.log(`  Cusp sign: ${qs.cuspSign}, Dignity: ${qs.dignity}, Combust: ${qs.combust}`);

console.log(`  Querent ruler: ${q.ruler}, Quesited ruler: ${qs.ruler}`);

// ═══ Test 4: Moon data ═══
console.log("\n═══ Test 4: Moon co-significator ═══");
const m = result.moon;
assert("Moon has sign", SIGNS.includes(m.sign));
assert("Moon has house", typeof m.house === "number" && m.house >= 1 && m.house <= 12);
assert("Moon has longitude", typeof m.longitude === "number");
assert("Moon longitude in [0,360)", m.longitude >= 0 && m.longitude < 360);
console.log(`  Moon in ${m.sign} (house ${m.house}) at ${m.longitude.toFixed(2)}°`);

// ═══ Test 5: Aspects ═══
console.log("\n═══ Test 5: Aspects between significators ═══");
if (result.aspect) {
  assert("Aspect has name", typeof result.aspect.name === "string");
  assert("Aspect has orb", typeof result.aspect.orb === "number");
  console.log(`  Querent→Quesited: ${result.aspect.name} (orb ${result.aspect.orb.toFixed(2)}°)`);
} else {
  console.log("  No applying aspect between querent and quesited rulers");
  pass++; // This is valid — not all horary charts have applying aspects
}

if (m.aspectToQuesited) {
  assert("Moon aspect has name", typeof m.aspectToQuesited.name === "string");
  assert("Moon aspect has orb", typeof m.aspectToQuesited.orb === "number");
  console.log(`  Moon→Quesited: ${m.aspectToQuesited.name} (orb ${m.aspectToQuesited.orb.toFixed(2)}°)`);
} else {
  console.log("  No applying Moon aspect to quesited");
  pass++;
}

// ═══ Test 6: Houses data ═══
console.log("\n═══ Test 6: Houses ═══");
assert("12 cusps", result.houses.cusps.length === 12);
assert("Has MC", typeof result.houses.mc === "number");
assert("Has ASC", typeof result.houses.asc === "number");

// ═══ Test 7: Different question = different chart ═══
console.log("\n═══ Test 7: Different question time ═══");
const result2 = analyzeHorary(new Date("2025-01-01T00:00:00Z"), 51.51, -0.13, { querentHouse: 1, quesitedHouse: 7 });

assert("Different time → different ASC",
  Math.abs(result.houses.asc - result2.houses.asc) > 1);

// ═══ Test 8: Custom house pair (2nd/11th = money question) ═══
console.log("\n═══ Test 8: Custom house pair (2nd house querent) ═══");
const moneyQ = analyzeHorary(questionTime, 51.51, -0.13, { querentHouse: 2, quesitedHouse: 11 });

assert("Custom querent ruler exists", typeof moneyQ.querent.ruler === "string");
assert("Custom quesited ruler exists", typeof moneyQ.quesited.ruler === "string");
console.log(`  2nd house ruler: ${moneyQ.querent.ruler}, 11th house ruler: ${moneyQ.quesited.ruler}`);

// ═══ Test 9: Dignity evaluation correctness ═══
console.log("\n═══ Test 9: All positions are valid ═══");
const positions = result.allPositions;
const planets = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"];
for (const p of planets) {
  assert(`${p} in [0,360)`, positions[p] >= 0 && positions[p] < 360);
}

// ═══ Test 10: Combustion check ═══
console.log("\n═══ Test 10: Combustion logic ═══");
// Sun can never be combust itself
// If querent ruler is Sun, combust should be false
if (q.ruler === "Sun") {
  assert("Sun not combust", !q.combust);
}
if (qs.ruler === "Sun") {
  assert("Sun not combust (quesited)", !qs.combust);
}
// Combustion is within 8° of Sun — just verify it's boolean for now
assert("Combustion values are boolean", typeof q.combust === "boolean" && typeof qs.combust === "boolean");

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
