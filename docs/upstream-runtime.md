# Upstream runtime receipt

Status: **not received** (2026-11-05).

- Upstream: <https://github.com/igapyon/miku-repo-scale>
- Development work branch: `devel-tiga1105wch` (not an artifact compatibility pin).
- Intended first receipt: `skills/igapyon-miku-repo-scale/runtime/miku-repo-scale-0.1.0.mjs`.
- Runtime version, source revision, SHA-256, result schema, and smoke results:
  pending the actual verified upstream artifact.

After APP RSC-13, receive the documented upstream CLI artifact under `runtime/`.
Fix the exact identity in `runtime.json`, record provenance and licenses, and
verify `--version`, `--help`, and a small real analysis before packaging is usable.
Keep the skill package version independent of the upstream runtime version.
Do not substitute upstream source trees or an unrelated installed executable.
