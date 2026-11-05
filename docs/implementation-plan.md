# miku-repo-scale-skills 実装計画

2026-11-05。状態：初期ファイル配置済み、runtime 受領・実行 adapter・検証は未着手。
全体の RSC-00〜15 は upstream `miku-repo-scale/docs/implementation-plan.md` に保存する。
この文書は companion repository の担当作業を具体化する。

## 1. 初期配置と依存

- repository: `https://github.com/igapyon/miku-repo-scale-skills`
- local: `/Users/igapyon/Documents/git/miku-repo-scale-skills`
- 初期 branch: `devel-tiga1105wcg`。再開時は現在の Git 状態を優先する。
- upstream: `https://github.com/igapyon/miku-repo-scale`
- installed skill: `igapyon-miku-repo-scale`
- package 初期版: `0.1.0`。upstream runtime との同版を永続要件にしない。
- 依存: upstream RSC-01〜13 が契約・CLI・実動 artifact を完成すること。

README、package、規約、SKILL.md、reference、bundle skeleton、release workflow を配置済み。
runtime 不在を理由にダミー CLI を同梱したり、計測を skill へ実装したりしない。
required-runtime の受領前は実行 wiring・bundle smoke 完了とは記録しない。

## 2. 実装作業

| ID | 変更 | 前提 | 完了条件・検証 |
| --- | --- | --- | --- |
| 受領 | `docs/upstream-runtime.md` と `runtime/` | upstream RSC-13 | source revision、artifact version、SHA-256、schema を実 artifact と照合 |
| RSC-14a | `runtime/runtime.json`、`lib/runtime.mjs` | 受領 | exact basename/digest/version を検証。欠損・改変・他版混在を検出 |
| RSC-14b | `lib/run.mjs` | 14a | Node CLI を argv 配列で呼ぶ。stdout JSON/schema と exit 0/2/1 を扱い、product logic を持たない |
| RSC-14c | `SKILL.md`、`references/cli.md`、`references/metrics.md` | 14b | 確認した操作、役割・拡張子・coverage、hard error を簡潔に案内できる |
| RSC-14d | `scripts/`、`tests/`、package | 14a〜c | required files/ライセンスを同梱。runtime不在で失敗し、dev filesを除外 |
| RSC-15a | `tests/isolated-bundle-smoke.test.mjs` | 14d | 一時展開先で CLI version/help/analyze が動き、元 source を参照しない |
| RSC-15b | 複数形式の受入 fixture | 15a | Markdownの指示、JSON定義/評価データ、TS等の内訳とnull/coverageが正しい |
| RSC-15c | OS/Node検証、ZIP build | 15a | Node22/24/26と対象OSの結果を記録。ZIP外部toolの可搬性を決定・検証 |
| RSC-15d | 対話確認、README/TODO/開発記録、release workflow | 15b〜c | 実装済み/未確認を分け、実runtimeとisolated smoke成功後に配布可能とする |

初回に実装するのは「受領」と RSC-14a。各作業で対象テスト・差分・実施結果を記録する。
`npm test` は意味のある executable tests を追加した段階で定義する。

## 3. 重要な受入ケース

- runtime欠損、空ファイル、digest不一致、version不一致、未知schemaを成功にしない。
- 同じ場所に他版artifactがあってもmanifestで固定した1ファイルだけを選ぶ。
- CLIのok/partial/error、warning、null、process起動失敗を区別する。
- READMEとSKILL.mdが同じ.mdでも、documentationとinstruction/sourceを説明し分ける。
- JSONは定義とデータを混同せず、TS/TSXの語彙はupstream resultに従う。
- bundleは`skills/igapyon-miku-repo-scale/` rooted。source tree、tests、workplace、node_modulesを含めない。
- 大きなfiles配列を無条件に会話へ出さず、summaryとcoverageを使う。
- 単なる名前言及・説明依頼は計測を実行しない。利用指示は文脈から対象を解決する。

## 4. 配布準備の現状

`build:bundle` / `build:bundle:zip` は starter の骨格を配置済み。
現在は実 runtime 不在で停止する。存在検査だけで実動保証とせず、RSC-14d/15aで
実際のversion/help/analyzeとmanifest検証をbuild/releaseへ接続する。
現workflowはrelease公開時の入口を用意するもの。upstream runtimeがなくbuildが失敗する間は配布不可。

先行変更を保持し、既存LICENSEと作業branchを維持する。GitHubへの公開・pushはこの初期配置作業に含めない。
