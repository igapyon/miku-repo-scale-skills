# Reading repository scale

These rules describe the planned upstream result; this scaffold contains no
measurement results or executable analyzer.

- Format/language, extension, role, and category are separate views of the same files.
- Instruction Markdown such as SKILL.md can be source; README can be documentation.
- JSON/YAML can be definitions or data; use returned classification and reasons.
- Markdown/JSON/YAML basic support reports files, bytes, physical and nonblank lines.
- JS/TS/Python/Java/Shell lexical support adds code/comment metrics in supported syntax.
- Code lines include mixed code/comment lines; do not add the mixed subset twice.
- Null means unmeasured. Always state code/comment coverage and material exclusions.
- Source composition excludes test/generated categories even when their role is instruction.
- Do not equate instruction lines or different language LOC with a common functional size.
