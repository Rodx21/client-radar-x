import { getPref, setPref } from "../../app/lib/storage";

describe("storage prefs", () => {
  it("returns null for a key that was never set", async () => {
    expect(await getPref("crx.unset")).toBeNull();
  });

  it("round-trips a value through setPref/getPref", async () => {
    await setPref("crx.theme", "dark");
    expect(await getPref("crx.theme")).toBe("dark");
  });

  it("overwrites a previously stored value", async () => {
    await setPref("crx.lang", "pt-BR");
    await setPref("crx.lang", "en-US");
    expect(await getPref("crx.lang")).toBe("en-US");
  });
});
