import React, { useEffect, useRef } from "react";
import {
  LuBell,
  LuCheck,
  LuCheckCheck,
  LuTrash2,
  LuLoaderCircle,
} from "react-icons/lu";

import useDriverNotifications from "../hooks/useDriverNotifications";

function formatNotificationTime(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function DriverNotificationDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);

  const {
    notifications = [],
    loading,
    error,
    markRead,
    markingRead,
    markAllRead,
    markingAllRead,
    removeNotification,
    deleting,
  } = useDriverNotifications();

  const unreadNotifications = notifications.filter(
    (notification) => !notification?.isRead,
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMarkRead = async (notification) => {
    if (notification?.isRead) return;

    const notificationId =
      notification?._id ||
      notification?.id;

    if (!notificationId) return;

    await markRead(notificationId);
  };

  const handleDelete = async (notification) => {
    const notificationId =
      notification?._id ||
      notification?.id;

    if (!notificationId) return;

    await removeNotification(notificationId);
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-14 z-50 w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card"
    >
      {/* Header */}
      <div className="border-b border-dark-100 bg-white px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <LuBell className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h2 className="font-heading text-sm font-bold tracking-tight text-dark-900">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs text-dark-500">
                {unreadNotifications.length > 0
                  ? `${unreadNotifications.length} unread`
                  : "You're all caught up"}
              </p>
            </div>
          </div>

          {unreadNotifications.length > 0 && (
            <button
              type="button"
              onClick={() => markAllRead()}
              disabled={markingAllRead}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-primary-600 transition-colors duration-200 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {markingAllRead ? (
                <LuLoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LuCheckCheck className="h-3.5 w-3.5" />
              )}

              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[440px] overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center px-5 py-14">
            <LuLoaderCircle className="h-6 w-6 animate-spin text-primary-600" />

            <p className="mt-3 text-xs font-medium text-dark-500">
              Loading notifications...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-danger/5 text-danger">
              <LuBell className="h-5 w-5" />
            </div>

            <p className="mt-3 text-sm font-bold text-dark-900">
              Unable to load notifications
            </p>

            <p className="mt-1 text-xs leading-5 text-dark-500">
              Please try again shortly.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-dark-50 text-dark-400">
                <LuBell className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-bold text-dark-900">
                No notifications
              </p>

              <p className="mt-1 text-xs leading-5 text-dark-500">
                New delivery updates will appear here.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          notifications.length > 0 && (
            <div>
              {notifications.map((notification) => {
                const notificationId =
                  notification?._id ||
                  notification?.id;

                const isUnread = !notification?.isRead;

                return (
                  <div
                    key={notificationId}
                    className={[
                      "border-b border-dark-100 px-4 py-4 transition-colors duration-200 last:border-b-0 sm:px-5",
                      isUnread
                        ? "bg-primary-50/40 hover:bg-primary-50/60"
                        : "bg-white hover:bg-dark-50/70",
                    ].join(" ")}
                  >
                    <div className="flex gap-3">
                      <div
                        className={[
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          isUnread
                            ? "bg-primary-100 text-primary-600"
                            : "bg-dark-50 text-dark-400",
                        ].join(" ")}
                      >
                        <LuBell className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={[
                              "min-w-0 text-sm leading-5",
                              isUnread
                                ? "font-bold text-dark-900"
                                : "font-semibold text-dark-700",
                            ].join(" ")}
                          >
                            {notification?.title || "Notification"}
                          </p>

                          {isUnread && (
                            <span
                              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500 ring-2 ring-primary-100"
                              aria-label="Unread"
                            />
                          )}
                        </div>

                        <p className="mt-1.5 text-xs leading-5 text-dark-500">
                          {notification?.message ||
                            "You have a new notification."}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[11px] font-medium text-dark-400">
                            {formatNotificationTime(
                              notification?.createdAt,
                            )}
                          </p>

                          <div className="flex items-center gap-1">
                            {isUnread && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleMarkRead(notification)
                                }
                                disabled={markingRead}
                                className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-primary-600 transition-colors duration-200 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {markingRead ? (
                                  <LuLoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <LuCheck className="h-3.5 w-3.5" />
                                )}

                                <span>Read</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(notification)
                              }
                              disabled={deleting}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-dark-400 transition-colors duration-200 hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Delete notification"
                            >
                              {deleting ? (
                                <LuLoaderCircle className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <LuTrash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}

export default DriverNotificationDropdown;