import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleOff,
  Edit3,
  MapPin,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useAdminDeliveryLocations,
  useCreateAdminDeliveryLocation,
  useUpdateAdminDeliveryLocation,
  useUpdateAdminDeliveryLocationStatus,
  useDeleteAdminDeliveryLocation,
} from "../hooks/useAdminDeliveryLocations";

const emptyForm = {
  name: "",
  city: "",
  state: "",
  deliveryFee: "",
  estimatedDeliveryTime: "",
  isActive: true,
  isDefault: false,
};

const formatNaira = (value) => {
  const amount = Number(value) || 0;

  return `₦${amount.toLocaleString("en-NG")}`;
};

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
  iconClassName,
}) {
  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">
            {label}
          </p>

          <p className="mt-2 truncate font-heading text-2xl font-bold text-dark-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-dark-400">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function LocationStatus({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold ${
        isActive
          ? "bg-success/10 text-success"
          : "bg-dark-100 text-dark-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-success" : "bg-dark-400"
        }`}
      />

      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-dark-200" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-dark-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl bg-white"
          />
        ))}
      </div>

      <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-soft">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
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

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-danger/20 bg-white p-8 shadow-soft">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <CircleOff size={21} />
        </div>

        <div className="mt-4 sm:ml-4 sm:mt-0">
          <h2 className="font-heading text-base font-bold text-dark-900">
            Unable to load delivery locations
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-dark-500">
            {message || "Please try again."}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  step,
  suffix,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-bold text-dark-600"
      >
        {label}
        {required && (
          <span className="ml-1 text-primary-500">*</span>
        )}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          min={min}
          step={step}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm font-medium text-dark-700 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 ${
            suffix ? "pr-16" : ""
          }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-dark-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ToggleField({
  name,
  checked,
  onChange,
  title,
  description,
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dark-100 bg-dark-50 p-4 transition hover:border-primary-100">
      <div className="min-w-0">
        <p className="text-sm font-bold text-dark-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-dark-400">
          {description}
        </p>
      </div>

      <span className="relative shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />

        <span className="block h-6 w-11 rounded-full bg-dark-200 transition peer-checked:bg-primary-500 peer-focus:ring-4 peer-focus:ring-primary-50" />

        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function AdminDeliveryLocations() {
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminDeliveryLocations();

  const createMutation =
    useCreateAdminDeliveryLocation();

  const updateMutation =
    useUpdateAdminDeliveryLocation();

  const statusMutation =
    useUpdateAdminDeliveryLocationStatus();

  const deleteMutation =
    useDeleteAdminDeliveryLocation();

  const locations = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.locations)) {
      return data.locations;
    }

    return [];
  }, [data]);

  const activeLocations = useMemo(
    () =>
      locations.filter(
        (location) => location.isActive,
      ).length,
    [locations],
  );

  const defaultLocation = useMemo(
    () =>
      locations.find(
        (location) => location.isDefault,
      ),
    [locations],
  );

  const openCreateModal = () => {
    setEditingLocation(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (location) => {
    setEditingLocation(location);

    setForm({
      name: location.name || "",
      city: location.city || "",
      state: location.state || "",
      deliveryFee:
        location.deliveryFee !== undefined &&
        location.deliveryFee !== null
          ? String(location.deliveryFee)
          : "",
      estimatedDeliveryTime:
        location.estimatedDeliveryTime !== undefined &&
        location.estimatedDeliveryTime !== null
          ? String(location.estimatedDeliveryTime)
          : "",
      isActive: location.isActive !== false,
      isDefault: Boolean(location.isDefault),
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (
      createMutation.isPending ||
      updateMutation.isPending
    ) {
      return;
    }

    setShowModal(false);
    setEditingLocation(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const city = form.city.trim();
    const state = form.state.trim();

    if (!name || !city || !state) {
      toast.error(
        "Name, city and state are required.",
      );
      return;
    }

    const deliveryFee = Number(
      form.deliveryFee,
    );

    if (
      !Number.isFinite(deliveryFee) ||
      deliveryFee < 0
    ) {
      toast.error("Enter a valid delivery fee.");
      return;
    }

    const estimatedDeliveryTime =
      form.estimatedDeliveryTime.trim();

    if (estimatedDeliveryTime) {
      const estimatedTimeNumber = Number(
        estimatedDeliveryTime,
      );

      if (
        !Number.isFinite(estimatedTimeNumber) ||
        estimatedTimeNumber < 0
      ) {
        toast.error(
          "Enter a valid estimated delivery time.",
        );
        return;
      }
    }

    const payload = {
      name,
      city,
      state,
      deliveryFee,
      isActive: Boolean(form.isActive),
      isDefault: Boolean(form.isDefault),
      ...(estimatedDeliveryTime
        ? {
            estimatedDeliveryTime,
          }
        : {}),
    };

    try {
      if (editingLocation) {
        await updateMutation.mutateAsync({
          locationId: editingLocation._id,
          locationData: payload,
        });

        toast.success(
          "Delivery location updated.",
        );
      } else {
        await createMutation.mutateAsync(payload);

        toast.success(
          "Delivery location created.",
        );
      }

      closeModal();
    } catch (mutationError) {
      toast.error(
        mutationError?.response?.data?.message ||
          mutationError?.message ||
          "Something went wrong.",
      );
    }
  };

  const handleStatusToggle = async (location) => {
    if (
      location.isDefault &&
      location.isActive
    ) {
      toast.error(
        "The default location cannot be deactivated.",
      );
      return;
    }

    try {
      await statusMutation.mutateAsync({
        locationId: location._id,
        isActive: !location.isActive,
      });

      toast.success(
        location.isActive
          ? "Delivery location deactivated."
          : "Delivery location activated.",
      );
    } catch (mutationError) {
      toast.error(
        mutationError?.response?.data?.message ||
          mutationError?.message ||
          "Unable to update location status.",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(
        deleteTarget._id,
      );

      toast.success(
        "Delivery location deleted.",
      );

      setDeleteTarget(null);
    } catch (mutationError) {
      toast.error(
        mutationError?.response?.data?.message ||
          mutationError?.message ||
          "Unable to delete delivery location.",
      );
    }
  };

  const getLocationId = (location) =>
    location?._id || location?.id;

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark-900">
            Delivery Locations
          </h1>

          <p className="mt-1 text-sm text-dark-500">
            Manage delivery areas, fees and estimated
            delivery times.
          </p>
        </div>

        <ErrorState
          message={
            error?.response?.data?.message ||
            error?.message
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <MapPin size={18} />
            </div>

            <h1 className="font-heading text-xl font-bold text-dark-900 sm:text-2xl">
              Delivery Locations
            </h1>
          </div>

          <p className="mt-2 text-sm text-dark-500">
            Manage delivery areas, fees and estimated
            delivery times.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-100 bg-white px-4 py-2.5 text-sm font-bold text-dark-600 shadow-sm transition hover:border-primary-200 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-600"
          >
            <Plus size={17} />
            Add Location
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={MapPin}
          label="Total Locations"
          value={locations.length}
          description="Configured delivery areas"
          iconClassName="bg-primary-50 text-primary-600"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Active Locations"
          value={activeLocations}
          description="Currently available for delivery"
          iconClassName="bg-success/10 text-success"
        />

        <SummaryCard
          icon={Star}
          label="Default Location"
          value={defaultLocation?.name || "None"}
          description={
            defaultLocation
              ? `${defaultLocation.city}, ${defaultLocation.state}`
              : "No default location configured"
          }
          iconClassName="bg-warning/10 text-warning"
        />
      </div>

      {/* LOCATIONS */}
      <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
        <div className="flex flex-col gap-2 border-b border-dark-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-heading text-base font-bold text-dark-900">
              Delivery Areas
            </h2>

            <p className="mt-1 text-xs text-dark-400">
              Configure where customers can receive
              their orders.
            </p>
          </div>

          <span className="w-fit rounded-full bg-dark-50 px-3 py-1.5 text-xs font-bold text-dark-500">
            {locations.length}{" "}
            {locations.length === 1
              ? "location"
              : "locations"}
          </span>
        </div>

        {locations.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
              <MapPin size={25} />
            </div>

            <h2 className="mt-4 font-heading text-base font-bold text-dark-900">
              No delivery locations yet
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-dark-500">
              Create your first delivery location to
              define where Resvill delivers and how
              much delivery costs.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600"
            >
              <Plus size={16} />
              Add Location
            </button>
          </div>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-dark-100 bg-dark-50/70">
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-dark-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-dark-500">
                      Delivery Fee
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-dark-500">
                      Estimated Time
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-dark-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-dark-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-dark-100">
                  {locations.map((location) => {
                    const locationId =
                      getLocationId(location);

                    return (
                      <tr
                        key={locationId}
                        className="transition hover:bg-dark-50/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                              <MapPin size={18} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-bold text-dark-900">
                                  {location.name}
                                </p>

                                {location.isDefault && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-[10px] font-bold text-warning">
                                    <Star
                                      size={10}
                                      fill="currentColor"
                                    />
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="mt-0.5 text-xs text-dark-500">
                                {location.city},{" "}
                                {location.state}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <p className="text-sm font-bold text-dark-800">
                            {formatNaira(
                              location.deliveryFee,
                            )}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <p className="text-sm font-medium text-dark-600">
                            {location.estimatedDeliveryTime
                              ? `${location.estimatedDeliveryTime} mins`
                              : "Not set"}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <LocationStatus
                            isActive={
                              location.isActive
                            }
                          />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  location,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
                              title="Edit location"
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusToggle(
                                  location,
                                )
                              }
                              disabled={
                                statusMutation.isPending ||
                                (location.isDefault &&
                                  location.isActive)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                              title={
                                location.isActive
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              {location.isActive ? (
                                <CircleOff
                                  size={15}
                                />
                              ) : (
                                <CheckCircle2
                                  size={15}
                                />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget(
                                  location,
                                )
                              }
                              disabled={
                                location.isDefault ||
                                deleteMutation.isPending
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-500 transition hover:border-danger/20 hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                              title={
                                location.isDefault
                                  ? "Default location cannot be deleted"
                                  : "Delete location"
                              }
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-dark-100 md:hidden">
              {locations.map((location) => {
                const locationId =
                  getLocationId(location);

                return (
                  <div
                    key={locationId}
                    className="p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                        <MapPin size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-dark-900">
                            {location.name}
                          </p>

                          {location.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-[10px] font-bold text-warning">
                              <Star
                                size={10}
                                fill="currentColor"
                              />
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 text-xs text-dark-500">
                          {location.city},{" "}
                          {location.state}
                        </p>
                      </div>

                      <LocationStatus
                        isActive={
                          location.isActive
                        }
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-dark-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-dark-400">
                          Delivery Fee
                        </p>

                        <p className="mt-1 text-sm font-bold text-dark-800">
                          {formatNaira(
                            location.deliveryFee,
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-dark-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-dark-400">
                          Estimated Time
                        </p>

                        <p className="mt-1 text-sm font-bold text-dark-800">
                          {location.estimatedDeliveryTime
                            ? `${location.estimatedDeliveryTime} mins`
                            : "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            location,
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dark-100 px-3 py-2.5 text-xs font-bold text-dark-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusToggle(
                            location,
                          )
                        }
                        disabled={
                          statusMutation.isPending ||
                          (location.isDefault &&
                            location.isActive)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dark-100 px-3 py-2.5 text-xs font-bold text-dark-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {location.isActive ? (
                          <CircleOff size={14} />
                        ) : (
                          <CheckCircle2
                            size={14}
                          />
                        )}
                        {location.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget(
                            location,
                          )
                        }
                        disabled={
                          location.isDefault ||
                          deleteMutation.isPending
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-100 text-dark-500 transition hover:border-danger/20 hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                        title={
                          location.isDefault
                            ? "Default location cannot be deleted"
                            : "Delete location"
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-dark-950/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
          <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex shrink-0 items-start justify-between border-b border-dark-100 px-5 py-5 sm:px-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <h2 className="font-heading text-base font-bold text-dark-900">
                      {editingLocation
                        ? "Edit Delivery Location"
                        : "Add Delivery Location"}
                    </h2>

                    <p className="mt-0.5 text-xs text-dark-400">
                      Configure the delivery area and
                      pricing.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-dark-400 transition hover:bg-dark-50 hover:text-dark-700 disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-dark-400">
                    Location Details
                  </h3>

                  <div className="mt-4 space-y-4">
                    <FormField
                      label="Location Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Garki"
                      required
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Abuja"
                        required
                      />

                      <FormField
                        label="State"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="e.g. FCT"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-dark-100 pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-dark-400">
                    Delivery Settings
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Delivery Fee"
                      name="deliveryFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.deliveryFee}
                      onChange={handleChange}
                      placeholder="0"
                      required
                    />

                    <FormField
                      label="Estimated Delivery Time"
                      name="estimatedDeliveryTime"
                      type="text"
                      value={
                        form.estimatedDeliveryTime
                      }
                      onChange={handleChange}
                      placeholder="e.g. 30"
                      suffix="mins"
                    />
                  </div>
                </div>

                <div className="border-t border-dark-100 pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-dark-400">
                    Location Status
                  </h3>

                  <div className="mt-4 space-y-3">
                    <ToggleField
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      title="Active Location"
                      description="Allow customers to use this delivery location."
                    />

                    <ToggleField
                      name="isDefault"
                      checked={form.isDefault}
                      onChange={handleChange}
                      title="Default Location"
                      description="Use this location as the default delivery area."
                    />
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-dark-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                  className="rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-bold text-dark-600 transition hover:bg-dark-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {(createMutation.isPending ||
                    updateMutation.isPending) && (
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                  )}

                  {editingLocation
                    ? "Save Changes"
                    : "Create Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-dark-950/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-3xl border border-dark-100 bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <Trash2 size={20} />
            </div>

            <h2 className="mt-4 font-heading text-lg font-bold text-dark-900">
              Delete delivery location?
            </h2>

            <p className="mt-2 text-sm leading-6 text-dark-500">
              This will permanently remove{" "}
              <span className="font-bold text-dark-700">
                {deleteTarget.name}
              </span>
              . This action cannot be undone.
            </p>

            {deleteTarget.isDefault && (
              <div className="mt-4 rounded-xl bg-warning/10 p-3 text-xs font-semibold leading-5 text-warning">
                The default delivery location cannot be
                deleted.
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={
                  deleteMutation.isPending
                }
                className="rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-bold text-dark-600 transition hover:bg-dark-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleteMutation.isPending ||
                  deleteTarget.isDefault
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending && (
                  <RefreshCw
                    size={15}
                    className="animate-spin"
                  />
                )}
                Delete Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDeliveryLocations;