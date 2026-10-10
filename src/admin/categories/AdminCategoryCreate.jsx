import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FolderPlus,
  Image,
  Info,
  Loader2,
  Save,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useCreateAdminCategory } from "../hooks/useAdminCategories";

function AdminCategoryCreate() {
  const navigate = useNavigate();

  const createCategory = useCreateAdminCategory();

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    sortOrder: 0,
    isActive: true,
  });

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
      await createCategory.mutateAsync({
        name,
        description: form.description.trim(),
        image: form.image.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      });

      toast.success("Category created successfully.");

      navigate("/admin/categories");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create category.",
      );
    }
  };

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
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary-500">
              <FolderPlus size={14} />
              Menu Management
            </div>

            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark-900">
              Create Category
            </h1>

            <p className="mt-1 text-sm text-dark-500">
              Add a new category to organize your food catalogue.
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
            Enter the information that will be used to identify and
            display this category.
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
              placeholder="e.g. Burgers"
              disabled={createCategory.isPending}
              className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50/30 px-4 text-sm font-medium text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
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
              placeholder="Describe this category..."
              disabled={createCategory.isPending}
              className="w-full resize-none rounded-xl border border-dark-200 bg-dark-50/30 px-4 py-3 text-sm font-medium text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
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
                placeholder="https://..."
                disabled={createCategory.isPending}
                className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50/30 px-4 text-sm font-medium text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
              />

              <p className="mt-2 flex items-center gap-1.5 text-xs text-dark-400">
                <Info size={12} />
                Optional category image URL.
              </p>
            </div>

            {/* Sort */}
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
                disabled={createCategory.isPending}
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
              disabled={createCategory.isPending}
              className="mt-0.5 h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
            />

            <span>
              <span className="flex items-center gap-2 text-sm font-bold text-dark-800">
                <CheckCircle2 size={15} className="text-success" />
                Active category
              </span>

              <span className="mt-1 block text-xs leading-5 text-dark-500">
                Make this category available as an active category
                immediately after creation.
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
            disabled={createCategory.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white transition hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createCategory.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={16} />
                Create Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCategoryCreate;