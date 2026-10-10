// import React from "react";

// function FoodCategory({ category }) {
//   if (!category) return null;

//   return (
//     <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-600">
//       {category}
//     </span>
//   );
// }

// export default FoodCategory;



import React from "react";

function FoodCategory({ category }) {
  if (!category) return null;

  const categoryName =
    typeof category === "object"
      ? category.name
      : category;

  if (!categoryName) return null;

  return (
    <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-600">
      {categoryName}
    </span>
  );
}

export default FoodCategory;