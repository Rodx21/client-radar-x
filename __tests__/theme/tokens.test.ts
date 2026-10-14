import { createTokens } from "../../app/theme/tokens";

describe("createTokens", () => {
  it("returns light-mode colors when mode is 'light'", () => {
    const tokens = createTokens("light");
    expect(tokens.color.surface).toBe("#FFFFFF");
    expect(tokens.color.ink).toBe("#111111");
  });

  it("returns dark-mode colors when mode is 'dark'", () => {
    const tokens = createTokens("dark");
    expect(tokens.color.surface).toBe("#0A0A0A");
    expect(tokens.color.ink).toBe("#FFFFFF");
  });

  it("uses the client's accent color in both modes", () => {
    const light = createTokens("light");
    const dark = createTokens("dark");
    expect(light.color.accent).toBe(dark.color.accent);
    expect(light.color.accent).toBe("#D9121F");
  });

  it("keeps spacing and radius tokens identical across modes", () => {
    const light = createTokens("light");
    const dark = createTokens("dark");
    expect(light.space).toEqual(dark.space);
    expect(light.radius).toEqual(dark.radius);
  });
});
