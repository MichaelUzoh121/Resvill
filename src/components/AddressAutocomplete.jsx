import React, { useEffect, useRef, useState } from "react";

import { LocateFixed, MapPin, Search, Loader2 } from "lucide-react";

import { EMPTY_LOCATION } from "../utils/address";

import { reverseGeocode, searchAddress } from "../utils/maps";

import AddressMapPreview from "./AddressMapPreview";

function AddressAutocomplete({
  label = "Address",
  value,
  onChange,
  showInstructions = false,
  required = false,
  placeholder = "Search for an address, place or landmark...",
}) {
  const location = value || EMPTY_LOCATION;

  const [query, setQuery] = useState(location.addressText || "");

  const [suggestions, setSuggestions] = useState([]);

  const [open, setOpen] = useState(false);

  const [locating, setLocating] = useState(false);

  const [searching, setSearching] = useState(false);

  const [offline, setOffline] = useState(false);

  const containerRef = useRef(null);

  const debounceRef = useRef(null);

  const requestIdRef = useRef(0);

  const [manualAddress, setManualAddress] = useState(
    Boolean(location.addressText && !location.latitude && !location.longitude),
  );

  useEffect(() => {
    setQuery(location.addressText || "");
  }, [location.addressText]);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const fetchSuggestions = async (text) => {
    const value = text.trim();

    if (value.length < 3) {
      setSuggestions([]);

      setSearching(false);

      return;
    }

    const requestId = ++requestIdRef.current;

    setSearching(true);

    setOffline(false);

    try {
      const results = await searchAddress(value);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setSuggestions(results || []);
    } catch (error) {
      console.error(error);

      setOffline(true);

      setSuggestions([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setSearching(false);
      }
    }
  };

  // const handleInputChange = (event) => {
  //   const text = event.target.value;

  //   setQuery(text);

  //   setOpen(true);

  //   onChange({
  //     ...location,

  //     addressText: text,

  //     latitude: null,

  //     longitude: null,

  //     placeId: "",
  //   });

  //   if (debounceRef.current) {
  //     clearTimeout(debounceRef.current);
  //   }

  //   debounceRef.current = setTimeout(() => {
  //     fetchSuggestions(text);
  //   }, 400);
  // };

  const handleInputChange = (event) => {
    const text = event.target.value;

    setQuery(text);

    // Once the user starts typing again, treat it as a manually editable address.
    setManualAddress(true);

    setOpen(true);

    onChange({
      ...location,

      addressText: text,

      latitude: null,

      longitude: null,

      placeId: "",
    });

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 400);
  };

  // const selectSuggestion = (suggestion) => {
  //   const next = {
  //     ...location,

  //     addressText: suggestion.description || "",

  //     latitude: suggestion.latitude ?? null,

  //     longitude: suggestion.longitude ?? null,

  //     placeId: suggestion.placeId || "",

  //     name: suggestion.name || "",

  //     street: suggestion.street || "",

  //     houseNumber: suggestion.houseNumber || "",

  //     city: suggestion.city || "",

  //     state: suggestion.state || "",

  //     district: suggestion.district || "",

  //     suburb: suggestion.suburb || "",

  //     postcode: suggestion.postcode || "",

  //     country: suggestion.country || "Nigeria",

  //     countryCode: suggestion.countryCode || "ng",

  //     landmark: suggestion.landmark || "",
  //   };

  //   setQuery(next.addressText);

  //   setOpen(false);

  //   onChange(next);
  // };

  const selectSuggestion = (suggestion) => {
    const next = {
      ...location,

      addressText: suggestion.description || "",

      latitude: suggestion.latitude ?? null,

      longitude: suggestion.longitude ?? null,

      placeId: suggestion.placeId || "",

      name: suggestion.name || "",

      street: suggestion.street || "",

      houseNumber: suggestion.houseNumber || "",

      city: suggestion.city || "",

      state: suggestion.state || "",

      district: suggestion.district || "",

      suburb: suggestion.suburb || "",

      postcode: suggestion.postcode || "",

      country: suggestion.country || "Nigeria",

      countryCode: suggestion.countryCode || "ng",

      landmark: suggestion.landmark || "",
    };

    setManualAddress(false);

    setQuery(next.addressText);

    setOpen(false);

    onChange(next);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    setLocating(true);

    setOffline(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const resolved = await reverseGeocode(latitude, longitude);

          const next = {
            ...location,

            addressText: resolved.description,

            latitude,

            longitude,

            placeId: resolved.placeId || "",

            city: resolved.city || "",

            state: resolved.state || "",

            landmark: resolved.landmark || "",
          };

          setQuery(next.addressText);

          onChange(next);
        } catch (error) {
          const next = {
            ...location,

            addressText: `Current location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,

            latitude,

            longitude,
          };

          setQuery(next.addressText);

          onChange(next);
        } finally {
          setLocating(false);

          setOpen(false);
        }
      },

      () => {
        setLocating(false);
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 30000,
      },
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <label
        className="
          block
          text-sm
          font-semibold
          text-dark-700
        "
      >
        {label}

        <div
          className="
            relative
            mt-2
          "
        >
          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-dark-400
            "
          />

          <input
            required={required}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            className="
              w-full
              rounded-xl
              border
              border-dark-200
              bg-white
              py-3
              pl-11
              pr-12
              text-sm
              outline-none
              focus:border-primary-500
            "
          />

          {searching && (
            <Loader2
              size={18}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                animate-spin
                text-primary-500
              "
            />
          )}
        </div>
      </label>

      {open && (
        <div
          className="
            absolute
            z-50
            mt-2
            max-h-80
            w-full
            overflow-y-auto
            rounded-xl
            border
            border-dark-100
            bg-white
            shadow-xl
          "
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={useCurrentLocation}
            disabled={locating}
            className="
              flex
              w-full
              items-center
              gap-3
              border-b
              border-dark-100
              px-4
              py-3
              text-left
              text-sm
              font-semibold
              text-primary-600
              hover:bg-primary-50
            "
          >
            <LocateFixed
              size={18}
              className={locating ? "animate-pulse" : ""}
            />

            {locating ? "Getting your location..." : "Use my current location"}
          </button>

          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placeId || index}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(suggestion)}
              className="
                    flex
                    w-full
                    items-start
                    gap-3
                    px-4
                    py-3
                    text-left
                    hover:bg-primary-50
                  "
            >
              <MapPin
                size={17}
                className="
                      mt-1
                      text-primary-500
                    "
              />

              <span>
                {suggestion.name && (
                  <span
                    className="
                            block
                            text-sm
                            font-semibold
                          "
                  >
                    {suggestion.name}
                  </span>
                )}

                <span
                  className="
                        block
                        text-xs
                        text-dark-500
                      "
                >
                  {suggestion.description}
                </span>
              </span>
            </button>
          ))}

          {/* {!searching && query.length >= 3 && suggestions.length === 0 && (
            <p
              className="
                  px-4
                  py-3
                  text-sm
                  text-dark-500
                "
            >
              No Nigerian places found.
            </p>
          )} */}

          {!searching && query.length >= 3 && suggestions.length === 0 && (
            <div className="border-t border-dark-100 px-4 py-3">
              <p className="text-sm font-semibold text-dark-700">
                No matching place found
              </p>

              <p className="mt-1 text-xs text-dark-500">
                You can continue with the address you typed manually.
              </p>

              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setManualAddress(true);

                  setOpen(false);

                  onChange({
                    ...location,

                    addressText: query,

                    latitude: null,

                    longitude: null,

                    placeId: "",
                  });
                }}
                className="
        mt-3
        rounded-lg
        bg-primary-50
        px-3
        py-2
        text-xs
        font-semibold
        text-primary-600
        hover:bg-primary-100
      "
              >
                Use this address
              </button>
            </div>
          )}
        </div>
      )}

      {offline && (
        <p className="mt-2 text-xs text-red-500">
          Address service unavailable.
        </p>
      )}

      {manualAddress && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-dark-700">
            City
            <input
              type="text"
              value={location.city || ""}
              onChange={(e) =>
                onChange({
                  ...location,
                  city: e.target.value,
                })
              }
              placeholder="e.g. Abuja"
              className="
          mt-2
          w-full
          rounded-xl
          border
          border-dark-200
          bg-white
          px-4
          py-3
          text-sm
          font-normal
          outline-none
          focus:border-primary-500
        "
            />
          </label>

          <label className="block text-sm font-semibold text-dark-700">
            State
            <input
              type="text"
              value={location.state || ""}
              onChange={(e) =>
                onChange({
                  ...location,
                  state: e.target.value,
                })
              }
              placeholder="e.g. FCT"
              className="
          mt-2
          w-full
          rounded-xl
          border
          border-dark-200
          bg-white
          px-4
          py-3
          text-sm
          font-normal
          outline-none
          focus:border-primary-500
        "
            />
          </label>
        </div>
      )}

      <AddressMapPreview
        latitude={location.latitude}
        longitude={location.longitude}
      />

      {showInstructions && (
        <label
          className="
            mt-3
            block
            text-sm
            font-semibold
          "
        >
          Delivery instructions
          <input
            value={location.deliveryInstructions || ""}
            onChange={(e) =>
              onChange({
                ...location,

                deliveryInstructions: e.target.value,
              })
            }
            placeholder="
              e.g. Blue gate beside the pharmacy
            "
            className="
              mt-2 w-full rounded-xl border border-dark-200 px-4 py-3 font-normal outline-none focus:border-primary-500 disabled:bg-dark-50
            "
          />
        </label>
      )}
    </div>
  );
}

export default AddressAutocomplete;
