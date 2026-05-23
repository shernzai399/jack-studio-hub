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
      .from("service_orders")
      .select("*, customers(full_name, phone), stores(name)")
      .order("created_at", { ascending: false });

    if (!can(user.role, "service:view_all") && user.storeId) {
      query = query.eq("store_id", user.storeId);
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
    assertPermission(user.role, "service:create");

    const body = await request.json();
    const supabase = createSupabaseServerClient();

    const storeId = can(user.role, "service:view_all") ? body.store_id : user.storeId;
    if (!storeId) {
      return NextResponse.json({ error: "Store is required" }, { status: 400 });
    }

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        full_name: body.customer.full_name,
        phone: body.customer.phone,
        email: body.customer.email,
        preferred_contact: body.customer.preferred_contact
      })
      .select("id")
      .single();

    if (customerError) throw customerError;

    const { data: serviceOrder, error: serviceError } = await supabase
      .from("service_orders")
      .insert({
        order_no: createOrderNumber("SVC"),
        customer_id: customer.id,
        store_id: storeId,
        service_type: body.service_type,
        item_brand: body.item_brand,
        item_model: body.item_model,
        item_color: body.item_color,
        item_description: body.item_description,
        issue_description: body.issue_description,
        requested_work: body.requested_work,
        quotation_amount: body.quotation_amount,
        quotation_notes: body.quotation_notes,
        payment_status: body.payment_status ?? "unpaid",
        status: body.status ?? "New Request",
        expected_completion_date: body.expected_completion_date,
        created_by: user.id,
        updated_by: user.id
      })
      .select("*")
      .single();

    if (serviceError) throw serviceError;

    return NextResponse.json({ data: serviceOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}
