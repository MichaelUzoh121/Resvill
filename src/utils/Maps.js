// Address search and geocoding via OpenStreetMap's free Nominatim API.
// No API key, no billing account, no card required - this replaces the
// old Google Places/Maps integration.
//
// Nominatim's usage policy (https://operations.osmfoundation.org/policies/nominatim/)
// asks callers to keep requests to roughly one per second and to identify
// the calling app; the browser's Referer header covers that for a
// client-side app like this one. Keep the debounce in
// AddressAutocomplete.jsx reasonable (250-500ms) rather than firing a
// request on every keystroke.

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

// Returns [{ description, placeId, latitude, longitude }] - already the
// shape AddressAutocomplete expects for a suggestion.
export async function searchAddress(query, { limit = 5, countryCodes } = {}) {
  if (!query || !query.trim()) return [];

  const params = new URLSearchParams({
    format: "jsonv2",
    q: query,
    addressdetails: "1",
    limit: String(limit),
  });
  if (countryCodes) params.set("countrycodes", countryCodes);

  const response = await fetch(`${NOMINATIM_BASE}/search?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Address search failed");

  const results = await response.json();
  return results.map((result) => ({
    description: result.display_name,
    placeId: `osm-${result.place_id}`,
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
  }));
}

// Turns a lat/lng (e.g. from the browser's geolocation) back into a
// readable address - used by the "use my current location" button.
export async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
  });

  const response = await fetch(`${NOMINATIM_BASE}/reverse?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return null;

  const result = await response.json();
  if (!result || result.error) return null;

  return {
    description: result.display_name,
    placeId: result.place_id ? `osm-${result.place_id}` : "",
  };
}

// Link a dispatch rider can tap to open turn-by-turn navigation straight
// to the customer's saved coordinates. This is just a URL scheme most map
// apps understand - it needs no API key either way.
export function getMapsDirectionsLink(latitude, longitude) {
  if (latitude == null || longitude == null) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
