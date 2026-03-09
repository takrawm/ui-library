# タスクリスト: プレイグラウンド画面の再構成

## タスク

### 1. コンポーネントショーケースの削除

- [x] `src/app/playground/components/` ディレクトリを削除

### 2. 型定義の簡素化

- [x] `types.ts` の `PlaygroundEntry.type` から `"component"` を削除

### 3. DemoCard の簡素化

- [x] `DemoCard.tsx` から `type: "component"` 分岐を削除し、デモ専用に変更

### 4. ComponentBrowser からプロンプトテンプレートを分離

- [x] `ComponentBrowser.tsx` から `PromptTemplate` のインポート・表示・`Separator` を削除

### 5. トップページのレイアウト変更

- [x] `page.tsx` からショーケースセクションと `components` の走査ロジックを削除
- [x] `PromptTemplate` を独立セクションとして配置
- [x] 表示順序を ComponentBrowser → PromptTemplate → 組み合わせデモ に変更

### 6. 品質チェック

- [x] `pnpm build` がエラーなく通る
- [x] `pnpm lint` がエラーなく通る
- [ ] ブラウザで `/playground` の表示を確認（レイアウト順序、各セクションの表示）

### 7. ドキュメント更新

- [x] `docs/functional-design.md` のプレイグラウンド構成を更新
- [x] `docs/repository-structure.md` から `playground/components/` を削除
