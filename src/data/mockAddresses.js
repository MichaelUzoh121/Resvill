// Sample suggestions shown by AddressAutocomplete when no Google Maps API
// key is configured yet, purely so the UI/UX can be built and demoed.
// Once VITE_GOOGLE_MAPS_API_KEY is set, real Google Places results are
// used instead and this file is never touched.
export const MOCK_ADDRESS_SUGGESTIONS = [
  { formattedAddress: "12 Aminu Kano Crescent, Wuse 2, Abuja", latitude: 9.0765, longitude: 7.4951, placeId: "mock-1" },
  { formattedAddress: "24 Ademola Adetokunbo Street, Wuse 2, Abuja", latitude: 9.0851, longitude: 7.4874, placeId: "mock-2" },
  { formattedAddress: "5 Yakubu Gowon Crescent, Asokoro, Abuja", latitude: 9.0392, longitude: 7.5326, placeId: "mock-3" },
  { formattedAddress: "18 Ahmadu Bello Way, Garki, Abuja", latitude: 9.0333, longitude: 7.4833, placeId: "mock-4" },
  { formattedAddress: "3 Bode Thomas Street, Surulere, Lagos", latitude: 6.4977, longitude: 3.356, placeId: "mock-5" },
  { formattedAddress: "45 Admiralty Way, Lekki Phase 1, Lagos", latitude: 6.4413, longitude: 3.457, placeId: "mock-6" },
  { formattedAddress: "10 Awolowo Road, Ikoyi, Lagos", latitude: 6.4531, longitude: 3.4325, placeId: "mock-7" },
  { formattedAddress: "7 Allen Avenue, Ikeja, Lagos", latitude: 6.6018, longitude: 3.3515, placeId: "mock-8" },
];