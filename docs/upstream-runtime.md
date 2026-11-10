# Upstream runtime receipt

Status: received from the upstream GitHub Release `v0.2.7` on 2026-11-10.
This receipt pins the standalone CLI artifact used by the Skill. The same
release also publishes an importable runtime bundle, which this CLI adapter
does not invoke.

| Field | Received value |
| --- | --- |
| Upstream repository | `https://github.com/igapyon/miku-repo-scale` |
| GitHub Release | [`v0.2.7`](https://github.com/igapyon/miku-repo-scale/releases/tag/v0.2.7) |
| Source revision | `03c796ecf29bbc14320d0a13e3d317c6f9b32d23` |
| Product version | `0.2.7` |
| Ruleset version | `1.4.0` |
| Result schema | `miku-repo-scale.result/v1` |
| Artifact | `skills/igapyon-miku-repo-scale/runtime/miku-repo-scale-0.2.7.mjs` |
| Size | 6,514,667 bytes |
| SHA-256 | `72404da15306ed85e16ac0a5d44e75871b76b9b9e1c9318cd61bdcf332b11ca0` |

The artifact is the standalone CLI release asset
[`miku-repo-scale-0.2.7.mjs`](https://github.com/igapyon/miku-repo-scale/releases/download/v0.2.7/miku-repo-scale-0.2.7.mjs).
Its local SHA-256 matches the GitHub Release asset digest. A separate
`miku-repo-scale-runtime-0.2.7.mjs` asset is also present in that release, but
`lib/run.mjs` invokes the standalone CLI and therefore pins the CLI artifact.

`runtime/runtime.json` fixes the exact basename, product/ruleset/schema
versions, source revision, and artifact digest. The RSC-14a resolver reads only
that manifest-selected file and rejects missing, empty, symbolic-link, changed,
or incompatible artifacts. Upstream `v0.2.6` fixed Windows root detection by
checking Git's `--show-prefix`; `v0.2.7` contains that fix. Local checks and the
hosted Windows matrix must pass before cross-platform confirmation is complete.
