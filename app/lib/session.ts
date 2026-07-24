import { supabase } from "./supabase";

export type Role = "customer" | "admin";
export type Session = { userId: string; name: string; email?: string; role: Role };

// Reads the current Supabase auth session and maps it to a Session, failing closed to "customer" on any role lookup error.
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return null;
  const u = data.session.user;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", u.id).single();
  return {
    userId: u.id,
    email: u.email ?? undefined,
    name: u.user_metadata?.full_name ?? (u.email ? u.email.split("@")[0] : "User"),
    role: profile?.role === "admin" ? "admin" : "customer",
  };
}

// Signs the current user out of Supabase Auth.
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
