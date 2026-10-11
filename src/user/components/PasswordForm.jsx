import FormField from "./FormField";

function PasswordForm({
  passwordForm,
  setPasswordForm,
  updatePassword,
  loading,
}) {
  return (
    <form
      onSubmit={updatePassword}
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
          Security
        </p>

        <h2
          className="
            mt-1
            text-xl
            font-bold
            text-dark-900
          "
        >
          Change password
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-dark-600
          "
        >
          Use a strong password to keep your account safe.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          label="Current password"
          type="password"
          name="current"
          value={passwordForm.current}
          onChange={(event) =>
            setPasswordForm((current) => ({
              ...current,
              current: event.target.value,
            }))
          }
          required
        />

        <FormField
          label="New password"
          type="password"
          name="next"
          value={passwordForm.next}
          onChange={(event) =>
            setPasswordForm((current) => ({
              ...current,
              next: event.target.value,
            }))
          }
          required
        />

        <FormField
          label="Confirm new password"
          type="password"
          name="confirm"
          value={passwordForm.confirm}
          onChange={(event) =>
            setPasswordForm((current) => ({
              ...current,
              confirm: event.target.value,
            }))
          }
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          mt-5
          rounded-xl
          border border-primary-500
          px-6
          py-3
          text-sm
          font-bold
          text-primary-500
          transition
          hover:bg-primary-50
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}

export default PasswordForm;