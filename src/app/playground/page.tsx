import fs from "fs";
import path from "path";

import { ComponentCard, NewComponentCard } from "./_components/ComponentCard";
import { ComponentBrowser } from "./_components/ComponentBrowser";
import { PromptTemplate } from "./_components/PromptTemplate";
import type { PlaygroundEntry } from "./_components/types";

function extractUsedComponents(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const componentNames: string[] = [];

  // @/components/ui/ からのインポートを抽出
  const uiImportRegex = /from\s+["']@\/components\/ui\/([^"']+)["']/g;
  let match;
  while ((match = uiImportRegex.exec(content)) !== null) {
    const name = match[1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
    componentNames.push(name);
  }

  // @/components/ 直下のカスタムコンポーネントを抽出
  const customImportRegex =
    /from\s+["']@\/components\/(?!ui\/)([^"'/]+)["']/g;
  while ((match = customImportRegex.exec(content)) !== null) {
    componentNames.push(match[1]);
  }

  return [...new Set(componentNames)];
}

function getShowcaseEntries(): PlaygroundEntry[] {
  const fullPath = path.join(
    process.cwd(),
    "src/app/playground/showcase"
  );

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .filter((entry) => {
      const pagePath = path.join(fullPath, entry.name, "page.tsx");
      return fs.existsSync(pagePath);
    })
    .map((entry) => {
      const slug = entry.name;
      const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const pagePath = path.join(fullPath, entry.name, "page.tsx");
      const usedComponents = extractUsedComponents(pagePath);
      return { slug, title, usedComponents };
    });
}

export default function PlaygroundPage() {
  const showcaseEntries = getShowcaseEntries();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Playground</h2>
        <p className="mt-1 text-muted-foreground">
          コンポーネントを組み合わせた実践的なUIパターンを確認できます
        </p>
      </div>

      {/* shadcn/ui コンポーネント参照 */}
      <section className="mb-8">
        <ComponentBrowser />
      </section>

      {/* プロンプトテンプレート */}
      <section className="mb-12">
        <h3 className="mb-4 text-lg font-semibold">
          プロンプトテンプレート
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Claude Code / Cursor でショーケースを生成するためのテンプレート
        </p>
        <PromptTemplate />
      </section>

      {/* ショーケース */}
      <section className="mb-12">
        <h3 className="mb-4 text-lg font-semibold">ショーケース</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          複数コンポーネントを組み合わせた実践的なUIパターン
        </p>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {showcaseEntries.map((entry) => (
            <ComponentCard key={entry.slug} entry={entry} />
          ))}
          <NewComponentCard />
        </div>
      </section>
    </div>
  );
}
