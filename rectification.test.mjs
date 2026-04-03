import { execFileSync } from "node:child_process";
import { buildCandidateGrid } from "./rectification/index.js";

let pass = 0;
let fail = 0;

function assert(label, ok, detail) {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
    return;
  }
  fail++;
  console.log(`  FAIL  ${label}  ${detail || ""}`);
}

function runRectify(options) {
  const stdout = execFileSync("node", ["astro.mjs", "rectify", JSON.stringify(options)], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  return JSON.parse(stdout);
}

console.log("\n═══ Test 1: candidate grid generation ═══");
{
  const grid = buildCandidateGrid({
    birthDate: "2002-09-28",
    timezone: "Asia/Krasnoyarsk",
    stepMinutes: 60,
  });
  assert("24 hourly bins generated", grid.length === 24, `got ${grid.length}`);
  assert("Grid preserves local time label", grid[12].localTime === "12:00", `got ${grid[12].localTime}`);
  assert("Grid preserves second label", grid[12].localTimeWithSeconds === "12:00:00", `got ${grid[12].localTimeWithSeconds}`);
}

console.log("\n═══ Test 2: rectify CLI end-to-end ═══");
{
  const result = runRectify({
    birthDate: "2002-09-28",
    lat: 56.01,
    lon: 92.867,
    timezone: "Asia/Krasnoyarsk",
    stepMinutes: 120,
    topN: 3,
    events: [
      { label: "Public pivot", timestamp: "2025-06-15T12:00:00Z" },
      { label: "Relationship chapter", date: "2024-03-20" },
      { label: "Relocation window", start: "2023-08-01", end: "2023-08-05" },
    ],
  });

  assert("Rectify returns ranked candidates", Array.isArray(result.topCandidates) && result.topCandidates.length === 3);
  assert("Rectify returns explanation traces", Array.isArray(result.topCandidates[0].explanationTrace) && result.topCandidates[0].explanationTrace.length > 0);
  assert("Rectify returns interval", result.uncertaintyInterval && typeof result.uncertaintyInterval.startLocalTime === "string");
  assert(
    "Progressions preserve dateCast doctrine",
    result.topCandidates[0].explanationTrace.some(item => item.technique === "secondary-progressions" && item.angleMethod === "dateCast")
  );
  assert(
    "Solar arc labels true vs mean and approximation mode",
    result.topCandidates[0].explanationTrace.some(item => item.technique === "solar-arc" && item.method === "true" && item.angleMode === "ecliptic-approximation")
  );
}

console.log("\n═══ Test 3: rectify respects local time window ═══");
{
  const result = runRectify({
    birthDate: "2002-09-28",
    lat: 56.01,
    lon: 92.867,
    timezone: "Asia/Krasnoyarsk",
    stepMinutes: 5,
    startTime: "20:35",
    endTime: "20:55",
    topN: 10,
    events: [
      { label: "Relocation", date: "2025-03-21" },
    ],
  });

  assert("Windowed search returns four 5-minute bins", result.candidateCount === 4, `got ${result.candidateCount}`);
  assert("Window start preserved", result.startMinute === 20 * 60 + 35, `got ${result.startMinute}`);
  assert("Window end preserved", result.endMinute === 20 * 60 + 55, `got ${result.endMinute}`);
  assert(
    "All candidates stay within requested window",
    result.topCandidates.every(candidate => candidate.localTime >= "20:35" && candidate.localTime < "20:55")
  );
}

console.log("\n═══ Test 4: rectify supports second-level bins ═══");
{
  const result = runRectify({
    birthDate: "2002-09-28",
    lat: 56.01,
    lon: 92.867,
    timezone: "Asia/Krasnoyarsk",
    stepSeconds: 10,
    startTime: "20:43:00",
    endTime: "20:43:40",
    topN: 10,
    events: [
      { label: "Relocation", date: "2025-03-21" },
    ],
  });

  assert("Second-level search returns four bins", result.candidateCount === 4, `got ${result.candidateCount}`);
  assert("Second-level step preserved", result.stepSeconds === 10, `got ${result.stepSeconds}`);
  assert("Second-level local time rendered", result.topCandidates[0].localTimeWithSeconds.startsWith("20:43:"));
}

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
