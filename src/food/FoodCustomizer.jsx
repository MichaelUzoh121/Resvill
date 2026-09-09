import React, { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
import FoodPrice from "./FoodPrice";
import { useCart } from "../context/CartContext";

function FoodCustomizer({ food, onAddToCart }) {
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState(
    food?.options?.sizes?.[0] || null,
  );

  const [selectedExtras, setSelectedExtras] = useState([]);

  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce(
      (total, extra) => total + Number(extra.price || 0),
      0,
    );
  }, [selectedExtras]);

  const unitPrice = useMemo(() => {
    const basePrice = Number(food?.price || 0);
    const sizePrice = Number(selectedSize?.price || 0);

    return basePrice + sizePrice + extrasTotal;
  }, [food?.price, selectedSize, extrasTotal]);

  const totalPrice = unitPrice * quantity;

  const toggleExtra = (extra) => {
    setSelectedExtras((current) => {
      const exists = current.some(
        (item) => item.name === extra.name,
      );

      if (exists) {
        return current.filter(
          (item) => item.name !== extra.name,
        );
      }

      return [...current, extra];
    });
  };

  const handleAddToCart = () => {
    if (!food?.available) {
      return;
    }

    const cartItem = {
      foodId: food.id,
      name: food.name,
      image: food.image,
      basePrice: food.price,
      size: selectedSize,
      extras: selectedExtras,
      quantity,
      unitPrice,
      totalPrice,
    };

    if (onAddToCart) {
      onAddToCart(cartItem);
    } else {
      addItem(cartItem);
    }

    toast.success(`${food.name} added to cart`);
  };

  if (!food) {
    return null;
  }

  return (
    <div className="space-y-7 rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      {/* Size */}
      {food.options?.sizes?.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-dark-950">
              Choose Size
            </h3>

            <span className="text-xs text-dark-400">
              Required
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {food.options.sizes.map((size) => {
              const selected =
                selectedSize?.name === size.name;

              return (
                <button
                  key={size.name}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-xl border px-3 py-3 text-left transition-all ${
                    selected
                      ? "border-primary-500 bg-primary-50"
                      : "border-dark-200 hover:border-primary-300"
                  }`}
                >
                  <span
                    className={`block text-sm font-bold ${
                      selected
                        ? "text-primary-600"
                        : "text-dark-800"
                    }`}
                  >
                    {size.name}
                  </span>

                  <span className="mt-1 block text-xs text-dark-500">
                    {size.price > 0
                      ? `+₦${size.price.toLocaleString()}`
                      : "Included"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Extras */}
      {food.options?.extras?.length > 0 && (
        <div>
          <h3 className="mb-3 font-heading text-sm font-bold text-dark-950">
            Add Extras
          </h3>

          <div className="space-y-2">
            {food.options.extras.map((extra) => {
              const selected = selectedExtras.some(
                (item) => item.name === extra.name,
              );

              return (
                <label
                  key={extra.name}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
                    selected
                      ? "border-primary-300 bg-primary-50"
                      : "border-dark-100 hover:border-dark-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleExtra(extra)}
                      className="h-4 w-4 accent-primary-500"
                    />

                    <span className="text-sm font-medium text-dark-700">
                      {extra.name}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-dark-600">
                    +₦{extra.price.toLocaleString()}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center justify-between border-t border-dark-100 pt-5">
        <span className="font-heading text-sm font-bold text-dark-950">
          Quantity
        </span>

        <div className="flex items-center rounded-xl border border-dark-200">
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.max(1, current - 1),
              )
            }
            className="flex h-10 w-10 items-center justify-center text-dark-600 transition-colors hover:text-primary-500"
          >
            <Minus size={16} />
          </button>

          <span className="flex h-10 min-w-10 items-center justify-center border-x border-dark-200 text-sm font-bold text-dark-900">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              setQuantity((current) => current + 1)
            }
            className="flex h-10 w-10 items-center justify-center text-dark-600 transition-colors hover:text-primary-500"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between border-t border-dark-100 pt-5">
        <span className="text-sm font-semibold text-dark-600">
          Total
        </span>

        <FoodPrice price={totalPrice} />
      </div>

      {/* Add to Cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!food.available}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-all ${
          food.available
            ? "bg-primary-500 hover:bg-primary-600 hover:shadow-hover"
            : "cursor-not-allowed bg-dark-200 text-dark-400"
        }`}
      >
        <ShoppingBag size={18} />

        {food.available
          ? "Add to Cart"
          : "Currently Unavailable"}
      </button>
    </div>
  );
}

export default FoodCustomizer;


