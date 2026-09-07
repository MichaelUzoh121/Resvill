import React from "react";

function FoodCategory({ category }) {
  if (!category) return null;

  return (
    <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-600">
      {category}
    </span>
  );
}

export default FoodCategory;

