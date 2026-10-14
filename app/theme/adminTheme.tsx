import { ThemeContext } from "./theme";
import { ADMIN_TOKENS } from "./adminTokens";

// Wraps the admin route group in the fixed "operação clara" palette (see
// adminTokens.ts) instead of the customer app's theme toggle. Every existing
// useTheme() call inside admin screens keeps working unchanged — it just
// resolves to these tokens now, which is what makes every admin screen (old
// TCC-era ones included: appointments/quotes/services/gallery/settings) pick
// up the new visual identity without editing each screen individually.
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ mode: "light", setMode: () => {}, toggle: () => {}, tokens: ADMIN_TOKENS }}>
      {children}
    </ThemeContext.Provider>
  );
}
