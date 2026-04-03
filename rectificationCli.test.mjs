/**
 * rectificationCli.test.mjs — CLI coverage for new rectification technique commands
 * Run: node rectificationCli.test.mjs
 */
import { execFileSync } from "node:child_process";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

function run(command, options = {}) {
  const stdout = execFileSync("node", ["astro.mjs", command, JSON.stringify(options)], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  return JSON.parse(stdout);
}

console.log("\n═══ Test 1: transits-to-angles CLI ═══");
{
  const result = run("transits-to-angles", {
    birthDate: "2002-09-28T12:45:00Z",
    lat: 56.01,
    lon: 92.867,
    start: "2025-01-01",
    end: "2025-12-31",
    majorOnly: true,
    angles: ["MC", "ASC"],
  });
  assert("Angle targets returned", result.angleTargets && typeof result.angleTargets.MC === "number");
  assert("Requested angle subset respected", Object.keys(result.angleTargets).length === 2);
  assert("Transits array returned", Array.isArray(result.transits));
}

console.log("\n═══ Test 2: progressions CLI with angles ═══");
{
  const result = run("progressions", {
    birthDate: "2002-09-28T12:45:00Z",
    startAge: 10,
    endAge: 10,
    lat: 56.01,
    lon: 92.867,
    includeAngles: true,
    angleMethod: "dateCast",
  });
  assert("Progressions returns one row", Array.isArray(result) && result.length === 1);
  assert("Progressions include houses", typeof result[0].houses.asc === "number");
  assert("Progressions preserve angle method", result[0].angleMethod === "dateCast");
}

console.log("\n═══ Test 3: solar-arc CLI ═══");
{
  const result = run("solar-arc", {
    birthDate: "2002-09-28T12:45:00Z",
    ageYears: 10,
    method: "true",
    lat: 56.01,
    lon: 92.867,
  });
  assert("Solar arc includes directed longitudes", typeof result.directedLongitudes.Sun === "number");
  assert("Solar arc includes directed angles", typeof result.directedAngles.ASC === "number");
  assert("Solar arc labels angle mode", result.angleMode === "ecliptic-approximation");
}

console.log("\n═══ Test 4: profections CLI ═══");
{
  const result = run("profections", {
    birthDate: "2002-09-28T12:45:00Z",
    ascLon: 53.79,
    age: 3,
  });
  assert("Profection returns house", result.profectedHouse === 4, `got ${result.profectedHouse}`);
  assert("Profection returns year lord", typeof result.yearLord === "string");
}

console.log("\n═══ Test 5: solar-return CLI policy output ═══");
{
  const result = run("solar-return", {
    birthDate: "2002-09-28T12:45:00Z",
    natalSunLon: 185.218784,
    year: 2025,
    lat: 56.01,
    lon: 92.867,
    searchWindowDays: 7,
    returnLocationPolicy: "relocated",
  });
  assert("Solar return preserves policy", result.returnLocationPolicy === "relocated");
  assert("Solar return preserves search window", result.searchWindowDays === 7);
}

console.log("\n═══ Test 6: zodiacal-releasing CLI metadata ═══");
{
  const result = run("zodiacal-releasing", {
    birthDate: "2002-09-28T12:45:00Z",
    sunLon: 185.218784,
    moonLon: 81.5068,
    ascLon: 53.79,
    years: 10,
    maxLevel: 4,
    lotType: "spirit",
    dayChart: false,
    calendar: "tropical365",
  });
  assert("ZR lotType preserved", result.lotType === "spirit");
  assert("ZR calendar preserved", result.calendar === "tropical365");
  assert("ZR can emit level 4 periods", result.periods.some(p => p.level === 4));
}

console.log("\n═══ Test 7: primary-directions CLI honesty ═══");
{
  const result = run("primary-directions", {
    methodBundleId: "topocentric-static-ptolemy-direct",
  });
  assert("Primary directions is research only", result.mode === "research-only");
  assert("Primary directions is not yet available", result.cliShape.availableNow === false);
  assert("Primary directions returns active bundle", result.activeMethodBundle.id === "topocentric-static-ptolemy-direct");
}

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
