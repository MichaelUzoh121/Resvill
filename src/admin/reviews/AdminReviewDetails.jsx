import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  MessageSquareText,
  Package,
  Star,
  User,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useAdminReview,
  useUpdateAdminReviewModeration,
} from "../hooks/useAdminReviews";

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

  return `${parts[0].slice(0, 1)}${parts[
    parts.length - 1
  ].slice(0, 1)}`.toUpperCase();
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

const formatCurrency = (amount, currency = "NGN") => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "—";
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("en-NG")}`;
  }
};

const formatStatus = (status = "") => {
  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function RatingStars({ rating, size = 20 }) {
  const value = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1">
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

function StatusBadge({ approved, visible }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={[
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
          approved
            ? "bg-success/10 text-success"
            : "bg-danger/10 text-danger",
        ].join(" ")}
      >
        {approved ? (
          <CheckCircle2 size={14} />
        ) : (
          <XCircle size={14} />
        )}
        {approved ? "Approved" : "Rejected"}
      </span>

      <span
        className={[
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
          visible
            ? "bg-info/10 text-info"
            : "bg-dark-100 text-dark-600",
        ].join(" ")}
      >
        {visible ? <Eye size={14} /> : <EyeOff size={14} />}
        {visible ? "Visible" : "Hidden"}
      </span>
    </div>
  );
}

function InfoItem({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-dark-400">
        {label}
      </p>

      <div className="mt-1.5 text-sm text-dark-700">
        {children}
      </div>
    </div>
  );
}

function AdminReviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: review,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminReview(id);

  const moderationMutation =
    useUpdateAdminReviewModeration();

  const approved = Boolean(review?.isApproved);
  const visible = Boolean(review?.isVisible);

  const mutationLoading = moderationMutation.isPending;

  const updateModeration = async (
    moderationData,
    successMessage
  ) => {
    if (!id) {
      toast.error("Review ID is missing.");
      return;
    }

    try {
      await moderationMutation.mutateAsync({
        reviewId: id,
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

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            <Loader2
              size={25}
              className="animate-spin text-primary-500"
            />
          </div>

          <p className="text-sm font-medium text-dark-500">
            Loading review...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !review) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => navigate("/admin/reviews")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition hover:text-primary-600"
        >
          <ArrowLeft size={17} />
          Back to Reviews
        </button>

        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <AlertCircle size={20} />
            </div>

            <div>
              <h2 className="font-heading font-bold text-dark-900">
                Failed to load review
              </h2>

              <p className="mt-1 text-sm leading-6 text-dark-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "The requested review could not be loaded."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(review.images)
    ? review.images
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/reviews")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition hover:text-primary-600"
          >
            <ArrowLeft size={17} />
            Back to Reviews
          </button>

          <div className="flex items-start gap-3">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 sm:flex">
              <MessageSquareText size={21} />
            </div>

            <div>
              <h1 className="font-heading text-2xl font-bold text-dark-900">
                Review Details
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-dark-500">
                Review customer feedback, inspect the associated
                order and food, and manage moderation status.
              </p>
            </div>
          </div>
        </div>

        <StatusBadge
          approved={approved}
          visible={visible}
        />
      </div>

      {/* Moderation */}
      <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
        <div className="border-b border-dark-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Eye size={17} />
            </div>

            <div>
              <h2 className="font-heading text-sm font-bold text-dark-900">
                Moderation
              </h2>

              <p className="text-xs text-dark-500">
                Manage approval and customer visibility.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-dark-800">
              Current status
            </p>

            <div className="mt-2">
              <StatusBadge
                approved={approved}
                visible={visible}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={mutationLoading}
              onClick={() =>
                updateModeration(
                  {
                    isApproved: !approved,
                    isVisible: visible,
                  },
                  approved
                    ? "Review rejected."
                    : "Review approved."
                )
              }
              className={[
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                approved
                  ? "border-danger/20 bg-danger/5 text-danger hover:bg-danger/10"
                  : "border-success/20 bg-success/5 text-success hover:bg-success/10",
                "disabled:cursor-not-allowed disabled:opacity-50",
              ].join(" ")}
            >
              {approved ? (
                <XCircle size={17} />
              ) : (
                <CheckCircle2 size={17} />
              )}

              {approved ? "Reject Review" : "Approve Review"}
            </button>

            <button
              type="button"
              disabled={mutationLoading}
              onClick={() =>
                updateModeration(
                  {
                    isApproved: approved,
                    isVisible: !visible,
                  },
                  visible
                    ? "Review hidden."
                    : "Review is now visible."
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {visible ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}

              {visible ? "Hide Review" : "Show Review"}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main */}
        <div className="min-w-0 space-y-6">
          {/* Review */}
          <section className="rounded-2xl border border-dark-100 bg-white shadow-soft">
            <div className="border-b border-dark-100 p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                    Customer Rating
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <RatingStars rating={review.rating} />

                    <span className="rounded-lg bg-accent-400/10 px-2.5 py-1 text-sm font-bold text-dark-800">
                      {Number(review.rating) || 0}/5
                    </span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-dark-400">
                    Submitted
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-dark-700">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <MessageSquareText
                  size={18}
                  className="text-primary-500"
                />

                <h2 className="font-heading text-sm font-bold text-dark-900">
                  Customer Review
                </h2>
              </div>

              <div className="mt-4 rounded-2xl border border-dark-100 bg-dark-50 p-5 sm:p-6">
                <p className="whitespace-pre-wrap text-sm leading-7 text-dark-700">
                  {review.comment || "No comment provided."}
                </p>
              </div>
            </div>
          </section>

          {/* Images */}
          {images.length > 0 && (
            <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <ImageIcon size={17} />
                  </div>

                  <div>
                    <h2 className="font-heading text-sm font-bold text-dark-900">
                      Review Images
                    </h2>

                    <p className="text-xs text-dark-500">
                      {images.length} image
                      {images.length === 1 ? "" : "s"} attached
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image, index) => {
                  const imageUrl =
                    typeof image === "string"
                      ? image
                      : image?.url || image?.secure_url;

                  if (!imageUrl) return null;

                  return (
                    <a
                      key={`${imageUrl}-${index}`}
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative overflow-hidden rounded-xl border border-dark-100 bg-dark-50"
                    >
                      <img
                        src={imageUrl}
                        alt={`Review image ${index + 1}`}
                        className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                        <span className="p-3 text-xs font-semibold text-white">
                          Open image
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* Food */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <UtensilsCrossed size={17} />
              </div>

              <h2 className="font-heading text-sm font-bold text-dark-900">
                Food
              </h2>
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-dark-100 bg-dark-50/50 p-4 sm:flex-row sm:items-center">
              {review.food?.image ? (
                <img
                  src={review.food.image}
                  alt={getFoodName(review)}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-dark-100 text-dark-400">
                  <ImageIcon size={24} />
                </div>
              )}

              <div className="min-w-0">
                <h3 className="font-heading text-base font-bold text-dark-900">
                  {getFoodName(review)}
                </h3>

                {review.food?.price !== undefined && (
                  <p className="mt-1 text-sm font-semibold text-primary-600">
                    {formatCurrency(
                      review.food.price,
                      "NGN"
                    )}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Customer */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <User size={17} />
              </div>

              <h2 className="font-heading text-sm font-bold text-dark-900">
                Customer
              </h2>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-dark-50 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                {getCustomerInitials(review)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-dark-900">
                  {getCustomerName(review)}
                </p>

                {review.user?.email && (
                  <p className="truncate text-xs text-dark-500">
                    {review.user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {review.user?.email && (
                <InfoItem label="Email">
                  <span className="break-all">
                    {review.user.email}
                  </span>
                </InfoItem>
              )}

              {review.user?.phone && (
                <InfoItem label="Phone">
                  {review.user.phone}
                </InfoItem>
              )}
            </div>
          </section>

          {/* Order */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Package size={17} />
              </div>

              <h2 className="font-heading text-sm font-bold text-dark-900">
                Order
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <InfoItem label="Order Number">
                <span className="font-mono text-xs font-semibold text-dark-800">
                  {getOrderNumber(review)}
                </span>
              </InfoItem>

              {review.order?.status && (
                <InfoItem label="Order Status">
                  <span className="inline-flex rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-600">
                    {formatStatus(review.order.status)}
                  </span>
                </InfoItem>
              )}
            </div>
          </section>

          {/* Review Information */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <h2 className="font-heading text-sm font-bold text-dark-900">
              Review Information
            </h2>

            <div className="mt-5 space-y-4">
              <InfoItem label="Created">
                {formatDate(review.createdAt)}
              </InfoItem>

              <InfoItem label="Last Updated">
                {formatDate(review.updatedAt)}
              </InfoItem>

              <InfoItem label="Approval">
                <span
                  className={
                    approved
                      ? "font-semibold text-success"
                      : "font-semibold text-danger"
                  }
                >
                  {approved ? "Approved" : "Rejected"}
                </span>
              </InfoItem>

              <InfoItem label="Visibility">
                <span
                  className={
                    visible
                      ? "font-semibold text-info"
                      : "font-semibold text-dark-600"
                  }
                >
                  {visible ? "Visible" : "Hidden"}
                </span>
              </InfoItem>
            </div>
          </section>

          <Link
            to="/admin/reviews"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm font-semibold text-dark-700 shadow-soft transition hover:border-dark-300 hover:bg-dark-50"
          >
            <ArrowLeft size={17} />
            Back to Reviews
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default AdminReviewDetails;