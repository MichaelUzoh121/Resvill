import React, { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import FoodFilters from "../food/FoodFilters";
import FoodSort from "../food/FoodSort";

function Row3() {
  const [showFilters, setShowFilters] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPreparationTime, setSelectedPreparationTime] =
    useState("all");
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);

  const [sort, setSort] = useState("popular");

  const clearFilters = () => {
    setSelectedPrice("all");
    setSelectedRating("all");
    setSelectedPreparationTime("all");
    setSelectedDietary([]);
    setAvailableOnly(false);
  };

  const activeFilterCount =
    (selectedPrice !== "all" ? 1 : 0) +
    (selectedRating !== "all" ? 1 : 0) +
    (selectedPreparationTime !== "all" ? 1 : 0) +
    selectedDietary.length +
    (availableOnly ? 1 : 0);

  return (
    <section className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Filter Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-dark-100 bg-white p-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-all ${
                showFilters || activeFilterCount > 0
                  ? "bg-primary-500 text-white"
                  : "bg-dark-50 text-dark-700 hover:bg-primary-50 hover:text-primary-500"
              }`}
            >
              <SlidersHorizontal size={17} />

              <span>Filters</span>

              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-primary-500">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="hidden items-center gap-1 text-xs font-semibold text-dark-500 transition-colors hover:text-primary-500 sm:flex"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>

          {/* Results + Sort */}
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <p className="text-sm font-medium text-dark-500">
              <span className="font-bold text-dark-900">10</span> dishes
            </p>

            <FoodSort
              value={sort}
              onChange={setSort}
            />
          </div>
        </div>

        {/* Mobile Clear */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-dark-500 hover:text-primary-500 sm:hidden"
          >
            <X size={14} />
            Clear filters
          </button>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="relative mt-4">
            <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
              {/* Panel Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-dark-950">
                    Filter your choices
                  </h3>

                  <p className="mt-1 text-sm text-dark-500">
                    Narrow down the menu to find exactly what you want.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-50 text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary-500"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Price */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-dark-500">
                    Price
                  </p>

                  <div className="space-y-2.5">
                    {[
                      {
                        value: "all",
                        label: "All prices",
                      },
                      {
                        value: "under-3000",
                        label: "Under ₦3,000",
                      },
                      {
                        value: "3000-5000",
                        label: "₦3,000 - ₦5,000",
                      },
                      {
                        value: "above-5000",
                        label: "Above ₦5,000",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 text-sm text-dark-600"
                      >
                        <input
                          type="radio"
                          name="price"
                          value={option.value}
                          checked={selectedPrice === option.value}
                          onChange={(event) =>
                            setSelectedPrice(event.target.value)
                          }
                          className="h-4 w-4 accent-primary-500"
                        />

                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-dark-500">
                    Rating
                  </p>

                  <div className="space-y-2.5">
                    {[
                      {
                        value: "all",
                        label: "All ratings",
                      },
                      {
                        value: "4.5",
                        label: "4.5+ stars",
                      },
                      {
                        value: "4.0",
                        label: "4.0+ stars",
                      },
                      {
                        value: "3.5",
                        label: "3.5+ stars",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 text-sm text-dark-600"
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={option.value}
                          checked={selectedRating === option.value}
                          onChange={(event) =>
                            setSelectedRating(event.target.value)
                          }
                          className="h-4 w-4 accent-primary-500"
                        />

                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preparation Time */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-dark-500">
                    Preparation Time
                  </p>

                  <div className="space-y-2.5">
                    {[
                      {
                        value: "all",
                        label: "Any time",
                      },
                      {
                        value: "under-15",
                        label: "Under 15 min",
                      },
                      {
                        value: "15-30",
                        label: "15 - 30 min",
                      },
                      {
                        value: "above-30",
                        label: "30+ min",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 text-sm text-dark-600"
                      >
                        <input
                          type="radio"
                          name="preparation"
                          value={option.value}
                          checked={
                            selectedPreparationTime === option.value
                          }
                          onChange={(event) =>
                            setSelectedPreparationTime(
                              event.target.value
                            )
                          }
                          className="h-4 w-4 accent-primary-500"
                        />

                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dietary + Availability */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-dark-500">
                    Dietary Options
                  </p>

                  <div className="space-y-2.5">
                    {[
                      "Vegetarian",
                      "Vegan",
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer items-center gap-3 text-sm text-dark-600"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDietary.includes(option)}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectedDietary((prev) => [
                                ...prev,
                                option,
                              ]);
                            } else {
                              setSelectedDietary((prev) =>
                                prev.filter(
                                  (item) => item !== option
                                )
                              );
                            }
                          }}
                          className="h-4 w-4 rounded accent-primary-500"
                        />

                        {option}
                      </label>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-dark-100 pt-4">
                    <label className="flex cursor-pointer items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-dark-700">
                        Available only
                      </span>

                      <input
                        type="checkbox"
                        checked={availableOnly}
                        onChange={(event) =>
                          setAvailableOnly(event.target.checked)
                        }
                        className="h-4 w-4 rounded accent-primary-500"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Apply */}
              <div className="mt-8 flex justify-end border-t border-dark-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Row3;

