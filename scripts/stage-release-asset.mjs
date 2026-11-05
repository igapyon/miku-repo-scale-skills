import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const tag = process.env.RELEASE_TAG ?? "";
if (!/^v[0-9]+\.[0-9]+\.[0-9]+(?:\.[0-9]+)*$/.test(tag) ||
    !(tag === `v${pkg.version}` || tag.startsWith(`v${pkg.version}.`))) {
  throw new Error("Release tag must match package version, optionally with numeric dot suffixes");
}
const from = path.join(root, "bundle", `igapyon-${pkg.name}-${pkg.version}.zip`);
const to = path.join(root, "release-assets", `igapyon-${pkg.name}-${tag.slice(1)}.zip`);
mkdirSync(path.dirname(to), { recursive: true });
copyFileSync(from, to);
process.stdout.write(`${path.relative(root, to).split(path.sep).join("/")}\n`);
