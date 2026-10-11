import FormField from "./FormField";

function ProfileForm({
  profileForm,
  updateField,
  saveProfile,
  loading,
}) {
  return (
    <form
      onSubmit={saveProfile}
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
          Account details
        </p>

        <h2
          className="
            mt-1
            text-xl
            font-bold
            text-dark-900
          "
        >
          Your profile
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-dark-600
          "
        >
          Update your personal information associated with your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="First name"
          name="firstname"
          value={profileForm.firstname}
          onChange={updateField}
          required
        />

        <FormField
          label="Last name"
          name="lastname"
          value={profileForm.lastname}
          onChange={updateField}
          required
        />

        <FormField
          label="Phone"
          type="tel"
          name="phone"
          value={profileForm.phone}
          onChange={updateField}
          className="sm:col-span-2"
        />

        <FormField
          label="Email"
          type="email"
          name="email"
          value={profileForm.email}
          disabled
          readOnly
          className="sm:col-span-2"
        />
      </div>

      <div
        className="
          mt-4
          rounded-xl
          border border-dark-200
          bg-dark-50
          px-4
          py-3
        "
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-dark-500">
          Email address
        </p>

        <p className="mt-1 text-sm text-dark-600">
          Your email address cannot be changed from your profile.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          mt-5
          rounded-xl
          bg-primary-500
          px-6
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
        {loading ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

export default ProfileForm;