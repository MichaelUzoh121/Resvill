import React from "react";

import FoodCard from "./FoodCard";
import { useRecommendations } from "../hooks/useRecommendations";

function RecommendedFoods({
  foodId,
  title = "You May Also Like",
  limit = 6,
}) {
  const {
    recommendations,
    isLoading,
    isError,
  } = useRecommendations({
    foodId,
    limit,
  });

  if (isError) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="mt-12">
        <div className="mb-5 h-7 w-52 animate-pulse rounded bg-dark-100" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-2xl bg-dark-100"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2 className="font-heading text-xl font-extrabold text-dark-950 sm:text-2xl">
          {title}
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((food) => (
          <FoodCard
            key={food.id || food._id}
            food={food}
          />
        ))}
      </div>
    </section>
  );
}

export default RecommendedFoods;