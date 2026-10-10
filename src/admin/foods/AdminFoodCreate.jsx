import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAdminCategories } from "../hooks/useAdminCategories";
import { useCreateAdminFood } from "../hooks/useAdminFoods";
import { useCurrentRestaurant } from "../../hooks/useRestaurant";

const initialForm = {
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

  addOns: [
    {
      name: "",
      price: "",
      isAvailable: true,
    },
  ],

  customizationOptions: [
    {
      name: "",
      required: false,
      multiple: false,
      options: [
        {
          name: "",
          price: "",
          isAvailable: true,
        },
      ],
    },
  ],
};

const inputClass =
  "w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50";

const labelClass = "mb-2 block text-sm font-semibold text-dark-700";

function AdminFoodCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  const { data: categories = [], isLoading: categoriesLoading } =
    useAdminCategories();

  const {
    data: restaurant,
    isLoading: restaurantLoading,
    isError: restaurantError,
  } = useCurrentRestaurant();

  const createFood = useCreateAdminFood();

  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive !== false),
    [categories],
  );

  const isSubmitting = createFood.isPending || restaurantLoading;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setForm((current) => {
      const items = [...current[field]];
      items[index] = value;

      return {
        ...current,
        [field]: items,
      };
    });
  };

  const addArrayItem = (field) => {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm((current) => {
      const items = current[field].filter(
        (_, itemIndex) => itemIndex !== index,
      );

      return {
        ...current,
        [field]: items.length > 0 ? items : [""],
      };
    });
  };

  const updateAddOn = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      addOns: prev.addOns.map((addOn, i) =>
        i === index
          ? {
              ...addOn,
              [field]: value,
            }
          : addOn,
      ),
    }));
  };

  const addAddOn = () => {
    setForm((prev) => ({
      ...prev,
      addOns: [
        ...prev.addOns,
        {
          name: "",
          price: "",
          isAvailable: true,
        },
      ],
    }));
  };

  const removeAddOn = (index) => {
    setForm((prev) => ({
      ...prev,
      addOns:
        prev.addOns.length > 1
          ? prev.addOns.filter((_, i) => i !== index)
          : [
              {
                name: "",
                price: "",
                isAvailable: true,
              },
            ],
    }));
  };

  const updateCustomization = (customizationIndex, field, value) => {
    setForm((current) => {
      const customizationOptions = [...current.customizationOptions];

      customizationOptions[customizationIndex] = {
        ...customizationOptions[customizationIndex],
        [field]: value,
      };

      return {
        ...current,
        customizationOptions,
      };
    });
  };

  const addCustomization = () => {
    setForm((current) => ({
      ...current,
      customizationOptions: [
        ...current.customizationOptions,
        {
          name: "",
          required: false,
          multiple: false,
          options: [
            {
              name: "",
              price: "",
              isAvailable: true,
            },
          ],
        },
      ],
    }));
  };

  const removeCustomization = (customizationIndex) => {
    setForm((current) => ({
      ...current,
      customizationOptions: current.customizationOptions.filter(
        (_, index) => index !== customizationIndex,
      ),
    }));
  };

  const updateCustomizationOption = (
    customizationIndex,
    optionIndex,
    field,
    value,
  ) => {
    setForm((current) => {
      const customizationOptions = [...current.customizationOptions];

      const customization = {
        ...customizationOptions[customizationIndex],
      };

      const options = [...customization.options];

      options[optionIndex] = {
        ...options[optionIndex],
        [field]: value,
      };

      customization.options = options;

      customizationOptions[customizationIndex] = customization;

      return {
        ...current,
        customizationOptions,
      };
    });
  };

  const addCustomizationOption = (customizationIndex) => {
    setForm((current) => {
      const customizationOptions = [...current.customizationOptions];

      customizationOptions[customizationIndex] = {
        ...customizationOptions[customizationIndex],
        options: [
          ...customizationOptions[customizationIndex].options,
          {
            name: "",
            price: "",
            isAvailable: true,
          },
        ],
      };

      return {
        ...current,
        customizationOptions,
      };
    });
  };

  const removeCustomizationOption = (customizationIndex, optionIndex) => {
    setForm((current) => {
      const customizationOptions = [...current.customizationOptions];

      const customization = {
        ...customizationOptions[customizationIndex],
      };

      customization.options = customization.options.filter(
        (_, index) => index !== optionIndex,
      );

      customizationOptions[customizationIndex] = customization;

      return {
        ...current,
        customizationOptions,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!restaurant?._id) {
      toast.error("Unable to identify the Resvill restaurant.");
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

    const discountPrice =
      form.discountPrice === "" ? undefined : Number(form.discountPrice);

    if (
      discountPrice !== undefined &&
      (!Number.isFinite(discountPrice) || discountPrice < 0)
    ) {
      toast.error("Please enter a valid discount price.");
      return;
    }

    if (discountPrice !== undefined && discountPrice >= price) {
      toast.error("Discount price must be lower than the regular price.");
      return;
    }

    const preparationTime = Number(form.preparationTime);

    if (!Number.isInteger(preparationTime) || preparationTime < 1) {
      toast.error("Preparation time must be at least 1 minute.");
      return;
    }

    const ingredients = form.ingredients
      .map((item) => item.trim())
      .filter(Boolean);

    const allergens = form.allergens.map((item) => item.trim()).filter(Boolean);

    const images = form.images.map((item) => item.trim()).filter(Boolean);

    const addOns = form.addOns
      .filter((addOn) => addOn.name.trim())
      .map((addOn) => ({
        name: addOn.name.trim(),
        price: Number(addOn.price),
        isAvailable: addOn.isAvailable,
      }));

    const customizationOptions = form.customizationOptions
      .filter((customization) => customization.name.trim())
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

    // const payload = {
    //   restaurant: restaurant._id,
    //   category: form.category,
    //   name: form.name.trim(),
    //   description: form.description.trim(),
    //   price,
    //   ...(discountPrice !== undefined && {
    //     discountPrice,
    //   }),
    //   ingredients,
    //   allergens,
    //   images,
    //   preparationTime,
    //   available: form.available,
    //   featured: form.featured,
    //   popular: form.popular,
    // };

    const payload = {
      restaurant: restaurant._id,
      category: form.category,
      name: form.name.trim(),
      description: form.description.trim(),

      price,

      ...(discountPrice !== undefined && {
        discountPrice,
      }),

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

    for (const addOn of addOns) {
      if (!Number.isFinite(addOn.price) || addOn.price < 0) {
        toast.error("Every add-on must have a valid price.");
        return;
      }
    }

    for (const customization of customizationOptions) {
      if (customization.options.length === 0) {
        toast.error(
          `Customization "${customization.name}" needs at least one option.`,
        );
        return;
      }

      for (const option of customization.options) {
        if (!Number.isFinite(option.price) || option.price < 0) {
          toast.error(
            `Every option in "${customization.name}" must have a valid price.`,
          );
          return;
        }
      }
    }

    try {
      await createFood.mutateAsync(payload);

      toast.success("Food created successfully.");

      navigate("/admin/foods");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create food.",
      );
    }
  };

  if (restaurantError) {
    return (
      <div className="rounded-2xl border border-danger/10 bg-white p-8 text-center">
        <h2 className="font-heading text-lg font-bold text-dark-900">
          Unable to load Resvill
        </h2>

        <p className="mt-2 text-sm text-dark-500">
          The restaurant information could not be loaded, so a food cannot be
          created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white px-6 py-7 shadow-soft sm:px-8">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary-50 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/foods"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dark-200 text-dark-600 transition hover:bg-dark-50"
              aria-label="Back to foods"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-500">
                <UtensilsCrossed size={13} />
                Food Management
              </div>

              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark-900 sm:text-3xl">
                Add Food
              </h1>

              <p className="mt-1 text-sm text-dark-500">
                Add a new food item to the Resvill catalogue.
              </p>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6">
            <h2 className="font-heading text-lg font-bold text-dark-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Enter the main information customers will see.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Food Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Chicken Burger"
                disabled={isSubmitting}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the food item..."
                disabled={isSubmitting}
                className={`${inputClass} resize-none`}
              />

              <p className="mt-1.5 text-xs text-dark-400">
                Maximum 2,000 characters.
              </p>
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={isSubmitting || categoriesLoading}
                className={inputClass}
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {activeCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {!categoriesLoading && activeCategories.length === 0 && (
                <p className="mt-2 text-xs text-danger">
                  No active categories are available. Create or activate a
                  category first.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6">
            <h2 className="font-heading text-lg font-bold text-dark-900">
              Pricing
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Set the regular price and optional discounted price.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className={labelClass}>
                Regular Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                disabled={isSubmitting}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="discountPrice" className={labelClass}>
                Discount Price
                <span className="ml-1 font-normal text-dark-400">
                  (Optional)
                </span>
              </label>

              <input
                id="discountPrice"
                name="discountPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.discountPrice}
                onChange={handleChange}
                placeholder="0"
                disabled={isSubmitting}
                className={inputClass}
              />

              <p className="mt-1.5 text-xs text-dark-400">
                Must be lower than the regular price.
              </p>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6">
            <h2 className="font-heading text-lg font-bold text-dark-900">
              Food Images
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Add image URLs for the food.
            </p>
          </div>

          <div className="space-y-3">
            {form.images.map((image, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="url"
                  value={image}
                  onChange={(event) =>
                    updateArrayItem("images", index, event.target.value)
                  }
                  placeholder="https://..."
                  disabled={isSubmitting}
                  className={inputClass}
                />

                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("images", index)}
                    disabled={isSubmitting}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-danger/20 text-danger transition hover:bg-danger/5"
                    aria-label="Remove image"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem("images")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
            >
              <Plus size={16} />
              Add Image
            </button>
          </div>
        </section>

        {/* Ingredients & Allergens */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Ingredients */}
          <div className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-6">
              <h2 className="font-heading text-lg font-bold text-dark-900">
                Ingredients
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                List the ingredients used.
              </p>
            </div>

            <div className="space-y-3">
              {form.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(event) =>
                      updateArrayItem("ingredients", index, event.target.value)
                    }
                    placeholder="e.g. Chicken"
                    disabled={isSubmitting}
                    className={inputClass}
                  />

                  {form.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("ingredients", index)}
                      disabled={isSubmitting}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-danger/20 text-danger transition hover:bg-danger/5"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayItem("ingredients")}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
              >
                <Plus size={16} />
                Add Ingredient
              </button>
            </div>
          </div>

          {/* Allergens */}
          <div className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-6">
              <h2 className="font-heading text-lg font-bold text-dark-900">
                Allergens
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                List known allergens.
              </p>
            </div>

            <div className="space-y-3">
              {form.allergens.map((allergen, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={allergen}
                    onChange={(event) =>
                      updateArrayItem("allergens", index, event.target.value)
                    }
                    placeholder="e.g. Gluten"
                    disabled={isSubmitting}
                    className={inputClass}
                  />

                  {form.allergens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("allergens", index)}
                      disabled={isSubmitting}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-danger/20 text-danger transition hover:bg-danger/5"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayItem("allergens")}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
              >
                <Plus size={16} />
                Add Allergen
              </button>
            </div>

            {/* Add-ons */}
            

            {/* Customizations */}
          </div>
        </section>

        <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-dark-900">
                    Add-ons
                  </h2>

                  <p className="mt-1 text-sm text-dark-500">
                    Give customers optional extras they can add to this food.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addAddOn}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
                >
                  <Plus size={16} />
                  Add Add-on
                </button>
              </div>

              <div className="space-y-4">
                {form.addOns.map((addOn, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-dark-100 bg-dark-50 p-4"
                  >
                    <div className="grid gap-4 md:grid-cols-[1fr_180px_auto] md:items-end">
                      <div>
                        <label className={labelClass}>Add-on Name</label>

                        <input
                          type="text"
                          value={addOn.name}
                          onChange={(event) =>
                            updateAddOn(index, "name", event.target.value)
                          }
                          placeholder="e.g. Extra Cheese"
                          disabled={isSubmitting}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Price</label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={addOn.price}
                          onChange={(event) =>
                            updateAddOn(index, "price", event.target.value)
                          }
                          placeholder="0"
                          disabled={isSubmitting}
                          className={inputClass}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeAddOn(index)}
                        disabled={isSubmitting}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-danger/20 text-sm font-semibold text-danger transition hover:bg-danger/5 md:w-12"
                        aria-label="Remove add-on"
                      >
                        <Trash2 size={17} />

                        <span className="md:hidden">Remove</span>
                      </button>
                    </div>

                    <label className="mt-4 flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addOn.isAvailable}
                        onChange={(event) =>
                          updateAddOn(
                            index,
                            "isAvailable",
                            event.target.checked,
                          )
                        }
                        disabled={isSubmitting}
                        className="h-4 w-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                      />

                      <span className="text-sm font-medium text-dark-700">
                        Available for customers
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>

        <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-dark-900">
                Customization Options
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                Let customers customize this food before adding it to their
                cart.
              </p>
            </div>

            <button
              type="button"
              onClick={addCustomization}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
            >
              <Plus size={16} />
              Add Customization
            </button>
          </div>

          <div className="space-y-6">
            {form.customizationOptions.map(
              (customization, customizationIndex) => (
                <div
                  key={customizationIndex}
                  className="rounded-2xl border border-dark-100 bg-dark-50 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                    <div className="flex-1">
                      <label className={labelClass}>Customization Name</label>

                      <input
                        type="text"
                        value={customization.name}
                        onChange={(event) =>
                          updateCustomization(
                            customizationIndex,
                            "name",
                            event.target.value,
                          )
                        }
                        placeholder="e.g. Spice Level"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCustomization(customizationIndex)}
                      disabled={isSubmitting}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-danger/20 px-4 text-sm font-semibold text-danger transition hover:bg-danger/5"
                    >
                      <Trash2 size={17} />
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-5">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={customization.required}
                        onChange={(event) =>
                          updateCustomization(
                            customizationIndex,
                            "required",
                            event.target.checked,
                          )
                        }
                        disabled={isSubmitting}
                        className="h-4 w-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                      />

                      <span className="text-sm font-medium text-dark-700">
                        Required
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={customization.multiple}
                        onChange={(event) =>
                          updateCustomization(
                            customizationIndex,
                            "multiple",
                            event.target.checked,
                          )
                        }
                        disabled={isSubmitting}
                        className="h-4 w-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                      />

                      <span className="text-sm font-medium text-dark-700">
                        Allow multiple selections
                      </span>
                    </label>
                  </div>

                  <div className="mt-6 border-t border-dark-200 pt-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-dark-800">
                          Options
                        </h3>

                        <p className="mt-1 text-xs text-dark-500">
                          Add the choices customers can select.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addCustomizationOption(customizationIndex)
                        }
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-3 py-2 text-xs font-semibold text-dark-700 transition hover:bg-white"
                      >
                        <Plus size={14} />
                        Add Option
                      </button>
                    </div>

                    <div className="space-y-3">
                      {customization.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="rounded-xl border border-dark-100 bg-white p-4"
                        >
                          <div className="grid gap-4 md:grid-cols-[1fr_160px_auto] md:items-end">
                            <div>
                              <label className={labelClass}>Option Name</label>

                              <input
                                type="text"
                                value={option.name}
                                onChange={(event) =>
                                  updateCustomizationOption(
                                    customizationIndex,
                                    optionIndex,
                                    "name",
                                    event.target.value,
                                  )
                                }
                                placeholder="e.g. Mild"
                                disabled={isSubmitting}
                                className={inputClass}
                              />
                            </div>

                            <div>
                              <label className={labelClass}>Extra Price</label>

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
                                    event.target.value,
                                  )
                                }
                                placeholder="0"
                                disabled={isSubmitting}
                                className={inputClass}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeCustomizationOption(
                                  customizationIndex,
                                  optionIndex,
                                )
                              }
                              disabled={isSubmitting}
                              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-danger/20 text-sm font-semibold text-danger transition hover:bg-danger/5 md:w-12"
                            >
                              <Trash2 size={17} />

                              <span className="md:hidden">Remove</span>
                            </button>
                          </div>

                          <label className="mt-4 flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={option.isAvailable}
                              onChange={(event) =>
                                updateCustomizationOption(
                                  customizationIndex,
                                  optionIndex,
                                  "isAvailable",
                                  event.target.checked,
                                )
                              }
                              disabled={isSubmitting}
                              className="h-4 w-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                            />

                            <span className="text-sm font-medium text-dark-700">
                              Available
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Preparation */}
        <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6">
            <h2 className="font-heading text-lg font-bold text-dark-900">
              Preparation
            </h2>
          </div>

          <div className="max-w-sm">
            <label htmlFor="preparationTime" className={labelClass}>
              Preparation Time (minutes)
            </label>

            <input
              id="preparationTime"
              name="preparationTime"
              type="number"
              min="1"
              step="1"
              value={form.preparationTime}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClass}
            />
          </div>
        </section>

        {/* Status */}
        <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6">
            <h2 className="font-heading text-lg font-bold text-dark-900">
              Food Status
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Control how this food appears in the catalogue.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                name: "available",
                title: "Available",
                description: "Customers can order this food.",
              },
              {
                name: "featured",
                title: "Featured",
                description: "Show this food as featured.",
              },
              {
                name: "popular",
                title: "Popular",
                description: "Mark this food as popular.",
              },
            ].map((item) => (
              <label
                key={item.name}
                className="flex cursor-pointer gap-3 rounded-2xl border border-dark-100 bg-dark-50 p-4 transition hover:border-primary-200"
              >
                <input
                  type="checkbox"
                  name={item.name}
                  checked={form[item.name]}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-1 h-4 w-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                />

                <span>
                  <span className="block text-sm font-semibold text-dark-800">
                    {item.title}
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-dark-500">
                    {item.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/foods"
            className="inline-flex items-center justify-center rounded-xl border border-dark-200 px-6 py-3 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || categoriesLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createFood.isPending ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Creating Food...
              </>
            ) : (
              <>
                <Save size={17} />
                Create Food
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminFoodCreate;
