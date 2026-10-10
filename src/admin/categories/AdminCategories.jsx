import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  FolderOpen,
  ImageOff,
  Loader2,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  useAdminCategories,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from "../hooks/useAdminCategories";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function AdminCategories() {
  const { data, isLoading, isError, error } = useAdminCategories();

  const updateCategory = useUpdateAdminCategory();
  const deleteCategory = useDeleteAdminCategory();

  const [deletingId, setDeletingId] = useState(null);

  const categories = Array.isArray(data)
    ? data
    : data?.categories || [];

  const activeCategories = categories.filter(
    (category) => category.isActive,
  ).length;

  const inactiveCategories = categories.filter(
    (category) => !category.isActive,
  ).length;

  const handleToggleStatus = async (category) => {
    try {
      await updateCategory.mutateAsync({
        categoryId: category._id,
        categoryData: {
          isActive: !category.isActive,
        },
      });

      toast.success(
        category.isActive
          ? "Category deactivated."
          : "Category activated.",
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update category status.",
      );
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(category._id);

      await deleteCategory.mutateAsync(category._id);

      toast.success("Category deleted successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete category.",
      );
    } finally {
      setDeletingId(null);
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
            Loading categories
          </p>

          <p className="mt-1 text-xs text-dark-500">
            Please wait while we fetch your food categories.
          </p>
        </div>
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
              <FolderOpen size={13} />
              Menu Management
            </div>

            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark-900 sm:text-3xl">
              Categories
            </h1>

            <p className="mt-2 text-sm leading-6 text-dark-500">
              Organize the food catalogue with manageable menu
              categories.
            </p>
          </div>
        </section>

        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-danger/10 bg-white px-6 text-center shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertCircle size={27} />
          </div>

          <h2 className="mt-4 font-heading text-base font-bold text-dark-900">
            Failed to load categories
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-dark-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while loading categories."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white px-6 py-7 shadow-soft sm:px-8">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary-50 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-500">
              <FolderOpen size={13} />
              Menu Management
            </div>

            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark-900 sm:text-3xl">
              Categories
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
              Create, organize and manage the categories used across
              the Resvill food catalogue.
            </p>
          </div>

          <Link
            to="/admin/categories/create"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white shadow-soft transition hover:bg-primary-600 hover:shadow-hover"
          >
            <Plus size={17} />
            Create Category
          </Link>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-dark-400">
                Total Categories
              </p>

              <p className="mt-2 font-heading text-2xl font-extrabold text-dark-900">
                {categories.length}
              </p>

              <p className="mt-1 text-xs text-dark-500">
                Categories currently available
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <FolderOpen size={19} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-dark-400">
                Active
              </p>

              <p className="mt-2 font-heading text-2xl font-extrabold text-dark-900">
                {activeCategories}
              </p>

              <p className="mt-1 text-xs text-dark-500">
                Categories currently active
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircle2 size={19} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-dark-400">
                Inactive
              </p>

              <p className="mt-2 font-heading text-2xl font-extrabold text-dark-900">
                {inactiveCategories}
              </p>

              <p className="mt-1 text-xs text-dark-500">
                Categories currently hidden
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <XCircle size={19} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length === 0 ? (
        <section className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dark-100 bg-white px-6 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
            <FolderOpen size={30} />
          </div>

          <h2 className="mt-5 font-heading text-lg font-bold text-dark-900">
            No categories found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-dark-500">
            You haven't created any food categories yet. Create
            your first category to start organizing the menu.
          </p>

          <Link
            to="/admin/categories/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
          >
            <Plus size={16} />
            Create Category
          </Link>
        </section>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card">
          <div className="border-b border-dark-100 px-5 py-5 sm:px-6">
            <h2 className="font-heading text-base font-bold text-dark-900">
              Category Catalogue
            </h2>

            <p className="mt-1 text-xs text-dark-500">
              Manage category details, visibility and ordering.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50/70 text-left">
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Category
                  </th>

                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Description
                  </th>

                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Sort Order
                  </th>

                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Created
                  </th>

                  <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-dark-100">
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="group transition hover:bg-primary-50/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-dark-50 ring-1 ring-dark-100">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-dark-400">
                              <ImageOff size={19} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-dark-900">
                            {category.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-dark-400">
                            {category.slug || "No slug"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-xs px-5 py-4">
                      <p className="truncate text-sm text-dark-600">
                        {category.description || "No description"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-dark-50 px-2 text-xs font-bold text-dark-700">
                        {Number(category.sortOrder || 0)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {category.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/10 bg-success/10 px-2.5 py-1.5 text-[11px] font-bold text-success">
                          <CheckCircle2 size={13} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/10 bg-danger/10 px-2.5 py-1.5 text-[11px] font-bold text-danger">
                          <XCircle size={13} />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-dark-600">
                      {formatDate(category.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/categories/${category._id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3 text-xs font-bold text-dark-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500"
                        >
                          <Edit3 size={14} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(category)
                          }
                          disabled={updateCategory.isPending}
                          className="inline-flex h-9 items-center rounded-xl border border-dark-200 bg-white px-3 text-xs font-bold text-dark-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {category.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={
                            deletingId === category._id
                          }
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-danger/20 bg-white px-3 text-xs font-bold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === category._id ? (
                            <>
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                              Deleting
                            </>
                          ) : (
                            <>
                              <Trash2 size={14} />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminCategories;