import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Star,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

function Row1() {
  return (
    <section className="relative overflow-hidden bg-primary-50">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-primary-100/70 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-20">

        {/* ==================================================
            LEFT CONTENT
        ================================================== */}

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="max-w-2xl"
        >
          {/* Small Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-2 shadow-soft">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50">
              <Star
                size={13}
                className="fill-primary-500 text-primary-500"
              />
            </span>

            <span className="text-xs font-bold text-dark-700 sm:text-sm">
              Delicious meals, made for you
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-xl font-heading text-4xl font-bold leading-[1.08] tracking-tight text-dark-950 sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            Your favorite food,
            <span className="block text-primary-500">
              delivered fresh.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-7 text-dark-600 sm:text-lg sm:leading-8">
            Discover delicious meals from your favorite restaurants,
            order effortlessly, and enjoy fast, reliable delivery
            right to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {/* Primary CTA */}
            <Link
              to="/menu"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-bold text-white shadow-hover transition-all duration-300 hover:bg-primary-600 hover:shadow-lg"
            >
              Explore Menu

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Secondary CTA */}
            <Link
              to="/track-order"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-6 py-3.5 text-sm font-bold text-dark-800 transition-all duration-300 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
            >
              Track an Order
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-primary-500"
              />

              <span className="text-sm font-medium text-dark-600">
                Fresh meals
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-primary-500"
              />

              <span className="text-sm font-medium text-dark-600">
                Fast delivery
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-primary-500"
              />

              <span className="text-sm font-medium text-dark-600">
                Secure payment
              </span>
            </div>
          </div>
        </motion.div>

        {/* ==================================================
            RIGHT FOOD VISUAL
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
        >
          <div className="relative mx-auto aspect-square max-w-[500px]">

            {/* Outer Decorative Circle */}
            <div className="absolute inset-5 rounded-full bg-primary-200/60" />

            {/* Inner Decorative Circle */}
            <div className="absolute inset-10 rounded-full bg-primary-300/30" />

            {/* Food Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85"
                alt="Fresh healthy meal"
                className="h-[82%] w-[82%] rounded-full object-cover shadow-card"
              />
            </div>

            {/* Rating Card */}
            <div className="absolute left-0 top-16 flex items-center gap-3 rounded-2xl border border-dark-100 bg-white px-4 py-3 shadow-card sm:left-2 sm:px-5 sm:py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                <Star
                  size={19}
                  className="fill-primary-500 text-primary-500"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-dark-900">
                  4.9/5
                </p>

                <p className="text-xs text-dark-500">
                  Customer rating
                </p>
              </div>
            </div>

            {/* Delivery Card */}
            <div className="absolute bottom-12 right-0 flex items-center gap-3 rounded-2xl bg-dark-950 px-4 py-3 text-white shadow-card sm:right-2 sm:px-5 sm:py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-sm font-bold">
                  Fast delivery
                </p>

                <p className="text-xs text-dark-400">
                  Fresh to your door
                </p>
              </div>
            </div>

            {/* Play Button */}
            <button
              type="button"
              aria-label="Watch how Resvill works"
              className="absolute bottom-2 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-white text-primary-500 shadow-card transition-all duration-300 hover:scale-105 hover:shadow-hover"
            >
              <Play
                size={20}
                className="ml-0.5 fill-primary-500"
              />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Row1;

