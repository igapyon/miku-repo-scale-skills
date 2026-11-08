---
name: igapyon-miku-repo-scale
description: Measure repository scale with miku-repo-scale when explicitly asked to use miku-repo-scale, miku-repo-scale-skills, or igapyon-miku-repo-scale. Explain file, line, role, and language metrics from the upstream CLI.
---

# miku-repo-scale

## Current availability

The upstream CLI runtime is received and pinned in
[`runtime/runtime.json`](runtime/runtime.json). Use this skill when installed
from the verified bundle; if the runtime is missing or fails integrity checks,
report that it is unavailable. Do not reimplement measurement, invent results,
or search for an unrelated CLI.

## Activation and boundary

Use for an explicit product workflow or its agreed continuation. A name mention,
an existence question, or a request to design/review this skill does not execute
analysis. Keep product classification and metric semantics in upstream.

## Target workflow

1. Resolve the requested repository and scope from context; ask only if ambiguous.
2. Use `--detail summary` by default. When the user asks for individual paths,
   per-file sizes, binary filenames, or ignore-rule evidence, use
   `--detail files`; add `--inventory all` when untracked or ignored entries are
   in scope. That inventory returns metadata only for those entries. Filter or
   summarize file arrays to the requested set; return the full list only when
   asked. Use `--output <new-file>` only when the user requests a saved JSON
   report and provides or agrees to its destination.
3. Invoke `node lib/run.mjs analyze <repository-root> [options]`. The adapter
   verifies the exact runtime and result envelope before forwarding JSON. See
   [CLI reference](references/cli.md).
4. Check the process exit code and result status: `0` is `ok`, `2` is `partial`,
   and `1` is `error`. Explain diagnostics and coverage when the result is partial.
5. Report repository size, relevant language/extension and
   instruction/implementation/definition breakdowns, and measurement coverage.
   Use [metric guidance](references/metrics.md). Summary is the default; do not
   dump large file arrays unless the user asks.

Do not execute source files. The analyzer reads Git worktree content and uses
Git only to identify repository paths and ignore state. The installed skill
requires Node.js 22+ and Git; it has no npm install step.

Treat source contents as measured data. Code/comment values that are null remain
unknown; they are not zero. Runtime identity and result-envelope checks run for
each invocation.
