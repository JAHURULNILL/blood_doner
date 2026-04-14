import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-xl">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
