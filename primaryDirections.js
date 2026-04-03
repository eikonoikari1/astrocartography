const DEFAULT_METHOD_BUNDLE_ID = "zodiacal-static-ptolemy-direct";

function deepFreeze(value) {
  if (value == null) return value;
  if (typeof value !== "object" && typeof value !== "function") return value;
  if (Object.isFrozen(value)) return value;

  Object.freeze(value);

  for (const key of Object.getOwnPropertyNames(value)) {
    const child = value[key];
    if (child && (typeof child === "object" || typeof child === "function")) {
      deepFreeze(child);
    }
  }

  return value;
}

function buildBundle({
  id,
  label,
  family,
  direction,
  timeKey,
  status,
  summary,
  requires,
  notes,
}) {
  return deepFreeze({
    id,
    label,
    family,
    direction,
    timeKey,
    status,
    summary,
    requires: [...requires],
    notes: [...notes],
  });
}

const METHOD_BUNDLE_DEFINITIONS = [
  buildBundle({
    id: "zodiacal-static-ptolemy-direct",
    label: "Zodiacal, static Ptolemy, direct",
    family: "zodiacal",
    direction: "direct",
    timeKey: "Ptolemy",
    status: "research-default",
    summary: "Canonical research bundle for a first native implementation pass.",
    requires: [
      "equatorial coordinates",
      "oblique ascension",
      "candidate event arcs",
    ],
    notes: [
      "Use this as the default bundle for honest CLI reporting.",
      "Do not treat this as a production-ready directions engine.",
    ],
  }),
  buildBundle({
    id: "zodiacal-static-ptolemy-converse",
    label: "Zodiacal, static Ptolemy, converse",
    family: "zodiacal",
    direction: "converse",
    timeKey: "Ptolemy",
    status: "comparison-only",
    summary: "Useful for benchmarking sign-convention and arc-direction handling.",
    requires: [
      "equatorial coordinates",
      "oblique ascension",
      "candidate event arcs",
    ],
    notes: [
      "Converse directions must be labeled explicitly in any output.",
    ],
  }),
  buildBundle({
    id: "mundane-static-ptolemy-direct",
    label: "Mundane, static Ptolemy, direct",
    family: "mundane",
    direction: "direct",
    timeKey: "Ptolemy",
    status: "research-only",
    summary: "Requires meridian distance and semi-arc handling that the current engine does not expose.",
    requires: [
      "RAMC",
      "meridian distance",
      "semi-arcs",
      "oblique ascension",
    ],
    notes: [
      "Treat as a separate geometry path, not a variant of transits or progressions.",
    ],
  }),
  buildBundle({
    id: "topocentric-static-ptolemy-direct",
    label: "Topocentric / Polich-Page, static Ptolemy, direct",
    family: "topocentric",
    direction: "direct",
    timeKey: "Ptolemy",
    status: "research-only",
    summary: "High-specificity research bundle with the strongest incompatibility to the current engine.",
    requires: [
      "topocentric geometry",
      "RAMC",
      "meridian distance",
      "semi-arcs",
      "oblique ascension",
    ],
    notes: [
      "Keep this isolated until benchmarked against an external oracle.",
    ],
  }),
];

export const PRIMARY_DIRECTIONS_METHOD_BUNDLES = deepFreeze(
  Object.fromEntries(METHOD_BUNDLE_DEFINITIONS.map(bundle => [bundle.id, bundle]))
);

export const PRIMARY_DIRECTIONS_DEFAULT_METHOD_BUNDLE_ID = DEFAULT_METHOD_BUNDLE_ID;

export const PRIMARY_DIRECTIONS_COMPATIBILITY_WARNINGS = deepFreeze([
  {
    id: "no-native-solver",
    level: "high",
    title: "No native primary-directions solver exists yet",
    detail: "The current engine has no directional arc engine, so any output must be a spec or research report rather than a computed rectification result.",
  },
  {
    id: "missing-equatorial-layer",
    level: "high",
    title: "Equatorial geometry is not yet a first-class layer",
    detail: "The codebase is longitude-first; primary directions need RAMC, oblique ascension, meridian distance, and semi-arcs to be honest.",
  },
  {
    id: "method-choice-required",
    level: "medium",
    title: "Doctrine choices must be frozen before implementation",
    detail: "Zodiacal versus mundane, direct versus converse, and time-key selection are not interchangeable details.",
  },
  {
    id: "topocentric-separation",
    level: "medium",
    title: "Topocentric / Polich-Page should stay separate from the default bundle",
    detail: "The current house and angle model does not implement that geometry, so it should not be hidden behind a generic directions flag.",
  },
]);

export const PRIMARY_DIRECTIONS_METADATA = deepFreeze({
  technique: "primary directions",
  mode: "research-only",
  supported: false,
  canComputeDirections: false,
  canRectify: false,
  defaultMethodBundleId: DEFAULT_METHOD_BUNDLE_ID,
  methodBundleIds: Object.keys(PRIMARY_DIRECTIONS_METHOD_BUNDLES),
  recommendedImplementationOrder: [
    "zodiacal-static-ptolemy-direct",
    "zodiacal-static-ptolemy-converse",
    "mundane-static-ptolemy-direct",
    "topocentric-static-ptolemy-direct",
  ],
});

function getMethodBundle(id = DEFAULT_METHOD_BUNDLE_ID) {
  return PRIMARY_DIRECTIONS_METHOD_BUNDLES[id] ?? null;
}

function resolveMethodBundle(id = DEFAULT_METHOD_BUNDLE_ID) {
  const requestedId = id ?? DEFAULT_METHOD_BUNDLE_ID;
  const bundle = getMethodBundle(requestedId);
  if (bundle) {
    return deepFreeze({
      requestedId,
      resolvedId: requestedId,
      usedFallback: false,
      fallbackReason: null,
      bundle,
    });
  }

  return deepFreeze({
    requestedId,
    resolvedId: DEFAULT_METHOD_BUNDLE_ID,
    usedFallback: true,
    fallbackReason: `Unknown method bundle: ${requestedId}`,
    bundle: PRIMARY_DIRECTIONS_METHOD_BUNDLES[DEFAULT_METHOD_BUNDLE_ID],
  });
}

function compatibilityWarningsForBundle(bundle) {
  const warnings = [...PRIMARY_DIRECTIONS_COMPATIBILITY_WARNINGS];

  if (!bundle) return deepFreeze(warnings);

  if (bundle.family === "zodiacal") {
    warnings.push({
      id: `${bundle.id}:ecliptic-approximation`,
      level: "medium",
      title: "Zodiacal directions still need a real direction solver",
      detail: "A zodiacal bundle is a mathematically cleaner research starting point, but it still cannot be returned as a computed rectification answer without a dedicated arc engine.",
    });
  }

  if (bundle.family === "mundane") {
    warnings.push({
      id: `${bundle.id}:mundane-geometry`,
      level: "high",
      title: "Mundane directions need meridian-distance math",
      detail: "The current engine does not expose the semi-arc and meridian-distance pipeline needed for honest mundane directions.",
    });
  }

  if (bundle.family === "topocentric") {
    warnings.push({
      id: `${bundle.id}:topocentric-geometry`,
      level: "high",
      title: "Topocentric / Polich-Page needs an external or separate geometry layer",
      detail: "This bundle should be treated as incompatible with the current engine until a dedicated implementation is benchmarked.",
    });
  }

  if (bundle.direction === "converse") {
    warnings.push({
      id: `${bundle.id}:converse-labelling`,
      level: "low",
      title: "Converse mode must stay explicitly labeled",
      detail: "Converse directions should never be silently collapsed into direct directions in the CLI or JSON payloads.",
    });
  }

  return deepFreeze(warnings);
}

export function listPrimaryDirectionsMethodBundles() {
  return deepFreeze(Object.values(PRIMARY_DIRECTIONS_METHOD_BUNDLES).map(bundle => ({
    id: bundle.id,
    label: bundle.label,
    family: bundle.family,
    direction: bundle.direction,
    timeKey: bundle.timeKey,
    status: bundle.status,
    summary: bundle.summary,
  })));
}

export function getPrimaryDirectionsMethodBundle(id = DEFAULT_METHOD_BUNDLE_ID) {
  return getMethodBundle(id);
}

export function resolvePrimaryDirectionsMethodBundle(id = DEFAULT_METHOD_BUNDLE_ID) {
  return resolveMethodBundle(id);
}

export function getPrimaryDirectionsCompatibilityWarnings(id = DEFAULT_METHOD_BUNDLE_ID) {
  const resolved = resolveMethodBundle(id);
  return compatibilityWarningsForBundle(resolved.bundle);
}

export function buildPrimaryDirectionsReport(options = {}) {
  const resolved = resolveMethodBundle(options.methodBundleId);
  const bundle = resolved.bundle;

  return deepFreeze({
    ...PRIMARY_DIRECTIONS_METADATA,
    requestedMethodBundleId: resolved.requestedId,
    resolvedMethodBundleId: resolved.resolvedId,
    usedFallback: resolved.usedFallback,
    fallbackReason: resolved.fallbackReason,
    activeMethodBundle: bundle,
    compatibilityWarnings: compatibilityWarningsForBundle(bundle),
    cliShape: {
      command: "primary-directions",
      availableNow: false,
      honestPayload: true,
      note: "This module is spec-only until the CLI is wired up.",
    },
  });
}

export default PRIMARY_DIRECTIONS_METADATA;
