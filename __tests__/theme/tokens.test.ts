import { createTokens } from "../../app/theme/tokens";

describe("createTokens", () => {
  it("returns light-mode colors when mode is 'light'", () => {
    const tokens = createTokens("light");
    expect(tokens.color.surface).toBe("#FFFFFF");
    expect(tokens.color.ink).toBe("#0B0B0D");
  });

  it("returns dark-mode colors when mode is 'dark'", () => {
    const tokens = createTokens("dark");
    expect(tokens.color.surface).toBe("#0B0B0D");
    expect(tokens.color.ink).toBe("#FFFFFF");
  });

  it("uses the client's accent color in both modes", () => {
    const light = createTokens("light");
    const dark = createTokens("dark");
    expect(light.color.accent).toBe(dark.color.accent);
    expect(light.color.accent).toBe("#FF0000");
  });

  it("keeps spacing and radius tokens identical across modes", () => {
    const light = createTokens("light");
    const dark = createTokens("dark");
    expect(light.space).toEqual(dark.space);
    expect(light.radius).toEqual(dark.radius);
  });
});
