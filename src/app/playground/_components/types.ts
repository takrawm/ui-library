export interface PlaygroundEntry {
  slug: string; //URL末尾に使われる、ページやコンテンツを識別するための人間が読みやすい固有のID文字列
  title: string;
  usedComponents: string[]; // 使用している @/components/ のコンポーネント名（import文から自動抽出）
}

/** shadcn/ui コンポーネントのカテゴリ分類 */
export type ShadcnCategory =
  | "Form"
  | "Data Display"
  | "Layout"
  | "Navigation"
  | "Feedback"
  | "Overlay"
  | "Other";

/** shadcn/ui コンポーネント一覧のエントリー */
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
