"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * ショーケース: Card
 *
 * shadcn/ui Card コンポーネントの全バリエーションを表示。
 * CardHeader, CardTitle, CardDescription, CardContent, CardFooter の組み合わせを確認できる。
 */
export default function CardShowcasePage() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Card</h2>

      <section>
        <h3 className="mb-4 text-lg font-semibold">基本構成</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>タイトルのみ</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>タイトル + 説明</CardTitle>
              <CardDescription>
                カードの説明テキストが入ります
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>フル構成</CardTitle>
              <CardDescription>すべてのサブコンポーネントを使用</CardDescription>
            </CardHeader>
            <CardContent>
              <p>カードのメインコンテンツエリアです。</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">保存</Button>
              <Button variant="outline" size="sm">
                キャンセル
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">コンテンツのバリエーション</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>統計カード</CardTitle>
              <CardDescription>売上データ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">¥1,234,567</div>
              <p className="text-sm text-muted-foreground">前月比 +12.5%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>リストカード</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>項目 A</span>
                  <span className="text-muted-foreground">100</span>
                </li>
                <li className="flex justify-between">
                  <span>項目 B</span>
                  <span className="text-muted-foreground">200</span>
                </li>
                <li className="flex justify-between">
                  <span>項目 C</span>
                  <span className="text-muted-foreground">300</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
