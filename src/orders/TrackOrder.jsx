import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function TrackOrder() {
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");
  const [token, setToken] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const submit = (event) => {
    event.preventDefault();

    const cleanId = orderId.trim().toUpperCase();
    const cleanToken = token.trim();

    if (!cleanId || !cleanToken) {
      toast.error(
        "Please enter both your order number and tracking token.",
      );
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      navigate(
        `/track/${encodeURIComponent(
          cleanId,
        )}?token=${encodeURIComponent(cleanToken)}`,
      );
    }, 450);
  };

  const steps = [
    {
      icon: Search,
      title: "Order confirmed",
      text: "We received your order.",
    },
    {
      icon: Utensils,
      title: "Preparing your food",
      text: "Our kitchen is working on it.",
    },
    {
      icon: MapPin,
      title: "On the way",
      text: "Your meal is coming to you.",
    },
  ];

  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-dark-50/70 px-4 py-10 sm:px-6 sm:py-16">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
            }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-500 text-white shadow-hover"
          >
            <Search size={35} strokeWidth={2.2} />
          </motion.div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
            <Sparkles size={14} />
            Order tracking
          </div>

          <h1 className="mt-5 font-heading text-3xl font-extrabold text-dark-950 sm:text-5xl">
            Where is your order?
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-dark-500 sm:text-base">
            Follow your meal from our kitchen to your table. Enter the
            details from your order confirmation to see the latest update.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl bg-dark-950 p-7 text-white shadow-card sm:p-9"
          >
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary-500/25 blur-3xl" />

            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500">
                <Utensils size={23} />
              </div>

              <h2 className="mt-8 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
                From our kitchen to your door.
              </h2>

              <p className="mt-4 text-sm leading-7 text-dark-300">
                We prepare every order with care. Follow each step of the
                journey using your secure tracking details.
              </p>

              <div className="mt-8 space-y-5">
                {steps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.45 + index * 0.15,
                      }}
                      className="flex items-center gap-4"
                    >
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-primary-300">
                        <Icon size={18} />

                        {index < steps.length - 1 && (
                          <span className="absolute left-1/2 top-10 h-5 w-px bg-white/20" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          {step.title}
                        </p>

                        <p className="mt-1 text-xs text-dark-400">
                          {step.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="rounded-3xl border border-dark-100 bg-white p-6 shadow-card sm:p-9"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-500">
                  Find your order
                </p>

                <h2 className="mt-2 font-heading text-2xl font-extrabold text-dark-950">
                  Enter tracking details
                </h2>
              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 sm:flex">
                <MapPin size={23} />
              </div>
            </div>

            <form onSubmit={submit} className="mt-8">
              <label className="block text-sm font-bold text-dark-700">
                Order number

                <div className="relative mt-2">
                  <Search
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    required
                    value={orderId}
                    onChange={(event) =>
                      setOrderId(event.target.value)
                    }
                    placeholder="Example: RV-20481"
                    className="w-full rounded-xl border border-dark-200 bg-dark-50/40 py-3.5 pl-12 pr-4 uppercase outline-none transition-all placeholder:normal-case placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </label>

              <label className="mt-5 block text-sm font-bold text-dark-700">
                Secure tracking token

                <div className="relative mt-2">
                  <KeyRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    required
                    value={token}
                    onChange={(event) =>
                      setToken(event.target.value)
                    }
                    placeholder="Paste your private token"
                    className="w-full rounded-xl border border-dark-200 bg-dark-50/40 py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </label>

              <motion.button
                type="submit"
                disabled={isSearching}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-4 font-bold text-white shadow-soft hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSearching
                  ? "Finding your order..."
                  : "Track my order"}

                {!isSearching && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </motion.button>
            </form>

            <div className="mt-7 flex gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-4 text-sm leading-6 text-primary-800">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-primary-500"
              />

              <p>
                Your tracking token is private. It prevents anyone from
                viewing your order by guessing the order number.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-dark-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              Secure tracking is active
            </div>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-5 py-3 text-sm font-bold text-dark-700 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-500"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-xl bg-dark-950 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-dark-800"
          >
            <Utensils size={17} />
            Browse Menu
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default TrackOrder;

