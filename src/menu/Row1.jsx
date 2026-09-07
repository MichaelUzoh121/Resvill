import React from "react";
import { Search, ArrowRight } from "lucide-react";

function Row1() {
  return (
    <section className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary-50 px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary-100" />

          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-primary-100/70" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
            {/* Content */}
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary-500" />

                <span className="text-sm font-semibold text-dark-700">
                  Our Menu
                </span>
              </div>

              <h1 className="max-w-xl text-4xl font-bold leading-[1.08] text-dark-950 sm:text-5xl lg:text-6xl">
                Good food, made for{" "}
                <span className="text-primary-500">every craving.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-dark-600 sm:text-lg">
                From hearty meals to quick bites and refreshing drinks,
                discover something delicious to satisfy your craving.
              </p>

              {/* Search */}
              <div className="mt-8 flex w-full max-w-xl items-center rounded-2xl border border-dark-200 bg-white p-2 shadow-soft transition-all focus-within:border-primary-300 focus-within:shadow-card">
                <Search
                  size={21}
                  strokeWidth={2}
                  className="ml-3 shrink-0 text-dark-500"
                />

                <input
                  type="text"
                  placeholder="What are you craving today?"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-dark-900 outline-none placeholder:text-dark-500 sm:text-base"
                />

                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white transition-all hover:bg-primary-600 active:scale-95"
                  aria-label="Search"
                >
                  <ArrowRight size={19} />
                </button>
              </div>
            </div>

            {/* Food Visual */}
            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
                  alt="Delicious meal"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating Badge */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                  <div>
                    <p className="text-xs font-medium text-dark-500">
                      Today's recommendation
                    </p>

                    <p className="mt-1 font-heading text-sm font-bold text-dark-900">
                      Fresh & Delicious
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>

              {/* Floating Accent */}
              {/* <div className="absolute -bottom-4 -right-4 hidden h-20 w-20 rounded-2xl bg-accent-400 sm:block" /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row1;

