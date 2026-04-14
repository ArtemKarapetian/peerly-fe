#!/usr/bin/env node

/**
 * FSD Scaffolding Script
 *
 * Generates boilerplate file structure for new entities or features
 * following the project's Feature-Sliced Design conventions.
 *
 * Usage:
 *   npm run gen:entity  notification
 *   npm run gen:feature auth login
 */

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";

const SRC = resolve(import.meta.dirname, "..", "src");

// ── Helpers ───────────────────────────────────────────────────────

function pascal(str) {
  return str.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase());
}

function camel(str) {
  const p = pascal(str);
  return p[0].toLowerCase() + p.slice(1);
}

function write(filePath, content) {
  if (existsSync(filePath)) {
    console.log(`  SKIP  ${filePath} (already exists)`);
    return;
  }
  writeFileSync(filePath, content, "utf-8");
  console.log(`  CREATE  ${filePath}`);
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

// ── Entity generator ──────────────────────────────────────────────

function generateEntity(name) {
  const Name = pascal(name);
  const dir = join(SRC, "entities", name);

  if (existsSync(dir)) {
    console.error(`Entity "${name}" already exists at ${dir}`);
    process.exit(1);
  }

  console.log(`\nGenerating entity: ${name}\n`);

  ensureDir(join(dir, "api"));
  ensureDir(join(dir, "model"));
  ensureDir(join(dir, "ui"));

  // model/types.ts
  write(
    join(dir, "model", "types.ts"),
    `export interface ${Name} {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Create${Name}Input {
  title: string;
}
`,
  );

  // model/api.types.ts
  write(
    join(dir, "model", "api.types.ts"),
    `/** Backend API response types (snake_case) */

export interface Api${Name} {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ApiCreate${Name}Payload {
  title: string;
}
`,
  );

  // model/mappers.ts
  write(
    join(dir, "model", "mappers.ts"),
    `import type { Api${Name} } from "./api.types";
import type { ${Name} } from "./types";

export function mapApi${Name}(api: Api${Name}): ${Name} {
  return {
    id: api.id,
    title: api.title,
    createdAt: new Date(api.created_at),
    updatedAt: new Date(api.updated_at),
  };
}
`,
  );

  // model/mappers.test.ts
  write(
    join(dir, "model", "mappers.test.ts"),
    `import { describe, it, expect } from "vitest";

import { mapApi${Name} } from "./mappers";

describe("mapApi${Name}", () => {
  it("maps API response to domain type", () => {
    const result = mapApi${Name}({
      id: "1",
      title: "Test",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-02T00:00:00Z",
    });

    expect(result.id).toBe("1");
    expect(result.title).toBe("Test");
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });
});
`,
  );

  // api/httpRepo.ts
  write(
    join(dir, "api", "httpRepo.ts"),
    `import { http } from "@/shared/api/httpClient";

import type { Api${Name} } from "../model/api.types";
import { mapApi${Name} } from "../model/mappers";
import type { Create${Name}Input, ${Name} } from "../model/types";

export const ${camel(name)}HttpRepo = {
  getAll: (): Promise<${Name}[]> =>
    http.get<Api${Name}[]>("/${name}s").then((items) => items.map(mapApi${Name})),

  getById: (id: string): Promise<${Name} | undefined> =>
    http.get<Api${Name}>(\`/${name}s/\${id}\`).then(mapApi${Name}),

  create: (input: Create${Name}Input): Promise<${Name}> =>
    http.post<Api${Name}>("/${name}s", input).then(mapApi${Name}),

  delete: (id: string): Promise<void> =>
    http.delete(\`/${name}s/\${id}\`).then(() => undefined),
};
`,
  );

  // api/demoRepo.ts
  write(
    join(dir, "api", "demoRepo.ts"),
    `import type { Create${Name}Input, ${Name} } from "../model/types";

const demo${Name}s: ${Name}[] = [
  {
    id: "${name[0]}1",
    title: "Example ${Name}",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

export const ${camel(name)}Repo = {
  getAll: (): Promise<${Name}[]> => Promise.resolve([...demo${Name}s]),

  getById: (id: string): Promise<${Name} | undefined> =>
    Promise.resolve(demo${Name}s.find((item) => item.id === id)),

  create: (input: Create${Name}Input): Promise<${Name}> => {
    const item: ${Name} = {
      ...input,
      id: \`${name[0]}\${Date.now()}\`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    demo${Name}s.push(item);
    return Promise.resolve(item);
  },

  delete: (id: string): Promise<void> => {
    const idx = demo${Name}s.findIndex((item) => item.id === id);
    if (idx !== -1) demo${Name}s.splice(idx, 1);
    return Promise.resolve();
  },
};
`,
  );

  // ui placeholder
  write(
    join(dir, "ui", `${Name}Card.tsx`),
    `import type { ${Name} } from "../model/types";

interface ${Name}CardProps {
  item: ${Name};
  onClick?: () => void;
}

export function ${Name}Card({ item, onClick }: ${Name}CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-surface-border bg-surface p-4 text-left transition-colors hover:bg-surface-hover"
    >
      <h3 className="font-medium text-text-primary">{item.title}</h3>
    </button>
  );
}
`,
  );

  // index.ts
  write(
    join(dir, "index.ts"),
    `import { env } from "@/shared/config/env";

import { ${camel(name)}Repo as demoRepo } from "./api/demoRepo";
import { ${camel(name)}HttpRepo } from "./api/httpRepo";

export type { ${Name}, Create${Name}Input } from "./model/types";
export { mapApi${Name} } from "./model/mappers";
export { ${Name}Card } from "./ui/${Name}Card";

export const ${camel(name)}Repo = env.apiUrl ? ${camel(name)}HttpRepo : demoRepo;
`,
  );

  console.log(`\nDone! Entity "${name}" created at src/entities/${name}/\n`);
}

// ── Feature generator ─────────────────────────────────────────────

function generateFeature(domain, action) {
  const Name = pascal(domain);
  const Action = pascal(action);
  const dir = join(SRC, "features", domain, action);

  if (existsSync(dir)) {
    console.error(`Feature "${domain}/${action}" already exists at ${dir}`);
    process.exit(1);
  }

  console.log(`\nGenerating feature: ${domain}/${action}\n`);

  ensureDir(join(dir, "model"));
  ensureDir(join(dir, "ui"));

  // model/types.ts
  write(
    join(dir, "model", "types.ts"),
    `export interface ${Action}${Name}FormData {
  // Add form fields here
  title: string;
}
`,
  );

  // ui/Form.tsx
  write(
    join(dir, "ui", `${Action}${Name}Form.tsx`),
    `import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import type { ${Action}${Name}FormData } from "../model/types";

interface ${Action}${Name}FormProps {
  onSubmit: (data: ${Action}${Name}FormData) => void;
  onCancel?: () => void;
}

export function ${Action}${Name}Form({ onSubmit, onCancel }: ${Action}${Name}FormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="${action}-${domain}-title" className="text-sm font-medium">
          {t("common.title", "Title")}
        </label>
        <Input
          id="${action}-${domain}-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        )}
        <Button type="submit">{t("common.save")}</Button>
      </div>
    </form>
  );
}
`,
  );

  // index.ts
  write(
    join(dir, "index.ts"),
    `export type { ${Action}${Name}FormData } from "./model/types";
export { ${Action}${Name}Form } from "./ui/${Action}${Name}Form";
`,
  );

  console.log(`\nDone! Feature "${domain}/${action}" created at src/features/${domain}/${action}/\n`);
}

// ── CLI ───────────────────────────────────────────────────────────

const [, , type, ...args] = process.argv;

if (type === "entity" && args[0]) {
  generateEntity(args[0]);
} else if (type === "feature" && args[0] && args[1]) {
  generateFeature(args[0], args[1]);
} else {
  console.log(`
  FSD Scaffolding Script

  Usage:
    node scripts/generate.mjs entity <name>       Create a new entity
    node scripts/generate.mjs feature <domain> <action>  Create a new feature

  Examples:
    npm run gen:entity notification
    npm run gen:feature auth login
    npm run gen:feature review submit
  `);
  process.exit(1);
}
