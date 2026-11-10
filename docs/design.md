# Agent Skill design

Status: 2026-11-10. Upstream CLI `0.2.7` is received and pinned. RSC-14a〜d and
RSC-15a〜b are implemented; local bundle execution and metric acceptance are
verified. Hosted cross-platform and release checks remain.

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

The target lookup is one exact artifact declared in `runtime/runtime.json`,
checked against version, source revision, schema, and SHA-256. The receipt is
recorded in [`upstream-runtime.md`](upstream-runtime.md). A missing or changed
artifact is a hard error. An unrelated workspace CLI is not an automatic
fallback. The adapter invokes the pinned artifact by argument array and checks
the result envelope and exit/status mapping before forwarding output.

Upstream product specifications and shared RSC task definitions are in the
local sibling `miku-repo-scale/docs/`. Future published references:
[design](https://github.com/igapyon/miku-repo-scale/blob/devel/docs/design.md),
[implementation plan](https://github.com/igapyon/miku-repo-scale/blob/devel/docs/implementation-plan.md).
Skill-specific work is owned by [implementation-plan.md](implementation-plan.md).
