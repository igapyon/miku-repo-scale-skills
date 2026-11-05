# miku-repo-scale-skills

Agent Skill companion for [miku-repo-scale](https://github.com/igapyon/miku-repo-scale).
The installed skill is **`igapyon-miku-repo-scale`**. It will call a received
Node.js CLI runtime and explain repository scale, including Markdown Agent
instructions, JSON/YAML definitions, TypeScript, and other program sources.

**Status: initial scaffold. No upstream runtime has been received. The skill is
not operational and the bundle build intentionally rejects the missing CLI.**

## Structure and ownership

- `skills/igapyon-miku-repo-scale/SKILL.md`: activation and operating boundary.
- `skills/igapyon-miku-repo-scale/references/`: CLI and metric guidance.
- `skills/igapyon-miku-repo-scale/runtime/`: received versioned CLI artifact.
- `scripts/`: repository packaging helpers; product logic stays upstream.
- `docs/`: local design, implementation plan, development, and reference decisions.

## Packaging entrypoints

```sh
npm run build:bundle
npm run build:bundle:zip
```

These entrypoints require the declared non-empty upstream CLI before creating
output. The initial expected filename is `miku-repo-scale-0.1.0.mjs`; it is a
planned receipt name, not a verified compatibility pin. Runtime version,
checksum, and source revision are fixed when the real artifact is received.
ZIP packaging currently uses the sister/starter's `zip` build tool; installed
skill execution will need Node.js and Git only. No Java backend is planned.

Do not install this scaffold as a working skill. RSC-14/15 add exact runtime
verification, CLI/schema smoke, tests, and isolated bundle acceptance before release.

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
