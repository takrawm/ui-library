# タスクリスト：インタラクティブデモプレイグラウンド

## タスク一覧

### フェーズ 1: 基盤セットアップ

- [ ] **T-1**: Prisma + SQLite セットアップ
  - `pnpm add @prisma/client && pnpm add -D prisma`
  - `prisma/schema.prisma` を作成（Demo, Message モデル）
  - `npx prisma migrate dev --name init` でマイグレーション実行
  - `src/lib/db.ts` に Prisma クライアントのシングルトンを作成
  - `.gitignore` に `prisma/dev.db` を追加
  - `.env.local` に `DATABASE_URL` を追加（`.env.example` も用意）
  - **完了条件**: `npx prisma studio` でテーブルが確認できる

- [ ] **T-2**: Anthropic SDK セットアップ
  - `pnpm add @anthropic-ai/sdk`
  - `.env.local` に `ANTHROPIC_API_KEY` を追加（`.env.example` も更新）
  - **完了条件**: パッケージがインストールされ、環境変数テンプレートが用意されている

- [ ] **T-3**: Sandpack セットアップ
  - `pnpm add @codesandbox/sandpack-react`
  - **完了条件**: パッケージがインストールされている

### フェーズ 2: サーバーサイド実装

- [ ] **T-4**: コンポーネントレジストリの作成
  - `src/lib/playground/component-registry.ts` を作成
  - `src/components/ui/` 配下の主要コンポーネント情報を登録（Button, Card, Input, Table 等）
  - 各コンポーネントの name, category, description, props, example を定義
  - **完了条件**: レジストリから利用可能コンポーネント一覧を取得できる

- [ ] **T-5**: プロンプトビルダーの作成
  - `src/lib/playground/prompt-builder.ts` を作成
  - コンポーネントレジストリからシステムプロンプトを動的生成
  - 生成ルール（export default、import 文なし、Tailwind 使用等）をシステムプロンプトに含める
  - **完了条件**: システムプロンプトが正しく構築される

- [ ] **T-6**: コードパーサーの作成
  - `src/lib/playground/code-parser.ts` を作成
  - LLM レスポンスからコードブロック（```tsx ... ```）を抽出
  - コードブロックが見つからない場合のフォールバック処理
  - **完了条件**: 各種レスポンスパターンからコードを正しく抽出できる

- [ ] **T-7**: 会話コンテキスト管理の作成
  - `src/lib/playground/conversation.ts` を作成
  - `keep-recent` 戦略によるトークン制限内でのメッセージトリミング
  - 直近の assistant メッセージ（生成コード）を必ず含める処理
  - **完了条件**: 長い会話履歴が適切にトリミングされる

- [ ] **T-8**: Server Actions の実装
  - `src/app/playground/actions.ts` を作成
  - `generateDemo`: Claude API 呼び出し + コード生成（ストリーミング）
  - `saveDemo`: デモの保存（タイトル、コード、会話履歴）
  - `loadDemos`: 保存済みデモ一覧の取得
  - `loadDemo`: 特定デモの読み込み（会話履歴含む）
  - `deleteDemo`: デモの削除
  - **完了条件**: 各アクションが正しく動作する

- [ ] **T-9**: ストリーミング API Route の実装
  - `src/app/api/playground/stream/route.ts` を作成
  - Claude API のストリーミングレスポンスを `ReadableStream` として返す
  - エラーハンドリング（API キー未設定、レートリミット等）
  - **完了条件**: ストリーミングレスポンスがクライアントで受信できる

### フェーズ 3: クライアントサイド実装

- [ ] **T-10**: 型定義の作成
  - `src/app/playground/_components/types.ts` を作成
  - ChatMessage, Demo, GenerateRequest, GenerateResponse 等の型定義
  - **完了条件**: プレイグラウンド固有の型が定義されている

- [ ] **T-11**: ChatPanel コンポーネントの実装
  - `src/app/playground/_components/ChatPanel.tsx` を作成
  - 会話履歴の表示（user / assistant メッセージの区別）
  - プロンプト入力テキストエリア + 送信ボタン
  - ストリーミング中の表示（生成中インジケーター）
  - リセットボタン、保存ボタン
  - **完了条件**: 会話の送受信 UI が動作する

- [ ] **T-12**: PreviewPanel コンポーネントの実装
  - `src/app/playground/_components/PreviewPanel.tsx` を作成
  - Sandpack プレビュー + コードエディタ（読み取り専用、折りたたみ可能）
  - 生成コードの Sandpack への注入
  - ライブラリコンポーネントの仮想ファイル提供
  - Tailwind CDN の設定
  - **完了条件**: 生成コードが Sandpack 内でレンダリングされ、インタラクションが動作する

- [ ] **T-13**: ViewportSwitcher コンポーネントの実装
  - `src/app/playground/_components/ViewportSwitcher.tsx` を作成
  - Desktop / Tablet のビューポートサイズ切り替え
  - **完了条件**: プレビューのサイズが切り替わる

- [ ] **T-14**: DemoListDialog コンポーネントの実装
  - `src/app/playground/_components/DemoListDialog.tsx` を作成
  - 保存済みデモの一覧表示（タイトル、作成日時、最終更新日時）
  - デモの読み込み（会話履歴ごと復元）
  - デモの削除（確認ダイアログ付き）
  - **完了条件**: デモの一覧表示・読み込み・削除が動作する

- [ ] **T-15**: ComponentBrowser コンポーネントの実装
  - `src/app/playground/_components/ComponentBrowser.tsx` を作成
  - コンポーネントレジストリからの一覧表示
  - 各コンポーネントの props 情報と使用例表示
  - 折りたたみ可能なパネル
  - **完了条件**: コンポーネント参照パネルが動作する

- [ ] **T-16**: プレイグラウンドページの組み立て
  - `src/app/playground/page.tsx` を作成
  - 全コンポーネントの統合（ChatPanel, PreviewPanel, ViewportSwitcher, DemoListDialog, ComponentBrowser）
  - レイアウト構成（左カラム 35% + 右カラム 65% + 下部パネル）
  - ヘッダー（タイトル、新規ボタン、保存一覧ボタン）
  - 状態管理（会話履歴、現在のコード、現在のデモ ID）
  - **完了条件**: `/playground` にアクセスしてプレイグラウンドが表示される

### フェーズ 4: 統合・接続

- [ ] **T-17**: エンドツーエンドのデモ生成フロー
  - プロンプト入力 → Claude API 呼び出し → コード抽出 → Sandpack プレビュー表示
  - ストリーミング中の UI フィードバック
  - 追加プロンプトによる修正フロー
  - 会話リセット
  - **完了条件**: 自然言語入力からデモ生成・修正までの一連のフローが動作する

- [ ] **T-18**: デモ保存・読み込みフロー
  - 保存ダイアログ（タイトル入力）
  - 保存済みデモの読み込みと会話履歴の復元
  - 読み込んだデモからの会話続行
  - デモの削除
  - **完了条件**: デモの保存・読み込み・削除・続行が動作する

### フェーズ 5: 品質確認・ドキュメント更新

- [ ] **T-19**: ビルド・Lint 確認
  - `pnpm build` がエラーなく通ること
  - `pnpm lint` がエラーなく通ること
  - TypeScript エラーが 0 件であること
  - **完了条件**: AC-P4 の品質基準を満たす

- [ ] **T-20**: 永続的ドキュメントの更新
  - `docs/product-requirements.md` に FR-P1〜P5、US-P1〜P4、AC-P1〜P4 を追加
  - CLAUDE.md の技術スタックに SQLite + Prisma、Claude API、Sandpack を追加
  - CLAUDE.md のリポジトリ全体構造に playground 関連ディレクトリを追加
  - `.cursor/rules/project-memory.mdc` を CLAUDE.md と同期
  - **完了条件**: 永続的ドキュメントがプレイグラウンド機能を反映している
