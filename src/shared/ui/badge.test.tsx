import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Hello</Badge>);
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("has data-slot='badge' attribute", () => {
    render(<Badge>Slot test</Badge>);
    const el = screen.getByText("Slot test");
    expect(el.getAttribute("data-slot")).toBe("badge");
  });

  it("renders as span by default", () => {
    render(<Badge>Span test</Badge>);
    const el = screen.getByText("Span test");
    expect(el.tagName).toBe("SPAN");
  });

  it("applies custom className", () => {
    render(<Badge className="my-custom-class">Custom</Badge>);
    const el = screen.getByText("Custom");
    expect(el.className).toContain("my-custom-class");
  });

  it("renders all variants without crashing", () => {
    const variants = [
      "default",
      "success",
      "warning",
      "error",
      "info",
      "secondary",
      "outline",
    ] as const;

    for (const variant of variants) {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeDefined();
      unmount();
    }
  });

  it("renders as child element when asChild is true", () => {
    render(
      <Badge asChild>
        <a href="/test">Link badge</a>
      </Badge>,
    );
    const el = screen.getByText("Link badge");
    expect(el.tagName).toBe("A");
    expect(el.getAttribute("data-slot")).toBe("badge");
  });
});
