# miku-repo-scale-skills

Agent Skill companion for [miku-repo-scale](https://github.com/igapyon/miku-repo-scale).
The installed skill is **`igapyon-miku-repo-scale`**. It will call a received
Node.js CLI runtime and explain repository scale, including Markdown Agent
instructions, JSON/YAML definitions, TypeScript, and other program sources.

**Status: RSC-14a through RSC-15b are implemented. The verified local bundle
runs independently with Node.js 22+, and acceptance fixtures cover instructions,
definitions, JSON/JSONL, TypeScript, binaries, and ignored-file metadata. The
local Node.js 26 build and ZIP packaging pass. Conversation guidance and release
workflow have a local review; hosted OS/Node matrix results remain pending, so
the package is not release-ready yet.**

## Structure and ownership

- `skills/igapyon-miku-repo-scale/SKILL.md`: activation and operating boundary.
- `skills/igapyon-miku-repo-scale/references/`: CLI and metric guidance.
- `skills/igapyon-miku-repo-scale/runtime/`: received versioned CLI artifact.
- `skills/igapyon-miku-repo-scale/licenses/`: upstream and bundled parser licenses.
- `scripts/`: repository packaging helpers; product logic stays upstream.
- `docs/`: local design, implementation plan, development, and reference decisions.

## Packaging entrypoints

```sh
npm test
npm run build
npm run build:bundle
npm run build:bundle:zip
```

`npm run build` runs the suite and creates the release ZIP. Bundle entrypoints
require the declared non-empty upstream CLI before creating output. The
received artifact is `miku-repo-scale-0.2.7.mjs`, fixed by
`runtime/runtime.json` with its source revision, result schema, and SHA-256.
See [upstream runtime receipt](docs/upstream-runtime.md). The adapter verifies
the pinned artifact before every invocation. The isolated smoke test installs a
copy of the bundle in a temporary directory and runs version, help, and analyze.
ZIP packaging currently uses the sister/starter's `zip` build tool; installed
skill execution will need Node.js and Git only. No Java backend is planned.
The package version tracks the pinned upstream CLI release.

Install the skill from the verified bundle. Do not treat the project as
release-ready until RSC-15c and RSC-15d complete hosted cross-platform checks
and the final conversation/release review.

## Project documents

- [Local implementation plan](docs/implementation-plan.md)
- [Skill design and boundary](docs/design.md)
- [Upstream runtime receipt](docs/upstream-runtime.md)
- [Current tasks](TODO.md)
- [Development](docs/development.md)
- [Sister references](docs/reference-check.md)
- [Shared miku-soft references](docs/miku-soft-reference.md)

## Repository rules

Keep scratch work under `workplace/`, tracking only `.gitkeep`. Ignore dependency
and build directories, `.DS_Store`, and local `.codex/skills/` deployments.
The skill has no adopted `index.json`; follow direct reference links.

## License

[Apache-2.0](LICENSE).
