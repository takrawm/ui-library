"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { shadcnComponents, categoryOrder } from "./shadcn-registry";
import type { ShadcnCategory } from "./types";

type CategoryFilter = ShadcnCategory | "All";

export function ComponentBrowser() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [showInstalledOnly, setShowInstalledOnly] = useState(false);

  const totalCount = shadcnComponents.length;
  const installedCount = shadcnComponents.filter((c) => c.installed).length;

  const filteredComponents = useMemo(() => {
    return shadcnComponents.filter((comp) => {
      if (activeCategory !== "All" && comp.category !== activeCategory)
        return false;
      if (showInstalledOnly && !comp.installed) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          comp.name.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activeCategory, showInstalledOnly, searchQuery]);

  const groupedComponents = useMemo(() => {
    const groups: Partial<Record<ShadcnCategory, typeof filteredComponents>> =
      {};
    for (const comp of filteredComponents) {
      if (!groups[comp.category]) {
        groups[comp.category] = [];
      }
      groups[comp.category]!.push(comp);
    }
    return groups;
  }, [filteredComponents]);

  const categoryFilters: CategoryFilter[] = ["All", ...categoryOrder];

  return (
    <div className="border-t">
      <Button
        variant="ghost"
        className="w-full justify-start py-4 text-lg font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "\u25BC" : "\u25B6"} shadcn/ui コンポーネント参照（
        {totalCount}件 / インストール済み {installedCount}件）
      </Button>

      {isOpen && (
        <div className="px-4 pb-4">
          {/* 検索 */}
          <div className="mb-3">
            <Input
              placeholder="コンポーネントを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* カテゴリフィルタ */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {categoryFilters.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* インストール済みフィルタ */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showInstalledOnly}
                onChange={(e) => setShowInstalledOnly(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-muted-foreground">
                インストール済みのみ表示
              </span>
            </label>
          </div>

          {/* コンポーネント一覧 */}
          {filteredComponents.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              該当するコンポーネントがありません
            </p>
          ) : (
            <div className="space-y-6">
              {categoryOrder.map((category) => {
                const comps = groupedComponents[category];
                if (!comps || comps.length === 0) return null;
                return (
                  <div key={category}>
                    <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                      {category}（{comps.length}）
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {comps.map((comp) => (
                        <div
                          key={comp.slug}
                          className={`rounded-md border p-3 text-sm ${
                            comp.installed ? "" : "opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comp.name}</span>
                            <Badge
                              variant={
                                comp.installed ? "default" : "secondary"
                              }
                              className="text-[10px] leading-none"
                            >
                              {comp.installed ? "済" : "未"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-muted-foreground">
                            {comp.description}
                          </p>
                          <a
                            href={comp.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-xs text-blue-600 hover:underline dark:text-blue-400"
                          >
                            ドキュメント &rarr;
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
