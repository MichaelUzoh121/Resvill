// import React from "react";
// import { ArrowDownUp } from "lucide-react";

// function FoodSort({
//   value = "popular",
//   onChange,
// }) {
//   return (
//     <div className="flex items-center gap-2">
//       <ArrowDownUp
//         size={17}
//         className="text-dark-400"
//       />

//       <label
//         htmlFor="food-sort"
//         className="sr-only"
//       >
//         Sort food
//       </label>

//       <select
//         id="food-sort"
//         value={value}
//         onChange={(event) =>
//           onChange?.(event.target.value)
//         }
//         className="h-11 rounded-xl border border-dark-200 bg-white px-3 text-sm font-semibold text-dark-700 outline-none transition-colors focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
//       >
//         <option value="popular">
//           Most Popular
//         </option>

//         <option value="rating">
//           Highest Rated
//         </option>

//         <option value="price-low">
//           Price: Low to High
//         </option>

//         <option value="price-high">
//           Price: High to Low
//         </option>

//         <option value="newest">
//           Newest
//         </option>
//       </select>
//     </div>
//   );
// }

// export default FoodSort;





import React from "react";
import { ArrowDownUp } from "lucide-react";
import SelectField from "../common/SelectField";

function FoodSort({
  value = "popular",
  onChange,
}) {
  const sortOptions = [
    {
      value: "popular",
      label: "Most Popular",
    },
    {
      value: "rating",
      label: "Highest Rated",
    },
    {
      value: "price-low",
      label: "Price: Low to High",
    },
    {
      value: "price-high",
      label: "Price: High to Low",
    },
    {
      value: "newest",
      label: "Newest",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowDownUp
        size={17}
        className="shrink-0 text-dark-400"
      />

      <div className="min-w-[190px]">
        <SelectField
          
          value={value}
          onChange={onChange}
          options={sortOptions}
          placeholder="Sort by"
        />
      </div>
    </div>
  );
}

export default FoodSort;

