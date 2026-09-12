// Loads the Google Maps JavaScript API (with the Places library) once a
// VITE_GOOGLE_MAPS_API_KEY is set in the environment. Until then, every
// helper here degrades gracefully so the UI can still be built and tested
// against sample data.
//
// To go live:
//   1. Create a billing-enabled Google Cloud project.
//   2. Enable "Maps JavaScript API" and "Places API".
//   3. Create an API key, then restrict it (HTTP referrers = your domain,
//      API restrictions = the two APIs above).
//   4. Add it to a .env file in the project root:
//        VITE_GOOGLE_MAPS_API_KEY=your-key-here
//   5. Restart the dev server. Address fields will switch from sample
//      suggestions to live Google Places results automatically.

let loadingPromise = null;

export function getGoogleMapsApiKey() {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
}

export function hasGoogleMapsKey() {
  return Boolean(getGoogleMapsApiKey());
}

export function loadGoogleMaps() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.google?.maps?.places) return Promise.resolve(window.google);

  const key = getGoogleMapsApiKey();
  if (!key) return Promise.resolve(null);

  if (!loadingPromise) {
    loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google || null);
      script.onerror = () => reject(new Error("Failed to load Google Maps."));
      document.head.appendChild(script);
    });
  }

  return loadingPromise;
}

// Link a dispatch rider can tap to open turn-by-turn navigation straight
// to the customer's saved coordinates.
export function getMapsDirectionsLink(latitude, longitude) {
  if (latitude == null || longitude == null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

// A lightweight embeddable map preview that needs no API key - handy for
// showing "you selected the right spot" confirmation without waiting on
// billing/API setup.
export function getMapsEmbedSrc(latitude, longitude) {
  if (latitude == null || longitude == null) return null;
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
}
