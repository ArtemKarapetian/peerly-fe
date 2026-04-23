import { env } from "@/shared/config/env";

import { storageApiDemo } from "./api/demoApi";
import { storageApi as httpApi, type AttachTarget } from "./api/storageApi";

export const storageApi = env.apiUrl ? httpApi : storageApiDemo;
export type { AttachTarget };
