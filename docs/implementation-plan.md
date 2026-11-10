# miku-repo-scale-skills 実装計画

2026-11-10。状態：RSC-14a〜15bを実装・確認済み。upstream CLI 0.2.7（source revision 03c796ecf29bbc14320d0a13e3d317c6f9b32d23）をGitHub Releaseから受領・検証した。Windows root誤判定の修正を含むruntimeはローカルで再確認済み。hosted Node/OS matrixとrelease readinessは未完了。
全体の RSC-00〜15 は upstream `miku-repo-scale/docs/implementation-plan.md` に保存する。
この文書は companion repository の担当作業を具体化する。

## 1. 初期配置と依存

- repository: `https://github.com/igapyon/miku-repo-scale-skills`
- local: `/Users/igapyon/Documents/git/miku-repo-scale-skills`
- 初期 branch: `devel-tiga1105wcg`。再開時は現在の Git 状態を優先する。
- upstream: `https://github.com/igapyon/miku-repo-scale`
- installed skill: `igapyon-miku-repo-scale`
- package 初期版: `0.1.0`。現在は pinned upstream CLI と package version を `0.2.7` に揃える。
- 依存: upstream RSC-01〜13 が契約・CLI・実動 artifact を完成すること。

README、package、規約、SKILL.md、reference、bundle skeleton、release workflow を配置済み。
RSC-14aでupstream CLI artifactを受領し、manifestとdigest検証を追加した。
計測ロジックをskillへ重複実装せず、RSC-14b/14d/15a完了前は実動済みと記録しない。

## 2. 実装作業

| ID | 変更 | 前提 | 完了条件・検証 |
| --- | --- | --- | --- |
| 受領 | `docs/upstream-runtime.md` と `runtime/` | upstream RSC-13 | source revision、artifact version、SHA-256、schema を実 artifact と照合 |
| RSC-14a | `runtime/runtime.json`、`lib/runtime.mjs` | 受領 | exact basename/digest/version を検証。欠損・改変・他版混在を検出 |
| RSC-14b | `lib/run.mjs` | 14a | Node CLI を argv 配列で呼ぶ。stdout JSON/schema と exit 0/2/1 を扱い、product logic を持たない |
| RSC-14c | `SKILL.md`、`references/cli.md`、`references/metrics.md` | 14b | 確認した操作、役割・拡張子・coverage、hard error を簡潔に案内できる |
| RSC-14d | `scripts/`、`tests/`、package | 14a〜c | required files/ライセンスを同梱。runtime不在で失敗し、dev filesを除外 |
| RSC-15a | `tests/isolated-bundle-smoke.test.mjs` | 14d | 一時展開先で CLI version/help/analyze が動き、元 source を参照しない |
| RSC-15b | `tests/acceptance.test.mjs` | 15a | Markdownの指示、JSON定義/評価データ、JSONL、TS、binary、ignore metadata、role/coverageが正しい |
| RSC-15c | `.github/workflows/ci.yml`、ZIP build | 15a | Node22/24/26 × Ubuntu/macOS/Windows を hosted CI で確認。ZIPはUbuntu runner限定とし、bundle jobで検証 |
| RSC-15d | 対話確認、README/TODO/開発記録、release workflow | 15b〜c | 実装済み/未確認を分け、実runtimeとisolated smoke成功後に配布可能とする |

「受領」と RSC-14a〜15b は完了。各作業で対象テスト・差分・実施結果を記録する。
`npm test` はruntime integrity、adapter、bundle/ZIP contents、isolated CLI smoke、metric acceptanceを実行する。
RSC-15cのCI workflowは配置済みだが、hosted matrix結果は未確認。

## 3. 重要な受入ケース

- runtime欠損、空ファイル、digest不一致、version不一致、未知schemaを成功にしない。
- 同じ場所に他版artifactがあってもmanifestで固定した1ファイルだけを選ぶ。
- CLIのok/partial/error、warning、null、process起動失敗を区別する。
- READMEとSKILL.mdが同じ.mdでも、documentationとinstruction/sourceを説明し分ける。
- JSONは定義とデータを混同せず、TS/TSXの語彙はupstream resultに従う。
- bundleは`skills/igapyon-miku-repo-scale/` rooted。source tree、tests、workplace、node_modulesを含めない。
- 大きなfiles配列を無条件に会話へ出さず、summaryとcoverageを使う。
- 単なる名前言及・説明依頼は計測を実行しない。利用指示は文脈から対象を解決する。

### RSC-15d 対話受入ケース（2026-11-08 desk review）

以下を SKILL.md と references に照らしてレビューする。これは指示文の
desk review であり、Hosted CI や別エージェント上での会話実行結果ではない。

| 会話 | 期待動作 | レビュー結果 |
| --- | --- | --- |
| 「このリポジトリを miku-repo-scale で分析して」 | 文脈から対象を解決し、summaryで実行 | summaryを標準とし、対象不明なら確認する手順あり |
| 「miku-repo-scaleとは？」または名前だけの言及 | 説明だけを返し、計測しない | 明示依頼・合意済み継続だけで起動する境界あり |
| 「大きいファイル、バイナリ、ignore対象の名前とサイズを見せて」 | `--detail files --inventory all` を使い、要求された項目に絞る | 2026-11-08に選択手順を追加。untracked/ignoredの内容は読まない |
| 対象リポジトリが会話から分からない | 推測せず対象を確認 | 対象が曖昧な場合だけ確認する手順あり |
| analyzerがpartial/error、またはコード行がnull | status、diagnostics、coverageを保ち、nullを0にしない | SKILL.md と metrics reference に明記 |
| pinned runtimeが欠損または改変 | unavailableとして報告し、別CLIへフォールバックしない | SKILL.md と runtime tests に明記 |

## 4. 配布準備の現状

`build:bundle` は受領済みのexact runtimeとlicense noticesを含むbundleを生成する。
isolated CLI smokeはversion/help/analyzeを確認する。macOSの`npm run build`で13 testsが通り、ZIPの内容検査も成功した。2026-11-08にNode.js 26.12.1でも`npm ci`と`npm run build`（13 tests、ZIP生成）が成功した。対話ケースとrelease workflowのdesk reviewは記録済み。RSC-15c hosted matrixは未実行で、RSC-15dの最終release-readiness判定も保留する。
現workflowはrelease公開時の入口を用意するもの。hosted runtime buildは未実施。

先行変更を保持し、既存LICENSEと作業branchを維持する。GitHubへの公開・pushはこの初期配置作業に含めない。
