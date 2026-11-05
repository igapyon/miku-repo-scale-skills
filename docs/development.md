# Development

2026-11-05: initial scaffold. Upstream runtime has not been received; analyzer
execution, manifest/resolver wiring, semantic tests, and isolated smoke remain
in [implementation-plan.md](implementation-plan.md).

## Environment

- Planned installed runtime: Node.js 22+ and Git; no Java backend.
- Planned verification: Node.js 22, 24, 26. Release build: Node.js 26.
- Current packaging skeleton: Node.js scripts; ZIP build also requires `zip`.
- No npm dependencies; `package-lock.json` makes the empty dependency set explicit.
- `npm run build:bundle` / `npm run build:bundle:zip` stop if the required CLI is absent.
- `npm test` is added with meaningful executable tests, not an empty passing suite.

## Layout and state

Keep all installable helpers inside `skills/igapyon-miku-repo-scale/` (under
`lib/` when added). Root `scripts/` only owns repository build/release helpers.
No source index is adopted. Runtime is a received artifact, not a local build
of copied upstream sources. Package version starts at `0.1.0`.

The initial work branch is `devel-tiga1105wcg`; check actual Git state on resume.
Use `workplace/` locally and track only its `.gitkeep`. Keep generated bundles,
dependencies, `.DS_Store`, and local `.codex/skills/` out of Git.

## Release preparation

`.github/workflows/release-build.yml` is prepared from the standard companion
shape: `release: published`, checkout the exact tag, build the bundle, stage the
versioned ZIP, attach that file. No Java setup or npm publication is included.
Runtime identity checks and isolated smoke must be connected in RSC-14/15
before the project is release-ready. Missing runtime currently blocks the build.

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
