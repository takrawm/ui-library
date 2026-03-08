"use client";

import { Button } from "@/components/ui/button";

/**
 * ショーケース: Button
 *
 * shadcn/ui Button コンポーネントの全バリエーションを表示。
 * variant, size, disabled, asChild 等の props を確認できる。
 */
export default function ButtonShowcasePage() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Button</h2>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg">Large</Button>
          <Button size="default">Default</Button>
          <Button size="sm">Small</Button>
          <Button size="icon">+</Button>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">States</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Enabled</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Variant + Size</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" size="sm">
            Small Outline
          </Button>
          <Button variant="destructive" size="lg">
            Large Destructive
          </Button>
          <Button variant="secondary" size="sm">
            Small Secondary
          </Button>
        </div>
      </section>
    </div>
  );
}
