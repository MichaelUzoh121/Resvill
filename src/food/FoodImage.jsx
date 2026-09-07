import React, { useState } from "react";
import { ImageOff } from "lucide-react";

function FoodImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-dark-100 text-dark-400 ${fallbackClassName} ${className}`}
      >
        <ImageOff size={28} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Food"}
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
}

export default FoodImage;

