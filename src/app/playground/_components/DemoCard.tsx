import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { PlaygroundEntry } from "./types";

interface DemoCardProps {
  entry: PlaygroundEntry;
}

export function DemoCard({ entry }: DemoCardProps) {
  const href =
    entry.type === "component"
      ? `/playground/components/${entry.slug}`
      : `/playground/demos/${entry.slug}`;

  return (
    <Link href={href}>
      <Card className="h-full transition-colors hover:bg-accent/50">
        <CardHeader>
          <CardTitle className="text-lg">{entry.title}</CardTitle>
          <CardDescription>
            {entry.type === "component"
              ? "コンポーネントショーケース"
              : "組み合わせデモ"}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export function NewDemoCard() {
  return (
    <Card className="h-full border-dashed">
      <CardHeader>
        <CardTitle className="text-lg text-muted-foreground">
          + 新しいデモ
        </CardTitle>
        <CardDescription>
          Claude Code / Cursor で生成
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
