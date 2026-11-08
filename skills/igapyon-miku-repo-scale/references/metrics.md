# Reading repository scale

These rules describe the upstream `miku-repo-scale.result/v1` output. The skill
forwards the analyzer's values; it does not calculate or repair metrics.

- Format/language, extension, role, and category are separate views of the same files.
- Instruction Markdown such as SKILL.md can be source; README can be documentation.
- JSON/YAML can be definitions or data; use returned classification and reasons.
- Text support reports file counts, bytes, physical lines, blank lines, and
  nonblank lines. JSONL is counted as physical text; records are not validated.
- JavaScript/TypeScript, Python, Java, Bash, and common POSIX `sh` add
  code/comment line metrics in the syntax supported by the pinned grammar.
- `summary.coverage` partitions text into lexical, basic-only, and unmeasured
  files; binary files are reported separately.
- With `--inventory all`, untracked and ignored entries are metadata-only.
  File detail can show their name, extension, byte size, and matching ignore
  rule; content metrics stay null and these entries are excluded from measured
  totals.
- Code lines include mixed code/comment lines; do not add the mixed subset twice.
- `null` means unavailable or unmeasured, never zero. Always state code/comment
  coverage and material exclusions.
- Source composition excludes test/generated categories even when their role is instruction.
- Do not equate instruction lines or different language LOC with a common functional size.
- A partial result remains useful with its diagnostics; an error result has no
  usable measurement. Preserve these states in the explanation.
