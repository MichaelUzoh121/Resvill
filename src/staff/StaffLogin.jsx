import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  User,
} from "lucide-react";
import { loginStaff } from "../utils/staffAuth";

function StaffLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginStaff(username, password);
      setIsSubmitting(false);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(`Welcome, ${result.session.name}`);
      navigate(location.state?.from || (result.session.role === "driver" ? "/driver" : "/staff"), { replace: true });
    }, 400);
  };

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-dark-950 px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-dark-900 p-8 shadow-card sm:p-10">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
            <ShieldCheck size={22} className="text-white" />
          </span>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-primary-400">
            Staff access
          </p>

          <h1 className="mt-2 font-heading text-2xl font-extrabold text-white">
            Resvill Staff Login
          </h1>

          <p className="mt-2 text-sm text-dark-400">
            For kitchen and order management staff only.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <label className="block text-sm font-bold text-dark-200">
            Username

            <div className="relative mt-2">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500"
              />

              <input
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. kitchen"
                autoComplete="username"
                className="w-full rounded-xl border border-white/10 bg-dark-800 py-3.5 pl-12 pr-4 text-white outline-none transition-all placeholder:text-dark-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
              />
            </div>
          </label>

          <label className="block text-sm font-bold text-dark-200">
            Password

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500"
              />

              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-dark-800 py-3.5 pl-12 pr-12 text-white outline-none transition-all placeholder:text-dark-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 transition-colors hover:text-primary-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}

            {!isSubmitting && (
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        <Link
          to="/"
          className="mt-8 block text-center text-sm font-semibold text-dark-500 hover:text-dark-300"
        >
          &larr; Back to Resvill
        </Link>
      </div>
    </main>
  );
}

export default StaffLogin;

