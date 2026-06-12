import { supabase } from "./supabase";

export type Session = { userId: string; name: string; email?: string };

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return null;
  const u = data.session.user;
  return {
    userId: u.id,
    email: u.email ?? undefined,
    name: u.user_metadata?.full_name ?? (u.email ? u.email.split("@")[0] : "User"),
  };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
