# ComponentBrowser の拡充 — shadcn/ui 全コンポーネント参照 & プロンプトテンプレート

## 背景

現在のプレイグラウンドの ComponentBrowser は、`src/components/ui/` にインストール済みの 8 コンポーネントのみをハードコードで表示している。shadcn/ui は 50 以上のコンポーネントを提供しているが、すべてを事前にインストール・ショーケース化するのは現実的ではない。

一方、プロジェクトには既に shadcn MCP サーバー（`@anthropic-ai/shadcn-mcp-server`）が設定されており、Claude Code / Cursor は `get_component` / `list_components` で最新仕様を取得できる。

この仕組みを活かし、プレイグラウンド UI 側を改善することで、ユーザーが「shadcn/ui のコンポーネントを選ぶ → プロンプトを書く → Claude Code / Cursor で生成」という流れをスムーズに行えるようにする。

## 要求内容

### 1. shadcn/ui 全コンポーネント一覧の表示

ComponentBrowser を拡充し、shadcn/ui が提供する全コンポーネントの一覧を表示する。

- shadcn/ui の全コンポーネントをカテゴリ別に一覧表示する
- 各コンポーネントに shadcn/ui 公式ページ（`https://ui.shadcn.com/docs/components/[name]`）へのリンクを設ける
- `src/components/ui/` に既にインストール済みのコンポーネントと未インストールのものを視覚的に区別する（例: バッジ、色分け、アイコン等）

#### コンポーネント一覧のデータ管理

- shadcn/ui のコンポーネント一覧はプレイグラウンド側の**静的データファイル**（例: `src/app/playground/_components/shadcn-registry.ts`）で管理する
- このファイルは**スナップショット**であり、アプリケーション実行時に MCP サーバーを呼び出すことはない
- 初回構築時に、開発者または Claude Code / Cursor が MCP の `list_components` を実行し、取得結果をもとにデータファイルを生成する
- インストール済みかどうかは `src/components/ui/` 配下のファイル存在で判定する（ビルド時に静的に解決、または一覧データにフラグを持たせる）

#### データの更新フロー

shadcn/ui に新しいコンポーネントが追加された場合や、一覧を最新化したい場合は、Claude Code / Cursor に以下のような指示を出すことで更新できる。

```
shadcn-registry.ts を最新化してください。
MCP の list_components で最新のコンポーネント一覧を取得し、
shadcn-registry.ts を更新してください。
```

この指示により、Claude Code / Cursor が以下を自動的に行う:

1. MCP サーバーの `list_components` を実行して最新一覧を取得
2. `shadcn-registry.ts` のデータを更新
3. `src/components/ui/` の内容と照合してインストール状態を更新

```
┌─────────────────────────────────────────────────────────┐
│  MCP サーバーが動くタイミング                               │
│                                                         │
│  ① 初回構築時: Claude Code / Cursor が list_components    │
│     を実行し、shadcn-registry.ts を生成                    │
│                                                         │
│  ② 更新時: ユーザーが Claude Code / Cursor に更新を指示     │
│     → list_components で最新データ取得                     │
│     → shadcn-registry.ts を上書き                         │
│                                                         │
│  ③ デモ生成時: Claude Code / Cursor が get_component で    │
│     個別コンポーネントの詳細仕様を取得                       │
│                                                         │
│  ※ アプリケーション実行時（pnpm dev / build）には           │
│    MCP サーバーは一切関与しない                             │
└─────────────────────────────────────────────────────────┘
```

### 2. プロンプトテンプレートの提供

ユーザーが Claude Code / Cursor に指示を出す際に使えるプロンプトテンプレートを、プレイグラウンド UI 上に表示する。

- CLAUDE.md の「デモの指示テンプレート」をベースに、コピー&ペースト可能なテンプレートを表示する
- コンポーネント一覧から特定のコンポーネントを選択すると、そのコンポーネント名がテンプレートに自動挿入される形が望ましい
- テンプレートは折りたたみ可能なセクションとして表示する
- **デモ生成用**と**レジストリ更新用**の2種類のテンプレートを提供する

#### テンプレート A: デモ生成用

```
以下のデモページを作成してください。

スラッグ: [kebab-case のスラッグ]
タイトル: [デモのタイトル]
使用コンポーネント: [Button, Card, Input 等]
説明: [1-2文でデモの内容を説明]

レイアウト:
- [UIのレイアウトを箇条書きで]

インタラクション:
- [ユーザー操作とその結果（あれば）]
```

#### テンプレート B: レジストリ更新用

```
shadcn-registry.ts を最新化してください。
MCP の list_components で最新のコンポーネント一覧を取得し、
shadcn-registry.ts を更新してください。
```

### 3. ComponentBrowser の UI 改善

現在の ComponentBrowser は単純なグリッド表示だが、コンポーネント数が大幅に増えるため、UI を改善する。

- カテゴリ別のグルーピング（Form、Data Display、Layout、Navigation、Feedback 等）
- 検索・フィルタ機能（コンポーネント名での絞り込み）
- インストール済み / 未インストールでのフィルタ

## ユーザーストーリー

### US-1: shadcn/ui コンポーネントの発見

開発者として、プレイグラウンドの ComponentBrowser で shadcn/ui の全コンポーネントを一覧でき、各コンポーネントの公式ドキュメントへのリンクから仕様を確認できる。インストール済みのものが一目でわかるので、追加インストールが必要かどうかを判断できる。

### US-2: プロンプトによるUI生成

開発者として、ComponentBrowser でコンポーネントを選び、プロンプトテンプレートにコンポーネント名を挿入した上で、そのプロンプトを Claude Code / Cursor にコピー&ペーストしてデモを生成できる。

### US-3: 未インストールコンポーネントの利用

開発者として、未インストールの shadcn/ui コンポーネントを使いたい場合、Claude Code / Cursor に指示すると、MCP サーバー経由で最新仕様を取得し、必要なコンポーネントのインストール（`npx shadcn@latest add`）とデモ生成を一括で行ってくれる。

### US-4: コンポーネント一覧の最新化

開発者として、shadcn/ui に新しいコンポーネントが追加された際に、プレイグラウンド UI 上に表示されている「レジストリ更新用プロンプト」をコピーして Claude Code / Cursor に貼り付けるだけで、`shadcn-registry.ts` を最新の状態に更新できる。

## 受け入れ条件

- [ ] ComponentBrowser が shadcn/ui の全コンポーネント（50件以上）を表示する
- [ ] 各コンポーネントに shadcn/ui 公式ドキュメントへのリンクがある
- [ ] インストール済みと未インストールのコンポーネントが視覚的に区別できる
- [ ] カテゴリ別のグルーピングが機能する
- [ ] 検索・フィルタで目的のコンポーネントを素早く見つけられる
- [ ] デモ生成用プロンプトテンプレートが表示され、コピー可能である
- [ ] レジストリ更新用プロンプトテンプレートが表示され、コピー可能である
- [ ] `pnpm build` および `pnpm lint` がエラーなく通る
- [ ] 既存のプレイグラウンド機能（ショーケース、デモ一覧）に影響がない

## 制約事項

- `src/components/ui/` 内のファイルは変更しない
- 独自の MCP サーバーは構築しない（既存の `@anthropic-ai/shadcn-mcp-server` を活用）
- 追加の外部パッケージは原則不要（shadcn/ui + 既存スタックで実装）
- コンポーネント一覧データのメンテナンスコストを最小限に抑える設計とする

## 影響分析

### 変更対象

| ファイル / ディレクトリ | 変更内容 |
|---|---|
| `src/app/playground/_components/ComponentBrowser.tsx` | 全面リニューアル（カテゴリ表示、検索、リンク、インストール状態表示） |
| `src/app/playground/_components/types.ts` | `ComponentInfo` 型の拡張（公式URL、カテゴリ、インストール状態等） |
| `src/app/playground/_components/shadcn-registry.ts`（新規） | shadcn/ui 全コンポーネントの一覧データ |
| `src/app/playground/_components/PromptTemplate.tsx`（新規） | プロンプトテンプレート表示コンポーネント |

### 永続的ドキュメントへの影響

| ドキュメント | 影響 |
|---|---|
| `CLAUDE.md` | デモ生成ワークフローにコンポーネント参照の手順を追記 |
| `.cursor/rules/project-memory.mdc` | CLAUDE.md と同期 |
