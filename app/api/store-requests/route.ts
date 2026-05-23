import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createOrderNumber } from "@/lib/order-numbers";
import { assertPermission, can } from "@/lib/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const supabase = createSupabaseServerClient();

    let query = supabase
      .from("store_requests")
      .select("*, store_request_items(*), from_store:stores!store_requests_from_store_id_fkey(name), to_store:stores!store_requests_to_store_id_fkey(name)")
      .order("created_at", { ascending: false });

    if (!can(user.role, "store_request:fulfill") && user.storeId) {
      query = query.or(`from_store_id.eq.${user.storeId},to_store_id.eq.${user.storeId}`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    assertPermission(user.role, "store_request:create");

    const body = await request.json();
    const supabase = createSupabaseServerClient();
    const fromStoreId = body.from_store_id ?? user.storeId;

    const { data: storeRequest, error: requestError } = await supabase
      .from("store_requests")
      .insert({
        request_no: createOrderNumber("REQ"),
        request_type: body.request_type,
        from_store_id: fromStoreId,
        to_store_id: body.to_store_id,
        status: "New Request",
        reason: body.reason,
        priority: body.priority ?? "normal",
        requested_by: user.id
      })
      .select("id")
      .single();

    if (requestError) throw requestError;

    const items = body.items.map((item: Record<string, unknown>) => ({
      store_request_id: storeRequest.id,
      product_id: item.product_id,
      sku: item.sku,
      product_name: item.product_name,
      requested_quantity: item.requested_quantity,
      notes: item.notes
    }));

    const { error: itemsError } = await supabase
      .from("store_request_items")
      .insert(items);

    if (itemsError) throw itemsError;

    return NextResponse.json({ data: { id: storeRequest.id } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}
