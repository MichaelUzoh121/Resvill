import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
  SlidersHorizontal,
} from "lucide-react";

import { useAdminCustomers } from "../hooks/useAdminCustomers";

const formatNumber = (value = 0) =>
  Number(value || 0).toLocaleString("en-NG");

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCustomerName = (customer) => {
  const name = `${customer?.firstname || ""} ${
    customer?.lastname || ""
  }`.trim();

  return name || "Unnamed Customer";
};

function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const limit = 20;

  const { data, isLoading, isError, error } = useAdminCustomers({
    search: search.trim() || undefined,
    status,
    page,
    limit,
  });

  const customers = data?.customers || [];
  const pagination = data?.pagination || {};

  const total = Number(pagination.total || 0);
  const totalPages = Number(pagination.totalPages || 1);

  const activeCustomers = customers.filter(
    (customer) => customer.isActive
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => !customer.isActive
  ).length;

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white px-6 py-7 shadow-soft sm:px-8">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary-50 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-500">
                <Users size={13} />
                Customer Management
              </div>

              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark-900 sm:text-3xl">
                Customers
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
                View, search and manage customers registered on Resvill.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-dark-100 bg-dark-50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary-500 shadow-sm">
                <Users size={17} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-dark-400">
                  Total customers
                </p>

                <p className="font-heading text-lg font-bold text-dark-900">
                  {formatNumber(total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="group rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-dark-400">
                Total Customers
              </p>

              <p className="mt-2 font-heading text-2xl font-extrabold text-dark-900">
                {formatNumber(total)}
              </p>

              <p className="mt-1 text-xs text-dark-500">
                Customers matching the current result set
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition group-hover:bg-primary-500 group-hover:text-white">
              <Users size={19} />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-dark-400">
                Active on Page
              </p>

              <p className="mt-2 font-heading text-2xl font-extrabold text-dark-900">
                {formatNumber(activeCustomers)}
              </p>

              <p className="mt-1 text-xs text-dark-500">
                Active customers on this page
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
              <UserCheck size={19} />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card sm:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-dark-400">
                Inactive on Page
              </p>

              <p className="mt-2 font-heading text-2xl font-extrabold text-dark-900">
                {formatNumber(inactiveCustomers)}
              </p>

              <p className="mt-1 text-xs text-dark-500">
                Inactive customers on this page
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <UserX size={19} />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-dark-50 text-dark-600">
            <SlidersHorizontal size={17} />
          </div>

          <div>
            <h2 className="font-heading text-sm font-bold text-dark-900">
              Find customers
            </h2>

            <p className="mt-0.5 text-xs text-dark-500">
              Search by customer details or filter by account status.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
            />

            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name, email or phone..."
              className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50/40 pl-11 pr-4 text-sm font-medium text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            />
          </div>

          <div className="relative lg:w-56">
            <select
              value={status}
              onChange={handleStatusChange}
              className="h-12 w-full appearance-none rounded-xl border border-dark-200 bg-dark-50/40 px-4 pr-10 text-sm font-semibold text-dark-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            >
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <ChevronRight
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-dark-400"
            />
          </div>
        </div>
      </section>

      {/* Customer Table */}
      <section className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card">
        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-dark-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-bold text-dark-900">
                Customer List
              </h2>

              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-500">
                {formatNumber(total)}
              </span>
            </div>

            <p className="mt-1 text-xs text-dark-500">
              Showing customers from the current filter and page.
            </p>
          </div>

          {status !== "all" && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-dark-50 px-3 py-1.5 text-xs font-semibold text-dark-600">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              Filter:{" "}
              <span className="capitalize text-dark-900">
                {status}
              </span>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <Loader2
                size={25}
                className="animate-spin text-primary-500"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-dark-900">
              Loading customers
            </p>

            <p className="mt-1 text-xs text-dark-500">
              Please wait while we fetch the customer list.
            </p>
          </div>
        ) : isError ? (
          /* Error */
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertCircle size={27} />
            </div>

            <h3 className="mt-4 font-heading text-base font-bold text-dark-900">
              Failed to load customers
            </h3>

            <p className="mt-1 max-w-md text-sm leading-6 text-dark-500">
              {error?.message ||
                "Something went wrong while loading customers."}
            </p>
          </div>
        ) : customers.length === 0 ? (
          /* Empty */
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-50 text-dark-300">
              <Users size={30} />
            </div>

            <h3 className="mt-5 font-heading text-base font-bold text-dark-900">
              No customers found
            </h3>

            <p className="mt-1 max-w-md text-sm leading-6 text-dark-500">
              There are no customers matching your current search or
              status filter. Try adjusting your filters and search
              again.
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-dark-100 bg-dark-50/70 text-left">
                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                      Customer
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                      Contact
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                      Verification
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                      Joined
                    </th>

                    <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-dark-100">
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="group transition hover:bg-primary-50/30"
                    >
                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {customer.profileImage ? (
                            <img
                              src={customer.profileImage}
                              alt={getCustomerName(customer)}
                              className="h-11 w-11 rounded-xl object-cover ring-1 ring-dark-100"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 font-heading text-sm font-extrabold text-primary-500">
                              {customer.firstname?.[0]?.toUpperCase() ||
                                "C"}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-dark-900">
                              {getCustomerName(customer)}
                            </p>

                            <p className="mt-0.5 max-w-[230px] truncate text-xs text-dark-500">
                              {customer.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-dark-700">
                          {customer.phone || "—"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {customer.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/10 bg-success/10 px-2.5 py-1.5 text-[11px] font-bold text-success">
                            <CheckCircle2 size={13} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/10 bg-danger/10 px-2.5 py-1.5 text-[11px] font-bold text-danger">
                            <XCircle size={13} />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Verification */}
                      <td className="px-5 py-4">
                        {customer.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-dark-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-dark-300" />
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-sm font-medium text-dark-600">
                        {formatDate(customer.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/customers/${customer._id}`}
                          className="inline-flex h-9 items-center gap-2 rounded-xl border border-dark-200 bg-white px-3.5 text-xs font-bold text-dark-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500"
                        >
                          <Eye size={15} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-dark-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-xs font-medium text-dark-500">
                  Page{" "}
                  <span className="font-bold text-dark-900">
                    {formatNumber(page)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-dark-900">
                    {formatNumber(totalPages)}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) => current - 1)
                  }
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3 text-xs font-bold text-dark-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-dark-200 disabled:hover:bg-white disabled:hover:text-dark-700"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3 text-xs font-bold text-dark-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-dark-200 disabled:hover:bg-white disabled:hover:text-dark-700"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AdminCustomers;