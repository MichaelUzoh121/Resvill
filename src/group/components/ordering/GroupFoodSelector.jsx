import React, { useMemo, useState } from "react";
import {
  ChevronRight,
  Plus,
  Search,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";

import { useFoods } from "../../../hooks/useFoods";
import { useCategories } from "../../../hooks/useCategories";

import { useGroupOrderContext } from "../../../context/GroupOrderContext";

import GroupFoodCustomizer from "./GroupFoodCustomizer";

function GroupFoodSelector() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFood, setSelectedFood] = useState(null);

  const { canAddItems } = useGroupOrderContext();

  const {
    data: foodsData,
    isLoading: foodsLoading,
    isError: foodsError,
  } = useFoods();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useCategories();

  const foods = Array.isArray(foodsData?.data?.foods)
    ? foodsData.data.foods
    : Array.isArray(foodsData?.foods)
      ? foodsData.foods
      : [];

  const categories = Array.isArray(
    categoriesData?.data?.categories,
  )
    ? categoriesData.data.categories
    : Array.isArray(categoriesData?.categories)
      ? categoriesData.categories
      : [];

  const filteredFoods = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return foods.filter((food) => {
      const name = food?.name?.toLowerCase() || "";
      const description =
        food?.description?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        description.includes(normalizedSearch);

      if (selectedCategory === "all") {
        return matchesSearch;
      }

      const categoryId =
        food?.category?._id ||
        food?.category?.id ||
        food?.category;

      return (
        matchesSearch &&
        categoryId?.toString() ===
          selectedCategory.toString()
      );
    });
  }, [foods, search, selectedCategory]);

  const handleSelectFood = (food) => {
    if (!canAddItems) {
      return;
    }

    setSelectedFood(food);
  };

  const handleCloseCustomizer = () => {
    setSelectedFood(null);
  };

  const isLoading =
    foodsLoading || categoriesLoading;

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-accent-400/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                <UtensilsCrossed
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-xl font-bold text-dark-900 sm:text-2xl">
                    Choose your food
                  </h2>

                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-500">
                    {filteredFoods.length}{" "}
                    {filteredFoods.length === 1
                      ? "item"
                      : "items"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-dark-600">
                  Select an item to customize and add to
                  your group order.
                </p>
              </div>
            </div>

            {!canAddItems && (
              <div className="rounded-xl border border-accent-400/30 bg-accent-400/10 px-3 py-2 text-xs font-semibold text-dark-700">
                Adding items is currently locked.
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search food..."
                className="h-12 w-full rounded-2xl border border-dark-200 bg-dark-50/50 pl-11 pr-4 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </div>

          {categories.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory("all")
                  }
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                    selectedCategory === "all"
                      ? "bg-primary-500 text-white shadow-soft"
                      : "bg-dark-50 text-dark-600 hover:bg-primary-50 hover:text-primary-500"
                  }`}
                >
                  All
                </button>

                {categories.map((category) => {
                  const categoryId =
                    category?._id || category?.id;

                  const isSelected =
                    selectedCategory === categoryId;

                  return (
                    <button
                      key={categoryId}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(categoryId)
                      }
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                        isSelected
                          ? "bg-primary-500 text-white shadow-soft"
                          : "bg-dark-50 text-dark-600 hover:bg-primary-50 hover:text-primary-500"
                      }`}
                    >
                      {category?.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-dark-100"
                >
                  <div className="h-44 animate-pulse bg-dark-100" />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-dark-100" />
                    <div className="h-3 w-full animate-pulse rounded bg-dark-100" />
                    <div className="h-10 w-full animate-pulse rounded-xl bg-dark-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : foodsError ? (
            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                <ShoppingBag size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-dark-800">
                  Unable to load food items
                </p>

                <p className="mt-1 text-xs text-dark-500">
                  Please try again in a moment.
                </p>
              </div>
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-dashed border-dark-200 bg-dark-50/50 px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-400">
                <ShoppingBag size={25} />
              </div>

              <h3 className="mt-4 font-heading text-base font-bold text-dark-800">
                No food found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-dark-500">
                Try another search or choose a different
                category.
              </p>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFoods.map((food) => {
                const foodId =
                  food?._id || food?.id;

                const image =
                  food?.image ||
                  food?.imageUrl ||
                  food?.images?.[0] ||
                  "";

                const price =
                  Number(food?.price) || 0;

                return (
                  <article
                    key={foodId}
                    className="group overflow-hidden rounded-2xl border border-dark-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card"
                  >
                    <div className="relative overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={food?.name || "Food"}
                          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-44 items-center justify-center bg-dark-50 text-dark-400">
                          <ShoppingBag size={30} />
                        </div>
                      )}

                      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary-500 shadow-soft backdrop-blur">
                        ₦
                        {price.toLocaleString("en-NG")}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-heading text-base font-bold text-dark-900">
                        {food?.name}
                      </h3>

                      {food?.description && (
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-dark-500">
                          {food.description}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleSelectFood(food)
                        }
                        disabled={!canAddItems}
                        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus size={17} />
                        Add to order
                        <ChevronRight
                          size={16}
                          className="ml-auto"
                        />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <GroupFoodCustomizer
        food={selectedFood}
        open={Boolean(selectedFood)}
        onClose={handleCloseCustomizer}
      />
    </>
  );
}

export default GroupFoodSelector;