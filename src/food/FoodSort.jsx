// import React from "react";
// import { ArrowDownUp } from "lucide-react";
// import SelectField from "../common/SelectField";

// function FoodSort({
//   value = "popular",
//   onChange,
// }) {
//   const sortOptions = [
//     {
//       value: "popular",
//       label: "Most Popular",
//     },
//     {
//       value: "rating",
//       label: "Highest Rated",
//     },
//     {
//       value: "price-low",
//       label: "Price: Low to High",
//     },
//     {
//       value: "price-high",
//       label: "Price: High to Low",
//     },
//     {
//       value: "newest",
//       label: "Newest",
//     },
//   ];

//   return (
//     <div className="flex items-center gap-2">
//       <ArrowDownUp
//         size={17}
//         className="shrink-0 text-dark-400"
//       />

//       <div className="min-w-[190px]">
//         <SelectField
          
//           value={value}
//           onChange={onChange}
//           options={sortOptions}
//           placeholder="Sort by"
//         />
//       </div>
//     </div>
//   );
// }

// export default FoodSort;



import React from "react";
import { ArrowDownUp } from "lucide-react";

function FoodSort({
  value = "newest",
  onChange,
}) {
  const options = [
    {
      value: "newest",
      label: "Newest",
    },
    {
      value: "oldest",
      label: "Oldest",
    },
    {
      value: "popular",
      label: "Most Popular",
    },
    {
      value: "featured",
      label: "Featured",
    },
    {
      value: "rating",
      label: "Highest Rated",
    },
    {
      value: "price_low",
      label: "Price: Low to High",
    },
    {
      value: "price_high",
      label: "Price: High to Low",
    },
    {
      value: "name",
      label: "Name: A–Z",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowDownUp
        size={16}
        className="shrink-0 text-dark-500"
      />

      <select
        value={value}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        className="h-11 min-w-[170px] rounded-xl border border-dark-200 bg-white px-3 text-sm font-semibold text-dark-800 outline-none transition focus:border-primary-500"
        aria-label="Sort foods"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FoodSort;