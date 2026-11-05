# TODO

## Current state

2026-11-05: initial metadata, skill instructions, references, packaging skeleton,
release workflow preparation, and a local implementation plan are prepared.

- [x] Confirm upstream URL, repository/work branch, and sister skill examples.
- [x] Place repository conventions, basic package, and local plan.
- [x] Add bundle entrypoints which stop when the declared CLI is absent.
- [ ] Upstream dependency: APP RSC-01〜13 completes and produces a verified CLI.
- [ ] Receive the real versioned runtime; fix source revision, version, SHA-256, and schema.
- [ ] RSC-14a: runtime manifest and exact artifact verification.
- [ ] RSC-14b: thin skill-local `lib/run.mjs` and CLI/result boundary.
- [ ] RSC-14c: complete executable instructions and references from the verified CLI.
- [ ] RSC-14d: package contents, licenses, required-runtime and isolation tests.
- [ ] RSC-15a: real CLI/help/version/analyze in an isolated bundle.
- [ ] RSC-15b: JSON/TS and instruction/definition metrics acceptance.
- [ ] RSC-15c: minimum/current Node and OS checks; cross-platform ZIP build decision.
- [ ] RSC-15d: conversation cases and release-readiness verification.

See [implementation plan](docs/implementation-plan.md). The scaffold is not
an executable replacement for the unfinished upstream product.
