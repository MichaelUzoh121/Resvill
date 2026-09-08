import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const stats = [
  { value: "5+", label: "Years serving great food" },
  { value: "50K+", label: "Meals delivered" },
  { value: "120+", label: "Dishes on the menu" },
  { value: "4.9", label: "Average customer rating" },
];

function Row4() {
  return (
    <section className="bg-dark-950 px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center"
            >
              <p className="font-heading text-3xl font-extrabold text-primary-500 sm:text-4xl">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-dark-300">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl bg-primary-500 px-6 py-10 text-center sm:flex-row sm:px-10 sm:text-left">
          <div>
            <h3 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
              Ready to taste it for yourself?
            </h3>

            <p className="mt-2 text-sm text-white/85">
              Browse the menu or reserve a table for your next visit.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary-500 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Explore Menu
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Row4;
