// import { CalendarClock, MapPin } from "lucide-react";
// import { Link } from "react-router-dom";

// import { formatNaira } from "../context/CartContext";

// function OrderSummary({
//   items,
//   orderTiming,
//   scheduledDate,
//   scheduledTime,
//   deliveryMethod,
//   pricePreview,
//   pricePreviewLoading,
//   pricePreviewError,
//   couponCode,
//   setCouponCode,
//   tip,
//   setTip,
// }) {
//   return (
//     <aside className="h-fit rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
//       <h2 className="font-heading text-xl font-bold text-dark-950">
//         Order Summary
//       </h2>

//       <div className="mt-5 space-y-4">
//         {items.map((item) => (
//           <div key={item.id} className="flex justify-between gap-3 text-sm">
//             <span className="text-dark-600">
//               {item.quantity} × {item.name}
//             </span>

//             <span className="font-semibold text-dark-900">
//               {formatNaira(item.unitPrice * item.quantity)}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="mt-5 border-t border-dark-100 pt-5">
//         <div className="space-y-3 text-sm">
//           <div className="mt-5 border-t border-dark-100 pt-5">
//             <label className="block text-sm font-semibold text-dark-900">
//               Coupon code
//             </label>

//             <div className="mt-2 flex gap-2">
//               <input
//                 type="text"
//                 value={couponCode}
//                 onChange={(event) =>
//                   setCouponCode(event.target.value.toUpperCase())
//                 }
//                 placeholder="Enter coupon code"
//                 className="min-w-0 flex-1 rounded-xl border border-dark-200 bg-white px-3 py-2.5 text-sm uppercase outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
//               />

//               {couponCode.trim() && (
//                 <button
//                   type="button"
//                   onClick={() => setCouponCode("")}
//                   className="rounded-xl border border-dark-200 px-3 py-2.5 text-xs font-semibold text-dark-600 transition hover:border-red-200 hover:text-red-500"
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>

//             <p className="mt-2 text-xs text-dark-500">
//               Your coupon will be validated automatically.
//             </p>
//           </div>

//           <div className="mt-5 border-t border-dark-100 pt-5">
//             <label className="block text-sm font-semibold text-dark-900">
//               Add a tip
//             </label>

//             <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
//               {[0, 500, 1000, 2000].map((amount) => (
//                 <button
//                   key={amount}
//                   type="button"
//                   onClick={() => setTip(amount)}
//                   className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
//                     Number(tip) === amount
//                       ? "border-primary-500 bg-primary-50 text-primary-600"
//                       : "border-dark-200 text-dark-600 hover:border-primary-300"
//                   }`}
//                 >
//                   {amount === 0 ? "No tip" : formatNaira(amount)}
//                 </button>
//               ))}
//             </div>

//             <div className="mt-3">
//               <input
//                 type="number"
//                 min="0"
//                 step="100"
//                 value={tip || ""}
//                 onChange={(event) => {
//                   const value = Math.max(0, Number(event.target.value) || 0);
//                   setTip(value);
//                 }}
//                 placeholder="Enter custom tip"
//                 className="w-full rounded-xl border border-dark-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
//               />
//             </div>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-dark-600">Subtotal</span>

//             <span className="font-semibold text-dark-900">
//               {pricePreview ? formatNaira(pricePreview.subtotal) : "—"}
//             </span>
//           </div>

//           <div className="flex justify-between">
//             <span className="text-dark-600">Delivery fee</span>

//             <span className="font-semibold text-dark-900">
//               {pricePreview ? formatNaira(pricePreview.deliveryFee) : "—"}
//             </span>
//           </div>

//           {Number(pricePreview?.discount || 0) > 0 && (
//             <div className="flex justify-between">
//               <span className="text-dark-600">Coupon discount</span>

//               <span className="font-semibold text-emerald-600">
//                 -{formatNaira(pricePreview.discount)}
//               </span>
//             </div>
//           )}

//           {Number(pricePreview?.loyaltyDiscount || 0) > 0 && (
//             <div className="flex justify-between">
//               <span className="text-dark-600">Loyalty discount</span>

//               <span className="font-semibold text-emerald-600">
//                 -{formatNaira(pricePreview.loyaltyDiscount)}
//               </span>
//             </div>
//           )}

//           {Number(pricePreview?.tip || 0) > 0 && (
//             <div className="flex justify-between">
//               <span className="text-dark-600">Tip</span>

//               <span className="font-semibold text-dark-900">
//                 {formatNaira(pricePreview.tip)}
//               </span>
//             </div>
//           )}
//         </div>

//         {pricePreviewLoading && (
//           <p className="mt-4 text-xs text-dark-500">
//             Updating your order total...
//           </p>
//         )}

//         {pricePreviewError && (
//           <p className="mt-4 text-xs font-medium text-red-500">
//             {pricePreviewError}
//           </p>
//         )}

//         <div className="mt-5 flex items-center justify-between border-t border-dark-100 pt-5">
//           <span className="font-heading text-base font-bold text-dark-950">
//             Total
//           </span>

//           <span className="font-heading text-xl font-bold text-primary-500">
//             {pricePreview ? formatNaira(pricePreview.total) : "—"}
//           </span>
//         </div>

//         <div className="mt-5 flex justify-between text-sm">
//           <span className="text-dark-600">Items</span>

//           <span className="font-semibold text-dark-900">
//             {items.reduce(
//               (total, item) => total + Number(item.quantity || 0),
//               0,
//             )}
//           </span>
//         </div>

//         {orderTiming === "scheduled" && scheduledDate && scheduledTime && (
//           <div className="mt-4 rounded-xl bg-primary-50 p-3 text-sm text-primary-700">
//             <div className="flex items-center gap-2 font-semibold">
//               <CalendarClock size={16} />
//               Scheduled order
//             </div>

//             <p className="mt-1 text-xs">
//               {scheduledDate} at {scheduledTime}
//             </p>
//           </div>
//         )}
//       </div>

//       <p className="mt-5 flex gap-2 text-xs leading-5 text-dark-500">
//         <MapPin size={15} className="shrink-0 text-primary-500" />

//         {deliveryMethod === "delivery"
//           ? "Your delivery fee is calculated from your selected delivery location."
//           : "Pickup orders do not use delivery-location pricing."}
//       </p>

//       <Link
//         to="/cart"
//         className="mt-5 block text-center text-sm font-bold text-primary-500"
//       >
//         Return to cart
//       </Link>
//     </aside>
//   );
// }

// export default OrderSummary;



import { CalendarClock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { formatNaira } from "../context/CartContext";

function OrderSummary({
  items,
  orderTiming,
  scheduledDate,
  scheduledTime,
  deliveryMethod,
  pricePreview,
  pricePreviewLoading,
  pricePreviewError,
  couponCode,
  setCouponCode,
  tip,
  setTip,
}) {
  return (
    <aside className="h-fit rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <h2 className="font-heading text-xl font-bold text-dark-950">
        Order Summary
      </h2>

      {/* Order Items */}
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-3 text-sm">
            <span className="text-dark-600">
              {item.quantity} × {item.name}
            </span>

            <span className="font-semibold text-dark-900">
              {formatNaira(item.unitPrice * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Checkout Options & Pricing */}
      <div className="mt-5 border-t border-dark-100 pt-5">
        {/* Coupon */}
        <div>
          <label className="block text-sm font-semibold text-dark-900">
            Coupon code
          </label>

          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(event) =>
                setCouponCode(event.target.value.toUpperCase())
              }
              placeholder="Enter coupon code"
              className="min-w-0 flex-1 rounded-xl border border-dark-200 bg-white px-3 py-2.5 text-sm uppercase outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />

            {couponCode.trim() && (
              <button
                type="button"
                onClick={() => setCouponCode("")}
                className="rounded-xl border border-dark-200 px-3 py-2.5 text-xs font-semibold text-dark-600 transition hover:border-red-200 hover:text-red-500"
              >
                Clear
              </button>
            )}
          </div>

          <p className="mt-2 text-xs text-dark-500">
            Your coupon will be validated automatically.
          </p>
        </div>

        {/* Tip */}
        <div className="mt-5 border-t border-dark-100 pt-5">
          <label className="block text-sm font-semibold text-dark-900">
            Add a tip
          </label>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[0, 500, 1000, 2000].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setTip(amount)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  Number(tip) === amount
                    ? "border-primary-500 bg-primary-50 text-primary-600"
                    : "border-dark-200 text-dark-600 hover:border-primary-300"
                }`}
              >
                {amount === 0 ? "No tip" : formatNaira(amount)}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <input
              type="number"
              min="0"
              step="100"
              value={tip || ""}
              onChange={(event) => {
                const value = Math.max(
                  0,
                  Number(event.target.value) || 0,
                );

                setTip(value);
              }}
              placeholder="Enter custom tip"
              className="w-full rounded-xl border border-dark-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mt-5 space-y-3 border-t border-dark-100 pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-600">Subtotal</span>

            <span className="font-semibold text-dark-900">
              {pricePreview ? formatNaira(pricePreview.subtotal) : "—"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-dark-600">Delivery fee</span>

            <span className="font-semibold text-dark-900">
              {pricePreview
                ? formatNaira(pricePreview.deliveryFee)
                : "—"}
            </span>
          </div>

          {Number(pricePreview?.discount || 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-dark-600">Coupon discount</span>

              <span className="font-semibold text-emerald-600">
                -{formatNaira(pricePreview.discount)}
              </span>
            </div>
          )}

          {Number(pricePreview?.loyaltyDiscount || 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-dark-600">Loyalty discount</span>

              <span className="font-semibold text-emerald-600">
                -{formatNaira(pricePreview.loyaltyDiscount)}
              </span>
            </div>
          )}

          {Number(pricePreview?.tip || 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-dark-600">Tip</span>

              <span className="font-semibold text-dark-900">
                {formatNaira(pricePreview.tip)}
              </span>
            </div>
          )}
        </div>

        {/* Preview Status */}
        {pricePreviewLoading && (
          <p className="mt-4 text-xs text-dark-500">
            Updating your order total...
          </p>
        )}

        {pricePreviewError && (
          <p className="mt-4 text-xs font-medium text-red-500">
            {pricePreviewError}
          </p>
        )}

        {/* Total */}
        <div className="mt-5 flex items-center justify-between border-t border-dark-100 pt-5">
          <span className="font-heading text-base font-bold text-dark-950">
            Total
          </span>

          <span className="font-heading text-xl font-bold text-primary-500">
            {pricePreview ? formatNaira(pricePreview.total) : "—"}
          </span>
        </div>

        {/* Item Count */}
        <div className="mt-5 flex justify-between text-sm">
          <span className="text-dark-600">Items</span>

          <span className="font-semibold text-dark-900">
            {items.reduce(
              (total, item) => total + Number(item.quantity || 0),
              0,
            )}
          </span>
        </div>

        {/* Scheduled Order */}
        {orderTiming === "scheduled" &&
          scheduledDate &&
          scheduledTime && (
            <div className="mt-4 rounded-xl bg-primary-50 p-3 text-sm text-primary-700">
              <div className="flex items-center gap-2 font-semibold">
                <CalendarClock size={16} />
                Scheduled order
              </div>

              <p className="mt-1 text-xs">
                {scheduledDate} at {scheduledTime}
              </p>
            </div>
          )}
      </div>

      {/* Delivery Information */}
      <p className="mt-5 flex gap-2 text-xs leading-5 text-dark-500">
        <MapPin size={15} className="shrink-0 text-primary-500" />

        {deliveryMethod === "delivery"
          ? "Your delivery fee is calculated from your selected delivery location."
          : "Pickup orders do not use delivery-location pricing."}
      </p>

      {/* Cart Link */}
      <Link
        to="/cart"
        className="mt-5 block text-center text-sm font-bold text-primary-500"
      >
        Return to cart
      </Link>
    </aside>
  );
}

export default OrderSummary;