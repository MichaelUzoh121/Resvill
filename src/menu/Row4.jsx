// import React from "react";
// import FoodCard from "../food/FoodCard";
// import foods from "../data/foods";

// function Row4({ onAddToCart }) {
//   return (
//     <section className="py-8">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="mb-6 flex items-end justify-between gap-4">
//           <div>
//             <p className="text-sm font-semibold text-primary-500">
//               Our Menu
//             </p>

//             <h2 className="mt-1 font-heading text-2xl font-bold text-dark-950 sm:text-3xl">
//               Explore Our Food
//             </h2>
//           </div>

//           <p className="text-sm text-dark-500">
//             {foods.length} items
//           </p>
//         </div>

//         {/* Food Grid */}
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {foods.map((food) => (
//             <FoodCard
//               key={food.id}
//               food={food}
//               onAddToCart={onAddToCart}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Row4;





// import React from "react";

// import FoodGrid from "../food/FoodGrid";

// function Row4({
//   foods = [],
//   loading = false,
//   error = null,
// }) {
//   return (
//     <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-6 flex items-end justify-between gap-4">
//           <div>
//             <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary-500">
//               Our menu
//             </p>

//             <h2 className="text-2xl font-bold text-dark-950 sm:text-3xl">
//               Delicious meals, made for you
//             </h2>

//             <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
//               Explore our available meals and find something you'll love.
//             </p>
//           </div>
//         </div>

//         <FoodGrid
//           foods={foods}
//           loading={loading}
//           error={error}
//         />
//       </div>
//     </section>
//   );
// }

// export default Row4;


import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import FoodGrid from "../food/FoodGrid";

function Row4({
  foods = [],
  loading = false,
  error = null,
  pagination = {},
  onPageChange,
}) {
  const currentPage = Number(pagination?.page) || 1;
  const totalPages = Number(pagination?.pages) || 0;

  const hasPagination = totalPages > 1;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
    }
  };

  return (
    <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary-500">
              Our menu
            </p>

            <h2 className="text-2xl font-bold text-dark-950 sm:text-3xl">
              Delicious meals, made for you
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
              Explore our available meals and find something
              you'll love.
            </p>
          </div>
        </div>

        <FoodGrid
          foods={foods}
          loading={loading}
          error={error}
        />

        {!loading && !error && hasPagination && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage <= 1}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-semibold text-dark-700 transition-colors hover:border-primary-300 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <div className="flex h-11 items-center rounded-xl bg-dark-50 px-4 text-sm font-semibold text-dark-700">
              Page {currentPage} of {totalPages}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-semibold text-dark-700 transition-colors hover:border-primary-300 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Row4;