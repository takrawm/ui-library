"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ComponentInfo } from "./types";

const components: ComponentInfo[] = [
  {
    name: "Button",
    category: "ui",
    description: "クリック可能なボタン。variant と size でバリエーション指定",
    importPath: "@/components/ui/button",
  },
  {
    name: "Card",
    category: "ui",
    description:
      "カードコンテナ。CardHeader, CardTitle, CardContent 等と組み合わせ",
    importPath: "@/components/ui/card",
  },
  {
    name: "Input",
    category: "ui",
    description: "テキスト入力フィールド。type で入力タイプを指定",
    importPath: "@/components/ui/input",
  },
  {
    name: "Label",
    category: "ui",
    description: "フォームラベル。Input と組み合わせて使用",
    importPath: "@/components/ui/label",
  },
  {
    name: "Badge",
    category: "ui",
    description: "ステータスやカテゴリを示す小さなラベル",
    importPath: "@/components/ui/badge",
  },
  {
    name: "Accordion",
    category: "ui",
    description: "折りたたみ可能なコンテンツセクション",
    importPath: "@/components/ui/accordion",
  },
  {
    name: "Table",
    category: "ui",
    description: "データテーブル。Header, Body, Row, Cell 等で構成",
    importPath: "@/components/ui/table",
  },
  {
    name: "Collapsible",
    category: "ui",
    description: "開閉可能なコンテナ",
    importPath: "@/components/ui/collapsible",
  },
];

export function ComponentBrowser() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t">
      <Button
        variant="ghost"
        className="w-full justify-start py-4 text-sm font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "▼" : "▶"} コンポーネント参照（{components.length}件）
      </Button>
      {isOpen && (
        <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((comp) => (
            <div
              key={comp.name}
              className="rounded-md border p-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{comp.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {comp.category}
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">{comp.description}</p>
              <code className="mt-1 block text-xs text-muted-foreground">
                {comp.importPath}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
