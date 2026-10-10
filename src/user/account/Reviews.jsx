// import React from "react";
// import { Star, MessageSquare } from "lucide-react";

// import FoodImage from "../../components/food/FoodImage";

// import {
//   useMyReviews,
//   useUpdateReview,
//   useDeleteReview,
// } from "../../hooks/useReviews";

// function Reviews() {
//   const { reviews, isLoading, isError } = useMyReviews();

//   const [editingReview, setEditingReview] = useState(null);
//   const [editRating, setEditRating] = useState(0);
//   const [editComment, setEditComment] = useState("");

//   const updateReviewMutation = useUpdateReview();
//   const deleteReviewMutation = useDeleteReview();

//   const startEditing = (review) => {
//     setEditingReview(review);
//     setEditRating(review.rating || 0);
//     setEditComment(review.comment || "");
//   };

//   const cancelEditing = () => {
//     setEditingReview(null);
//     setEditRating(0);
//     setEditComment("");
//   };

//   const handleUpdate = async (event) => {
//     event.preventDefault();

//     if (!editRating) {
//       toast.error("Please select a rating.");
//       return;
//     }

//     try {
//       await updateReviewMutation.mutateAsync({
//         reviewId: editingReview.id || editingReview._id,
//         reviewData: {
//           rating: editRating,
//           comment: editComment.trim(),
//         },
//       });

//       toast.success("Review updated successfully.");
//       cancelEditing();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to update review.");
//     }
//   };

//   const handleDelete = async (review) => {
//     const reviewId = review.id || review._id;

//     if (!window.confirm("Delete this review?")) {
//       return;
//     }

//     try {
//       await deleteReviewMutation.mutateAsync(reviewId);

//       toast.success("Review deleted successfully.");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to delete review.");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         {[1, 2, 3].map((item) => (
//           <div
//             key={item}
//             className="h-36 animate-pulse rounded-2xl bg-dark-100"
//           />
//         ))}
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
//         Failed to load your reviews.
//       </div>
//     );
//   }

//   if (!reviews.length) {
//     return (
//       <div className="rounded-2xl border border-dark-100 bg-white p-10 text-center">
//         <MessageSquare size={32} className="mx-auto text-dark-300" />

//         <h2 className="mt-4 font-heading text-lg font-extrabold text-dark-950">
//           No reviews yet
//         </h2>

//         <p className="mt-2 text-sm text-dark-500">
//           Reviews you submit for your orders will appear here.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="font-heading text-2xl font-extrabold text-dark-950">
//           My Reviews
//         </h1>

//         <p className="mt-1 text-sm text-dark-500">
//           Reviews you have submitted for your orders.
//         </p>
//       </div>

//       <div className="space-y-4">
//         {reviews.map((review) => {
//           const food = typeof review.food === "object" ? review.food : null;

//           return (
//             <article
//               key={review.id || review._id}
//               className="rounded-2xl border border-dark-100 bg-white p-5"
//             >
//               <div className="flex gap-4">
//                 {food?.image ? (
//                   <FoodImage
//                     src={food.image}
//                     alt={food.name || "Food"}
//                     className="h-20 w-20 shrink-0 rounded-xl"
//                   />
//                 ) : (
//                   <div className="h-20 w-20 shrink-0 rounded-xl bg-dark-50" />
//                 )}

//                 <div className="min-w-0 flex-1">
//                   <h2 className="font-bold text-dark-950">
//                     {food?.name || "Food item"}
//                   </h2>

//                   <div className="mt-2 flex items-center gap-1">
//                     {Array.from({ length: 5 }).map((_, index) => (
//                       <Star
//                         key={index}
//                         size={15}
//                         className={
//                           index < review.rating
//                             ? "fill-primary-500 text-primary-500"
//                             : "text-dark-300"
//                         }
//                       />
//                     ))}

//                     <span className="ml-1 text-xs text-dark-500">
//                       {review.rating}/5
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {review.comment && (
//                 <p className="mt-4 text-sm leading-6 text-dark-600">
//                   {review.comment}
//                 </p>
//               )}

//               <p className="mt-4 text-xs text-dark-400">
//                 {new Date(review.createdAt).toLocaleDateString("en-NG", {
//                   day: "numeric",
//                   month: "short",
//                   year: "numeric",
//                 })}
//               </p>

//               <div className="mt-4 flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => startEditing(review)}
//                   className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-3 py-2 text-xs font-bold text-dark-700 transition hover:border-primary-300 hover:text-primary-600"
//                 >
//                   <Pencil size={14} />
//                   Edit
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => handleDelete(review)}
//                   disabled={deleteReviewMutation.isPending}
//                   className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
//                 >
//                   {deleteReviewMutation.isPending ? (
//                     <Loader2 size={14} className="animate-spin" />
//                   ) : (
//                     <Trash2 size={14} />
//                   )}
//                   Delete
//                 </button>
//               </div>
//             </article>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Reviews;





import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import FoodImage from "../../food/FoodImage";

import {
  useMyReviews,
  useUpdateReview,
  useDeleteReview,
} from "../../hooks/useReviews";

function Reviews() {
  const { reviews, isLoading, isError } = useMyReviews();

  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const startEditing = (review) => {
    setEditingReview(review);
    setEditRating(review.rating || 0);
    setEditComment(review.comment || "");
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditComment("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editRating) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      await updateReviewMutation.mutateAsync({
        reviewId: editingReview.id || editingReview._id,
        reviewData: {
          rating: editRating,
          comment: editComment.trim(),
        },
      });

      toast.success("Review updated successfully.");
      cancelEditing();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update review."
      );
    }
  };

  const handleDelete = async (review) => {
    const reviewId = review.id || review._id;

    if (!window.confirm("Delete this review?")) {
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync(reviewId);

      toast.success("Review deleted successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete review."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl bg-dark-100"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        Failed to load your reviews.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold text-dark-950">
          My Reviews
        </h1>

        <p className="mt-1 text-sm text-dark-500">
          Reviews you have submitted for your orders.
        </p>
      </div>

      {editingReview && (
        <form
          onSubmit={handleUpdate}
          className="mb-6 rounded-2xl border border-dark-100 bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-extrabold text-dark-950">
              Edit Review
            </h2>

            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-lg p-2 text-dark-400 transition hover:bg-dark-50 hover:text-dark-700"
              aria-label="Cancel editing"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-dark-700">
              Your rating
            </p>

            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEditRating(value)}
                  aria-label={`${value} star`}
                  className="rounded-md p-1"
                >
                  <Star
                    size={22}
                    className={
                      value <= editRating
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
              htmlFor="edit-review-comment"
              className="text-sm font-semibold text-dark-700"
            >
              Your review
            </label>

            <textarea
              id="edit-review-comment"
              value={editComment}
              onChange={(event) =>
                setEditComment(event.target.value)
              }
              rows={4}
              maxLength={1000}
              placeholder="Update your review..."
              className="mt-2 w-full rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={updateReviewMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateReviewMutation.isPending && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {updateReviewMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={cancelEditing}
              disabled={updateReviewMutation.isPending}
              className="rounded-xl border border-dark-200 px-5 py-3 text-sm font-bold text-dark-700 transition hover:bg-dark-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!reviews.length ? (
        <div className="rounded-2xl border border-dark-100 bg-white p-10 text-center">
          <MessageSquare
            size={32}
            className="mx-auto text-dark-300"
          />

          <h2 className="mt-4 font-heading text-lg font-extrabold text-dark-950">
            No reviews yet
          </h2>

          <p className="mt-2 text-sm text-dark-500">
            Reviews you submit for your orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const food =
              typeof review.food === "object"
                ? review.food
                : null;

            return (
              <article
                key={review.id || review._id}
                className="rounded-2xl border border-dark-100 bg-white p-5"
              >
                <div className="flex gap-4">
                  {food?.image ? (
                    <FoodImage
                      src={food.image}
                      alt={food.name || "Food"}
                      className="h-20 w-20 shrink-0 rounded-xl"
                    />
                  ) : (
                    <div className="h-20 w-20 shrink-0 rounded-xl bg-dark-50" />
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-dark-950">
                      {food?.name || "Food item"}
                    </h2>

                    <div className="mt-2 flex items-center gap-1">
                      {Array.from({ length: 5 }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            size={15}
                            className={
                              index < review.rating
                                ? "fill-primary-500 text-primary-500"
                                : "text-dark-300"
                            }
                          />
                        )
                      )}

                      <span className="ml-1 text-xs text-dark-500">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <p className="mt-4 text-sm leading-6 text-dark-600">
                    {review.comment}
                  </p>
                )}

                <p className="mt-4 text-xs text-dark-400">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(review)}
                    className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-3 py-2 text-xs font-bold text-dark-700 transition hover:border-primary-300 hover:text-primary-600"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(review)}
                    disabled={deleteReviewMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleteReviewMutation.isPending ? (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={14} />
                    )}

                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Reviews;

