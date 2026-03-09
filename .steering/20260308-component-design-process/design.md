# 設計: コンポーネント設計プロセスの導入とディレクトリ簡素化

## 1. 実装アプローチ

### 方針

- コンポーネントディレクトリをフラット化し、カテゴリ別分類を廃止
- プレイグラウンドのページパスを `demos/` → `showcase/` にリネーム
- DemoCard を ComponentCard にリネーム
- カードに使用コンポーネント情報を表示（import 文から自動抽出）
- プロンプトテンプレートを「設計 → 実装」の2段階に変更
- ComponentBrowser の見出しフォントサイズを他セクションと統一

## 2. 変更するファイル・ディレクトリ

### 2.1 ディレクトリ移動

| 変更前 | 変更後 |
|---|---|
| `src/components/layouts/ThreeColumnLayout/` | `src/components/ThreeColumnLayout/` |
| `src/app/playground/demos/` | `src/app/playground/showcase/` |

`src/components/layouts/` ディレクトリは空になるため削除。

### 2.2 ファイルリネーム

| 変更前 | 変更後 |
|---|---|
| `_components/DemoCard.tsx` | `_components/ComponentCard.tsx` |

### 2.3 インポートパスの更新

| ファイル | 変更内容 |
|---|---|
| `src/app/playground/showcase/three-column-layout/page.tsx` | `@/components/layouts/ThreeColumnLayout` → `@/components/ThreeColumnLayout` |

他のページ（stat-cards, login-form）は `@/components/ui/` のみを参照しており変更不要。

### 2.4 トップページ (`page.tsx`)

| 変更内容 |
|---|
| 走査パスを `playground/demos` → `playground/showcase` に変更 |
| `DemoCard` → `ComponentCard` にインポート変更 |
| セクション名「組み合わせデモ」→「ショーケース」に変更 |
| import 文を解析して使用コンポーネント情報を `PlaygroundEntry` に追加 |

### 2.5 型定義 (`types.ts`)

`PlaygroundEntry` に `usedComponents` フィールドを追加:

```typescript
export interface PlaygroundEntry {
  slug: string;
  title: string;
  usedComponents: string[];  // 追加: 使用している @/components/ のコンポーネント名
}
```

### 2.6 ComponentCard (`ComponentCard.tsx`) — 旧 DemoCard

- `DemoCard` → `ComponentCard`、`NewDemoCard` → `NewComponentCard` にリネーム
- `usedComponents` をカードに Badge で表示
- `href` を `/playground/showcase/${entry.slug}` に変更
- `CardDescription` を「組み合わせデモ」→「ショーケース」に変更

```
┌───────────────────────┐
│  Login Form           │
│  ショーケース          │
│  [Button] [Card]      │  ← 使用コンポーネントを Badge で表示
│  [Input] [Label]      │
└───────────────────────┘
```

### 2.7 PromptTemplate (`PromptTemplate.tsx`)

タブを3つに変更:

| タブ | 内容 |
|---|---|
| コンポーネント設計 | UIイメージからコンポーネント分割・責務・props を設計させるプロンプト |
| 実装 | 設計結果に基づいてコンポーネントページを生成するプロンプト |
| レジストリ更新 | shadcn-registry.ts の更新（既存のまま） |

### 2.8 ComponentBrowser (`ComponentBrowser.tsx`)

- 折りたたみボタンのフォントサイズを `text-sm` → `text-lg font-semibold` に変更し、他セクション見出し（「プロンプトテンプレート」「ショーケース」）と統一

### 2.9 ドキュメント更新

| ファイル | 変更内容 |
|---|---|
| `docs/functional-design.md` | ディレクトリ構成・画面遷移図・PromptTemplate セクション・DemoCard → ComponentCard を更新 |
| `docs/repository-structure.md` | `src/components/` のカテゴリ別構成をフラット構成に変更、`playground/demos/` → `playground/showcase/`、DemoCard → ComponentCard |
| `CLAUDE.md` | コンポーネント設計原則・ディレクトリ構成・プロンプトテンプレートの記述を更新 |

## 3. import 文からの使用コンポーネント抽出ロジック

トップページ（Server Component）でファイルシステム走査時に実行:

```typescript
function extractUsedComponents(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const componentNames: string[] = [];

  // @/components/ui/ からのインポートを抽出
  // 例: import { Button } from "@/components/ui/button"
  // 例: import { Card, CardHeader } from "@/components/ui/card"
  const uiImportRegex = /from\s+["']@\/components\/ui\/([^"']+)["']/g;
  let match;
  while ((match = uiImportRegex.exec(content)) !== null) {
    // ファイル名を PascalCase に変換（例: "dropdown-menu" → "DropdownMenu"）
    const name = match[1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
    componentNames.push(name);
  }

  // @/components/ 直下のカスタムコンポーネントを抽出
  // 例: import { ThreeColumnLayout } from "@/components/ThreeColumnLayout"
  const customImportRegex = /from\s+["']@\/components\/(?!ui\/)([^"'/]+)["']/g;
  while ((match = customImportRegex.exec(content)) !== null) {
    componentNames.push(match[1]);
  }

  return [...new Set(componentNames)]; // 重複排除
}
```

**抽出例:**

| ページ | 抽出結果 |
|---|---|
| stat-cards | `["Card", "Badge"]` |
| login-form | `["Button", "Card", "Input", "Label"]` |
| three-column-layout | `["ThreeColumnLayout"]` |

## 4. プロンプトテンプレートの内容

### Step 1: コンポーネント設計テンプレート

```
以下のUIを実現するためのコンポーネント設計をしてください。

UIのイメージ:
[画面の説明やスクリーンショット]

以下のフォーマットで回答してください:

---

## ページ概要
- スラッグ: [kebab-case]
- タイトル: [ページのタイトル]
- 説明: [1-2文でページの内容を説明]

## コンポーネント構成

### [ComponentName] (配置先: src/components/[ComponentName]/ または ページ内定義)
- 責務: [何を表示し、どんな操作を受け付けるか]
- shadcn/ui ベース: [使用する shadcn/ui コンポーネント]
- Props:
  - [propName]: [型] - [説明]
- 子コンポーネント: [あれば列挙、なければ「なし」]

（コンポーネントの数だけ繰り返し）

## コンポーネント関係図
[親子関係とデータの流れを箇条書きまたは図で記述]

## ファイル構成
- src/components/ に作成するファイル一覧（再利用コンポーネント）
- playground/showcase/[slug]/page.tsx に作成するファイル（ショーケースページ）

---
```

### Step 2: 実装テンプレート

```
以下の設計に基づいて実装してください。
- src/components/ に配置する再利用コンポーネントを先に作成
- その後 playground/showcase/[slug]/page.tsx を作成
- 各コンポーネントは設計で指定された Props と責務に従うこと

[Step 1 の設計結果をここに貼り付け]
```

## 5. 修正後のディレクトリツリー

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                         # / → /playground リダイレクト
│   └── playground/
│       ├── layout.tsx                   # 共通レイアウト（変更なし）
│       ├── page.tsx                     # トップページ（走査パス・表示更新）
│       ├── _components/
│       │   ├── types.ts                 # PlaygroundEntry に usedComponents 追加
│       │   ├── ComponentBrowser.tsx     # 見出しフォントサイズ統一
│       │   ├── ComponentCard.tsx        # ← DemoCard.tsx からリネーム
│       │   ├── PromptTemplate.tsx       # 3タブ（設計・実装・レジストリ更新）
│       │   └── shadcn-registry.ts       # 変更なし
│       └── showcase/                    # ← demos/ からリネーム
│           ├── stat-cards/
│           │   └── page.tsx
│           ├── login-form/
│           │   └── page.tsx
│           └── three-column-layout/
│               └── page.tsx             # インポートパス更新
├── components/
│   ├── ui/                              # shadcn/ui ベース（変更なし）
│   │   ├── accordion.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── collapsible.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── table.tsx
│   │   └── tabs.tsx
│   └── ThreeColumnLayout/               # ← layouts/ から移動
│       ├── ThreeColumnLayout.tsx
│       ├── index.ts
│       └── types.ts
└── lib/
    └── utils.ts
```

## 6. 影響範囲

### 影響あり

- プレイグラウンドの URL: `/playground/demos/[slug]` → `/playground/showcase/[slug]`
- ThreeColumnLayout のインポートパス: `@/components/layouts/ThreeColumnLayout` → `@/components/ThreeColumnLayout`
- トップページの表示: カード内に使用コンポーネント表示が追加
- プロンプトテンプレート: 2タブ → 3タブ
- ComponentBrowser の見出しフォントサイズ
- DemoCard → ComponentCard リネーム

### 影響なし

- shadcn/ui ベースコンポーネント (`src/components/ui/`)
- プレイグラウンドレイアウト (`playground/layout.tsx`)
- ComponentBrowser のコンポーネント一覧機能
- shadcn-registry.ts のデータ
