import React, { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { EMPTY_LOCATION } from "../utils/address";
import { getMapsEmbedSrc, hasGoogleMapsKey, loadGoogleMaps } from "../utils/googleMaps";
import { MOCK_ADDRESS_SUGGESTIONS } from "../data/mockAddresses";

// A single address field that gives typed suggestions as the customer
// types (Google Places when an API key is configured, sample suggestions
// otherwise), plus a "use my current location" button and a small map
// preview once a spot is picked.
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
  const usingLiveApi = hasGoogleMapsKey();

  const [query, setQuery] = useState(location.addressText || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const geocoder = useRef(null);
  const sessionToken = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Keep the text field in sync if the parent resets/loads a saved value.
  useEffect(() => {
    setQuery(location.addressText || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.addressText]);

  useEffect(() => {
    if (!usingLiveApi) return undefined;
    let cancelled = false;

    loadGoogleMaps().then((google) => {
      if (cancelled || !google) return;
      autocompleteService.current = new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(document.createElement("div"));
      geocoder.current = new google.maps.Geocoder();
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
      setMapsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [usingLiveApi]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const fetchSuggestions = (text) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    if (usingLiveApi && mapsReady && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: text, sessionToken: sessionToken.current },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setSuggestions(
              predictions.map((prediction) => ({
                description: prediction.description,
                placeId: prediction.place_id,
              })),
            );
          } else {
            setSuggestions([]);
          }
        },
      );
      return;
    }

    const lower = text.toLowerCase();
    setSuggestions(
      MOCK_ADDRESS_SUGGESTIONS.filter((item) =>
        item.formattedAddress.toLowerCase().includes(lower),
      ).map((item) => ({
        description: item.formattedAddress,
        placeId: item.placeId,
        mock: item,
      })),
    );
  };

  const handleInputChange = (event) => {
    const text = event.target.value;
    setQuery(text);
    setOpen(true);

    // Typing invalidates any previously selected coordinates until a
    // suggestion is chosen again.
    onChange({ ...location, addressText: text, latitude: null, longitude: null, placeId: "" });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 250);
  };

  const selectSuggestion = (suggestion) => {
    setOpen(false);

    if (suggestion.mock) {
      const mock = suggestion.mock;
      const next = {
        ...location,
        addressText: mock.formattedAddress,
        latitude: mock.latitude,
        longitude: mock.longitude,
        placeId: mock.placeId,
      };
      setQuery(next.addressText);
      onChange(next);
      return;
    }

    if (usingLiveApi && mapsReady && placesService.current) {
      placesService.current.getDetails(
        {
          placeId: suggestion.placeId,
          fields: ["formatted_address", "geometry", "place_id"],
          sessionToken: sessionToken.current,
        },
        (place, status) => {
          if (status === "OK" && place) {
            const next = {
              ...location,
              addressText: place.formatted_address || suggestion.description,
              latitude: place.geometry?.location?.lat() ?? null,
              longitude: place.geometry?.location?.lng() ?? null,
              placeId: place.place_id || suggestion.placeId,
            };
            setQuery(next.addressText);
            onChange(next);
          }
        },
      );
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (usingLiveApi && mapsReady && geocoder.current) {
          geocoder.current.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setLocating(false);
              const resolved = status === "OK" && results?.[0];
              const next = {
                ...location,
                addressText: resolved
                  ? results[0].formatted_address
                  : `Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                latitude,
                longitude,
                placeId: resolved ? results[0].place_id : "",
              };
              setQuery(next.addressText);
              onChange(next);
            },
          );
          return;
        }

        setLocating(false);
        const next = {
          ...location,
          addressText: `Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          latitude,
          longitude,
          placeId: "",
        };
        setQuery(next.addressText);
        onChange(next);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const mapSrc = getMapsEmbedSrc(location.latitude, location.longitude);

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

      {!usingLiveApi && (
        <p className="mt-1.5 text-xs text-dark-400">
          Showing sample suggestions - connect a Google Maps API key for live address search.
        </p>
      )}

      {mapSrc && (
        <div className="mt-3 overflow-hidden rounded-xl border border-dark-100">
          <iframe
            title={`${label} map preview`}
            src={mapSrc}
            width="100%"
            height="160"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      )}

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
