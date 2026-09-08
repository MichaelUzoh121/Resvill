import React from "react";
import { ChefHat, Leaf, Clock3 } from "lucide-react";

function Row2() {
  return (
    <section className="bg-dark-50 px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-[2rem] shadow-card">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85"
                alt="Resvill dining space"
                className="aspect-[4/3.4] w-full object-cover"
              />
            </div>

            <div className="pointer-events-none absolute -bottom-6 -left-6 -z-10 h-32 w-32 rounded-3xl bg-primary-500/10" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary-500" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-500">
                Our Story
              </span>
            </div>

            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight tracking-tight text-dark-950 sm:text-4xl">
              From one small kitchen to a name people trust.
            </h2>

            <p className="mt-5 text-sm leading-7 text-dark-500 sm:text-base">
              Resvill began as a single kitchen with a big goal:
              serve honest, delicious food without cutting corners.
              Today, we've grown into a full menu of favorites, group
              ordering, and advance reservations — but the goal
              hasn't changed.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                  <ChefHat size={20} />
                </div>

                <div>
                  <p className="font-heading text-sm font-bold text-dark-950">
                    Made by real chefs
                  </p>

                  <p className="mt-1 text-sm leading-6 text-dark-500">
                    Every dish is prepared fresh, never rushed.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                  <Leaf size={20} />
                </div>

                <div>
                  <p className="font-heading text-sm font-bold text-dark-950">
                    Quality ingredients
                  </p>

                  <p className="mt-1 text-sm leading-6 text-dark-500">
                    Sourced with care, cooked with pride.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                  <Clock3 size={20} />
                </div>

                <div>
                  <p className="font-heading text-sm font-bold text-dark-950">
                    Fast, reliable service
                  </p>

                  <p className="mt-1 text-sm leading-6 text-dark-500">
                    From order to table, we respect your time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row2;
