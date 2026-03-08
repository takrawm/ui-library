export interface PlaygroundEntry {
  slug: string;
  title: string;
  type: "component" | "demo";
}

export interface ComponentInfo {
  name: string;
  category: string;
  description: string;
  importPath: string;
}
