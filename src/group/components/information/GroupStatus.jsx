// import React from "react";

// const STATUS_CONFIG = {
//   open: {
//     label: "Open",
//     description: "Participants can add and manage their items.",
//   },

//   locked: {
//     label: "Locked",
//     description: "The group order is locked and ready for checkout.",
//   },

//   payment_pending: {
//     label: "Payment Pending",
//     description: "The group order is waiting for payment.",
//   },

//   converted: {
//     label: "Order Created",
//     description: "This group order has been converted into an order.",
//   },

//   cancelled: {
//     label: "Cancelled",
//     description: "This group order has been cancelled.",
//   },

//   expired: {
//     label: "Expired",
//     description: "This group order has expired.",
//   },
// };

// function GroupStatus({ status }) {
//   const config = STATUS_CONFIG[status] || {
//     label: status || "Unknown",
//     description: "",
//   };

//   return (
//     <section className="rounded-2xl bg-white p-5 shadow-sm">
//       <div className="flex items-center justify-between gap-4">
//         <div>
//           <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
//             Group Status
//           </p>

//           <h2 className="mt-1 text-lg font-semibold text-gray-900">
//             {config.label}
//           </h2>

//           {config.description && (
//             <p className="mt-1 text-sm text-gray-500">
//               {config.description}
//             </p>
//           )}
//         </div>

//         <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
//           {config.label}
//         </span>
//       </div>
//     </section>
//   );
// }

// export default GroupStatus;


import React from "react";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  LockKeyhole,
  XCircle,
  AlertCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  open: {
    label: "Open",
    description:
      "Participants can add and manage their items.",
    icon: UsersIcon,
    wrapper: "border-primary-100 bg-primary-50/60",
    iconWrapper: "bg-primary-500 text-white",
    badge: "bg-primary-500 text-white",
  },

  locked: {
    label: "Locked",
    description:
      "The group order is locked and ready for checkout.",
    icon: LockKeyhole,
    wrapper: "border-accent-400/30 bg-accent-400/10",
    iconWrapper: "bg-accent-400 text-dark-900",
    badge: "bg-accent-400 text-dark-900",
  },

  payment_pending: {
    label: "Payment Pending",
    description:
      "The group order is waiting for payment.",
    icon: CreditCard,
    wrapper: "border-info/20 bg-info/5",
    iconWrapper: "bg-info text-white",
    badge: "bg-info text-white",
  },

  converted: {
    label: "Order Created",
    description:
      "This group order has been converted into an order.",
    icon: CheckCircle2,
    wrapper: "border-success/20 bg-success/5",
    iconWrapper: "bg-success text-white",
    badge: "bg-success text-white",
  },

  cancelled: {
    label: "Cancelled",
    description:
      "This group order has been cancelled.",
    icon: XCircle,
    wrapper: "border-danger/20 bg-danger/5",
    iconWrapper: "bg-danger text-white",
    badge: "bg-danger text-white",
  },

  expired: {
    label: "Expired",
    description:
      "This group order has expired.",
    icon: Clock3,
    wrapper: "border-dark-200 bg-dark-50",
    iconWrapper: "bg-dark-600 text-white",
    badge: "bg-dark-700 text-white",
  },
};

function UsersIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function GroupStatus({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status || "Unknown",
    description: "",
    icon: AlertCircle,
    wrapper: "border-dark-200 bg-dark-50",
    iconWrapper: "bg-dark-600 text-white",
    badge: "bg-dark-700 text-white",
  };

  const Icon = config.icon;

  return (
    <section
      className={`rounded-3xl border p-5 shadow-soft sm:p-6 ${config.wrapper}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconWrapper}`}
          >
            <Icon size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-dark-600">
              Group Status
            </p>

            <h2 className="mt-1 text-lg font-bold text-dark-900">
              {config.label}
            </h2>

            {config.description && (
              <p className="mt-1 text-sm leading-5 text-dark-600">
                {config.description}
              </p>
            )}
          </div>
        </div>

        <span
          className={`hidden shrink-0 rounded-full px-3 py-1.5 text-xs font-bold sm:inline-flex ${config.badge}`}
        >
          {config.label}
        </span>
      </div>

      <div className="mt-4 sm:hidden">
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${config.badge}`}
        >
          {config.label}
        </span>
      </div>
    </section>
  );
}

export default GroupStatus;