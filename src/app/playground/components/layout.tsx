import Link from "next/link";

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b bg-muted/30 px-4 py-2">
        <Link
          href="/playground"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 一覧に戻る
        </Link>
      </div>
      {children}
    </div>
  );
}
