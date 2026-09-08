import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import FoodGrid from "../food/FoodGrid";
import foods from "../data/foods";

function Row2() {
  const popularFoods = foods.filter(
    (food) => food.popular
  );

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-wider text-primary-500">
              Popular Today
            </span>

            <h2 className="font-heading text-3xl font-bold tracking-tight text-dark-950 sm:text-4xl">
              What people are ordering
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-dark-600 sm:text-base">
              Discover the meals our customers are loving today.
            </p>
          </div>

          <Link
            to="/menu"
            className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-primary-500 transition-colors hover:text-primary-600"
          >
            View full menu

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Food Grid */}
        <FoodGrid foods={popularFoods} />
      </div>
    </section>
  );
}

export default Row2;

