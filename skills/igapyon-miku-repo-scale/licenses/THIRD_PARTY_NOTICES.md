# Runtime and skill notices

The skill bundle contains the upstream `miku-repo-scale` CLI runtime version
`0.2.10` under its Apache-2.0 license. A copy of the upstream product license
is `miku-repo-scale-LICENSE`. The skill adapter is distributed under the
companion repository's Apache-2.0 license, copied as
`miku-repo-scale-skills-LICENSE`.

The standalone CLI statically embeds the following parser/runtime packages and
WebAssembly grammars. Each is MIT licensed; the corresponding complete license
texts are included beside this notice.

| Package | Version | License file |
| --- | --- | --- |
| `@willbooster/web-tree-sitter` | `17.0.1` | `web-tree-sitter-MIT.txt` |
| `@willbooster/tree-sitter-javascript` | `22.0.1` | `tree-sitter-javascript-MIT.txt` |
| `@willbooster/tree-sitter-typescript` | `26.0.1` | `tree-sitter-typescript-MIT.txt` |
| `@willbooster/tree-sitter-typescript/javascript` | `26.0.1` | `tree-sitter-typescript-javascript-MIT.txt` |
| `@willbooster/tree-sitter-python` | `16.0.0` | `tree-sitter-python-MIT.txt` |
| `@willbooster/tree-sitter-java` | `32.0.1` | `tree-sitter-java-MIT.txt` |
| `@willbooster/tree-sitter-bash` | `12.0.0` | `tree-sitter-bash-MIT.txt` |

The skill's installed runtime requires Node.js 22 or newer and Git. It does not
install npm dependencies, execute repository source, or run a shell interpreter.
