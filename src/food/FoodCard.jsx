// import React from "react";
// import { Link } from "react-router-dom";
// import { ArrowUpRight, Clock } from "lucide-react";

// import FoodImage from "./FoodImage";
// import FoodCategory from "./FoodCategory";
// import FoodPrice from "./FoodPrice";
// import FoodRating from "./FoodRating";
// import FoodAvailability from "./FoodAvailability";
// import AddToCartButton from "./AddToCartButton";

// function FoodCard({ food, onAddToCart }) {
//   if (!food) return null;

//   return (
//     <article className="group overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
//       {/* Image */}
//       <a href={`/menu/${food.slug}`}
//         // to={`/menu/${food.slug}`}
//         className="relative block overflow-hidden"
//       >
//         <FoodImage
//           src={food.image}
//           alt={food.name}
//           className="h-56 w-full transition-transform duration-500 group-hover:scale-105 sm:h-60"
//         />

//         {/* Category */}
//         <div className="absolute left-4 top-4">
//           <FoodCategory category={food.category} />
//         </div>

//         {/* Availability */}
//         {!food.available && (
//           <div className="absolute inset-0 flex items-center justify-center bg-dark-950/55">
//             <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-danger">
//               Currently Unavailable
//             </span>
//           </div>
//         )}

//         {/* Open Details */}
//         <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-dark-800 opacity-0 shadow-card transition-all duration-300 group-hover:opacity-100">
//           <ArrowUpRight size={17} />
//         </div>
//       </a>

//       {/* Content */}
//       <div className="p-4 sm:p-5">
//         {/* Name */}
//         <Link to={`/menu/${food.slug}`}>
//           <h3 className="line-clamp-1 font-heading text-lg font-bold text-dark-950 transition-colors hover:text-primary-500">
//             {food.name}
//           </h3>
//         </Link>

//         {/* Description */}
//         <p className="mt-2 line-clamp-2 text-sm leading-6 text-dark-500">
//           {food.description}
//         </p>

//         {/* Rating + Time */}
//         <div className="mt-4 flex items-center justify-between gap-3">
//           <FoodRating
//             rating={food.rating}
//             reviews={food.reviews}
//           />

//           <div className="flex items-center gap-1 text-xs font-medium text-dark-500">
//             <Clock size={14} />
//             {food.preparationTime}
//           </div>
//         </div>

//         {/* Price + Availability */}
//         <div className="mt-4 flex items-center justify-between gap-3">
//           <FoodPrice
//             price={food.price}
//             oldPrice={food.oldPrice}
//           />

//           <FoodAvailability available={food.available} />
//         </div>

//         {/* Add To Cart */}
//         <div className="mt-5">
//           <AddToCartButton
//             food={food}
//             onAdd={onAddToCart}
//             disabled={!food.available}
//           />
//         </div>
//       </div>
//     </article>
//   );
// }

// export default FoodCard;



import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Star } from "lucide-react";

import FoodImage from "./FoodImage";
import AddToCartButton from "./AddToCartButton";

function FoodCard({ food, onAddToCart }) {
  if (!food) return null;

  const hasDiscount =
    food.discountPrice !== null &&
    food.discountPrice !== undefined &&
    Number(food.discountPrice) < Number(food.price);

  const displayPrice = hasDiscount
    ? Number(food.discountPrice)
    : Number(food.price);

  const rating = Number(food.rating) || 0;
  const reviewCount = Number(food.reviewCount) || 0;
  const preparationTime = Number(food.preparationTime) || 0;

  const hasCustomizations =
    Array.isArray(food.customizationOptions) &&
    food.customizationOptions.length > 0;

  const hasAddOns =
    Array.isArray(food.addOns) &&
    food.addOns.length > 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Image */}
      <Link
        to={`/menu/${food.slug}`}
        className="relative block overflow-hidden"
      >
        <FoodImage
          src={food.image}
          alt={food.name}
          className="h-56 w-full transition-transform duration-500 group-hover:scale-105 sm:h-60"
        />

        {/* Category */}
        {food.categoryName && (
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-dark-800 shadow-sm">
              {food.categoryName}
            </span>
          </div>
        )}

        {/* Featured / Popular */}
        <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
          {food.featured && (
            <span className="rounded-full bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
              Featured
            </span>
          )}

          {food.popular && (
            <span className="rounded-full bg-dark-950/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
              Popular
            </span>
          )}
        </div>

        {/* Unavailable */}
        {food.available === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-950/55">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-danger">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* View icon */}
        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-dark-800 opacity-0 shadow-card transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <Link to={`/menu/${food.slug}`}>
          <h3 className="line-clamp-1 font-heading text-lg font-bold text-dark-950 transition-colors hover:text-primary-500">
            {food.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-dark-500">
          {food.description}
        </p>

        {/* Rating + preparation time */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm">
            <Star
              size={15}
              className="fill-current text-primary-500"
            />

            <span className="font-semibold text-dark-800">
              {rating.toFixed(1)}
            </span>

            <span className="text-dark-400">
              ({reviewCount})
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-dark-500">
            <Clock size={14} />
            {preparationTime} min
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-bold text-dark-950">
              ₦{displayPrice.toLocaleString()}
            </span>

            {hasDiscount && (
              <span className="text-sm text-dark-400 line-through">
                ₦{Number(food.price).toLocaleString()}
              </span>
            )}
          </div>

          {food.available !== false && (
            <span className="text-xs font-medium text-success">
              Available
            </span>
          )}
        </div>

        {/* Customization indicator */}
        {(hasCustomizations || hasAddOns) && (
          <p className="mt-3 text-xs text-dark-500">
            Customizable
          </p>
        )}

        {/* Add to cart */}
        <div className="mt-5">
          <AddToCartButton
            food={food}
            onAdd={onAddToCart}
            disabled={food.available === false}
          />
        </div>
      </div>
    </article>
  );
}

export default FoodCard;