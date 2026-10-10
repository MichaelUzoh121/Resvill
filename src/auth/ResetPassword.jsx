import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { resetPassword } from "../services/authService";
import { getErrorMessage } from "../utils/errorHandler";

const STRENGTH_LEVELS = [
  {
    label: "Too weak",
    color: "bg-danger",
    textColor: "text-danger",
  },
  {
    label: "Weak",
    color: "bg-warning",
    textColor: "text-warning",
  },
  {
    label: "Fair",
    color: "bg-accent-500",
    textColor: "text-accent-600",
  },
  {
    label: "Good",
    color: "bg-success",
    textColor: "text-success",
  },
  {
    label: "Strong",
    color: "bg-success",
    textColor: "text-success",
  },
];

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const clamped = Math.min(score, STRENGTH_LEVELS.length - 1);

  return {
    score: clamped,
    ...STRENGTH_LEVELS[clamped],
  };
}

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  useEffect(() => {
    if (!token) {
      navigate("/this-page-does-not-exist", {
        replace: true,
      });
    }
  }, [token, navigate]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const validate = () => {
    const next = {};

    if (!token) {
      next.token = "This password reset link is invalid.";
    }

    if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      next.confirmPassword = "Confirm your new password.";
    } else if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    if (!validate()) {
      return;
    }

    setStatus("loading");
    setServerError("");

    try {
      await resetPassword({
        token,
        password,
      });

      setStatus("success");

      toast.success("Password updated successfully.");

      setTimeout(() => {
        navigate("/auth/login", {
          replace: true,
        });
      }, 2000);
    } catch (error) {
      setServerError(getErrorMessage(error));
      setStatus("error");
    }
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
                Almost there
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-tight xl:text-5xl">
                Set a new password.
              </h1>

              <p className="mt-6 text-base leading-8 text-dark-300">
                Choose something strong that you&apos;ll remember - you&apos;ll
                use this to sign back in to Resvill.
              </p>
            </div>
          </div>
        </section>

        {/* Reset form */}
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
                  <BadgeCheck size={26} />
                </div>

                <h2 className="font-heading text-3xl font-extrabold text-dark-950">
                  Password updated
                </h2>

                <p className="mt-4 max-w-sm leading-7 text-dark-500">
                  Your password has been reset successfully. Taking you to
                  login...
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-500">
                    Reset password
                  </p>

                  <h2 className="mt-3 font-heading text-3xl font-extrabold text-dark-950">
                    Create a new password
                  </h2>

                  <p className="mt-3 leading-7 text-dark-500">
                    Create a new password to secure your Resvill account.
                  </p>
                </div>

                {errors.token && (
                  <div className="mb-5 flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/5 p-3.5 text-sm font-semibold text-danger">
                    <TriangleAlert size={18} className="mt-0.5 shrink-0" />

                    <span>{errors.token}</span>
                  </div>
                )}

                <form onSubmit={submit} noValidate className="space-y-5">
                  {/* New password */}
                  <label className="block text-sm font-bold text-dark-700">
                    New password
                    <div className="relative mt-2">
                      <LockKeyhole
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                      />

                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);

                          if (errors.password) {
                            setErrors((current) => ({
                              ...current,
                              password: "",
                            }));
                          }

                          if (status === "error") {
                            setStatus("idle");
                            setServerError("");
                          }
                        }}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.password)}
                        className={`w-full rounded-xl border bg-dark-50/40 py-3.5 pl-12 pr-12 font-normal outline-none transition-all placeholder:text-dark-400 focus:bg-white focus:ring-4 ${
                          errors.password
                            ? "border-danger focus:border-danger focus:ring-danger/10"
                            : "border-dark-200 focus:border-primary-500 focus:ring-primary-500/10"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-500"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2.5">
                        <div className="flex gap-1.5">
                          {STRENGTH_LEVELS.map((level, index) => (
                            <span
                              key={level.label}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${
                                index <= strength.score
                                  ? level.color
                                  : "bg-dark-100"
                              }`}
                            />
                          ))}
                        </div>

                        <span
                          className={`mt-1.5 inline-block text-xs font-bold ${strength.textColor}`}
                        >
                          {strength.label}
                        </span>
                      </div>
                    )}
                    {errors.password && (
                      <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-danger">
                        <TriangleAlert size={14} />
                        {errors.password}
                      </span>
                    )}
                  </label>

                  {/* Confirm password */}
                  <label className="block text-sm font-bold text-dark-700">
                    Confirm new password
                    <div className="relative mt-2">
                      <LockKeyhole
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                      />

                      <input
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);

                          if (errors.confirmPassword) {
                            setErrors((current) => ({
                              ...current,
                              confirmPassword: "",
                            }));
                          }

                          if (status === "error") {
                            setStatus("idle");
                            setServerError("");
                          }
                        }}
                        placeholder="Repeat your new password"
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        className={`w-full rounded-xl border bg-dark-50/40 py-3.5 pl-12 pr-12 font-normal outline-none transition-all placeholder:text-dark-400 focus:bg-white focus:ring-4 ${
                          errors.confirmPassword
                            ? "border-danger focus:border-danger focus:ring-danger/10"
                            : "border-dark-200 focus:border-primary-500 focus:ring-primary-500/10"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((current) => !current)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-500"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-danger">
                        <TriangleAlert size={14} />
                        {errors.confirmPassword}
                      </span>
                    )}
                  </label>

                  {status === "error" && (
                    <div className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/5 p-3.5 text-sm font-semibold text-danger">
                      <TriangleAlert size={18} className="mt-0.5 shrink-0" />

                      <span>{serverError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading" || !token}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "loading"
                      ? "Updating password..."
                      : "Reset password"}

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
                    to="/auth/login"
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

export default ResetPassword;
