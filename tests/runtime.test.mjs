import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { resolveRuntime } from "../skills/igapyon-miku-repo-scale/lib/runtime.mjs";

const skillRoot = fileURLToPath(new URL("../skills/igapyon-miku-repo-scale/", import.meta.url));
const payload = Buffer.from("#!/usr/bin/env node\nprocess.exit(0);\n");

function fixture(t, overrides = {}) {
  const root = mkdtempSync(join(tmpdir(), "miku-repo-scale-skill-runtime-"));
  const runtimeDirectory = join(root, "runtime");
  mkdirSync(runtimeDirectory);
  const manifest = {
    schema_version: "miku-repo-scale.skill-runtime/v1",
    product: "miku-repo-scale",
    artifact: "miku-repo-scale-0.2.1.mjs",
    version: "0.2.1",
    ruleset_version: "1.4.0",
    result_schema_version: "miku-repo-scale.result/v1",
    source_revision: "ad09e61d8a50d39ebaa50dfad7521d4acd53b02b",
    sha256: createHash("sha256").update(payload).digest("hex"),
    ...overrides,
  };
  writeFileSync(join(runtimeDirectory, manifest.artifact), payload);
  writeFileSync(join(runtimeDirectory, "runtime.json"), JSON.stringify(manifest));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return { root, runtimeDirectory, manifest };
}

test("resolves the received CLI against its exact version, schema, source, and digest", () => {
  const resolved = resolveRuntime(skillRoot);
  assert.equal(resolved.manifest.version, "0.2.1");
  assert.equal(resolved.manifest.ruleset_version, "1.4.0");
  assert.equal(resolved.manifest.result_schema_version, "miku-repo-scale.result/v1");
  assert.equal(resolved.manifest.source_revision, "ad09e61d8a50d39ebaa50dfad7521d4acd53b02b");
  assert.match(resolved.manifest.sha256, /^[a-f0-9]{64}$/u);
  assert.ok(resolved.path.endsWith("miku-repo-scale-0.2.1.mjs"));
});

test("manifest selects the pinned version when another version is present", (t) => {
  const { root, runtimeDirectory } = fixture(t);
  writeFileSync(join(runtimeDirectory, "miku-repo-scale-0.2.2.mjs"), "other version");
  assert.equal(resolveRuntime(root).path, join(runtimeDirectory, "miku-repo-scale-0.2.1.mjs"));
});

test("rejects a missing runtime, changed bytes, and an unsupported manifest", (t) => {
  const missingManifest = fixture(t);
  rmSync(join(missingManifest.runtimeDirectory, "runtime.json"));
  assert.throws(() => resolveRuntime(missingManifest.root), { code: "RUNTIME_MANIFEST_MISSING" });

  const missing = fixture(t);
  rmSync(join(missing.runtimeDirectory, missing.manifest.artifact));
  assert.throws(() => resolveRuntime(missing.root), { code: "RUNTIME_MISSING" });

  const empty = fixture(t);
  writeFileSync(join(empty.runtimeDirectory, empty.manifest.artifact), "");
  assert.throws(() => resolveRuntime(empty.root), { code: "RUNTIME_INVALID_FILE" });

  const changed = fixture(t);
  writeFileSync(join(changed.runtimeDirectory, changed.manifest.artifact), "modified runtime");
  assert.throws(() => resolveRuntime(changed.root), { code: "RUNTIME_DIGEST_MISMATCH" });

  const unknownSchema = fixture(t, { schema_version: "miku-repo-scale.skill-runtime/v2" });
  assert.throws(() => resolveRuntime(unknownSchema.root), { code: "RUNTIME_MANIFEST_INVALID" });
});

test("rejects a version and artifact basename mismatch", (t) => {
  const mismatch = fixture(t, { version: "0.2.2" });
  assert.throws(() => resolveRuntime(mismatch.root), { code: "RUNTIME_MANIFEST_INVALID" });
});
