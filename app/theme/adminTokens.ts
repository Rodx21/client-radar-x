import { createTokens, Tokens } from "./tokens";

// Fixed "operação clara" identity for the admin section (Business OS redesign
// v2, 2026-08-20 handoff): admin doesn't follow the customer app's
// user-toggleable light/dark preference — it's always this light palette.
// createTokens("light") already carries the right colors (tightened to this
// same spec earlier); the one real gap is radius: the customer app's shared
// components use a 14/18/24/999 scale, the redesign wants cards/fields flat
// at 4px and pills/badges/buttons closer to a 40px capsule.
export const ADMIN_TOKENS: Tokens = {
  ...createTokens("light"),
  radius: { md: 4, lg: 4, xl: 4, pill: 40 },
};
