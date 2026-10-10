import { useEffect, useState } from "react";
import { LuMapPin, LuPencil, LuSave, LuX } from "react-icons/lu";

import AddressAutocomplete from "../components/AddressAutocomplete";
import { useAddresses } from "../hooks/useAddresses";
import { locationToAddressPayload, normalizeLocation } from "../utils/address";

import { toast } from "react-hot-toast";

function DeliveryAddressSection({
  deliveryMethod,
  form,
  setForm,
  update,
  disabled,
}) {
  // const { addresses, updateAddress, updatingAddress } = useAddresses();
  const { addresses, updateAddress, updatingAddress, refetchAddresses } =
    useAddresses();

  const [editing, setEditing] = useState(false);
  const [location, setLocation] = useState(null);

  const defaultAddress =
    addresses.find((address) => address.isDefault) || addresses[0] || null;

  useEffect(() => {
    if (!defaultAddress) {
      setLocation(null);
      return;
    }

    setLocation({
      addressText: defaultAddress.address || "",
      latitude: defaultAddress.coordinates?.latitude ?? null,
      longitude: defaultAddress.coordinates?.longitude ?? null,
      placeId: "",
      name: "",
      street: "",
      houseNumber: "",
      city: defaultAddress.city || "",
      state: defaultAddress.state || "",
      district: "",
      suburb: "",
      postcode: "",
      country: "Nigeria",
      countryCode: "ng",
      landmark: defaultAddress.landmark || "",
      deliveryInstructions: defaultAddress.deliveryInstructions || "",
    });

    setForm((current) => ({
      ...current,
      deliveryAddressId: defaultAddress._id,
      deliveryLocation: {
        addressText: defaultAddress.address || "",
        latitude: defaultAddress.coordinates?.latitude ?? null,
        longitude: defaultAddress.coordinates?.longitude ?? null,
        placeId: "",
        name: "",
        street: "",
        houseNumber: "",
        city: defaultAddress.city || "",
        state: defaultAddress.state || "",
        district: "",
        suburb: "",
        postcode: "",
        country: "Nigeria",
        countryCode: "ng",
        landmark: defaultAddress.landmark || "",
        deliveryInstructions: defaultAddress.deliveryInstructions || "",
      },
    }));
  }, [defaultAddress?._id]);

  const handleLocationChange = (nextLocation) => {
    setLocation(nextLocation);

    setForm((current) => ({
      ...current,
      deliveryLocation: nextLocation,
    }));
  };

  // const handleSaveAddress = async () => {
  //   if (!defaultAddress || !location) return;

  //   const payload = locationToAddressPayload({
  //     location: normalizeLocation(location),
  //     firstname: defaultAddress.firstname,
  //     lastname: defaultAddress.lastname,
  //     phone: defaultAddress.phone,
  //     label: defaultAddress.label,
  //   });

  //   await updateAddress({
  //     addressId: defaultAddress._id,
  //     payload,
  //   });

  //   setEditing(false);

  //   setForm((current) => ({
  //     ...current,
  //     deliveryAddressId: defaultAddress._id,
  //     deliveryLocation: location,
  //   }));
  // };

  const handleSaveAddress = async () => {
    if (!defaultAddress || !location) return;

    try {
      const payload = locationToAddressPayload({
        location: normalizeLocation(location),
        firstname: defaultAddress.firstname,
        lastname: defaultAddress.lastname,
        phone: defaultAddress.phone,
        label: defaultAddress.label,
      });

      const response = await updateAddress({
        addressId: defaultAddress._id,
        payload,
      });

      console.log("ADDRESS UPDATE RESPONSE:", response);

      // Immediately use the edited location in the UI.
      setLocation(location);

      setForm((current) => ({
        ...current,
        deliveryAddressId: defaultAddress._id,
        deliveryLocation: location,
      }));

      setEditing(false);

      // Refresh the saved address from the backend.
      await refetchAddresses();

      toast.success("Address updated successfully.");
    } catch (error) {
      console.error("Failed to save address:", error);
      console.error("Address validation response:", error?.response?.data);

      toast.error(
        error?.response?.data?.message ||
          "Failed to save address. Please try again.",
      );
    }
  };

  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      {deliveryMethod === "delivery" && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-dark-950">
                Delivery address
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                Your default delivery address will be used for this order.
              </p>
            </div>

            {defaultAddress && !editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={disabled}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-dark-200 px-3 py-2 text-sm font-semibold text-dark-700 transition hover:border-primary-300 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuPencil size={16} />
                Edit
              </button>
            )}
          </div>

          <div className="mt-4">
            {!defaultAddress ? (
              <div className="rounded-xl border border-dashed border-dark-200 bg-dark-50 p-5">
                <div className="flex items-start gap-3">
                  <LuMapPin
                    className="mt-0.5 shrink-0 text-dark-400"
                    size={20}
                  />

                  <div>
                    <p className="font-semibold text-dark-800">
                      No saved delivery address
                    </p>

                    <p className="mt-1 text-sm text-dark-500">
                      Please add a default address from your account before
                      placing a delivery order.
                    </p>
                  </div>
                </div>
              </div>
            ) : editing ? (
              <div>
                <AddressAutocomplete
                  label="Delivery address"
                  value={location}
                  onChange={handleLocationChange}
                  showInstructions
                  required
                />

                <div className="mt-4 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);

                      setLocation({
                        addressText: defaultAddress.address || "",
                        latitude: defaultAddress.coordinates?.latitude ?? null,
                        longitude:
                          defaultAddress.coordinates?.longitude ?? null,
                        placeId: "",
                        name: "",
                        street: "",
                        houseNumber: "",
                        city: defaultAddress.city || "",
                        state: defaultAddress.state || "",
                        district: "",
                        suburb: "",
                        postcode: "",
                        country: "Nigeria",
                        countryCode: "ng",
                        landmark: defaultAddress.landmark || "",
                        deliveryInstructions:
                          defaultAddress.deliveryInstructions || "",
                      });
                    }}
                    disabled={updatingAddress}
                    className="inline-flex items-center gap-2 rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-semibold text-dark-700 hover:bg-dark-50 disabled:opacity-50"
                  >
                    <LuX size={16} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    disabled={updatingAddress || !location}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LuSave size={16} />

                    {updatingAddress ? "Saving..." : "Save address"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dark-100 bg-dark-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <LuMapPin size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-dark-900">
                      {defaultAddress.firstname} {defaultAddress.lastname}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-dark-600">
                      {defaultAddress.address}
                    </p>

                    <p className="text-sm text-dark-600">
                      {defaultAddress.city}, {defaultAddress.state}
                    </p>

                    {defaultAddress.landmark && (
                      <p className="mt-1 text-sm text-dark-500">
                        Landmark: {defaultAddress.landmark}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-dark-500">
                      {defaultAddress.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <label
        className={`block text-sm font-semibold text-dark-700 ${
          deliveryMethod === "delivery" ? "mt-5" : ""
        }`}
      >
        Special instructions{" "}
        <span className="font-normal text-dark-400">(optional)</span>
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={update}
          disabled={disabled}
          rows="2"
          placeholder="Anything the kitchen or delivery driver should know?"
          className="mt-2 w-full rounded-xl border border-dark-200 px-4 py-3 font-normal outline-none focus:border-primary-500 disabled:bg-dark-50"
        />
      </label>
    </section>
  );
}

export default DeliveryAddressSection;
