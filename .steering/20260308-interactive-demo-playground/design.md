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

### Next.js プロジェクト初期化オプション

```
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

| 項目 | 値 | 備考 |
|---|---|---|
| TypeScript | Yes（strict） | CLAUDE.md 指定 |
| Tailwind CSS | Yes（v4） | CLAUDE.md 指定 |
| ESLint | Yes | CLAUDE.md 指定 |
| App Router | Yes | CLAUDE.md 指定 |
| `src/` ディレクトリ | Yes | CLAUDE.md 指定 |
| import alias | `@/*` | CLAUDE.md 指定 |
| Turbopack | Yes | dev server の高速化のため採用 |

### shadcn/ui 初期化オプション

```
npx shadcn@latest init --defaults
```

`--defaults` フラグによりデフォルトのシンプルな設定が適用される：
- Style: Default（New York ではない）
- Base color: Slate
- CSS variables: Yes

### ページ構成: `/` と `/playground` の関係

`src/app/page.tsx`（`/`）は `/playground` にリダイレクトする。現段階ではプレイグラウンドがアプリケーションの主要な機能であり、別途ランディングページを設ける必要がないため。

```tsx
// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/playground");
}
```

将来的にランディングページが必要になった場合は、`page.tsx` を差し替える。

## ディレクトリ設計

### 2層構造: コンポーネントショーケース + 組み合わせデモ

プレイグラウンドは以下の2層で構成する：

1. **コンポーネントショーケース（`/playground/components/`）**: ライブラリのベースコンポーネント（Button, Card, Input 等）を個別にプレビュー・操作できるページ。各コンポーネントのバリエーション（variant, size 等）をサンプルデータ付きで表示する。
2. **組み合わせデモ（`/playground/demos/`）**: ユーザーが Claude Code / Cursor でリクエストした、複数コンポーネントを組み合わせた実践的なデモ。

```
src/app/playground/
├── page.tsx                          # プレイグラウンドトップ（ショーケース + デモ一覧）
├── layout.tsx                        # プレイグラウンド用レイアウト
├── _components/
│   ├── DemoCard.tsx                  # 一覧のカードコンポーネント
│   ├── ComponentBrowser.tsx          # コンポーネント参照パネル
│   └── types.ts                      # プレイグラウンド固有の型定義
├── components/                       # ★ ベースコンポーネントのショーケース
│   ├── layout.tsx                    # ショーケース共通レイアウト
│   ├── button/
│   │   └── page.tsx                  # Button のバリエーション一覧
│   ├── card/
│   │   └── page.tsx                  # Card のバリエーション一覧
│   ├── input/
│   │   └── page.tsx                  # Input のバリエーション一覧
│   └── ...                           # shadcn/ui コンポーネントごとに作成
└── demos/                            # ★ ユーザーリクエストの組み合わせデモ
    ├── layout.tsx                    # デモ共通レイアウト（ヘッダー、戻るリンク等）
    ├── stat-cards/
    │   └── page.tsx                  # デモ: 統計カードダッシュボード
    ├── login-form/
    │   └── page.tsx                  # デモ: ログインフォーム
    ├── sortable-list/
    │   └── page.tsx                  # デモ: ドラッグ&ドロップリスト
    └── ...                           # Claude Code / Cursor が自動生成
```

### 命名規則

```
src/app/playground/components/[name]/page.tsx   # ベースコンポーネント
src/app/playground/demos/[slug]/page.tsx        # 組み合わせデモ
```

- `[name]` / `[slug]` は kebab-case（例: `button`, `stat-cards`, `login-form`）
- Next.js App Router のファイルベースルーティングにより、自動的にルートが生成される
  - `/playground/components/button` → Button ショーケース
  - `/playground/demos/stat-cards` → 統計カードデモ

### コンポーネントショーケースのテンプレート

ベースコンポーネントのショーケースページの基本構造：

```tsx
// src/app/playground/components/button/page.tsx
"use client";

import { Button } from "@/components/ui/button";

/**
 * ショーケース: Button
 *
 * shadcn/ui Button コンポーネントの全バリエーションを表示。
 * variant, size, disabled, asChild 等の props を確認できる。
 */
export default function ButtonShowcasePage() {
  return (
    <div className="space-y-8 p-6">
      {/* Variants */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg">Large</Button>
          <Button size="default">Default</Button>
          <Button size="sm">Small</Button>
          <Button size="icon">🔔</Button>
        </div>
      </section>

      {/* States */}
      <section>
        <h2 className="text-lg font-semibold mb-4">States</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Enabled</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
    </div>
  );
}
```

**ショーケースのルール**:
- 1ページ = 1コンポーネントの全バリエーション
- セクションごとに props のカテゴリで分類（Variants, Sizes, States 等）
- 実際にクリック・ホバー等のインタラクションを試せる状態にする
- `shadcn add` でコンポーネントを追加した際に、対応するショーケースページも作成する

### 組み合わせデモのテンプレート

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
  // サンプルデータはファイル内にハードコード（DB 不要）
  const items = [
    { id: "1", title: "売上", value: 12450, change: "+12.5%", icon: "💰" },
    { id: "2", title: "ユーザー", value: 3240, change: "+8.1%", icon: "👤" },
    { id: "3", title: "注文", value: 856, change: "-2.3%", icon: "📦" },
    { id: "4", title: "レビュー", value: 4.8, change: "+0.3", icon: "⭐" },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* デモの実装 */}
    </div>
  );
}
```

**デモのルール**:
- `"use client"` ディレクティブを含める（状態管理・イベントハンドラが必要なため）
- ライブラリコンポーネントは `@/components/ui/` や `@/components/[category]/` から import
- `export default` で単一のページコンポーネントを返す
- JSDoc でデモの説明、使用コンポーネント、作成日を記載

### サンプルデータ（シードデータ）の方針

- **ファイル内にハードコード**: すべてのサンプルデータはデモページの `page.tsx` ファイル内に直接定義する
- **DB 不要**: 外部データソースやシードファイルは使用しない
- **リアリティのあるデータ**: サンプルデータは実際の使用場面を想像しやすい値にする（「テスト1」「テスト2」ではなく、具体的な名称・数値を使用）
- **型安全**: サンプルデータにも TypeScript の型を定義する
- **自己完結**: 各デモページが単体で動作するよう、必要なデータをすべて内包する

## 画面設計

### プレイグラウンドトップページ（`/playground`）

```
┌─────────────────────────────────────────────────────────────┐
│  UI Library Playground                                      │
│  コンポーネントの動作確認とデモを確認できます                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ── コンポーネントショーケース ──                               │
│  ライブラリのベースコンポーネントを個別に確認できます              │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Button       │  │ Card         │  │ Input        │      │
│  │              │  │              │  │              │      │
│  │ 6 variants   │  │ Header,      │  │ text, email  │      │
│  │ 4 sizes      │  │ Content,     │  │ password,    │      │
│  │              │  │ Footer       │  │ disabled     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Table        │  │ Accordion    │  │ Badge        │      │
│  │              │  │              │  │              │      │
│  │ ソート、      │  │ 単一/複数     │  │ 5 variants   │      │
│  │ ページネーション│  │ 開閉         │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ── 組み合わせデモ ──                                        │
│  複数コンポーネントを組み合わせた実践的なデモ                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 📊 Stat      │  │ 🔐 Login     │  │ + 新しいデモ  │      │
│  │ Cards        │  │ Form         │  │              │      │
│  │              │  │              │  │ Claude Code  │      │
│  │ 統計カード    │  │ ログイン      │  │ で生成       │      │
│  │ ダッシュボード │  │ フォーム      │  │              │      │
│  │ 2026-03-08   │  │ 2026-03-08   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  コンポーネント参照（折りたたみ可能）                           │
│  [Button] [Card] [Table] [Accordion] [Input] ...            │
└─────────────────────────────────────────────────────────────┘
```

**トップページの機能**:
- **コンポーネントショーケース**: `src/app/playground/components/` 配下を走査してベースコンポーネント一覧を表示
- **組み合わせデモ**: `src/app/playground/demos/` 配下を走査してデモ一覧を表示
- カードクリックで各ページに遷移
- 「新しいデモ」カードには Claude Code / Cursor での生成手順を案内

### コンポーネントショーケースページ（`/playground/components/[name]`）

```
┌─────────────────────────────────────────────────────────────┐
│  ← 一覧に戻る    Button                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ── Variants ──                                             │
│  [Default] [Destructive] [Outline] [Secondary] [Ghost] [Link]│
│                                                             │
│  ── Sizes ──                                                │
│  [Large]  [Default]  [Small]  [🔔]                          │
│                                                             │
│  ── States ──                                               │
│  [Enabled]  [Disabled]                                      │
│                                                             │
│  ── With Icons ──                                           │
│  [📧 Login with Email]  [← Back]  [Next →]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- 1ページ = 1コンポーネントの全バリエーション
- 実際にクリック・ホバー・フォーカス等の操作を試せる
- ホットリロードにより、`src/components/ui/` 内のコンポーネントを修正すると即座に反映

### 組み合わせデモページ（`/playground/demos/[slug]`）

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
- 「一覧に戻る」リンクでプレイグラウンドトップに遷移

## 一覧の動的生成

### 方法: ファイルシステム走査（Server Component）

コンポーネントショーケースと組み合わせデモの両方を、同じ走査ロジックで一覧化する。

```typescript
// src/app/playground/page.tsx（Server Component）

import fs from "fs";
import path from "path";

interface PlaygroundEntry {
  slug: string;
  title: string;
  type: "component" | "demo";
}

function getEntries(dir: string, type: "component" | "demo"): PlaygroundEntry[] {
  const fullPath = path.join(process.cwd(), dir);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .filter((entry) => {
      const pagePath = path.join(fullPath, entry.name, "page.tsx");
      return fs.existsSync(pagePath);
    })
    .map((entry) => {
      const slug = entry.name;
      const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return { slug, title, type };
    });
}

// トップページで両方を取得
const components = getEntries("src/app/playground/components", "component");
const demos = getEntries("src/app/playground/demos", "demo");
```

**設計判断**: Server Component の利点を活かし、ファイルシステムを直接走査する。DB は不要。

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
├── page.tsx                          # トップページ（ショーケース + デモ一覧）
├── layout.tsx                        # プレイグラウンド用レイアウト
├── _components/
│   ├── DemoCard.tsx                  # 一覧のカードコンポーネント
│   ├── ComponentBrowser.tsx          # コンポーネント参照パネル
│   └── types.ts                      # プレイグラウンド固有の型定義
├── components/                       # ベースコンポーネントショーケース
│   ├── layout.tsx                    # ショーケース共通レイアウト
│   ├── button/page.tsx
│   ├── card/page.tsx
│   ├── input/page.tsx
│   └── ...
└── demos/                            # 組み合わせデモ
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

## shadcn/ui MCP サーバーのセットアップ

CLAUDE.md に記載されている MCP サーバー設定が未作成のため、プレイグラウンド構築の前提としてセットアップする。

### 作成するファイル

**`.mcp.json`（プロジェクトルート、Claude Code 用）**:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/shadcn-mcp-server"]
    }
  }
}
```

**`.cursor/mcp.json`（Cursor 用）**:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/shadcn-mcp-server"]
    }
  }
}
```

### 環境による設定の差異

shadcn/ui MCP サーバーは **Web 上の shadcn/ui レジストリからコンポーネント情報を取得する**サーバーであり、ローカルファイルパスを引数に取らない。そのため、WSL / ローカル / devContainer いずれの環境でも `.mcp.json` の記述内容は同一で問題ない。

CLAUDE.md に記載のある「MCP サーバーはホスト側で動作する場合とコンテナ内で動作する場合がある。`.mcp.json` のパス設定がホスト / コンテナで異なる点に注意」という注意事項は、ローカルファイルパスを引数に取る MCP サーバー（例: ファイル操作系、DB 接続系）に当てはまるものであり、shadcn MCP サーバーには該当しない。

唯一の前提条件は、コンテナ内に Node.js がインストールされていること（`npx` が利用可能であること）と、レジストリへの HTTP アクセスが可能であること。

### MCP サーバーの活用タイミング

- `shadcn add [component]` でベースコンポーネントを追加する前に、MCP で最新仕様を確認
- ショーケースページを作成する際に、MCP でコンポーネントの props・バリエーションを取得
- デモ生成時に、コンポーネントの正確な使い方を参照

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
