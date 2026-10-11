import FormField from "./FormField";
import AddressAutocomplete from "../../components/AddressAutocomplete";

function AddressForm({
  form,
  updateField,
  updateLocation,
  saveAddress,
  loading,
  isEditing,
  onCancel,
}) {
  return (
    <form
      onSubmit={saveAddress}
      className="
        rounded-2xl
        border border-dark-200
        bg-white
        p-5
        shadow-soft
        sm:p-6
      "
    >
      <div className="mb-5">
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.16em]
            text-primary-500
          "
        >
          {isEditing ? "Edit address" : "New address"}
        </p>

        <h2 className="mt-1 text-xl font-bold text-dark-900">
          {isEditing ? "Update address" : "Add an address"}
        </h2>

        <p className="mt-1 text-sm text-dark-600">
          Save an address for faster and easier checkout.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Address label"
          name="label"
          value={form.label}
          onChange={updateField}
          placeholder="e.g. Home"
        />

        <div>
          <label
            className="
              block
              text-sm
              font-semibold
              text-dark-700
            "
          >
            Address type

            <select
              name="label"
              value={form.label}
              onChange={updateField}
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-dark-200
                bg-white
                px-4
                py-3
                text-sm
                outline-none
                focus:border-primary-500
              "
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <FormField
          label="First name"
          name="firstname"
          value={form.firstname}
          onChange={updateField}
          required
        />

        <FormField
          label="Last name"
          name="lastname"
          value={form.lastname}
          onChange={updateField}
          required
        />

        <FormField
          label="Phone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={updateField}
          required
          className="sm:col-span-2"
        />

        <div className="sm:col-span-2">
          <AddressAutocomplete
            label="Delivery address"
            value={form.location}
            onChange={updateLocation}
            showInstructions
            required
          />
        </div>

        <FormField
          label="City"
          name="city"
          value={form.city}
          onChange={updateField}
          required
        />

        <FormField
          label="State"
          name="state"
          value={form.state}
          onChange={updateField}
          required
        />

        <FormField
          label="Landmark"
          name="landmark"
          value={form.landmark}
          onChange={updateField}
          className="sm:col-span-2"
          placeholder="e.g. Beside XYZ Pharmacy"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="
            rounded-xl
            bg-primary-500
            px-5
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-primary-600
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update address"
              : "Save address"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              rounded-xl
              border
              border-dark-200
              px-5
              py-3
              text-sm
              font-bold
              text-dark-700
              hover:bg-dark-50
              disabled:opacity-60
            "
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddressForm;