import React from "react";

import FoodCard from "../food/FoodCard";
import { useRecommendations } from "../hooks/useRecommendations";

function Recommendations() {
  const {
    recommendations,
    isLoading,
    isError,
  } = useRecommendations({
    limit: 30,
  });

  if (isLoading) {
    return (
      <main className="bg-dark-50/50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-64 animate-pulse rounded bg-dark-100" />
            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-dark-100" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-dark-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-extrabold text-dark-950">
          Recommendations unavailable
        </h1>

        <p className="mt-2 text-sm text-dark-500">
          We couldn't load your recommendations right now.
        </p>
      </main>
    );
  }

  return (
    <main className="bg-dark-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-extrabold text-dark-950 sm:text-3xl">
            Recommended For You
          </h1>

          <p className="mt-2 text-sm leading-6 text-dark-500">
            Discover food recommendations based on your activity
            and available menu options.
          </p>
        </div>

        {!recommendations.length ? (
          <div className="rounded-2xl border border-dark-100 bg-white p-10 text-center">
            <h2 className="font-heading text-lg font-extrabold text-dark-950">
              No recommendations yet
            </h2>

            <p className="mt-2 text-sm text-dark-500">
              Explore the menu and place orders to help us
              personalize your recommendations.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendations.map((food) => (
              <FoodCard
                key={food.id || food._id}
                food={food}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Recommendations;

