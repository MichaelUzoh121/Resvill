// import React, { useState } from "react";
// import { Check, Copy, Link2, Share2 } from "lucide-react";
// import { toast } from "react-hot-toast";

// function GroupInvite({ groupOrder }) {
//   const [copied, setCopied] = useState(false);

//   const groupCode = groupOrder?.groupCode || "";

//   const inviteLink = groupCode
//     ? `${window.location.origin}/group-order/${groupCode}`
//     : "";

//   const handleCopy = async () => {
//     if (!inviteLink) {
//       toast.error("Invitation link is unavailable.");
//       return;
//     }

//     try {
//       await navigator.clipboard.writeText(inviteLink);

//       setCopied(true);
//       toast.success("Invitation link copied.");

//       setTimeout(() => {
//         setCopied(false);
//       }, 2000);
//     } catch {
//       toast.error("Unable to copy invitation link.");
//     }
//   };

//   const handleShare = async () => {
//     if (!inviteLink) {
//       toast.error("Invitation link is unavailable.");
//       return;
//     }

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: groupOrder?.name || "Resvill Group Order",
//           text: `Join my group order on Resvill using this link:`,
//           url: inviteLink,
//         });
//       } catch {
//         // User cancelled the share dialog.
//       }

//       return;
//     }

//     await handleCopy();
//   };

//   return (
//     <section className="rounded-2xl bg-white p-5 shadow-sm">
//       <div className="flex flex-col gap-4">
//         <div>
//           <h2 className="text-base font-semibold text-gray-900">
//             Invite people
//           </h2>

//           <p className="mt-1 text-sm text-gray-500">
//             Share this link with people you want to add to
//             the group order.
//           </p>
//         </div>

//         <div className="flex flex-col gap-3 sm:flex-row">
//           <div className="flex min-h-11 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3">
//             <Link2
//               size={16}
//               className="shrink-0 text-gray-400"
//             />

//             <span className="min-w-0 flex-1 truncate text-sm text-gray-600">
//               {inviteLink || "Invitation link unavailable"}
//             </span>
//           </div>

//           <button
//             type="button"
//             onClick={handleCopy}
//             disabled={!inviteLink}
//             className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {copied ? (
//               <Check size={16} />
//             ) : (
//               <Copy size={16} />
//             )}

//             {copied ? "Copied" : "Copy"}
//           </button>

//           <button
//             type="button"
//             onClick={handleShare}
//             disabled={!inviteLink}
//             className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <Share2 size={16} />
//             Share
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default GroupInvite;


import React, { useState } from "react";
import {
  Check,
  Copy,
  Link2,
  Share2,
  UserPlus,
} from "lucide-react";
import { toast } from "react-hot-toast";

function GroupInvite({ groupOrder }) {
  const [copied, setCopied] = useState(false);

  const groupCode = groupOrder?.groupCode || "";

  const inviteLink = groupCode
    ? `${window.location.origin}/group-order/${groupCode}`
    : "";

  const handleCopy = async () => {
    if (!inviteLink) {
      toast.error("Invitation link is unavailable.");
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);

      setCopied(true);
      toast.success("Invitation link copied.");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Unable to copy invitation link.");
    }
  };

  const handleShare = async () => {
    if (!inviteLink) {
      toast.error("Invitation link is unavailable.");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: groupOrder?.name || "Resvill Group Order",
          text: "Join my group order on Resvill using this link:",
          url: inviteLink,
        });
      } catch {
        // User cancelled the share dialog.
      }

      return;
    }

    await handleCopy();
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary-50 blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
            <UserPlus size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-dark-900">
              Invite people
            </h2>

            <p className="mt-1 text-sm leading-6 text-dark-600">
              Share the invitation link with friends or family
              so they can join this group order.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-dark-200 bg-dark-50 px-4">
            <Link2
              size={17}
              className="shrink-0 text-primary-500"
            />

            <span className="min-w-0 flex-1 truncate text-sm text-dark-600">
              {inviteLink || "Invitation link unavailable"}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!inviteLink}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-bold text-dark-700 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {copied ? (
                <Check size={17} className="text-success" />
              ) : (
                <Copy size={17} />
              )}

              {copied ? "Copied" : "Copy"}
            </button>

            <button
              type="button"
              onClick={handleShare}
              disabled={!inviteLink}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <Share2 size={17} />
              Share
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GroupInvite;