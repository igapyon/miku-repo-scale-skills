# Development

2026-11-07: upstream runtime `0.2.1` was received from source revision
`ad09e61d8a50d39ebaa50dfad7521d4acd53b02b`. RSC-14a〜d and RSC-15a〜b now
verify the pinned runtime, adapter, licenses, bundle contents, and isolated
version/help/analyze execution plus metric acceptance. RSC-15c〜d remain.

## Environment

- Planned installed runtime: Node.js 22+ and Git; no Java backend.
- Planned verification: Node.js 22, 24, 26. Release build: Node.js 26.
- Current packaging skeleton: Node.js scripts; ZIP build also requires `zip`.
- No npm dependencies; `package-lock.json` makes the empty dependency set explicit.
- `npm run build:bundle` / `npm run build:bundle:zip` stop if the required CLI is absent.
- `npm test` runs 13 runtime, adapter, bundle-content, isolated CLI smoke, metric acceptance, and release ZIP content tests.

## Layout and state

Keep all installable helpers inside `skills/igapyon-miku-repo-scale/` (under
`lib/` when added). Root `scripts/` only owns repository build/release helpers.
No source index is adopted. Runtime is a received artifact, not a local build
of copied upstream sources. Keep the package version in `package.json` and
`package-lock.json`; it is independent of the upstream runtime version.

The initial work branch is `devel-tiga1105wcg`; check actual Git state on resume.
Use `workplace/` locally and track only its `.gitkeep`. Keep generated bundles,
dependencies, `.DS_Store`, and local `.codex/skills/` out of Git.

## Release preparation

`.github/workflows/ci.yml` tests Node 22/24/26 on Ubuntu, macOS, and Windows,
then builds the ZIP on Ubuntu. The release workflow tests the pinned runtime and
isolated bundle before building and attaching the versioned ZIP on Ubuntu. No
Java setup or npm publication is included.
Runtime identity checks and isolated CLI smoke now pass locally. Broader metric
acceptance passes. The hosted matrix remains unrun; its first result and final
release-readiness review remain pending.

## RSC-14/15a verification (2026-11-07)

- Runtime artifact SHA-256 matches `runtime/runtime.json`:
  `fb975734ec57e83e0c1eb40762fdc744d069f8361d935ea26c34497953c6bbc9`.
- Node.js 26.12.1: `npm run build` — 13/13 tests passed, then generated the release ZIP.
- Node.js 22.23.4: `node --test tests/*.test.mjs` — 13/13 passed.
- Isolated bundle executes CLI `--version`, `--help`, and `analyze` from a
  temporary copy without relying on the source checkout.
- Bundle test confirms runtime, manifest, adapter, and license notices are
  included; `.DS_Store`, scratch data, and root tests are excluded. Missing
  declared runtime prevents bundle creation.
- ZIP content test verifies the installable tree, required runtime and licenses,
  and excludes `.gitkeep`, tests, and other development files on macOS; the
  Windows matrix skips this Ubuntu-tool-specific ZIP test.
- macOS `/var` and `/private/var` path aliases initially prevented the copied
  runner's main guard from matching. The adapter now compares real paths; the
  isolated test passes with the fix.

## RSC-15b metric acceptance (2026-11-07)

- Fixture covers `.txt`, `.html`, `.json`, `.jsonl`, Markdown instructions,
  a configured JSON definition and JSON evaluation data, TypeScript, and a PNG.
- Verified repository totals and text/lexical/binary coverage; instruction and
  definition enter source composition, while evaluation JSON/JSONL is test data.
- An ignored text file appears as metadata under `--inventory all`, reports its
  `.gitignore` rule and file size, and leaves unmeasured content metrics null.
- Local macOS `npm run build` generated `igapyon-miku-repo-scale-skills-0.2.0.zip`;
  `unzip -t` passed. Release ZIP generation stays on Ubuntu because the helper
  uses the system `zip` command; the hosted CI job will verify that runner.
- CI now defines Node 22/24/26 on Ubuntu/macOS/Windows, but those hosted runs
  have not executed from this local worktree.
- CI has `contents: read`; `npm run build` runs tests before creating the ZIP.

## RSC-15c/15d local review (2026-11-08)

- macOS / Node.js 26.12.1: `npm ci` completed; `npm run build` passed all 13 tests and generated `bundle/igapyon-miku-repo-scale-skills-0.2.0.zip`.
- The CI definition covers Node.js 22/24/26 on Ubuntu/macOS/Windows, with `contents: read`; its Ubuntu Node.js 26 job runs the full build after the matrix. This local worktree has not run on GitHub, so no hosted matrix result is claimed.
- Local shell has Node.js 20 and 26 installations; Node.js 22/24 are not available here for an additional local matrix run. The earlier Node.js 22.23.4 result remains recorded above.
- Desk-reviewed conversation cases for explicit analysis, name-only/explanation requests, ambiguous targets, file/binary/ignore metadata requests, partial/error results, and runtime integrity failure. Updated SKILL.md to select per-file detail and all-inventory metadata only when requested.
- Reviewed the Release-published workflow: Ubuntu Node.js 26 runs `npm ci` and `npm run build`, stages only a tag accepted by the package-version guard, then uploads the generated ZIP. No Release or hosted workflow was created or run. RSC-15c remains open; the package is not yet release-ready.
- Local release staging with `RELEASE_TAG=v0.2.0` generated `release-assets/igapyon-miku-repo-scale-skills-0.2.0.zip`; `unzip -t` passed. This local check did not run the GitHub Release workflow.

See [reference-check.md](reference-check.md) for concrete sister revisions,
adopted patterns, and current official Node.js baseline sources.

## Initial scaffold verification (2026-11-05)

Prepared files were checked in an isolated staging directory before placement:

- `npm install --package-lock-only --ignore-scripts --offline`: both empty dependency sets locked.
- JSON parsing: 4 metadata/lock files across the two repositories passed.
- `node --check`: all 3 packaging helpers passed syntax checks.
- Local Markdown links: 43 references resolved, including the preserved target LICENSE files.
- Skill `npm run build:bundle`: failed with the expected missing required CLI diagnostic; no bundle output was created.

This verifies scaffold preparation and the missing-runtime boundary. No product
measurement tests, usable runtime, real bundle smoke, or hosted workflows were run.
