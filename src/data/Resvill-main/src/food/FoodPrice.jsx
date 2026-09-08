import React from "react";

function FoodPrice({ price, oldPrice, currency = "₦" }) {
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-NG").format(value);

  return (
    <div className="flex items-center gap-2">
      <span className="font-heading text-lg font-bold text-dark-950">
        {currency}
        {formatPrice(price)}
      </span>

      {oldPrice && oldPrice > price && (
        <span className="text-sm font-medium text-dark-400 line-through">
          {currency}
          {formatPrice(oldPrice)}
        </span>
      )}
    </div>
  );
}

export default FoodPrice;

