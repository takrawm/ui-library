# 設計：ガイドライン改善

## 実装アプローチ

CLAUDE.md のガイドライン本文に対して、既存のセクション構造を維持しつつ改善内容を挿入・修正する。変更完了後、`.cursor/rules/project-memory.mdc` の本文部分を同期する。`docs/product-requirements.md` は影響がある箇所のみ更新する。

## 変更箇所の設計

### IP-1: Tailwind CSS v4 との整合性

**変更箇所**: CLAUDE.md「リポジトリ全体構造」セクション、および「技術スタック」に該当する記述

**変更内容**:
- リポジトリ構造から `tailwind.config.ts` を削除
- `src/app/globals.css` を追加し、役割を注記（`@import "tailwindcss"` + `@theme` によるカスタマイズ）
- 「注意事項」または技術スタック付近に `tailwind-merge` v3 系との互換性に関する注記を追加

**影響範囲**: リポジトリ構造セクションのみ。コーディング規約の `cn()` 利用方針には影響なし。

---

### IP-2: Storybook の位置づけ明確化

**変更箇所**: CLAUDE.md「コンポーネント構成ルール」セクション

**変更内容**:
- 構成ルールを「初期段階」と「Storybook 導入後」の 2 段階に分割
- 初期段階では `.stories.tsx` を含めない
- Next.js カタログページでのプレビューを主とする旨を明記
- リポジトリ構造の `stories/` ディレクトリの説明も「将来導入」と統一

**影響範囲**:
- CLAUDE.md「コンポーネント構成ルール」
- CLAUDE.md「リポジトリ全体構造」
- CLAUDE.md「品質チェックリスト」（Storybook 関連項目の条件付き化は不要、現状記載なし）
- `docs/product-requirements.md` セクション 3「コンポーネント提供形態」、AC-1

---

### IP-3: テスト戦略の追記

**変更箇所**: CLAUDE.md に新規セクション「テスト戦略」を追加

**挿入位置**: 「コーディング規約」セクションの後、「LLM（Claude）への指示の出し方ガイド」セクションの前

**追加内容**:
```markdown
## テスト戦略

### テストフレームワーク
- Vitest + React Testing Library

### テスト粒度
- **レンダリングテスト**: props なしでクラッシュしないことを確認
- **インタラクションテスト**: 主要な操作（クリック、キーボード）の動作確認
- **アクセシビリティテスト**: axe-core（vitest-axe）による自動チェック

### 方針
- カバレッジ目標は設定しない（テストの有無と質を重視）
- テストファイルはコンポーネントと同じディレクトリに配置
```

**影響範囲**:
- `docs/product-requirements.md` NFR-3 にテストフレームワークの記載を追加

---

### IP-4: WSL / devcontainer 環境要件の追記

**変更箇所**: CLAUDE.md に新規セクション「環境要件」を追加

**挿入位置**: 「技術スタック」の直後（現在はユーザー入力ガイドライン内の冒頭に技術スタックが記載されている。CLAUDE.md 本文では「リポジトリ全体構造」の前が適切）

**追加内容**:
```markdown
## 環境要件

### ランタイム・ツール
- Node.js: v20 以上
- pnpm: v9 以上

### WSL / devcontainer 環境
- ファイルウォッチャーの制限に注意（`CHOKIDAR_USEPOLLING=true` が必要な場合あり）
- MCP サーバーはホスト側で動作する場合とコンテナ内で動作する場合がある。
  `.mcp.json` のパス設定がホスト / コンテナで異なる点に注意
```

**影響範囲**: CLAUDE.md のみ。新規セクション追加のため既存への影響は最小。

---

### IP-5: MCP 設定の具体化

**変更箇所**: CLAUDE.md「shadcn/ui MCP サーバーの活用」セクション

**変更内容**: 既存の「MCP ツールの使い方（参考）」の前に、環境別の設定方法を追加

**追加内容**:
```markdown
### MCP サーバーの設定

#### Claude Code の場合
`.mcp.json` をプロジェクトルートに配置：
（JSON 設定例）

#### Cursor の場合
Cursor Settings > MCP Servers から追加、
もしくは `.cursor/mcp.json` に配置：
（JSON 設定例）
```

**影響範囲**: 既存セクション内への追記。構造変更なし。

---

### IP-6: shadcn/ui コンポーネント更新手順の追加

**変更箇所**: CLAUDE.md「よくある判断基準」セクション

**変更内容**: 既存の「shadcn/ui にあるコンポーネントをそのまま使うか〜」の項目に、更新手順を追加

**追加内容**:
```markdown
### 「shadcn/ui コンポーネントを更新するとき」

1. `npx shadcn@latest diff` で差分を確認
2. 差分が許容範囲であれば `npx shadcn@latest add [component] --overwrite`
3. ラッパーコンポーネント側に影響がないか確認
4. `pnpm build && pnpm lint` で検証
```

**影響範囲**: 「よくある判断基準」セクション内への追記。

---

### IP-7: CATALOG.md 運用負荷の軽減

**変更箇所**: CLAUDE.md「品質チェックリスト」および「リポジトリ全体構造」

**変更内容**:
- CATALOG.md の位置づけを「手動必須」から「自動生成推奨、補助的位置づけ」に変更
- 品質チェックリストの CATALOG.md 項目を「カタログページに反映されていること」に変更
- 将来的にスクリプト化する方針を注記

**影響範囲**:
- CLAUDE.md「品質チェックリスト」項目 7
- CLAUDE.md「リポジトリ全体構造」の `docs/CATALOG.md` の説明
- `docs/product-requirements.md` AC-4

---

### IP-8: コミットメッセージ規約の拡張

**変更箇所**: CLAUDE.md「コンポーネント作成ワークフロー」ステップ 5

**変更内容**: 単一パターンから複数パターンへ拡張

**追加内容**:
```markdown
### コミットメッセージ規約
- `feat(category): ComponentName - 新規コンポーネント追加`
- `fix(category): ComponentName - バグ修正`
- `refactor(category): ComponentName - リファクタリング`
- `docs: ドキュメント更新`
- `chore: ビルド設定、依存関係の更新`
- `test(category): ComponentName - テスト追加・修正`
```

**影響範囲**: ワークフローセクション内の修正。

---

### IP-9: 軽微な修正

#### 9a: framer-motion → motion

**変更箇所**: CLAUDE.md「技術スタック」

**変更内容**: `framer-motion` → `motion`（パッケージ名変更の反映）

#### 9b: コンポーネント README の段階的適用

**変更箇所**: CLAUDE.md「コンポーネント構成ルール」「コンポーネント作成ワークフロー」ステップ 4

**変更内容**:
- 初期段階では JSDoc コメントで代替可能とする
- README は成熟したコンポーネント（安定版・再利用実績あり）に対して作成する方針を明記

#### 9c: インポート順序の自動化

**変更箇所**: CLAUDE.md「コーディング規約」のインポート順序セクション

**変更内容**: ESLint `import/order` または `@trivago/prettier-plugin-sort-imports` での自動化を推奨する注記を追加

---

## 同期対象

すべての CLAUDE.md 変更完了後、`.cursor/rules/project-memory.mdc` の `## 概要` 以降の本文を CLAUDE.md と一致させる。フロントマター・タイトル・同期注意書きは維持。

## docs/product-requirements.md への影響

以下の箇所を更新する：

| セクション | 変更内容 | 対応 IP |
|---|---|---|
| 3. コンポーネント提供形態 | Storybook を「将来導入」に変更 | IP-2 |
| AC-1 | `.stories.tsx` を初期段階の必須から除外 | IP-2 |
| AC-4 | CATALOG.md を補助的位置づけに変更 | IP-7 |
| NFR-3 | テストフレームワーク（Vitest + RTL）を明記 | IP-3 |

## リスク・注意点

- CLAUDE.md は長大なファイルのため、編集時にセクション間の整合性が崩れないよう注意
- `.cursor/rules/project-memory.mdc` の同期漏れに注意（`docs/document-sync-flow.md` のチェックリストで確認）
- `docs/product-requirements.md` の変更は最小限に留め、ガイドラインとの矛盾解消に焦点を当てる
