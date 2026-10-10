// import { Star, Gift, TrendingUp } from "lucide-react";

// import { useUser } from "../../hooks/useUser";

// function Loyalty() {
//   const { profile, isLoading } = useUser();

//   if (isLoading) {
//     return (
//       <div
//         className="
//         rounded-2xl
//         border border-dark-200
//         bg-white
//         p-8
//         text-center
//         shadow-soft
//       "
//       >
//         Loading loyalty information...
//       </div>
//     );
//   }

//   const points = profile?.loyaltyPoints || 0;

//   return (
//     <div className="space-y-6">
//       <div>
//         <p
//           className="
//           text-sm
//           font-bold
//           uppercase
//           tracking-widest
//           text-primary-500
//         "
//         >
//           Loyalty
//         </p>

//         <h1
//           className="
//           mt-2
//           text-3xl
//           font-extrabold
//           text-dark-900
//         "
//         >
//           Reward points
//         </h1>

//         <p className="mt-2 text-dark-600">
//           Earn rewards when you order from Resvill.
//         </p>
//       </div>

//       <div
//         className="
//         grid
//         gap-4
//         sm:grid-cols-3
//       "
//       >
//         <LoyaltyCard icon={Star} title="Points balance" value={points} />

//         <LoyaltyCard icon={Gift} title="Rewards available" value="0" />

//         <LoyaltyCard
//           icon={TrendingUp}
//           title="Status"
//           value={points >= 1000 ? "Gold" : "Member"}
//         />
//       </div>

//       <div
//         className="
//         rounded-2xl
//         border border-dark-200
//         bg-white
//         p-6
//         shadow-soft
//       "
//       >
//         <h2
//           className="
//           text-xl
//           font-bold
//           text-dark-900
//         "
//         >
//           How loyalty works
//         </h2>

//         <p
//           className="
//           mt-2
//           text-sm
//           leading-6
//           text-dark-600
//         "
//         >
//           Your points are automatically added when completed orders are
//           processed. You can redeem available rewards during checkout.
//         </p>
//       </div>
//     </div>
//   );
// }

// function LoyaltyCard({ icon: Icon, title, value }) {
//   return (
//     <div
//       className="
//       rounded-2xl
//       border border-dark-200
//       bg-white
//       p-5
//       shadow-soft
//     "
//     >
//       <div
//         className="
//         flex
//         items-center
//         gap-3
//       "
//       >
//         <div
//           className="
//           flex
//           h-10
//           w-10
//           items-center
//           justify-center
//           rounded-xl
//           bg-primary-50
//           text-primary-500
//         "
//         >
//           <Icon size={20} />
//         </div>

//         <div>
//           <p
//             className="
//             text-sm
//             text-dark-600
//           "
//           >
//             {title}
//           </p>

//           <p
//             className="
//             mt-1
//             text-2xl
//             font-extrabold
//             text-dark-900
//           "
//           >
//             {value}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Loyalty;

// import { Star, Gift, TrendingUp, History, Coins, Loader2 } from "lucide-react";

// import { useLoyalty } from "../../hooks/useLoyalty";

// function Loyalty() {
//   const {
//     pointsBalance,
//     lifetimePointsEarned,
//     lifetimePointsRedeemed,
//     pointValue,
//     transactions,
//     pagination,
//     loading,
//     transactionsLoading,
//   } = useLoyalty({
//     page: 1,
//     limit: 20,
//   });

//   if (loading) {
//     return (
//       <div className="flex min-h-[300px] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Loyalty Rewards</h1>

//         <p className="mt-1 text-sm text-gray-500">
//           Earn points from completed orders and use them toward future
//           purchases.
//         </p>
//       </div>

//       {/* Loyalty Summary */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="rounded-2xl border bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Available Points</p>

//               <p className="mt-2 text-3xl font-bold text-gray-900">
//                 {pointsBalance.toLocaleString()}
//               </p>
//             </div>

//             <div className="rounded-xl bg-yellow-100 p-3">
//               <Star className="h-6 w-6 text-yellow-600" />
//             </div>
//           </div>

//           <p className="mt-3 text-xs text-gray-500">
//             Worth ₦{(pointsBalance * pointValue).toLocaleString()}
//           </p>
//         </div>

//         <div className="rounded-2xl border bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Lifetime Earned</p>

//               <p className="mt-2 text-3xl font-bold text-gray-900">
//                 {lifetimePointsEarned.toLocaleString()}
//               </p>
//             </div>

//             <div className="rounded-xl bg-green-100 p-3">
//               <TrendingUp className="h-6 w-6 text-green-600" />
//             </div>
//           </div>

//           <p className="mt-3 text-xs text-gray-500">Total points earned</p>
//         </div>

//         <div className="rounded-2xl border bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Points Redeemed</p>

//               <p className="mt-2 text-3xl font-bold text-gray-900">
//                 {lifetimePointsRedeemed.toLocaleString()}
//               </p>
//             </div>

//             <div className="rounded-xl bg-purple-100 p-3">
//               <Gift className="h-6 w-6 text-purple-600" />
//             </div>
//           </div>

//           <p className="mt-3 text-xs text-gray-500">Total points used</p>
//         </div>

//         <div className="rounded-2xl border bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Point Value</p>

//               <p className="mt-2 text-3xl font-bold text-gray-900">
//                 ₦{pointValue.toLocaleString()}
//               </p>
//             </div>

//             <div className="rounded-xl bg-blue-100 p-3">
//               <Coins className="h-6 w-6 text-blue-600" />
//             </div>
//           </div>

//           <p className="mt-3 text-xs text-gray-500">Value of 1 loyalty point</p>
//         </div>
//       </div>

//       {/* How it works */}
//       <div className="rounded-2xl border bg-white p-6 shadow-sm">
//         <div className="flex items-center gap-3">
//           <div className="rounded-xl bg-yellow-100 p-3">
//             <Star className="h-5 w-5 text-yellow-600" />
//           </div>

//           <div>
//             <h2 className="font-semibold text-gray-900">
//               How Loyalty Points Work
//             </h2>

//             <p className="text-sm text-gray-500">
//               Your points are automatically earned when eligible orders are
//               delivered.
//             </p>
//           </div>
//         </div>

//         <div className="mt-5 grid gap-4 sm:grid-cols-2">
//           <div className="rounded-xl bg-gray-50 p-4">
//             <p className="font-medium text-gray-900">Earn Points</p>

//             <p className="mt-1 text-sm text-gray-500">
//               You currently earn 1 point for every ₦100 spent on eligible
//               delivered orders.
//             </p>
//           </div>

//           <div className="rounded-xl bg-gray-50 p-4">
//             <p className="font-medium text-gray-900">Use Your Points</p>

//             <p className="mt-1 text-sm text-gray-500">
//               1 loyalty point currently has a value of ₦
//               {pointValue.toLocaleString()}.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Transactions */}
//       <div className="rounded-2xl border bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b p-6">
//           <div className="flex items-center gap-3">
//             <div className="rounded-xl bg-gray-100 p-3">
//               <History className="h-5 w-5 text-gray-600" />
//             </div>

//             <div>
//               <h2 className="font-semibold text-gray-900">Loyalty History</h2>

//               <p className="text-sm text-gray-500">
//                 Your recent loyalty point activity
//               </p>
//             </div>
//           </div>

//           <span className="text-sm text-gray-500">
//             {pagination.total} transaction
//             {pagination.total === 1 ? "" : "s"}
//           </span>
//         </div>

//         {transactionsLoading ? (
//           <div className="flex min-h-[180px] items-center justify-center">
//             <Loader2 className="h-6 w-6 animate-spin" />
//           </div>
//         ) : transactions.length === 0 ? (
//           <div className="px-6 py-12 text-center">
//             <History className="mx-auto h-10 w-10 text-gray-300" />

//             <h3 className="mt-3 font-medium text-gray-900">
//               No loyalty activity yet
//             </h3>

//             <p className="mt-1 text-sm text-gray-500">
//               Your loyalty transactions will appear here.
//             </p>
//           </div>
//         ) : (
//           <div className="divide-y">
//             {transactions.map((transaction) => {
//               const isEarned = transaction.type === "earned";

//               const isRedeemed = transaction.type === "redeemed";

//               const isRefunded = transaction.type === "refunded";

//               return (
//                 <div
//                   key={transaction._id || transaction.id}
//                   className="flex items-center justify-between gap-4 p-6"
//                 >
//                   <div className="min-w-0">
//                     <p className="font-medium capitalize text-gray-900">
//                       {transaction.reason || transaction.type}
//                     </p>

//                     <p className="mt-1 text-xs text-gray-500">
//                       {transaction.createdAt
//                         ? new Date(transaction.createdAt).toLocaleString()
//                         : "—"}
//                     </p>
//                   </div>

//                   <div className="text-right">
//                     <p
//                       className={`font-semibold ${
//                         isEarned || isRefunded
//                           ? "text-green-600"
//                           : isRedeemed
//                             ? "text-red-600"
//                             : "text-gray-900"
//                       }`}
//                     >
//                       {isEarned || isRefunded ? "+" : "-"}
//                       {Number(transaction.points || 0).toLocaleString()}
//                     </p>

//                     <p className="mt-1 text-xs text-gray-500">
//                       Balance:{" "}
//                       {Number(transaction.balanceAfter || 0).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Loyalty;

import { useState } from "react";
import {
  Star,
  Gift,
  TrendingUp,
  History,
  Coins,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
} from "lucide-react";

import { useLoyalty } from "../../hooks/useLoyalty";

function Loyalty() {
  const [page, setPage] = useState(1);
  const {
    pointsBalance,
    lifetimePointsEarned,
    lifetimePointsRedeemed,
    pointValue,
    transactions,
    pagination,
    loading,
    transactionsLoading,
    loyaltyError,
    transactionsError,
    refetchLoyalty,
    refetchTransactions,
  } = useLoyalty({
    page,
    limit: 20,
  });

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (loyaltyError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-danger/20 bg-white p-8 text-center shadow-soft">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
            <History className="h-5 w-5 text-danger" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-dark-900">
            Unable to load loyalty information
          </h2>

          <p className="mt-2 text-sm leading-6 text-dark-500">
            We couldn't retrieve your loyalty account right now. Please try
            again.
          </p>

          <button
            type="button"
            onClick={() => refetchLoyalty()}
            className="mt-5 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ======================================================
          HEADER
      ====================================================== */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
            <Star className="h-5 w-5 text-primary-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-dark-900">
              Loyalty Rewards
            </h1>

            <p className="mt-1 text-sm text-dark-600">
              Earn points from your delivered orders and use them toward future
              purchases.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          LOYALTY SUMMARY
      ====================================================== */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Available Points */}
        <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-dark-600">
                Available Points
              </p>

              <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-dark-900">
                {pointsBalance.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
              <Star className="h-5 w-5 text-primary-500" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-success">
            <Coins className="h-3.5 w-3.5" />

            <span>Worth ₦{(pointsBalance * pointValue).toLocaleString()}</span>
          </div>
        </div>

        {/* Lifetime Earned */}
        <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-dark-600">
                Lifetime Earned
              </p>

              <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-dark-900">
                {lifetimePointsEarned.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-dark-500">
            Total points earned
          </p>
        </div>

        {/* Redeemed */}
        <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-dark-600">
                Points Redeemed
              </p>

              <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-dark-900">
                {lifetimePointsRedeemed.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-400/15">
              <Gift className="h-5 w-5 text-accent-600" />
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-dark-500">
            Total points used
          </p>
        </div>

        {/* Point Value */}
        <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-dark-600">Point Value</p>

              <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-dark-900">
                ₦{pointValue.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info/10">
              <Coins className="h-5 w-5 text-info" />
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-dark-500">
            Value of 1 loyalty point
          </p>
        </div>
      </div>

      {/* ======================================================
          HOW IT WORKS
      ====================================================== */}
      <div className="overflow-hidden rounded-2xl border border-dark-200 bg-white shadow-soft">
        <div className="border-b border-dark-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
              <Star className="h-5 w-5 text-primary-500" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-dark-900">
                How Loyalty Points Work
              </h2>

              <p className="mt-1 text-sm text-dark-600">
                Your points are automatically managed based on your eligible
                orders.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          {/* Earn */}
          <div className="rounded-xl border border-dark-200 bg-dark-50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-dark-900">
              Earn Points
            </h3>

            <p className="mt-2 text-sm leading-6 text-dark-600">
              You currently earn{" "}
              <span className="font-semibold text-dark-900">1 point</span> for
              every <span className="font-semibold text-dark-900">₦100</span>{" "}
              spent on eligible delivered orders.
            </p>
          </div>

          {/* Value */}
          <div className="rounded-xl border border-dark-200 bg-dark-50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-400/15">
              <Coins className="h-5 w-5 text-accent-600" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-dark-900">
              Point Value
            </h3>

            <p className="mt-2 text-sm leading-6 text-dark-600">
              Each loyalty point currently has a value of{" "}
              <span className="font-semibold text-dark-900">
                ₦{pointValue.toLocaleString()}
              </span>{" "}
              when applied through the supported checkout flow.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          TRANSACTION HISTORY
      ====================================================== */}
      <div className="overflow-hidden rounded-2xl border border-dark-200 bg-white shadow-soft">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-dark-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-100">
              <History className="h-5 w-5 text-dark-700" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-dark-900">
                Loyalty History
              </h2>

              <p className="mt-1 text-sm text-dark-600">
                Your recent loyalty point activity
              </p>
            </div>
          </div>

          <div className="rounded-full bg-dark-100 px-3 py-1.5 text-xs font-semibold text-dark-600">
            {pagination.total}{" "}
            {pagination.total === 1 ? "transaction" : "transactions"}
          </div>
        </div>

        {/* Loading */}
        {transactionsLoading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        ) : transactionsError ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
              <History className="h-6 w-6 text-danger" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-dark-900">
              Unable to load loyalty history
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-dark-500">
              Your loyalty account loaded, but your transaction history couldn't
              be retrieved.
            </p>

            <button
              type="button"
              onClick={() => refetchTransactions()}
              className="mt-4 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              Try Again
            </button>
          </div>
        ) : transactions.length === 0 ? (
          /* Empty */
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dark-100">
              <History className="h-6 w-6 text-dark-400" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-dark-900">
              No loyalty activity yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-dark-500">
              Your loyalty transactions will appear here once you start earning
              or using points.
            </p>
          </div>
        ) : (
          /* Transactions */
          <div className="divide-y divide-dark-200">
            {transactions.map((transaction) => {
              const isEarned = transaction.type === "earned";

              const isRedeemed = transaction.type === "redeemed";

              const isRefunded = transaction.type === "refunded";

              const points = Number(transaction.points || 0);

              return (
                <div
                  key={transaction._id || transaction.id}
                  className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-dark-50"
                >
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isEarned
                        ? "bg-success/10"
                        : isRedeemed
                          ? "bg-danger/10"
                          : isRefunded
                            ? "bg-info/10"
                            : "bg-dark-100"
                    }`}
                  >
                    {isEarned ? (
                      <ArrowUpRight className="h-5 w-5 text-success" />
                    ) : isRedeemed ? (
                      <ArrowDownRight className="h-5 w-5 text-danger" />
                    ) : isRefunded ? (
                      <RotateCcw className="h-5 w-5 text-info" />
                    ) : (
                      <Coins className="h-5 w-5 text-dark-500" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-dark-900">
                      {transaction.reason || transaction.type}
                    </p>

                    <p className="mt-1 text-xs text-dark-500">
                      {transaction.createdAt
                        ? new Date(transaction.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-bold ${
                        isEarned || isRefunded
                          ? "text-success"
                          : isRedeemed
                            ? "text-danger"
                            : "text-dark-900"
                      }`}
                    >
                      {isEarned || isRefunded ? "+" : isRedeemed ? "-" : ""}
                      {points.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-dark-500">
                      Balance:{" "}
                      {Number(transaction.balanceAfter || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination information */}
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-dark-200 bg-dark-50 px-6 py-4">
            <button
              type="button"
              onClick={() =>
                setPage((currentPage) => Math.max(currentPage - 1, 1))
              }
              disabled={page === 1 || transactionsLoading}
              className="rounded-lg border border-dark-300 bg-white px-4 py-2 text-sm font-semibold text-dark-700 transition hover:border-primary-300 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <p className="text-xs font-semibold text-dark-500">
              Page {pagination.page} of {pagination.pages}
            </p>

            <button
              type="button"
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(currentPage + 1, pagination.pages),
                )
              }
              disabled={page >= pagination.pages || transactionsLoading}
              className="rounded-lg border border-dark-300 bg-white px-4 py-2 text-sm font-semibold text-dark-700 transition hover:border-primary-300 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Loyalty;
