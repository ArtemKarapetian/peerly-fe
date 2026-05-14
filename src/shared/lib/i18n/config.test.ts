import { describe, it, expect } from "vitest";

import i18n from "./config";

describe("i18n config", () => {
  it("exports an initialized i18next instance", () => {
    expect(i18n).toBeDefined();
    expect(typeof i18n.t).toBe("function");
  });

  it("registers the ru translation namespace", () => {
    expect(i18n.hasResourceBundle("ru", "translation")).toBe(true);
  });

  it("registers the en translation namespace", () => {
    expect(i18n.hasResourceBundle("en", "translation")).toBe(true);
  });

  it("uses ru as fallback language", () => {
    expect(i18n.options.fallbackLng).toEqual(expect.arrayContaining(["ru"]));
  });

  it("can change language without throwing", async () => {
    await expect(i18n.changeLanguage("en")).resolves.toBeDefined();
    expect(i18n.language).toBe("en");
    await i18n.changeLanguage("ru");
  });

  it("sets document.documentElement.lang on language change", async () => {
    await i18n.changeLanguage("en");
    expect(document.documentElement.lang).toBe("en");
    await i18n.changeLanguage("ru");
    expect(document.documentElement.lang).toBe("ru");
  });
});
