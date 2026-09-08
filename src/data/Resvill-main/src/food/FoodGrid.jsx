import React from "react";
import FoodCard from "./FoodCard";

function FoodGrid({
  foods = [],
  onAddToCart,
  columns = "default",
}) {
  if (!foods.length) {
    return (
      <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-dark-200 bg-dark-50">
        <p className="text-sm font-medium text-dark-500">
          No food available at the moment.
        </p>
      </div>
    );
  }

  const columnClasses = {
    default:
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    three:
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    two:
      "grid-cols-1 sm:grid-cols-2",
  };

  return (
    <div
      className={`grid gap-5 sm:gap-6 ${
        columnClasses[columns] || columnClasses.default
      }`}
    >
      {foods.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default FoodGrid;

