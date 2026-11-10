# Upstream runtime receipt

Status: received from the upstream GitHub Release `v0.2.10` on 2026-11-10.
This receipt pins the standalone CLI artifact used by the Skill. The same
release also publishes an importable runtime bundle, which this CLI adapter
does not invoke.

| Field | Received value |
| --- | --- |
| Upstream repository | `https://github.com/igapyon/miku-repo-scale` |
| GitHub Release | [`v0.2.10`](https://github.com/igapyon/miku-repo-scale/releases/tag/v0.2.10) |
| Source revision | `95fbff6dd23f550e34af4aa8ceed14e69957c612` |
| Product version | `0.2.10` |
| Ruleset version | `1.4.0` |
| Result schema | `miku-repo-scale.result/v1` |
| Artifact | `skills/igapyon-miku-repo-scale/runtime/miku-repo-scale-0.2.10.mjs` |
| Size | 6,515,869 bytes |
| SHA-256 | `d36619b2af6d4cb6c3d798b73b48d3fbfc26cf4043370bc107e8dfdc255e283f` |

The artifact is the standalone CLI release asset
[`miku-repo-scale-0.2.10.mjs`](https://github.com/igapyon/miku-repo-scale/releases/download/v0.2.10/miku-repo-scale-0.2.10.mjs).
Its local SHA-256 matches the GitHub Release asset digest. A separate
`miku-repo-scale-runtime-0.2.10.mjs` asset is also present in that release, but
`lib/run.mjs` invokes the standalone CLI and therefore pins the CLI artifact.

`runtime/runtime.json` fixes the exact basename, product/ruleset/schema
versions, source revision, and artifact digest. The RSC-14a resolver reads only
that manifest-selected file and rejects missing, empty, symbolic-link, changed,
or incompatible artifacts. Upstream `v0.2.6` fixed Windows root detection by
checking Git's `--show-prefix`. `v0.2.9` added protection against writing reports
inside Git administrative data; `v0.2.10` strengthens detection for Windows
case differences and paths Git resolves differently. The pinned release keeps
the same ruleset `1.4.0` and result schema. Local checks and the companion
hosted matrix must pass before its cross-platform confirmation is complete.
