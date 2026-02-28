import { DemoOrganization } from "../model/types";

const demoOrgs: DemoOrganization[] = [
  { id: "org1", name: "Университет Иннополис", slug: "innopolis", plan: "enterprise", userCount: 523, createdAt: new Date("2023-01-15") },
  { id: "org2", name: "МГУ им. Ломоносова", slug: "msu", plan: "pro", userCount: 1247, createdAt: new Date("2023-03-20") },
  { id: "org3", name: "ИТМО", slug: "itmo", plan: "pro", userCount: 892, createdAt: new Date("2023-05-10") },
];

export const organizationRepo = {
  getAll: (): DemoOrganization[] => demoOrgs,
};
