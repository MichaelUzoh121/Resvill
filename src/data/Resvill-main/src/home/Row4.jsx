import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import FoodGrid from "../food/FoodGrid";
import foods from "../data/foods";

function Row4() {
  const bestSellers = foods.filter((food) => food.bestSeller).slice(0, 4);

  return (
    <section className="bg-dark-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
              Customer favorites
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-dark-900 sm:text-4xl lg:text-5xl">
              Our <span className="text-primary-500">best sellers</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-dark-600 sm:text-base">
              The meals our customers keep coming back for. Fresh, delicious,
              and made to satisfy every craving.
            </p>
          </div>

          <Link
            to="/menu"
            className="hidden shrink-0 items-center gap-2 text-sm font-bold text-dark-900 transition-colors hover:text-primary-500 sm:flex"
          >
            View full menu
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Best Seller Foods */}
        <FoodGrid foods={bestSellers} />

        {/* Mobile View All */}
        <Link
          to="/menu"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-dark-900 sm:hidden"
        >
          View full menu
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export default Row4;

