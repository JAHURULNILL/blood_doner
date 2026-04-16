import webpush from "web-push";
import { isWebPushConfigured, webPushConfig } from "@/lib/push-config";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendPushToUsers(userIds: string[], payload: PushPayload) {
  if (!userIds.length || !isWebPushConfigured()) return;

  const supabase = createAdminSupabaseClient();
  if (!supabase) return;

  webpush.setVapidDetails(webPushConfig.subject, webPushConfig.publicKey, webPushConfig.privateKey);

  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .in("user_id", userIds);

  if (!subscriptions?.length) return;

  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          },
          JSON.stringify(payload)
        );
      } catch (error) {
        const statusCode = typeof error === "object" && error !== null && "statusCode" in error ? Number(error.statusCode) : 0;
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", subscription.id);
        }
      }
    })
  );
}

export async function notifyMatchingDonorsForRequest(request: {
  id: string;
  patientName: string;
  bloodGroup: string;
  district: string;
  upazila: string;
  urgency: string;
}) {
  const supabase = createAdminSupabaseClient();
  if (!supabase || !isWebPushConfigured()) return;

  const { data: donors } = await supabase
    .from("donor_profiles")
    .select("user_id")
    .eq("blood_group", request.bloodGroup)
    .neq("availability_status", "inactive");

  const userIds = (donors ?? []).map((donor) => donor.user_id).filter(Boolean);
  if (!userIds.length) return;

  await sendPushToUsers(userIds, {
    title: `${request.bloodGroup} রক্তের নতুন অনুরোধ`,
    body: `${request.patientName} - ${request.upazila}, ${request.district} • ${request.urgency}`,
    url: `/requests/${request.id}`
  });
}
