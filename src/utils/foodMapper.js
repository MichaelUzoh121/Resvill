export const mapFood = (food) => {
  if (!food) return null;

  const basePrice = Number(food.price) || 0;

  const discountPrice =
    food.discountPrice !== null &&
    food.discountPrice !== undefined
      ? Number(food.discountPrice)
      : null;

  const effectivePrice =
    discountPrice !== null ? discountPrice : basePrice;

  return {
    ...food,

    id: food._id,

    image: food.images?.[0] || "",

    images: Array.isArray(food.images) ? food.images : [],

    basePrice,

    discountPrice,

    effectivePrice,

    categoryName:
      typeof food.category === "object"
        ? food.category?.name || ""
        : food.category || "",

    categorySlug:
      typeof food.category === "object"
        ? food.category?.slug || ""
        : "",

    reviewCount: Number(food.reviewCount) || 0,

    rating: Number(food.rating) || 0,

    preparationTime: Number(food.preparationTime) || 0,

    addOns: Array.isArray(food.addOns) ? food.addOns : [],

    customizationOptions: Array.isArray(food.customizationOptions)
      ? food.customizationOptions
      : [],

    ingredients: Array.isArray(food.ingredients)
      ? food.ingredients
      : [],

    allergens: Array.isArray(food.allergens)
      ? food.allergens
      : [],
  };
};

export const mapFoods = (foods = []) => {
  if (!Array.isArray(foods)) return [];

  return foods.map(mapFood).filter(Boolean);
};