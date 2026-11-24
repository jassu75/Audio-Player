const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const ts = require(path.join(root, "frontend/node_modules/typescript"));
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const files = ["frontend/src", "backend/src"].flatMap((directory) =>
  walk(path.join(root, directory)),
);
const exactPaths = new Set(files);
let errors = 0;
if (fs.existsSync(path.join(root, "frontend", "src", "types"))) {
  console.error("Frontend types must be colocated with their owners");
  errors++;
}
for (const file of files.filter(
  (file) =>
    file.startsWith(path.join(root, "frontend", "src")) &&
    /\.(js|jsx)$/.test(file),
)) {
  console.error(
    `${path.relative(root, file)}: frontend source must use TypeScript`,
  );
  errors++;
}
for (const file of files.filter((file) => /\.(js|jsx|ts|tsx)$/.test(file))) {
  const source = fs.readFileSync(file, "utf8");
  const isFrontend = file.startsWith(path.join(root, "frontend", "src"));
  const isTypesFile = path.dirname(file).split(path.sep).includes("types");
  if (isFrontend) {
    if (isTypesFile && !file.endsWith(".types.ts")) {
      console.error(
        `${path.relative(root, file)}: type files must use the .types.ts suffix`,
      );
      errors++;
    }
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const checkTypes = (node) => {
      if (
        !isTypesFile &&
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node))
      ) {
        console.error(
          `${path.relative(root, file)}: move named types into the owning folder’s types/*.types.ts`,
        );
        errors++;
      }
      ts.forEachChild(node, checkTypes);
    };
    checkTypes(ast);
  }
  const imports = source.matchAll(
    /(?:from\s*|import\s*|(?:jest|vi)\.mock\(\s*)["'](\.[^"']+)["']/g,
  );
  for (const [, specifier] of imports) {
    const target = path.resolve(path.dirname(file), specifier);
    if (
      ![
        target,
        `${target}.js`,
        `${target}.jsx`,
        `${target}.ts`,
        `${target}.tsx`,
        path.join(target, "index.js"),
      ].some((candidate) => exactPaths.has(candidate))
    ) {
      console.error(
        `${path.relative(root, file)}: missing or incorrectly cased import ${specifier}`,
      );
      errors++;
    }
  }
  if (file.startsWith(path.join(root, "backend", "src"))) {
    const result = spawnSync(process.execPath, ["--check", file], {
      encoding: "utf8",
    });
    if (result.status !== 0) {
      console.error(result.stderr || result.error?.message);
      errors++;
    }
  }
}
if (errors) process.exitCode = 1;
else
  console.log(
    "All local imports match file casing; server syntax checks passed.",
  );
