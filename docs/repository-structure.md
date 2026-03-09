# リポジトリ構造定義書

## 1. 全体構造

```
ui-library/
├── .mcp.json                        # shadcn/ui MCP サーバー設定（Claude Code 用）
├── .claude/                         # Claude Code 設定
├── .cursor/
│   ├── mcp.json                     # shadcn/ui MCP サーバー設定（Cursor 用）
│   └── rules/
│       └── project-memory.mdc       # Cursor 用プロジェクトルール（CLAUDE.md と同期）
├── .steering/                       # 作業単位のステアリングドキュメント
│   └── [YYYYMMDD]-[開発タイトル]/
│       ├── requirements.md
│       ├── design.md
│       └── tasklist.md
├── docs/                            # 永続的ドキュメント
│   ├── product-requirements.md      # プロダクト要求定義書
│   ├── functional-design.md         # 機能設計書
│   ├── architecture.md              # 技術仕様書
│   ├── repository-structure.md      # リポジトリ構造定義書（本ファイル）
│   └── document-sync-flow.md        # ドキュメント同期フロー
├── src/                             # ソースコード
│   ├── app/                         # Next.js App Router ページ
│   ├── components/                  # コンポーネント
│   └── lib/                         # ユーティリティ
├── CLAUDE.md                        # プロジェクトメモリ（AI 向け指示書）
├── package.json                     # 依存関係・スクリプト定義
├── pnpm-lock.yaml                   # ロックファイル
├── tsconfig.json                    # TypeScript 設定
├── next.config.ts                   # Next.js 設定
├── components.json                  # shadcn/ui CLI 設定
├── postcss.config.mjs               # PostCSS 設定
└── next-env.d.ts                    # Next.js 型定義（自動生成）
```

## 2. src/app/ — ページ・レイアウト

```
src/app/
├── globals.css                      # Tailwind CSS v4 設定 + テーマ定義
├── layout.tsx                       # ルートレイアウト（html, body, フォント）
├── page.tsx                         # / → /playground へリダイレクト
└── playground/
    ├── layout.tsx                   # プレイグラウンド共通レイアウト（ヘッダー・ナビ）
    ├── page.tsx                     # プレイグラウンドトップ（一覧表示）
    ├── _components/                 # プレイグラウンド固有の内部コンポーネント
    │   ├── types.ts                 # 型定義（PlaygroundEntry, ShadcnComponentEntry）
    │   ├── ComponentBrowser.tsx     # コンポーネント参照ブラウザ
    │   ├── ComponentCard.tsx        # ショーケースカードコンポーネント
    │   ├── PromptTemplate.tsx       # プロンプトテンプレート（設計・実装・レジストリ更新）
    │   └── shadcn-registry.ts       # shadcn/ui コンポーネント一覧（静的データ）
    └── showcase/                    # ショーケース（コンポーネント組み合わせ）
        ├── stat-cards/page.tsx
        ├── login-form/page.tsx
        └── three-column-layout/page.tsx
```

### ディレクトリの役割

| ディレクトリ | 役割 |
|---|---|
| `app/` | Next.js App Router のルーティング定義 |
| `app/playground/` | プレイグラウンド機能のルート |
| `app/playground/_components/` | プレイグラウンドでのみ使用する内部コンポーネント（`_` プレフィックスで Next.js のルーティング対象外） |
| `app/playground/showcase/` | コンポーネントを組み合わせたショーケースページ |

### ファイル配置ルール

- **ショーケース追加**: `app/playground/showcase/[slug]/page.tsx` を作成するとトップページに自動表示
- `_components/` 配下はプレイグラウンド内部でのみ使用し、外部からインポートしない

## 3. src/components/ — コンポーネント

```
src/components/
├── ui/                              # shadcn/ui ベースコンポーネント（自動生成）
│   ├── accordion.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── collapsible.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── scroll-area.tsx
│   ├── separator.tsx
│   ├── table.tsx
│   └── tabs.tsx
└── ThreeColumnLayout/               # カスタムコンポーネント（フラット配置）
    ├── ThreeColumnLayout.tsx         # メイン実装
    ├── index.ts                      # re-export
    └── types.ts                      # 型定義
```

### ディレクトリ構成

| ディレクトリ | 役割 | 例 |
|---|---|---|
| `ui/` | shadcn/ui ベースコンポーネント。`npx shadcn@latest add` で追加。**直接編集禁止** | Button, Card, Input |
| `[ComponentName]/` | カスタムコンポーネント。`ui/` と同階層にフラット配置 | ThreeColumnLayout |

カテゴリ別のサブディレクトリ（`layouts/`, `navigation/` 等）は使用しない。すべてのカスタムコンポーネントは `src/components/` 直下にコンポーネント名のディレクトリを作成して配置する。

### カスタムコンポーネントの構成ルール

各カスタムコンポーネントは、`src/components/` 直下に専用ディレクトリを作成する。

```
src/components/[ComponentName]/
├── [ComponentName].tsx              # メイン実装
├── [ComponentName].test.tsx         # テスト（将来）
├── index.ts                         # re-export
└── types.ts                         # 型定義（props が複雑な場合）
```

## 4. src/lib/ — ユーティリティ

```
src/lib/
└── utils.ts                         # cn() ヘルパー（clsx + tailwind-merge）
```

プロジェクト共通のユーティリティ関数を配置する。コンポーネント固有のロジックはコンポーネントディレクトリ内に配置する。

## 5. docs/ — 永続的ドキュメント

```
docs/
├── product-requirements.md          # プロダクト要求定義書
├── functional-design.md             # 機能設計書
├── architecture.md                  # 技術仕様書
├── repository-structure.md          # リポジトリ構造定義書（本ファイル）
├── document-sync-flow.md            # ドキュメント同期フロー
├── development-guidelines.md        # 開発ガイドライン（未作成）
└── glossary.md                      # ユビキタス言語定義（未作成）
```

アプリケーション全体の設計・方針を定義する恒久的なドキュメント。基本設計が変わらない限り更新しない。

## 6. .steering/ — 作業単位のドキュメント

```
.steering/
├── 20260307-improve-guidelines/     # 開発ガイドライン改善
├── 20260308-component-browser-enhancement/  # ComponentBrowser 拡張
├── 20260308-interactive-demo-playground/    # インタラクティブデモ
└── 20260308-playground-registry/    # プレイグラウンドレジストリ
```

### 命名規則

```
.steering/[YYYYMMDD]-[開発タイトル]/
```

- 特定の開発作業における要求・設計・タスクを管理
- 作業完了後も履歴として保持
- 新しい作業では必ず新しいディレクトリを作成

## 7. 設定ファイル

| ファイル | 用途 |
|---|---|
| `package.json` | 依存関係、スクリプト、packageManager 指定 |
| `tsconfig.json` | TypeScript 設定（strict, パスエイリアス） |
| `next.config.ts` | Next.js 設定（現在はデフォルト） |
| `components.json` | shadcn/ui CLI 設定（スタイル、エイリアス、カラー） |
| `postcss.config.mjs` | PostCSS 設定（Tailwind CSS 用） |
| `.mcp.json` | Claude Code 用 MCP サーバー設定 |
| `.cursor/mcp.json` | Cursor 用 MCP サーバー設定 |
| `CLAUDE.md` | プロジェクトメモリ（AI 向け包括指示書） |
| `.cursor/rules/project-memory.mdc` | Cursor 用プロジェクトルール（CLAUDE.md と同期） |

## 8. ファイル配置の原則

1. **shadcn/ui コンポーネント**は `src/components/ui/` に配置し、直接編集しない
2. **カスタムコンポーネント**は `src/components/[ComponentName]/` にフラット配置
3. **ページ**は `src/app/` 配下に Next.js App Router の規約に従って配置
4. **プレイグラウンド固有のコンポーネント**は `src/app/playground/_components/` に配置
5. **共通ユーティリティ**は `src/lib/` に配置
6. **永続的ドキュメント**は `docs/` に配置
7. **作業単位のドキュメント**は `.steering/` に日付付きディレクトリで配置
