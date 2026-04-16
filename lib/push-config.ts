export const webPushConfig = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
  privateKey: process.env.VAPID_PRIVATE_KEY ?? "",
  subject: process.env.VAPID_SUBJECT ?? "mailto:admin@example.com"
};

export function isWebPushConfigured() {
  return Boolean(webPushConfig.publicKey && webPushConfig.privateKey && webPushConfig.subject);
}
