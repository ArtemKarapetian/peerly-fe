import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Guard against re-introducing hardcoded card-shells.
 *
 * The design system already exports <Card> and <ErrorPage>. If you find
 * yourself writing `<div className="bg-card border-2 border-border rounded-xl …">`,
 * use <Card> instead — otherwise the design system drifts and every refactor
 * has to chase the same regex across 30+ files again.
 */

const CARD_SHELL = /bg-card[^"`]*border-2[^"`]*border-border[^"`]*rounded-xl/;

const PROJECT_ROOT = join(__dirname, "..", "..");
const ALLOWED_PATHS = new Set([
  join(PROJECT_ROOT, "shared", "ui", "card.tsx"),
  // <section> elements in the Terms page intentionally keep the card markup
  // inline so the semantic <section> tag is preserved.
  join(PROJECT_ROOT, "pages", "public", "terms", "ui", "Page.tsx"),
]);

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      yield* walk(full);
    } else if (full.endsWith(".tsx") && !full.endsWith(".test.tsx")) {
      yield full;
    }
  }
}

describe("design-system guard", () => {
  it("no .tsx outside shared/ui/card.tsx contains the hardcoded card-shell class chain", () => {
    const offenders: { file: string; line: number; snippet: string }[] = [];
    for (const file of walk(PROJECT_ROOT)) {
      if (ALLOWED_PATHS.has(file)) continue;
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, i) => {
        if (CARD_SHELL.test(line)) {
          offenders.push({ file, line: i + 1, snippet: line.trim() });
        }
      });
    }
    if (offenders.length > 0) {
      const report = offenders
        .map(({ file, line, snippet }) => `  ${file}:${line}\n    ${snippet}`)
        .join("\n");
      throw new Error(
        `Found ${offenders.length} hardcoded card-shell(s). Use <Card> from @/shared/ui instead.\n\n${report}`,
      );
    }
    expect(offenders).toHaveLength(0);
  });
});
