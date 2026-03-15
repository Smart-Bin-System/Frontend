import { Link } from "react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthShell from "@/components/auth/auth-shell";
import FormInput from "@/components/ui/input/form-input";
import Toast from "@/components/ui/toast";
import { requestPasswordReset } from "@/features/auth/api/forgot-password";
import { forgotPasswordSchema } from "@/features/auth/schemas/forgot-password-schema";
import { useState } from "react";

function ForgotPasswordPage() {
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    setServerMessage("");
    setServerError("");

    try {
      const response = await requestPasswordReset(values);

      const message =
        response?.message ||
        response?.data?.message ||
        "Password reset instructions were sent successfully.";

      setServerMessage(message);
      reset();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send reset instructions. Please try again.";

      setServerError(message);
    }
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {serverMessage ? (
          <Toast variant="success" title="Request sent" description={serverMessage} />
        ) : null}

        {serverError ? (
          <Toast variant="error" title="Request failed" description={serverError} />
        ) : null}

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="admin@example.com"
          register={register}
          error={errors.email?.message}
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Mail className="h-4 w-4" />
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}

export default ForgotPasswordPage;
