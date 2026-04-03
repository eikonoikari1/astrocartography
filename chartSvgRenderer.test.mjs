import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { DEFAULT_PROFILE } from "./profile.js";
import { buildAstrologyChart2Data } from "./astrologyChart2Adapter.js";
import { renderAstrologyChart2Svg, writeAstrologyChart2SvgFile } from "./chartSvgRenderer.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

const tempDir = mkdtempSync(path.join(os.tmpdir(), "astrocartography-svg-"));

try {
  const dt = new Date(DEFAULT_PROFILE.birth.datetime);
  const wheel = buildAstrologyChart2Data(dt, DEFAULT_PROFILE.birth.lat, DEFAULT_PROFILE.birth.lon);
  const expectedAspectCount = DEFAULT_PROFILE.natal.aspects.length;

  console.log("\n═══ Test 1: Renderer returns standalone SVG markup ═══");
  const svg = await renderAstrologyChart2Svg(wheel.data, { aspects: DEFAULT_PROFILE.natal.aspects });
  assert("SVG markup starts with <svg", svg.startsWith("<svg"), svg.slice(0, 40));
  assert("SVG includes a full white background rect", svg.includes('data-role="full-background"') && svg.includes('fill="#ffffff"'), svg.slice(0, 200));
  assert("SVG embeds Astronomicon font", svg.includes("@font-face") && svg.includes("Astronomicon"), svg.slice(0, 200));
  assert("SVG does not rely on external font URL", !svg.includes("../assets/fonts/ttf"), "found package-relative font URL");
  assert("Cusp group is tagged after post-processing", svg.includes('data-role="cusps"'), "missing custom cusp group");
  assert("Custom aspect group is tagged after post-processing", svg.includes('data-role="custom-aspects"'), "missing custom aspect group");
  assert("There are twelve house labels", (svg.match(/>1<\/text>|>2<\/text>|>3<\/text>|>4<\/text>|>5<\/text>|>6<\/text>|>7<\/text>|>8<\/text>|>9<\/text>|>10<\/text>|>11<\/text>|>12<\/text>/g) || []).length >= 12);
  assert("All profile aspects are rendered", (svg.match(/data-aspect-type="/g) || []).length === expectedAspectCount, `expected ${expectedAspectCount} aspect markers`);
  assert("Point labels include minutes", /data-role="point-label"[^>]*>[^<]*°\d{2}′/.test(svg), "missing degree-minute label");

  console.log("\n═══ Test 2: Renderer writes a real SVG file ═══");
  const outputPath = path.join(tempDir, "chart.svg");
  const written = await writeAstrologyChart2SvgFile(wheel.data, {
    aspects: DEFAULT_PROFILE.natal.aspects,
    datetime: dt,
    outputPath,
  });
  const fileContents = readFileSync(written.outputPath, "utf8");
  assert("Written file exists", statSync(written.outputPath).isFile(), written.outputPath);
  assert("Written file contains SVG", fileContents.includes("<svg") && fileContents.includes("</svg>"), written.outputPath);
  assert("Reported byte count is positive", written.bytes > 0, written.bytes);

  console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
  if (fail > 0) process.exit(1);
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
