// import React from "react";
// import { SlidersHorizontal, X } from "lucide-react";

// function FoodFilters({
//   categories = [],
//   selectedCategory = "all",
//   onCategoryChange,
//   selectedPrice = "all",
//   onPriceChange,
//   availableOnly = false,
//   onAvailabilityChange,
//   onClear,
// }) {
//   return (
//     <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <SlidersHorizontal
//             size={18}
//             className="text-primary-500"
//           />

//           <h3 className="font-heading text-base font-bold text-dark-950">
//             Filters
//           </h3>
//         </div>

//         <button
//           type="button"
//           onClick={onClear}
//           className="text-xs font-semibold text-primary-500 hover:text-primary-600"
//         >
//           Clear all
//         </button>
//       </div>

//       {/* Categories */}
//       <div className="mt-6">
//         <p className="mb-3 text-xs font-bold uppercase tracking-wide text-dark-500">
//           Category
//         </p>

//         <div className="flex flex-wrap gap-2">
//           <button
//             type="button"
//             onClick={() => onCategoryChange?.("all")}
//             className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
//               selectedCategory === "all"
//                 ? "bg-primary-500 text-white"
//                 : "bg-dark-50 text-dark-600 hover:bg-primary-50 hover:text-primary-500"
//             }`}
//           >
//             All
//           </button>

//           {categories.map((category) => (
//             <button
//               key={category.id}
//               type="button"
//               onClick={() => onCategoryChange?.(category.id)}
//               className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
//                 selectedCategory === category.id
//                   ? "bg-primary-500 text-white"
//                   : "bg-dark-50 text-dark-600 hover:bg-primary-50 hover:text-primary-500"
//               }`}
//             >
//               {category.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Price */}
//       <div className="mt-6">
//         <p className="mb-3 text-xs font-bold uppercase tracking-wide text-dark-500">
//           Price
//         </p>

//         <div className="space-y-2">
//           {[
//             { value: "all", label: "All prices" },
//             { value: "under-3000", label: "Under ₦3,000" },
//             { value: "3000-5000", label: "₦3,000 - ₦5,000" },
//             { value: "above-5000", label: "Above ₦5,000" },
//           ].map((option) => (
//             <label
//               key={option.value}
//               className="flex cursor-pointer items-center gap-3 text-sm text-dark-600"
//             >
//               <input
//                 type="radio"
//                 name="price"
//                 value={option.value}
//                 checked={selectedPrice === option.value}
//                 onChange={(event) =>
//                   onPriceChange?.(event.target.value)
//                 }
//                 className="h-4 w-4 accent-primary-500"
//               />

//               {option.label}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Availability */}
//       <label className="mt-6 flex cursor-pointer items-center justify-between border-t border-dark-100 pt-5">
//         <span className="text-sm font-semibold text-dark-700">
//           Available only
//         </span>

//         <input
//           type="checkbox"
//           checked={availableOnly}
//           onChange={(event) =>
//             onAvailabilityChange?.(event.target.checked)
//           }
//           className="h-4 w-4 accent-primary-500"
//         />
//       </label>
//     </div>
//   );
// }

// export default FoodFilters;





import React from "react";
import {
  SlidersHorizontal,
  X,
  Star,
  Clock3,
  Leaf,
  CircleCheck,
} from "lucide-react";

function FoodFilters({
  selectedPrice = "all",
  onPriceChange,

  selectedRating = "all",
  onRatingChange,

  selectedPreparationTime = "all",
  onPreparationTimeChange,

  selectedDietary = "all",
  onDietaryChange,

  availableOnly = false,
  onAvailabilityChange,

  onClear,
}) {
  const hasActiveFilters =
    selectedPrice !== "all" ||
    selectedRating !== "all" ||
    selectedPreparationTime !== "all" ||
    selectedDietary !== "all" ||
    availableOnly;

  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={18}
            className="text-primary-500"
          />

          <h3 className="font-heading text-base font-bold text-dark-950">
            Filters
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-semibold text-primary-500 transition-colors hover:text-primary-600"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>

      {/* =========================================================
          PRICE
      ========================================================== */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-dark-500">
          Price
        </p>

        <div className="space-y-3">
          {[
            {
              value: "all",
              label: "All prices",
            },
            {
              value: "under-3000",
              label: "Under ₦3,000",
            },
            {
              value: "3000-5000",
              label: "₦3,000 - ₦5,000",
            },
            {
              value: "above-5000",
              label: "Above ₦5,000",
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-dark-600"
            >
              <input
                type="radio"
                name="price"
                value={option.value}
                checked={selectedPrice === option.value}
                onChange={(event) =>
                  onPriceChange?.(event.target.value)
                }
                className="h-4 w-4 accent-primary-500"
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* =========================================================
          RATING
      ========================================================== */}
      <div className="mt-7 border-t border-dark-100 pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Star
            size={15}
            className="fill-accent-400 text-accent-400"
          />

          <p className="text-xs font-bold uppercase tracking-wide text-dark-500">
            Rating
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              value: "all",
              label: "All ratings",
            },
            {
              value: "4.5",
              label: "4.5 & above",
            },
            {
              value: "4",
              label: "4.0 & above",
            },
            {
              value: "3",
              label: "3.0 & above",
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-dark-600"
            >
              <input
                type="radio"
                name="rating"
                value={option.value}
                checked={selectedRating === option.value}
                onChange={(event) =>
                  onRatingChange?.(event.target.value)
                }
                className="h-4 w-4 accent-primary-500"
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* =========================================================
          PREPARATION TIME
      ========================================================== */}
      <div className="mt-7 border-t border-dark-100 pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Clock3
            size={15}
            className="text-dark-500"
          />

          <p className="text-xs font-bold uppercase tracking-wide text-dark-500">
            Preparation Time
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              value: "all",
              label: "Any preparation time",
            },
            {
              value: "under-10",
              label: "Under 10 minutes",
            },
            {
              value: "10-20",
              label: "10 - 20 minutes",
            },
            {
              value: "20-30",
              label: "20 - 30 minutes",
            },
            {
              value: "above-30",
              label: "30+ minutes",
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-dark-600"
            >
              <input
                type="radio"
                name="preparationTime"
                value={option.value}
                checked={
                  selectedPreparationTime === option.value
                }
                onChange={(event) =>
                  onPreparationTimeChange?.(
                    event.target.value
                  )
                }
                className="h-4 w-4 accent-primary-500"
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* =========================================================
          DIETARY OPTIONS
      ========================================================== */}
      <div className="mt-7 border-t border-dark-100 pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Leaf
            size={15}
            className="text-success"
          />

          <p className="text-xs font-bold uppercase tracking-wide text-dark-500">
            Dietary Options
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              value: "all",
              label: "All options",
            },
            {
              value: "vegetarian",
              label: "Vegetarian",
            },
            {
              value: "vegan",
              label: "Vegan",
            },
            {
              value: "halal",
              label: "Halal",
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-dark-600"
            >
              <input
                type="radio"
                name="dietary"
                value={option.value}
                checked={selectedDietary === option.value}
                onChange={(event) =>
                  onDietaryChange?.(event.target.value)
                }
                className="h-4 w-4 accent-primary-500"
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* =========================================================
          AVAILABILITY
      ========================================================== */}
      <div className="mt-7 border-t border-dark-100 pt-6">
        <label className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleCheck
              size={16}
              className={
                availableOnly
                  ? "text-success"
                  : "text-dark-400"
              }
            />

            <span className="text-sm font-semibold text-dark-700">
              Available only
            </span>
          </div>

          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) =>
              onAvailabilityChange?.(
                event.target.checked
              )
            }
            className="h-4 w-4 accent-primary-500"
          />
        </label>
      </div>
    </div>
  );
}

export default FoodFilters;

