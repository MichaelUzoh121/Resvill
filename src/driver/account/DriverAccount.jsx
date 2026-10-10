import React, { useEffect, useState } from "react";
import {
  LuShieldCheck,
  LuUserRound,
} from "react-icons/lu";

import { useUser } from "../../hooks/useUser";
import ProfileForm from "../../user/components/ProfileForm";
import PasswordForm from "../../user/components/PasswordForm";

function DriverAccount() {
  const {
    profile,
    updateProfile,
    updatingProfile,
    changePassword,
    changingPassword,
  } = useUser();

  const [profileForm, setProfileForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  useEffect(() => {
    if (!profile) return;

    setProfileForm({
      firstname: profile.firstname || "",
      lastname: profile.lastname || "",
      phone: profile.phone || "",
      email: profile.email || "",
    });
  }, [profile]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    const data = {
      firstname: profileForm.firstname.trim(),
      lastname: profileForm.lastname.trim(),
    };

    if (profileForm.phone.trim()) {
      data.phone = profileForm.phone.trim();
    }

    await updateProfile(data);
  };

  const updatePassword = async (event) => {
    event.preventDefault();

    await changePassword({
      currentPassword: passwordForm.current.trim(),
      newPassword: passwordForm.next,
      confirmPassword: passwordForm.confirm,
    });

    setPasswordForm({
      current: "",
      next: "",
      confirm: "",
    });
  };

  if (!profile) {
    return (
      <div className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="animate-pulse space-y-3">
            <div className="h-3 w-32 rounded bg-dark-200" />
            <div className="h-8 w-52 rounded-lg bg-dark-200" />
            <div className="h-4 w-80 rounded bg-dark-100" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-24 animate-pulse rounded-2xl border border-dark-100 bg-white" />
            <div className="h-24 animate-pulse rounded-2xl border border-dark-100 bg-white" />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="h-80 animate-pulse rounded-2xl border border-dark-100 bg-white" />
            <div className="h-80 animate-pulse rounded-2xl border border-dark-100 bg-white" />
          </div>
        </div>
      </div>
    );
  }

  const fullName =
    [profile.firstname, profile.lastname].filter(Boolean).join(" ") ||
    "Driver";

  return (
    <div className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dark-400">
              Driver Account
            </p>
          </div>

          <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
            Account & Profile
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-dark-500">
            Manage your personal information and keep your account secure.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <LuUserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">
                Account
              </p>

              <p className="mt-1 truncate font-heading text-sm font-bold text-dark-900">
                {fullName}
              </p>

              {profile.email && (
                <p className="mt-0.5 truncate text-xs text-dark-500">
                  {profile.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <LuShieldCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">
                Role
              </p>

              <p className="mt-1 font-heading text-sm font-bold capitalize text-dark-900">
                {profile.role || "Delivery"}
              </p>

              <p className="mt-0.5 text-xs text-dark-500">
                Driver access
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
                Account Settings
              </p>
            </div>

            <h2 className="mt-1.5 font-heading text-base font-bold text-dark-900">
              Personal information & security
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Update your profile details or change your account password.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <ProfileForm
              profileForm={profileForm}
              updateField={updateField}
              saveProfile={saveProfile}
              loading={updatingProfile}
            />

            <PasswordForm
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              updatePassword={updatePassword}
              loading={changingPassword}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default DriverAccount;