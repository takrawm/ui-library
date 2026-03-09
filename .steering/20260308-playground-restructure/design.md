# 設計: プレイグラウンド画面の再構成

## 1. 実装アプローチ

### 方針

- コンポーネントショーケース関連のファイル・ロジックを削除
- ComponentBrowser からプロンプトテンプレートを分離し、トップページで独立セクションとして配置
- トップページのレイアウトを上から「ComponentBrowser → プロンプトテンプレート → 組み合わせデモ」の順に再構成

### 削除対象

| 対象 | パス |
|---|---|
| ショーケースページ（6件） | `src/app/playground/components/` ディレクトリごと |

### 変更対象

| ファイル | 変更内容 |
|---|---|
| `src/app/playground/page.tsx` | ショーケースセクション削除、レイアウト順序変更、PromptTemplate を独立セクションとして配置 |
| `src/app/playground/_components/ComponentBrowser.tsx` | PromptTemplate のインポート・表示を削除。折りたたみ UI はそのまま維持 |
| `src/app/playground/_components/DemoCard.tsx` | `type: "component"` 関連の分岐を削除（デモ専用に簡素化） |
| `src/app/playground/_components/types.ts` | `PlaygroundEntry.type` から `"component"` を削除 |

### 変更不要

| ファイル | 理由 |
|---|---|
| `src/app/playground/_components/PromptTemplate.tsx` | 現状のまま独立コンポーネントとして使用可能 |
| `src/app/playground/_components/shadcn-registry.ts` | ComponentBrowser のデータソースとして変更不要 |
| `src/app/playground/layout.tsx` | 共通レイアウトに変更なし |
| `src/app/playground/demos/` 配下 | デモページは変更なし |

## 2. 変更するコンポーネントの詳細

### 2.1 `page.tsx` — トップページ

**変更前の構造:**
```
[ヘッダー: Playground]
[セクション: コンポーネントショーケース（DemoCard × 6）]  ← 削除
[セクション: 組み合わせデモ（DemoCard × 3 + NewDemoCard）]
[ComponentBrowser（折りたたみ、内部に PromptTemplate 含む）]
```

**変更後の構造:**
```
[ヘッダー: Playground]
[ComponentBrowser（折りたたみ、コンポーネント一覧のみ）]
[セクション: プロンプトテンプレート]
[セクション: 組み合わせデモ（DemoCard × 3 + NewDemoCard）]
```

**主な変更点:**
- `getEntries("src/app/playground/components", "component")` の呼び出しを削除
- コンポーネントショーケースの `<section>` を削除
- `PromptTemplate` を直接インポートして独立セクションとして配置
- ComponentBrowser → PromptTemplate → デモ の順序で配置

### 2.2 `ComponentBrowser.tsx`

**変更点:**
- `PromptTemplate` のインポートと `<Separator>` + `<PromptTemplate />` の表示を削除
- `Separator` のインポートも不要になれば削除

### 2.3 `DemoCard.tsx`

**変更点:**
- `entry.type === "component"` の分岐を削除
- `href` は常に `/playground/demos/${entry.slug}` に固定
- `CardDescription` は常に「組み合わせデモ」を表示

### 2.4 `types.ts`

**変更点:**
- `PlaygroundEntry.type` を `"component" | "demo"` → `"demo"` のみに変更、または `type` フィールド自体を削除

## 3. 修正後のディレクトリツリー

```
src/app/playground/
├── layout.tsx                       # 共通レイアウト（変更なし）
├── page.tsx                         # トップページ（レイアウト変更）
├── _components/
│   ├── types.ts                     # 型定義（PlaygroundEntry 簡素化）
│   ├── ComponentBrowser.tsx         # コンポーネント一覧（PromptTemplate 分離）
│   ├── DemoCard.tsx                 # デモカード（デモ専用に簡素化）
│   ├── PromptTemplate.tsx           # プロンプトテンプレート（変更なし）
│   └── shadcn-registry.ts          # shadcn/ui レジストリデータ（変更なし）
└── demos/
    ├── stat-cards/
    │   └── page.tsx                 # 統計カードデモ（変更なし）
    ├── login-form/
    │   └── page.tsx                 # ログインフォームデモ（変更なし）
    └── three-column-layout/
        └── page.tsx                 # 3カラムレイアウトデモ（変更なし）
```

**削除されるディレクトリ:**
```
src/app/playground/components/       # ディレクトリごと削除
├── button/page.tsx
├── card/page.tsx
├── badge/page.tsx
├── input/page.tsx
├── table/page.tsx
└── accordion/page.tsx
```

## 4. 影響範囲の分析

### 影響あり

- プレイグラウンドのトップページ表示 — レイアウトが変わる
- ComponentBrowser の表示 — プロンプトテンプレートが消える（外に移動）

### 影響なし

- デモページの表示・動作
- shadcn/ui ベースコンポーネント（`src/components/ui/`）
- カスタムコンポーネント（`src/components/layouts/`）
- ルートページのリダイレクト（`src/app/page.tsx`）

### 破壊的変更

- `/playground/components/*` の URL が 404 になる（ショーケースページ削除のため）
- 外部からこれらの URL を参照している箇所があれば影響を受けるが、現時点ではプレイグラウンドトップページからのリンクのみであり、同時に削除するため問題なし
