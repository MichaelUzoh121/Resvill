import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useAdminAccountSettings,
  useUpdateAdminAccountSettings,
  useChangeAdminPassword,
  useChangeAdminEmail,
  useAdminSecuritySettings,
} from "../hooks/useAdminSettings";

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getFullName = (account) => {
  return (
    [account?.firstname, account?.lastname].filter(Boolean).join(" ").trim() ||
    "Admin"
  );
};

const getInitials = (account) => {
  return getFullName(account)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
};

function SectionCard({ title, description, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
      <div className="border-b border-dark-100 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Icon size={20} />
          </div>

          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold text-dark-900 sm:text-lg">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm leading-6 text-dark-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-dark-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 disabled:cursor-not-allowed disabled:bg-dark-50 disabled:text-dark-500"
      />
    </div>
  );
}

function StatusBadge({ active, activeLabel, inactiveLabel }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
        active
          ? "bg-success/10 text-success"
          : "bg-danger/10 text-danger",
      ].join(" ")}
    >
      {active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}

      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-dark-100 bg-dark-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-dark-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-dark-900">
        {value || "Not available"}
      </p>
    </div>
  );
}

function AdminSettings() {
  const {
    data: account,
    isLoading: accountLoading,
    isError: accountError,
    refetch: refetchAccount,
  } = useAdminAccountSettings();

  const { data: security, isLoading: securityLoading } =
    useAdminSecuritySettings();

  const updateAccountMutation = useUpdateAdminAccountSettings();
  const changePasswordMutation = useChangeAdminPassword();
  const changeEmailMutation = useChangeAdminEmail();

  const [profileForm, setProfileForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailForm, setEmailForm] = useState({
    newEmail: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!account) {
      return;
    }

    setProfileForm({
      firstname: account?.firstname || "",
      lastname: account?.lastname || "",
      phone: account?.phone || "",
    });
  }, [account]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleEmailChange = (event) => {
    setEmailForm({
      newEmail: event.target.value,
    });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!profileForm.firstname.trim()) {
      toast.error("First name is required.");
      return;
    }

    if (!profileForm.lastname.trim()) {
      toast.error("Last name is required.");
      return;
    }

    try {
      await updateAccountMutation.mutateAsync({
        firstname: profileForm.firstname.trim(),
        lastname: profileForm.lastname.trim(),
        phone: profileForm.phone.trim(),
      });

      toast.success("Account information updated successfully.");

      refetchAccount();
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update account information."),
      );
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error("New password must be different from your current password.");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password changed successfully.");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to change password."));
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    const newEmail = emailForm.newEmail.trim();

    if (!newEmail) {
      toast.error("Please enter a new email address.");
      return;
    }

    if (newEmail === account?.email) {
      toast.error("The new email must be different from your current email.");
      return;
    }

    try {
      await changeEmailMutation.mutateAsync({
        newEmail,
      });

      toast.success("Email updated. Please verify your new email address.");

      setEmailForm({
        newEmail: "",
      });

      refetchAccount();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to change email address."));
    }
  };

  if (accountLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-52 animate-pulse rounded-lg bg-dark-100" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-dark-100" />
        </div>

        <div className="h-40 animate-pulse rounded-2xl bg-dark-100" />

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-2xl bg-dark-100"
          />
        ))}
      </div>
    );
  }

  if (accountError || !account) {
    return (
      <div className="rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
          <XCircle size={26} />
        </div>

        <h2 className="mt-4 font-heading text-lg font-semibold text-dark-900">
          Unable to load account settings
        </h2>

        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-dark-500">
          We couldn't retrieve your admin account information. Please try
          again.
        </p>

        <button
          type="button"
          onClick={() => refetchAccount()}
          className="mt-5 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const accountName = getFullName(account);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1 text-sm leading-6 text-dark-500">
          Manage your admin profile, password, email address, and account
          security.
        </p>
      </div>

      {/* ACCOUNT OVERVIEW */}
      <div className="relative overflow-hidden rounded-2xl bg-dark-950 p-6 text-white shadow-card sm:p-7">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-500 text-lg font-bold shadow-lg shadow-primary-500/20">
              {getInitials(account)}
            </div>

            <div className="min-w-0">
              <h2 className="font-heading text-xl font-semibold">
                {accountName}
              </h2>

              <p className="mt-1 break-all text-sm text-white/65">
                {account.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold capitalize text-white">
              {account.role || "Admin"}
            </span>

            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
              {account.isActive ? "Active" : "Inactive"}
            </span>

            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
              {account.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
      </div>

      {/* PROFILE */}
      <SectionCard
        title="Profile Information"
        description="Update the personal information associated with your admin account."
        icon={User}
      >
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="First Name"
              name="firstname"
              value={profileForm.firstname}
              onChange={handleProfileChange}
              placeholder="First name"
              disabled={updateAccountMutation.isPending}
            />

            <Field
              label="Last Name"
              name="lastname"
              value={profileForm.lastname}
              onChange={handleProfileChange}
              placeholder="Last name"
              disabled={updateAccountMutation.isPending}
            />

            <Field
              label="Phone"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
              placeholder="Phone number"
              disabled={updateAccountMutation.isPending}
            />

            <Field label="Email" value={account.email || ""} disabled />
          </div>

          <div className="flex justify-end border-t border-dark-100 pt-5">
            <button
              type="submit"
              disabled={updateAccountMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {updateAccountMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* ACCOUNT INFORMATION */}
      <SectionCard
        title="Account Information"
        description="Review important information and account activity."
        icon={ShieldCheck}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="Role"
            value={
              account.role
                ? account.role.charAt(0).toUpperCase() +
                  account.role.slice(1)
                : "Not available"
            }
          />

          <div className="rounded-xl border border-dark-100 bg-dark-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-dark-400">
              Account Status
            </p>

            <div className="mt-2">
              <StatusBadge
                active={Boolean(account.isActive)}
                activeLabel="Active"
                inactiveLabel="Inactive"
              />
            </div>
          </div>

          <div className="rounded-xl border border-dark-100 bg-dark-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-dark-400">
              Verification
            </p>

            <div className="mt-2">
              <StatusBadge
                active={Boolean(account.isVerified)}
                activeLabel="Verified"
                inactiveLabel="Not verified"
              />
            </div>
          </div>

          <InfoItem label="Created" value={formatDate(account.createdAt)} />

          <InfoItem
            label="Last Login"
            value={formatDate(account.lastLoginAt)}
          />

          <InfoItem
            label="Password Changed"
            value={formatDate(account.passwordChangedAt)}
          />
        </div>
      </SectionCard>

      {/* PASSWORD */}
      <SectionCard
        title="Change Password"
        description="Use a strong password with at least 8 characters."
        icon={KeyRound}
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            {/* CURRENT PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-dark-700">
                Current Password
              </label>

              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 pr-11 text-sm text-dark-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 transition hover:text-dark-700"
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-dark-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 pr-11 text-sm text-dark-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 transition hover:text-dark-700"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-dark-700">
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 pr-11 text-sm text-dark-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 transition hover:text-dark-700"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
            <div className="flex items-start gap-3">
              <Lock
                size={18}
                className="mt-0.5 shrink-0 text-primary-600"
              />

              <div>
                <p className="text-sm font-semibold text-primary-700">
                  Password security
                </p>

                <p className="mt-1 text-xs leading-5 text-primary-600">
                  Your new password must be at least 8 characters and should be
                  different from your current password.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-dark-100 pt-5">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-dark-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-dark-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={17} />

              {changePasswordMutation.isPending
                ? "Changing..."
                : "Change Password"}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* EMAIL */}
      <SectionCard
        title="Change Email Address"
        description="Changing your email will require verification of the new address."
        icon={Mail}
      >
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Current Email" value={account.email || ""} disabled />

            <Field
              label="New Email"
              value={emailForm.newEmail}
              onChange={handleEmailChange}
              type="email"
              placeholder="new@email.com"
              disabled={changeEmailMutation.isPending}
            />
          </div>

          <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
            <div className="flex items-start gap-3">
              <Mail
                size={18}
                className="mt-0.5 shrink-0 text-warning"
              />

              <div>
                <p className="text-sm font-semibold text-dark-800">
                  Email verification required
                </p>

                <p className="mt-1 text-xs leading-5 text-dark-600">
                  After changing your email, your account will need to be
                  verified again using the new email address.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-dark-100 pt-5">
            <button
              type="submit"
              disabled={changeEmailMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Mail size={17} />

              {changeEmailMutation.isPending
                ? "Updating..."
                : "Update Email"}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* SECURITY */}
      <SectionCard
        title="Security"
        description="Review the security state and recent account activity."
        icon={ShieldCheck}
      >
        {securityLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-dark-50"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {/* EMAIL VERIFICATION */}
            <div className="flex flex-col gap-4 rounded-xl border border-dark-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-dark-900">
                    Email verification
                  </p>

                  <p className="mt-0.5 text-xs text-dark-500">
                    {security?.account?.email ||
                      account.email ||
                      "No email available"}
                  </p>
                </div>
              </div>

              <StatusBadge
                active={Boolean(
                  security?.account?.isVerified ?? account.isVerified,
                )}
                activeLabel="Verified"
                inactiveLabel="Not verified"
              />
            </div>

            {/* ACCOUNT STATUS */}
            <div className="flex flex-col gap-4 rounded-xl border border-dark-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-dark-900">
                    Account status
                  </p>

                  <p className="mt-0.5 text-xs text-dark-500">
                    Whether the admin account is active.
                  </p>
                </div>
              </div>

              <StatusBadge
                active={Boolean(
                  security?.account?.isActive ?? account.isActive,
                )}
                activeLabel="Active"
                inactiveLabel="Inactive"
              />
            </div>

            {/* LAST LOGIN */}
            <div className="flex flex-col gap-4 rounded-xl border border-dark-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark-50 text-dark-500">
                  <Clock3 size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-dark-900">
                    Last login
                  </p>

                  <p className="mt-0.5 text-xs text-dark-500">
                    Most recent successful account login.
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold text-dark-700">
                {formatDate(
                  security?.security?.lastLoginAt ?? account.lastLoginAt,
                )}
              </p>
            </div>

            {/* PASSWORD CHANGED */}
            <div className="flex flex-col gap-4 rounded-xl border border-dark-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark-50 text-dark-500">
                  <KeyRound size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-dark-900">
                    Password last changed
                  </p>

                  <p className="mt-0.5 text-xs text-dark-500">
                    Date your account password was last updated.
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold text-dark-700">
                {formatDate(
                  security?.security?.passwordChangedAt ??
                    account.passwordChangedAt,
                )}
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      {/* CONTACT INFORMATION */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Phone size={19} />
            </div>

            <div className="min-w-0">
              <h3 className="font-heading text-sm font-semibold text-dark-900">
                Phone Number
              </h3>

              <p className="mt-1 break-words text-sm text-dark-500">
                {account.phone || "No phone number added"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Mail size={19} />
            </div>

            <div className="min-w-0">
              <h3 className="font-heading text-sm font-semibold text-dark-900">
                Email Address
              </h3>

              <p className="mt-1 break-all text-sm text-dark-500">
                {account.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;