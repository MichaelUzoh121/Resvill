import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    localStorage.setItem(
      "resvill_profile_v1",
      JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
      }),
    );

    toast.success(
      "Account created successfully. Welcome to Resvill!",
    );

    setTimeout(() => {
      navigate("/checkout");
    }, 1200);
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-dark-50/60 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card lg:grid-cols-2">
        {/* Welcome panel */}
        <section className="relative hidden overflow-hidden bg-primary-500 p-10 text-white lg:flex lg:min-h-[720px] lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-dark-950/20 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-heading text-xl font-extrabold text-primary-500">
                R
              </span>

              <span className="font-heading text-xl font-extrabold">
                Resvill
              </span>
            </Link>

            <div className="mt-20 max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold">
                <Sparkles size={16} />
                Your table is waiting
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-tight xl:text-5xl">
                Create your account and make every order easier.
              </h1>

              <p className="mt-6 text-base leading-8 text-primary-50">
                Save your details, speed up checkout, and keep your
                Resvill orders organized in one place.
              </p>
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="font-heading text-lg font-bold">
              More flavor. Less waiting.
            </p>

            <p className="mt-2 text-sm leading-6 text-primary-50">
              Your saved information will be available at checkout
              during this test version.
            </p>
          </div>
        </section>

        {/* Registration form */}
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
                Join Resvill
              </p>

              <h2 className="mt-3 font-heading text-3xl font-extrabold text-dark-950">
                Create your account
              </h2>

              <p className="mt-3 leading-7 text-dark-500">
                Save your details for a quicker checkout experience.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <label className="block text-sm font-bold text-dark-700">
                Full name

                <div className="relative mt-2">
                  <UserRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-dark-200 bg-dark-50/40 py-3.5 pl-12 pr-4 font-normal outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </label>

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
                    name="email"
                    value={form.email}
                    onChange={update}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-dark-200 bg-dark-50/40 py-3.5 pl-12 pr-4 font-normal outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </label>

              <label className="block text-sm font-bold text-dark-700">
                Phone number

                <div className="relative mt-2">
                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    placeholder="0800 000 0000"
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
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={update}
                    placeholder="At least 6 characters"
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

              <label className="block text-sm font-bold text-dark-700">
                Confirm password

                <div className="relative mt-2">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    required
                    minLength={6}
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={update}
                    placeholder="Repeat your password"
                    className="w-full rounded-xl border border-dark-200 bg-dark-50/40 py-3.5 pl-12 pr-12 font-normal outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current,
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 transition-colors hover:text-primary-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </label>

              <label className="flex items-start gap-3 pt-1 text-xs leading-5 text-dark-500">
                <input
                  required
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 accent-primary-500"
                />

                <span>
                  I agree to receive order updates and accept the
                  Resvill terms for this test account.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create account"}

                {!isSubmitting && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-dark-500">
              Already registered?{" "}
              <Link
                className="font-bold text-primary-500 hover:text-primary-600"
                to="/login"
              >
                Login instead
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;

