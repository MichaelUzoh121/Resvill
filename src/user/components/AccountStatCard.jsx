// import { Pencil } from "lucide-react";

// function AccountCard({ icon: Icon, title, detail, action, onClick }) {
//   return (
//     <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft">
//       <div className="flex items-start gap-3">
//         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
//           <Icon size={19} />
//         </div>

//         <div className="min-w-0 flex-1">
//           <h3 className="text-sm font-bold text-dark-900">
//             {title}
//           </h3>

//           <p className="mt-1 text-sm text-dark-600">
//             {detail}
//           </p>

//           <button
//             type="button"
//             onClick={onClick}
//             className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-500 hover:text-primary-600"
//           >
//             <Pencil size={13} />
//             {action}
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default AccountCard;


function AccountCard({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
          <Icon size={20} />
        </div>

        <div className="min-w-0">
          <p className="text-2xl font-extrabold text-dark-900">
            {value}
          </p>

          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-dark-500">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AccountCard;