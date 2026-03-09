import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { PlaygroundEntry } from "./types";

interface ComponentCardProps {
  entry: PlaygroundEntry;
}

export function ComponentCard({ entry }: ComponentCardProps) {
  return (
    <Link href={`/playground/showcase/${entry.slug}`}>
      <Card className="h-full transition-colors hover:bg-accent/50">
        <CardHeader>
          <CardTitle className="text-lg">{entry.title}</CardTitle>
          <CardDescription>ショーケース</CardDescription>
        </CardHeader>
        {entry.usedComponents.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {entry.usedComponents.map((name) => (
                <Badge key={name} variant="secondary" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}

export function NewComponentCard() {
  return (
    <Card className="h-full border-dashed">
      <CardHeader>
        <CardTitle className="text-lg text-muted-foreground">
          + 新しいショーケース
        </CardTitle>
        <CardDescription>
          Claude Code / Cursor で生成
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
