# 要求内容：ガイドライン改善

## 概要

CLAUDE.md（および同期対象の `.cursor/rules/project-memory.mdc`）に定義された UI コンポーネントライブラリ構築方針に対し、レビューで特定された 8 つの改善点と 3 つの軽微な指摘を反映する。

## 背景

ガイドラインのレビューにおいて、以下の課題が明らかになった。

- Tailwind CSS v4 の設定方式と記載内容の矛盾
- Storybook の導入時期が曖昧で、コンポーネント構成ルールと齟齬がある
- テスト戦略（フレームワーク選定・テスト粒度）の記載が欠落
- WSL / devcontainer 環境への配慮が不足
- MCP 設定が Claude Code と Cursor で異なる点が未記載
- shadcn/ui コンポーネントの更新手順が未定義
- CATALOG.md の手動運用による運用負荷
- コミットメッセージ規約がコンポーネント以外のケースをカバーしていない
- `framer-motion` のパッケージ名変更が未反映
- インポート順序の自動化手段が未記載

## 変更対象ドキュメント

### 直接変更

1. **CLAUDE.md** — ガイドライン本文の改善
2. **.cursor/rules/project-memory.mdc** — CLAUDE.md との同期（本文部分）

### 間接的に影響する可能性があるドキュメント

3. **docs/product-requirements.md** — コンポーネント提供形態（Storybook 段階的導入への変更）、非機能要件（テスト戦略追記）

## 改善項目一覧

### IP-1: Tailwind CSS v4 との整合性

**現状の問題**: リポジトリ構造に `tailwind.config.ts` が記載されているが、Tailwind v4 は CSS ベース設定（`@theme`）に移行済み。

**期待する結果**:
- リポジトリ構造から `tailwind.config.ts` を削除し、`src/app/globals.css` での `@import "tailwindcss"` + `@theme` による設定を記載
- `tailwind-merge` v3 系との互換性に関する注記を追加

### IP-2: Storybook の位置づけ明確化

**現状の問題**: コンポーネント構成で `.stories.tsx` が必須だが、Storybook は「導入時」と曖昧。

**期待する結果**:
- 初期段階では `.stories.tsx` を必須としない
- Next.js カタログページでのプレビューを主とする方針を明記
- Storybook は「将来導入」として明確に分離
- コンポーネント構成ルールを初期段階・Storybook 導入後の 2 段階で定義

### IP-3: テスト戦略の追記

**現状の問題**: テストファイルは必須だが、テストフレームワーク・テスティングライブラリ・テスト粒度の記載がない。

**期待する結果**:
- テストフレームワーク: Vitest + React Testing Library を明記
- テスト粒度（レンダリング / インタラクション / アクセシビリティ）を定義
- axe-core による自動アクセシビリティチェックを推奨

### IP-4: WSL / devcontainer 環境要件の追記

**現状の問題**: ガイドラインに WSL / devcontainer に関する記述がない。

**期待する結果**:
- 環境要件セクション（Node.js / pnpm のバージョン要件）を追加
- ファイルウォッチャーの制限（`CHOKIDAR_USEPOLLING`）に関する注記
- MCP サーバーのパス設定がホスト / コンテナで異なる点の注意事項

### IP-5: MCP 設定の具体化

**現状の問題**: `.mcp.json` をリポジトリ構造に含めているが、Claude Code と Cursor での設定方法の違いが未記載。

**期待する結果**:
- Claude Code 向け（`.mcp.json` をプロジェクトルートに配置）の設定例
- Cursor 向け（Settings > MCP Servers または `.cursor/mcp.json`）の設定例

### IP-6: shadcn/ui コンポーネント更新手順の追加

**現状の問題**: `ui/` 内を直接編集しない方針はあるが、更新手順がない。

**期待する結果**:
- `npx shadcn@latest diff` での差分確認手順
- `npx shadcn@latest add [component] --overwrite` での更新手順
- ラッパーコンポーネントへの影響確認手順

### IP-7: CATALOG.md 運用負荷の軽減

**現状の問題**: 手動更新では更新漏れが頻発する可能性がある。

**期待する結果**:
- CATALOG.md の自動生成スクリプト化の方針を記載
- Next.js カタログページによる自動検出を主とし、CATALOG.md は補助的位置づけとする

### IP-8: コミットメッセージ規約の拡張

**現状の問題**: `feat(category): ComponentName` のパターンのみで、他の変更種別が未定義。

**期待する結果**:
- `fix`, `refactor`, `docs`, `chore` 等のプレフィックスを追加
- コンポーネント以外の変更に対するメッセージ形式を定義

### IP-9: 軽微な修正

**framer-motion → motion**:
- パッケージ名を `motion` に更新（`npm install motion`）

**コンポーネント README の段階的適用**:
- 初期段階では JSDoc + カタログページで代替し、README は成熟したコンポーネントのみとする方針を追記

**インポート順序の自動化**:
- ESLint `import/order` または `@trivago/prettier-plugin-sort-imports` による自動化を推奨する旨を追記

## 受け入れ条件

- [ ] CLAUDE.md に全 9 項目の改善が反映されている
- [ ] `.cursor/rules/project-memory.mdc` が CLAUDE.md と同期されている
- [ ] `docs/product-requirements.md` が必要に応じて更新されている
- [ ] 各改善項目が矛盾なく整合性を保っている

## 制約事項

- ガイドラインの基本構造（セクション構成の大枠）は維持する
- 既存の設計思想（合成パターン優先、shadcn/ui ベース、アクセシビリティ必須）は変更しない
- 新しいツールやライブラリの導入は方針の記載に留め、実際のセットアップは別作業とする
