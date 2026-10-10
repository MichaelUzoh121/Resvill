export const EMPTY_LOCATION = {
  addressText: "",
  latitude: null,
  longitude: null,
  placeId: "",
  name: "",
  street: "",
  houseNumber: "",
  city: "",
  state: "",
  district: "",
  suburb: "",
  postcode: "",
  country: "Nigeria",
  countryCode: "ng",
  landmark: "",
  deliveryInstructions: "",
};

export const normalizeLocation = (value) => {
  if (!value) {
    return { ...EMPTY_LOCATION };
  }

  if (typeof value === "string") {
    return {
      ...EMPTY_LOCATION,
      addressText: value,
    };
  }

  return {
    ...EMPTY_LOCATION,
    ...value,
  };
};

export const hasCoordinates = (location) =>
  Boolean(
    location &&
      location.latitude != null &&
      location.longitude != null
  );

export const locationToAddressPayload = ({
  location,
  firstname,
  lastname,
  phone,
  label = "home",
}) => {
  const normalized = normalizeLocation(location);

  const payload = {
    label,

    firstname: firstname?.trim() || "",
    lastname: lastname?.trim() || "",
    phone: phone?.trim() || "",

    address: normalized.addressText?.trim() || "",

    city: normalized.city?.trim() || "",

    state: normalized.state?.trim() || "",

    landmark: normalized.landmark?.trim() || "",

    deliveryInstructions:
      normalized.deliveryInstructions?.trim() || "",
  };

  // Coordinates are optional.
  // Do not send null when the user entered the address manually.
  if (hasCoordinates(normalized)) {
    payload.coordinates = {
      latitude: Number(normalized.latitude),
      longitude: Number(normalized.longitude),
    };
  }

  return payload;
};