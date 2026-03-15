import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import AuthShell from "@/components/auth/auth-shell";
import FormInput from "@/components/ui/input/form-input";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const fakeRegister = () => ({});
  const fakeErrors = {};

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <AuthShell
      title="Sign in"
      description="Access Mihashi’s Smart Waste Management System dashboard."
      footer={
        <p className="text-center text-sm text-slate-500">
          Need help accessing your account?{" "}
          <Link
            to="/forgot-password"
            className="font-medium text-emerald-600 transition hover:text-emerald-700"
          >
            Reset password
          </Link>
        </p>
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

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-slate-500 transition hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="rounded border-slate-300" />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginPage;
