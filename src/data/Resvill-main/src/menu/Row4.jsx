import React from "react";
import FoodCard from "../food/FoodCard";
import foods from "../data/foods";

function Row4({ onAddToCart }) {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-500">
              Our Menu
            </p>

            <h2 className="mt-1 font-heading text-2xl font-bold text-dark-950 sm:text-3xl">
              Explore Our Food
            </h2>
          </div>

          <p className="text-sm text-dark-500">
            {foods.length} items
          </p>
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Row4;

