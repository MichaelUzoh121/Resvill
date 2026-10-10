
import React, { useEffect } from "react";
import { useUser } from "../hooks/useUser";

function CustomerInformation({
  form,
  update,
  deliveryMethod,
  setDeliveryMethod,
  disabled,
}) {
  const { profile, isLoading } = useUser();

  useEffect(() => {
    if (!profile) return;

    const fullName = [profile.firstname, profile.lastname]
      .filter(Boolean)
      .join(" ")
      .trim();

    update({
      target: {
        name: "name",
        value: fullName,
      },
    });

    update({
      target: {
        name: "email",
        value: profile.email || "",
      },
    });

    update({
      target: {
        name: "phone",
        value: profile.phone || "",
      },
    });
  }, [
    profile?._id,
    profile?.firstname,
    profile?.lastname,
    profile?.email,
    profile?.phone,
  ]);

  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <h2 className="font-heading text-xl font-bold text-dark-950">
        Contact details
      </h2>

      <p className="mt-1 text-sm text-dark-500">
        Your account information has been filled in automatically.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-dark-700">
          Full name

          <input
            required
            name="name"
            value={form.name}
            onChange={update}
            disabled={disabled || isLoading}
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-dark-200 px-4 py-3 font-normal outline-none focus:border-primary-500 disabled:bg-dark-50"
          />
        </label>

        <label className="text-sm font-semibold text-dark-700">
          Email

          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={update}
            disabled={disabled || isLoading}
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-dark-200 px-4 py-3 font-normal outline-none focus:border-primary-500 disabled:bg-dark-50"
          />
        </label>

        <label className="text-sm font-semibold text-dark-700">
          Phone

          <input
            required
            name="phone"
            value={form.phone}
            onChange={update}
            disabled={disabled || isLoading}
            autoComplete="tel"
            className="mt-2 w-full rounded-xl border border-dark-200 px-4 py-3 font-normal outline-none focus:border-primary-500 disabled:bg-dark-50"
          />
        </label>

        <label className="text-sm font-semibold text-dark-700">
          Delivery method

          <select
            value={deliveryMethod}
            disabled={disabled}
            onChange={(event) =>
              setDeliveryMethod(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-dark-200 bg-white px-4 py-3 font-normal outline-none focus:border-primary-500 disabled:bg-dark-50"
          >
            <option value="delivery">
              Home delivery
            </option>

            <option value="pickup">
              Pickup at Resvill
            </option>
          </select>
        </label>
      </div>
    </section>
  );
}

export default CustomerInformation;
