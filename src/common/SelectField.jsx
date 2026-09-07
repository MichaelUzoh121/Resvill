import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

function SelectField({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSelect = (option) => {
    if (disabled) return;

    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={selectRef}
      className={`relative ${className}`}
    >
      {label && (
        <label className="mb-2 block text-sm font-semibold text-dark-700">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((previous) => !previous)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3 text-left text-sm font-semibold transition-all ${
          disabled
            ? "cursor-not-allowed border-dark-100 bg-dark-50 text-dark-400"
            : isOpen
              ? "border-primary-500 ring-4 ring-primary-500/10"
              : "border-dark-200 text-dark-700 hover:border-dark-300"
        }`}
      >
        <span
          className={
            selectedOption
              ? "text-dark-700"
              : "text-dark-400"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={17}
          className={`shrink-0 text-dark-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-dark-100 bg-white p-1.5 shadow-card">
          {options.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary-50 text-primary-600"
                        : "text-dark-600 hover:bg-dark-50 hover:text-dark-900"
                    }`}
                  >
                    <span>{option.label}</span>

                    {isSelected && (
                      <Check
                        size={16}
                        className="shrink-0 text-primary-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-3 py-3 text-sm text-dark-400">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectField;

