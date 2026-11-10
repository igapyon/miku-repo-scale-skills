import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const skillName = "igapyon-miku-repo-scale";

test("copied bundle runs version, help, and analyze without the source checkout", (t) => {
  execFileSync(process.execPath, ["scripts/build-skill-bundle.mjs"], { cwd: repoRoot });
  const bundleSkill = join(repoRoot, "bundle/miku-repo-scale-skills/skills", skillName);
  const isolatedRoot = mkdtempSync(join(tmpdir(), "miku-repo-scale-skill-isolated-"));
  const installedSkill = join(isolatedRoot, skillName);
  const repository = join(isolatedRoot, "sample-repository");
  mkdirSync(repository, { recursive: true });
  cpSync(bundleSkill, installedSkill, { recursive: true });
  writeFileSync(join(repository, "README.md"), "Repository instructions.\n");
  mkdirSync(join(repository, "src"));
  writeFileSync(join(repository, "src/example.ts"), "export const answer: number = 42;\n");
  execFileSync("git", ["-C", repository, "init", "-q"]);
  execFileSync("git", ["-C", repository, "add", "--all"]);
  t.after(() => rmSync(isolatedRoot, { recursive: true, force: true }));

  const runner = join(installedSkill, "lib/run.mjs");
  const options = { cwd: installedSkill, encoding: "utf8" };
  assert.equal(execFileSync(process.execPath, [runner, "--version"], options).trim(), "miku-repo-scale 0.2.5");
  assert.match(execFileSync(process.execPath, [runner, "--help"], options), /miku-repo-scale analyze/u);

  const analysis = spawnSync(process.execPath, [runner, "analyze", repository, "--detail", "summary"], options);
  assert.equal(analysis.status, 0, `${analysis.stderr}\n${analysis.stdout}`);
  const result = JSON.parse(analysis.stdout);
  assert.equal(result.schema_version, "miku-repo-scale.result/v1");
  assert.equal(result.status, "ok");
  assert.equal(result.tool.version, "0.2.5");
  assert.equal(result.summary.coverage.lexically_classified_files, 1);
});
