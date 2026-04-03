import { castChart } from "./chartCaster.js";
import { computeLines, computeLinesFromChart, summarizeLines } from "./lines.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

const dt = new Date("2002-09-28T12:45:00Z");

console.log("\n═══ Test 1: Shared line engine matches cast chart output ═══");
const chart = castChart(dt);
const fromChart = computeLinesFromChart(chart);
const fromDate = computeLines(dt);
assert("Line count matches between entrypoints", fromChart.lines.length === fromDate.lines.length, `${fromChart.lines.length} vs ${fromDate.lines.length}`);
assert("Ecliptic longitudes reuse chart values", fromDate.eclipticLongitudes.Sun === chart.eclipticLongitudes.Sun);

console.log("\n═══ Test 2: Expected line structure ═══");
const verticalCount = fromDate.lines.filter(line => line.type === "vertical").length;
const curveCount = fromDate.lines.filter(line => line.type === "curve").length;
assert("20 vertical lines returned", verticalCount === 20, `got ${verticalCount}`);
assert("20 curve lines returned", curveCount === 20, `got ${curveCount}`);

console.log("\n═══ Test 3: Summary keeps lightweight curve metadata ═══");
const summary = summarizeLines(fromDate.lines);
const sampleCurve = summary.find(line => line.type === "curve");
assert("Summary preserves line count", summary.length === fromDate.lines.length);
assert("Curve summary has pointCount", typeof sampleCurve?.pointCount === "number");
assert("Curve summary omits raw points", !("points" in sampleCurve), JSON.stringify(sampleCurve));

console.log("\n═══ Test 4: Invalid line-engine options fail fast ═══");
let stepError;
try {
  computeLinesFromChart(chart, { stepDegrees: 0 });
} catch (err) {
  stepError = err;
}
assert("Zero step size throws", stepError instanceof TypeError, stepError?.message);

let rangeError;
try {
  computeLinesFromChart(chart, { minLatitude: 10, maxLatitude: -10 });
} catch (err) {
  rangeError = err;
}
assert("Inverted latitude range throws", rangeError instanceof TypeError, rangeError?.message);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
