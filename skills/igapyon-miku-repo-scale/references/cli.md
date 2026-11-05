# CLI operation and runtime

Status: planned; no executable runtime is bundled at scaffold time.

The upstream CLI contract is `miku-repo-scale analyze [root]`, with include/exclude,
explicit config/encoding, summary detail, and optional new output-file creation.
Normal stdout is `miku-repo-scale.result/v1` JSON. Help/version are metadata exceptions.
Exit 0/2/1 corresponds to ok/partial/error, with coverage interpreted separately.

The target artifact is an exact versioned `.mjs` inside `runtime/`, pinned in a
manifest with version and SHA-256 after receipt. Neither the manifest nor a runnable
adapter exists yet. Do not present planned direct commands as working in this scaffold.

| Operation | Input | Output | Current availability |
| --- | --- | --- | --- |
| analyze | Git worktree root and explicit options | result JSON and diagnostics | pending runtime receipt |
| help | no repository input | CLI usage | pending runtime receipt |
| version | no repository input | product identity/version | pending runtime receipt |

The product owns stable diagnostic codes and null/coverage semantics. Unknown schema,
runtime mismatch, and spawn failure are execution failures, not empty repositories.
