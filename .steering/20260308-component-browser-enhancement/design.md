# 設計：ComponentBrowser の拡充

## 実装アプローチ

既存の `ComponentBrowser.tsx` を全面リニューアルし、shadcn/ui の全コンポーネント一覧・カテゴリフィルタ・検索・プロンプトテンプレートを統合した参照パネルに拡張する。データは静的ファイル（`shadcn-registry.ts`）で管理し、アプリケーション実行時に MCP サーバーへの通信は行わない。

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────────┐
│  データの流れ                                                     │
│                                                                 │
│  ① 初回 / 更新時（開発時のみ）                                     │
│                                                                 │
│     Claude Code / Cursor                                        │
│         │  MCP: list_components                                 │
│         ▼                                                       │
│     shadcn MCP サーバー → shadcn/ui レジストリ（Web）              │
│         │                                                       │
│         ▼                                                       │
│     shadcn-registry.ts（静的データファイルとして書き出し）            │
│                                                                 │
│  ② アプリケーション実行時                                          │
│                                                                 │
│     shadcn-registry.ts ──→ ComponentBrowser.tsx ──→ ブラウザ表示   │
│     （import するだけ）     （フィルタ・検索・表示）                  │
│                                                                 │
│     ※ MCP サーバーは関与しない                                     │
└─────────────────────────────────────────────────────────────────┘
```

## ファイル構成

### 変更・追加するファイル

```
src/app/playground/_components/
├── types.ts                    # 既存: ComponentInfo 型の拡張
├── shadcn-registry.ts          # 新規: shadcn/ui 全コンポーネントの静的データ
├── ComponentBrowser.tsx         # 既存: 全面リニューアル
└── PromptTemplate.tsx           # 新規: プロンプトテンプレート表示
```

### 変更しないファイル

- `src/app/playground/page.tsx` — `<ComponentBrowser />` の呼び出し方は変更なし
- `src/components/ui/` — shadcn/ui ベースコンポーネントは変更しない
- `DemoCard.tsx` — 既存のまま

## データ設計

### `types.ts` の拡張

既存の `ComponentInfo` を拡張し、shadcn/ui 全コンポーネントを表現できるようにする。

```typescript
// 既存（変更なし）
export interface PlaygroundEntry {
  slug: string;
  title: string;
  type: "component" | "demo";
}

// 拡張
export type ShadcnCategory =
  | "Form"
  | "Data Display"
  | "Layout"
  | "Navigation"
  | "Feedback"
  | "Overlay"
  | "Other";

export interface ShadcnComponentEntry {
  /** コンポーネント名（PascalCase）。例: "Button", "Card" */
  name: string;
  /** kebab-case のスラッグ。公式 URL やファイル名に使用。例: "button", "card" */
  slug: string;
  /** コンポーネントの説明（1文） */
  description: string;
  /** カテゴリ */
  category: ShadcnCategory;
  /** shadcn/ui 公式ドキュメントへのURL */
  docsUrl: string;
  /** このプロジェクトにインストール済みかどうか */
  installed: boolean;
}
```

**設計判断:**

- 既存の `ComponentInfo` は削除せず残す（既存コードへの影響を避ける）。ただし `ComponentBrowser.tsx` 内では新しい `ShadcnComponentEntry` を使用する
- `installed` フラグはデータファイル内で静的に管理する。`src/components/ui/` の実ファイル存在をランタイムで確認する方式も検討したが、Client Component では `fs` が使えないため、静的フラグ方式を採用する
- `installed` フラグの更新は、レジストリ更新時に Claude Code / Cursor が `src/components/ui/` の内容と照合して行う

### `shadcn-registry.ts` のデータ構造

```typescript
import type { ShadcnComponentEntry } from "./types";

export const shadcnComponents: ShadcnComponentEntry[] = [
  // --- Form ---
  {
    name: "Button",
    slug: "button",
    description: "クリック可能なボタン。variant と size でバリエーション指定",
    category: "Form",
    docsUrl: "https://ui.shadcn.com/docs/components/button",
    installed: true,
  },
  {
    name: "Input",
    slug: "input",
    description: "テキスト入力フィールド",
    category: "Form",
    docsUrl: "https://ui.shadcn.com/docs/components/input",
    installed: true,
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    description: "チェックボックス。オン/オフの切り替えに使用",
    category: "Form",
    docsUrl: "https://ui.shadcn.com/docs/components/checkbox",
    installed: false,
  },
  // ... shadcn/ui の全コンポーネント（50件以上）
];
```

**初回データ構築の手順:**

1. Claude Code / Cursor が MCP の `list_components` を実行
2. 取得結果の各コンポーネントに対して、カテゴリを分類し `ShadcnComponentEntry` 形式に変換
3. `src/components/ui/` 配下のファイル名と照合して `installed` フラグを設定
4. `shadcn-registry.ts` として書き出し

### カテゴリ分類

shadcn/ui のコンポーネントを以下のカテゴリに分類する。MCP から取得する情報にはカテゴリが含まれない場合があるため、初回構築時に Claude Code / Cursor がコンポーネントの用途に基づいて分類する。

| カテゴリ | 説明 | 代表的なコンポーネント |
|---|---|---|
| Form | フォーム入力・操作 | Button, Input, Label, Checkbox, Radio Group, Select, Switch, Textarea, Slider, Form |
| Data Display | データの表示 | Card, Table, Badge, Avatar, Calendar, Chart |
| Layout | レイアウト・構造 | Accordion, Collapsible, Tabs, Separator, Scroll Area, Resizable, Aspect Ratio |
| Navigation | ナビゲーション | Breadcrumb, Menubar, Navigation Menu, Pagination, Sidebar, Command |
| Feedback | フィードバック・通知 | Alert, Alert Dialog, Progress, Skeleton, Sonner (Toast) |
| Overlay | オーバーレイ・ポップアップ | Dialog, Dropdown Menu, Context Menu, Popover, Tooltip, Sheet, Hover Card, Drawer |
| Other | 上記に該当しない | Carousel, Toggle, Toggle Group |

## コンポーネント設計

### `ComponentBrowser.tsx` — 全面リニューアル

#### 状態管理

```typescript
// Client Component（検索・フィルタのインタラクションが必要）
"use client";

const [isOpen, setIsOpen] = useState(false);           // パネル開閉
const [searchQuery, setSearchQuery] = useState("");     // 検索文字列
const [activeCategory, setActiveCategory] = useState<ShadcnCategory | "All">("All"); // カテゴリフィルタ
const [showInstalledOnly, setShowInstalledOnly] = useState(false); // インストール済みフィルタ
```

#### フィルタロジック

```typescript
const filteredComponents = useMemo(() => {
  return shadcnComponents.filter((comp) => {
    // カテゴリフィルタ
    if (activeCategory !== "All" && comp.category !== activeCategory) return false;
    // インストール済みフィルタ
    if (showInstalledOnly && !comp.installed) return false;
    // 検索フィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        comp.name.toLowerCase().includes(query) ||
        comp.description.toLowerCase().includes(query)
      );
    }
    return true;
  });
}, [activeCategory, showInstalledOnly, searchQuery]);
```

#### 画面構成

```
┌─────────────────────────────────────────────────────────────────┐
│  ▼ shadcn/ui コンポーネント参照（56件）                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 [コンポーネントを検索...              ]                        │
│                                                                 │
│  [All] [Form] [Data Display] [Layout] [Navigation]              │
│  [Feedback] [Overlay] [Other]                                   │
│                                                                 │
│  □ インストール済みのみ表示                                        │
│                                                                 │
│  ── Form (12) ──────────────────────────────────────────────── │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ ✅ Button            │  │ ✅ Input             │              │
│  │ クリック可能なボタン   │  │ テキスト入力フィールド │              │
│  │ 📖 ドキュメント →     │  │ 📖 ドキュメント →     │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ ☐ Checkbox           │  │ ☐ Radio Group        │              │
│  │ チェックボックス      │  │ 複数選択肢から1つ選択  │              │
│  │ 📖 ドキュメント →     │  │ 📖 ドキュメント →     │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
│  ── Data Display (8) ───────────────────────────────────────── │
│  ...                                                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  📋 プロンプトテンプレート                                        │
│                                                                 │
│  [デモ生成用]  [レジストリ更新用]                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 以下のデモページを作成してください。                        │   │
│  │                                                         │   │
│  │ スラッグ: [kebab-case のスラッグ]                         │   │
│  │ タイトル: [デモのタイトル]                                 │   │
│  │ 使用コンポーネント: [Button, Card, Input 等]              │   │
│  │ ...                                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                              [📋 コピー]       │
└─────────────────────────────────────────────────────────────────┘
```

#### インストール状態の視覚的区別

| 状態 | 表示 |
|---|---|
| インストール済み | 緑系のバッジ（`✅ インストール済み`）、カード枠は通常色 |
| 未インストール | グレー系のバッジ（`☐ 未インストール`）、カード背景をやや薄く（`opacity-60`）|

#### 使用する shadcn/ui コンポーネント

| コンポーネント | 用途 |
|---|---|
| `Button` | パネル開閉、カテゴリタブ、コピーボタン |
| `Input` | 検索フィールド |
| `Badge` | インストール状態表示、カテゴリ表示 |
| `Tabs` / `TabsList` / `TabsTrigger` | カテゴリフィルタ（All / Form / Data Display / ...）|
| `Card` | 各コンポーネントカード（検討。軽量にするため `div` + Tailwind でも可） |
| `Collapsible` | パネル全体の開閉 |
| `ScrollArea` | コンポーネント一覧が長くなった場合のスクロール領域 |

**判断ポイント:** 各コンポーネントカードに `Card` を使うとマークアップが重くなる（50件以上のカード）。`div` + Tailwind のボーダー・パディングで軽量に実装し、必要に応じて `Card` に切り替える。

### `PromptTemplate.tsx` — プロンプトテンプレート表示

#### 機能

- タブ切り替えで「デモ生成用」と「レジストリ更新用」を表示
- テンプレート本文をプレーンテキストとして表示
- 「コピー」ボタンでクリップボードにコピー
- コピー成功時に一時的にフィードバック表示（「コピーしました」）

#### 実装方針

```typescript
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const DEMO_TEMPLATE = `以下のデモページを作成してください。

スラッグ: [kebab-case のスラッグ]
タイトル: [デモのタイトル]
使用コンポーネント: [Button, Card, Input 等]
説明: [1-2文でデモの内容を説明]

レイアウト:
- [UIのレイアウトを箇条書きで]

インタラクション:
- [ユーザー操作とその結果（あれば）]`;

const REGISTRY_UPDATE_TEMPLATE = `shadcn-registry.ts を最新化してください。
MCP の list_components で最新のコンポーネント一覧を取得し、
shadcn-registry.ts を更新してください。`;

export function PromptTemplate() {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const handleCopy = async (text: string, tab: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <Tabs defaultValue="demo">
      <TabsList>
        <TabsTrigger value="demo">デモ生成用</TabsTrigger>
        <TabsTrigger value="registry">レジストリ更新用</TabsTrigger>
      </TabsList>
      <TabsContent value="demo">
        <pre>...</pre>
        <Button onClick={() => handleCopy(DEMO_TEMPLATE, "demo")}>
          {copiedTab === "demo" ? "コピーしました" : "コピー"}
        </Button>
      </TabsContent>
      <TabsContent value="registry">
        <pre>...</pre>
        <Button onClick={() => handleCopy(REGISTRY_UPDATE_TEMPLATE, "registry")}>
          {copiedTab === "registry" ? "コピーしました" : "コピー"}
        </Button>
      </TabsContent>
    </Tabs>
  );
}
```

## `ComponentBrowser` と `PromptTemplate` の統合

`PromptTemplate` は `ComponentBrowser` パネル内の下部に配置する。

```typescript
// ComponentBrowser.tsx 内
export function ComponentBrowser() {
  return (
    <div className="border-t">
      {/* パネルヘッダー（開閉トグル） */}
      <Button variant="ghost" onClick={toggle}>
        shadcn/ui コンポーネント参照（{total}件）
      </Button>

      {isOpen && (
        <>
          {/* 検索・フィルタ・一覧 */}
          <SearchAndFilter />
          <ComponentGrid />

          {/* プロンプトテンプレート */}
          <div className="mt-6 border-t pt-4">
            <PromptTemplate />
          </div>
        </>
      )}
    </div>
  );
}
```

## ページレイアウトへの影響

### `page.tsx` の変更

変更なし。既存の `<ComponentBrowser />` 呼び出しがそのまま機能する。ComponentBrowser 内部で shadcn-registry.ts を import し、新しいUI を表示する。

```tsx
// 既存のまま
<ComponentBrowser />
```

### パネルの配置位置

現在と同じく、プレイグラウンドトップページの最下部に配置。将来的にサイドバー化やモーダル化する場合も、`ComponentBrowser` コンポーネントの呼び出し位置を変えるだけで対応可能。

## パフォーマンス考慮

### コンポーネント数（50件以上）のレンダリング

- 初期状態でパネルは閉じている（`isOpen: false`）。展開時のみリストをレンダリングする
- 各カードは `div` + Tailwind で軽量に実装（`Card` コンポーネントは不使用）
- カテゴリフィルタにより表示件数が絞り込まれるため、全件が同時に表示されることは少ない
- 50件程度であれば仮想スクロール（virtualization）は不要

### 検索のデバウンス

- 検索入力は即時フィルタ（50件程度のインメモリフィルタなのでデバウンス不要）

## 不要な変更（スコープ外）

| 項目 | 理由 |
|---|---|
| 独自 MCP サーバーの構築 | 既存の `@anthropic-ai/shadcn-mcp-server` で十分 |
| コンポーネントの自動インストール機能（UI上のボタン） | Claude Code / Cursor に指示するフローで十分 |
| ランタイムでの MCP 呼び出し | 静的データで管理し、更新は Claude Code / Cursor 経由で行う |
| `DemoCard.tsx` の変更 | 既存のまま |
| プレイグラウンドのレイアウト変更 | 既存のまま |

## 追加パッケージ

なし。使用する shadcn/ui コンポーネント（`Tabs`, `ScrollArea` 等）は既にインストール済み。
