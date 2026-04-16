import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const adminSupabase = createAdminSupabaseClient();

  if (!supabase || !adminSupabase) {
    return NextResponse.json({ success: false, message: "Server configuration missing" }, { status: 500 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
  }

  const body = await request.json();
  const endpoint = body?.endpoint;
  const p256dh = body?.keys?.p256dh;
  const auth = body?.keys?.auth;

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ success: false, message: "Invalid subscription" }, { status: 400 });
  }

  const { error } = await adminSupabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint,
      p256dh,
      auth
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient();
  const adminSupabase = createAdminSupabaseClient();

  if (!supabase || !adminSupabase) {
    return NextResponse.json({ success: false, message: "Server configuration missing" }, { status: 500 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
  }

  const body = await request.json();
  const endpoint = body?.endpoint;

  if (!endpoint) {
    return NextResponse.json({ success: false, message: "Endpoint required" }, { status: 400 });
  }

  const { error } = await adminSupabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
