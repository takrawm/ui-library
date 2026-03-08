import fs from "fs";
import path from "path";

import { DemoCard, NewDemoCard } from "./_components/DemoCard";
import { ComponentBrowser } from "./_components/ComponentBrowser";
import type { PlaygroundEntry } from "./_components/types";

function getEntries(
  dir: string,
  type: "component" | "demo"
): PlaygroundEntry[] {
  const fullPath = path.join(process.cwd(), dir);

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
      return { slug, title, type };
    });
}

export default function PlaygroundPage() {
  const components = getEntries(
    "src/app/playground/components",
    "component"
  );
  const demos = getEntries("src/app/playground/demos", "demo");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Playground</h2>
        <p className="mt-1 text-muted-foreground">
          コンポーネントの動作確認とデモを確認できます
        </p>
      </div>

      {/* コンポーネントショーケース */}
      <section className="mb-12">
        <h3 className="mb-4 text-lg font-semibold">
          コンポーネントショーケース
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          ライブラリのベースコンポーネントを個別に確認できます
        </p>
        {components.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {components.map((entry) => (
              <DemoCard key={entry.slug} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            ショーケースページはまだありません
          </p>
        )}
      </section>

      {/* 組み合わせデモ */}
      <section className="mb-12">
        <h3 className="mb-4 text-lg font-semibold">組み合わせデモ</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          複数コンポーネントを組み合わせた実践的なデモ
        </p>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {demos.map((entry) => (
            <DemoCard key={entry.slug} entry={entry} />
          ))}
          <NewDemoCard />
        </div>
      </section>

      {/* コンポーネント参照パネル */}
      <ComponentBrowser />
    </div>
  );
}
