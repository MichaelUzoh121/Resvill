// import React from "react";
// import FoodCard from "./FoodCard";

// function FoodGrid({
//   foods = [],
//   onAddToCart,
//   columns = "default",
// }) {
//   if (!foods.length) {
//     return (
//       <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-dark-200 bg-dark-50">
//         <p className="text-sm font-medium text-dark-500">
//           No food available at the moment.
//         </p>
//       </div>
//     );
//   }

//   const columnClasses = {
//     default:
//       "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
//     three:
//       "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
//     two:
//       "grid-cols-1 sm:grid-cols-2",
//   };

//   return (
//     <div
//       className={`grid gap-5 sm:gap-6 ${
//         columnClasses[columns] || columnClasses.default
//       }`}
//     >
//       {foods.map((food) => (
//         <FoodCard
//           key={food.id}
//           food={food}
//           onAddToCart={onAddToCart}
//         />
//       ))}
//     </div>
//   );
// }

// export default FoodGrid;




import React from "react";
import FoodCard from "./FoodCard";

function FoodGrid({
  foods = [],
  loading = false,
  error = null,
  onAddToCart,
}) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-dark-100 bg-white"
          >
            <div className="h-56 animate-pulse bg-dark-100 sm:h-60" />

            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-dark-100" />
              <div className="h-4 w-full animate-pulse rounded bg-dark-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-dark-100" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-dark-100" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-dark-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-danger/20 bg-danger/5 px-6 py-10 text-center">
        <h3 className="text-lg font-semibold text-dark-950">
          Unable to load foods
        </h3>

        <p className="mt-2 text-sm text-dark-500">
          Something went wrong while loading the menu. Please try again.
        </p>
      </div>
    );
  }

  if (!foods.length) {
    return (
      <div className="rounded-2xl border border-dark-100 bg-white px-6 py-12 text-center">
        <h3 className="text-lg font-semibold text-dark-950">
          No foods found
        </h3>

        <p className="mt-2 text-sm text-dark-500">
          Try changing your search or filter options.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {foods.map((food) => (
        <FoodCard
          key={food._id || food.id}
          food={food}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default FoodGrid;