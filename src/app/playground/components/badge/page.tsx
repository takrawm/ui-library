"use client";

import { Badge } from "@/components/ui/badge";

/**
 * ショーケース: Badge
 *
 * shadcn/ui Badge コンポーネントの全バリエーションを表示。
 */
export default function BadgeShowcasePage() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Badge</h2>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">使用例</h3>
        <div className="flex flex-wrap gap-4">
          <Badge>新着</Badge>
          <Badge variant="secondary">下書き</Badge>
          <Badge variant="destructive">期限切れ</Badge>
          <Badge variant="outline">v2.0.0</Badge>
        </div>
      </section>
    </div>
  );
}
