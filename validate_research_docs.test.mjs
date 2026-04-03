import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DOC_ROOT = path.join(ROOT, "research");
const REQUIRED_TECHNIQUE_HEADINGS = [
  "## Technique Profile",
  "## What Question This Answers",
  "## Use When",
  "## Do Not Use When",
  "## How to Read It",
  "## What Not to Do",
  "## Current App Support",
  "## Related Techniques",
];

let pass = 0;
let fail = 0;

function assert(label, ok, detail = "") {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
    return;
  }
  fail++;
  console.log(`  FAIL  ${label}  ${detail}`);
}

function walkMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(fullPath);
  }
  return files;
}

function extractLocalLinks(content) {
  const matches = [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)];
  return matches
    .map(match => match[1])
    .filter(link => !link.startsWith("http://") && !link.startsWith("https://") && !link.startsWith("#"));
}

function resolveLinkTarget(filePath, link) {
  const [target] = link.split("#");
  if (!target) return null;
  return path.resolve(path.dirname(filePath), target);
}

const docs = [
  path.join(ROOT, "RESEARCH_advanced_techniques.md"),
  path.join(ROOT, "RESEARCH_interpretation_guide.md"),
  ...walkMarkdownFiles(DOC_ROOT),
];

console.log("\n═══ Test 1: All local markdown links resolve ═══");
for (const doc of docs) {
  const content = fs.readFileSync(doc, "utf8");
  const links = extractLocalLinks(content);
  for (const link of links) {
    const targetPath = resolveLinkTarget(doc, link);
    if (!targetPath) continue;
    assert(`${path.relative(ROOT, doc)} -> ${link}`, fs.existsSync(targetPath), targetPath);
  }
}

console.log("\n═══ Test 2: Technique leaf pages follow the shared template ═══");
const techniqueLeafPages = walkMarkdownFiles(path.join(DOC_ROOT, "techniques"))
  .filter(file => path.basename(file) !== "README.md");

for (const page of techniqueLeafPages) {
  const content = fs.readFileSync(page, "utf8");
  for (const heading of REQUIRED_TECHNIQUE_HEADINGS) {
    assert(`${path.relative(ROOT, page)} has ${heading}`, content.includes(heading));
  }
}

console.log("\n═══ Test 3: Transition artifacts exist ═══");
assert("Top-level advanced techniques file points to new research tree",
  fs.readFileSync(path.join(ROOT, "RESEARCH_advanced_techniques.md"), "utf8").includes("[research/README.md](./research/README.md)"));
assert("Archived monolith exists", fs.existsSync(path.join(DOC_ROOT, "archive", "advanced-techniques-monolith.md")));

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
