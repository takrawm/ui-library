# 要求内容: コンポーネント設計プロセスの導入とディレクトリ簡素化

## 背景

- このアプリケーションは開発サポート用途であり、シンプルさを重視する
- 現在のカテゴリ別ディレクトリ（`layouts/`, `data-display/` 等）は過剰な構造化
- UIイメージからコンポーネント分割を AI に設計させるプロセスを導入したい

## 変更内容

### 1. コンポーネントディレクトリのフラット化

**変更前:**
```
src/components/
├── ui/                    # shadcn/ui ベース（据え置き）
└── layouts/               # カテゴリ別
    └── ThreeColumnLayout/
```

**変更後:**
```
src/components/
├── ui/                    # shadcn/ui ベース（据え置き）
└── ThreeColumnLayout/     # フラット配置（カテゴリ分類なし）
```

- `src/components/ui/` は shadcn CLI 管理のため据え置き
- それ以外のカスタムコンポーネントは `src/components/` 直下にフラット配置
- カテゴリ別ディレクトリ（`layouts/`, `navigation/` 等）は廃止

### 2. プレイグラウンドページのリネーム

- `playground/demos/` → `playground/components/` にリネーム
- URL: `/playground/demos/[slug]` → `/playground/components/[slug]`
- セクション名: 「組み合わせデモ」→「コンポーネント」

### 3. カードに使用コンポーネントを表示

- 各コンポーネントページの `page.tsx` から `@/components/` へのインポート文を解析
- 使用している shadcn/ui コンポーネント名をカードに表示
- ファイルシステム走査時に Server Component で解析（追加のメタデータファイルは不要）

### 4. プロンプトテンプレートの2段階化

**Step 1: コンポーネント設計**
- UIのイメージを入力として、コンポーネント分割・責務・props 設計を AI に出力させる

**Step 2: 実装**
- Step 1 の設計結果に基づいてコンポーネントページを生成

## 受け入れ条件

- [ ] `src/components/layouts/` が廃止され、ThreeColumnLayout が `src/components/` 直下に移動している
- [ ] `playground/demos/` が `playground/components/` にリネームされている
- [ ] コンポーネントカードに使用している shadcn/ui コンポーネント名が表示される
- [ ] プロンプトテンプレートが「設計用」と「実装用」の2段階になっている
- [ ] `pnpm build` がエラーなく通る
- [ ] `pnpm lint` がエラーなく通る
