# タスクリスト：ComponentBrowser の拡充

## Phase 1: データ基盤

### 1-1. 型定義の拡張
- [x] `src/app/playground/_components/types.ts` に `ShadcnCategory` 型と `ShadcnComponentEntry` インターフェースを追加
- [x] 既存の `PlaygroundEntry` / `ComponentInfo` は変更しない

### 1-2. shadcn-registry.ts の作成
- [x] MCP の `list_components` で shadcn/ui 全コンポーネント一覧を取得
- [x] 取得結果をもとに `src/app/playground/_components/shadcn-registry.ts` を作成
- [x] 各コンポーネントにカテゴリ（Form / Data Display / Layout / Navigation / Feedback / Overlay / Other）を分類
- [x] `src/components/ui/` 配下のファイルと照合し `installed` フラグを設定
- [x] 各コンポーネントに `docsUrl`（`https://ui.shadcn.com/docs/components/[slug]`）を設定

## Phase 2: UI コンポーネント実装

### 2-1. ComponentBrowser.tsx のリニューアル
- [x] 既存の `ComponentBrowser.tsx` を `shadcn-registry.ts` のデータに切り替え
- [x] パネル開閉トグル（既存の仕組みを維持）
- [x] 検索フィールド（Input コンポーネント使用、コンポーネント名・説明で絞り込み）
- [x] カテゴリフィルタ（Tabs コンポーネント使用、All + 各カテゴリ）
- [x] インストール済みフィルタ（チェックボックス切り替え）
- [x] コンポーネントカード表示（カテゴリ別グルーピング、インストール状態の視覚的区別）
- [x] 各カードに shadcn/ui 公式ドキュメントへのリンク

### 2-2. PromptTemplate.tsx の作成
- [x] `src/app/playground/_components/PromptTemplate.tsx` を新規作成
- [x] Tabs で「デモ生成用」「レジストリ更新用」を切り替え
- [x] コピーボタン（クリップボードコピー + フィードバック表示）
- [x] ComponentBrowser パネル内の下部に統合

## Phase 3: 品質チェック・ドキュメント

### 3-1. ビルド・lint 検証
- [x] `pnpm build` がエラーなく通る
- [x] `pnpm lint` がエラーなく通る

### 3-2. ドキュメント更新
- [x] CLAUDE.md にレジストリ更新の手順・プロンプト例を追記
- [x] `.cursor/rules/project-memory.mdc` に同内容を同期
