// import React from "react";
// import {
//   Check,
//   LogOut,
//   Pencil,
//   ShoppingBag,
//   User,
// } from "lucide-react";
// import { toast } from "react-hot-toast";

// import { useGroupOrderContext } from "../../../context/GroupOrderContext";

// function GroupParticipantActions({
//   groupOrder,
//   participant,
//   isHost,
// }) {
//   const {
//     canAddItems,
//     canEditItems,
//     leaveGroup,
//   } = useGroupOrderContext();

//   const isOpen = groupOrder?.status === "open";

//   const handleLeave = () => {
//     if (isHost) {
//       toast.error(
//         "The host cannot leave the group order.",
//       );
//       return;
//     }

//     leaveGroup();

//     toast.success("You have left this group session.");
//   };

//   if (!participant) {
//     return null;
//   }

//   return (
//     <section className="rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
//       <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//         {/* Participant */}
//         <div className="flex min-w-0 items-center gap-3">
//           <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
//             <User size={20} />
//           </div>

//           <div className="min-w-0">
//             <div className="flex flex-wrap items-center gap-2">
//               <h2 className="text-lg font-bold text-dark-900">
//                 Your participation
//               </h2>

//               {isHost && (
//                 <span className="rounded-full bg-accent-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-600">
//                   Host
//                 </span>
//               )}
//             </div>

//             <p className="mt-1 text-sm text-dark-600">
//               You are participating as{" "}
//               <span className="font-bold text-dark-800">
//                 {participant.name}
//               </span>
//               .
//             </p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
//           {canAddItems && isOpen && (
//             <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-primary-100 bg-primary-50 px-3.5 text-xs font-bold text-primary-600">
//               <ShoppingBag size={14} />
//               You can add items
//             </span>
//           )}

//           {canEditItems && isOpen && (
//             <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-primary-100 bg-primary-50 px-3.5 text-xs font-bold text-primary-600">
//               <Pencil size={14} />
//               You can edit your items
//             </span>
//           )}

//           {!isHost && (
//             <button
//               type="button"
//               onClick={handleLeave}
//               className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-bold text-dark-700 transition-all hover:border-danger/20 hover:bg-danger/5 hover:text-danger"
//             >
//               <LogOut size={16} />
//               Leave group
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Permission summary */}
//       {isOpen && (canAddItems || canEditItems) && (
//         <div className="mt-5 flex flex-wrap gap-2 border-t border-dark-100 pt-4">
//           {canAddItems && (
//             <div className="inline-flex items-center gap-1.5 text-xs font-medium text-dark-600">
//               <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success">
//                 <Check size={12} />
//               </span>
//               Add food
//             </div>
//           )}

//           {canEditItems && (
//             <div className="inline-flex items-center gap-1.5 text-xs font-medium text-dark-600">
//               <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success">
//                 <Check size={12} />
//               </span>
//               Edit your items
//             </div>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }

// export default GroupParticipantActions;

import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Check,
  LogOut,
  Pencil,
  ShoppingBag,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useGroupOrderContext } from "../../../context/GroupOrderContext";

function GroupParticipantActions({ groupOrder, participant, isHost }) {
  const { canAddItems, canEditItems, leaveGroup, isLeavingGroup } =
    useGroupOrderContext();

  const isOpen = groupOrder?.status === "open";

  const navigate = useNavigate();

  const handleLeave = async () => {
    if (isHost) {
      toast.error("The host cannot leave the group order.");
      return;
    }

    try {
      await leaveGroup();

      toast.success("You have left this group session.");

      navigate("/group-order");
    } catch (error) {
      // The mutation already handles the API error toast.
    }
  };

  if (!participant) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-soft">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary-50 blur-3xl" />

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
              <User size={21} strokeWidth={2.2} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-500">
                Your role
              </p>

              <h2 className="mt-1 truncate font-heading text-lg font-bold text-dark-900">
                {participant.name}
              </h2>
            </div>
          </div>

          {isHost ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-400/15 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-accent-600">
              <ShieldCheck size={12} />
              Host
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center rounded-full bg-dark-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-dark-500">
              Member
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mt-5 rounded-2xl border border-dark-100 bg-dark-50/60 p-4">
          <p className="text-xs leading-5 text-dark-500">
            {isHost
              ? "You created this group and can manage the group order."
              : "You are participating in this shared group order."}
          </p>
        </div>

        {/* Permissions */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-dark-800">
              Your permissions
            </h3>

            {isOpen && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-success">
                Active
              </span>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {/* Add items */}
            <div
              className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 ${
                canAddItems && isOpen
                  ? "border-primary-100 bg-primary-50/60"
                  : "border-dark-100 bg-dark-50/50"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  canAddItems && isOpen
                    ? "bg-white text-primary-500"
                    : "bg-dark-100 text-dark-400"
                }`}
              >
                <ShoppingBag size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-dark-800">Add food</p>

                <p className="mt-0.5 text-[11px] text-dark-500">
                  {canAddItems && isOpen
                    ? "You can add items to your order"
                    : "Currently unavailable"}
                </p>
              </div>

              {canAddItems && isOpen && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <Check size={13} />
                </div>
              )}
            </div>

            {/* Edit items */}
            <div
              className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 ${
                canEditItems && isOpen
                  ? "border-primary-100 bg-primary-50/60"
                  : "border-dark-100 bg-dark-50/50"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  canEditItems && isOpen
                    ? "bg-white text-primary-500"
                    : "bg-dark-100 text-dark-400"
                }`}
              >
                <Pencil size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-dark-800">
                  Edit your items
                </p>

                <p className="mt-0.5 text-[11px] text-dark-500">
                  {canEditItems && isOpen
                    ? "You can change your selections"
                    : "Currently unavailable"}
                </p>
              </div>

              {canEditItems && isOpen && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <Check size={13} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leave group */}
        {!isHost && (
          <div className="mt-5 border-t border-dark-100 pt-5">
            {/* <button
              type="button"
              onClick={handleLeave}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-bold text-dark-600 transition-all hover:border-danger/20 hover:bg-danger/5 hover:text-danger"
            >
              <LogOut size={16} />
              Leave group
            </button> */}

            <button
              type="button"
              onClick={handleLeave}
              disabled={isLeavingGroup}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-bold text-dark-600 transition-all hover:border-danger/20 hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={16} />
              {isLeavingGroup ? "Leaving group..." : "Leave group"}
            </button>
          </div>
        )}

        {/* Host notice */}
        {isHost && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-accent-400/20 bg-accent-400/5 p-3.5">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-accent-600"
            />

            <p className="text-xs leading-5 text-dark-600">
              As the host, you control the group order and can lock or manage it
              when everyone is ready.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default GroupParticipantActions;
