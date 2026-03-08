# タスクリスト：インタラクティブデモプレイグラウンド

## タスク一覧

### フェーズ 1: プレイグラウンド基盤

- [ ] **T-1**: プレイグラウンドレイアウトの作成
  - `src/app/playground/layout.tsx` を作成
  - プレイグラウンド用のレイアウト（ヘッダー、戻るリンク等）
  - **完了条件**: `/playground` 配下のページに共通レイアウトが適用される

- [ ] **T-2**: デモ一覧ページの作成
  - `src/app/playground/page.tsx` を作成（Server Component）
  - `src/app/playground/demos/` 配下のディレクトリを走査してデモ一覧を動的生成
  - デモカードの表示（デモ名、作成日）
  - 「新しいデモ」カード（Claude Code / Cursor での生成手順を案内）
  - **完了条件**: `/playground` にアクセスしてデモ一覧が表示される

- [ ] **T-3**: DemoCard コンポーネントの作成
  - `src/app/playground/_components/DemoCard.tsx` を作成
  - デモ名、説明、作成日の表示
  - カードクリックで個別デモページに遷移
  - **完了条件**: デモ一覧ページにカードが表示される

- [ ] **T-4**: デモ共通レイアウトの作成
  - `src/app/playground/demos/layout.tsx` を作成
  - 「一覧に戻る」リンク
  - デモタイトルの表示
  - **完了条件**: 個別デモページに共通レイアウトが適用される

- [ ] **T-5**: 型定義の作成
  - `src/app/playground/_components/types.ts` を作成
  - DemoInfo（slug, title, description, createdAt）等の型定義
  - **完了条件**: プレイグラウンド固有の型が定義されている

### フェーズ 2: コンポーネント参照

- [ ] **T-6**: ComponentBrowser コンポーネントの作成
  - `src/app/playground/_components/ComponentBrowser.tsx` を作成
  - 利用可能コンポーネントの一覧表示（name, category, description, importPath）
  - 折りたたみ可能なパネル
  - Claude Code / Cursor でプロンプトを書く際の参照用
  - **完了条件**: デモ一覧ページにコンポーネント参照パネルが表示される

### フェーズ 3: サンプルデモの作成

- [ ] **T-7**: サンプルデモ 1 — 統計カードダッシュボード
  - `src/app/playground/demos/stat-cards/page.tsx` を作成
  - Card, CardHeader, CardTitle, CardContent を使用
  - 4枚の統計カードをグリッドレイアウトで表示
  - **完了条件**: `/playground/demos/stat-cards` でデモが表示される

- [ ] **T-8**: サンプルデモ 2 — ログインフォーム
  - `src/app/playground/demos/login-form/page.tsx` を作成
  - Input, Button, Label 等を使用
  - バリデーション付きのフォーム
  - **完了条件**: `/playground/demos/login-form` でデモが表示される

### フェーズ 4: 品質確認・ドキュメント更新

- [ ] **T-9**: ビルド・Lint 確認
  - `pnpm build` がエラーなく通ること
  - `pnpm lint` がエラーなく通ること
  - TypeScript エラーが 0 件であること
  - **完了条件**: 品質基準を満たす

- [ ] **T-10**: 永続的ドキュメントの更新
  - `docs/product-requirements.md` にプレイグラウンド機能の要件を追加
  - CLAUDE.md のリポジトリ全体構造に playground 関連ディレクトリを追加
  - CLAUDE.md にプレイグラウンドのデモ生成ワークフローを追記
  - `.cursor/rules/project-memory.mdc` を CLAUDE.md と同期
  - **完了条件**: 永続的ドキュメントがプレイグラウンド機能を反映している
