# 設計：インタラクティブデモプレイグラウンド

## 実装アプローチ

既存の Next.js (App Router) プロジェクト内に `/playground` ルートを追加し、Claude Code / Cursor によるコード生成 + Next.js dev server (ホットリロード) によるプレビューを組み合わせたプレイグラウンド機能を構築する。

**変更点（旧設計からの差分）**:
- ~~Claude API（`@anthropic-ai/sdk`）~~ → Claude Code / Cursor がコード生成を担当
- ~~Sandpack（iframe サンドボックス）~~ → Next.js dev server のホットリロードで直接プレビュー
- ~~SQLite + Prisma（DB 永続化）~~ → ファイルシステムによる永続化（デモファイルそのものがデータ）
- LLM 呼び出し関連の Server Actions、ストリーミング API Route は不要

## アーキテクチャ概要

```
┌──────────────────────────────────────────────────────────┐
│  Claude Code / Cursor                                    │
│                                                          │
│  ユーザー:「統計カード4枚のダッシュボードを作って」          │
│       ↓                                                  │
│  Claude がコードを生成し、ファイルに書き込む                 │
│  → src/app/playground/demos/stat-cards/page.tsx           │
└──────────────────────┬───────────────────────────────────┘
                       │ ファイル変更
┌──────────────────────▼───────────────────────────────────┐
│  Next.js Dev Server (pnpm dev)                           │
│                                                          │
│  ホットリロードで即座に反映                                 │
│  → localhost:3000/playground/demos/stat-cards で確認       │
└──────────────────────┬───────────────────────────────────┘
                       │ ブラウザ表示
┌──────────────────────▼───────────────────────────────────┐
│  ブラウザ                                                 │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  /playground             デモ一覧ページ               │ │
│  │  /playground/demos/xxx   個別デモページ               │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## 決定事項

### コード生成: Claude Code / Cursor

- ユーザーが Claude Code / Cursor 上で自然言語プロンプトを入力してコードを生成
- Claude.ai Max プランの使用枠内で利用可能
- 追加の API キーや従量課金は不要
- 会話的な修正は Claude Code / Cursor の会話機能で自然に実現

### プレビュー: Next.js Dev Server（ホットリロード）

- `pnpm dev` で起動したローカル開発サーバーで動作確認
- ライブラリコンポーネントを直接 `import` できる（パス解決の問題なし）
- Tailwind CSS v4 がそのまま動作する（CDN 版 v3 の制約なし）
- インタラクション（クリック、D&D、キーボード操作等）がフル機能で動作

### データ永続化: ファイルシステム

- デモファイル自体がデータ（DB 不要）
- Git でバージョン管理可能
- ディレクトリ構造で整理・分類

## ディレクトリ設計

### デモファイルの配置

```
src/app/playground/
├── page.tsx                          # デモ一覧ページ
├── layout.tsx                        # プレイグラウンド用レイアウト
├── _components/
│   ├── DemoCard.tsx                  # デモ一覧のカードコンポーネント
│   ├── ComponentBrowser.tsx          # コンポーネント参照パネル
│   └── types.ts                      # プレイグラウンド固有の型定義
└── demos/
    ├── layout.tsx                    # デモ共通レイアウト（ヘッダー、戻るリンク等）
    ├── stat-cards/
    │   └── page.tsx                  # デモ: 統計カードダッシュボード
    ├── login-form/
    │   └── page.tsx                  # デモ: ログインフォーム
    ├── sortable-list/
    │   └── page.tsx                  # デモ: ドラッグ&ドロップリスト
    └── ...                           # Claude Code / Cursor が自動生成
```

### デモファイルの命名規則

```
src/app/playground/demos/[slug]/page.tsx
```

- `[slug]` は kebab-case（例: `stat-cards`, `login-form`, `sortable-list`）
- Next.js App Router のファイルベースルーティングにより、自動的に `/playground/demos/[slug]` でアクセス可能
- Claude Code / Cursor がデモを生成する際、適切な slug 名でディレクトリを作成する

### デモファイルのテンプレート

Claude Code / Cursor がデモを生成する際の基本構造：

```tsx
// src/app/playground/demos/[slug]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// ...必要なコンポーネントを import

/**
 * デモ: [デモの説明]
 *
 * 使用コンポーネント: Button, Card, ...
 * 作成日: YYYY-MM-DD
 */
export default function DemoPage() {
  // サンプルデータ
  const items = [
    { id: "1", title: "項目1", value: 100 },
    // ...
  ];

  return (
    <div className="p-6 space-y-4">
      {/* デモの実装 */}
    </div>
  );
}
```

**ルール**:
- `"use client"` ディレクティブを含める（状態管理・イベントハンドラが必要なため）
- ライブラリコンポーネントは `@/components/ui/` や `@/components/[category]/` から import
- サンプルデータはコンポーネント内にハードコード
- `export default` で単一のページコンポーネントを返す
- JSDoc でデモの説明、使用コンポーネント、作成日を記載

## 画面設計

### デモ一覧ページ（`/playground`）

```
┌─────────────────────────────────────────────────────────────┐
│  UI Library Playground                                      │
│  コンポーネントの組み合わせデモを確認できます                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 📊 Stat      │  │ 🔐 Login     │  │ ↕️ Sortable   │      │
│  │ Cards        │  │ Form         │  │ List         │      │
│  │              │  │              │  │              │      │
│  │ 統計カード    │  │ ログイン      │  │ 並べ替え      │      │
│  │ ダッシュボード │  │ フォーム      │  │ リスト        │      │
│  │              │  │              │  │              │      │
│  │ 2026-03-08   │  │ 2026-03-08   │  │ 2026-03-08   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ 📋 Data      │  │ + 新しいデモ  │                        │
│  │ Table        │  │              │                        │
│  │              │  │ Claude Code  │                        │
│  │ データ       │  │ で生成       │                        │
│  │ テーブル      │  │              │                        │
│  │              │  │              │                        │
│  │ 2026-03-08   │  │              │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  コンポーネント参照（折りたたみ可能）                           │
│  [Button] [Card] [Table] [Accordion] [Input] ...            │
└─────────────────────────────────────────────────────────────┘
```

**一覧ページの機能**:
- `src/app/playground/demos/` 配下のディレクトリを走査してデモ一覧を動的生成
- 各デモカードにはデモ名（slug から生成 or JSDoc から取得）と作成日を表示
- カードクリックで個別デモページに遷移
- 「新しいデモ」カードには Claude Code / Cursor での生成手順を案内

### 個別デモページ（`/playground/demos/[slug]`）

```
┌─────────────────────────────────────────────────────────────┐
│  ← 一覧に戻る    Stat Cards                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │   デモコンポーネントがフルサイズでレンダリングされる      │    │
│  │                                                     │    │
│  │   クリック、D&D、キーボード操作等の                    │    │
│  │   インタラクションがすべて動作する                      │    │
│  │                                                     │    │
│  │   Tailwind CSS v4 がそのまま適用される                │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- デモコンポーネントがフルサイズで表示される
- Next.js dev server のホットリロードにより、Claude Code / Cursor でファイルを修正するとリアルタイムで反映
- 「一覧に戻る」リンクでデモ一覧ページに遷移

## デモ一覧の動的生成

### 方法: ファイルシステム走査（Server Component）

```typescript
// src/app/playground/page.tsx（Server Component）

import fs from "fs";
import path from "path";

interface DemoInfo {
  slug: string;
  title: string;
  description?: string;
  createdAt?: string;
}

function getDemos(): DemoInfo[] {
  const demosDir = path.join(process.cwd(), "src/app/playground/demos");

  if (!fs.existsSync(demosDir)) {
    return [];
  }

  const entries = fs.readdirSync(demosDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== "_components")
    .filter((entry) => {
      // page.tsx が存在するディレクトリのみ
      const pagePath = path.join(demosDir, entry.name, "page.tsx");
      return fs.existsSync(pagePath);
    })
    .map((entry) => {
      const slug = entry.name;
      // slug から表示名を生成（kebab-case → Title Case）
      const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { slug, title };
    });
}
```

**設計判断**: Server Component の利点を活かし、ビルド時またはリクエスト時にファイルシステムを直接走査する。DB は不要。

## コンポーネント参照パネル

### 設計

デモ一覧ページの下部に、利用可能なコンポーネント一覧を折りたたみ可能なパネルで表示する。これにより、Claude Code / Cursor にプロンプトを書く際に、使えるコンポーネントを確認できる。

```typescript
// src/app/playground/_components/ComponentBrowser.tsx

interface ComponentInfo {
  name: string;
  category: string;
  description: string;
  importPath: string;
}

// 手動管理（初期段階）
const components: ComponentInfo[] = [
  {
    name: "Button",
    category: "ui",
    description: "クリック可能なボタン。variant と size でバリエーション指定",
    importPath: "@/components/ui/button",
  },
  {
    name: "Card",
    category: "ui",
    description: "カードコンテナ。CardHeader, CardTitle, CardContent 等と組み合わせ",
    importPath: "@/components/ui/card",
  },
  // ...
];
```

**将来**: `src/components/` のファイルシステム走査 + JSDoc パースで自動生成。

## Claude Code / Cursor への指示テンプレート

プレイグラウンドのデモを生成する際の推奨プロンプト形式：

```
以下のデモを src/app/playground/demos/[slug]/page.tsx に作成してください。

目的: [デモの説明]
使用コンポーネント: [Button, Card, Table 等]
レイアウト: [レイアウトの説明]
インタラクション: [クリック、D&D 等の動作]
サンプルデータ: [必要なデータの説明]

ルール:
- "use client" を含める
- ライブラリコンポーネントは @/components/ui/ からインポート
- Tailwind CSS でスタイリング
- サンプルデータはコンポーネント内にハードコード
- JSDoc でデモの説明を記載
```

## ディレクトリ構成（追加分）

```
src/app/playground/
├── page.tsx                          # デモ一覧ページ（Server Component）
├── layout.tsx                        # プレイグラウンド用レイアウト
├── _components/
│   ├── DemoCard.tsx                  # デモ一覧のカードコンポーネント
│   ├── ComponentBrowser.tsx          # コンポーネント参照パネル
│   └── types.ts                      # プレイグラウンド固有の型定義
└── demos/
    ├── layout.tsx                    # デモ共通レイアウト
    └── [slug]/
        └── page.tsx                  # 各デモ（Claude Code / Cursor が生成）
```

## 不要になったもの（旧設計との差分）

以下は旧設計で予定していたが、アプローチ変更により不要になった要素：

| 項目 | 理由 |
|---|---|
| `@anthropic-ai/sdk` | Claude Code / Cursor がコード生成を担当 |
| `@codesandbox/sandpack-react` | Next.js dev server で直接プレビュー |
| `prisma` / `@prisma/client` | ファイルシステムで永続化 |
| SQLite (`prisma/dev.db`) | DB 不要 |
| `src/app/playground/actions.ts` | Server Actions 不要 |
| `src/app/api/playground/stream/` | ストリーミング API 不要 |
| `src/lib/playground/prompt-builder.ts` | LLM 呼び出し不要 |
| `src/lib/playground/code-parser.ts` | LLM レスポンスパース不要 |
| `src/lib/playground/conversation.ts` | 会話管理不要 |
| `src/lib/db.ts` | Prisma クライアント不要 |
| `ChatPanel.tsx` | チャット UI は Claude Code / Cursor が担当 |
| `PreviewPanel.tsx` | Next.js ページとして直接表示 |
| `ViewportSwitcher.tsx` | ブラウザのリサイズで確認 |
| `DemoListDialog.tsx` | デモ一覧ページで代替 |
| `.env.local` の `ANTHROPIC_API_KEY` | API 直接呼び出し不要 |
| `.env.local` の `DATABASE_URL` | DB 不要 |

## 追加パッケージ

なし（既存のパッケージで実現可能）

## 影響範囲

### 既存コードへの影響

- **影響なし**: 既存の `src/components/`, `src/app/page.tsx` には変更を加えない
- ルーティングの追加のみ（`/playground` 配下）

### CLAUDE.md への反映事項

- リポジトリ全体構造に `src/app/playground/` を追加
- プレイグラウンドのデモ生成ワークフローを追記

## メリット

- **追加パッケージなし**: 既存の Next.js プロジェクトの機能だけで実現
- **Tailwind CSS v4 完全対応**: CDN 版 v3 の制約なし
- **ライブラリコンポーネントの直接利用**: import パス解決の問題なし
- **Claude.ai Max プラン枠内**: 追加の API コストなし
- **ホットリロード**: ファイル変更が即座にブラウザに反映
- **Git 管理**: デモファイルの変更履歴を追跡可能
- **シンプルな設計**: DB、API Route、ストリーミング等の複雑性を排除

## リスク・注意点

- **Claude Code / Cursor 依存**: デモ生成には Claude Code または Cursor が必要（Web UI 単体では生成不可）
- **dev server 前提**: デモのプレビューには `pnpm dev` が動作している必要がある
- **デモファイルの増加**: デモが増えるとディレクトリ内のファイル数が増える（必要に応じて整理）
