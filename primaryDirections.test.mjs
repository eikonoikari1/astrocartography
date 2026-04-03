/**
 * primaryDirections.test.mjs — Test the research-only primary-directions spec module
 * Run: node primaryDirections.test.mjs
 */
import {
  PRIMARY_DIRECTIONS_METADATA,
  PRIMARY_DIRECTIONS_DEFAULT_METHOD_BUNDLE_ID,
  PRIMARY_DIRECTIONS_METHOD_BUNDLES,
  PRIMARY_DIRECTIONS_COMPATIBILITY_WARNINGS,
  buildPrimaryDirectionsReport,
  getPrimaryDirectionsCompatibilityWarnings,
  getPrimaryDirectionsMethodBundle,
  listPrimaryDirectionsMethodBundles,
  resolvePrimaryDirectionsMethodBundle,
} from "./primaryDirections.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

console.log("\n═══ Test 1: Core metadata ═══");
assert("Technique is primary directions", PRIMARY_DIRECTIONS_METADATA.technique === "primary directions");
assert("Mode is research-only", PRIMARY_DIRECTIONS_METADATA.mode === "research-only");
assert("Cannot compute directions yet", PRIMARY_DIRECTIONS_METADATA.canComputeDirections === false);
assert("Cannot rectify yet", PRIMARY_DIRECTIONS_METADATA.canRectify === false);
assert("Default bundle id is zodiacal-static-ptolemy-direct", PRIMARY_DIRECTIONS_DEFAULT_METHOD_BUNDLE_ID === "zodiacal-static-ptolemy-direct");

console.log("\n═══ Test 2: Method bundles ═══");
const bundleList = listPrimaryDirectionsMethodBundles();
assert("Bundle list is an array", Array.isArray(bundleList));
assert("Bundle list includes four bundles", bundleList.length === 4, `got ${bundleList.length}`);
assert("Default bundle exists", !!getPrimaryDirectionsMethodBundle(PRIMARY_DIRECTIONS_DEFAULT_METHOD_BUNDLE_ID));
assert("Unknown bundle returns null", getPrimaryDirectionsMethodBundle("missing") === null);

const defaultBundle = PRIMARY_DIRECTIONS_METHOD_BUNDLES[PRIMARY_DIRECTIONS_DEFAULT_METHOD_BUNDLE_ID];
assert("Default bundle family is zodiacal", defaultBundle.family === "zodiacal");
assert("Default bundle direction is direct", defaultBundle.direction === "direct");
assert("Default bundle time key is Ptolemy", defaultBundle.timeKey === "Ptolemy");

console.log("\n═══ Test 3: Frozen defaults ═══");
assert("Metadata is frozen", Object.isFrozen(PRIMARY_DIRECTIONS_METADATA));
assert("Bundle map is frozen", Object.isFrozen(PRIMARY_DIRECTIONS_METHOD_BUNDLES));
assert("Default bundle is frozen", Object.isFrozen(defaultBundle));
assert("Compatibility warnings are frozen", Object.isFrozen(PRIMARY_DIRECTIONS_COMPATIBILITY_WARNINGS));

let mutationFailed = false;
try {
  PRIMARY_DIRECTIONS_METADATA.mode = "computed";
} catch {
  mutationFailed = true;
}
assert("Metadata resists mutation", mutationFailed || PRIMARY_DIRECTIONS_METADATA.mode === "research-only");

console.log("\n═══ Test 4: Compatibility warnings ═══");
assert("Base warnings exist", PRIMARY_DIRECTIONS_COMPATIBILITY_WARNINGS.length >= 4);
const zodiacalWarnings = getPrimaryDirectionsCompatibilityWarnings("zodiacal-static-ptolemy-direct");
const mundaneWarnings = getPrimaryDirectionsCompatibilityWarnings("mundane-static-ptolemy-direct");
const topocentricWarnings = getPrimaryDirectionsCompatibilityWarnings("topocentric-static-ptolemy-direct");
assert("Zodiacal warnings are returned", zodiacalWarnings.length > PRIMARY_DIRECTIONS_COMPATIBILITY_WARNINGS.length);
assert("Mundane warnings mention geometry", mundaneWarnings.some(w => /meridian-distance|mundane/i.test(w.detail) || /mundane/i.test(w.title)));
assert("Topocentric warnings mention incompatibility", topocentricWarnings.some(w => /incompatible|external|separate/i.test(w.detail) || /Topocentric/i.test(w.title)));

console.log("\n═══ Test 5: Honest report helper ═══");
const report = buildPrimaryDirectionsReport({ methodBundleId: "topocentric-static-ptolemy-direct" });
assert("Report is research-only", report.mode === "research-only");
assert("Report is not a computed engine", report.supported === false && report.canRectify === false);
assert("Report preserves requested bundle", report.requestedMethodBundleId === "topocentric-static-ptolemy-direct");
assert("Report resolves requested bundle", report.resolvedMethodBundleId === "topocentric-static-ptolemy-direct");
assert("Report has compatibility warnings", Array.isArray(report.compatibilityWarnings) && report.compatibilityWarnings.length > 0);
assert("Report exposes CLI shape", report.cliShape.command === "primary-directions" && report.cliShape.availableNow === false);

console.log("\n═══ Test 6: Fallback behavior ═══");
const fallback = resolvePrimaryDirectionsMethodBundle("not-a-real-bundle");
assert("Fallback reports usedFallback", fallback.usedFallback === true);
assert("Fallback resolves to default bundle", fallback.resolvedId === PRIMARY_DIRECTIONS_DEFAULT_METHOD_BUNDLE_ID, fallback.resolvedId);
assert("Fallback bundle is default bundle", fallback.bundle.id === PRIMARY_DIRECTIONS_DEFAULT_METHOD_BUNDLE_ID);
assert("Fallback includes a reason", typeof fallback.fallbackReason === "string" && fallback.fallbackReason.length > 0);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
