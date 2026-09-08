import React from "react";
import { Sparkles, Utensils, Users } from "lucide-react";

function Row1() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2">
              <Sparkles size={15} className="text-primary-500" />

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
                About Resvill
              </span>
            </div>

            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-dark-950 sm:text-5xl lg:text-6xl">
              Food made with
              <span className="block text-primary-500">
                heart and hustle.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-dark-500 sm:text-lg sm:leading-8">
              Resvill started with a simple idea: everyone deserves a
              great meal without the wait. From our kitchen to your
              table, we combine bold flavors with a smooth ordering
              experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-dark-100 bg-white px-4 py-3 shadow-sm">
                <Utensils size={17} className="text-primary-500" />

                <span className="text-sm font-semibold text-dark-700">
                  Fresh, daily-made meals
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-dark-100 bg-white px-4 py-3 shadow-sm">
                <Users size={17} className="text-primary-500" />

                <span className="text-sm font-semibold text-dark-700">
                  A team that cares
                </span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-dark-100 shadow-2xl">
              <div className="aspect-[4/4.2] overflow-hidden sm:aspect-[4/3.8]">
                <img
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85"
                  alt="Resvill restaurant kitchen team at work"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-dark-400">
                      Since
                    </p>

                    <p className="mt-1 font-heading text-base font-bold text-dark-950 sm:text-lg">
                      2019
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                    <Sparkles size={20} className="text-primary-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-5 -right-5 -z-10 h-28 w-28 rounded-[2rem] bg-primary-500/15" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row1;
