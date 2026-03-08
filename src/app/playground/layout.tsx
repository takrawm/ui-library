export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          <h1 className="text-lg font-bold">UI Library Playground</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
