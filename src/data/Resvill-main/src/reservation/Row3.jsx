import React from "react";
import {
  CalendarCheck,
  Clock3,
  Users,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const benefits = [
  {
    icon: CalendarCheck,
    number: "01",
    title: "Plan Ahead",
    description:
      "Let us know what you're planning and when you'll need your food, so everything can be arranged ahead of time.",
  },
  {
    icon: Clock3,
    number: "02",
    title: "Save Time",
    description:
      "Avoid last-minute food arrangements. Plan your order early and have one less thing to worry about on the day.",
  },
  {
    icon: Users,
    number: "03",
    title: "Feed Everyone",
    description:
      "From small gatherings to larger events, organize food for your guests without the stress of ordering individually.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Make It Special",
    description:
      "Birthdays, meetings, celebrations or family moments — make the occasion better with food everyone can enjoy.",
  },
];

function Row3() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary-500" />

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-500">
              Why Reserve?
            </span>
          </div>

          <h2 className="mt-5 max-w-2xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-dark-950 sm:text-4xl lg:text-5xl">
            When the occasion matters,
            <span className="text-primary-500">
              {" "}
              plan the food too.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-dark-500 sm:text-base">
            Your event deserves more than a last-minute food order.
            Resvill helps you organize your food ahead of time so you
            can focus on the people, moments, and memories that matter.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="group relative overflow-hidden rounded-3xl border border-dark-100 bg-dark-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:bg-white hover:shadow-card"
              >
                {/* Number */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <span className="font-heading text-sm font-extrabold text-dark-200 transition-colors group-hover:text-primary-200">
                    {benefit.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-7 font-heading text-lg font-bold text-dark-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-dark-500">
                  {benefit.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary-500 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  Plan with Resvill
                  <ArrowUpRight size={14} />
                </div>

                {/* Decorative glow */}
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-primary-500/5 blur-2xl transition-all duration-300 group-hover:bg-primary-500/10" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Row3;

