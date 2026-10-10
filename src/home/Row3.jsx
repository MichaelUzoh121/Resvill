
// import React from "react";
// import { Link } from "react-router-dom";
// import { ArrowUpRight } from "lucide-react";
// import { categories } from "../data/categories";

// function Row3() {
//   return (
//     <section className="bg-white py-20 sm:py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="mb-10 flex items-end justify-between gap-6">
//           <div>
//             <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
//               Explore our menu
//             </span>

//             <h2 className="text-3xl font-bold tracking-tight text-dark-900 sm:text-4xl lg:text-5xl">
//               Browse by <span className="text-primary-500">category</span>
//             </h2>

//             <p className="mt-4 max-w-xl text-sm leading-7 text-dark-600 sm:text-base">
//               From hearty breakfasts to delicious desserts, find exactly what
//               you&apos;re craving.
//             </p>
//           </div>

//           <Link
//             to="/menu"
//             className="hidden shrink-0 items-center gap-2 text-sm font-bold text-dark-900 transition-colors hover:text-primary-500 sm:flex"
//           >
//             View all
//             <ArrowUpRight size={17} />
//           </Link>
//         </div>

//         {/* Categories */}
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
//           {categories.map((category) => (
//             <Link
//               key={category.id}
//               to={`/menu?category=${category.name.toLowerCase()}`}
//               className="group relative overflow-hidden rounded-2xl bg-dark-100"
//             >
//               {/* Image */}
//               <div className="aspect-[1.15/1] overflow-hidden">
//                 <img
//                   src={category.image}
//                   alt={category.name}
//                   className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
//                 />
//               </div>

//               {/* Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-dark-950/85 via-dark-950/20 to-transparent" />

//               {/* Content */}
//               <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
//                 <div className="flex items-end justify-between gap-2">
//                   <div>
//                     <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
//                       {category.name}
//                     </h3>

//                     <p className="mt-1 text-xs text-white/75 sm:text-sm">
//                       {category.description}
//                     </p>
//                   </div>

//                   <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-dark-900 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-white">
//                     <ArrowUpRight size={16} />
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Mobile View All */}
//         <Link
//           to="/menu"
//           className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-dark-900 sm:hidden"
//         >
//           View all categories
//           <ArrowUpRight size={17} />
//         </Link>
//       </div>
//     </section>
//   );
// }

// export default Row3;



import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { useCategories } from "../hooks/useCategories";

function Row3() {
  const {
    data,
    isLoading,
    isError,
  } = useCategories();

  const categories = Array.isArray(data?.data)
    ? data.data
    : [];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
              Explore our menu
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-dark-900 sm:text-4xl lg:text-5xl">
              Browse by{" "}
              <span className="text-primary-500">
                category
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-dark-600 sm:text-base">
              From hearty breakfasts to delicious desserts,
              find exactly what you're craving.
            </p>
          </div>

          <Link
            to="/menu"
            className="hidden shrink-0 items-center gap-2 text-sm font-bold text-dark-900 transition-colors hover:text-primary-500 sm:flex"
          >
            View all
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-dark-100"
              >
                <div className="aspect-[1.15/1] animate-pulse bg-dark-100" />

                <div className="space-y-2 p-4">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-dark-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-dark-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-2xl border border-danger/20 bg-danger/5 px-6 py-10 text-center">
            <h3 className="text-lg font-semibold text-dark-950">
              Unable to load categories
            </h3>

            <p className="mt-2 text-sm text-dark-500">
              Something went wrong while loading the menu
              categories.
            </p>
          </div>
        )}

        {/* Categories */}
        {!isLoading && !isError && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/menu?category=${encodeURIComponent(
                  category.slug,
                )}`}
                className="group relative overflow-hidden rounded-2xl bg-dark-100"
              >
                {/* Image */}
                <div className="aspect-[1.15/1] overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-dark-100 text-sm font-medium text-dark-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/85 via-dark-950/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="mt-1 text-xs text-white/75 sm:text-sm">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-dark-900 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-white">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          categories.length === 0 && (
            <div className="rounded-2xl border border-dark-100 bg-dark-50 px-6 py-10 text-center">
              <h3 className="text-lg font-semibold text-dark-950">
                No categories available
              </h3>

              <p className="mt-2 text-sm text-dark-500">
                There are currently no menu categories to
                display.
              </p>
            </div>
          )}

        {/* Mobile View All */}
        <Link
          to="/menu"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-dark-900 sm:hidden"
        >
          View all categories
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export default Row3;