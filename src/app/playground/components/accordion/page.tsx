"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * ショーケース: Accordion
 *
 * shadcn/ui Accordion コンポーネントの全バリエーションを表示。
 * single / multiple タイプの違いを確認できる。
 */
export default function AccordionShowcasePage() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Accordion</h2>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Single（1つだけ開く）</h3>
        <Accordion type="single" collapsible className="max-w-lg">
          <AccordionItem value="item-1">
            <AccordionTrigger>アコーディオン 1</AccordionTrigger>
            <AccordionContent>
              最初のアコーディオンの内容です。他の項目を開くとこの項目は閉じます。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>アコーディオン 2</AccordionTrigger>
            <AccordionContent>
              2番目のアコーディオンの内容です。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>アコーディオン 3</AccordionTrigger>
            <AccordionContent>
              3番目のアコーディオンの内容です。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Multiple（複数同時に開く）</h3>
        <Accordion type="multiple" className="max-w-lg">
          <AccordionItem value="item-1">
            <AccordionTrigger>FAQ: 利用方法</AccordionTrigger>
            <AccordionContent>
              Claude Code または Cursor でプロンプトを入力してデモを生成します。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>FAQ: 対応コンポーネント</AccordionTrigger>
            <AccordionContent>
              Button, Card, Input, Label, Badge, Accordion, Table, Collapsible
              に対応しています。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>FAQ: カスタマイズ</AccordionTrigger>
            <AccordionContent>
              Tailwind CSS のユーティリティクラスでスタイリングをカスタマイズできます。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
