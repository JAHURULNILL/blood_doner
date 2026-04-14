import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-xl">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
