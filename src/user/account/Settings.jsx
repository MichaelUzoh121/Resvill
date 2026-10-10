import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useUser } from "../../hooks/useUser";
import { ROUTES } from "../../constants/routes";

function Settings() {
  const navigate = useNavigate();

  const { deleteAccount, deletingAccount } = useUser();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();

      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to delete your account",
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
          Settings
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-extrabold
            text-dark-900
          "
        >
          Account settings
        </h1>

        <p className="mt-2 text-dark-600">Manage your account settings.</p>
      </div>

      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-white
          p-5
          shadow-soft
          sm:p-6
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
            "
          >
            <AlertTriangle size={21} />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-lg
                font-bold
                text-dark-900
              "
            >
              Delete account
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-dark-600
              "
            >
              Permanently delete your Resvill account and associated account
              information. This action cannot be undone.
            </p>

            {!showConfirmation ? (
              <button
                type="button"
                onClick={() => setShowConfirmation(true)}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-red-600
                "
              >
                <Trash2 size={16} />
                Delete account
              </button>
            ) : (
              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                "
              >
                <p
                  className="
                    text-sm
                    font-bold
                    text-red-700
                  "
                >
                  Are you sure you want to delete your account?
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-red-600
                  "
                >
                  Your account will be permanently deleted. This action cannot
                  be undone.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={deletingAccount}
                    onClick={handleDeleteAccount}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-red-500
                      px-5
                      py-2.5
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-red-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <Trash2 size={15} />

                    {deletingAccount ? "Deleting..." : "Yes, delete my account"}
                  </button>

                  <button
                    type="button"
                    disabled={deletingAccount}
                    onClick={() => setShowConfirmation(false)}
                    className="
                      rounded-xl
                      border
                      border-dark-200
                      bg-white
                      px-5
                      py-2.5
                      text-sm
                      font-bold
                      text-dark-700
                      transition
                      hover:bg-dark-50
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
