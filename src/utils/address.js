// Shared shape for any address captured in the app (home address, delivery
// address, etc). This is the object the backend should expect to receive
// wherever an address is submitted - the coordinates are what let dispatch
// riders open the exact spot in Google Maps.
export const EMPTY_LOCATION = {
  addressText: "",
  latitude: null,
  longitude: null,
  placeId: "",
  deliveryInstructions: "",
};

// Older saved profiles stored addresses as a plain string. This upgrades
// any legacy string (or missing value) into the full object shape so the
// rest of the app can always rely on the same fields being present.
export const normalizeLocation = (value) => {
  if (!value) return { ...EMPTY_LOCATION };
  if (typeof value === "string") return { ...EMPTY_LOCATION, addressText: value };
  return { ...EMPTY_LOCATION, ...value };
};

export const hasCoordinates = (location) =>
  Boolean(location && location.latitude != null && location.longitude != null);
