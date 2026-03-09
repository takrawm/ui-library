"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DESIGN_TEMPLATE = `以下のUIを実現するためのコンポーネント設計をしてください。

UIのイメージ:
[画面の説明やスクリーンショット]

以下のフォーマットで回答してください:

---

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

（コンポーネントの数だけ繰り返し）

## コンポーネント関係図
[親子関係とデータの流れを箇条書きまたは図で記述]

## ファイル構成
- src/components/ に作成するファイル一覧（再利用コンポーネント）
- playground/showcase/[slug]/page.tsx に作成するファイル（ショーケースページ）

---`;

const IMPLEMENT_TEMPLATE = `以下の設計に基づいて実装してください。
- src/components/ に配置する再利用コンポーネントを先に作成
- その後 playground/showcase/[slug]/page.tsx を作成
- 各コンポーネントは設計で指定された Props と責務に従うこと

[Step 1 の設計結果をここに貼り付け]`;

const REGISTRY_UPDATE_TEMPLATE = `shadcn-registry.ts を最新化してください。
MCP の list_components で最新のコンポーネント一覧を取得し、
shadcn-registry.ts を更新してください。`;

export function PromptTemplate() {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const handleCopy = async (text: string, tab: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div>
      <Tabs defaultValue="design">
        <TabsList>
          <TabsTrigger value="design">Step 1: コンポーネント設計</TabsTrigger>
          <TabsTrigger value="implement">Step 2: 実装</TabsTrigger>
          <TabsTrigger value="registry">レジストリ更新</TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <div className="rounded-md border bg-muted/50 p-4">
            <pre className="whitespace-pre-wrap text-sm">
              {DESIGN_TEMPLATE}
            </pre>
          </div>
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(DESIGN_TEMPLATE, "design")}
            >
              {copiedTab === "design" ? "コピーしました" : "コピー"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="implement">
          <div className="rounded-md border bg-muted/50 p-4">
            <pre className="whitespace-pre-wrap text-sm">
              {IMPLEMENT_TEMPLATE}
            </pre>
          </div>
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(IMPLEMENT_TEMPLATE, "implement")}
            >
              {copiedTab === "implement" ? "コピーしました" : "コピー"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="registry">
          <div className="rounded-md border bg-muted/50 p-4">
            <pre className="whitespace-pre-wrap text-sm">
              {REGISTRY_UPDATE_TEMPLATE}
            </pre>
          </div>
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(REGISTRY_UPDATE_TEMPLATE, "registry")}
            >
              {copiedTab === "registry" ? "コピーしました" : "コピー"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
