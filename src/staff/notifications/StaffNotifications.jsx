import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuBell,
  LuCheck,
  LuCheckCheck,
  LuRefreshCw,
  LuTrash2,
  LuChevronLeft,
  LuChevronRight,
  LuCircleAlert,
  LuClipboardList,
  LuTruck,
  LuCreditCard,
  LuInfo,
  LuInbox,
} from "react-icons/lu";
import toast from "react-hot-toast";

import {
  useStaffNotifications,
  useMarkStaffNotificationAsRead,
  useMarkAllStaffNotificationsAsRead,
  useDeleteStaffNotification,
} from "../hooks/useStaffNotifications";

const PAGE_SIZE = 20;

const ORDER_NOTIFICATION_TYPES = [
  "ORDER_CREATED",
  "ORDER_CONFIRMED",
  "ORDER_PREPARING",
  "ORDER_READY",
  "ORDER_OUT_FOR_DELIVERY",
  "ORDER_DELIVERED",
  "ORDER_CANCELLED",
];

const DELIVERY_NOTIFICATION_TYPES = [
  "DELIVERY_ASSIGNED",
  "DELIVERY_FAILED",
  "DELIVERY_ACCEPTED",
  "DELIVERY_PICKED_UP",
  "DELIVERY_IN_TRANSIT",
  "DELIVERY_DELIVERED",
];

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getNotificationTypeLabel = (type) => {
  if (!type) return "Notification";

  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getNotificationMeta = (type) => {
  if (ORDER_NOTIFICATION_TYPES.includes(type)) {
    return {
      icon: LuClipboardList,
      iconClass: "bg-primary-50 text-primary-600",
      labelClass: "text-primary-600",
    };
  }

  if (DELIVERY_NOTIFICATION_TYPES.includes(type)) {
    return {
      icon: LuTruck,
      iconClass: "bg-blue-50 text-blue-600",
      labelClass: "text-blue-600",
    };
  }

  if (type === "PAYMENT_SUCCESS") {
    return {
      icon: LuCreditCard,
      iconClass: "bg-emerald-50 text-emerald-600",
      labelClass: "text-emerald-600",
    };
  }

  if (type === "SYSTEM") {
    return {
      icon: LuInfo,
      iconClass: "bg-dark-100 text-dark-600",
      labelClass: "text-dark-500",
    };
  }

  return {
    icon: LuBell,
    iconClass: "bg-primary-50 text-primary-600",
    labelClass: "text-primary-600",
  };
};

function NotificationSkeleton() {
  return (
    <div className="divide-y divide-dark-100 overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-sm">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="animate-pulse p-5">
          <div className="flex gap-4">
            <div className="h-11 w-11 shrink-0 rounded-xl bg-dark-100" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-4">
                <div className="h-4 w-48 rounded bg-dark-100" />
                <div className="h-3 w-24 rounded bg-dark-100" />
              </div>

              <div className="mt-2 h-3 w-28 rounded bg-dark-100" />

              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-dark-100" />
                <div className="h-3 w-3/4 rounded bg-dark-100" />
              </div>

              <div className="mt-4 flex gap-2">
                <div className="h-8 w-24 rounded-lg bg-dark-100" />
                <div className="h-8 w-20 rounded-lg bg-dark-100" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, accent = "primary" }) {
  const accentClasses = {
    primary: {
      wrapper: "bg-primary-50 text-primary-600",
      value: "text-primary-600",
    },
    neutral: {
      wrapper: "bg-dark-50 text-dark-600",
      value: "text-dark-900",
    },
  };

  const styles = accentClasses[accent] || accentClasses.primary;

  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-dark-400">
            {label}
          </p>

          <p className={`mt-2 text-2xl font-bold ${styles.value}`}>
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.wrapper}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StaffNotifications() {
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
    }),
    [page],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useStaffNotifications(params);

  const markAsRead = useMarkStaffNotificationAsRead();
  const markAllAsRead = useMarkAllStaffNotificationsAsRead();
  const deleteNotification = useDeleteStaffNotification();

  const notifications = Array.isArray(data?.data?.notifications)
    ? data.data.notifications
    : [];

  const pagination = data?.data?.pagination || {};

  const totalPages = Math.max(Number(pagination.totalPages) || 1, 1);
  const total = Number(pagination.total) || 0;

  const unreadCount = notifications.filter(
    (notification) => !notification?.isRead,
  ).length;

  const handleMarkAsRead = async (notification) => {
    const notificationId = notification?._id || notification?.id;

    if (!notificationId || notification?.isRead) {
      return;
    }

    try {
      await markAsRead.mutateAsync(notificationId);
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to mark notification as read",
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllAsRead.mutateAsync();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to mark notifications as read",
      );
    }
  };

  const handleDelete = async (notificationId) => {
    if (!notificationId) {
      return;
    }

    try {
      await deleteNotification.mutateAsync(notificationId);
      toast.success("Notification deleted");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete notification",
      );
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Notifications refreshed");
    } catch {
      toast.error("Failed to refresh notifications");
    }
  };

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1));
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <LuBell className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-primary-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-700">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-dark-500">
              Stay updated with operational activity and account notifications.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LuRefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LuCheckCheck className="h-4 w-4" />

              {markAllAsRead.isPending ? "Updating..." : "Mark All Read"}
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard
          label="Total Notifications"
          value={total}
          icon={LuInbox}
          accent="neutral"
        />

        <SummaryCard
          label="Unread on This Page"
          value={unreadCount}
          icon={LuBell}
          accent="primary"
        />
      </div>

      {/* Loading */}
      {isLoading && <NotificationSkeleton />}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <LuCircleAlert className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-red-800">
                Unable to load notifications
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong while loading notifications."}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isFetching}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LuRefreshCw
                  className={`h-4 w-4 ${
                    isFetching ? "animate-spin" : ""
                  }`}
                />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && notifications.length === 0 && (
        <div className="rounded-2xl border border-dashed border-dark-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
            <LuBell className="h-7 w-7" />
          </div>

          <h2 className="mt-5 font-heading text-lg font-bold text-dark-900">
            No notifications yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-dark-500">
            New notifications related to your staff account and operational
            activity will appear here.
          </p>
        </div>
      )}

      {/* Notification List */}
      {!isLoading && !isError && notifications.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-sm">
          <div className="divide-y divide-dark-100">
            {notifications.map((notification) => {
              const notificationId =
                notification?._id || notification?.id;

              const isUnread = !notification?.isRead;

              const notificationMeta = getNotificationMeta(
                notification?.type,
              );

              const Icon = notificationMeta.icon;

              const orderId =
                notification?.order?._id ||
                notification?.order?.id ||
                notification?.orderId;

              const orderNumber =
                notification?.order?.orderNumber ||
                notification?.orderNumber ||
                notification?.order?._id ||
                notification?.orderId;

              return (
                <article
                  key={notificationId}
                  className={`group relative p-4 transition sm:p-5 ${
                    isUnread
                      ? "bg-primary-50/30 hover:bg-primary-50/50"
                      : "bg-white hover:bg-dark-50/60"
                  }`}
                >
                  {isUnread && (
                    <span className="absolute inset-y-0 left-0 w-1 bg-primary-500" />
                  )}

                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isUnread
                          ? notificationMeta.iconClass
                          : "bg-dark-100 text-dark-500"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* Top Row */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`text-sm ${
                                isUnread
                                  ? "font-bold text-dark-900"
                                  : "font-semibold text-dark-800"
                              }`}
                            >
                              {notification?.title || "Notification"}
                            </h3>

                            {isUnread && (
                              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-700">
                                New
                              </span>
                            )}
                          </div>

                          <p
                            className={`mt-1 text-[11px] font-semibold uppercase tracking-wider ${
                              isUnread
                                ? notificationMeta.labelClass
                                : "text-dark-400"
                            }`}
                          >
                            {getNotificationTypeLabel(notification?.type)}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-xs text-dark-400">
                            {formatDateTime(notification?.createdAt)}
                          </span>

                          {notification?.isRead && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-dark-400">
                              <LuCheck className="h-3.5 w-3.5" />
                              Read
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <p className="mt-3 max-w-4xl text-sm leading-6 text-dark-600">
                        {notification?.message || "No additional message."}
                      </p>

                      {/* Related Order */}
                      {(notification?.order || orderId || orderNumber) && (
                        <div className="mt-4">
                          {orderId ? (
                            <Link
                              to={`/staff/orders/${orderId}`}
                              className="inline-flex items-center gap-2 rounded-xl border border-dark-100 bg-white px-3 py-2 text-xs font-semibold text-dark-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
                            >
                              <LuClipboardList className="h-3.5 w-3.5" />

                              <span>
                                Order{" "}
                                {orderNumber || orderId}
                              </span>

                              <span
                                aria-hidden="true"
                                className="text-dark-400 transition group-hover:text-primary-500"
                              >
                                →
                              </span>
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-xl border border-dark-100 bg-dark-50 px-3 py-2 text-xs font-medium text-dark-600">
                              <LuClipboardList className="h-3.5 w-3.5" />
                              Order {orderNumber || "—"}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {isUnread && (
                          <button
                            type="button"
                            onClick={() =>
                              handleMarkAsRead(notification)
                            }
                            disabled={markAsRead.isPending}
                            className="inline-flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-3 py-2 text-xs font-semibold text-dark-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <LuCheck className="h-3.5 w-3.5" />

                            {markAsRead.isPending
                              ? "Updating..."
                              : "Mark Read"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(notificationId)
                          }
                          disabled={deleteNotification.isPending}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <LuTrash2 className="h-3.5 w-3.5" />

                          {deleteNotification.isPending
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-dark-100 bg-dark-50/50 px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-dark-500">
                    Page{" "}
                    <span className="font-semibold text-dark-700">
                      {page}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-dark-700">
                      {totalPages}
                    </span>
                  </p>

                  {total > 0 && (
                    <p className="mt-0.5 text-[11px] text-dark-400">
                      {total} total notification
                      {total === 1 ? "" : "s"}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={page <= 1 || isFetching}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3.5 py-2 text-xs font-semibold text-dark-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LuChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={page >= totalPages || isFetching}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3.5 py-2 text-xs font-semibold text-dark-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <LuChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default StaffNotifications;