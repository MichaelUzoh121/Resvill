import React, { useState } from "react";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";

function AddToCartButton({
  food,
  quantity = 1,
  onAdd,
  disabled = false,
  fullWidth = true,
}) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (disabled || !food) return;

    const cartItem = {
      foodId: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      quantity,
    };

    onAdd?.(cartItem);

    setAdded(true);

    toast.success(`${food.name} added to cart`);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleAdd}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
        fullWidth ? "w-full" : ""
      } ${
        disabled
          ? "cursor-not-allowed bg-dark-100 text-dark-400"
          : added
          ? "bg-success text-white"
          : "bg-primary-500 text-white hover:bg-primary-600 hover:shadow-hover"
      }`}
    >
      {added ? (
        <>
          <Check size={17} />
          Added
        </>
      ) : (
        <>
          <ShoppingBag size={17} />
          <span className="hidden sm:inline">
            Add to Cart
          </span>
          <span className="sm:hidden">
            Add
          </span>
          <Plus size={15} />
        </>
      )}
    </button>
  );
}

export default AddToCartButton;

