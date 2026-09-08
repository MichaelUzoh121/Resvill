import React from "react";
import { HeartHandshake, ShieldCheck, Timer, Sparkles, ArrowUpRight } from "lucide-react";

const values = [
  {
    icon: HeartHandshake,
    number: "01",
    title: "Made With Care",
    description:
      "Every order is prepared like it's for someone we know, because to us, it is.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Quality First",
    description:
      "We hold every dish to the same standard, every single time it leaves our kitchen.",
  },
  {
    icon: Timer,
    number: "03",
    title: "Always On Time",
    description:
      "Whether it's a delivery or a reservation, we respect your schedule.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Always Improving",
    description:
      "We listen to feedback and keep refining our menu and service.",
  },
];

function Row3() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">
            What Drives Us
          </span>

          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-dark-950 sm:text-4xl">
            The values behind every plate
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="group relative overflow-hidden rounded-3xl border border-dark-100 bg-dark-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:bg-white hover:shadow-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <span className="font-heading text-sm font-extrabold text-dark-200 transition-colors group-hover:text-primary-200">
                    {value.number}
                  </span>
                </div>

                <h3 className="mt-7 font-heading text-lg font-bold text-dark-950">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-dark-500">
                  {value.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary-500 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  Learn more
                  <ArrowUpRight size={14} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Row3;
