"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * ショーケース: Input
 *
 * shadcn/ui Input コンポーネントの全バリエーションを表示。
 * type, placeholder, disabled 等の props を確認できる。
 */
export default function InputShowcasePage() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Input</h2>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Type バリエーション</h3>
        <div className="grid max-w-md gap-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text</Label>
            <Input id="text" type="text" placeholder="テキストを入力" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="パスワード" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Number</Label>
            <Input id="number" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" type="search" placeholder="検索..." />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">States</h3>
        <div className="grid max-w-md gap-4">
          <div className="space-y-2">
            <Label>Default</Label>
            <Input placeholder="入力可能" />
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Input disabled placeholder="入力不可" />
          </div>
          <div className="space-y-2">
            <Label>With value</Label>
            <Input defaultValue="入力済みの値" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">File</h3>
        <div className="max-w-md space-y-2">
          <Label htmlFor="file">ファイル選択</Label>
          <Input id="file" type="file" />
        </div>
      </section>
    </div>
  );
}
