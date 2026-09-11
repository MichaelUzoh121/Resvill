import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MailCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Backend contract:
//
// POST /api/auth/forgot-password
// body: { "email": "user@example.com" }
//
// The endpoint should ALWAYS respond with the same generic success shape,
// whether or not an account exists for that email (this avoids leaking
// which emails are registered):
//   200 OK  { "message": "If an account exists for this email, we sent a password reset link." }
//
// Only return a non-200 for real failures (bad request body, rate limit,
// server error) - never for "email not found".
// ---------------------------------------------------------------------------
async function requestPasswordReset(email) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return response.json().catch(() => ({}));
}

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");

  const validate = (value) => {
    if (!value.trim()) return "Enter your email address.";
    if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address.";
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();

    const error = validate(email);
    setFieldError(error);
    if (error) return;

    setStatus("loading");
    setServerError("");

    try {
      await requestPasswordReset(email.trim());
      setStatus("success");
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-dark-50/60 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card lg:grid-cols-2">
        {/* Info panel */}
        <section className="relative hidden overflow-hidden bg-dark-950 p-10 text-white lg:flex lg:min-h-[600px] lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-500/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 font-heading text-xl font-extrabold">
                R
              </span>
              <span className="font-heading text-xl font-extrabold">Resvill</span>
            </Link>

            <div className="mt-20 max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-primary-100">
                <Sparkles size={16} />
                We've got you covered
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-tight xl:text-5xl">
                Forgot your password? No problem.
              </h1>

              <p className="mt-6 text-base leading-8 text-dark-300">
                Enter the email on your account and we'll send you a link
                to get back in.
              </p>
            </div>
          </div>
        </section>

        {/* Form panel */}
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

            {status === "success" ? (
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                  <MailCheck size={26} />
                </div>

                <h2 className="font-heading text-3xl font-extrabold text-dark-950">
                  Check your inbox
                </h2>

                <p className="mt-4 max-w-sm leading-7 text-dark-500">
                  If an account exists for this email, we sent a password
                  reset link.
                </p>

                <Link
                  to="/login"
                  className="mt-8 inline-flex items-center gap-2 font-bold text-primary-500 hover:text-primary-600"
                >
                  <ArrowLeft size={18} />
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-500">
                    Reset password
                  </p>

                  <h2 className="mt-3 font-heading text-3xl font-extrabold text-dark-950">
                    Forgot password?
                  </h2>

                  <p className="mt-3 leading-7 text-dark-500">
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                <form onSubmit={submit} noValidate className="space-y-5">
                  <label className="block text-sm font-bold text-dark-700">
                    Email address
                    <div className="relative mt-2">
                      <Mail
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (fieldError) setFieldError(validate(event.target.value));
                        }}
                        placeholder="you@example.com"
                        aria-invalid={Boolean(fieldError)}
                        className={`w-full rounded-xl border bg-dark-50/40 py-3.5 pl-12 pr-4 font-normal outline-none transition-all placeholder:text-dark-400 focus:bg-white focus:ring-4 ${
                          fieldError
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                            : "border-dark-200 focus:border-primary-500 focus:ring-primary-500/10"
                        }`}
                      />
                    </div>
                    {fieldError && (
                      <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-500">
                        <TriangleAlert size={14} />
                        {fieldError}
                      </span>
                    )}
                  </label>

                  {status === "error" && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-600">
                      <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                      {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "loading" ? "Sending link..." : "Send reset link"}
                    {status !== "loading" && (
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </button>
                </form>

                <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-sm text-dark-500">
                  <ArrowLeft size={16} />
                  <Link
                    className="font-bold text-primary-500 hover:text-primary-600"
                    to="/login"
                  >
                    Back to login
                  </Link>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ForgotPassword;
