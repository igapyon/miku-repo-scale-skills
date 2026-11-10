# TODO

## Current state

2026-11-10: upstream CLI 0.2.5 is received and pinned. Node.js 26.12.1
`npm run build` passes after the refresh (13/13 tests and ZIP generation).
Conversation guidance and the release workflow received a local desk review.
Hosted Node/OS matrix and final release readiness remain pending. The first
hosted matrix passed Ubuntu/macOS but failed on Windows; the refreshed runtime
needs a hosted rerun.

- [x] Confirm upstream URL, repository/work branch, and sister skill examples.
- [x] Place repository conventions, basic package, and local plan.
- [x] Add bundle entrypoints which stop when the declared CLI is absent.
- [x] Upstream dependency: APP RSC-01〜13 completes local artifact verification.
- [x] Receive versioned runtime; record source revision, version, SHA-256, and schema.
- [x] RSC-14a: runtime manifest and exact artifact verification.
- [x] RSC-14b: thin skill-local `lib/run.mjs` and CLI/result boundary.
- [x] RSC-14c: executable instructions and references from the verified CLI.
- [x] RSC-14d: package contents, licenses, and required-runtime tests.
- [x] RSC-15a: real CLI/help/version/analyze in an isolated bundle.
- [x] RSC-15b: JSON/JSONL, TypeScript, and instruction/definition metrics acceptance.
- [ ] RSC-15c: rerun hosted Node 22/24/26 and OS matrix with the refreshed upstream runtime; first run passed Ubuntu/macOS and failed Windows analyze cases. Verify the Ubuntu-only ZIP build in CI.
- [ ] RSC-15d: conversation cases and release-readiness verification. Desk-review cases are recorded; final readiness depends on hosted RSC-15c results.

See [implementation plan](docs/implementation-plan.md). This companion skill
invokes the upstream CLI; product measurement and classification remain upstream.
