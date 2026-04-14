import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";

import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
import { Input } from "./input";

describe("a11y: shared UI components", () => {
  it("Button has no critical a11y violations", async () => {
    const { container } = render(<Button>Save</Button>);
    const results = await axe(container);
    expect(results.violations.filter((v) => v.impact === "critical")).toHaveLength(0);
  });

  it("Input with label has no a11y violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>,
    );
    const results = await axe(container);
    expect(results.violations.filter((v) => v.impact === "critical")).toHaveLength(0);
  });

  it("Badge has no critical a11y violations", async () => {
    const { container } = render(<Badge>Active</Badge>);
    const results = await axe(container);
    expect(results.violations.filter((v) => v.impact === "critical")).toHaveLength(0);
  });

  it("Card with proper heading structure has no a11y violations", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content goes here</p>
        </CardContent>
      </Card>,
    );
    const results = await axe(container);
    expect(results.violations.filter((v) => v.impact === "critical")).toHaveLength(0);
  });

  it("disabled Button is still accessible", async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const results = await axe(container);
    expect(results.violations.filter((v) => v.impact === "critical")).toHaveLength(0);
  });

  it("Input without label is flagged (sanity check)", async () => {
    const { container } = render(<Input type="text" />);
    const results = await axe(container);
    // This SHOULD have violations (missing label) — proves axe is working
    const labelViolations = results.violations.filter((v) => v.id === "label");
    expect(labelViolations.length).toBeGreaterThan(0);
  });
});
