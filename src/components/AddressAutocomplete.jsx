import React, { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { EMPTY_LOCATION } from "../utils/address";
import { reverseGeocode, searchAddress } from "../utils/maps";
import { MOCK_ADDRESS_SUGGESTIONS } from "../data/mockAddresses";
import AddressMapPreview from "./AddressMapPreview";

// A single address field that gives typed suggestions as the customer
// types, plus a "use my current location" button and a small map preview
// once a spot is picked.
//
// Address search runs against OpenStreetMap's free Nominatim API - no API
// key, billing account, or card required. If a lookup fails (e.g. no
// network), it falls back to a short list of sample addresses so the UI
// still works offline/in a demo.
//
// value / onChange always deal in this shape:
//   { addressText, latitude, longitude, placeId, deliveryInstructions }
//
// That's the exact object the backend should save - latitude/longitude are
// what let a dispatch rider open the precise spot in Google Maps later.
function AddressAutocomplete({
  label = "Address",
  value,
  onChange,
  showInstructions = false,
  required = false,
  placeholder = "Start typing your address...",
}) {
  const location = value || EMPTY_LOCATION;

  const [query, setQuery] = useState(location.addressText || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [offline, setOffline] = useState(false);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  // Keep the text field in sync if the parent resets/loads a saved value.
  useEffect(() => {
    setQuery(location.addressText || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.addressText]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const mockSuggestionsFor = (text) => {
    const lower = text.toLowerCase();
    return MOCK_ADDRESS_SUGGESTIONS.filter((item) =>
      item.formattedAddress.toLowerCase().includes(lower),
    ).map((item) => ({
      description: item.formattedAddress,
      placeId: item.placeId,
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  };

  const fetchSuggestions = async (text) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    // Guards against an earlier, slower request overwriting a later one.
    const requestId = ++requestIdRef.current;

    try {
      const results = await searchAddress(text);
      if (requestId !== requestIdRef.current) return;
      setOffline(false);
      setSuggestions(results);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setOffline(true);
      setSuggestions(mockSuggestionsFor(text));
    }
  };

  const handleInputChange = (event) => {
    const text = event.target.value;
    setQuery(text);
    setOpen(true);

    // Typing invalidates any previously selected coordinates until a
    // suggestion is chosen again.
    onChange({ ...location, addressText: text, latitude: null, longitude: null, placeId: "" });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 400);
  };

  const selectSuggestion = (suggestion) => {
    setOpen(false);
    const next = {
      ...location,
      addressText: suggestion.description,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      placeId: suggestion.placeId,
    };
    setQuery(next.addressText);
    onChange(next);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const resolved = await reverseGeocode(latitude, longitude).catch(() => null);

        setLocating(false);
        const next = {
          ...location,
          addressText: resolved
            ? resolved.description
            : `Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          latitude,
          longitude,
          placeId: resolved ? resolved.placeId : "",
        };
        setQuery(next.addressText);
        onChange(next);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-semibold text-dark-700">
        {label}
        <div className="relative mt-2">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />

          <input
            required={required}
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full rounded-xl border border-dark-200 bg-white py-3 pl-11 pr-11 text-sm font-normal outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          />

          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            title="Use my current location"
            aria-label="Use my current location"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 transition-colors hover:text-primary-500 disabled:opacity-50"
          >
            <LocateFixed size={18} className={locating ? "animate-pulse" : ""} />
          </button>
        </div>
      </label>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-dark-100 bg-white py-1 shadow-lg">
          {suggestions.map((suggestion) => (
            <li key={suggestion.placeId}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className="flex w-full items-start gap-2 px-4 py-2.5 text-left text-sm text-dark-700 hover:bg-primary-50"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary-500" />
                {suggestion.description}
              </button>
            </li>
          ))}
        </ul>
      )}

      {offline && (
        <p className="mt-1.5 text-xs text-dark-400">
          Couldn't reach the address search service - showing sample suggestions instead.
        </p>
      )}

      <AddressMapPreview latitude={location.latitude} longitude={location.longitude} />

      {showInstructions && (
        <label className="mt-3 block text-sm font-semibold text-dark-700">
          Delivery instructions <span className="font-normal text-dark-400">(optional)</span>
          <input
            value={location.deliveryInstructions || ""}
            onChange={(event) =>
              onChange({ ...location, deliveryInstructions: event.target.value })
            }
            placeholder="e.g. Blue gate beside the pharmacy"
            className="mt-2 w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm font-normal outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          />
        </label>
      )}
    </div>
  );
}

export default AddressAutocomplete;