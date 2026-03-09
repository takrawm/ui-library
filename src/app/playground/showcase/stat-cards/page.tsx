"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

const stats: StatItem[] = [
  { id: "1", title: "総売上", value: "¥12,450,000", change: "+12.5%", trend: "up" },
  { id: "2", title: "アクティブユーザー", value: "3,240", change: "+8.1%", trend: "up" },
  { id: "3", title: "注文数", value: "856", change: "-2.3%", trend: "down" },
  { id: "4", title: "平均レビュー", value: "4.8 / 5.0", change: "+0.3", trend: "up" },
];

/**
 * デモ: 統計カードダッシュボード
 *
 * 使用コンポーネント: Card, CardHeader, CardTitle, CardDescription, CardContent, Badge
 * 作成日: 2026-03-08
 */
export default function StatCardsDemo() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">ダッシュボード</h2>
        <p className="text-muted-foreground">主要な指標の概要</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={stat.trend === "up" ? "default" : "destructive"}>
                {stat.change}
              </Badge>
              <span className="ml-2 text-xs text-muted-foreground">
                前月比
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
