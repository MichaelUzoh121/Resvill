import { Bell, Check, Trash2 } from "lucide-react";

import { useNotifications } from "../../hooks/useNotifications";

function Notifications() {
  const { notifications, loading, markRead, markAllRead, removeNotification } =
    useNotifications();

  if (loading) {
    return (
      <div
        className="
        rounded-2xl
        border border-dark-200
        bg-white
        p-8
        text-center
        shadow-soft
      "
      >
        <p className="text-dark-600">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="
        flex
        flex-col
        gap-3
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
      >
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
            Notifications
          </p>

          <h1
            className="
            mt-2
            text-3xl
            font-extrabold
            text-dark-900
          "
          >
            Your updates
          </h1>

          <p className="mt-2 text-dark-600">
            Stay updated with your orders and account activity.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="
                rounded-xl
                bg-primary-500
                px-5
                py-3
                text-sm
                font-bold
                text-white
                hover:bg-primary-600
              "
          >
            Mark all as read
          </button>
        )}
      </div>

      <div
        className="
        rounded-2xl
        border border-dark-200
        bg-white
        p-5
        shadow-soft
      "
      >
        {notifications.length === 0 ? (
          <div
            className="
              py-10
              text-center
            "
          >
            <Bell size={32} className="mx-auto text-dark-300" />

            <p
              className="
                mt-3
                text-sm
                font-semibold
                text-dark-500
              "
            >
              No notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`
                      flex
                      items-start
                      justify-between
                      gap-4
                      rounded-xl
                      p-4
                      transition

                      ${notification.isRead ? "bg-dark-50" : "bg-primary-50"}

                    `}
              >
                <div className="flex gap-3">
                  <div
                    className="
                        mt-1
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-primary-500
                      "
                  >
                    <Bell size={17} />
                  </div>

                  <div>
                    <h3
                      className="
                          text-sm
                          font-bold
                          text-dark-900
                        "
                    >
                      {notification.title}
                    </h3>

                    <p
                      className="
                          mt-1
                          text-sm
                          text-dark-600
                        "
                    >
                      {notification.message}
                    </p>

                    <p
                      className="
                          mt-2
                          text-xs
                          font-semibold
                          text-dark-400
                        "
                    >
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div
                  className="
                      flex
                      items-center
                      gap-2
                    "
                >
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => markRead(notification._id)}
                      className="
                              rounded-lg
                              p-2
                              text-primary-500
                              hover:bg-white
                            "
                      title="Mark as read"
                    >
                      <Check size={17} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeNotification(notification._id)}
                    className="
                          rounded-lg
                          p-2
                          text-red-500
                          hover:bg-white
                        "
                    title="Delete notification"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
