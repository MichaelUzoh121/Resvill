// import React from "react";
// import { Copy, Users, Link2 } from "lucide-react";
// import { toast } from "react-hot-toast";

// function GroupHeader({ groupOrder }) {
//   const groupCode = groupOrder?.groupCode || "";

//   const participantCount = Array.isArray(groupOrder?.participants)
//     ? groupOrder.participants.length
//     : 0;

//   const inviteLink = groupCode
//     ? `${window.location.origin}/group-order/${groupCode}`
//     : "";

//   const handleCopyInvite = async () => {
//     if (!inviteLink) {
//       toast.error("Group invitation link is unavailable.");
//       return;
//     }

//     try {
//       await navigator.clipboard.writeText(inviteLink);
//       toast.success("Invitation link copied.");
//     } catch {
//       toast.error("Unable to copy invitation link.");
//     }
//   };

//   return (
//     <section className="relative overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-card">
//       <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary-50 blur-3xl" />
//       <div className="absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-accent-400/10 blur-3xl" />

//       <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
//         <div className="min-w-0">
//           <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5">
//             <Users size={14} className="text-primary-500" />

//             <span className="text-xs font-bold uppercase tracking-wide text-primary-600">
//               Group Order
//             </span>
//           </div>

//           <h1 className="mt-4 truncate text-2xl font-extrabold text-dark-900 sm:text-3xl">
//             {groupOrder?.name || "Group Order"}
//           </h1>

//           <div className="mt-4 flex flex-wrap items-center gap-3">
//             <div className="inline-flex items-center gap-2 rounded-xl bg-dark-50 px-3 py-2">
//               <span className="text-xs font-medium text-dark-600">
//                 Code
//               </span>

//               <span className="font-heading text-sm font-bold tracking-wide text-dark-900">
//                 {groupCode || "—"}
//               </span>
//             </div>

//             <div className="inline-flex items-center gap-2 rounded-xl bg-primary-50 px-3 py-2">
//               <Users size={14} className="text-primary-500" />

//               <span className="text-xs font-semibold text-primary-700">
//                 {participantCount}{" "}
//                 {participantCount === 1
//                   ? "participant"
//                   : "participants"}
//               </span>
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={handleCopyInvite}
//           disabled={!inviteLink}
//           className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-soft"
//         >
//           <Copy size={17} />
//           Copy Invite
//         </button>
//       </div>

//       {inviteLink && (
//         <div className="relative border-t border-dark-100 bg-dark-50/60 px-5 py-3.5 sm:px-7">
//           <div className="flex min-w-0 items-center gap-2">
//             <Link2 size={15} className="shrink-0 text-primary-500" />

//             <span className="truncate text-xs text-dark-600">
//               {inviteLink}
//             </span>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// export default GroupHeader;

import React, { useEffect, useState } from "react";
import { Check, Copy, Pencil, Users, X, Link2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { useGroupOrderContext } from "../../../context/GroupOrderContext";

function GroupHeader({ groupOrder }) {
  const { isHost, canManageGroup, updateName, isUpdatingName } =
    useGroupOrderContext();

  const groupCode = groupOrder?.groupCode || "";

  const participantCount = Array.isArray(groupOrder?.participants)
    ? groupOrder.participants.length
    : 0;

  const inviteLink = groupCode
    ? `${window.location.origin}/group-order/${groupCode}`
    : "";

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(groupOrder?.name || "Group Order");

  useEffect(() => {
    if (!isEditing) {
      setName(groupOrder?.name || "Group Order");
    }
  }, [groupOrder?.name, isEditing]);

  const handleCopyInvite = async () => {
    if (!inviteLink) {
      toast.error("Group invitation link is unavailable.");
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invitation link copied.");
    } catch {
      toast.error("Unable to copy invitation link.");
    }
  };

  const handleStartEditing = () => {
    setName(groupOrder?.name || "Group Order");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setName(groupOrder?.name || "Group Order");
    setIsEditing(false);
  };

  const handleSaveName = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Group name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      toast.error("Group name cannot exceed 100 characters.");
      return;
    }

    if (trimmedName === (groupOrder?.name || "").trim()) {
      setIsEditing(false);
      return;
    }

    try {
      await updateName(trimmedName);
      setIsEditing(false);
    } catch {
      // Mutation already handles the error toast.
    }
  };

  const handleNameKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSaveName();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      handleCancelEditing();
    }
  };

  const canEditName = isHost && canManageGroup && !isUpdatingName;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-card">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary-50 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-accent-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5">
            <Users size={14} className="text-primary-500" />

            <span className="text-xs font-bold uppercase tracking-wide text-primary-600">
              Group Order
            </span>
          </div>

          <div className="mt-4 flex min-w-0 items-center gap-2">
            {isEditing ? (
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={handleNameKeyDown}
                  maxLength={100}
                  autoFocus
                  disabled={isUpdatingName}
                  className="min-w-0 flex-1 rounded-xl border border-primary-200 bg-white px-3 py-2 text-xl font-extrabold text-dark-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:text-2xl"
                />

                <button
                  type="button"
                  onClick={handleSaveName}
                  disabled={isUpdatingName}
                  aria-label="Save group name"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdatingName ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Check size={17} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEditing}
                  disabled={isUpdatingName}
                  aria-label="Cancel editing"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark-100 text-dark-700 transition hover:bg-dark-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={17} />
                </button>
              </div>
            ) : (
              <>
                <h1 className="min-w-0 truncate text-2xl font-extrabold text-dark-900 sm:text-3xl">
                  {groupOrder?.name || "Group Order"}
                </h1>

                {canEditName && (
                  <button
                    type="button"
                    onClick={handleStartEditing}
                    aria-label="Edit group name"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-dark-500 transition hover:bg-primary-50 hover:text-primary-600"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl bg-dark-50 px-3 py-2">
              <span className="text-xs font-medium text-dark-600">Code</span>

              <span className="font-heading text-sm font-bold tracking-wide text-dark-900">
                {groupCode || "—"}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-primary-50 px-3 py-2">
              <Users size={14} className="text-primary-500" />

              <span className="text-xs font-semibold text-primary-700">
                {participantCount}{" "}
                {participantCount === 1 ? "participant" : "participants"}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyInvite}
          disabled={!inviteLink}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-soft"
        >
          <Copy size={17} />
          Copy Invite
        </button>
      </div>

      {inviteLink && (
        <div className="relative border-t border-dark-100 bg-dark-50/60 px-5 py-3.5 sm:px-7">
          <div className="flex min-w-0 items-center gap-2">
            <Link2 size={15} className="shrink-0 text-primary-500" />

            <span className="truncate text-xs text-dark-600">{inviteLink}</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default GroupHeader;
