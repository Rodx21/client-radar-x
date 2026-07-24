import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useSession } from "@/app/lib/auth";

// Guards the entire /admin route group behind role==="admin"; real enforcement is RLS, this is UX-only.
export default function AdminLayout() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session?.role !== "admin") router.replace("/(drawer)/(tabs)/inicio");
  }, [loading, session, router]);

  if (loading || session?.role !== "admin") return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
