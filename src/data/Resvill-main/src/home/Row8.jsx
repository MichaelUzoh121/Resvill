import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Utensils,
  Sparkles,
  Truck,
} from "lucide-react";

function Row8() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-dark-950">
        <div className="relative isolate px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          {/* Background Decorations */}
          <div className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />

          <div className="absolute right-10 top-10 hidden h-20 w-20 rotate-12 rounded-2xl border border-white/10 lg:block" />

          <div className="absolute bottom-10 left-10 hidden h-12 w-12 -rotate-12 rounded-full border border-white/10 lg:block" />

          {/* Content */}
          <div className="relative mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 backdrop-blur-sm">
              <Sparkles size={14} className="text-accent-400" />
              <span>Good food is just a few clicks away</span>
            </div>

            {/* Heading */}
            <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your next favorite meal is{" "}
              <span className="text-primary-400">waiting for you.</span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Discover delicious meals, customize your order, and enjoy fresh
              food delivered right where you are.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all duration-300 hover:bg-primary-400 hover:shadow-primary-500/30 sm:w-auto"
              >
                Create Your Account

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/menu"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-white/10 sm:w-auto"
              >
                <Utensils size={17} />
                Explore Menu
              </Link>
            </div>
          </div>

          {/* Bottom Benefits */}
          <div className="relative mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-primary-400">
                <Utensils size={17} />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Freshly Prepared
                </p>
                <p className="mt-0.5 text-[11px] text-white/45">
                  Made with quality ingredients
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-primary-400">
                <Truck size={17} />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Fast Delivery
                </p>
                <p className="mt-0.5 text-[11px] text-white/45">
                  Delivered straight to you
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-primary-400">
                <Sparkles size={17} />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Easy Experience
                </p>
                <p className="mt-0.5 text-[11px] text-white/45">
                  Simple ordering from start to finish
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row8;

