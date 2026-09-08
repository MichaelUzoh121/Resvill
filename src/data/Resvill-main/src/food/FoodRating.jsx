import React from "react";
import { Star } from "lucide-react";

function FoodRating({ rating = 0, reviews = 0 }) {
  return (
    <div className="flex items-center gap-1.5">
      <Star
        size={15}
        className="fill-primary-500 text-primary-500"
      />

      <span className="text-sm font-bold text-dark-800">
        {rating.toFixed(1)}
      </span>

      {reviews > 0 && (
        <span className="text-xs text-dark-500">
          ({reviews})
        </span>
      )}
    </div>
  );
}

export default FoodRating;

