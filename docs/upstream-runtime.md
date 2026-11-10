# Upstream runtime receipt

Status: received from the upstream GitHub Release `v0.2.5` on 2026-11-10.
This receipt pins the standalone CLI artifact used by the Skill. The same
release also publishes an importable runtime bundle, which this CLI adapter
does not invoke.

| Field | Received value |
| --- | --- |
| Upstream repository | `https://github.com/igapyon/miku-repo-scale` |
| GitHub Release | [`v0.2.5`](https://github.com/igapyon/miku-repo-scale/releases/tag/v0.2.5) |
| Source revision | `537fed9edf2e9311f494cda4a5b594395652df2d` |
| Product version | `0.2.5` |
| Ruleset version | `1.4.0` |
| Result schema | `miku-repo-scale.result/v1` |
| Artifact | `skills/igapyon-miku-repo-scale/runtime/miku-repo-scale-0.2.5.mjs` |
| Size | 6,514,645 bytes |
| SHA-256 | `a2aa0935164bf1e429066e94992d0a1d4a515551f582f917afc72bfb98aa77c9` |

The artifact is the standalone CLI release asset
[`miku-repo-scale-0.2.5.mjs`](https://github.com/igapyon/miku-repo-scale/releases/download/v0.2.5/miku-repo-scale-0.2.5.mjs).
Its local SHA-256 matches the GitHub Release asset digest. A separate
`miku-repo-scale-runtime-0.2.5.mjs` asset is also present in that release, but
`lib/run.mjs` invokes the standalone CLI and therefore pins the CLI artifact.

`runtime/runtime.json` fixes the exact basename, product/ruleset/schema
versions, source revision, and artifact digest. The RSC-14a resolver reads only
that manifest-selected file and rejects missing, empty, symbolic-link, changed,
or incompatible artifacts. The imported CLI passed `--version`, `--help`, and
a summary `analyze` smoke. The adapter and isolated bundle smoke run the CLI
from an install copy. Hosted Windows confirmation remains pending.
