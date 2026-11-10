import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runCli } from "../skills/igapyon-miku-repo-scale/lib/run.mjs";

const skillRoot = fileURLToPath(new URL("../skills/igapyon-miku-repo-scale/", import.meta.url));

test("accepts repository size, text, JSON/JSONL, instructions, definitions, TypeScript, binary, and ignore metadata", (t) => {
  const temporaryRoot = mkdtempSync(join(tmpdir(), "miku-repo-scale-acceptance-"));
  const root = join(temporaryRoot, "repository");
  const config = join(temporaryRoot, "classification.json");
  for (const directory of ["docs", "agent", "evals", "src"]) mkdirSync(join(root, directory), { recursive: true });

  writeFileSync(join(root, ".gitignore"), "ignored.txt\n");
  writeFileSync(join(root, "AGENTS.md"), "Use small modules.\n");
  writeFileSync(join(root, "SKILL.md"), "Measure repository files.\n");
  writeFileSync(join(root, "README.md"), "# Sample\n\nRepository overview.\n");
  writeFileSync(join(root, "notes.txt"), "one\n\ntwo\n");
  writeFileSync(join(root, "docs/page.html"), "<h1>Overview</h1>\n<p>Text</p>\n");
  writeFileSync(join(root, "agent/tools.json"), '{"name":"lookup","enabled":true}\n');
  writeFileSync(join(root, "evals/cases.json"), '[{"input":"a","expected":"b"}]\n');
  writeFileSync(join(root, "evals/examples.jsonl"), '{"id":1}\n\n{"id":2}\n');
  writeFileSync(join(root, "src/index.ts"), "export function total(values: number[]): number {\n  return values.reduce((sum, value) => sum + value, 0);\n}\n");
  writeFileSync(join(root, "image.png"), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]));
  writeFileSync(join(root, "ignored.txt"), "ignored content\n");
  writeFileSync(config, JSON.stringify({
    schema_version: "miku-repo-scale.config/v1",
    rules: [
      { match: "agent/tools.json", role: "definition" },
      { match: "evals/**/*.json", role: "data", category: "test" },
      { match: "evals/**/*.jsonl", role: "data", category: "test" },
    ],
  }));
  execFileSync("git", ["-C", root, "init", "-q"]);
  execFileSync("git", ["-C", root, "add", "--all"]);
  t.after(() => rmSync(temporaryRoot, { recursive: true, force: true }));

  const output = runCli([
    "analyze", root, "--inventory", "all", "--detail", "files", "--config", config,
  ], { skillRoot });
  assert.equal(output.exitCode, 0, JSON.stringify(output.result.diagnostics));
  const result = output.result;
  assert.equal(result.status, "ok");
  assert.equal(result.summary.totals.files, 11);
  assert.equal(result.summary.coverage.included_regular_files, 11);
  assert.equal(result.summary.coverage.bytes_measured_files, 11);
  assert.equal(result.summary.coverage.text_measured_files, 10);
  assert.equal(result.summary.coverage.lexically_classified_files, 1);
  assert.equal(result.summary.coverage.binary_files, 1);
  assert.equal(result.summary.inventory.ignored_metadata_only_entries, 1);

  const files = new Map(result.files.map((file) => [file.path, file]));
  assert.equal(result.summary.totals.bytes,
    [...files.values()].filter((file) => file.git.tracked).reduce((sum, file) => sum + file.size_bytes, 0));
  assert.equal(files.get("AGENTS.md").role, "instruction");
  assert.equal(files.get("SKILL.md").role, "instruction");
  assert.equal(files.get("README.md").role, "documentation");
  assert.equal(files.get("notes.txt").language, "text");
  assert.equal(files.get("notes.txt").metrics.total_physical_lines, 3);
  assert.equal(files.get("docs/page.html").language, "html");
  assert.equal(files.get("docs/page.html").metrics.total_physical_lines, 2);
  assert.equal(files.get("agent/tools.json").role, "definition");
  assert.equal(files.get("agent/tools.json").category, "source");
  assert.equal(files.get("evals/cases.json").role, "data");
  assert.equal(files.get("evals/cases.json").category, "test");
  assert.equal(files.get("evals/examples.jsonl").role, "data");
  assert.equal(files.get("evals/examples.jsonl").metrics.total_physical_lines, 3);
  assert.equal(result.source_composition.instruction.files, 2);
  assert.equal(result.source_composition.definition.files, 1);
  assert.equal(result.by_role.data.files, 2);
  assert.equal(result.by_category.test.files, 2);
  assert.equal(files.get("src/index.ts").measurement, "lexical");
  assert.equal(files.get("src/index.ts").metrics.code_lines, 3);
  assert.equal(files.get("image.png").measurement, "binary");
  assert.equal(files.get("image.png").binary_type, "png");
  assert.equal(files.get("image.png").size_bytes, 12);

  const ignored = files.get("ignored.txt");
  assert.equal(ignored.git.ignore.would_ignore, true);
  assert.equal(ignored.git.ignore.rule.source, ".gitignore");
  assert.equal(ignored.measurement, "skipped");
  assert.equal(ignored.metrics.bytes, null);
  assert.ok(ignored.size_bytes > 0);
});
