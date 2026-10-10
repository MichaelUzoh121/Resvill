// import React, { useEffect, useState } from "react";
// import {
//   X,
//   Users,
//   Loader2,
//   Mail,
//   Phone,
//   User,
//   ArrowRight,
//   LogIn,
// } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// import { useJoinGroupOrder } from "../../hooks/useGroupOrder";
// import { saveGroupParticipant } from "../../utils/groupOrderStorage";

// function JoinGroupModal({ open, onClose, onJoined }) {
//   const navigate = useNavigate();

//   const [groupCode, setGroupCode] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");

//   const joinGroupMutation = useJoinGroupOrder();

//   useEffect(() => {
//     if (!open) return;

//     const originalOverflow = document.body.style.overflow;

//     document.body.style.overflow = "hidden";

//     return () => {
//       document.body.style.overflow = originalOverflow;
//     };
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;

//     setGroupCode("");
//     setName("");
//     setEmail("");
//     setPhone("");
//   }, [open]);

//   if (!open) return null;

//   const isSubmitting = joinGroupMutation.isPending;

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (isSubmitting) return;

//     const normalizedCode = groupCode.trim().toUpperCase();

//     if (!normalizedCode) {
//       toast.error("Please enter the group code.");
//       return;
//     }

//     if (!name.trim()) {
//       toast.error("Please enter your name.");
//       return;
//     }

//     try {
//       const response = await joinGroupMutation.mutateAsync({
//         groupCode: normalizedCode,
//         name: name.trim(),
//         ...(email.trim() ? { email: email.trim() } : {}),
//         ...(phone.trim() ? { phone: phone.trim() } : {}),
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
//           "Participant credentials were not returned.",
//         );
//       }

//       const savedParticipant = saveGroupParticipant({
//         groupCode:
//           groupOrder.groupCode ||
//           normalizedCode,
//         groupOrderId:
//           groupOrder._id ||
//           groupOrder.id,
//         participantId,
//         participantToken,
//       });

//       toast.success("You joined the group order.");

//       onJoined?.({
//         groupOrder,
//         participant,
//       });

//       onClose?.();

//       navigate(
//         `/group-order/${savedParticipant.groupCode}`,
//       );
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to join group order.",
//       );
//     }
//   };

//   const handleClose = () => {
//     if (isSubmitting) return;

//     onClose?.();
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-950/60 px-4 py-6 backdrop-blur-sm">
//       <div
//         className="absolute inset-0"
//         onClick={handleClose}
//       />

//       <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
//         <div className="flex items-start justify-between border-b border-dark-100 px-6 py-5">
//           <div className="flex items-start gap-3">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50">
//               <Users
//                 size={20}
//                 className="text-primary-600"
//               />
//             </div>

//             <div>
//               <h2 className="text-xl font-extrabold text-dark-950">
//                 Join a Group Order
//               </h2>

//               <p className="mt-1 text-sm text-dark-500">
//                 Enter the invite code and your details
//                 to join.
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={isSubmitting}
//             className="flex h-9 w-9 items-center justify-center rounded-xl text-dark-400 transition hover:bg-dark-50 hover:text-dark-700 disabled:cursor-not-allowed disabled:opacity-50"
//             aria-label="Close"
//           >
//             <X size={19} />
//           </button>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5 px-6 py-6"
//         >
//           <div>
//             <label
//               htmlFor="group-code"
//               className="mb-2 block text-sm font-bold text-dark-800"
//             >
//               Group Code
//             </label>

//             <div className="relative">
//               <LogIn
//                 size={17}
//                 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
//               />

//               <input
//                 id="group-code"
//                 type="text"
//                 value={groupCode}
//                 onChange={(event) =>
//                   setGroupCode(
//                     event.target.value.toUpperCase(),
//                   )
//                 }
//                 placeholder="e.g. RV-ABCD"
//                 maxLength={7}
//                 autoComplete="off"
//                 className="w-full rounded-xl border border-dark-200 bg-white py-3 pl-11 pr-4 text-sm font-bold uppercase tracking-wider text-dark-950 outline-none transition placeholder:font-medium placeholder:tracking-normal placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="join-name"
//               className="mb-2 block text-sm font-bold text-dark-800"
//             >
//               Your Name
//             </label>

//             <div className="relative">
//               <User
//                 size={17}
//                 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
//               />

//               <input
//                 id="join-name"
//                 type="text"
//                 value={name}
//                 onChange={(event) =>
//                   setName(event.target.value)
//                 }
//                 placeholder="Enter your name"
//                 autoComplete="name"
//                 className="w-full rounded-xl border border-dark-200 bg-white py-3 pl-11 pr-4 text-sm text-dark-950 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="join-email"
//               className="mb-2 block text-sm font-bold text-dark-800"
//             >
//               Email
//               <span className="ml-1 text-xs font-medium text-dark-400">
//                 (optional)
//               </span>
//             </label>

//             <div className="relative">
//               <Mail
//                 size={17}
//                 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
//               />

//               <input
//                 id="join-email"
//                 type="email"
//                 value={email}
//                 onChange={(event) =>
//                   setEmail(event.target.value)
//                 }
//                 placeholder="you@example.com"
//                 autoComplete="email"
//                 className="w-full rounded-xl border border-dark-200 bg-white py-3 pl-11 pr-4 text-sm text-dark-950 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="join-phone"
//               className="mb-2 block text-sm font-bold text-dark-800"
//             >
//               Phone
//               <span className="ml-1 text-xs font-medium text-dark-400">
//                 (optional)
//               </span>
//             </label>

//             <div className="relative">
//               <Phone
//                 size={17}
//                 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
//               />

//               <input
//                 id="join-phone"
//                 type="tel"
//                 value={phone}
//                 onChange={(event) =>
//                   setPhone(event.target.value)
//                 }
//                 placeholder="08012345678"
//                 autoComplete="tel"
//                 className="w-full rounded-xl border border-dark-200 bg-white py-3 pl-11 pr-4 text-sm text-dark-950 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2
//                   size={18}
//                   className="animate-spin"
//                 />
//                 Joining Group...
//               </>
//             ) : (
//               <>
//                 Join Group Order
//                 <ArrowRight size={18} />
//               </>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default JoinGroupModal;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  X,
  Users,
  Loader2,
  Mail,
  Phone,
  User,
  ArrowRight,
  LogIn,
  Sparkles,
  Utensils,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useJoinGroupOrder } from "../../hooks/useGroupOrder";
import { saveGroupParticipant } from "../../utils/groupOrderStorage";

function JoinGroupModal({ open, onClose, onJoined, initialGroupCode = "" }) {
  const { groupCode: urlGroupCode } = useParams();
  const navigate = useNavigate();

  const [groupCode, setGroupCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const joinGroupMutation = useJoinGroupOrder();

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  //   useEffect(() => {
  //     if (!open) return;

  //     setGroupCode(initialGroupCode.trim().toUpperCase());
  //     setName("");
  //     setEmail("");
  //     setPhone("");
  //   }, [open, initialGroupCode]);

  // useEffect(() => {
  //     if (!open) return;

  //     const codeFromUrl = urlGroupCode?.trim().toUpperCase();
  //     const codeFromProp = initialGroupCode?.trim().toUpperCase();

  //     setGroupCode(codeFromUrl || codeFromProp || "");
  //     setName("");
  //     setEmail("");
  //     setPhone("");
  // }, [open, initialGroupCode, urlGroupCode]);

  useEffect(() => {
    if (!open) return;

    const codeFromUrl = urlGroupCode?.trim().toUpperCase();
    const codeFromProp = initialGroupCode?.trim().toUpperCase();

    setGroupCode(codeFromUrl || codeFromProp || "");
    setName("");
    setEmail("");
    setPhone("");
  }, [open, initialGroupCode, urlGroupCode]);

  if (!open) return null;

  const isSubmitting = joinGroupMutation.isPending;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedCode = groupCode.trim().toUpperCase();

    if (!normalizedCode) {
      toast.error("Please enter the group code.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      const response = await joinGroupMutation.mutateAsync({
        groupCode: normalizedCode,
        name: name.trim(),
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(phone.trim() ? { phone: phone.trim() } : {}),
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

      const savedParticipant = saveGroupParticipant({
        groupCode: groupOrder.groupCode || normalizedCode,
        groupOrderId: groupOrder._id || groupOrder.id,
        participantId,
        participantToken,
      });

      toast.success("You joined the group order.");

      onJoined?.({
        groupOrder,
        participant,
      });

      onClose?.();

      navigate(`/group-order/${savedParticipant.groupCode}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to join group order.",
      );
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center overflow-hidden bg-dark-950/60 px-4 py-4 backdrop-blur-sm sm:px-6"
      onMouseDown={handleClose}
    >
      <div className="absolute inset-0" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-group-order-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-card sm:max-h-[calc(100vh-3rem)]"
      >
        {/* =====================================================
                LEFT VISUAL PANEL
            ====================================================== */}
        <div className="relative hidden min-h-0 flex-1 overflow-hidden bg-primary-50 lg:flex lg:w-[42%] lg:flex-col">
          {/* Decorative circles */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-200/40 blur-3xl" />

          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />

          <div className="absolute right-10 top-16 h-24 w-24 rounded-full bg-primary-100/70" />

          <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-10">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-2 text-xs font-extrabold uppercase tracking-wide text-primary-600 shadow-soft">
                <Users size={14} />
                Group Ordering
              </div>

              <h2 className="max-w-md font-heading text-3xl font-extrabold leading-tight tracking-tight text-dark-950 xl:text-4xl">
                Food tastes better
                <span className="block text-primary-500">when shared.</span>
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-dark-600">
                Join your friends, family or colleagues and build one group
                order together.
              </p>
            </div>

            {/* Group preview */}
            <div className="relative mt-8">
              <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                      Group Order
                    </p>

                    <p className="mt-1 font-heading text-lg font-extrabold text-dark-950">
                      Friday Food Crew
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                    <Utensils size={20} />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-xs font-extrabold text-primary-600">
                      A
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent-400/30 text-xs font-extrabold text-dark-800">
                      M
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-dark-100 text-xs font-extrabold text-dark-600">
                      J
                    </div>
                  </div>

                  <span className="ml-2 text-xs font-semibold text-dark-500">
                    3 people already joined
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-dark-50 px-4 py-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-dark-400">
                      Invite Code
                    </p>

                    <p className="mt-0.5 font-heading text-sm font-extrabold tracking-widest text-dark-900">
                      RV-ABCD
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary-500 px-3 py-2 text-[11px] font-extrabold text-white">
                    JOIN
                  </div>
                </div>
              </div>

              {/* Floating status card */}
              <div className="absolute -bottom-5 -right-5 rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-card">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                    <Sparkles size={15} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-dark-400">
                      Group ready
                    </p>

                    <p className="text-xs font-extrabold text-dark-900">
                      Add your order
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-xs font-medium leading-5 text-dark-500">
              Enter the invite code shared by the group host to get started.
            </p>
          </div>
        </div>

        {/* =====================================================
                RIGHT FORM PANEL
            ====================================================== */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="flex items-start justify-between border-b border-dark-100 px-5 py-5 lg:hidden">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                <Users size={20} />
              </div>

              <div>
                <h2
                  id="join-group-order-title"
                  className="font-heading text-lg font-extrabold text-dark-950"
                >
                  Join a Group Order
                </h2>

                <p className="mt-1 text-xs leading-5 text-dark-500">
                  Enter the invite code and your details to join.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-dark-400 transition hover:bg-dark-50 hover:text-dark-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X size={19} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="p-6 sm:p-7 lg:p-9 xl:p-10">
              {/* Desktop heading */}
              <div className="hidden lg:block">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary-500">
                      Join the table
                    </p>

                    <h2
                      id="join-group-order-title"
                      className="font-heading text-3xl font-extrabold tracking-tight text-dark-950"
                    >
                      Join a Group Order
                    </h2>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-dark-500">
                      Enter the invite code shared by your host, then add your
                      details to join the group.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-dark-400 transition hover:bg-dark-50 hover:text-dark-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Host notice */}
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-500 shadow-soft">
                  <LogIn size={17} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-dark-900">
                    Have an invite code?
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-dark-500">
                    Enter the exact code your group host shared with you.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Group Code */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="group-code"
                      className="mb-2 block text-sm font-bold text-dark-800"
                    >
                      Group Code
                    </label>

                    <div className="relative">
                      <LogIn
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-500"
                      />

                      <input
                        id="group-code"
                        type="text"
                        value={groupCode}
                        onChange={(event) =>
                          setGroupCode(event.target.value.toUpperCase())
                        }
                        placeholder="e.g. RV-ABCD"
                        maxLength={7}
                        autoComplete="off"
                        autoFocus
                        className="w-full rounded-xl border border-dark-200 bg-white py-3.5 pl-11 pr-4 text-sm font-extrabold uppercase tracking-widest text-dark-950 outline-none transition placeholder:font-medium placeholder:tracking-normal placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="join-name"
                      className="mb-2 block text-sm font-bold text-dark-800"
                    >
                      Your Name
                    </label>

                    <div className="relative">
                      <User
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                      />

                      <input
                        id="join-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your name"
                        autoComplete="name"
                        className="w-full rounded-xl border border-dark-200 bg-white py-3.5 pl-11 pr-4 text-sm text-dark-950 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="join-email"
                      className="mb-2 block text-sm font-bold text-dark-800"
                    >
                      Email
                      <span className="ml-1 text-xs font-medium text-dark-400">
                        (optional)
                      </span>
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                      />

                      <input
                        id="join-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full rounded-xl border border-dark-200 bg-white py-3.5 pl-11 pr-4 text-sm text-dark-950 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="join-phone"
                      className="mb-2 block text-sm font-bold text-dark-800"
                    >
                      Phone
                      <span className="ml-1 text-xs font-medium text-dark-400">
                        (optional)
                      </span>
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                      />

                      <input
                        id="join-phone"
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="08012345678"
                        autoComplete="tel"
                        className="w-full rounded-xl border border-dark-200 bg-white py-3.5 pl-11 pr-4 text-sm text-dark-950 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-dark-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="rounded-xl border border-dark-200 bg-white px-5 py-3 text-sm font-bold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Joining Group...
                      </>
                    ) : (
                      <>
                        Join Group Order
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinGroupModal;
