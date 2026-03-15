import { Link } from "react-router";
import { ArrowLeft, Mail } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";
import FormInput from "@/components/ui/input/form-input";

function ForgotPasswordPage() {
  const fakeRegister = () => ({});
  const fakeErrors = {};

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <AuthShell
      title="Forgot password"
      description="Enter your account email and we’ll send a password reset link."
      footer={
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="admin@example.com"
          register={fakeRegister}
          error={fakeErrors.email?.message}
        />

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-700">
          This is the UI-only version for now. Email sending will be wired later.
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <Mail className="h-4 w-4" />
          Send reset link
        </button>
      </form>
    </AuthShell>
  );
}

export default ForgotPasswordPage;
