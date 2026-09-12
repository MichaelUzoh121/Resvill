import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    const savedProfile = JSON.parse(
      localStorage.getItem("resvill_profile_v1") || "{}",
    );

    localStorage.setItem(
      "resvill_profile_v1",
      JSON.stringify({
        ...savedProfile,
        email,
      }),
    );
    localStorage.setItem("resvill_auth_v1", "true");
    window.dispatchEvent(new Event("resvill-auth-changed"));

    setTimeout(() => {
      toast.success("Welcome back to Resvill!");
      navigate(location.state?.from || "/checkout", { replace: true });
    }, 500);
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-dark-50/60 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card lg:grid-cols-2">
        {/* Welcome panel */}
        <section className="relative hidden overflow-hidden bg-dark-950 p-10 text-white lg:flex lg:min-h-[650px] lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-500/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 font-heading text-xl font-extrabold">
                R
              </span>

              <span className="font-heading text-xl font-extrabold">
                Resvill
              </span>
            </Link>

            <div className="mt-20 max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-primary-100">
                <Sparkles size={16} />
                Good food is always a good idea
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-tight xl:text-5xl">
                Welcome back to your favorite table.
              </h1>

              <p className="mt-6 text-base leading-8 text-dark-300">
                Sign in to continue your order, save your details, and enjoy
                a smoother Resvill experience.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500">
              <UtensilsCrossed size={21} />
            </div>

            <div>
              <p className="font-bold">Freshly made for you</p>
              <p className="mt-1 text-sm text-dark-300">
                Order your favorites in just a few clicks.
              </p>
            </div>
          </div>
        </section>

        {/* Login form */}
        <section className="relative p-6 sm:p-10 lg:p-14">
          <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-primary-50 blur-2xl" />

          <div className="relative">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 font-heading text-xl font-extrabold text-white">
                  R
                </span>

                <span className="font-heading text-xl font-extrabold text-dark-950">
                  Resvill
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-500">
                Member login
              </p>

              <h2 className="mt-3 font-heading text-3xl font-extrabold text-dark-950">
                Welcome back
              </h2>

              <p className="mt-3 leading-7 text-dark-500">
                Sign in to continue with your order.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <label className="block text-sm font-bold text-dark-700">
                Email address

                <div className="relative mt-2">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-dark-200 bg-dark-50/40 py-3.5 pl-12 pr-4 font-normal outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </label>

              <label className="block text-sm font-bold text-dark-700">
                Password

                <div className="relative mt-2">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-dark-200 bg-dark-50/40 py-3.5 pl-12 pr-12 font-normal outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 transition-colors hover:text-primary-500"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-dark-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary-500"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="font-bold text-primary-500 hover:text-primary-600"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Login"}

                {!isSubmitting && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-dark-500">
              New to Resvill?{" "}
              <Link
                className="font-bold text-primary-500 hover:text-primary-600"
                to="/register"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;


