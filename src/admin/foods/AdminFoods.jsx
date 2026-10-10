import { useState } from "react";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageOff,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  useAdminFoods,
  useDeleteAdminFood,
  useUpdateAdminFoodAvailability,
  useUpdateAdminFoodFeatured,
  useUpdateAdminFoodPopular,
} from "../hooks/useAdminFoods";

import { useAdminCategories } from "../hooks/useAdminCategories";

const formatNumber = (value = 0) =>
  Number(value || 0).toLocaleString("en-NG");

const formatPrice = (value = 0) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

function AdminFoods() {
  const deleteFood = useDeleteAdminFood();
  const updateAvailability = useUpdateAdminFoodAvailability();
  const updateFeatured = useUpdateAdminFoodFeatured();
  const updatePopular = useUpdateAdminFoodPopular();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: "newest",
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useAdminCategories();

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : Array.isArray(categoriesData?.categories)
      ? categoriesData.categories
      : [];

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminFoods({
    search: search.trim() || undefined,
    category: filters.category || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    rating: filters.rating || undefined,
    sort: filters.sort || undefined,
    page,
    limit: 20,
  });

  const foods = Array.isArray(data?.foods) ? data.foods : [];
  const pagination = data?.pagination || {};

  const totalFoods = Number(pagination.total || 0);
  const totalPages = Number(pagination.pages || 0);

  const activeFilterCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
  ].filter(Boolean).length;

  const hasActiveFilters =
    search.trim() ||
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.rating ||
    filters.sort !== "newest";

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));

    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      sort: "newest",
    });

    setSearch("");
    setPage(1);
  };

  const handleDeleteFood = async (food) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${food.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(food._id);

    try {
      await deleteFood.mutateAsync(food._id);

      toast.success("Food deleted successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete food.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleAvailabilityToggle = async (food) => {
    setUpdatingId(food._id);

    try {
      await updateAvailability.mutateAsync({
        foodId: food._id,
        available: !food.available,
      });

      toast.success(
        `Food marked as ${
          !food.available ? "available" : "unavailable"
        }.`,
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update availability.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFeaturedToggle = async (food) => {
    setUpdatingId(food._id);

    try {
      await updateFeatured.mutateAsync({
        foodId: food._id,
        featured: !food.featured,
      });

      toast.success(
        `Food ${
          !food.featured ? "added to" : "removed from"
        } featured.`,
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update featured status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePopularToggle = async (food) => {
    setUpdatingId(food._id);

    try {
      await updatePopular.mutateAsync({
        foodId: food._id,
        popular: !food.popular,
      });

      toast.success(
        `Food ${
          !food.popular ? "marked as popular" : "removed from popular"
        }.`,
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update popular status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-7">
        <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white px-6 py-7 shadow-soft sm:px-8">
          <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary-50 blur-3xl" />

          <div className="relative">
            <div className="h-6 w-40 animate-pulse rounded-lg bg-dark-100" />
            <div className="mt-3 h-3 w-72 animate-pulse rounded bg-dark-100" />
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card">
          <div className="border-b border-dark-100 px-6 py-5">
            <div className="h-5 w-36 animate-pulse rounded bg-dark-100" />
            <div className="mt-2 h-3 w-52 animate-pulse rounded bg-dark-100" />
          </div>

          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-dark-100 p-4"
              >
                <div className="h-12 w-12 animate-pulse rounded-xl bg-dark-100" />

                <div className="flex-1">
                  <div className="h-4 w-40 animate-pulse rounded bg-dark-100" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded bg-dark-100" />
                </div>

                <div className="hidden h-8 w-20 animate-pulse rounded-lg bg-dark-100 sm:block" />
              </div>
            ))}
          </div>

          <div className="flex min-h-[120px] items-center justify-center border-t border-dark-100">
            <div className="flex items-center gap-3 text-sm font-medium text-dark-500">
              <Loader2
                size={20}
                className="animate-spin text-primary-500"
              />
              Loading food catalogue...
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-7">
        <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white px-6 py-7 shadow-soft sm:px-8">
          <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary-50 blur-3xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-500">
              <UtensilsCrossed size={13} />
              Food Management
            </div>

            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark-900 sm:text-3xl">
              Foods
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
              Manage and monitor the food catalogue available on Resvill.
            </p>
          </div>
        </section>

        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-danger/10 bg-white px-6 text-center shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertCircle size={27} />
          </div>

          <h2 className="mt-4 font-heading text-base font-bold text-dark-900">
            Unable to load foods
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-dark-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while loading the food catalogue."}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* PAGE HEADER */}
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white px-6 py-7 shadow-soft sm:px-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-50 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary-50/60 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-500">
              <UtensilsCrossed size={13} />
              Food Management
            </div>

            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark-900 sm:text-3xl">
              Foods
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
              Manage the food catalogue, pricing, availability and
              organisation across Resvill.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-2xl border border-dark-100 bg-dark-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-500 shadow-sm">
                <Package size={18} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-dark-400">
                  Total Foods
                </p>

                <p className="font-heading text-lg font-extrabold text-dark-900">
                  {formatNumber(totalFoods)}
                </p>
              </div>
            </div>

            <Link
              to="/admin/foods/new"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-600 hover:shadow-hover"
            >
              <Plus size={17} />
              Add Food
            </Link>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="rounded-3xl border border-dark-100 bg-white shadow-soft">
        <div className="border-b border-dark-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <SlidersHorizontal size={18} />
              </div>

              <div>
                <h2 className="font-heading text-sm font-bold text-dark-900">
                  Find foods
                </h2>

                <p className="mt-0.5 text-xs text-dark-500">
                  Search and filter the catalogue.
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-dark-500 transition hover:bg-dark-50 hover:text-dark-900"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by food name..."
              className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50/40 pl-11 pr-4 text-sm font-medium text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={filters.category}
              onChange={(event) =>
                handleFilterChange("category", event.target.value)
              }
              disabled={categoriesLoading}
              className="h-11 rounded-xl border border-dark-200 bg-white px-3 text-sm font-medium text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50 disabled:text-dark-400"
            >
              <option value="">
                {categoriesLoading
                  ? "Loading categories..."
                  : "All categories"}
              </option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              placeholder="Minimum price"
              value={filters.minPrice}
              onChange={(event) =>
                handleFilterChange("minPrice", event.target.value)
              }
              className="h-11 rounded-xl border border-dark-200 bg-white px-3 text-sm font-medium text-dark-700 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            />

            <input
              type="number"
              min="0"
              placeholder="Maximum price"
              value={filters.maxPrice}
              onChange={(event) =>
                handleFilterChange("maxPrice", event.target.value)
              }
              className="h-11 rounded-xl border border-dark-200 bg-white px-3 text-sm font-medium text-dark-700 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            />

            <select
              value={filters.sort}
              onChange={(event) =>
                handleFilterChange("sort", event.target.value)
              }
              className="h-11 rounded-xl border border-dark-200 bg-white px-3 text-sm font-medium text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Popular</option>
              <option value="featured">Featured</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-wide text-dark-400">
              Rating
            </span>

            {[5, 4, 3, 2, 1].map((rating) => {
              const selected = filters.rating === String(rating);

              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    handleFilterChange(
                      "rating",
                      selected ? "" : String(rating),
                    )
                  }
                  className={[
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition",
                    selected
                      ? "border-primary-200 bg-primary-50 text-primary-600"
                      : "border-dark-200 bg-white text-dark-600 hover:border-dark-300 hover:bg-dark-50",
                  ].join(" ")}
                >
                  <Star
                    size={13}
                    className={selected ? "fill-current" : ""}
                  />
                  {rating}+
                </button>
              );
            })}
          </div>

          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-dark-400">
                Active filters:
              </span>

              {filters.category && (
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-600">
                  Category
                </span>
              )}

              {filters.minPrice && (
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-600">
                  Min ₦{formatNumber(filters.minPrice)}
                </span>
              )}

              {filters.maxPrice && (
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-600">
                  Max ₦{formatNumber(filters.maxPrice)}
                </span>
              )}

              {filters.rating && (
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-600">
                  {filters.rating}+ rating
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOD CATALOGUE */}
      <section className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-dark-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-bold text-dark-900">
                Food Catalogue
              </h2>

              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-600">
                {formatNumber(foods.length)}
              </span>
            </div>

            <p className="mt-1 text-xs text-dark-500">
              Showing {formatNumber(foods.length)} of{" "}
              {formatNumber(totalFoods)} foods
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {search.trim() && (
              <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-dark-50 px-3 py-1.5 text-xs font-semibold text-dark-600">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                <span>Search:</span>

                <span className="max-w-[180px] truncate font-bold text-dark-900">
                  {search.trim()}
                </span>
              </div>
            )}

            {totalFoods > 0 && (
              <span className="text-xs font-medium text-dark-400">
                Page {pagination.page || page}
                {totalPages ? ` of ${totalPages}` : ""}
              </span>
            )}
          </div>
        </div>

        {foods.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-50 text-dark-300">
              <UtensilsCrossed size={30} />
            </div>

            <h3 className="mt-5 font-heading text-base font-bold text-dark-900">
              No foods found
            </h3>

            <p className="mt-1 max-w-md text-sm leading-6 text-dark-500">
              {search.trim() || activeFilterCount > 0
                ? "No foods match your current search and filters. Try adjusting your criteria."
                : "There are currently no foods available in the catalogue."}
            </p>

            {(search.trim() || activeFilterCount > 0) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-primary-600"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px]">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50/70">
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Food
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Rating
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Availability
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Featured
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Popular
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-dark-100">
                {foods.map((food) => {
                  const image = food.images?.[0] || food.image;
                  const rating = Number(food.rating || 0);
                  const reviewCount = Number(food.reviewCount || 0);

                  const isDeleting = deletingId === food._id;
                  const isUpdating = updatingId === food._id;

                  return (
                    <tr
                      key={food._id}
                      className="group transition hover:bg-primary-50/20"
                    >
                      {/* FOOD */}
                      <td className="px-6 py-4">
                        <div className="flex min-w-[230px] items-center gap-3">
                          {image ? (
                            <img
                              src={image}
                              alt={food.name || "Food"}
                              className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-dark-100"
                            />
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                              <ImageOff size={18} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-dark-900">
                              {food.name || "Unnamed Food"}
                            </p>

                            {food.restaurant?.name && (
                              <p className="mt-1 truncate text-xs text-dark-500">
                                {food.restaurant.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-4">
                        <span className="whitespace-nowrap text-sm font-medium text-dark-600">
                          {food.category?.name || "—"}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-4">
                        <span className="whitespace-nowrap text-sm font-bold text-dark-900">
                          {formatPrice(food.price)}
                        </span>
                      </td>

                      {/* RATING */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Star
                            size={14}
                            className="fill-accent-500 text-accent-500"
                          />

                          <span className="text-sm font-semibold text-dark-700">
                            {rating.toFixed(1)}
                          </span>

                          <span className="text-xs text-dark-400">
                            ({formatNumber(reviewCount)})
                          </span>
                        </div>
                      </td>

                      {/* AVAILABILITY */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleAvailabilityToggle(food)
                          }
                          disabled={isUpdating}
                          className={[
                            "inline-flex min-w-[108px] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
                            food.available
                              ? "bg-success/10 text-success hover:bg-success/15"
                              : "bg-danger/10 text-danger hover:bg-danger/15",
                          ].join(" ")}
                        >
                          {isUpdating ? (
                            <Loader2
                              size={13}
                              className="animate-spin"
                            />
                          ) : (
                            <span
                              className={[
                                "h-1.5 w-1.5 rounded-full",
                                food.available
                                  ? "bg-success"
                                  : "bg-danger",
                              ].join(" ")}
                            />
                          )}

                          {food.available
                            ? "Available"
                            : "Unavailable"}
                        </button>
                      </td>

                      {/* FEATURED */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleFeaturedToggle(food)
                          }
                          disabled={isUpdating}
                          className={[
                            "inline-flex min-w-[94px] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
                            food.featured
                              ? "bg-primary-50 text-primary-600 hover:bg-primary-100"
                              : "bg-dark-50 text-dark-500 hover:bg-dark-100",
                          ].join(" ")}
                        >
                          {food.featured ? "Featured" : "Not featured"}
                        </button>
                      </td>

                      {/* POPULAR */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handlePopularToggle(food)
                          }
                          disabled={isUpdating}
                          className={[
                            "inline-flex min-w-[88px] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
                            food.popular
                              ? "bg-accent-400/15 text-accent-600 hover:bg-accent-400/20"
                              : "bg-dark-50 text-dark-500 hover:bg-dark-100",
                          ].join(" ")}
                        >
                          {food.popular ? "Popular" : "Not popular"}
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex min-w-[170px] flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/foods/${food._id}`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3 text-xs font-bold text-dark-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
                            >
                              <Eye size={14} />
                              View
                            </Link>

                            <Link
                              to={`/admin/foods/${food._id}/edit`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3 text-xs font-bold text-dark-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteFood(food)}
                            disabled={isDeleting}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={13} />
                            )}

                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {foods.length > 0 && totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t border-dark-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs font-medium text-dark-500">
              Page{" "}
              <span className="font-bold text-dark-900">
                {pagination.page || page}
              </span>{" "}
              of{" "}
              <span className="font-bold text-dark-900">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3 text-xs font-bold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1),
                  )
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3 text-xs font-bold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminFoods;