#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveRuntime } from "./runtime.mjs";

const DEFAULT_MAX_BUFFER = 128 * 1024 * 1024;
const RESULT_KEYS = new Set([
  "schema_version", "tool", "status", "detail", "input", "summary",
  "by_category", "by_language", "by_extension", "by_role",
  "source_composition", "files", "diagnostics",
]);

export class CliBoundaryError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "CliBoundaryError";
    this.code = code;
  }
}

/** Invoke the pinned CLI with argv (never a shell string) and validate its result envelope. */
export function runCli(args, options = {}) {
  if (!Array.isArray(args) || args.some((argument) => typeof argument !== "string")) {
    throw new CliBoundaryError("INVALID_ARGUMENTS", "CLI arguments must be an array of strings");
  }
  const runtime = resolveRuntime(options.skillRoot);
  const execution = spawnSync(options.nodePath ?? process.execPath, [runtime.path, ...args], {
    cwd: options.cwd ?? process.cwd(),
    encoding: "utf8",
    windowsHide: true,
    maxBuffer: options.maxBuffer ?? DEFAULT_MAX_BUFFER,
    ...(options.timeout === undefined ? {} : { timeout: options.timeout }),
  });
  if (execution.error) {
    throw new CliBoundaryError("PROCESS_SPAWN_FAILED", `Could not start the pinned CLI: ${execution.error.message}`);
  }
  if (!Number.isInteger(execution.status)) {
    throw new CliBoundaryError("PROCESS_TERMINATED", `Pinned CLI terminated${execution.signal ? ` by ${execution.signal}` : " without an exit code"}`);
  }

  const output = {
    exitCode: execution.status,
    stdout: execution.stdout ?? "",
    stderr: execution.stderr ?? "",
  };
  if (args.length === 1 && ["--version", "-V"].includes(args[0])) {
    if (output.exitCode !== 0 || output.stdout.trimEnd() !== `miku-repo-scale ${runtime.manifest.version}`) {
      throw new CliBoundaryError("RUNTIME_VERSION_MISMATCH", "Pinned CLI --version output does not match the runtime manifest");
    }
    return output;
  }
  if (args[0] !== "analyze") return output;

  let result;
  try {
    result = JSON.parse(output.stdout);
  } catch {
    throw new CliBoundaryError("INVALID_RESULT_JSON", "Pinned CLI did not return valid result JSON");
  }
  validateResult(result, runtime.manifest);
  const expectedExitCode = result.status === "ok" ? 0 : result.status === "partial" ? 2 : 1;
  if (output.exitCode !== expectedExitCode) {
    throw new CliBoundaryError("RESULT_EXIT_MISMATCH", "Pinned CLI exit code does not match the result status");
  }
  return { ...output, result };
}

function validateResult(result, manifest) {
  if (!isRecord(result) || Object.keys(result).some((key) => !RESULT_KEYS.has(key))) {
    throw new CliBoundaryError("INVALID_RESULT_SCHEMA", "Result has an invalid top-level shape");
  }
  const required = [
    "schema_version", "tool", "status", "detail", "input", "summary",
    "by_category", "by_language", "by_extension", "by_role",
    "source_composition", "diagnostics",
  ];
  if (required.some((key) => !(key in result))
      || result.schema_version !== manifest.result_schema_version
      || !["ok", "partial", "error"].includes(result.status)
      || !["files", "summary"].includes(result.detail)
      || (result.input !== null && !isRecord(result.input))
      || !isRecord(result.tool)
      || result.tool.name !== "miku-repo-scale"
      || result.tool.version !== manifest.version
      || result.tool.ruleset_version !== manifest.ruleset_version
      || !isRecord(result.summary)
      || !isRecord(result.summary.coverage)
      || !Array.isArray(result.diagnostics)
      || (result.detail === "files" && !Array.isArray(result.files))
      || (result.detail === "summary" && "files" in result)) {
    throw new CliBoundaryError("INVALID_RESULT_SCHEMA", "Result does not match the pinned schema and runtime identity");
  }
  const countFields = [
    "included_regular_files", "bytes_measured_files", "text_measured_files",
    "lexically_classified_files", "basic_only_files", "binary_files", "unmeasured_files",
  ];
  if (countFields.some((field) => !Number.isSafeInteger(result.summary.coverage[field]) || result.summary.coverage[field] < 0)) {
    throw new CliBoundaryError("INVALID_RESULT_SCHEMA", "Result coverage does not match the pinned schema");
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function main() {
  try {
    const output = runCli(process.argv.slice(2));
    process.stdout.write(output.stdout);
    process.stderr.write(output.stderr);
    process.exitCode = output.exitCode;
  } catch (error) {
    process.stderr.write(`igapyon-miku-repo-scale: ${error.code ?? "CLI_ERROR"}: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1]
    && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) main();
