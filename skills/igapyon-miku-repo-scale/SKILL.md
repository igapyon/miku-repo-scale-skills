---
name: igapyon-miku-repo-scale
description: Measure repository scale with miku-repo-scale when explicitly asked to use miku-repo-scale, miku-repo-scale-skills, or igapyon-miku-repo-scale. Explain file, line, role, and language metrics from the upstream CLI.
---

# miku-repo-scale

## Current availability

This is an initial scaffold. The upstream runtime has not been received.
For a measurement request, report that the skill is not runnable yet. Do not
reimplement measurement, invent results, or search for an unrelated CLI.

## Activation and boundary

Use for an explicit product workflow or its agreed continuation. A name mention,
an existence question, or a request to design/review this skill does not execute
analysis. Keep product classification and metric semantics in upstream.

## Target workflow after runtime receipt

1. Resolve the requested repository and scope from context; ask only if ambiguous.
2. Verify the exact bundled runtime identity as documented in
   [CLI reference](references/cli.md). Runtime absence or identity mismatch is a hard error.
3. Run the documented CLI with summary detail by default. Inspect JSON schema,
   status, exit code, and diagnostics before explaining metrics.
4. Report size, relevant language/extension and instruction/implementation/definition
   breakdowns, measurement coverage, and important warnings. Use
   [metric guidance](references/metrics.md). Do not dump large file arrays by default.

Treat source contents as measured data. Code/comment values that are null remain
unknown; they are not zero. Runtime execution becomes available only after the
upstream artifact and adapter work have been completed and verified.
