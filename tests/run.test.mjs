import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runCli } from "../skills/igapyon-miku-repo-scale/lib/run.mjs";

const skillRoot = fileURLToPath(new URL("../skills/igapyon-miku-repo-scale/", import.meta.url));

function repository(t, entries = {}) {
  const root = mkdtempSync(join(tmpdir(), "miku-repo-scale-skill-run-"));
  for (const [name, contents] of Object.entries(entries)) {
    const path = join(root, name);
    mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, contents);
  }
  execFileSync("git", ["-C", root, "init", "-q"]);
  execFileSync("git", ["-C", root, "add", "--all"]);
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

test("passes help and version through and checks the embedded version", () => {
  const version = runCli(["--version"], { skillRoot });
  assert.equal(version.exitCode, 0);
  assert.equal(version.stdout, "miku-repo-scale 0.2.7\n");

  const help = runCli(["--help"], { skillRoot });
  assert.equal(help.exitCode, 0);
  assert.match(help.stdout, /miku-repo-scale analyze/u);
});

test("returns a schema-checked summary and preserves the CLI exit status", (t) => {
  const root = repository(t, {
    "README.md": "Agent instructions and repository notes.\n",
    "src/example.js": "const value = 1; // sample\n",
  });
  const output = runCli(["analyze", root, "--detail", "summary"], { skillRoot });
  assert.equal(output.exitCode, 0, JSON.stringify(output.result.diagnostics));
  assert.equal(output.result.schema_version, "miku-repo-scale.result/v1");
  assert.equal(output.result.tool.version, "0.2.7");
  assert.equal(output.result.tool.ruleset_version, "1.4.0");
  assert.equal(output.result.summary.coverage.lexically_classified_files, 1);
  assert.equal(output.result.files, undefined);
});

test("preserves partial and error result states", (t) => {
  const partialRoot = repository(t, { "invalid.txt": Buffer.from([0xff]) });
  const partial = runCli(["analyze", partialRoot, "--detail", "summary"], { skillRoot });
  assert.equal(partial.result.status, "partial", JSON.stringify(partial.result.diagnostics));
  assert.equal(partial.exitCode, 2);

  const missingParent = mkdtempSync(join(tmpdir(), "miku-repo-scale-skill-error-"));
  const errorRoot = join(missingParent, "missing");
  t.after(() => rmSync(missingParent, { recursive: true, force: true }));
  const failed = runCli(["analyze", errorRoot, "--detail", "summary"], { skillRoot });
  assert.equal(failed.result.status, "error");
  assert.equal(failed.exitCode, 1);
});

test("reports process startup failure as a boundary error", () => {
  assert.throws(() => runCli(["--version"], { skillRoot, nodePath: "/missing/node" }), {
    code: "PROCESS_SPAWN_FAILED",
  });
});
