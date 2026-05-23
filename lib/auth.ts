import type { Role } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
  storeId: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthenticated");
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role, store_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("User profile is missing");
  }

  return {
    id: user.id,
    email: user.email ?? "",
    role: profile.role as Role,
    storeId: profile.store_id
  };
}
