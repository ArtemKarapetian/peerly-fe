import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useFAQSearch } from "./useFAQSearch";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "page.help.faq.gs1q": "How do I start?",
        "page.help.faq.gs1a": "Click the big button.",
        "page.help.faq.gs2q": "What is peer review?",
        "page.help.faq.gs2a": "It is a process of reviewing each other.",
        "page.help.faq.ts1q": "I see an error",
        "page.help.faq.ts1a": "Try refreshing the browser.",
        "page.help.faq.cs1q": "Contact support",
        "page.help.faq.cs1a": "Reach out via email.",
      };
      return map[key] ?? key;
    },
  }),
}));

describe("useFAQSearch", () => {
  it("returns all sections when search is empty", () => {
    const { result } = renderHook(() => useFAQSearch());
    expect(result.current.sections["getting-started"].length).toBeGreaterThan(0);
    expect(result.current.sections.troubleshooting.length).toBeGreaterThan(0);
    expect(result.current.sections.contact.length).toBeGreaterThan(0);
  });

  it("filters by question text (case-insensitive)", () => {
    const { result } = renderHook(() => useFAQSearch());

    act(() => {
      result.current.setSearchQuery("BIG BUTTON");
    });

    const matched = result.current.sections["getting-started"].find((e) =>
      e.answer.toLowerCase().includes("big button"),
    );
    expect(matched).toBeDefined();
  });

  it("filters by answer text", () => {
    const { result } = renderHook(() => useFAQSearch());

    act(() => {
      result.current.setSearchQuery("refreshing");
    });

    expect(result.current.sections.troubleshooting.length).toBeGreaterThan(0);
    const gsMatching = result.current.sections["getting-started"].filter((e) =>
      e.answer.toLowerCase().includes("refreshing"),
    );
    expect(gsMatching.length).toBe(0);
  });

  it("empty query restores all", () => {
    const { result } = renderHook(() => useFAQSearch());

    act(() => {
      result.current.setSearchQuery("non-existent string here");
    });
    expect(result.current.filteredCount).toBe(0);

    act(() => {
      result.current.setSearchQuery("");
    });
    expect(result.current.filteredCount).toBeGreaterThan(0);
  });
});
