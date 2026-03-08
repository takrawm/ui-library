# 設計：インタラクティブデモプレイグラウンド

## 実装アプローチ

既存の Next.js (App Router) プロジェクト内に `/playground` ルートを追加し、Claude API によるコード生成 + Sandpack によるプレビュー + SQLite (Prisma) によるデータ永続化を組み合わせたプレイグラウンド機能を構築する。

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────┐
│  ブラウザ（クライアント）                                    │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ プロンプト    │  │ 会話履歴      │  │ 保存デモ一覧   │  │
│  │ 入力エリア    │  │ エリア        │  │ サイドバー     │  │
│  └──────┬───────┘  └──────────────┘  └───────────────┘  │
│         │                                               │
│  ┌──────▼──────────────────────────────────────────────┐ │
│  │              Sandpack プレビューエリア                 │ │
│  │  (iframe サンドボックス内で生成コードを実行)            │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │ Server Actions / API Routes
┌─────────────────────▼───────────────────────────────────┐
│  Next.js サーバーサイド                                    │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Claude API   │  │ Prisma ORM   │  │ コンポーネント  │  │
│  │ 連携         │  │ (SQLite)     │  │ レジストリ     │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 決定事項

### ORM: Prisma

- **理由**: エコシステムの成熟度、型安全なクエリ、マイグレーション管理の強力さ
- SQLite との組み合わせで `prisma/dev.db` にファイルベース DB を配置
- `prisma/schema.prisma` でスキーマ定義、`npx prisma migrate dev` でマイグレーション

### コード実行: Sandpack

- `@codesandbox/sandpack-react` を使用
- iframe 内で生成コードを実行し、メインアプリとは分離
- カスタム依存関係としてプロジェクト内のコンポーネントを提供

### LLM 呼び出し: Anthropic SDK + Server Actions

- `@anthropic-ai/sdk` を使用してサーバーサイドから Claude API を呼び出す
- Server Actions でストリーミングレスポンスを実現
- API キーは `.env.local` の `ANTHROPIC_API_KEY` で管理

## データモデル設計

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL") // "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Demo {
  id        String   @id @default(cuid())
  title     String
  code      String   // 最終生成コード（TSX）
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  messages  Message[]
}

model Message {
  id        String   @id @default(cuid())
  demoId    String
  demo      Demo     @relation(fields: [demoId], references: [id], onDelete: Cascade)
  role      String   // "user" | "assistant"
  content   String   // プロンプト or 生成コード
  createdAt DateTime @default(now())
  order     Int      // 会話内の順序
}
```

**設計判断**:
- `Demo` と `Message` を分離し、会話履歴を完全に保持
- `Demo.code` に最終生成コードを冗長に持たせることで、一覧からの即座プレビューを可能にする
- `Message.order` で会話順序を明示（`createdAt` だけでは同一秒の並びが不定）
- `onDelete: Cascade` でデモ削除時にメッセージも自動削除

## 画面設計

### プレイグラウンドページ（`/playground`）

```
┌─────────────────────────────────────────────────────────────┐
│  ヘッダー: UI Library Playground          [新規] [保存一覧]  │
├────────────────────┬────────────────────────────────────────┤
│                    │                                        │
│  会話履歴エリア      │       Sandpack プレビューエリア          │
│                    │                                        │
│  ┌──────────────┐  │  ┌────────────────────────────────┐    │
│  │ User:        │  │  │                                │    │
│  │ 統計カードを   │  │  │   生成されたコンポーネントが     │    │
│  │ 4枚並べて     │  │  │   ここにレンダリングされる       │    │
│  ├──────────────┤  │  │                                │    │
│  │ Assistant:   │  │  │   クリック、D&D等の             │    │
│  │ [コード]      │  │  │   インタラクションが動作する     │    │
│  ├──────────────┤  │  │                                │    │
│  │ User:        │  │  └────────────────────────────────┘    │
│  │ 色を青系に    │  │                                        │
│  ├──────────────┤  │  ┌────────────────────────────────┐    │
│  │ Assistant:   │  │  │ コード表示（折りたたみ可能）      │    │
│  │ [コード]      │  │  └────────────────────────────────┘    │
│  └──────────────┘  │                                        │
│                    │  ビューポート: [Desktop] [Tablet]        │
│  ┌──────────────┐  │                                        │
│  │ プロンプト    │  │                                        │
│  │ 入力エリア    │  │                                        │
│  │         [送信]│  │                                        │
│  └──────────────┘  │                                        │
│  [リセット] [保存]  │                                        │
├────────────────────┴────────────────────────────────────────┤
│  コンポーネント参照パネル（折りたたみ可能）                      │
│  [Button] [Card] [Table] [Accordion] ...                    │
└─────────────────────────────────────────────────────────────┘
```

**レイアウト構成**:
- **左カラム（約 35%）**: 会話履歴 + プロンプト入力 + 操作ボタン
- **右カラム（約 65%）**: Sandpack プレビュー + コード表示
- **下部パネル**: コンポーネント参照（折りたたみ可能）

### 保存デモ一覧（モーダルまたはサイドパネル）

- タイトル、作成日時、最終更新日時を表示
- クリックで読み込み（会話履歴ごと復元）
- 削除ボタン

## コンポーネント構成

```
src/app/playground/
├── page.tsx                    # プレイグラウンドページ（メインレイアウト）
├── layout.tsx                  # プレイグラウンド用レイアウト（オプション）
├── actions.ts                  # Server Actions（LLM 呼び出し、DB 操作）
└── _components/
    ├── ChatPanel.tsx           # 会話履歴 + プロンプト入力
    ├── PreviewPanel.tsx        # Sandpack プレビュー + コード表示
    ├── ComponentBrowser.tsx    # コンポーネント参照パネル
    ├── DemoListDialog.tsx      # 保存デモ一覧ダイアログ
    ├── ViewportSwitcher.tsx    # ビューポートサイズ切り替え
    └── types.ts                # プレイグラウンド固有の型定義
```

**設計判断**: プレイグラウンドのコンポーネントは `src/app/playground/_components/` に配置する。これはライブラリの再利用コンポーネント（`src/components/`）ではなく、プレイグラウンド機能に特化したアプリケーションコンポーネントであるため。Next.js の `_` プレフィックスによりルーティング対象外となる。

## Claude API 連携設計

### システムプロンプト

```
あなたは UI コンポーネントライブラリのデモ生成アシスタントです。
ユーザーの要望に基づいて、以下のコンポーネントを使った React (TSX) コードを生成してください。

【利用可能なコンポーネント】
{コンポーネントレジストリから動的に生成}

【ルール】
- export default で単一のコンポーネントを返すこと
- import 文は含めないこと（Sandpack が自動解決する）
- Tailwind CSS のユーティリティクラスでスタイリングすること
- サンプルデータはコンポーネント内にハードコードすること
- TypeScript の型エラーが出ないコードを生成すること
- コードのみを返すこと（説明文は不要）
```

### コンポーネントレジストリ

ライブラリ内のコンポーネント情報をシステムプロンプトに組み込むため、レジストリを用意する。

```typescript
// src/lib/playground/component-registry.ts

interface ComponentInfo {
  name: string;
  category: string;
  description: string;
  props: string; // 簡易的な props 説明
  example: string; // 使用例コード
}

// 手動管理（初期段階）
// 将来的にはファイルシステムスキャン or JSDoc パースで自動生成
const registry: ComponentInfo[] = [
  {
    name: "Button",
    category: "ui",
    description: "クリック可能なボタン",
    props: "variant?: 'default'|'destructive'|'outline'|'secondary'|'ghost'|'link', size?: 'default'|'sm'|'lg'|'icon'",
    example: '<Button variant="outline">Click me</Button>',
  },
  // ...
];
```

**初期段階**: 手動で主要コンポーネントを登録する。コンポーネント追加時にレジストリも更新する。
**将来**: スクリプトでファイルシステムをスキャンし、JSDoc / 型定義から自動生成する。

### 会話コンテキスト管理

```typescript
// Server Action での会話送信フロー

async function generateDemo(messages: Message[], newPrompt: string) {
  const systemPrompt = buildSystemPrompt(registry);

  // 会話履歴をトークン制限内に収める
  const contextMessages = trimConversation(messages, {
    maxTokens: 150000,  // Claude のコンテキストウィンドウに余裕を持たせる
    strategy: "keep-recent", // 直近のメッセージを優先
  });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: contextMessages.map(m => ({
      role: m.role,
      content: m.content,
    })).concat({ role: "user", content: newPrompt }),
    stream: true,
  });

  return response; // ストリーミングレスポンス
}
```

**トークン管理戦略**:
- `keep-recent`: 直近のメッセージを優先的に保持し、古いメッセージから削除
- システムプロンプト + コンポーネントレジストリで約 2,000〜5,000 トークン使用する想定
- 残りを会話履歴に割り当てる
- 直近の生成コード（assistant メッセージ）は必ず含める（修正指示の文脈として必須）

### ストリーミング実装方針

- Server Actions から `ReadableStream` を返す
- クライアント側で `useChat` 的なカスタムフックでストリームを消費
- コード部分がストリーム完了した時点で Sandpack にコードを渡してプレビュー更新

## Sandpack 設計

### 基本構成

```tsx
<SandpackProvider
  template="react-ts"
  theme="auto"
  files={{
    "/App.tsx": generatedCode,
    "/globals.css": tailwindGlobals,
  }}
  customSetup={{
    dependencies: {
      // shadcn/ui が依存するパッケージ
      "@radix-ui/react-slot": "latest",
      "class-variance-authority": "latest",
      "clsx": "latest",
      "tailwind-merge": "latest",
      // プロジェクト内のライブラリ
      "@dnd-kit/core": "latest",
      "@dnd-kit/sortable": "latest",
      "motion": "latest",
    },
  }}
>
  <SandpackPreview />
  <SandpackCodeEditor readOnly />
</SandpackProvider>
```

### ライブラリコンポーネントの提供方法

Sandpack はファイルベースでコードを提供するため、ライブラリ内のコンポーネントを仮想ファイルとして注入する。

```typescript
// コンポーネントソースを仮想ファイルとして登録
const sandpackFiles = {
  "/App.tsx": generatedCode,
  "/components/ui/button.tsx": buttonSourceCode,
  "/components/ui/card.tsx": cardSourceCode,
  "/lib/utils.ts": utilsSourceCode,
  // ...
};
```

**初期段階**: 主要な shadcn/ui コンポーネント（Button, Card, Input, Table 等）のソースを手動で仮想ファイルに含める。
**将来**: ビルド時にコンポーネントソースを自動収集するスクリプトを用意する。

### Tailwind CSS の Sandpack 内適用

Sandpack 内で Tailwind CSS を動作させるため、CDN 版の Tailwind を使用する。

```html
<!-- Sandpack のカスタム index.html -->
<script src="https://cdn.tailwindcss.com"></script>
```

**注意**: CDN 版は Tailwind v3 ベースのため、v4 固有の機能（`@theme` ディレクティブ等）は Sandpack 内では利用不可。基本的なユーティリティクラス（`flex`, `grid`, `p-4`, `text-lg` 等）は問題なく動作する。将来的に Tailwind v4 の CDN 対応が進めば移行する。

## エラーハンドリング設計

### 生成コードのエラー

| エラー種別 | 対処 |
|---|---|
| 構文エラー（TSX パースエラー） | Sandpack が自動的にエラー表示。ユーザーに「再生成を試してください」とガイド |
| 存在しないコンポーネント参照 | Sandpack のエラーメッセージで表示。システムプロンプトで利用可能コンポーネントを制限することで発生頻度を低減 |
| ランタイムエラー | Sandpack のエラーオーバーレイで表示 |
| LLM がコード以外を返す | レスポンスからコードブロックを抽出するパーサーでフォールバック |

### API エラー

| エラー種別 | 対処 |
|---|---|
| API キー未設定 | プレイグラウンドページにセットアップガイドを表示 |
| レートリミット | リトライ（エクスポネンシャルバックオフ） + ユーザーへの待機メッセージ |
| ネットワークエラー | リトライ + エラートースト |

## ディレクトリ構成（追加分）

```
src/
├── app/
│   ├── playground/
│   │   ├── page.tsx
│   │   ├── actions.ts
│   │   └── _components/
│   │       ├── ChatPanel.tsx
│   │       ├── PreviewPanel.tsx
│   │       ├── ComponentBrowser.tsx
│   │       ├── DemoListDialog.tsx
│   │       ├── ViewportSwitcher.tsx
│   │       └── types.ts
│   └── api/
│       └── playground/
│           └── stream/
│               └── route.ts        # ストリーミング用 API Route（Server Actions で不十分な場合）
├── lib/
│   ├── playground/
│   │   ├── component-registry.ts   # コンポーネント情報レジストリ
│   │   ├── prompt-builder.ts       # システムプロンプト構築
│   │   ├── code-parser.ts          # LLM レスポンスからコード抽出
│   │   └── conversation.ts         # 会話コンテキスト管理
│   ├── db.ts                       # Prisma クライアントのシングルトン
│   └── utils.ts                    # 既存
└── ...

prisma/
├── schema.prisma
├── dev.db                          # SQLite データベースファイル（.gitignore 対象）
└── migrations/                     # マイグレーションファイル
```

## 追加パッケージ

```
pnpm add @anthropic-ai/sdk @codesandbox/sandpack-react @prisma/client
pnpm add -D prisma
```

## 環境変数

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL="file:./prisma/dev.db"
```

## 影響範囲

### 既存コードへの影響

- **影響なし**: 既存の `src/components/`, `src/app/page.tsx` には変更を加えない
- **package.json**: 新規パッケージの追加のみ
- **prisma/**: 新規ディレクトリ追加
- **.gitignore**: `prisma/dev.db` を追加
- **.env.local**: `ANTHROPIC_API_KEY`, `DATABASE_URL` を追加

### CLAUDE.md への反映事項

- 技術スタックに `SQLite + Prisma`, `Claude API (@anthropic-ai/sdk)`, `Sandpack` を追加
- リポジトリ全体構造に `src/app/playground/`, `prisma/`, `src/lib/playground/` を追加

## リスク・注意点

- **Sandpack 内の Tailwind**: CDN 版（v3 ベース）を使用するため、Tailwind v4 固有機能は利用不可。基本的なユーティリティクラスの互換性は問題ないが、カスタムテーマカラー等は個別対応が必要
- **コンポーネントレジストリの手動管理**: 初期段階ではコンポーネント追加時にレジストリの更新漏れが発生しうる。将来的に自動化スクリプトで対応
- **LLM の生成品質**: プロンプトエンジニアリングで改善するが、100% 正しいコードが生成される保証はない。ユーザーが再生成や手動修正で対処する前提
- **Prisma と devcontainer**: `prisma generate` が devcontainer 内で正常に動作することを確認する必要がある（通常は問題なし）
