import { useMemo } from "react";
import {
  ArrowLeft,
  Clock3,
  Edit3,
  ImageOff,
  Package,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAdminFood } from "../hooks/useAdminFoods";

const formatPrice = (value = 0) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

const normalizeArray = (value) => {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item) => item !== null && item !== undefined && item !== "",
  );
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;

  return value._id || value.id || "";
};

const StatusBadge = ({ active, children }) => (
  <span
    className={[
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold",
      active
        ? "bg-success/10 text-success"
        : "bg-dark-100 text-dark-500",
    ].join(" ")}
  >
    <span
      className={[
        "h-1.5 w-1.5 rounded-full",
        active ? "bg-success" : "bg-dark-300",
      ].join(" ")}
    />
    {children}
  </span>
);

function AdminFoodDetails() {
  const { id } = useParams();

  const {
    data: food,
    isLoading,
    isError,
    error,
  } = useAdminFood(id);

  const ingredients = useMemo(
    () => normalizeArray(food?.ingredients),
    [food?.ingredients],
  );

  const allergens = useMemo(
    () => normalizeArray(food?.allergens),
    [food?.allergens],
  );

  const addOns = useMemo(
    () => normalizeArray(food?.addOns),
    [food?.addOns],
  );

  const customizationOptions = useMemo(
    () => normalizeArray(food?.customizationOptions),
    [food?.customizationOptions],
  );

  if (isLoading) {
    return (
      <div className="space-y-7">
        <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft">
          <div className="h-5 w-28 animate-pulse rounded bg-dark-100" />
          <div className="mt-5 h-8 w-72 animate-pulse rounded-lg bg-dark-100" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-dark-100" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="h-[360px] animate-pulse rounded-3xl bg-dark-100" />

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl bg-dark-100"
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (isError || !food) {
    return (
      <div className="space-y-7">
        <Link
          to="/admin/foods"
          className="inline-flex items-center gap-2 text-sm font-bold text-dark-600 transition hover:text-primary-600"
        >
          <ArrowLeft size={17} />
          Back to Foods
        </Link>

        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-danger/10 bg-white px-6 text-center shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <UtensilsCrossed size={27} />
          </div>

          <h2 className="mt-4 font-heading text-base font-bold text-dark-900">
            Unable to load food
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-dark-500">
            {error?.response?.data?.message ||
              error?.message ||
              "The requested food could not be loaded."}
          </p>

          <Link
            to="/admin/foods"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-primary-600"
          >
            <ArrowLeft size={15} />
            Back to Foods
          </Link>
        </section>
      </div>
    );
  }

  const image =
    food.images?.[0]?.url ||
    food.images?.[0] ||
    food.image ||
    "";

  const categoryName =
    typeof food.category === "object"
      ? food.category?.name
      : food.category;

  const rating = Number(food.rating || 0);
  const reviewCount = Number(food.reviewCount || 0);

  const restaurantName =
    typeof food.restaurant === "object"
      ? food.restaurant?.name
      : "";

  const discountPrice =
    food.discountPrice !== null &&
    food.discountPrice !== undefined &&
    food.discountPrice !== ""
      ? Number(food.discountPrice)
      : null;

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white px-6 py-7 shadow-soft sm:px-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-50 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              to="/admin/foods"
              className="inline-flex items-center gap-2 text-sm font-bold text-dark-500 transition hover:text-primary-600"
            >
              <ArrowLeft size={16} />
              Back to Foods
            </Link>

            <div className="mt-5 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary-500">
                <UtensilsCrossed size={13} />
                Food Details
              </span>

              {categoryName && (
                <span className="rounded-full bg-dark-50 px-3 py-1.5 text-xs font-semibold text-dark-500">
                  {categoryName}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-dark-900 sm:text-3xl">
              {food.name || "Unnamed Food"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
              View the complete catalogue information for this food item.
            </p>
          </div>

          <Link
            to={`/admin/foods/${food._id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-600 hover:shadow-hover"
          >
            <Edit3 size={16} />
            Edit Food
          </Link>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* IMAGE */}
        <div className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card">
          <div className="aspect-square bg-dark-50">
            {image ? (
              <img
                src={image}
                alt={food.name || "Food"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-dark-300">
                <ImageOff size={42} />
                <p className="mt-3 text-sm font-semibold">
                  No image available
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-dark-100 p-5">
            <div className="flex flex-wrap gap-2">
              <StatusBadge active={food.available}>
                {food.available ? "Available" : "Unavailable"}
              </StatusBadge>

              <StatusBadge active={food.featured}>
                {food.featured ? "Featured" : "Not Featured"}
              </StatusBadge>

              <StatusBadge active={food.popular}>
                {food.popular ? "Popular" : "Not Popular"}
              </StatusBadge>
            </div>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="space-y-5">
          <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <Package size={18} />
              </div>

              <div>
                <h2 className="font-heading text-base font-bold text-dark-900">
                  Basic Information
                </h2>

                <p className="text-xs text-dark-500">
                  Core details about this food item.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-dark-400">
                  Food Name
                </p>
                <p className="mt-1 text-sm font-bold text-dark-900">
                  {food.name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-dark-400">
                  Category
                </p>
                <p className="mt-1 text-sm font-bold text-dark-900">
                  {categoryName || "—"}
                </p>
              </div>

              {restaurantName && (
                <div>
                  <p className="text-xs font-semibold text-dark-400">
                    Restaurant
                  </p>
                  <p className="mt-1 text-sm font-bold text-dark-900">
                    {restaurantName}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-dark-400">
                  Preparation Time
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-dark-900">
                  <Clock3 size={15} className="text-primary-500" />
                  {food.preparationTime || 0} minutes
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-dark-100 pt-5">
              <p className="text-xs font-semibold text-dark-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-7 text-dark-600">
                {food.description || "No description provided."}
              </p>
            </div>
          </section>

          {/* PRICING + RATING */}
          <section className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-dark-100 bg-white p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">
                Pricing
              </p>

              <div className="mt-4 flex items-end gap-3">
                <span className="font-heading text-2xl font-extrabold text-dark-900">
                  {formatPrice(discountPrice ?? food.price)}
                </span>

                {discountPrice !== null && (
                  <span className="pb-1 text-sm font-semibold text-dark-400 line-through">
                    {formatPrice(food.price)}
                  </span>
                )}
              </div>

              {discountPrice !== null && (
                <p className="mt-2 text-xs font-semibold text-success">
                  Discounted price
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-dark-100 bg-white p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">
                Customer Rating
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Star
                  size={22}
                  className="fill-accent-500 text-accent-500"
                />

                <span className="font-heading text-2xl font-extrabold text-dark-900">
                  {rating.toFixed(1)}
                </span>
              </div>

              <p className="mt-2 text-xs text-dark-500">
                Based on {reviewCount.toLocaleString("en-NG")} review
                {reviewCount === 1 ? "" : "s"}
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* INGREDIENTS + ALLERGENS */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-dark-100 bg-white p-6 shadow-card">
          <h2 className="font-heading text-base font-bold text-dark-900">
            Ingredients
          </h2>

          {ingredients.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={`${ingredient}-${index}`}
                  className="rounded-full bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700"
                >
                  {typeof ingredient === "object"
                    ? ingredient.name || "Ingredient"
                    : ingredient}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-dark-400">
              No ingredients listed.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-dark-100 bg-white p-6 shadow-card">
          <h2 className="font-heading text-base font-bold text-dark-900">
            Allergens
          </h2>

          {allergens.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {allergens.map((allergen, index) => (
                <span
                  key={`${allergen}-${index}`}
                  className="rounded-full bg-danger/10 px-3 py-2 text-xs font-semibold text-danger"
                >
                  {typeof allergen === "object"
                    ? allergen.name || "Allergen"
                    : allergen}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-dark-400">
              No allergens listed.
            </p>
          )}
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-card">
        <div>
          <h2 className="font-heading text-base font-bold text-dark-900">
            Add-ons
          </h2>

          <p className="mt-1 text-xs text-dark-500">
            Optional additions customers can select with this food.
          </p>
        </div>

        {addOns.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {addOns.map((addOn, index) => (
              <div
                key={`${addOn.name || "addon"}-${index}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-dark-100 bg-dark-50/50 p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-dark-900">
                    {addOn.name || "Unnamed add-on"}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-primary-600">
                    {formatPrice(addOn.price)}
                  </p>
                </div>

                <StatusBadge active={addOn.isAvailable !== false}>
                  {addOn.isAvailable !== false
                    ? "Available"
                    : "Unavailable"}
                </StatusBadge>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-dark-400">
            No add-ons configured.
          </p>
        )}
      </section>

      {/* CUSTOMIZATIONS */}
      <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-card">
        <div>
          <h2 className="font-heading text-base font-bold text-dark-900">
            Customization Options
          </h2>

          <p className="mt-1 text-xs text-dark-500">
            Customer selections available when ordering this food.
          </p>
        </div>

        {customizationOptions.length > 0 ? (
          <div className="mt-5 space-y-4">
            {customizationOptions.map((customization, index) => (
              <div
                key={`${customization.name || "customization"}-${index}`}
                className="rounded-2xl border border-dark-100 bg-dark-50/40 p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-dark-900">
                      {customization.name || "Unnamed customization"}
                    </h3>

                    <div className="mt-1 flex flex-wrap gap-2">
                      {customization.required && (
                        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-600">
                          Required
                        </span>
                      )}

                      {customization.multiple && (
                        <span className="rounded-full bg-dark-100 px-2.5 py-1 text-[11px] font-bold text-dark-600">
                          Multiple selections
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {Array.isArray(customization.options) &&
                customization.options.length > 0 ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {customization.options.map((option, optionIndex) => (
                      <div
                        key={`${option.name || "option"}-${optionIndex}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-dark-100 bg-white px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-dark-800">
                            {option.name || "Unnamed option"}
                          </p>

                          <p className="mt-0.5 text-xs text-dark-500">
                            {option.isAvailable === false
                              ? "Currently unavailable"
                              : "Available"}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-primary-600">
                          {Number(option.price || 0) > 0
                            ? `+${formatPrice(option.price)}`
                            : "Included"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-dark-400">
                    No options configured.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-dark-400">
            No customization options configured.
          </p>
        )}
      </section>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link
          to="/admin/foods"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-5 text-sm font-bold text-dark-700 transition hover:bg-dark-50"
        >
          <ArrowLeft size={16} />
          Back to Foods
        </Link>

        <Link
          to={`/admin/foods/${food._id}/edit`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white transition hover:bg-primary-600"
        >
          <Edit3 size={16} />
          Edit Food
        </Link>
      </div>
    </div>
  );
}

export default AdminFoodDetails;