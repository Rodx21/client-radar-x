import { resolve } from "../../app/i18n";

describe("resolve", () => {
  const dict = {
    nav: { home: "Início", agenda: "Agenda" },
    common: { getQuote: "Fazer orçamento" },
  };

  it("resolves a nested dot-separated key", () => {
    expect(resolve(dict, "nav.home")).toBe("Início");
    expect(resolve(dict, "common.getQuote")).toBe("Fazer orçamento");
  });

  it("returns undefined for a missing key", () => {
    expect(resolve(dict, "nav.missing")).toBeUndefined();
    expect(resolve(dict, "missing.key")).toBeUndefined();
  });

  it("returns undefined when traversing into a non-object value", () => {
    expect(resolve(dict, "nav.home.extra")).toBeUndefined();
  });
});
