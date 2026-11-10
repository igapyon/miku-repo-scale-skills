# CLI operation and runtime

Runtime `0.2.5` is pinned by [`runtime/runtime.json`](../runtime/runtime.json).
The thin adapter verifies the runtime digest and embedded version, invokes it
with an argument array, parses result JSON, and checks the result schema marker,
required envelope fields, coverage counts, ruleset, and exit-code/status match.

The upstream CLI contract is `miku-repo-scale analyze [root]`, with include/exclude,
explicit config/encoding, summary detail, and optional new output-file creation.
Normal stdout is `miku-repo-scale.result/v1` JSON. Help/version are metadata exceptions.
Exit 0/2/1 corresponds to ok/partial/error, with coverage interpreted separately.

The exact artifact basename, version, ruleset, result schema, source revision,
and SHA-256 are recorded in the runtime manifest and
[receipt](../../../docs/upstream-runtime.md). Missing, changed, empty, or
incompatible runtime files are hard errors. The adapter never searches for a
different product CLI.

| Operation | Input | Output | Current availability |
| --- | --- | --- | --- |
| analyze | Git worktree root and explicit options | result JSON and diagnostics | available through `lib/run.mjs` |
| help | no repository input | CLI usage | available through `lib/run.mjs --help` |
| version | no repository input | product identity/version | available through `lib/run.mjs --version` |

The product owns stable diagnostic codes and null/coverage semantics. Unknown
schema, runtime mismatch, invalid JSON, process failure, and exit/status mismatch
are execution failures, not empty repositories.

Supported options are `--include`, `--exclude`, `--inventory tracked|all`,
`--encoding`, `--max-file-bytes`, `--config`, `--detail files|summary`, and
`--output <new-file>`. The CLI defaults to file detail; this Skill requests
summary detail unless the user asks for per-file information. Use
`--inventory all` when untracked or ignored entries are in scope; their names,
sizes, and ignore evidence are metadata, and their contents are not read.
Filter large file-detail results to the user's requested paths or attributes.
Create `--output <new-file>` only when the user requests a saved JSON report.
