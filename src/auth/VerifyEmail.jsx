import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  LoaderCircle,
  MailCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { verifyEmail } from "../services/authService";
import { getErrorMessage } from "../utils/errorHandler";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      //   if (!token) {
      //     setStatus("error");
      //     setErrorMessage(
      //       "This verification link is missing a verification token."
      //     );
      //     return;
      //   }

      if (!token) {
        navigate("/this-page-does-not-exist", { replace: true });
        return;
      }

      try {
        await verifyEmail(token);

        if (!isMounted) {
          return;
        }

        setStatus("success");

        toast.success("Email verified successfully.");

        setTimeout(() => {
          navigate("/auth/login", {
            replace: true,
          });
        }, 2500);
          } catch (error) {
            if (!isMounted) {
              return;
            }

            setStatus("error");
            setErrorMessage(getErrorMessage(error));
          }
    //   } catch (error) {
    //     if (!isMounted) {
    //       return;
    //     }

    //     if (error?.status === 404) {
    //       navigate("/this-page-does-not-exist", {
    //         replace: true,
    //       });

    //       return;
    //     }

    //     setStatus("error");
    //     setErrorMessage(getErrorMessage(error));
    //   }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-dark-50/60 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card lg:grid-cols-2">
        {/* Welcome panel */}
        <section className="relative hidden overflow-hidden bg-dark-950 p-10 text-white lg:flex lg:min-h-[600px] lg:flex-col lg:justify-between">
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
                Almost ready
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-tight xl:text-5xl">
                Verify your email and get started.
              </h1>

              <p className="mt-6 text-base leading-8 text-dark-300">
                Confirming your email helps keep your Resvill account secure and
                unlocks your full account experience.
              </p>
            </div>
          </div>
        </section>

        {/* Verification result */}
        <section className="relative p-6 sm:p-10 lg:p-14">
          <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-primary-50 blur-2xl" />

          <div className="relative flex min-h-[500px] items-center">
            <div className="w-full">
              {status === "loading" && (
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                    <LoaderCircle size={30} className="animate-spin" />
                  </div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-500">
                    Please wait
                  </p>

                  <h2 className="mt-3 font-heading text-3xl font-extrabold text-dark-950">
                    Verifying your email
                  </h2>

                  <p className="mx-auto mt-4 max-w-sm leading-7 text-dark-500">
                    We&apos;re confirming your email address. This will only
                    take a moment.
                  </p>
                </div>
              )}

              {status === "success" && (
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                    <BadgeCheck size={30} />
                  </div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-500">
                    Email verified
                  </p>

                  <h2 className="mt-3 font-heading text-3xl font-extrabold text-dark-950">
                    You&apos;re all set!
                  </h2>

                  <p className="mx-auto mt-4 max-w-sm leading-7 text-dark-500">
                    Your email has been verified successfully. Taking you to
                    login...
                  </p>

                  <Link
                    to="/auth/login"
                    className="group mx-auto mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover"
                  >
                    Continue to login
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              )}

              {status === "error" && (
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/5 text-danger">
                    <TriangleAlert size={30} />
                  </div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-danger">
                    Verification failed
                  </p>

                  <h2 className="mt-3 font-heading text-3xl font-extrabold text-dark-950">
                    We couldn&apos;t verify your email
                  </h2>

                  <div className="mx-auto mt-5 max-w-md rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm font-semibold leading-6 text-danger">
                    {errorMessage}
                  </div>

                  <p className="mx-auto mt-5 max-w-sm leading-7 text-dark-500">
                    The verification link may be invalid or expired. You can
                    request another verification email from your account.
                  </p>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      to="/auth/login"
                      className="inline-flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-5 py-3.5 font-bold text-dark-700 transition-colors hover:border-primary-200 hover:text-primary-500"
                    >
                      Back to login
                    </Link>

                    <Link
                      to="/auth/register"
                      className="group inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover"
                    >
                      Create account
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default VerifyEmail;
