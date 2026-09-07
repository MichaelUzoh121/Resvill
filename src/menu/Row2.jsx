import React, { useState } from "react";
import { Utensils } from "lucide-react";
import { categories } from "../data/categories";

function Row2() {
  const [activeCategory, setActiveCategory] = useState("All");

  const allCategories = [
    {
      id: "all",
      name: "All",
      description: "Everything we serve",
      image: null,
    },
    ...categories,
  ];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary-500">
              Browse by category
            </p>

            <h2 className="text-2xl font-bold text-dark-950 sm:text-3xl">
              What are you craving?
            </h2>
          </div>

          <p className="hidden max-w-sm text-right text-sm leading-6 text-dark-500 md:block">
            Find your favorite meals by exploring our food categories.
          </p>
        </div>

        {/* Categories */}
        <div className="overflow-x-auto pb-3 scrollbar-none">
          <div className="flex min-w-max gap-4">
            {allCategories.map((category) => {
              const isActive = activeCategory === category.name;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.name)}
                  className={`group flex w-[150px] flex-col overflow-hidden rounded-2xl border bg-white text-left transition-all duration-300 ${
                    isActive
                      ? "border-primary-500 shadow-card"
                      : "border-dark-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-28 w-full overflow-hidden bg-primary-50">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Utensils
                          size={32}
                          strokeWidth={1.8}
                          className="text-primary-500"
                        />
                      </div>
                    )}

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white shadow-md">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3.5">
                    <h3
                      className={`text-sm font-bold ${
                        isActive
                          ? "text-primary-600"
                          : "text-dark-900"
                      }`}
                    >
                      {category.name}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs text-dark-500">
                      {category.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row2;

