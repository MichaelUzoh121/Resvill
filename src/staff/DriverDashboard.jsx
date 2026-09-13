import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  RefreshCcw,
  Store,
  Truck,
} from "lucide-react";
import { getMapsDirectionsLink } from "../utils/Maps";
import {
  DELIVERY_LABELS,
  getDeliveryNextStatus,
  getDriverOrders,
  updateDeliveryStatus,
} from "../utils/orders";
import { getStaffSession, logoutStaff } from "../utils/staffAuth";
import { hasCoordinates } from "../utils/address";

const prettyTime = (value) => value ? new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "—";

function DriverDashboard() {
  const navigate = useNavigate();
  const session = getStaffSession();
  const [orders, setOrders] = useState([]);

  const refresh = () => setOrders(getDriverOrders(session?.username));
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const handleStorage = (event) => { if (event.key === "resvill_orders_v1") refresh(); };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.username]);

  const counts = useMemo(() => ({
    assigned: orders.filter((order) => order.delivery.status === "assigned").length,
    active: orders.filter((order) => ["accepted", "picked_up", "out_for_delivery"].includes(order.delivery.status)).length,
  }), [orders]);

  const advance = (order) => {
    const next = getDeliveryNextStatus(order.delivery.status);
    if (!next) return;
    if (next === "delivered" && !window.confirm("Confirm that this order was delivered to the customer?")) return;
    const updated = updateDeliveryStatus(order.id, next);
    if (updated) {
      toast.success(next === "delivered" ? `Order #${order.id} marked delivered.` : `Order #${order.id} marked ${DELIVERY_LABELS[next].toLowerCase()}.`);
      refresh();
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-dark-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500">Driver dashboard</p>
            <h1 className="mt-1 font-heading text-3xl font-extrabold text-dark-950">Today's Deliveries</h1>
            <p className="mt-1 text-sm text-dark-500">Signed in as {session?.name || "Driver"}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={refresh} className="flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-bold text-dark-700 hover:border-primary-500">
              <RefreshCcw size={16} /> Refresh
            </button>
            <button type="button" onClick={() => { logoutStaff(); navigate("/staff/login", { replace: true }); }} className="rounded-xl bg-dark-950 px-4 py-2.5 text-sm font-bold text-white">Sign out</button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Summary icon={<Truck size={18} />} label="Assigned" value={counts.assigned} />
          <Summary icon={<Navigation size={18} />} label="Active deliveries" value={counts.active} />
          <Summary icon={<CheckCircle2 size={18} />} label="Completed today" value="—" />
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
            <PackageCheck size={38} className="mx-auto text-dark-300" />
            <p className="mt-4 font-bold text-dark-700">No deliveries assigned yet</p>
            <p className="mt-1 text-sm text-dark-400">Assigned orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => <DeliveryCard key={order.id} order={order} onAdvance={() => advance(order)} />)}
          </div>
        )}
      </div>
    </main>
  );
}

function Summary({ icon, label, value }) {
  return <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft"><div className="flex items-center gap-2 text-primary-500">{icon}<span className="text-xs font-bold uppercase tracking-wider text-dark-400">{label}</span></div><p className="mt-2 font-heading text-2xl font-extrabold text-dark-950">{value}</p></div>;
}

function DeliveryCard({ order, onAdvance }) {
  const delivery = order.delivery;
  const location = order.customer?.deliveryLocation;
  const directionsLink = hasCoordinates(location) ? getMapsDirectionsLink(location.latitude, location.longitude) : null;
  const next = getDeliveryNextStatus(delivery.status);
  const customerPhone = order.customer?.phone;
  return (
    <article className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dark-100 pb-4">
        <div><div className="flex items-center gap-3"><h2 className="font-heading text-xl font-extrabold text-dark-950">#{order.id}</h2><span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700">{DELIVERY_LABELS[delivery.status]}</span></div><p className="mt-1 flex items-center gap-1.5 text-xs text-dark-400"><Clock3 size={13} /> Assigned {prettyTime(delivery.timestamps?.assigned)}</p></div>
        {customerPhone && <a href={`tel:${customerPhone}`} className="flex items-center gap-2 rounded-xl border border-dark-200 px-3 py-2 text-sm font-bold text-dark-700 hover:border-primary-500 hover:text-primary-600"><Phone size={15} /> Call customer</a>}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl bg-dark-50 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dark-400"><Store size={14} /> Pickup</p><p className="mt-2 font-bold text-dark-900">Resvill Kitchen</p><p className="mt-1 text-sm text-dark-500">Restaurant pickup point</p></div>
        <div className="rounded-xl bg-primary-50 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600"><MapPin size={14} /> Drop-off</p><p className="mt-2 font-bold text-dark-900">{order.customer?.name || "Customer"}</p><p className="mt-1 text-sm leading-6 text-dark-600">{location?.addressText || "Address not selected"}</p>{location?.deliveryInstructions && <p className="mt-2 text-xs text-dark-500"><strong>Note:</strong> {location.deliveryInstructions}</p>}</div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dark-100 pt-4">
        <div className="text-sm text-dark-500">{order.items?.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</div>
        <div className="flex flex-wrap gap-2">
          {directionsLink ? <a href={directionsLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-primary-200 px-4 py-2.5 text-sm font-bold text-primary-700 hover:bg-primary-50"><Navigation size={16} /> Get directions</a> : <span className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700">No map coordinates</span>}
          {next && <button type="button" onClick={onAdvance} className="rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-600">{next === "delivered" ? "Confirm delivered" : `Mark ${DELIVERY_LABELS[next]}`}</button>}
        </div>
      </div>
    </article>
  );
}

export default DriverDashboard;
