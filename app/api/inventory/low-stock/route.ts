import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const supabase = createSupabaseServerClient();

    let query = supabase
      .from("low_stock_inventory")
      .select("*");

    if (!can(user.role, "inventory:update") && user.storeId) {
      query = query.eq("store_id", user.storeId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 401 });
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}
