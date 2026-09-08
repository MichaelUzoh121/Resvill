import React from "react";
import { Search, X } from "lucide-react";

function FoodSearch({
  value = "",
  onChange,
  placeholder = "Search for food...",
}) {
  return (
    <div className="relative w-full">
      <Search
        size={19}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-dark-200 bg-white pl-11 pr-11 text-sm text-dark-900 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange?.("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-dark-400 transition-colors hover:bg-dark-100 hover:text-dark-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default FoodSearch;

