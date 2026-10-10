import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Star,
  X,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useAdminReviews,
  useUpdateAdminReviewModeration,
} from "../hooks/useAdminReviews";

const APPROVAL_OPTIONS = [
  { value: "all", label: "All approval statuses" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const VISIBILITY_OPTIONS = [
  { value: "all", label: "All visibility" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
];

const RATING_OPTIONS = [
  { value: "", label: "All ratings" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
];

const PAGE_LIMIT = 20;

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getCustomerName = (review) => {
  const user = review?.user;

  if (!user) return "Guest";

  const name = [user.firstname, user.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || user.name || user.email || "Customer";
};

const getCustomerInitials = (review) => {
  const name = getCustomerName(review);

  if (!name || name === "Guest") {
    return "G";
  }

  const parts = name.split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(
    0,
    1
  )}`.toUpperCase();
};

const getFoodName = (review) => {
  if (!review?.food) return "—";

  if (typeof review.food === "string") {
    return review.food;
  }

  return review.food.name || "—";
};

const getOrderNumber = (review) => {
  if (!review?.order) return "—";

  if (typeof review.order === "string") {
    return review.order;
  }

  return (
    review.order.orderNumber ||
    review.order.reference ||
    review.order._id ||
    "—"
  );
};

function RatingStars({ rating, size = 14 }) {
  const value = Number(rating) || 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= value
              ? "fill-accent-500 text-accent-500"
              : "text-dark-300"
          }
        />
      ))}
    </div>
  );
}

function StatusBadge({ approved }) {
  if (approved) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
        <CheckCircle2 size={13} />
        Approved
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
      <XCircle size={13} />
      Rejected
    </span>
  );
}

function VisibilityBadge({ visible }) {
  if (visible) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-2.5 py-1 text-xs font-semibold text-info">
        <Eye size={13} />
        Visible
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-dark-100 px-2.5 py-1 text-xs font-semibold text-dark-600">
      <EyeOff size={13} />
      Hidden
    </span>
  );
}

function AdminReviews() {
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("all");
  const [visibilityStatus, setVisibilityStatus] = useState("all");
  const [rating, setRating] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      approvalStatus,
      visibilityStatus,
      rating: rating || undefined,
      page,
      limit: PAGE_LIMIT,
    }),
    [search, approvalStatus, visibilityStatus, rating, page]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminReviews(queryParams);

  const moderationMutation =
    useUpdateAdminReviewModeration();

  const reviews = useMemo(() => {
    if (Array.isArray(data)) return data;

    return Array.isArray(data?.reviews)
      ? data.reviews
      : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.results)
          ? data.results
          : [];
  }, [data]);

  const pagination = data?.pagination || {};

  const currentPage =
    Number(pagination.page) || page;

  const totalPages = Math.max(
    Number(
      pagination.totalPages ??
        pagination.pages ??
        Math.ceil(
          Number(
            pagination.total ??
              data?.total ??
              reviews.length
          ) / PAGE_LIMIT
        )
    ) || 1,
    1
  );

  const totalReviews = Number(
    pagination.total ??
      pagination.totalReviews ??
      data?.total ??
      reviews.length
  );

  const activeFilterCount = [
    approvalStatus !== "all",
    visibilityStatus !== "all",
    Boolean(rating),
  ].filter(Boolean).length;

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleApprovalChange = (event) => {
    setApprovalStatus(event.target.value);
    setPage(1);
  };

  const handleVisibilityChange = (event) => {
    setVisibilityStatus(event.target.value);
    setPage(1);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setApprovalStatus("all");
    setVisibilityStatus("all");
    setRating("");
    setPage(1);
  };

  const updateModeration = async (
    review,
    moderationData,
    successMessage
  ) => {
    const reviewId = review?._id || review?.id;

    if (!reviewId) {
      toast.error("Review ID is missing.");
      return;
    }

    try {
      await moderationMutation.mutateAsync({
        reviewId,
        moderationData,
      });

      toast.success(successMessage);
    } catch (mutationError) {
      toast.error(
        mutationError?.response?.data?.message ||
          mutationError?.message ||
          "Failed to update review."
      );
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Star size={21} />
            </div>

            <div>
              <h1 className="font-heading text-2xl font-bold text-dark-900">
                Reviews
              </h1>

              <p className="mt-0.5 text-sm text-dark-500">
                Manage customer feedback, moderation and
                visibility.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-dark-100 bg-white p-4 shadow-soft sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-50 text-dark-600">
              <Filter size={15} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-dark-800">
                Review Filters
              </h2>

              <p className="text-xs text-dark-500">
                Narrow down customer reviews.
              </p>
            </div>

            {activeFilterCount > 0 && (
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-bold text-primary-600">
                {activeFilterCount} active
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-dark-500 transition hover:text-primary-600 sm:self-auto"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(280px,1fr)_200px_200px_160px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search reviews, customers or food..."
              className="h-11 w-full rounded-xl border border-dark-200 bg-white pl-10 pr-4 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
            />
          </div>

          <select
            value={approvalStatus}
            onChange={handleApprovalChange}
            className="h-11 rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
          >
            {APPROVAL_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={visibilityStatus}
            onChange={handleVisibilityChange}
            className="h-11 rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
          >
            {VISIBILITY_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={rating}
            onChange={handleRatingChange}
            className="h-11 rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
          >
            {RATING_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <AlertCircle size={18} />
            </div>

            <div>
              <h3 className="font-semibold text-dark-900">
                Failed to load reviews
              </h3>

              <p className="mt-1 text-sm text-dark-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong while loading reviews."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <Loader2
                size={24}
                className="animate-spin text-primary-500"
              />
            </div>

            <p className="text-sm font-medium text-dark-500">
              Loading reviews...
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          {/* Table Header */}
          <div className="flex flex-col gap-2 border-b border-dark-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-dark-900">
                Customer Reviews
              </h2>

              <p className="mt-0.5 text-xs text-dark-500">
                {totalReviews.toLocaleString("en-NG")} review
                {totalReviews === 1 ? "" : "s"} found
              </p>
            </div>

            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 text-xs font-medium text-dark-500">
                <Loader2
                  size={14}
                  className="animate-spin text-primary-500"
                />
                Updating...
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-50 text-dark-400">
                <Star size={28} />
              </div>

              <h3 className="mt-5 font-heading text-base font-bold text-dark-800">
                No reviews found
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-dark-500">
                There are no customer reviews matching your
                current filters.
              </p>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-[1300px] w-full">
                  <thead>
                    <tr className="border-b border-dark-100 bg-dark-50/70">
                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Customer
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Food
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Rating
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Review
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Approval
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Visibility
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Date
                      </th>

                      <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-dark-100">
                    {reviews.map((review) => {
                      const reviewId =
                        review?._id || review?.id;

                      const approved = Boolean(
                        review?.isApproved
                      );

                      const visible = Boolean(
                        review?.isVisible
                      );

                      const mutationLoading =
                        moderationMutation.isPending &&
                        moderationMutation.variables
                          ?.reviewId === reviewId;

                      return (
                        <tr
                          key={reviewId}
                          className="group align-top transition hover:bg-dark-50/40"
                        >
                          {/* Customer */}
                          <td className="px-5 py-4">
                            <div className="flex min-w-[190px] items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                                {getCustomerInitials(review)}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-dark-800">
                                  {getCustomerName(review)}
                                </p>

                                {review?.user?.email && (
                                  <p className="mt-0.5 max-w-[180px] truncate text-xs text-dark-500">
                                    {review.user.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Food */}
                          <td className="px-5 py-4">
                            <div className="min-w-[170px]">
                              <p className="text-sm font-semibold text-dark-800">
                                {getFoodName(review)}
                              </p>

                              {review?.order && (
                                <p className="mt-1 text-xs text-dark-500">
                                  Order:{" "}
                                  <span className="font-medium text-dark-600">
                                    {getOrderNumber(review)}
                                  </span>
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Rating */}
                          <td className="px-5 py-4">
                            <div className="flex min-w-[100px] flex-col gap-1.5">
                              <RatingStars
                                rating={review?.rating}
                              />

                              <span className="text-xs font-medium text-dark-500">
                                {Number(review?.rating) || 0}/5
                              </span>
                            </div>
                          </td>

                          {/* Review */}
                          <td className="px-5 py-4">
                            <div className="max-w-[300px]">
                              <p className="line-clamp-3 text-sm leading-6 text-dark-600">
                                {review?.comment ||
                                  "No comment"}
                              </p>
                            </div>
                          </td>

                          {/* Approval */}
                          <td className="px-5 py-4">
                            <StatusBadge approved={approved} />
                          </td>

                          {/* Visibility */}
                          <td className="px-5 py-4">
                            <VisibilityBadge
                              visible={visible}
                            />
                          </td>

                          {/* Date */}
                          <td className="whitespace-nowrap px-5 py-4">
                            <p className="text-sm font-medium text-dark-700">
                              {formatDate(review?.createdAt)}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex min-w-[255px] items-center justify-end gap-2">
                              <Link
                                to={`/admin/reviews/${reviewId}`}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dark-200 bg-white px-3 text-xs font-semibold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50"
                              >
                                <Eye size={14} />
                                View
                              </Link>

                              <button
                                type="button"
                                disabled={mutationLoading}
                                onClick={() =>
                                  updateModeration(
                                    review,
                                    {
                                      isApproved: !approved,
                                      isVisible: visible,
                                    },
                                    approved
                                      ? "Review rejected."
                                      : "Review approved."
                                  )
                                }
                                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                  approved
                                    ? "border border-danger/20 bg-danger/5 text-danger hover:bg-danger/10"
                                    : "bg-primary-500 text-white hover:bg-primary-600"
                                }`}
                              >
                                {mutationLoading ? (
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : approved ? (
                                  <XCircle size={14} />
                                ) : (
                                  <CheckCircle2 size={14} />
                                )}

                                {approved
                                  ? "Reject"
                                  : "Approve"}
                              </button>

                              <button
                                type="button"
                                disabled={mutationLoading}
                                onClick={() =>
                                  updateModeration(
                                    review,
                                    {
                                      isApproved: approved,
                                      isVisible: !visible,
                                    },
                                    visible
                                      ? "Review hidden."
                                      : "Review is now visible."
                                  )
                                }
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dark-200 bg-white px-3 text-xs font-semibold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {mutationLoading ? (
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : visible ? (
                                  <EyeOff size={14} />
                                ) : (
                                  <Eye size={14} />
                                )}

                                {visible ? "Hide" : "Show"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-dark-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-dark-500">
                    Page{" "}
                    <span className="font-semibold text-dark-700">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-dark-700">
                      {totalPages}
                    </span>

                    {pagination.total !== undefined && (
                      <>
                        <span className="mx-1.5 text-dark-300">
                          ·
                        </span>
                        {pagination.total.toLocaleString(
                          "en-NG"
                        )}{" "}
                        total reviews
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={
                      currentPage <= 1 || isFetching
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-dark-200 bg-white px-3 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={
                      currentPage >= totalPages ||
                      isFetching
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-dark-200 bg-white px-3 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default AdminReviews;