import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAdminCategories } from "../hooks/useAdminCategories";
import {
  useAdminFood,
  useUpdateAdminFood,
} from "../hooks/useAdminFoods";

const emptyAddOn = () => ({
  name: "",
  price: "",
  isAvailable: true,
});

const emptyCustomizationOption = () => ({
  name: "",
  price: "",
  isAvailable: true,
});

const emptyCustomization = () => ({
  name: "",
  required: false,
  multiple: false,
  options: [emptyCustomizationOption()],
});

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  discountPrice: "",
  preparationTime: 20,
  available: true,
  featured: false,
  popular: false,

  ingredients: [""],
  allergens: [""],
  images: [""],

  addOns: [emptyAddOn()],

  customizationOptions: [emptyCustomization()],
};

const inputClass =
  "w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50";

const labelClass =
  "mb-2 block text-sm font-semibold text-dark-700";

const normalizeArray = (value, fallback = [""]) => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback;
  }

  return value;
};

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || "";
};

function AdminFoodEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [initialized, setInitialized] = useState(false);

  const {
    data: food,
    isLoading: foodLoading,
    isError: foodError,
    error,
  } = useAdminFood(id);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useAdminCategories();

  const updateFood = useUpdateAdminFood();

  const activeCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.isActive !== false
      ),
    [categories]
  );

  useEffect(() => {
    if (!food || initialized) {
      return;
    }

    const categoryId = getId(food.category);

    const normalizedAddOns =
      Array.isArray(food.addOns) && food.addOns.length > 0
        ? food.addOns.map((addOn) => ({
            name: addOn?.name || "",
            price:
              addOn?.price !== undefined &&
              addOn?.price !== null
                ? String(addOn.price)
                : "",
            isAvailable: addOn?.isAvailable !== false,
          }))
        : [emptyAddOn()];

    const normalizedCustomizations =
      Array.isArray(food.customizationOptions) &&
      food.customizationOptions.length > 0
        ? food.customizationOptions.map((customization) => ({
            name: customization?.name || "",
            required: Boolean(customization?.required),
            multiple: Boolean(customization?.multiple),
            options:
              Array.isArray(customization?.options) &&
              customization.options.length > 0
                ? customization.options.map((option) => ({
                    name: option?.name || "",
                    price:
                      option?.price !== undefined &&
                      option?.price !== null
                        ? String(option.price)
                        : "",
                    isAvailable:
                      option?.isAvailable !== false,
                  }))
                : [emptyCustomizationOption()],
          }))
        : [emptyCustomization()];

    setForm({
      name: food.name || "",
      description: food.description || "",
      category: categoryId,

      price:
        food.price !== undefined && food.price !== null
          ? String(food.price)
          : "",

      discountPrice:
        food.discountPrice !== undefined &&
        food.discountPrice !== null
          ? String(food.discountPrice)
          : "",

      preparationTime:
        food.preparationTime !== undefined &&
        food.preparationTime !== null
          ? food.preparationTime
          : 20,

      available: food.available !== false,
      featured: Boolean(food.featured),
      popular: Boolean(food.popular),

      ingredients: normalizeArray(food.ingredients),
      allergens: normalizeArray(food.allergens),

      // Images are deliberately left untouched for now.
      images: normalizeArray(food.images),

      addOns: normalizedAddOns,
      customizationOptions: normalizedCustomizations,
    });

    setInitialized(true);
  }, [food, initialized]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  };

  const addArrayItem = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => {
      const next = prev[field].filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...prev,
        [field]: next.length > 0 ? next : [""],
      };
    });
  };

  const updateAddOn = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      addOns: prev.addOns.map((addOn, itemIndex) =>
        itemIndex === index
          ? {
              ...addOn,
              [field]: value,
            }
          : addOn
      ),
    }));
  };

  const addAddOn = () => {
    setForm((prev) => ({
      ...prev,
      addOns: [...prev.addOns, emptyAddOn()],
    }));
  };

  const removeAddOn = (index) => {
    setForm((prev) => {
      const next = prev.addOns.filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...prev,
        addOns: next.length > 0 ? next : [emptyAddOn()],
      };
    });
  };

  const updateCustomization = (
    customizationIndex,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      customizationOptions:
        prev.customizationOptions.map(
          (customization, index) =>
            index === customizationIndex
              ? {
                  ...customization,
                  [field]: value,
                }
              : customization
        ),
    }));
  };

  const addCustomization = () => {
    setForm((prev) => ({
      ...prev,
      customizationOptions: [
        ...prev.customizationOptions,
        emptyCustomization(),
      ],
    }));
  };

  const removeCustomization = (index) => {
    setForm((prev) => {
      const next = prev.customizationOptions.filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...prev,
        customizationOptions:
          next.length > 0
            ? next
            : [emptyCustomization()],
      };
    });
  };

  const updateCustomizationOption = (
    customizationIndex,
    optionIndex,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      customizationOptions:
        prev.customizationOptions.map(
          (customization, index) => {
            if (index !== customizationIndex) {
              return customization;
            }

            return {
              ...customization,
              options: customization.options.map(
                (option, currentOptionIndex) =>
                  currentOptionIndex === optionIndex
                    ? {
                        ...option,
                        [field]: value,
                      }
                    : option
              ),
            };
          }
        ),
    }));
  };

  const addCustomizationOption = (customizationIndex) => {
    setForm((prev) => ({
      ...prev,
      customizationOptions:
        prev.customizationOptions.map(
          (customization, index) =>
            index === customizationIndex
              ? {
                  ...customization,
                  options: [
                    ...customization.options,
                    emptyCustomizationOption(),
                  ],
                }
              : customization
        ),
    }));
  };

  const removeCustomizationOption = (
    customizationIndex,
    optionIndex
  ) => {
    setForm((prev) => ({
      ...prev,
      customizationOptions:
        prev.customizationOptions.map(
          (customization, index) => {
            if (index !== customizationIndex) {
              return customization;
            }

            const next = customization.options.filter(
              (_, currentOptionIndex) =>
                currentOptionIndex !== optionIndex
            );

            return {
              ...customization,
              options:
                next.length > 0
                  ? next
                  : [emptyCustomizationOption()],
            };
          }
        ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!id) {
      toast.error("Food ID is missing.");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Food name is required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Food description is required.");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category.");
      return;
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Please enter a valid food price.");
      return;
    }

    let discountPrice;

    if (
      form.discountPrice !== "" &&
      form.discountPrice !== null &&
      form.discountPrice !== undefined
    ) {
      discountPrice = Number(form.discountPrice);

      if (
        !Number.isFinite(discountPrice) ||
        discountPrice < 0
      ) {
        toast.error("Please enter a valid discount price.");
        return;
      }

      if (discountPrice >= price) {
        toast.error(
          "Discount price must be lower than the regular price."
        );
        return;
      }
    }

    const preparationTime = Number(
      form.preparationTime
    );

    if (
      !Number.isInteger(preparationTime) ||
      preparationTime < 1
    ) {
      toast.error(
        "Preparation time must be at least 1 minute."
      );
      return;
    }

    const ingredients = form.ingredients
      .map((item) => item.trim())
      .filter(Boolean);

    const allergens = form.allergens
      .map((item) => item.trim())
      .filter(Boolean);

    const images = form.images
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        return item;
      })
      .filter((item) => {
        if (typeof item === "string") {
          return Boolean(item);
        }

        return Boolean(item?.url);
      });

    const addOns = form.addOns
      .filter((addOn) => addOn.name.trim())
      .map((addOn) => ({
        name: addOn.name.trim(),
        price: Number(addOn.price),
        isAvailable: addOn.isAvailable,
      }));

    for (const addOn of addOns) {
      if (
        !Number.isFinite(addOn.price) ||
        addOn.price < 0
      ) {
        toast.error(
          `Invalid price for add-on "${addOn.name}".`
        );
        return;
      }
    }

    const customizationOptions =
      form.customizationOptions
        .filter(
          (customization) =>
            customization.name.trim()
        )
        .map((customization) => ({
          name: customization.name.trim(),
          required: customization.required,
          multiple: customization.multiple,
          options: customization.options
            .filter((option) => option.name.trim())
            .map((option) => ({
              name: option.name.trim(),
              price: Number(option.price),
              isAvailable: option.isAvailable,
            })),
        }));

    for (const customization of customizationOptions) {
      for (const option of customization.options) {
        if (
          !Number.isFinite(option.price) ||
          option.price < 0
        ) {
          toast.error(
            `Invalid price for "${option.name}" in "${customization.name}".`
          );
          return;
        }
      }
    }

    const payload = {
      category: form.category,
      name: form.name.trim(),
      description: form.description.trim(),

      price,

      ...(discountPrice !== undefined
        ? { discountPrice }
        : { discountPrice: null }),

      ingredients,
      allergens,
      images,

      addOns,
      customizationOptions,

      preparationTime,
      available: form.available,
      featured: form.featured,
      popular: form.popular,
    };

    try {
      await updateFood.mutateAsync({
        foodId: id,
        foodData: payload,
      });

      toast.success("Food updated successfully.");
      navigate("/admin/foods");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update food.";

      toast.error(message);
    }
  };

  if (foodLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-dark-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading food...</span>
        </div>
      </div>
    );
  }

  if (foodError || !food) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-700">
            Unable to load food
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error?.response?.data?.message ||
              error?.message ||
              "The food could not be found."}
          </p>

          <Link
            to="/admin/foods"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Foods
          </Link>
        </div>
      </div>
    );
  }

  const isSubmitting = updateFood.isPending;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/foods"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-dark-500 transition hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Foods
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <UtensilsCrossed className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-dark-900">
                Edit Food
              </h1>

              <p className="mt-1 text-sm text-dark-500">
                Update the details for {food.name}.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-dark-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Update the basic information customers see.
            </p>
          </div>

          <div className="grid gap-5">
            <div>
              <label className={labelClass}>
                Food Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Chicken Burger"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className={labelClass}>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={inputClass}
                placeholder="Describe the food..."
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className={labelClass}>
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
                disabled={
                  categoriesLoading || isSubmitting
                }
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {activeCategories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-dark-900">
              Pricing
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Set the regular and discounted prices.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Regular Price (₦)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className={labelClass}>
                Discount Price (₦)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                className={inputClass}
                placeholder="Optional"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-dark-900">
              Food Images
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Image upload will be integrated separately.
            </p>
          </div>

          <div className="space-y-3">
            {form.images.map((image, index) => (
              <div
                key={index}
                className="rounded-xl border border-dark-100 bg-dark-50 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-dark-500">
                    Image {index + 1}
                  </span>
                </div>

                <div className="mt-2 break-all text-sm text-dark-600">
                  {typeof image === "string"
                    ? image || "No image"
                    : image?.url || "No image"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ingredients & Allergens */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Ingredients */}
          <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-dark-900">
                Ingredients
              </h2>
            </div>

            <div className="space-y-3">
              {form.ingredients.map(
                (ingredient, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(event) =>
                        updateArrayItem(
                          "ingredients",
                          index,
                          event.target.value
                        )
                      }
                      className={inputClass}
                      placeholder="e.g. Chicken"
                      disabled={isSubmitting}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem(
                          "ingredients",
                          index
                        )
                      }
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  addArrayItem("ingredients")
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" />
                Add Ingredient
              </button>
            </div>
          </div>

          {/* Allergens */}
          <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-dark-900">
                Allergens
              </h2>
            </div>

            <div className="space-y-3">
              {form.allergens.map((allergen, index) => (
                <div
                  key={index}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={allergen}
                    onChange={(event) =>
                      updateArrayItem(
                        "allergens",
                        index,
                        event.target.value
                      )
                    }
                    className={inputClass}
                    placeholder="e.g. Milk"
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeArrayItem(
                        "allergens",
                        index
                      )
                    }
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  addArrayItem("allergens")
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" />
                Add Allergen
              </button>
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-dark-900">
                Add-ons
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                Optional extras customers can add.
              </p>
            </div>

            <button
              type="button"
              onClick={addAddOn}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-100"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
              Add Add-on
            </button>
          </div>

          <div className="space-y-4">
            {form.addOns.map((addOn, index) => (
              <div
                key={index}
                className="rounded-xl border border-dark-100 bg-dark-50 p-4"
              >
                <div className="grid gap-4 md:grid-cols-[1fr_180px_auto] md:items-end">
                  <div>
                    <label className={labelClass}>
                      Name
                    </label>

                    <input
                      type="text"
                      value={addOn.name}
                      onChange={(event) =>
                        updateAddOn(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                      className={inputClass}
                      placeholder="e.g. Extra Cheese"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Price (₦)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={addOn.price}
                      onChange={(event) =>
                        updateAddOn(
                          index,
                          "price",
                          event.target.value
                        )
                      }
                      className={inputClass}
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeAddOn(index)
                    }
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>

                <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-dark-700">
                  <input
                    type="checkbox"
                    checked={addOn.isAvailable}
                    onChange={(event) =>
                      updateAddOn(
                        index,
                        "isAvailable",
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                    disabled={isSubmitting}
                  />
                  Available
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Customizations */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-dark-900">
                Customization Options
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                Define choices customers can make for this
                food.
              </p>
            </div>

            <button
              type="button"
              onClick={addCustomization}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-100"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
              Add Customization
            </button>
          </div>

          <div className="space-y-5">
            {form.customizationOptions.map(
              (customization, customizationIndex) => (
                <div
                  key={customizationIndex}
                  className="rounded-xl border border-dark-100 bg-dark-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <label className={labelClass}>
                        Customization Name
                      </label>

                      <input
                        type="text"
                        value={customization.name}
                        onChange={(event) =>
                          updateCustomization(
                            customizationIndex,
                            "name",
                            event.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="e.g. Spice Level"
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeCustomization(
                          customizationIndex
                        )
                      }
                      className="mt-7 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-5">
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-dark-700">
                      <input
                        type="checkbox"
                        checked={customization.required}
                        onChange={(event) =>
                          updateCustomization(
                            customizationIndex,
                            "required",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                        disabled={isSubmitting}
                      />
                      Required
                    </label>

                    <label className="inline-flex items-center gap-2 text-sm font-medium text-dark-700">
                      <input
                        type="checkbox"
                        checked={customization.multiple}
                        onChange={(event) =>
                          updateCustomization(
                            customizationIndex,
                            "multiple",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                        disabled={isSubmitting}
                      />
                      Allow multiple
                    </label>
                  </div>

                  <div className="mt-5 border-t border-dark-200 pt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-dark-800">
                        Options
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          addCustomizationOption(
                            customizationIndex
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
                        disabled={isSubmitting}
                      >
                        <Plus className="h-4 w-4" />
                        Add Option
                      </button>
                    </div>

                    <div className="space-y-3">
                      {customization.options.map(
                        (option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="rounded-xl border border-dark-100 bg-white p-3"
                          >
                            <div className="grid gap-3 md:grid-cols-[1fr_160px_auto] md:items-end">
                              <div>
                                <label className={labelClass}>
                                  Option Name
                                </label>

                                <input
                                  type="text"
                                  value={option.name}
                                  onChange={(event) =>
                                    updateCustomizationOption(
                                      customizationIndex,
                                      optionIndex,
                                      "name",
                                      event.target.value
                                    )
                                  }
                                  className={inputClass}
                                  placeholder="e.g. Mild"
                                  disabled={isSubmitting}
                                />
                              </div>

                              <div>
                                <label className={labelClass}>
                                  Extra Price (₦)
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={option.price}
                                  onChange={(event) =>
                                    updateCustomizationOption(
                                      customizationIndex,
                                      optionIndex,
                                      "price",
                                      event.target.value
                                    )
                                  }
                                  className={inputClass}
                                  placeholder="0"
                                  disabled={isSubmitting}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeCustomizationOption(
                                    customizationIndex,
                                    optionIndex
                                  )
                                }
                                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                                disabled={isSubmitting}
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </button>
                            </div>

                            <label className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-dark-700">
                              <input
                                type="checkbox"
                                checked={
                                  option.isAvailable
                                }
                                onChange={(event) =>
                                  updateCustomizationOption(
                                    customizationIndex,
                                    optionIndex,
                                    "isAvailable",
                                    event.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                                disabled={isSubmitting}
                              />
                              Available
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* Preparation */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-dark-900">
              Preparation
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Set the estimated preparation time.
            </p>
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>
              Preparation Time (minutes)
            </label>

            <input
              type="number"
              min="1"
              step="1"
              name="preparationTime"
              value={form.preparationTime}
              onChange={handleChange}
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
        </section>

        {/* Status */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-dark-900">
              Food Status
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Control how this food appears and behaves in
              the menu.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dark-100 p-4 transition hover:border-primary-200">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                disabled={isSubmitting}
              />

              <div>
                <p className="text-sm font-semibold text-dark-800">
                  Available
                </p>
                <p className="text-xs text-dark-500">
                  Customers can order this food.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dark-100 p-4 transition hover:border-primary-200">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                disabled={isSubmitting}
              />

              <div>
                <p className="text-sm font-semibold text-dark-800">
                  Featured
                </p>
                <p className="text-xs text-dark-500">
                  Show this food in featured areas.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dark-100 p-4 transition hover:border-primary-200">
              <input
                type="checkbox"
                name="popular"
                checked={form.popular}
                onChange={handleChange}
                className="h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                disabled={isSubmitting}
              />

              <div>
                <p className="text-sm font-semibold text-dark-800">
                  Popular
                </p>
                <p className="text-xs text-dark-500">
                  Mark this food as popular.
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/foods"
            className="inline-flex items-center justify-center rounded-xl border border-dark-200 bg-white px-5 py-3 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminFoodEdit;