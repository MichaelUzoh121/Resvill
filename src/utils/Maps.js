const GEOAPIFY_API_KEY =
  import.meta.env.VITE_GEOAPIFY_API_KEY;

const GEOCODING_URL =
  "https://api.geoapify.com/v1/geocode";

const AUTOCOMPLETE_URL =
  "https://api.geoapify.com/v1/geocode/autocomplete";

const ensureApiKey = () => {
  if (!GEOAPIFY_API_KEY) {
    throw new Error(
      "Geoapify API key is not configured.",
    );
  }
};

/*
|--------------------------------------------------------------------------
| Build a readable address
|--------------------------------------------------------------------------
*/

const buildAddressText = (properties) => {
  if (properties.formatted) {
    return properties.formatted;
  }

  return [
    properties.name,
    properties.housenumber,
    properties.street,
    properties.suburb,
    properties.district,
    properties.city ||
      properties.town ||
      properties.village,
    properties.state,
    properties.country,
  ]
    .filter(Boolean)
    .join(", ");
};

/*
|--------------------------------------------------------------------------
| Convert Geoapify result into our Resvill location shape
|--------------------------------------------------------------------------
*/

const mapResult = (properties) => ({
  description: buildAddressText(properties),

  placeId:
    properties.place_id ||
    properties.datasource?.raw?.place_id ||
    "",

  name:
    properties.name || "",

  latitude: Number(properties.lat),

  longitude: Number(properties.lon),

  street:
    properties.street || "",

  houseNumber:
    properties.housenumber || "",

  city:
    properties.city ||
    properties.town ||
    properties.village ||
    properties.municipality ||
    "",

  state:
    properties.state || "",

  district:
    properties.district || "",

  suburb:
    properties.suburb || "",

  postcode:
    properties.postcode || "",

  country:
    properties.country || "Nigeria",

  countryCode:
    properties.country_code || "ng",

  landmark:
    properties.name ||
    properties.district ||
    properties.suburb ||
    "",
});

/*
|--------------------------------------------------------------------------
| Search Nigerian addresses + places
|--------------------------------------------------------------------------
*/

export const searchAddress = async (query) => {
  ensureApiKey();

  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    text: trimmedQuery,

    /*
     * Restrict the search to Nigeria.
     */
    filter: "countrycode:ng",

    /*
     * Return enough results for the dropdown.
     */
    limit: "10",

    format: "json",

    apiKey: GEOAPIFY_API_KEY,
  });

  const response = await fetch(
    `${AUTOCOMPLETE_URL}?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      `Address search failed: ${response.status}`,
    );
  }

  const data = await response.json();

  const results = Array.isArray(data.results)
    ? data.results
    : [];

  return results
    .filter(
      (result) =>
        result.country_code === "ng",
    )
    .map(mapResult)
    .filter(
      (result) =>
        result.description &&
        Number.isFinite(result.latitude) &&
        Number.isFinite(result.longitude),
    );
};

/*
|--------------------------------------------------------------------------
| Reverse geocode current coordinates
|--------------------------------------------------------------------------
*/

export const reverseGeocode = async (
  latitude,
  longitude,
) => {
  ensureApiKey();

  const params = new URLSearchParams({
    lat: String(latitude),

    lon: String(longitude),

    format: "json",

    apiKey: GEOAPIFY_API_KEY,
  });

  const response = await fetch(
    `${GEOCODING_URL}/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      `Reverse geocoding failed: ${response.status}`,
    );
  }

  const data = await response.json();

  const result = data.results?.find(
    (item) =>
      item.country_code === "ng",
  );

  if (!result) {
    throw new Error(
      "Unable to resolve this Nigerian location.",
    );
  }

  return mapResult(result);
};

export const getMapsDirectionsLink = (
  latitude,
  longitude,
) => {
  if (
    latitude == null ||
    longitude == null
  ) {
    return "";
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${latitude},${longitude}`,
  )}`;
};