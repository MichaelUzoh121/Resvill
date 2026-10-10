import React from "react";
import { Star, User } from "lucide-react";

import { useFoodReviews } from "../hooks/useReviews";

function FoodReviews({ foodId }) {
  const {
    reviews,
    summary,
    isLoading,
    isError,
  } = useFoodReviews(foodId);

  if (isLoading) {
    return (
      <section className="mt-10 rounded-3xl bg-white p-6 shadow-soft">
        <div className="h-7 w-40 animate-pulse rounded bg-dark-100" />

        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-dark-100 p-4"
            >
              <div className="h-4 w-32 animate-pulse rounded bg-dark-100" />
              <div className="mt-3 h-12 w-full animate-pulse rounded bg-dark-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <section className="mt-10 rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-dark-950">
            Customer Reviews
          </h2>

          <div className="mt-3 flex items-center gap-2">
            <Star
              size={18}
              className="fill-primary-500 text-primary-500"
            />

            <span className="text-lg font-bold text-dark-950">
              {Number(summary.averageRating || 0).toFixed(1)}
            </span>

            <span className="text-sm text-dark-500">
              ({summary.totalReviews || 0} reviews)
            </span>
          </div>
        </div>

        {summary.totalReviews > 0 && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                className="flex items-center gap-2 text-xs text-dark-500"
              >
                <span className="w-8">{rating} ★</span>

                <div className="h-2 w-24 overflow-hidden rounded-full bg-dark-100">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{
                      width: `${
                        (Number(summary.ratingBreakdown?.[rating] || 0) /
                          Number(summary.totalReviews || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <span>
                  {summary.ratingBreakdown?.[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-dark-50 p-6 text-center">
          <p className="text-sm text-dark-500">
            No reviews yet. Be the first to review this food.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((review) => {
            const reviewer = review.user;

            const reviewerName =
              `${reviewer?.firstname || ""} ${
                reviewer?.lastname || ""
              }`.trim() || "Customer";

            return (
              <article
                key={review.id || review._id}
                className="rounded-2xl border border-dark-100 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                      <User size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-dark-900">
                        {reviewerName}
                      </p>

                      <p className="text-xs text-dark-400">
                        {review.createdAt
                          ? new Date(
                              review.createdAt
                            ).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-primary-500 text-primary-500"
                    />

                    <span className="text-sm font-bold text-dark-800">
                      {review.rating}
                    </span>
                  </div>
                </div>

                {review.comment && (
                  <p className="mt-4 text-sm leading-7 text-dark-600">
                    {review.comment}
                  </p>
                )}

                {Array.isArray(review.images) &&
                  review.images.length > 0 && (
                    <div className="mt-4 flex gap-3 overflow-x-auto">
                      {review.images.map((image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt={`${reviewerName} review ${index + 1}`}
                          className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default FoodReviews;