import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { getSession, Session } from "./session";

type AuthCtx = { session: Session | null; loading: boolean; refresh: () => Promise<void> };
const AuthContext = createContext<AuthCtx | null>(null);

// Provides the current Supabase session (with role) app-wide, refetching on auth state changes.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setSession(await getSession());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads session on mount and resyncs on auth changes
    refresh().finally(() => setLoading(false));
    const { data: sub } = supabase.auth.onAuthStateChange(() => { refresh(); });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  return <AuthContext.Provider value={{ session, loading, refresh }}>{children}</AuthContext.Provider>;
}

// Hook for consuming the current session, loading state, and a manual refresh trigger.
export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSession outside AuthProvider");
  return ctx;
}
