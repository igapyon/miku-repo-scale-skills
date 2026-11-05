# Agent Skill design

Status: initial scaffold, 2026-11-05. Upstream CLI runtime is not available yet.

| Identity | Value |
| --- | --- |
| Product repository | `igapyon/miku-repo-scale` |
| Skill repository/package | `miku-repo-scale-skills` |
| Installed skill | `igapyon-miku-repo-scale` |
| Backend | Node.js CLI only, using Git for tracked-file input |

Product collection, classification, encoding, line measurement, aggregation,
diagnostics, and result semantics belong to upstream. This repository owns
activation, received-runtime verification, execution guidance, summaries, and
installable packaging. It does not copy upstream source or recreate measurement.

The product's worktree-based analysis will measure `.md`, `.mjs`, `.json`,
`.yml`, `.yaml`, `.js`, `.ts`, `.py`, and the other languages in the upstream
design. Markdown/JSON/YAML have basic file/byte/physical/nonblank metrics.
JavaScript/TypeScript/Python/Java/Shell additionally receive lexical metrics.

Keep format, role, and category separate. `SKILL.md` is instruction/source;
README is documentation; JSON may be a definition or data according to explicit
rules. Show the measured subset and null values accurately. Never equate
unsupported analysis with zero code lines or add overlapping breakdowns together.

The target lookup is one exact artifact declared in `runtime.json`, checked
against version and SHA-256. The manifest is created only after actual receipt;
the scaffold has no fabricated digest. Runtime absence is a hard error.
An unrelated workspace CLI is not an automatic fallback.

Upstream product specifications and shared RSC task definitions are in the
local sibling `miku-repo-scale/docs/`. Future published references:
[design](https://github.com/igapyon/miku-repo-scale/blob/devel/docs/design.md),
[implementation plan](https://github.com/igapyon/miku-repo-scale/blob/devel/docs/implementation-plan.md).
Skill-specific work is owned by [implementation-plan.md](implementation-plan.md).
