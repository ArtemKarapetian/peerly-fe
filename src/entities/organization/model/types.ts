export interface DemoOrganization {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "enterprise";
  userCount: number;
  createdAt: Date;
}
