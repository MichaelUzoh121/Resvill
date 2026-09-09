import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";



import foods from "../data/foods";
import FoodCustomizer from "./FoodCustomizer";
import FoodImage from "./FoodImage";
import FoodPrice from "./FoodPrice";
import FoodRating from "./FoodRating";
import FoodCategory from "./FoodCategory";
import { useCart } from "../context/CartContext";


function FoodCustomization({ onAddToCart }) {
  const { slug } = useParams();
  const { addItem } = useCart();

  const food = foods.find((item) => item.slug === slug);

  if (!food) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-dark-950">
          Food not found
        </h1>

        <p className="mt-2 text-sm text-dark-500">
          The food you're looking for doesn't exist.
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

  return (
    <main className="bg-dark-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/menu"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition-colors hover:text-primary-500"
        >
          <ArrowLeft size={17} />
          Back to Menu
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">

          {/* Food Preview */}
          <div>
            <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
              <FoodImage
                src={food.image}
                alt={food.name}
                className="h-[320px] w-full sm:h-[450px]"
              />
            </div>

            <div className="mt-5">
              <FoodCategory category={food.category} />

              <h1 className="mt-3 font-heading text-2xl font-extrabold text-dark-950 sm:text-3xl">
                {food.name}
              </h1>

              <p className="mt-3 text-sm leading-7 text-dark-500">
                {food.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <FoodRating
                  rating={food.rating}
                  reviews={food.reviews}
                />

                <FoodPrice
                  price={food.price}
                  oldPrice={food.oldPrice}
                />
              </div>
            </div>
          </div>

          {/* Customization */}
          <FoodCustomizer
            food={food}
            onAddToCart={onAddToCart}
          />

        </div>
      </div>
    </main>
  );
}

export default FoodCustomization;

