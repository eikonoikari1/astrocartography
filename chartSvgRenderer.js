import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ASTROCHART2_BUNDLE_PATH = path.join(ROOT_DIR, "node_modules", "astrochart2", "dist", "astrochart2.js");
const ASTROCHART2_FONT_PATH = path.join(
  ROOT_DIR,
  "node_modules",
  "astrochart2",
  "assets",
  "fonts",
  "ttf",
  "AstronomiconFonts_1.1",
  "Astronomicon.ttf"
);
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const CHART_PADDING = 40;
const LEVELS = 24;
const CENTER_RADIUS_LEVEL = 12;
const RULER_RADIUS_LEVEL = 20;
const MAIN_AXIS_INDEXES = new Set([0, 3, 6, 9]);
const ASPECT_SYMBOL_CODE = {
  conjunction: "!",
  opposition: "\"",
  square: "#",
  trine: "$",
  sextile: "%",
  quincunx: "&",
  semisextile: "''",
  octile: "(",
  trioctile: ")",
};
const ASPECT_COLOR = {
  conjunction: "#6b7280",
  opposition: "#1d4ed8",
  square: "#9f1239",
  trine: "#047857",
  sextile: "#6d28d9",
  quincunx: "#92400e",
  semisextile: "#6b7280",
  octile: "#6b7280",
  trioctile: "#6b7280",
};

function assertRenderer(condition, message) {
  if (!condition) throw new TypeError(message);
}

function defaultOutputPath(datetime) {
  const isoStamp = datetime.toISOString().replace(/[:.]/g, "-");
  return path.resolve(ROOT_DIR, "generated", "charts", `chart-${isoStamp}.svg`);
}

async function loadAstrologyChart2Bundle() {
  return readFile(ASTROCHART2_BUNDLE_PATH, "utf8");
}

async function loadAstronomiconFontDataUrl() {
  const fontBytes = await readFile(ASTROCHART2_FONT_PATH);
  return `data:font/ttf;base64,${fontBytes.toString("base64")}`;
}

function createFontStyle(window, fontDataUrl) {
  const style = window.document.createElementNS(SVG_NAMESPACE, "style");
  style.textContent = `
@font-face {
  font-family: "Astronomicon";
  src: url("${fontDataUrl}") format("truetype");
}
`;
  return style;
}

function createSvgElement(window, tagName) {
  return window.document.createElementNS(SVG_NAMESPACE, tagName);
}

function degreeToRadian(angleInDegree, shiftInDegree = 0) {
  return (shiftInDegree - angleInDegree) * Math.PI / 180;
}

function positionOnCircle(cx, cy, radius, angleInRadians) {
  return {
    x: radius * Math.cos(angleInRadians) + cx,
    y: radius * Math.sin(angleInRadians) + cy,
  };
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function normalizeAspectType(type) {
  return String(type ?? "").trim().toLowerCase();
}

function findCuspGroup(radixRoot) {
  return Array.from(radixRoot.children).find(group => {
    const labels = Array.from(group.querySelectorAll("text"))
      .map(node => node.textContent?.trim())
      .filter(Boolean);
    return labels.length === 12 && labels.every((label, index) => label === String(index + 1));
  });
}

function findPointsGroup(radixRoot, pointCount) {
  return Array.from(radixRoot.children).find(group => {
    if (group.tagName !== "g") return false;
    const symbolWrappers = Array.from(group.children).filter(child => child.tagName === "g");
    return symbolWrappers.length === pointCount;
  });
}

function createBackgroundRect(window, width, height) {
  const rect = createSvgElement(window, "rect");
  rect.setAttribute("data-role", "full-background");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", String(width));
  rect.setAttribute("height", String(height));
  rect.setAttribute("fill", "#ffffff");
  return rect;
}

function formatAngleInSign(angle) {
  const signAngle = normalizeAngle(angle) % 30;
  let degrees = Math.floor(signAngle);
  let minutes = Math.round((signAngle - degrees) * 60);
  if (minutes === 60) {
    degrees += 1;
    minutes = 0;
  }
  return `${degrees}°${String(minutes).padStart(2, "0")}′`;
}

function addPointPropertyLabels(window, radixRoot, data, width, height) {
  const pointsGroup = findPointsGroup(radixRoot, data.points.length);
  if (!pointsGroup) return;

  const centerX = width / 2;
  const centerY = height / 2;
  const symbolWrappers = Array.from(pointsGroup.children).filter(child => child.tagName === "g");

  symbolWrappers.forEach((wrapper, index) => {
    const point = data.points[index];
    if (!point) return;

    const symbol = wrapper.querySelector("text");
    if (!symbol) return;

    const x = Number(symbol.getAttribute("x"));
    const y = Number(symbol.getAttribute("y"));
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    const angleFromSymbolToCenter = Math.atan2(centerY - y, centerX - x);
    const labelRadius = 24;
    const labelX = x - Math.cos(angleFromSymbolToCenter) * labelRadius;
    const labelY = y - Math.sin(angleFromSymbolToCenter) * labelRadius;

    const text = createSvgElement(window, "text");
    const suffix = point.isRetrograde ? " R" : "";
    text.textContent = `${formatAngleInSign(point.angle)}${suffix}`;
    text.setAttribute("x", String(labelX));
    text.setAttribute("y", String(labelY));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-family", "sans-serif");
    text.setAttribute("font-size", "13");
    text.setAttribute("font-weight", "600");
    text.setAttribute("fill", "#374151");
    text.setAttribute("data-role", "point-label");
    wrapper.appendChild(text);
  });
}

function buildAspectRenderList(aspects, data) {
  if (!Array.isArray(aspects)) return [];
  const pointAngleByName = new Map(data.points.map(point => [point.name, point.angle]));

  return aspects.flatMap(aspect => {
    const type = normalizeAspectType(aspect.type ?? aspect.name);
    const p1 = aspect.p1 ?? aspect.from ?? aspect.fromName;
    const p2 = aspect.p2 ?? aspect.to ?? aspect.toName;
    if (!p1 || !p2 || !pointAngleByName.has(p1) || !pointAngleByName.has(p2) || !ASPECT_SYMBOL_CODE[type]) {
      return [];
    }

    return [{
      type,
      p1,
      p2,
      angle1: pointAngleByName.get(p1),
      angle2: pointAngleByName.get(p2),
    }];
  });
}

function drawCustomAspects(window, svg, data, aspects, width, height) {
  const renderList = buildAspectRenderList(aspects, data);
  if (renderList.length === 0) return;

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - CHART_PADDING;
  const centerCircleRadius = CENTER_RADIUS_LEVEL * (radius / LEVELS);
  const shift = normalizeAngle((data.cusps?.[0]?.angle ?? 0) + 180);

  const group = createSvgElement(window, "g");
  group.setAttribute("data-role", "custom-aspects");

  for (const aspect of renderList) {
    const fromPoint = positionOnCircle(cx, cy, centerCircleRadius, degreeToRadian(aspect.angle1, shift));
    const toPoint = positionOnCircle(cx, cy, centerCircleRadius, degreeToRadian(aspect.angle2, shift));
    const color = ASPECT_COLOR[aspect.type] ?? "#6b7280";

    const line1 = createSvgElement(window, "line");
    line1.setAttribute("x1", String(fromPoint.x));
    line1.setAttribute("y1", String(fromPoint.y));
    line1.setAttribute("x2", String(fromPoint.x + (toPoint.x - fromPoint.x) / 2.2));
    line1.setAttribute("y2", String(fromPoint.y + (toPoint.y - fromPoint.y) / 2.2));
    line1.setAttribute("stroke", color);
    line1.setAttribute("stroke-width", "1");
    group.appendChild(line1);

    const line2 = createSvgElement(window, "line");
    line2.setAttribute("x1", String(toPoint.x + (fromPoint.x - toPoint.x) / 2.2));
    line2.setAttribute("y1", String(toPoint.y + (fromPoint.y - toPoint.y) / 2.2));
    line2.setAttribute("x2", String(toPoint.x));
    line2.setAttribute("y2", String(toPoint.y));
    line2.setAttribute("stroke", color);
    line2.setAttribute("stroke-width", "1");
    group.appendChild(line2);

    const symbol = createSvgElement(window, "text");
    symbol.textContent = ASPECT_SYMBOL_CODE[aspect.type];
    symbol.setAttribute("x", String((fromPoint.x + toPoint.x) / 2));
    symbol.setAttribute("y", String((fromPoint.y + toPoint.y) / 2));
    symbol.setAttribute("font-family", "Astronomicon");
    symbol.setAttribute("text-anchor", "middle");
    symbol.setAttribute("dominant-baseline", "middle");
    symbol.setAttribute("font-size", "18");
    symbol.setAttribute("fill", color);
    symbol.setAttribute("data-aspect-type", aspect.type);
    group.appendChild(symbol);
  }

  svg.appendChild(group);
}

function replaceCuspGroup(window, svg, radixRoot, data, width, height) {
  const existingGroup = findCuspGroup(radixRoot);
  if (!existingGroup) return;

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - CHART_PADDING;
  const centerCircleRadius = CENTER_RADIUS_LEVEL * (radius / LEVELS);
  const rulerCircleRadius = RULER_RADIUS_LEVEL * (radius / LEVELS);
  const textRadius = centerCircleRadius + ((rulerCircleRadius - centerCircleRadius) / 10);
  const shift = normalizeAngle((data.cusps?.[0]?.angle ?? 0) + 180);

  const group = createSvgElement(window, "g");
  group.setAttribute("data-role", "cusps");

  for (let i = 0; i < data.cusps.length; i++) {
    const cuspAngle = data.cusps[i].angle;
    const radian = degreeToRadian(cuspAngle, shift);
    const startPos = positionOnCircle(cx, cy, centerCircleRadius, radian);
    const endPos = positionOnCircle(cx, cy, rulerCircleRadius, radian);

    const line = createSvgElement(window, "line");
    line.setAttribute("x1", String(startPos.x));
    line.setAttribute("y1", String(startPos.y));
    line.setAttribute("x2", String(endPos.x));
    line.setAttribute("y2", String(endPos.y));
    line.setAttribute("stroke", MAIN_AXIS_INDEXES.has(i) ? "#111111" : "#8d8d8d");
    line.setAttribute("stroke-width", MAIN_AXIS_INDEXES.has(i) ? "2" : "1");
    group.appendChild(line);

    const startCusp = cuspAngle;
    const endCusp = data.cusps[(i + 1) % 12].angle;
    const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + 360;
    const textAngle = startCusp + gap / 2;
    const textPos = positionOnCircle(cx, cy, textRadius, degreeToRadian(textAngle, shift));

    const text = createSvgElement(window, "text");
    text.textContent = String(i + 1);
    text.setAttribute("x", String(textPos.x));
    text.setAttribute("y", String(textPos.y));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-size", "13.5");
    text.setAttribute("fill", "#8d8d8d");
    group.appendChild(text);
  }

  radixRoot.replaceChild(group, existingGroup);
  svg.setAttribute("style", "background:#ffffff");
}

function ensureFontApis(window) {
  if (!("FontFace" in window)) {
    window.FontFace = class FontFace {
      constructor(family, source, descriptors) {
        this.family = family;
        this.source = source;
        this.descriptors = descriptors;
      }

      async load() {
        return this;
      }
    };
  }

  if (!window.document.fonts) {
    window.document.fonts = { add() {} };
  }
}

export async function renderAstrologyChart2Svg(data, options = {}) {
  const {
    aspects = [],
    width = 800,
    height = 800,
    elementId = "chart-root",
  } = options;

  assertRenderer(data && typeof data === "object", "data must be an object");
  assertRenderer(Number.isFinite(width) && width > 0, "width must be a finite number > 0");
  assertRenderer(Number.isFinite(height) && height > 0, "height must be a finite number > 0");

  const [bundleSource, fontDataUrl] = await Promise.all([
    loadAstrologyChart2Bundle(),
    loadAstronomiconFontDataUrl(),
  ]);

  const dom = new JSDOM(`<!DOCTYPE html><div id="${elementId}"></div>`, {
    pretendToBeVisual: true,
    runScripts: "outside-only",
  });
  const { window } = dom;
  ensureFontApis(window);
  window.eval(bundleSource);

  const universe = new window.astrology.Universe(elementId, {
    CHART_VIEWBOX_WIDTH: width,
    CHART_VIEWBOX_HEIGHT: height,
    DRAW_ASPECTS: false,
    POINT_PROPERTIES_SHOW: false,
  });
  universe.radix().setData(data);

  const svg = window.document.querySelector(`#${elementId} svg`);
  assertRenderer(svg, `AstrologyChart2 did not render an SVG into #${elementId}`);
  const radixRoot = window.document.getElementById(`${elementId}-radix`);
  assertRenderer(radixRoot, `AstrologyChart2 did not create a radix root for #${elementId}`);

  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.insertBefore(createBackgroundRect(window, width, height), svg.firstChild);
  svg.insertBefore(createFontStyle(window, fontDataUrl), svg.firstChild);
  replaceCuspGroup(window, svg, radixRoot, data, width, height);
  addPointPropertyLabels(window, radixRoot, data, width, height);
  drawCustomAspects(window, svg, data, aspects, width, height);

  return svg.outerHTML;
}

export async function writeAstrologyChart2SvgFile(data, options = {}) {
  const datetime = options.datetime instanceof Date && !Number.isNaN(options.datetime.getTime())
    ? options.datetime
    : new Date();
  const outputPath = path.resolve(options.outputPath ?? defaultOutputPath(datetime));
  const svg = await renderAstrologyChart2Svg(data, options);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${svg}\n`, "utf8");

  return {
    outputPath,
    bytes: Buffer.byteLength(svg, "utf8"),
  };
}
