// import React, { useState } from "react";
// import { X, Users, Loader2, Clock3 } from "lucide-react";
// import { toast } from "react-hot-toast";

// import { useCurrentRestaurant } from "../hooks/useRestaurant";
// import { useCreateGroupOrder } from "../hooks/useGroupOrder";
// import { saveGroupParticipant } from "../utils/groupOrderStorage";

// function CreateGroupOrderModal({ open, onClose, onCreated }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [expiresAt, setExpiresAt] = useState("");

//   const {
//     data: restaurantData,
//     isLoading: isLoadingRestaurant,
//     isError: isRestaurantError,
//   } = useCurrentRestaurant({
//     enabled: open,
//   });

//   const createGroupMutation = useCreateGroupOrder();

//   const restaurant =
//     restaurantData?.data?.restaurant ||
//     restaurantData?.restaurant ||
//     null;

//   if (!open) {
//     return null;
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!restaurant?._id) {
//       toast.error("Unable to load Resvill restaurant information.");
//       return;
//     }

//     if (!name.trim()) {
//       toast.error("Please enter your name.");
//       return;
//     }

//     try {
//       const response = await createGroupMutation.mutateAsync({
//         restaurant: restaurant._id,
//         name: name.trim(),
//         ...(email.trim() ? { email: email.trim() } : {}),
//         ...(phone.trim() ? { phone: phone.trim() } : {}),
//         ...(expiresAt ? { expiresAt } : {}),
//       });

//       const groupOrder =
//         response?.data?.groupOrder ||
//         response?.groupOrder;

//       const participant =
//         response?.data?.participant ||
//         response?.participant;

//       if (!groupOrder || !participant) {
//         throw new Error("Invalid group order response.");
//       }

//       const participantId =
//         participant._id ||
//         participant.id ||
//         participant.participantId;

//       const participantToken =
//         participant.participantToken;

//       if (!participantId || !participantToken) {
//         throw new Error(
//           "Participant credentials were not returned."
//         );
//       }

//       saveGroupParticipant({
//         groupCode:
//           groupOrder.groupCode ||
//           groupOrder.code,
//         groupOrderId:
//           groupOrder._id ||
//           groupOrder.id,
//         participantId,
//         participantToken,
//       });

//       toast.success(
//         "Group order created successfully."
//       );

//       onCreated?.({
//         groupOrder,
//         participant,
//       });

//       setName("");
//       setEmail("");
//       setPhone("");
//       setExpiresAt("");

//       onClose?.();
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to create group order."
//       );
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-950/60 px-4 py-6 backdrop-blur-sm">
//       <div
//         className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="create-group-order-title"
//       >
//         {/* Header */}
//         <div className="flex items-start justify-between border-b border-dark-100 px-6 py-5">
//           <div>
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
//                 <Users size={20} />
//               </div>

//               <div>
//                 <h2
//                   id="create-group-order-title"
//                   className="font-heading text-xl font-extrabold text-dark-950"
//                 >
//                   Create Group Order
//                 </h2>

//                 <p className="mt-1 text-xs text-dark-400">
//                   Start a shared Resvill order.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             disabled={createGroupMutation.isPending}
//             className="rounded-xl p-2 text-dark-400 transition hover:bg-dark-50 hover:text-dark-700 disabled:opacity-50"
//             aria-label="Close"
//           >
//             <X size={19} />
//           </button>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="max-h-[80vh] overflow-y-auto px-6 py-6"
//         >
//           {isRestaurantError && (
//             <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
//               We couldn't load Resvill's restaurant
//               information. Please try again.
//             </div>
//           )}

//           <div className="space-y-5">
//             {/* Your name */}
//             <div>
//               <label
//                 htmlFor="group-name"
//                 className="text-sm font-bold text-dark-700"
//               >
//                 Your name
//               </label>

//               <input
//                 id="group-name"
//                 type="text"
//                 value={name}
//                 onChange={(event) =>
//                   setName(event.target.value)
//                 }
//                 placeholder="Enter your name"
//                 maxLength={100}
//                 disabled={createGroupMutation.isPending}
//                 className="mt-2 h-12 w-full rounded-xl border border-dark-200 px-4 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:bg-dark-50"
//               />
//             </div>

//             {/* Email + phone */}
//             <div className="grid gap-5 sm:grid-cols-2">
//               <div>
//                 <label
//                   htmlFor="group-email"
//                   className="text-sm font-bold text-dark-700"
//                 >
//                   Email
//                   <span className="ml-1 text-xs font-normal text-dark-400">
//                     optional
//                   </span>
//                 </label>

//                 <input
//                   id="group-email"
//                   type="email"
//                   value={email}
//                   onChange={(event) =>
//                     setEmail(event.target.value)
//                   }
//                   placeholder="you@example.com"
//                   disabled={createGroupMutation.isPending}
//                   className="mt-2 h-12 w-full rounded-xl border border-dark-200 px-4 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:bg-dark-50"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="group-phone"
//                   className="text-sm font-bold text-dark-700"
//                 >
//                   Phone
//                   <span className="ml-1 text-xs font-normal text-dark-400">
//                     optional
//                   </span>
//                 </label>

//                 <input
//                   id="group-phone"
//                   type="tel"
//                   value={phone}
//                   onChange={(event) =>
//                     setPhone(event.target.value)
//                   }
//                   placeholder="080..."
//                   disabled={createGroupMutation.isPending}
//                   className="mt-2 h-12 w-full rounded-xl border border-dark-200 px-4 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:bg-dark-50"
//                 />
//               </div>
//             </div>

//             {/* Expiration */}
//             <div>
//               <label
//                 htmlFor="group-expires"
//                 className="text-sm font-bold text-dark-700"
//               >
//                 Group expiration
//                 <span className="ml-1 text-xs font-normal text-dark-400">
//                   optional
//                 </span>
//               </label>

//               <div className="relative mt-2">
//                 <Clock3
//                   size={17}
//                   className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
//                 />

//                 <input
//                   id="group-expires"
//                   type="datetime-local"
//                   value={expiresAt}
//                   onChange={(event) =>
//                     setExpiresAt(event.target.value)
//                   }
//                   disabled={createGroupMutation.isPending}
//                   className="h-12 w-full rounded-xl border border-dark-200 pl-11 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:bg-dark-50"
//                 />
//               </div>

//               <p className="mt-2 text-xs leading-5 text-dark-400">
//                 Leave this empty to let the backend use
//                 its default group expiration.
//               </p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={createGroupMutation.isPending}
//               className="rounded-xl border border-dark-200 px-5 py-3 text-sm font-bold text-dark-700 transition hover:bg-dark-50 disabled:opacity-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={
//                 createGroupMutation.isPending ||
//                 isLoadingRestaurant ||
//                 !restaurant?._id
//               }
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {createGroupMutation.isPending && (
//                 <Loader2
//                   size={17}
//                   className="animate-spin"
//                 />
//               )}

//               {isLoadingRestaurant
//                 ? "Loading Resvill..."
//                 : createGroupMutation.isPending
//                   ? "Creating..."
//                   : "Create Group Order"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateGroupOrderModal;

import React, { useEffect, useState } from "react";
import {
  X,
  Users,
  Loader2,
  Clock3,
  Mail,
  Phone,
  User,
  Sparkles,
  ArrowRight,
  Utensils,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useCurrentRestaurant } from "../../hooks/useRestaurant";
import { useCreateGroupOrder } from "../../hooks/useGroupOrder";
import { saveGroupParticipant } from "../../utils/groupOrderStorage";

function CreateGroupOrderModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const {
    data: restaurantData,
    isLoading: isLoadingRestaurant,
    isError: isRestaurantError,
  } = useCurrentRestaurant({ enabled: open });

  const createGroupMutation = useCreateGroupOrder();

  // const restaurant = restaurantData?.data || restaurantData?.restaurant || null;

  const restaurant = restaurantData || null;
  
  if (!open) return null;

  const isSubmitting = createGroupMutation.isPending;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!restaurant?._id) {
      toast.error("Unable to load Resvill restaurant information.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      const response = await createGroupMutation.mutateAsync({
        restaurant: restaurant._id,
        name: name.trim(),
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        ...(expiresAt ? { expiresAt } : {}),
      });

      const groupOrder = response?.data?.groupOrder || response?.groupOrder;

      const participant = response?.data?.participant || response?.participant;

      if (!groupOrder || !participant) {
        throw new Error("Invalid group order response.");
      }

      const participantId =
        participant._id || participant.id || participant.participantId;

      const participantToken = participant.participantToken;

      if (!participantId || !participantToken) {
        throw new Error("Participant credentials were not returned.");
      }

      saveGroupParticipant({
        groupCode: groupOrder.groupCode || groupOrder.code,
        groupOrderId: groupOrder._id || groupOrder.id,
        participantId,
        participantToken,
      });

      toast.success("Group order created successfully.");

      onCreated?.({
        groupOrder,
        participant,
      });

      setName("");
      setEmail("");
      setPhone("");
      setExpiresAt("");

      onClose?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create group order.",
      );
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-dark-950/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-group-order-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-card"
      >
        <div className="grid min-h-[520px] lg:grid-cols-[0.9fr_1.35fr]">
          {/* =====================================================
              LEFT — VISUAL PANEL
          ====================================================== */}
          <div className="relative hidden overflow-hidden bg-primary-50 lg:flex">
            {/* Decorative circles */}
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary-100" />

            <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-accent-400/15" />

            <div className="absolute right-12 top-16 h-3 w-3 rounded-full bg-accent-500" />

            <div className="absolute bottom-24 left-14 h-2.5 w-2.5 rounded-full bg-primary-300" />

            <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-12">
              {/* Top */}
              <div>
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-600 shadow-soft">
                  <Sparkles className="h-3.5 w-3.5" />
                  Group Ordering
                </div>

                <h2
                  id="create-group-order-title"
                  className="max-w-sm font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-dark-950 xl:text-5xl"
                >
                  Good food is better{" "}
                  <span className="text-primary-500">together.</span>
                </h2>

                <p className="mt-5 max-w-sm text-sm leading-7 text-dark-600">
                  Create a shared order and invite your friends, family,
                  colleagues, or anyone you're enjoying a meal with.
                </p>
              </div>

              {/* Group visual */}
              <div className="relative mt-10">
                {/* Main preview */}
                <div className="rounded-3xl border border-white bg-white p-5 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
                        Your group
                      </p>

                      <p className="mt-1 font-heading text-lg font-bold text-dark-900">
                        Dinner Crew
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center">
                    <div className="flex -space-x-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-xs font-bold text-primary-600">
                        A
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent-400 text-xs font-bold text-white">
                        M
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-dark-100 text-xs font-bold text-dark-600">
                        J
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-xs font-bold text-white">
                        +
                      </div>
                    </div>

                    <div className="ml-4">
                      <p className="text-xs font-bold text-dark-700">
                        Everyone can add
                      </p>

                      <p className="text-[11px] text-dark-400">
                        their own meal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating status */}
                <div className="absolute -right-3 -top-5 rounded-2xl border border-dark-100 bg-white px-4 py-3 shadow-card xl:-right-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-400/15 text-accent-600">
                      <Utensils className="h-3.5 w-3.5" />
                    </span>

                    <div>
                      <p className="text-[10px] font-bold text-dark-800">
                        Group ready
                      </p>
                      <p className="text-[9px] text-dark-400">4 participants</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom reassurance */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary-500 shadow-soft">
                  <Users className="h-4 w-4" />
                </div>

                <p className="text-xs font-semibold leading-5 text-dark-600">
                  One order.
                  <br />
                  Everyone chooses.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT — FORM
          ====================================================== */}
          <div className="relative flex flex-col">
            {/* Mobile header */}
            <div className="relative bg-primary-50 px-6 py-7 lg:hidden">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                aria-label="Close modal"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-dark-200 bg-white text-dark-600 shadow-soft hover:text-primary-500 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-hover">
                <Users className="h-6 w-6" />
              </div>

              <h2 className="mt-4 font-heading text-2xl font-extrabold text-dark-950">
                Create a group order
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-dark-600">
                Order together with friends, family, or your team.
              </p>
            </div>

            {/* Desktop close */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="Close modal"
              className="absolute right-6 top-6 z-20 hidden h-10 w-10 items-center justify-center rounded-full border border-dark-200 bg-white text-dark-600 shadow-soft transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500 disabled:opacity-50 lg:flex"
            >
              <X className="h-5 w-5" />
            </button>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <div className="flex-1 px-6 py-7 sm:px-8 lg:px-10 lg:py-10">
                <div className="mb-7 hidden lg:block">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-500">
                    Start your order
                  </p>

                  <h3 className="mt-2 font-heading text-2xl font-extrabold text-dark-950">
                    Tell us about you
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-dark-500">
                    We'll use this information to create your group and identify
                    you as the host.
                  </p>
                </div>

                {/* Host notice */}
                <div className="mb-6 flex gap-3 rounded-2xl bg-dark-50 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-500 shadow-soft">
                    <User className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-dark-800">
                      You're the group host
                    </p>

                    <p className="mt-1 text-xs leading-5 text-dark-500">
                      A unique group code will be generated after creation.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="group-order-name"
                      className="mb-2 block text-sm font-bold text-dark-800"
                    >
                      Your name
                      <span className="ml-1 text-primary-500">*</span>
                    </label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />

                      <input
                        id="group-order-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your name"
                        autoComplete="name"
                        disabled={isSubmitting}
                        className="h-12 w-full rounded-xl border border-dark-200 bg-white pl-11 pr-4 text-sm text-dark-900 outline-none transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
                      />
                    </div>
                  </div>

                  {/* Email / Phone */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="group-order-email"
                        className="mb-2 block text-sm font-bold text-dark-800"
                      >
                        Email
                        <span className="ml-2 text-[11px] font-medium text-dark-400">
                          Optional
                        </span>
                      </label>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />

                        <input
                          id="group-order-email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          disabled={isSubmitting}
                          className="h-12 w-full rounded-xl border border-dark-200 bg-white pl-11 pr-4 text-sm text-dark-900 outline-none transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="group-order-phone"
                        className="mb-2 block text-sm font-bold text-dark-800"
                      >
                        Phone
                        <span className="ml-2 text-[11px] font-medium text-dark-400">
                          Optional
                        </span>
                      </label>

                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />

                        <input
                          id="group-order-phone"
                          type="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="08012345678"
                          autoComplete="tel"
                          disabled={isSubmitting}
                          className="h-12 w-full rounded-xl border border-dark-200 bg-white pl-11 pr-4 text-sm text-dark-900 outline-none transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expiration */}
                  <div>
                    <label
                      htmlFor="group-order-expires"
                      className="mb-2 block text-sm font-bold text-dark-800"
                    >
                      Group expiration
                      <span className="ml-2 text-[11px] font-medium text-dark-400">
                        Optional
                      </span>
                    </label>

                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />

                      <input
                        id="group-order-expires"
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(event) => setExpiresAt(event.target.value)}
                        disabled={isSubmitting}
                        className="h-12 w-full rounded-xl border border-dark-200 bg-white pl-11 pr-4 text-sm text-dark-900 outline-none transition-all hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
                      />
                    </div>

                    <p className="mt-2 text-xs text-dark-400">
                      Leave empty if you don't want an expiration.
                    </p>
                  </div>

                  {isLoadingRestaurant && (
                    <div className="flex items-center gap-3 rounded-xl bg-dark-50 px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-primary-500" />

                      <span className="text-xs font-medium text-dark-600">
                        Preparing your group order...
                      </span>
                    </div>
                  )}

                  {isRestaurantError && (
                    <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3">
                      <p className="text-xs font-semibold text-danger">
                        We couldn't load the restaurant information. Please try
                        again.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-dark-100 bg-dark-50/50 px-6 py-5 sm:px-8 lg:px-10">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="h-12 rounded-xl border border-dark-200 bg-white px-6 text-sm font-bold text-dark-700 transition-all hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || isLoadingRestaurant || !restaurant?._id
                    }
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-7 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating group...
                      </>
                    ) : (
                      <>
                        Create group
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupOrderModal;
