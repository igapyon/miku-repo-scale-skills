import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SKILL_ROOT = fileURLToPath(new URL("../", import.meta.url));
const MANIFEST_NAME = "runtime.json";
const MANIFEST_KEYS = new Set([
  "schema_version", "product", "artifact", "version", "ruleset_version",
  "result_schema_version", "source_revision", "sha256",
]);
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;

export class RuntimeIntegrityError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RuntimeIntegrityError";
    this.code = code;
  }
}

/** Resolve only the one versioned CLI named by the local manifest. */
export function resolveRuntime(skillRoot = DEFAULT_SKILL_ROOT) {
  const root = resolve(skillRoot);
  const runtimeDirectory = join(root, "runtime");
  const manifestPath = join(runtimeDirectory, MANIFEST_NAME);
  const manifest = readManifest(manifestPath);
  validateManifest(manifest);

  const expectedName = `miku-repo-scale-${manifest.version}.mjs`;
  if (manifest.artifact !== expectedName || basename(manifest.artifact) !== manifest.artifact) {
    throw new RuntimeIntegrityError("RUNTIME_MANIFEST_INVALID", "Runtime artifact name does not match its version");
  }

  const artifactPath = join(runtimeDirectory, expectedName);
  let stat;
  try {
    stat = lstatSync(artifactPath);
  } catch {
    throw new RuntimeIntegrityError("RUNTIME_MISSING", `Required runtime is missing: ${expectedName}`);
  }
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size === 0) {
    throw new RuntimeIntegrityError("RUNTIME_INVALID_FILE", `Required runtime is not a nonempty regular file: ${expectedName}`);
  }

  const bytes = readFileSync(artifactPath);
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== manifest.sha256) {
    throw new RuntimeIntegrityError("RUNTIME_DIGEST_MISMATCH", `Runtime SHA-256 does not match manifest: ${expectedName}`);
  }

  return Object.freeze({
    path: artifactPath,
    manifest: Object.freeze({ ...manifest }),
  });
}

function readManifest(path) {
  let bytes;
  try {
    bytes = readFileSync(path);
  } catch {
    throw new RuntimeIntegrityError("RUNTIME_MANIFEST_MISSING", `Runtime manifest is missing: ${MANIFEST_NAME}`);
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new RuntimeIntegrityError("RUNTIME_MANIFEST_INVALID", "Runtime manifest must be valid UTF-8 JSON");
  }
}

function validateManifest(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new RuntimeIntegrityError("RUNTIME_MANIFEST_INVALID", "Runtime manifest must be a JSON object");
  }
  const keys = Object.keys(manifest);
  if (keys.length !== MANIFEST_KEYS.size || keys.some((key) => !MANIFEST_KEYS.has(key))) {
    throw new RuntimeIntegrityError("RUNTIME_MANIFEST_INVALID", "Runtime manifest has missing or unknown fields");
  }
  if (manifest.schema_version !== "miku-repo-scale.skill-runtime/v1"
      || manifest.product !== "miku-repo-scale"
      || typeof manifest.version !== "string" || !SEMVER.test(manifest.version)
      || typeof manifest.ruleset_version !== "string" || !SEMVER.test(manifest.ruleset_version)
      || manifest.result_schema_version !== "miku-repo-scale.result/v1"
      || typeof manifest.source_revision !== "string" || !/^[a-f0-9]{40}$/u.test(manifest.source_revision)
      || typeof manifest.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(manifest.sha256)) {
    throw new RuntimeIntegrityError("RUNTIME_MANIFEST_INVALID", "Runtime manifest identity is invalid or unsupported");
  }
}
