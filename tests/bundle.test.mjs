import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const buildScript = join(repoRoot, "scripts/build-skill-bundle.mjs");

function fixture(t, { runtimePresent = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "miku-repo-scale-skill-bundle-"));
  const scripts = join(root, "scripts");
  const skill = join(root, "skills/igapyon-miku-repo-scale");
  mkdirSync(scripts, { recursive: true });
  mkdirSync(join(skill, "runtime"), { recursive: true });
  mkdirSync(join(skill, "lib"), { recursive: true });
  mkdirSync(join(skill, "licenses"), { recursive: true });
  cpSync(buildScript, join(scripts, "build-skill-bundle.mjs"));
  writeFileSync(join(root, "package.json"), JSON.stringify({
    skillRuntimeArtifacts: ["runtime/miku-repo-scale-0.2.5.mjs"],
  }));
  writeFileSync(join(skill, "SKILL.md"), "skill instructions\n");
  writeFileSync(join(skill, "runtime/runtime.json"), '{"artifact":"miku-repo-scale-0.2.5.mjs"}\n');
  writeFileSync(join(skill, "runtime/.gitkeep"), "");
  writeFileSync(join(skill, "lib/run.mjs"), "export {};\n");
  writeFileSync(join(skill, "licenses/THIRD_PARTY_NOTICES.md"), "license notices\n");
  for (const license of [
    "miku-repo-scale-LICENSE",
    "miku-repo-scale-skills-LICENSE",
    "web-tree-sitter-MIT.txt",
    "tree-sitter-javascript-MIT.txt",
    "tree-sitter-typescript-MIT.txt",
    "tree-sitter-typescript-javascript-MIT.txt",
    "tree-sitter-python-MIT.txt",
    "tree-sitter-java-MIT.txt",
    "tree-sitter-bash-MIT.txt",
  ]) writeFileSync(join(skill, "licenses", license), `license: ${license}\n`);
  if (runtimePresent) writeFileSync(join(skill, "runtime/miku-repo-scale-0.2.5.mjs"), "runtime\n");
  writeFileSync(join(skill, ".DS_Store"), "finder metadata");
  mkdirSync(join(skill, "tmp"), { recursive: true });
  writeFileSync(join(skill, "tmp/should-not-ship.txt"), "scratch\n");
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return { root, skill, bundle: join(root, "bundle/miku-repo-scale-skills/skills/igapyon-miku-repo-scale") };
}

test("bundle includes the pinned runtime, adapter, and all required license texts", (t) => {
  const { root, bundle } = fixture(t);
  execFileSync(process.execPath, ["scripts/build-skill-bundle.mjs"], { cwd: root });

  for (const relative of [
    "SKILL.md",
    "runtime/runtime.json",
    "runtime/miku-repo-scale-0.2.5.mjs",
    "lib/run.mjs",
    "licenses/THIRD_PARTY_NOTICES.md",
    "licenses/miku-repo-scale-LICENSE",
    "licenses/miku-repo-scale-skills-LICENSE",
    "licenses/web-tree-sitter-MIT.txt",
    "licenses/tree-sitter-javascript-MIT.txt",
    "licenses/tree-sitter-typescript-MIT.txt",
    "licenses/tree-sitter-typescript-javascript-MIT.txt",
    "licenses/tree-sitter-python-MIT.txt",
    "licenses/tree-sitter-java-MIT.txt",
    "licenses/tree-sitter-bash-MIT.txt",
  ]) {
    assert.equal(existsSync(join(bundle, relative)), true, `${relative} is included`);
  }
  assert.equal(existsSync(join(bundle, ".DS_Store")), false);
  assert.equal(existsSync(join(bundle, "tmp")), false);
  assert.equal(existsSync(join(bundle, "runtime/.gitkeep")), false);
  assert.equal(existsSync(join(root, "bundle/miku-repo-scale-skills/tests")), false);
  assert.match(readFileSync(join(bundle, "runtime/runtime.json"), "utf8"), /miku-repo-scale-0\.2\.5\.mjs/u);
});

test("bundle build stops before creating output when the required runtime is missing", (t) => {
  const { root } = fixture(t, { runtimePresent: false });
  const result = spawnSync(process.execPath, ["scripts/build-skill-bundle.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /missing or empty required CLI artifact/u);
  assert.equal(existsSync(join(root, "bundle/miku-repo-scale-skills")), false);
});

test("release ZIP contains the installable skill tree and excludes development files", {
  skip: process.platform === "win32" ? "the release ZIP uses the Ubuntu system zip tool" : false,
}, (t) => {
  const { root } = fixture(t);
  execFileSync(process.execPath, ["scripts/build-skill-bundle.mjs"], { cwd: root });
  const bundleRoot = join(root, "bundle/miku-repo-scale-skills");
  const zipPath = join(root, "skill-bundle.zip");
  execFileSync("zip", ["-qr", zipPath, "."], { cwd: bundleRoot });
  execFileSync("unzip", ["-t", zipPath], { stdio: "ignore" });
  const entries = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" }).split(/\r?\n/u);

  for (const required of [
    "skills/igapyon-miku-repo-scale/SKILL.md",
    "skills/igapyon-miku-repo-scale/lib/run.mjs",
    "skills/igapyon-miku-repo-scale/runtime/runtime.json",
    "skills/igapyon-miku-repo-scale/runtime/miku-repo-scale-0.2.5.mjs",
    "skills/igapyon-miku-repo-scale/licenses/THIRD_PARTY_NOTICES.md",
  ]) assert.ok(entries.includes(required), `${required} is in the ZIP`);
  assert.equal(entries.some((entry) => entry.startsWith("tests/")), false);
  assert.equal(entries.some((entry) => entry.includes(".gitkeep")), false);
  assert.equal(entries.some((entry) => entry.includes(".DS_Store")), false);
  assert.equal(entries.some((entry) => entry.includes("node_modules/")), false);
});
