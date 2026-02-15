export interface DemoPlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  category: "plagiarism" | "analytics" | "integration" | "other";
}
