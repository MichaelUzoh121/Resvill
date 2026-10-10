import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { resendVerification } from "../services/authService";
import { getErrorMessage } from "../utils/errorHandler";
import { ROUTES } from "../constants/routes";

function ResendVerification() {
  const location = useLocation();
  const navigate = useNavigate();

  const registeredEmail = location.state?.registeredEmail || "";

  useEffect(() => {
    if (!registeredEmail) {
      navigate("/this-page-does-not-exist", {
        replace: true,
      });
    }
  }, [registeredEmail, navigate]);

  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!registeredEmail || countdown > 0 || isResending) {
      return;
    }

    setIsResending(true);

    try {
      await resendVerification(registeredEmail);

      setCountdown(60);

      toast.success("A new verification link has been sent.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-dark-50/60 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card lg:grid-cols-2">
        {/* Welcome panel */}
        <section className="relative hidden overflow-hidden bg-primary-500 p-10 text-white lg:flex lg:min-h-[650px] lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-dark-950/20 blur-3xl" />

          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut",
            }}
            className="absolute left-16 top-24 h-40 w-40 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
          />

          <motion.div
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            }}
            className="absolute bottom-24 right-16 h-52 w-52 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
          />

          <div className="relative z-10">
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-3">
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
                Almost there
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-tight xl:text-5xl">
                Verify your email and get started.
              </h1>

              <p className="mt-6 text-base leading-8 text-primary-50">
                We've sent a verification link to your email address. Verify
                your account to continue using Resvill.
              </p>
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                <ShieldCheck size={18} />
              </div>

              <div>
                <p className="font-heading text-lg font-bold">
                  Keep your account secure.
                </p>

                <p className="mt-2 text-sm leading-6 text-primary-50">
                  Email verification helps us keep your Resvill account safe and
                  gives you access to your account features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Verification notice */}
        <section className="relative flex items-center p-6 sm:p-10 lg:p-14">
          <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-primary-50 blur-2xl" />

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-full text-center"
          >
            {/* Mobile logo */}
            <div className="mb-10 lg:hidden">
              <Link to={ROUTES.HOME} className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 font-heading text-xl font-extrabold text-white">
                  R
                </span>

                <span className="font-heading text-xl font-extrabold text-dark-950">
                  Resvill
                </span>
              </Link>
            </div>

            {/* Icon */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 text-primary-500">
              <Mail className="h-12 w-12" />
            </div>

            {/* Heading */}
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-primary-500">
              Account verification
            </p>

            <h2 className="mt-3 font-heading text-3xl font-extrabold text-dark-950 sm:text-4xl">
              Verification link sent
            </h2>

            <p className="mx-auto mt-4 max-w-md leading-7 text-dark-500">
              We've sent a verification link to your email address. Check your
              inbox and click the link to verify your account.
            </p>

            {/* Email */}
            {registeredEmail && (
              <div className="mt-5 rounded-xl border border-dark-100 bg-dark-50/60 px-4 py-3">
                <p className="break-all text-sm font-bold text-primary-500">
                  {registeredEmail}
                </p>
              </div>
            )}

            {/* Check inbox / spam */}
            <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50/60 p-5 text-left">
              <div className="flex items-start gap-3">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />

                <div>
                  <p className="text-sm font-bold text-dark-800">
                    Check your inbox or spam folder
                  </p>

                  <p className="mt-1 text-xs leading-6 text-dark-500">
                    If you don't see the email in your inbox, check your Spam or
                    Junk folder. It may take a few moments to arrive.
                  </p>
                </div>
              </div>
            </div>

            {/* Resend */}
            <div className="mt-7">
              <button
                type="button"
                onClick={handleResend}
                disabled={!registeredEmail || countdown > 0 || isResending}
                className={`
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-5
                  py-3.5
                  font-bold
                  transition-all

                  ${
                    !registeredEmail || countdown > 0 || isResending
                      ? "cursor-not-allowed border border-dark-200 bg-dark-50 text-dark-400"
                      : "bg-primary-500 text-white hover:bg-primary-600 hover:shadow-hover"
                  }
                `}
              >
                {isResending ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  <>
                    <RefreshCw size={18} />
                    Resend available in {countdown}s
                  </>
                ) : (
                  <>
                    <RefreshCw
                      size={18}
                      className="transition-transform group-hover:rotate-180"
                    />
                    Resend verification email
                  </>
                )}
              </button>
            </div>

            {/* Login */}
            <button
              type="button"
              onClick={handleLogin}
              className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-500 transition-colors hover:text-primary-600"
            >
              Proceed to login
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            {/* Back */}
            <div className="mt-8 border-t border-dark-100 pt-6">
              <Link
                to={ROUTES.REGISTER}
                className="inline-flex items-center gap-2 text-xs font-semibold text-dark-500 transition-colors hover:text-primary-500"
              >
                <ArrowLeft size={15} />
                Back to registration
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

export default ResendVerification;
