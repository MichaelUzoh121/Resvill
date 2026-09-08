import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";

import FoodImage from "./FoodImage";
import FoodCategory from "./FoodCategory";
import FoodPrice from "./FoodPrice";
import FoodRating from "./FoodRating";
import FoodAvailability from "./FoodAvailability";
import AddToCartButton from "./AddToCartButton";

function FoodCard({ food, onAddToCart }) {
  if (!food) return null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Image */}
      <a href={`/menu/${food.slug}`}
        // to={`/menu/${food.slug}`}
        className="relative block overflow-hidden"
      >
        <FoodImage
          src={food.image}
          alt={food.name}
          className="h-56 w-full transition-transform duration-500 group-hover:scale-105 sm:h-60"
        />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <FoodCategory category={food.category} />
        </div>

        {/* Availability */}
        {!food.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-950/55">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-danger">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* Open Details */}
        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-dark-800 opacity-0 shadow-card transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </div>
      </a>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Name */}
        <Link to={`/menu/${food.slug}`}>
          <h3 className="line-clamp-1 font-heading text-lg font-bold text-dark-950 transition-colors hover:text-primary-500">
            {food.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-dark-500">
          {food.description}
        </p>

        {/* Rating + Time */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <FoodRating
            rating={food.rating}
            reviews={food.reviews}
          />

          <div className="flex items-center gap-1 text-xs font-medium text-dark-500">
            <Clock size={14} />
            {food.preparationTime}
          </div>
        </div>

        {/* Price + Availability */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <FoodPrice
            price={food.price}
            oldPrice={food.oldPrice}
          />

          <FoodAvailability available={food.available} />
        </div>

        {/* Add To Cart */}
        <div className="mt-5">
          <AddToCartButton
            food={food}
            onAdd={onAddToCart}
            disabled={!food.available}
          />
        </div>
      </div>
    </article>
  );
}

export default FoodCard;

