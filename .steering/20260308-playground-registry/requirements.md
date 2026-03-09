# プレイグラウンド Registry 方式への移行

## 背景

現在のプレイグラウンドトップページ（`src/app/playground/page.tsx`）は `fs.readdirSync` でディレクトリを走査し、エントリー一覧を動的に生成している。この方式は「ファイル追加だけで一覧に反映される」利点がある一方、以下の課題がある。

- `fs` モジュールへの依存により、コードの意図が読み取りにくい
- タイトルがスラッグからの自動変換に限定される（カスタムタイトルや説明文を付けられない）
- エントリーのメタデータ（使用コンポーネント、作成日など）を持たせる拡張性がない

## 要求内容

### 1. `registry.ts` の導入

`src/app/playground/registry.ts` に全エントリーを配列で管理するファイルを新設する。

```ts
// src/app/playground/registry.ts
import type { PlaygroundEntry } from "./_components/types";

export const playgroundEntries: PlaygroundEntry[] = [
  { slug: "accordion", type: "component", title: "Accordion" },
  { slug: "badge",     type: "component", title: "Badge" },
  { slug: "button",    type: "component", title: "Button" },
  { slug: "card",      type: "component", title: "Card" },
  { slug: "input",     type: "component", title: "Input" },
  { slug: "table",     type: "component", title: "Table" },
  { slug: "login-form",           type: "demo", title: "Login Form" },
  { slug: "stat-cards",           type: "demo", title: "Stat Cards" },
  { slug: "three-column-layout",  type: "demo", title: "Three Column Layout" },
];
```

### 2. `page.tsx` の簡素化

`page.tsx` から `fs` / `path` のインポートと `getEntries` 関数を削除し、`registry.ts` の配列をフィルタして表示する。

### 3. CLAUDE.md / `.cursor/rules/project-memory.mdc` への手順追記

デモ生成ワークフローおよびコンポーネント作成ワークフローに、**registry.ts へのエントリー追加を必須ステップとして明記**する。これにより、Claude Code / Cursor がコンポーネントやデモを追加する際に登録漏れを防ぐ。

追記箇所（両ファイル同期）：

- **「プレイグラウンドのデモ生成ワークフロー」セクション** に以下のステップを追加：
  > ステップ N. `src/app/playground/registry.ts` の `playgroundEntries` 配列にエントリーを追加する

- **「コンポーネント作成ワークフロー > ステップ 4」** にも同様の記載を追加：
  > プレイグラウンドのショーケースページを作成した場合は、`registry.ts` にエントリーを追加する

## 受け入れ条件

- [ ] `src/app/playground/registry.ts` が存在し、既存の全エントリー（component 6件 + demo 3件）が登録されている
- [ ] `src/app/playground/page.tsx` が `fs` / `path` を使わず、`registry.ts` のデータのみで一覧を表示する
- [ ] `pnpm build` および `pnpm lint` がエラーなく通る
- [ ] `/playground` のページ表示が従来と同等である（全エントリーが表示される）
- [ ] CLAUDE.md にレジストリへの追加手順が明記されている
- [ ] `.cursor/rules/project-memory.mdc` にも同一の手順が同期されている

## 制約事項

- `PlaygroundEntry` 型の変更は最小限にとどめる（既存のデモページへの影響を避ける）
- `ui/` 内のファイルは変更しない
