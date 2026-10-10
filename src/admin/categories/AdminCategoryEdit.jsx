import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Image,
  Info,
  Loader2,
  Save,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  useAdminCategoryDetails,
  useUpdateAdminCategory,
} from "../hooks/useAdminCategories";

function AdminCategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminCategoryDetails(id);

  const updateCategory = useUpdateAdminCategory();

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    sortOrder: 0,
    isActive: true,
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!data || initialized) return;

    const category = data?.category || data;

    setForm({
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || "",
      sortOrder: Number(category?.sortOrder || 0),
      isActive: category?.isActive ?? true,
    });

    setInitialized(true);
  }, [data, initialized]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      toast.error("Category name is required.");
      return;
    }

    try {
      await updateCategory.mutateAsync({
        categoryId: id,
        categoryData: {
          name,
          description: form.description.trim(),
          image: form.image.trim(),
          sortOrder: Number(form.sortOrder) || 0,
          isActive: form.isActive,
        },
      });

      toast.success("Category updated successfully.");

      navigate("/admin/categories");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update category.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-7">
        <div className="rounded-3xl border border-dark-100 bg-white p-7 shadow-soft">
          <div className="h-5 w-40 animate-pulse rounded bg-dark-100" />
          <div className="mt-4 h-8 w-64 animate-pulse rounded-lg bg-dark-100" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-dark-100" />
        </div>

        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dark-100 bg-white shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <Loader2
              size={25}
              className="animate-spin text-primary-500"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-dark-900">
            Loading category
          </p>

          <p className="mt-1 text-xs text-dark-500">
            Please wait while we fetch the category details.
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-7">
        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 text-sm font-bold text-dark-600 transition hover:text-primary-500"
        >
          <ArrowLeft size={16} />
          Back to Categories
        </Link>

        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-danger/10 bg-white px-6 text-center shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertCircle size={27} />
          </div>

          <h2 className="mt-4 font-heading text-base font-bold text-dark-900">
            Failed to load category
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-dark-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while loading this category."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white px-6 py-6 shadow-soft sm:px-8">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary-50 blur-3xl" />

        <div className="relative flex items-center gap-4">
          <Link
            to="/admin/categories"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dark-200 bg-white text-dark-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500"
            aria-label="Back to categories"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary-500">
              Category Management
            </div>

            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark-900">
              Edit Category
            </h1>

            <p className="mt-1 text-sm text-dark-500">
              Update the information and visibility of this category.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card"
      >
        <div className="border-b border-dark-100 px-6 py-5 sm:px-8">
          <h2 className="font-heading text-base font-bold text-dark-900">
            Category Information
          </h2>

          <p className="mt-1 text-xs text-dark-500">
            Modify the category details below and save your changes.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-dark-800"
            >
              Category Name
              <span className="ml-1 text-danger">*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              disabled={updateCategory.isPending}
              className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50/30 px-4 text-sm font-medium text-dark-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-bold text-dark-800"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              disabled={updateCategory.isPending}
              className="w-full resize-none rounded-xl border border-dark-200 bg-dark-50/30 px-4 py-3 text-sm font-medium text-dark-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Image */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-dark-800"
              >
                <Image size={15} className="text-dark-400" />
                Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                disabled={updateCategory.isPending}
                className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50/30 px-4 text-sm font-medium text-dark-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
              />

              <p className="mt-2 flex items-center gap-1.5 text-xs text-dark-400">
                <Info size={12} />
                Optional category image URL.
              </p>
            </div>

            {/* Sort Order */}
            <div>
              <label
                htmlFor="sortOrder"
                className="mb-2 block text-sm font-bold text-dark-800"
              >
                Sort Order
              </label>

              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={handleChange}
                disabled={updateCategory.isPending}
                className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50/30 px-4 text-sm font-medium text-dark-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
              />

              <p className="mt-2 flex items-center gap-1.5 text-xs text-dark-400">
                <Info size={12} />
                Lower numbers appear first.
              </p>
            </div>
          </div>

          {/* Active */}
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-dark-100 bg-dark-50/60 p-4 transition hover:border-primary-100 hover:bg-primary-50/40">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              disabled={updateCategory.isPending}
              className="mt-0.5 h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
            />

            <span>
              <span className="flex items-center gap-2 text-sm font-bold text-dark-800">
                <CheckCircle2 size={15} className="text-success" />
                Active category
              </span>

              <span className="mt-1 block text-xs leading-5 text-dark-500">
                Keep this category available to customers and
                visible wherever active categories are displayed.
              </span>
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-dark-100 bg-dark-50/40 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
          <Link
            to="/admin/categories"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-dark-200 bg-white px-5 text-sm font-bold text-dark-700 transition hover:bg-dark-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={updateCategory.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white transition hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateCategory.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCategoryEdit;