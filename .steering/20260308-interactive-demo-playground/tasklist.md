# タスクリスト：インタラクティブデモプレイグラウンド

## タスク一覧

### フェーズ 0: 前提環境セットアップ

- [x] **T-0a**: shadcn/ui MCP サーバー設定ファイルの作成
  - `.mcp.json`（プロジェクトルート、Claude Code 用）を作成
  - `.cursor/mcp.json`（Cursor 用）を作成
  - **完了条件**: MCP サーバー経由で `list_components` が実行できる

- [x] **T-0b**: Next.js プロジェクトの初期化（未済の場合）
  - `pnpm create next-app` または手動で package.json, tsconfig.json, next.config.ts 等を作成
  - shadcn/ui の初期化（`npx shadcn@latest init`）
  - `components.json`, `src/app/globals.css`, `src/lib/utils.ts` の設定
  - **完了条件**: `pnpm dev` で Next.js アプリが起動する

- [x] **T-0c**: 基本 shadcn/ui コンポーネントの追加
  - MCP サーバーで最新仕様を確認してから追加
  - `npx shadcn@latest add button card input label table accordion badge`
  - **完了条件**: `src/components/ui/` に各コンポーネントファイルが存在する

### フェーズ 1: プレイグラウンド基盤

- [x] **T-1**: プレイグラウンドレイアウトの作成
  - `src/app/playground/layout.tsx` を作成
  - プレイグラウンド用のレイアウト（ヘッダー、ナビゲーション等）
  - **完了条件**: `/playground` 配下のページに共通レイアウトが適用される

- [x] **T-2**: プレイグラウンドトップページの作成
  - `src/app/playground/page.tsx` を作成（Server Component）
  - `components/` と `demos/` 配下を走査して2セクション構成で表示
    - コンポーネントショーケースセクション
    - 組み合わせデモセクション
  - 「新しいデモ」カード（Claude Code / Cursor での生成手順を案内）
  - **完了条件**: `/playground` にアクセスしてショーケース + デモ一覧が表示される

- [x] **T-3**: DemoCard コンポーネントの作成
  - `src/app/playground/_components/DemoCard.tsx` を作成
  - コンポーネントショーケースカードとデモカードの両方に対応
  - カードクリックで各ページに遷移
  - **完了条件**: トップページにカードが表示される

- [x] **T-4a**: ショーケース共通レイアウトの作成
  - `src/app/playground/components/layout.tsx` を作成
  - 「一覧に戻る」リンク、コンポーネント名の表示
  - **完了条件**: ショーケースページに共通レイアウトが適用される

- [x] **T-4b**: デモ共通レイアウトの作成
  - `src/app/playground/demos/layout.tsx` を作成
  - 「一覧に戻る」リンク、デモタイトルの表示
  - **完了条件**: デモページに共通レイアウトが適用される

- [x] **T-5**: 型定義の作成
  - `src/app/playground/_components/types.ts` を作成
  - PlaygroundEntry（slug, title, type: "component" | "demo"）等の型定義
  - **完了条件**: プレイグラウンド固有の型が定義されている

### フェーズ 2: コンポーネントショーケース

- [x] **T-6**: ComponentBrowser コンポーネントの作成
  - `src/app/playground/_components/ComponentBrowser.tsx` を作成
  - 利用可能コンポーネントの一覧表示（name, category, description, importPath）
  - 折りたたみ可能なパネル
  - **完了条件**: トップページにコンポーネント参照パネルが表示される

- [x] **T-7a**: Button ショーケースページの作成
  - `src/app/playground/components/button/page.tsx` を作成
  - MCP で Button の最新仕様（variants, sizes, props）を確認してから実装
  - 全 variant × size の組み合わせ、disabled 状態、アイコン付き等を表示
  - **完了条件**: `/playground/components/button` で全バリエーションが確認できる

- [x] **T-7b**: Card ショーケースページの作成
  - `src/app/playground/components/card/page.tsx` を作成
  - MCP で Card の最新仕様を確認
  - CardHeader, CardTitle, CardDescription, CardContent, CardFooter の組み合わせ
  - **完了条件**: `/playground/components/card` で全バリエーションが確認できる

- [x] **T-7c**: Input ショーケースページの作成
  - `src/app/playground/components/input/page.tsx` を作成
  - MCP で Input の最新仕様を確認
  - type バリエーション（text, email, password, number）、disabled、placeholder 等
  - **完了条件**: `/playground/components/input` で全バリエーションが確認できる

- [x] **T-7d**: その他の主要コンポーネントのショーケース作成
  - Table, Accordion, Badge, Label 等（T-0c で追加したコンポーネント）
  - 各コンポーネントのバリエーションを表示
  - **完了条件**: 追加した全ベースコンポーネントにショーケースページが存在する

### フェーズ 3: 組み合わせデモの作成

- [x] **T-8a**: サンプルデモ 1 — 統計カードダッシュボード
  - `src/app/playground/demos/stat-cards/page.tsx` を作成
  - Card, CardHeader, CardTitle, CardContent を使用
  - 4枚の統計カードをグリッドレイアウトで表示
  - サンプルデータ（売上、ユーザー数、注文数、レビュー評価等）をファイル内にハードコード
  - **完了条件**: `/playground/demos/stat-cards` でデモが表示される

- [x] **T-8b**: サンプルデモ 2 — ログインフォーム
  - `src/app/playground/demos/login-form/page.tsx` を作成
  - Input, Button, Label, Card 等を使用
  - バリデーション付きのフォーム
  - サンプルデータ（エラーメッセージ等）をファイル内にハードコード
  - **完了条件**: `/playground/demos/login-form` でデモが表示される

### フェーズ 4: 品質確認・ドキュメント更新

- [x] **T-9**: ビルド・Lint 確認
  - `pnpm build` がエラーなく通ること
  - `pnpm lint` がエラーなく通ること
  - TypeScript エラーが 0 件であること
  - **完了条件**: 品質基準を満たす

- [x] **T-10**: 永続的ドキュメントの更新
  - `docs/product-requirements.md` にプレイグラウンド機能の要件を追加
  - CLAUDE.md のリポジトリ全体構造に playground 関連ディレクトリを追加
  - CLAUDE.md にプレイグラウンドのデモ生成ワークフロー・MCP 活用手順を追記
  - `.cursor/rules/project-memory.mdc` を CLAUDE.md と同期
  - **完了条件**: 永続的ドキュメントがプレイグラウンド機能と MCP 設定を反映している
