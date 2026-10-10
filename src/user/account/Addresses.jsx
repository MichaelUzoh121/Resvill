// import { useState } from "react";
// import { MapPin, Plus, Trash2 } from "lucide-react";
// import { toast } from "react-hot-toast";

// import AddressAutocomplete from "../../components/AddressAutocomplete";

// import { useUser } from "../../hooks/useUser";

// function Addresses() {
//   const { profile, updateProfile, updatingProfile } = useUser();

//   const addresses = profile?.addresses || [];

//   const [newAddress, setNewAddress] = useState({});

//   const addAddress = async () => {
//     if (!newAddress?.addressText) {
//       toast.error("Please select an address");

//       return;
//     }

//     try {
//       await updateProfile({
//         addresses: [...addresses, newAddress],
//       });

//       setNewAddress({});

//       toast.success("Address saved successfully");
//     } catch (error) {
//       toast.error("Unable to save address");
//     }
//   };

//   const removeAddress = async (index) => {
//     try {
//       const updated = addresses.filter((_, i) => i !== index);

//       await updateProfile({
//         addresses: updated,
//       });

//       toast.success("Address removed");
//     } catch (error) {
//       toast.error("Unable to remove address");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <p
//           className="
//           text-sm
//           font-bold
//           uppercase
//           tracking-widest
//           text-primary-500
//         "
//         >
//           Addresses
//         </p>

//         <h1
//           className="
//           mt-2
//           text-3xl
//           font-extrabold
//           text-dark-900
//         "
//         >
//           Saved delivery addresses
//         </h1>

//         <p className="mt-2 text-dark-600">
//           Manage locations used when placing orders.
//         </p>
//       </div>

//       <div
//         className="
//         rounded-2xl
//         border border-dark-200
//         bg-white
//         p-5
//         shadow-soft
//       "
//       >
//         <h2
//           className="
//           mb-4
//           text-lg
//           font-bold
//           text-dark-900
//         "
//         >
//           Add new address
//         </h2>

//         <AddressAutocomplete
//           label="Delivery address"
//           value={newAddress}
//           onChange={setNewAddress}
//           showInstructions
//         />

//         <button
//           type="button"
//           disabled={updatingProfile}
//           onClick={addAddress}
//           className="
//             mt-5
//             inline-flex
//             items-center
//             gap-2
//             rounded-xl
//             bg-primary-500
//             px-5
//             py-3
//             text-sm
//             font-bold
//             text-white
//             hover:bg-primary-600
//             disabled:opacity-50
//           "
//         >
//           {/* <Plus size={16}/>

//           Save address */}

//           {updatingProfile ? (
//             "Saving..."
//           ) : (
//             <>
//               <Plus size={16} />
//               Save address
//             </>
//           )}
//         </button>
//       </div>

//       <div className="space-y-4">
//         {addresses.length === 0 ? (
//           <div
//             className="
//               rounded-2xl
//               bg-dark-50
//               p-8
//               text-center
//             "
//           >
//             <MapPin className="mx-auto text-dark-400" size={28} />

//             <p className="mt-3 text-dark-600">No saved addresses yet.</p>
//           </div>
//         ) : (
//           addresses.map((address, index) => (
//             <div
//               key={index}
//               className="
//                   flex
//                   items-start
//                   justify-between
//                   rounded-2xl
//                   border border-dark-200
//                   bg-white
//                   p-5
//                   shadow-soft
//                 "
//             >
//               <div className="flex gap-3">
//                 <div
//                   className="
//                     flex
//                     h-10
//                     w-10
//                     items-center
//                     justify-center
//                     rounded-xl
//                     bg-primary-50
//                     text-primary-500
//                   "
//                 >
//                   <MapPin size={18} />
//                 </div>

//                 <div>
//                   <p
//                     className="
//                       font-bold
//                       text-dark-900
//                     "
//                   >
//                     Address {index + 1}
//                   </p>

//                   <p
//                     className="
//                       mt-1
//                       text-sm
//                       text-dark-600
//                     "
//                   >
//                     {address.addressText}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => removeAddress(index)}
//                 className="
//                     text-red-500
//                     hover:text-red-600
//                   "
//               >
//                 <Trash2 size={18} />
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Addresses;



import { useEffect, useState } from "react";
import {
  Check,
  Edit3,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

import AddressForm from "../components/AddressForm";
import { useAddresses } from "../../hooks/useAddresses";
import { useUser } from "../../hooks/useUser";
import { EMPTY_LOCATION } from "../../utils/address";
import { locationToAddressPayload } from "../../utils/address";

const EMPTY_FORM = {
  label: "home",
  firstname: "",
  lastname: "",
  phone: "",
  city: "",
  state: "",
  landmark: "",
  location: {
    ...EMPTY_LOCATION,
  },
};

function Addresses() {
  const {
    addresses,
    isLoading,
    isError,
    createAddress,
    creatingAddress,
    updateAddress,
    updatingAddress,
    deleteAddress,
    deletingAddress,
    setDefaultAddress,
    settingDefaultAddress,
  } = useAddresses();

  const { profile } = useUser();

  const [form, setForm] = useState(EMPTY_FORM);

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setForm((current) => ({
      ...current,

      firstname:
        current.firstname ||
        profile.firstname ||
        "",

      lastname:
        current.lastname ||
        profile.lastname ||
        "",

      phone:
        current.phone ||
        profile.phone ||
        "",
    }));
  }, [profile]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const updateLocation = (location) => {
    setForm((current) => ({
      ...current,

      location,

      city:
        location.city ||
        current.city ||
        "",

      state:
        location.state ||
        current.state ||
        "",

      landmark:
        location.landmark ||
        current.landmark ||
        "",
    }));
  };

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,

      firstname: profile?.firstname || "",
      lastname: profile?.lastname || "",
      phone: profile?.phone || "",

      location: {
        ...EMPTY_LOCATION,
      },
    });

    setEditingAddressId(null);
    setShowForm(false);
  };

  const saveAddress = async (event) => {
    event.preventDefault();

    if (!form.firstname.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!form.lastname.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!form.location?.addressText?.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    if (!form.city.trim()) {
      toast.error("City is required");
      return;
    }

    if (!form.state.trim()) {
      toast.error("State is required");
      return;
    }

    const payload = locationToAddressPayload({
      location: {
        ...form.location,

        city: form.city,
        state: form.state,
        landmark: form.landmark,
      },

      firstname: form.firstname,
      lastname: form.lastname,
      phone: form.phone,
      label: form.label,
    });

    try {
      if (editingAddressId) {
        await updateAddress({
          addressId: editingAddressId,
          payload,
        });

        toast.success("Address updated successfully");
      } else {
        await createAddress(payload);

        toast.success("Address saved successfully");
      }

      resetForm();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to save address",
      );
    }
  };

  const startEditing = (address) => {
    setEditingAddressId(address._id);

    setForm({
      label: address.label || "home",

      firstname: address.firstname || "",

      lastname: address.lastname || "",

      phone: address.phone || "",

      city: address.city || "",

      state: address.state || "",

      landmark: address.landmark || "",

      location: {
        ...EMPTY_LOCATION,

        addressText: address.address || "",

        city: address.city || "",

        state: address.state || "",

        landmark: address.landmark || "",

        deliveryInstructions:
          address.deliveryInstructions || "",

        latitude:
          address.coordinates?.latitude ?? null,

        longitude:
          address.coordinates?.longitude ?? null,
      },
    });

    setShowForm(true);
  };

  const handleDelete = async (address) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmed) return;

    try {
      await deleteAddress(address._id);

      toast.success("Address deleted successfully");

      if (editingAddressId === address._id) {
        resetForm();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete address",
      );
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await setDefaultAddress(address._id);

      toast.success("Default address updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to set default address",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p
          className="
            text-sm
            font-bold
            uppercase
            tracking-widest
            text-primary-500
          "
        >
          Addresses
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-extrabold
            text-dark-900
          "
        >
          Saved delivery addresses
        </h1>

        <p className="mt-2 text-dark-600">
          Manage the addresses you use when placing orders.
        </p>
      </div>

      {!showForm && (
        <button
          type="button"
          onClick={() => {
            setForm({
              ...EMPTY_FORM,
              firstname: profile?.firstname || "",
              lastname: profile?.lastname || "",
              phone: profile?.phone || "",
            });

            setEditingAddressId(null);
            setShowForm(true);
          }}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-primary-500
            px-5
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-primary-600
          "
        >
          <Plus size={17} />
          Add new address
        </button>
      )}

      {showForm && (
        <AddressForm
          form={form}
          updateField={updateField}
          updateLocation={updateLocation}
          saveAddress={saveAddress}
          loading={
            creatingAddress ||
            updatingAddress
          }
          isEditing={Boolean(editingAddressId)}
          onCancel={resetForm}
        />
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-dark-900">
            Your addresses
          </h2>

          <p className="mt-1 text-sm text-dark-600">
            Choose a default address for faster checkout.
          </p>
        </div>

        {isLoading ? (
          <div
            className="
              rounded-2xl
              border border-dark-200
              bg-white
              p-8
              text-center
              shadow-soft
            "
          >
            <p className="text-sm text-dark-600">
              Loading addresses...
            </p>
          </div>
        ) : isError ? (
          <div
            className="
              rounded-2xl
              border border-red-100
              bg-red-50
              p-8
              text-center
            "
          >
            <p className="text-sm text-red-600">
              Unable to load your saved addresses.
            </p>
          </div>
        ) : addresses.length === 0 ? (
          <div
            className="
              rounded-2xl
              bg-dark-50
              p-8
              text-center
            "
          >
            <MapPin
              className="mx-auto text-dark-400"
              size={28}
            />

            <p className="mt-3 font-semibold text-dark-700">
              No saved addresses yet.
            </p>

            <p className="mt-1 text-sm text-dark-500">
              Add your first delivery address to make
              checkout faster.
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className="
                rounded-2xl
                border border-dark-200
                bg-white
                p-5
                shadow-soft
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary-50
                      text-primary-500
                    "
                  >
                    <MapPin size={18} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold capitalize text-dark-900">
                        {address.label || "Address"}
                      </p>

                      {address.isDefault && (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-full
                            bg-primary-50
                            px-2.5
                            py-1
                            text-xs
                            font-bold
                            text-primary-600
                          "
                        >
                          <Check size={13} />
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm font-medium text-dark-800">
                      {address.firstname} {address.lastname}
                    </p>

                    <p className="mt-1 text-sm text-dark-600">
                      {address.address}
                    </p>

                    <p className="mt-1 text-sm text-dark-600">
                      {address.city}, {address.state}
                    </p>

                    {address.landmark && (
                      <p className="mt-1 text-xs text-dark-500">
                        Landmark: {address.landmark}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-dark-500">
                      {address.phone}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      startEditing(address)
                    }
                    className="
                      rounded-lg
                      p-2
                      text-dark-500
                      hover:bg-dark-50
                      hover:text-primary-500
                    "
                    aria-label="Edit address"
                  >
                    <Edit3 size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(address)
                    }
                    disabled={deletingAddress}
                    className="
                      rounded-lg
                      p-2
                      text-red-500
                      hover:bg-red-50
                      hover:text-red-600
                      disabled:opacity-50
                    "
                    aria-label="Delete address"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() =>
                    handleSetDefault(address)
                  }
                  disabled={settingDefaultAddress}
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-dark-200
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-dark-700
                    hover:border-primary-300
                    hover:bg-primary-50
                    hover:text-primary-600
                    disabled:opacity-50
                  "
                >
                  {settingDefaultAddress
                    ? "Updating..."
                    : "Set as default"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Addresses;