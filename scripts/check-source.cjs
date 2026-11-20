const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

const files = ["frontend/src", "backend/src"].flatMap((directory) => walk(path.join(root, directory)));
// Compare actual directory entries, including case, so Windows cannot hide Linux import failures.
const exactPaths = new Set(files);
let errors = 0;
for (const file of files.filter((file) => /\.(js|jsx)$/.test(file))) {
  const source = fs.readFileSync(file, "utf8");
  const imports = source.matchAll(/(?:from\s*|import\s*|jest\.mock\(\s*)["'](\.[^"']+)["']/g);
  for (const [, specifier] of imports) {
    const target = path.resolve(path.dirname(file), specifier);
    if (![target, `${target}.js`, `${target}.jsx`, path.join(target, "index.js")].some((candidate) => exactPaths.has(candidate))) {
      console.error(`${path.relative(root, file)}: missing or incorrectly cased import ${specifier}`);
      errors++;
    }
  }
  if (file.startsWith(path.join(root, "backend", "src"))) {
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.status !== 0) {
      console.error(result.stderr || result.error?.message);
      errors++;
    }
  }
}
if (errors) process.exitCode = 1;
else console.log("All local imports match file casing; server syntax checks passed.");
