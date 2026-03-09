# タスクリスト: コンポーネント設計プロセスの導入とディレクトリ簡素化

## タスク

### 1. コンポーネントディレクトリのフラット化

- [x] `src/components/layouts/ThreeColumnLayout/` を `src/components/ThreeColumnLayout/` に移動
- [x] `src/components/layouts/` ディレクトリを削除

### 2. プレイグラウンドページのリネーム

- [x] `src/app/playground/demos/` を `src/app/playground/showcase/` にリネーム
- [x] `showcase/three-column-layout/page.tsx` のインポートパスを `@/components/layouts/ThreeColumnLayout` → `@/components/ThreeColumnLayout` に更新

### 3. DemoCard → ComponentCard リネーム

- [x] `_components/DemoCard.tsx` を `_components/ComponentCard.tsx` にリネーム
- [x] コンポーネント名を `DemoCard` → `ComponentCard`、`NewDemoCard` → `NewComponentCard` に変更
- [x] `href` を `/playground/showcase/${entry.slug}` に変更
- [x] `CardDescription` を「ショーケース」に変更

### 4. 型定義の更新

- [x] `types.ts` の `PlaygroundEntry` に `usedComponents: string[]` フィールドを追加

### 5. トップページの更新

- [x] 走査パスを `playground/demos` → `playground/showcase` に変更
- [x] `DemoCard` → `ComponentCard` のインポートを更新
- [x] セクション名を「ショーケース」に変更
- [x] `extractUsedComponents` 関数を実装し、各エントリに使用コンポーネント情報を付与

### 6. ComponentCard に使用コンポーネント表示を追加

- [x] `usedComponents` を Badge で表示する UI を実装

### 7. ComponentBrowser の見出しフォントサイズ統一

- [x] 折りたたみボタンのフォントサイズを他セクション見出しと統一

### 8. PromptTemplate の2段階化

- [x] タブを3つに変更（コンポーネント設計 / 実装 / レジストリ更新）
- [x] Step 1「コンポーネント設計」テンプレートを以下の内容で作成:
  - 入力: UIのイメージ（画面の説明やスクリーンショット）
  - 出力フォーマット指定:
    ```
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

    ## コンポーネント関係図
    [親子関係とデータの流れを箇条書きまたは図で記述]

    ## ファイル構成
    - src/components/ に作成するファイル一覧（再利用コンポーネント）
    - playground/showcase/[slug]/page.tsx に作成するファイル（ショーケースページ）
    ```
- [x] Step 2「実装」テンプレートを以下の内容で作成:
  - src/components/ に配置する再利用コンポーネントを先に作成する指示
  - その後 playground/showcase/[slug]/page.tsx を作成する指示
  - 各コンポーネントは設計で指定された Props と責務に従う指示
  - Step 1 の設計結果を貼り付ける領域

### 9. 品質チェック

- [x] `pnpm build` がエラーなく通る
- [x] `pnpm lint` がエラーなく通る
- [ ] ブラウザで `/playground` の表示を確認

### 10. ドキュメント更新

- [x] `docs/functional-design.md` を更新
- [x] `docs/repository-structure.md` を更新
- [x] `CLAUDE.md` を更新（`.cursor/rules/project-memory.mdc` も同期）
