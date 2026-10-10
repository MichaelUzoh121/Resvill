// import React from "react";
// import { Link, useParams } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// import foods from "../data/foods";
// import FoodCustomizer from "./FoodCustomizer";
// import FoodImage from "./FoodImage";
// import FoodPrice from "./FoodPrice";
// import FoodRating from "./FoodRating";
// import FoodCategory from "./FoodCategory";
// import { useCart } from "../context/CartContext";

// function FoodCustomization({ onAddToCart }) {
//   const { slug } = useParams();
//   const { addItem } = useCart();

//   const food = foods.find((item) => item.slug === slug);

//   if (!food) {
//     return (
//       <main className="mx-auto max-w-7xl px-4 py-20 text-center">
//         <h1 className="font-heading text-2xl font-bold text-dark-950">
//           Food not found
//         </h1>

//         <p className="mt-2 text-sm text-dark-500">
//           The food you're looking for doesn't exist.
//         </p>

//         <Link
//           to="/menu"
//           className="mt-6 inline-flex rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white"
//         >
//           Back to Menu
//         </Link>
//       </main>
//     );
//   }

//   return (
//     <main className="bg-dark-50/50 py-8 sm:py-12">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//         {/* Back */}
//         <Link
//           to="/menu"
//           className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition-colors hover:text-primary-500"
//         >
//           <ArrowLeft size={17} />
//           Back to Menu
//         </Link>

//         <div className="grid gap-8 lg:grid-cols-2 lg:items-start">

//           {/* Food Preview */}
//           <div>
//             <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
//               <FoodImage
//                 src={food.image}
//                 alt={food.name}
//                 className="h-[320px] w-full sm:h-[450px]"
//               />
//             </div>

//             <div className="mt-5">
//               <FoodCategory category={food.category} />

//               <h1 className="mt-3 font-heading text-2xl font-extrabold text-dark-950 sm:text-3xl">
//                 {food.name}
//               </h1>

//               <p className="mt-3 text-sm leading-7 text-dark-500">
//                 {food.description}
//               </p>

//               <div className="mt-5 flex items-center justify-between">
//                 <FoodRating
//                   rating={food.rating}
//                   reviews={food.reviews}
//                 />

//                 <FoodPrice
//                   price={food.price}
//                   oldPrice={food.oldPrice}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Customization */}
//           <FoodCustomizer
//             food={food}
//             onAddToCart={onAddToCart}
//           />

//         </div>
//       </div>
//     </main>
//   );
// }

// export default FoodCustomization;

import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import FoodCustomizer from "./FoodCustomizer";
import FoodImage from "./FoodImage";
import FoodPrice from "./FoodPrice";
import FoodRating from "./FoodRating";
import FoodCategory from "./FoodCategory";
import FoodReviews from "./FoodReviews";
import RecommendedFoods from "./RecommendedFoods";

import { useFoodBySlug } from "../hooks/useFoods";

function FoodCustomization({ onAddToCart }) {
  const { slug } = useParams();

  const { data, isLoading, isError } = useFoodBySlug(slug);

  const food = data?.data?.food;

  if (isLoading) {
    return (
      <main className="bg-dark-50/50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 h-5 w-28 animate-pulse rounded bg-dark-100" />

          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="h-[320px] animate-pulse rounded-3xl bg-dark-100 sm:h-[450px]" />

              <div className="mt-5 space-y-4">
                <div className="h-4 w-28 animate-pulse rounded bg-dark-100" />
                <div className="h-8 w-2/3 animate-pulse rounded bg-dark-100" />
                <div className="h-20 w-full animate-pulse rounded bg-dark-100" />
              </div>
            </div>

            <div className="h-[500px] animate-pulse rounded-3xl bg-dark-100" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !food) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-dark-950">
          Food not found
        </h1>

        <p className="mt-2 text-sm text-dark-500">
          The food you're looking for doesn't exist or is no longer available.
        </p>

        <Link
          to="/menu"
          className="mt-6 inline-flex rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white"
        >
          Back to Menu
        </Link>
      </main>
    );
  }

  const category =
    typeof food.category === "object"
      ? food.category
      : {
          name: food.categoryName || "",
          slug: food.categorySlug || "",
        };

  return (
    <main className="bg-dark-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/menu"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition-colors hover:text-primary-500"
        >
          <ArrowLeft size={17} />
          Back to Menu
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
              <FoodImage
                src={food.image}
                alt={food.name}
                className="h-[320px] w-full sm:h-[450px]"
              />
            </div>

            <div className="mt-5">
              <FoodCategory category={category} />

              <h1 className="mt-3 font-heading text-2xl font-extrabold text-dark-950 sm:text-3xl">
                {food.name}
              </h1>

              <p className="mt-3 text-sm leading-7 text-dark-500">
                {food.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <FoodRating rating={food.rating} reviews={food.reviewCount} />

                <FoodPrice
                  price={food.effectivePrice}
                  oldPrice={food.discountPrice !== null ? food.basePrice : null}
                />
              </div>
            </div>
          </div>

          <FoodCustomizer food={food} onAddToCart={onAddToCart} />

          <FoodReviews foodId={food.id || food._id} />

          <RecommendedFoods foodId={food.id || food._id} />
        </div>
      </div>
    </main>
  );
}

export default FoodCustomization;
