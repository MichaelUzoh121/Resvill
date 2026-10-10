import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleOff,
  Eye,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Truck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useAdminAccounts,
  useAdminAccount,
  useCreateAdminUser,
  useUpdateAdminAccountStatus,
  useDeleteAdminAccount,
} from "../hooks/useAdminAccounts";

import ConfirmDialog from "../../common/ConfirmDialog";

const emptyForm = {
  name: "",
  email: "",
  role: "staff",
};

const ROLE_OPTIONS = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "staff",
    label: "Staff",
  },
  {
    value: "delivery",
    label: "Delivery",
  },
];

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];

const formatRole = (role) => {
  if (!role) {
    return "Unknown";
  }

  if (role === "delivery") {
    return "Delivery";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
};

const getAccountId = (account) => account?._id || account?.id;

const getAccountName = (account) => {
  if (account?.name) {
    return account.name;
  }

  const fullName = [account?.firstname, account?.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Unnamed account";
};

const getInitials = (account) => {
  const name = getAccountName(account);

  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "NA"
  );
};

function AdminAccounts() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [accountToDelete, setAccountToDelete] = useState(null);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminAccounts({
      search,
      role,
      status,
    });

  const createMutation = useCreateAdminUser();
  const statusMutation = useUpdateAdminAccountStatus();
  const deleteAdminAccountMutation = useDeleteAdminAccount();

  const {
    data: selectedAccount,
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    error: detailsError,
  } = useAdminAccount(selectedAccountId);

  const accounts = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.accounts)) {
      return data.accounts;
    }

    if (Array.isArray(data?.users)) {
      return data.users;
    }

    return [];
  }, [data]);

  const summary = useMemo(() => {
    return {
      total: accounts.length,
      admins: accounts.filter((account) => account.role === "admin").length,
      staff: accounts.filter((account) => account.role === "staff").length,
      delivery: accounts.filter((account) => account.role === "delivery")
        .length,
      active: accounts.filter((account) => account.isActive !== false).length,
    };
  }, [accounts]);

  const openCreateModal = () => {
    setForm(emptyForm);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    if (createMutation.isPending) {
      return;
    }

    setShowCreateModal(false);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name) {
      toast.error("Name is required.");
      return;
    }

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    if (!form.role) {
      toast.error("Select an account role.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name,
        email,
        role: form.role,
      });

      toast.success(
        "Account created. Login credentials have been sent by email.",
      );

      closeCreateModal();
    } catch (mutationError) {
      toast.error(
        mutationError?.response?.data?.message ||
          mutationError?.message ||
          "Unable to create account.",
      );
    }
  };

  const handleStatusToggle = async (account) => {
    const accountId = getAccountId(account);

    if (!accountId) {
      toast.error("Unable to identify this account.");
      return;
    }

    const nextStatus = account.isActive === false;

    try {
      await statusMutation.mutateAsync({
        accountId,
        isActive: nextStatus,
      });

      toast.success(nextStatus ? "Account activated." : "Account deactivated.");
    } catch (mutationError) {
      toast.error(
        mutationError?.response?.data?.message ||
          mutationError?.message ||
          "Unable to update account status.",
      );
    }
  };

  //   const handleDeleteAccount = async (account) => {
  //     const accountId = getAccountId(account);

  //     if (!accountId) {
  //       toast.error("Unable to identify this account.");
  //       return;
  //     }

  //     const accountName = getAccountName(account);

  //     const confirmed = window.confirm(
  //       `Delete ${accountName}? This action cannot be undone.`,
  //     );

  //     if (!confirmed) {
  //       return;
  //     }

  //     try {
  //       await deleteAdminAccountMutation.mutateAsync(accountId);

  //       toast.success("Admin account deleted successfully.");

  //       if (selectedAccountId === accountId) {
  //         setSelectedAccountId(null);
  //       }
  //     } catch (mutationError) {
  //       toast.error(
  //         mutationError?.response?.data?.message ||
  //           mutationError?.message ||
  //           "Failed to delete admin account.",
  //       );
  //     }
  //   };

  const handleDeleteAccount = (account) => {
    const accountId = getAccountId(account);

    if (!accountId) {
      toast.error("Unable to identify this account.");
      return;
    }

    setAccountToDelete(account);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) {
      return;
    }

    const accountId = getAccountId(accountToDelete);

    if (!accountId) {
      toast.error("Unable to identify this account.");
      return;
    }

    try {
      await deleteAdminAccountMutation.mutateAsync(accountId);

      toast.success("Admin account deleted successfully.");

      if (selectedAccountId === accountId) {
        setSelectedAccountId(null);
      }

      setAccountToDelete(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete admin account.",
      );
    }
  };

  const openDetails = (account) => {
    const accountId = getAccountId(account);

    if (!accountId) {
      toast.error("Unable to identify this account.");
      return;
    }

    setSelectedAccountId(accountId);
  };

  const closeDetails = () => {
    setSelectedAccountId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-full">
        <div className="mb-8">
          <div className="h-8 w-52 animate-pulse rounded-lg bg-dark-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-dark-200" />
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-dark-100 bg-white"
            />
          ))}
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-soft">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-dark-50"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-full">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-dark-900">
            Admin Accounts
          </h1>

          <p className="mt-2 text-sm text-dark-500">
            Manage admins, staff and delivery accounts.
          </p>
        </div>

        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6">
          <div className="flex items-start gap-3">
            <CircleOff className="mt-0.5 h-5 w-5 shrink-0 text-danger" />

            <div className="flex-1">
              <h2 className="font-semibold text-dark-900">
                Unable to load accounts
              </h2>

              <p className="mt-1 text-sm text-dark-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Please try again."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-500" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
              Team Management
            </span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
            Admin Accounts
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
            Manage administrative, operational and delivery accounts across
            Resvill.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-primary-200 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
          >
            <UserPlus className="h-4 w-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="group rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-dark-500">
                Total Accounts
              </p>

              <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
                {summary.total}
              </p>

              <p className="mt-1 text-xs text-dark-400">
                All operational accounts
              </p>
            </div>

            <div className="rounded-xl bg-primary-50 p-3 transition group-hover:bg-primary-100">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Admins */}
        <div className="group rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-dark-500">Admins</p>

              <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
                {summary.admins}
              </p>

              <p className="mt-1 text-xs text-dark-400">
                Administrative access
              </p>
            </div>

            <div className="rounded-xl bg-primary-50 p-3">
              <ShieldCheck className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Staff */}
        <div className="group rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-dark-500">Staff</p>

              <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
                {summary.staff}
              </p>

              <p className="mt-1 text-xs text-dark-400">Operational accounts</p>
            </div>

            <div className="rounded-xl bg-info/10 p-3">
              <Users className="h-5 w-5 text-info" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="group rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-dark-500">
                Active Accounts
              </p>

              <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
                {summary.active}
              </p>

              <p className="mt-1 text-xs text-dark-400">Currently enabled</p>
            </div>

            <div className="rounded-xl bg-success/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Summary */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 to-white">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white shadow-sm">
              <Truck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
                Delivery Operations
              </p>

              <h2 className="mt-1 font-heading text-base font-bold text-dark-900">
                {summary.delivery} delivery{" "}
                {summary.delivery === 1 ? "account" : "accounts"} configured
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                Delivery team members can be managed from the accounts list.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-primary-100 bg-white px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-primary-500" />
            <span className="text-sm font-semibold text-dark-700">
              {summary.delivery} Delivery
              {summary.delivery === 1 ? " Account" : " Accounts"}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-dark-100 bg-white p-4 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-bold text-dark-900">Account Directory</h2>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-xl border border-dark-200 bg-white py-2.5 pl-10 pr-4 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm text-dark-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All Roles</option>

            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm text-dark-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
        {accounts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <Users className="h-6 w-6 text-primary-500" />
            </div>

            <h2 className="mt-4 font-heading text-lg font-bold text-dark-900">
              No accounts found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-dark-500">
              Try changing your search or filters, or create a new operational
              account.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              <Plus className="h-4 w-4" />
              Add Account
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50/70">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-dark-500">
                    Account
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-dark-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-dark-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-dark-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-dark-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-dark-100">
                {accounts.map((account) => {
                  const accountId = getAccountId(account);
                  const isActive = account.isActive !== false;

                  return (
                    <tr
                      key={accountId}
                      className="group transition hover:bg-dark-50/60"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-600">
                            {getInitials(account)}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-dark-900">
                              {getAccountName(account)}
                            </p>

                            {account.phone && (
                              <p className="mt-0.5 text-sm text-dark-500">
                                {account.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            account.role === "delivery"
                              ? "bg-primary-50 text-primary-700"
                              : account.role === "admin"
                                ? "bg-primary-100 text-primary-700"
                                : "bg-info/10 text-info"
                          }`}
                        >
                          {account.role === "delivery" && (
                            <Truck className="h-3 w-3" />
                          )}

                          {account.role === "admin" && (
                            <ShieldCheck className="h-3 w-3" />
                          )}

                          {formatRole(account.role)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            isActive
                              ? "bg-success/10 text-success"
                              : "bg-dark-100 text-dark-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-success" : "bg-dark-400"
                            }`}
                          />

                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-dark-600">
                        {account.email || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openDetails(account)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-dark-200 bg-white text-dark-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
                            title="View account"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusToggle(account)}
                            disabled={statusMutation.isPending}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-dark-200 bg-white text-dark-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                            title={
                              isActive
                                ? "Deactivate account"
                                : "Activate account"
                            }
                          >
                            {isActive ? (
                              <CircleOff className="h-4 w-4" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAccount(account)}
                            disabled={deleteAdminAccountMutation.isPending}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-danger transition hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-dark-100 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-dark-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
                    <UserPlus className="h-4 w-4 text-primary-600" />
                  </div>

                  <h2 className="font-heading text-lg font-bold text-dark-900">
                    Create Account
                  </h2>
                </div>

                <p className="mt-2 text-sm text-dark-500">
                  Create an operational account for Resvill.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={createMutation.isPending}
                className="rounded-xl p-2 text-dark-400 transition hover:bg-dark-50 hover:text-dark-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="space-y-5 px-6 py-6">
                <div>
                  <label
                    htmlFor="account-name"
                    className="mb-2 block text-sm font-semibold text-dark-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="account-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="account-email"
                    className="mb-2 block text-sm font-semibold text-dark-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="account-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="account-role"
                    className="mb-2 block text-sm font-semibold text-dark-700"
                  >
                    Account Role
                  </label>

                  <select
                    id="account-role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {form.role === "delivery" && (
                  <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white">
                        <Truck className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-dark-900">
                          Delivery Account
                        </p>

                        <p className="mt-1 text-sm leading-6 text-dark-600">
                          This account will be assigned the Delivery role and
                          can be used for delivery operations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
                  <p className="text-sm leading-6 text-primary-700">
                    The account will receive its login credentials through the
                    provided email address.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-dark-100 px-6 py-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={createMutation.isPending}
                  className="rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createMutation.isPending && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {selectedAccountId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-dark-100 bg-white shadow-card">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-dark-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
                    <Eye className="h-4 w-4 text-primary-600" />
                  </div>

                  <h2 className="font-heading text-lg font-bold text-dark-900">
                    Account Details
                  </h2>
                </div>

                <p className="mt-2 text-sm text-dark-500">
                  View account information and operational status.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="rounded-xl p-2 text-dark-400 transition hover:bg-dark-50 hover:text-dark-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoadingDetails ? (
              <div className="space-y-5 px-6 py-8">
                <div className="h-24 animate-pulse rounded-2xl bg-dark-50" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-24 animate-pulse rounded-2xl bg-dark-50" />
                  <div className="h-24 animate-pulse rounded-2xl bg-dark-50" />
                </div>

                <div className="h-28 animate-pulse rounded-2xl bg-dark-50" />
              </div>
            ) : isDetailsError ? (
              <div className="px-6 py-8">
                <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5">
                  <div className="flex items-start gap-3">
                    <CircleOff className="mt-0.5 h-5 w-5 shrink-0 text-danger" />

                    <div>
                      <p className="text-sm font-semibold text-dark-900">
                        Unable to load account details
                      </p>

                      <p className="mt-1 text-sm leading-6 text-dark-600">
                        {detailsError?.response?.data?.message ||
                          detailsError?.message ||
                          "Please try again."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 px-6 py-6">
                {/* Profile */}
                <div className="relative overflow-hidden rounded-2xl border border-dark-100 bg-dark-50 p-5">
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary-100/60 blur-2xl" />

                  <div className="relative flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-500 text-xl font-bold text-white shadow-sm">
                      {getInitials(selectedAccount)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-lg font-bold text-dark-900">
                          {getAccountName(selectedAccount)}
                        </h3>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            selectedAccount?.isActive === false
                              ? "bg-dark-100 text-dark-600"
                              : "bg-success/10 text-success"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              selectedAccount?.isActive === false
                                ? "bg-dark-400"
                                : "bg-success"
                            }`}
                          />

                          {selectedAccount?.isActive === false
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-dark-500">
                        {selectedAccount?.email || "No email available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Account Information */}
                <div>
                  <div className="mb-3">
                    <h3 className="font-heading text-sm font-bold text-dark-900">
                      Account Information
                    </h3>

                    <p className="mt-1 text-xs text-dark-500">
                      Current role, status and verification information.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-dark-100 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                        Role
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        {selectedAccount?.role === "delivery" && (
                          <Truck className="h-4 w-4 text-primary-500" />
                        )}

                        {selectedAccount?.role === "admin" && (
                          <ShieldCheck className="h-4 w-4 text-primary-500" />
                        )}

                        <p className="text-sm font-bold text-dark-800">
                          {formatRole(selectedAccount?.role)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-dark-100 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                        Account Status
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            selectedAccount?.isActive === false
                              ? "bg-dark-400"
                              : "bg-success"
                          }`}
                        />

                        <p className="text-sm font-bold text-dark-800">
                          {selectedAccount?.isActive === false
                            ? "Inactive"
                            : "Active"}
                        </p>
                      </div>
                    </div>

                    {selectedAccount?.phone && (
                      <div className="rounded-2xl border border-dark-100 bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                          Phone
                        </p>

                        <p className="mt-2 text-sm font-semibold text-dark-800">
                          {selectedAccount.phone}
                        </p>
                      </div>
                    )}

                    {selectedAccount?.isVerified !== undefined && (
                      <div className="rounded-2xl border border-dark-100 bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                          Email Verification
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          {selectedAccount.isVerified ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-success" />

                              <span className="text-sm font-semibold text-dark-800">
                                Verified
                              </span>
                            </>
                          ) : (
                            <>
                              <CircleOff className="h-4 w-4 text-warning" />

                              <span className="text-sm font-semibold text-dark-800">
                                Not Verified
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Account Card */}
                {selectedAccount?.role === "delivery" && (
                  <div className="overflow-hidden rounded-2xl border border-primary-100 bg-primary-50/50">
                    <div className="border-b border-primary-100 bg-primary-50 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white shadow-sm">
                          <Truck className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-heading text-sm font-bold text-dark-900">
                            Delivery Account
                          </h3>

                          <p className="mt-0.5 text-xs text-dark-500">
                            Delivery-specific account information.
                          </p>
                        </div>

                        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-primary-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                          Delivery
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 p-5 sm:grid-cols-2">
                      <div className="rounded-xl border border-dark-100 bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                          Delivery Role
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <Truck className="h-4 w-4 text-primary-500" />

                          <span className="text-sm font-bold text-dark-800">
                            Delivery Staff
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-dark-100 bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                          Operational Status
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              selectedAccount?.isActive === false
                                ? "bg-dark-400"
                                : "bg-success"
                            }`}
                          />

                          <span className="text-sm font-bold text-dark-800">
                            {selectedAccount?.isActive === false
                              ? "Inactive"
                              : "Active"}
                          </span>
                        </div>
                      </div>

                      {selectedAccount?.phone && (
                        <div className="rounded-xl border border-dark-100 bg-white p-4 sm:col-span-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                            Delivery Contact
                          </p>

                          <p className="mt-2 text-sm font-semibold text-dark-800">
                            {selectedAccount.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Notice */}
                {selectedAccount?.isVerified === false && (
                  <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4">
                    <div className="flex items-start gap-3">
                      <CircleOff className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

                      <div>
                        <p className="text-sm font-bold text-dark-900">
                          Email verification pending
                        </p>

                        <p className="mt-1 text-sm leading-6 text-dark-600">
                          This account has not completed email verification.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-dark-100 px-6 py-4">
              <button
                type="button"
                onClick={closeDetails}
                className="rounded-xl border border-dark-200 bg-white px-5 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(accountToDelete)}
        onClose={() => setAccountToDelete(null)}
        onConfirm={confirmDeleteAccount}
        title="Delete Admin Account?"
        description={
          accountToDelete
            ? `Are you sure you want to permanently delete ${getAccountName(
                accountToDelete,
              )}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Account"
        cancelText="Cancel"
        loading={deleteAdminAccountMutation.isPending}
      />
    </div>
  );
}

export default AdminAccounts;
