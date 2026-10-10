// import { useEffect, useRef } from "react";

// import {
//   GroupOrderProvider,
//   useGroupOrderContext,
// } from "../../context/GroupOrderContext";

// import GroupHeader from "./information/GroupHeader";
// import GroupStatus from "./information/GroupStatus";
// import GroupInvite from "./information/GroupInvite";
// import GroupParticipants from "./information/GroupParticipants";
// import GroupParticipantActions from "./host/GroupParticipantAction";

// import GroupFoodSelector from "./ordering/GroupFoodSelector";
// import GroupParticipantCart from "./ordering/GroupParticipantCart";
// import GroupOrderSummary from "./summary/GroupOrderSummary";

// import GroupHostControls from "./host/GroupHostControls";
// import GroupCheckout from "./checkout/GroupCheckout";
// import GroupOrderPayment from "./payment/GroupOrderPayment";

// function GroupOrderContent() {
//   const {
//     groupOrder,
//     currentParticipant,
//     isHost,
//     isParticipant,
//     isLoading,
//     isError,
//     error,
//     validateSession,
//     isValidatingSession,
//     sessionInvalid,
//   } = useGroupOrderContext();

//   const hasValidated = useRef(false);

//   useEffect(() => {
//     if (hasValidated.current) {
//       return;
//     }

//     hasValidated.current = true;

//     validateSession();
//   }, [validateSession]);

//   if (isLoading || isValidatingSession) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center px-4">
//         <p className="text-sm text-gray-500">
//           Loading group order...
//         </p>
//       </div>
//     );
//   }

//   if (sessionInvalid) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center px-4">
//         <div className="max-w-md text-center">
//           <h2 className="text-xl font-bold text-gray-900">
//             Group session expired
//           </h2>

//           <p className="mt-2 text-sm text-gray-500">
//             Your access to this group is no longer valid.
//             Please join the group again using the group
//             code or invitation link.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center px-4">
//         <p className="text-sm text-red-500">
//           {error?.response?.data?.message ||
//             "Unable to load this group order."}
//         </p>
//       </div>
//     );
//   }

//   if (!groupOrder) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center px-4">
//         <p className="text-sm text-gray-500">
//           Group order not found.
//         </p>
//       </div>
//     );
//   }

//   if (!isParticipant || !currentParticipant) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center px-4">
//         <p className="text-sm text-gray-500">
//           You do not have access to this group order.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 px-4 py-8">
//       <div className="mx-auto max-w-7xl space-y-6">
//         <GroupHeader groupOrder={groupOrder} />

//         <GroupStatus status={groupOrder.status} />

//         <GroupInvite groupOrder={groupOrder} />

//         <GroupParticipants
//           groupOrder={groupOrder}
//         />

//         <GroupParticipantActions
//           groupOrder={groupOrder}
//           participant={currentParticipant}
//           isHost={isHost}
//         />

//         <GroupFoodSelector />

//         <GroupParticipantCart />

//         <GroupOrderSummary />

//         {isHost && (
//           <GroupHostControls />
//         )}

//         <GroupCheckout />

//         <GroupOrderPayment />
//       </div>
//     </main>
//   );
// }

// function GroupOrderWorkspace() {
//   return (
//     <GroupOrderProvider>
//       <GroupOrderContent />
//     </GroupOrderProvider>
//   );
// }

// export default GroupOrderWorkspace;

import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import {
  GroupOrderProvider,
  useGroupOrderContext,
} from "../../context/GroupOrderContext";

import GroupHeader from "./information/GroupHeader";
import GroupStatus from "./information/GroupStatus";
import GroupInvite from "./information/GroupInvite";
import GroupParticipants from "./information/GroupParticipants";
import GroupParticipantActions from "./host/GroupParticipantAction";

import GroupFoodSelector from "./ordering/GroupFoodSelector";
import GroupParticipantCart from "./ordering/GroupParticipantCart";
import GroupOrderSummary from "./summary/GroupOrderSummary";

import GroupHostControls from "./host/GroupHostControls";
import GroupCheckout from "./checkout/GroupCheckout";
import GroupOrderPayment from "./payment/GroupOrderPayment";

function GroupOrderContent() {
  const {
    groupOrder,
    currentParticipant,
    isHost,
    isParticipant,
    isLoading,
    isError,
    error,
    validateSession,
    isValidatingSession,
    sessionInvalid,
  } = useGroupOrderContext();

  const hasValidated = useRef(false);

  useEffect(() => {
    if (hasValidated.current) {
      return;
    }

    hasValidated.current = true;

    validateSession();
  }, [validateSession]);

  if (isLoading || isValidatingSession) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />

          <p className="mt-4 text-sm font-medium text-dark-500">
            Loading group order...
          </p>
        </div>
      </div>
    );
  }

  if (sessionInvalid) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-dark-100 bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
            <span className="text-xl font-bold">!</span>
          </div>

          <h2 className="mt-5 font-heading text-xl font-bold text-dark-900">
            Group session expired
          </h2>

          <p className="mt-2 text-sm leading-6 text-dark-500">
            Your access to this group is no longer valid. Please join the group
            again using the group code or invitation link.
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-danger/20 bg-white p-8 text-center shadow-card">
          <h2 className="font-heading text-xl font-bold text-dark-900">
            Unable to load group order
          </h2>

          <p className="mt-2 text-sm leading-6 text-danger">
            {error?.response?.data?.message ||
              "Unable to load this group order."}
          </p>
        </div>
      </div>
    );
  }

  if (!groupOrder) {
    return (
      <div className="relative flex min-h-[65vh] items-center justify-center overflow-hidden px-4 py-12">
        {/* Background decoration */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-50 blur-3xl" />

        <div className="relative w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card">
            {/* Top accent */}
            <div className="h-1.5 bg-primary-500" />

            <div className="p-8 text-center sm:p-10">
              {/* Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-9 w-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75 14.25 14.25M14.25 9.75 9.75 14.25"
                  />
                  <circle cx="12" cy="12" r="8.75" />
                </svg>
              </div>

              {/* Label */}
              <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-500">
                Group order
              </p>

              {/* Heading */}
              <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-dark-900 sm:text-3xl">
                Group order not found
              </h2>

              {/* Description */}
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-dark-500">
                We couldn&apos;t find the group order you&apos;re looking for.
                It may have expired, been cancelled, or the link may no longer
                be valid.
              </p>

              {/* Divider */}
              <div className="my-7 h-px bg-dark-100" />

              {/* Info */}
              <div className="rounded-2xl border border-dark-100 bg-dark-50 p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-dark-600 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" d="M12 10.5v5" />
                      <path strokeLinecap="round" d="M12 7.5h.01" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-dark-800">
                      What can you do?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-dark-500">
                      Check your group invitation or ask the host to send you a
                      new group-order link.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isParticipant || !currentParticipant) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-dark-100 bg-white p-8 text-center shadow-card">
          <h2 className="font-heading text-xl font-bold text-dark-900">
            Access required
          </h2>

          <p className="mt-2 text-sm leading-6 text-dark-500">
            You do not have access to this group order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-dark-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* =====================================================
            TOP — GROUP OVERVIEW
        ====================================================== */}

        <div className="space-y-5">
          <GroupHeader groupOrder={groupOrder} />

          <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
            <GroupStatus status={groupOrder.status} />

            <GroupInvite groupOrder={groupOrder} />
          </div>
        </div>

        {/* =====================================================
            PEOPLE — PARTICIPANTS + CURRENT USER
        ====================================================== */}

        <section className="mt-6">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">
              Group
            </p>

            <h2 className="mt-1 font-heading text-xl font-bold text-dark-900">
              Who's ordering?
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <GroupParticipants groupOrder={groupOrder} />

            <GroupParticipantActions
              groupOrder={groupOrder}
              participant={currentParticipant}
              isHost={isHost}
            />
          </div>
        </section>

        {/* =====================================================
            MAIN ORDERING AREA
        ====================================================== */}

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">
              Build your order
            </p>

            <h2 className="mt-1 font-heading text-2xl font-extrabold text-dark-900 sm:text-3xl">
              Choose your food
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
              Browse the menu and add your items to the shared group order.
            </p>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.8fr)]">
            {/* FOOD */}
            <div className="min-w-0">
              <GroupFoodSelector />
            </div>

            {/* CART */}
            <aside className="min-w-0 xl:sticky xl:top-6">
              <GroupParticipantCart />
            </aside>
          </div>
        </section>

        {/* =====================================================
            SUMMARY + HOST CONTROLS
        ====================================================== */}

        <section className="mt-8">
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <GroupOrderSummary />

            {isHost && <GroupHostControls />}
          </div>
        </section>

        {/* =====================================================
            CHECKOUT
        ====================================================== */}

        <section className="mt-8">
          <GroupCheckout />
        </section>

        {/* =====================================================
            PAYMENT
        ====================================================== */}

        <section className="mt-6 pb-10">
          <GroupOrderPayment />
        </section>
      </div>
    </main>
  );
}

// function GroupOrderWorkspace() {
//   return (
//     <GroupOrderProvider>
//       <GroupOrderContent />
//     </GroupOrderProvider>
//   );
// }


function GroupOrderWorkspace() {
  const { groupCode } = useParams();

  return (
    <GroupOrderProvider groupCode={groupCode}>
      <GroupOrderContent />
    </GroupOrderProvider>
  );
}

export default GroupOrderWorkspace;
