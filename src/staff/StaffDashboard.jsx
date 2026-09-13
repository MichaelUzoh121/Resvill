import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Clock,
  LogOut,
  MapPin,
  Phone,
  RefreshCcw,
  ShoppingBag,
} from "lucide-react";
import { formatNaira } from "../context/CartContext";
import { assignDriver, getOrders, getNextStatus, updateOrderStatus } from "../utils/orders";
import { getDriverAccounts, getStaffSession, logoutStaff } from "../utils/staffAuth";

const STATUS_LABELS = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const STATUS_STYLES = {
  placed: "bg-dark-100 text-dark-600",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  ready: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-primary-100 text-primary-700",
  delivered: "bg-success/15 text-success",
};

const TABS = [
  { key: "active", label: "Active" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const prettyDate = (value) =>
  value
    ? new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : "—";

const DRIVER_ACCOUNTS = getDriverAccounts();

function StaffDashboard() {
  const navigate = useNavigate();
  const session = getStaffSession();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  const refresh = () => setOrders(getOrders());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // Pick up orders placed in other tabs of the same browser without
    // needing a manual refresh.
    const handleStorage = (event) => {
      if (event.key === "resvill_orders_v1") refresh();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === "active") {
      return orders.filter((order) => order.status !== "delivered");
    }
    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

  const advanceStatus = (order) => {
    const next = getNextStatus(order.status);
    if (!next) return;

    const updated = updateOrderStatus(order.id, next);
    if (updated) {
      toast.success(`Order #${order.id} marked as ${STATUS_LABELS[next]}`);
      refresh();
    }
  };

  const handleLogout = () => {
    logoutStaff();
    navigate("/staff/login", { replace: true });
  };

  const handleAssignDriver = (order, username) => {
    const driver = DRIVER_ACCOUNTS.find((account) => account.username === username);
    if (!driver) return;
    const updated = assignDriver(order.id, driver);
    if (updated) {
      toast.success(`${driver.name} assigned to order #${order.id}`);
      refresh();
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-dark-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500">
              Staff dashboard
            </p>
            <h1 className="mt-1 font-heading text-3xl font-extrabold text-dark-950">
              Orders queue
            </h1>
            {session && (
              <p className="mt-1 text-sm text-dark-500">
                Signed in as <strong className="text-dark-700">{session.name}</strong>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              className="flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-bold text-dark-700 hover:border-primary-500 hover:text-primary-600"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-dark-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-dark-800"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                activeTab === tab.key
                  ? "bg-primary-500 text-white"
                  : "bg-white text-dark-600 hover:bg-dark-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
            <ShoppingBag size={36} className="text-dark-300" />
            <p className="mt-4 font-bold text-dark-700">No orders here right now</p>
            <p className="mt-1 text-sm text-dark-400">
              New orders placed on this browser will show up automatically.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredOrders.map((order) => {
              const next = getNextStatus(order.status);

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-heading text-lg font-extrabold text-dark-950">
                          #{order.id}
                        </h2>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[order.status] || "bg-dark-100 text-dark-600"}`}
                        >
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-dark-400">
                        <Clock size={13} />
                        Placed {prettyDate(order.createdAt)}
                      </p>
                    </div>

                    <strong className="font-heading text-xl text-primary-500">
                      {formatNaira(order.totals?.total)}
                    </strong>
                  </div>

                  <div className="mt-4 grid gap-4 border-t border-dark-100 pt-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                        Customer
                      </p>
                      <p className="mt-1 font-bold text-dark-800">{order.customer?.name}</p>
                      {order.customer?.phone && (
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-dark-500">
                          <Phone size={13} />
                          {order.customer.phone}
                        </p>
                      )}

                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-dark-400">
                        {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery address"}
                      </p>
                      {order.deliveryMethod === "pickup" ? (
                        <p className="mt-1 text-sm text-dark-600">Customer will collect in-store</p>
                      ) : (
                        <>
                          <p className="mt-1 flex items-start gap-1.5 text-sm text-dark-600">
                            <MapPin size={14} className="mt-0.5 shrink-0" />
                            {order.customer?.deliveryLocation?.addressText || "—"}
                          </p>
                          <label className="mt-3 block text-xs font-bold uppercase tracking-wider text-dark-400">
                            Assign driver
                            <select
                              value={order.delivery?.driverId || ""}
                              onChange={(event) => handleAssignDriver(order, event.target.value)}
                              className="mt-1 w-full rounded-lg border border-dark-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-dark-700"
                            >
                              <option value="">Select a driver</option>
                              {DRIVER_ACCOUNTS.map((driver) => <option key={driver.username} value={driver.username}>{driver.name}</option>)}
                            </select>
                          </label>
                          {order.delivery?.driverName && <p className="mt-1 text-xs text-primary-600">Assigned to {order.delivery.driverName}</p>}
                        </>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
                        Items
                      </p>
                      <ul className="mt-1 space-y-1 text-sm text-dark-600">
                        {(order.items || []).map((item) => (
                          <li key={item.id} className="flex justify-between gap-3">
                            <span>
                              {item.quantity}&times; {item.name}
                            </span>
                            <span className="text-dark-400">
                              {formatNaira(item.unitPrice * item.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end border-t border-dark-100 pt-4">
                    {next ? (
                      <button
                        type="button"
                        onClick={() => advanceStatus(order)}
                        className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-600"
                      >
                        Mark as {STATUS_LABELS[next]}
                      </button>
                    ) : (
                      <span className="text-sm font-bold text-success">Order complete</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default StaffDashboard;

