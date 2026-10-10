import React, { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { useCreateReview } from "../hooks/useReviews";

function ReviewForm({ foodId, orderId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const createReviewMutation = useCreateReview();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!foodId || !orderId) {
      toast.error("Unable to submit this review.");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      toast.error("Please write a review.");
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        foodId,
        orderId,
        rating,
        comment: trimmedComment,
      });

      toast.success("Review submitted successfully.");

      setRating(0);
      setComment("");

      onSuccess?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit review."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-dark-100 bg-white p-5"
    >
      <h3 className="font-heading text-lg font-extrabold text-dark-950">
        Write a Review
      </h3>

      <div className="mt-4">
        <p className="text-sm font-semibold text-dark-700">
          Your rating
        </p>

        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star`}
              aria-pressed={value === rating}
              className="rounded-md p-1 transition hover:scale-105"
            >
              <Star
                size={22}
                className={
                  value <= rating
                    ? "fill-primary-500 text-primary-500"
                    : "text-dark-300"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="review-comment"
          className="text-sm font-semibold text-dark-700"
        >
          Your review
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Tell us what you thought about this food..."
          className="mt-2 w-full rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
        />

        <p className="mt-1 text-right text-xs text-dark-400">
          {comment.length}/1000
        </p>
      </div>

      <button
        type="submit"
        disabled={createReviewMutation.isPending}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {createReviewMutation.isPending && (
          <Loader2
            size={16}
            className="animate-spin"
          />
        )}

        {createReviewMutation.isPending
          ? "Submitting..."
          : "Submit Review"}
      </button>
    </form>
  );
}

export default ReviewForm;

