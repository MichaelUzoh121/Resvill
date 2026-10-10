// import { Pencil } from "lucide-react";
// import { Link } from "react-router-dom";

// function AccountCard({ icon: Icon, title, detail, action, link }) {
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
//       <div className="flex items-start gap-3">
//         <div
//           className="
//           flex
//           h-10
//           w-10
//           shrink-0
//           items-center
//           justify-center
//           rounded-xl
//           bg-primary-50
//           text-primary-500
//         "
//         >
//           <Icon size={19} />
//         </div>

//         <div className="min-w-0 flex-1">
//           <h3
//             className="
//             text-sm
//             font-bold
//             text-dark-900
//           "
//           >
//             {title}
//           </h3>

//           <p
//             className="
//             mt-1
//             text-sm
//             text-dark-600
//           "
//           >
//             {detail}
//           </p>

//           <Link
//             to={link}
//             className="
//               mt-3
//               inline-flex
//               items-center
//               gap-1
//               text-xs
//               font-bold
//               text-primary-500
//               hover:text-primary-600
//             "
//           >
//             <Pencil size={13} />

//             {action}
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AccountCard;



import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

function AccountCard({
  icon: Icon,
  title,
  detail,
  action,
  link,
}) {
  return (
    <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
          <Icon size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-dark-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-dark-600">
            {detail}
          </p>

          {link && (
            <Link
              to={link}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-500 hover:text-primary-600"
            >
              <Pencil size={13} />
              {action}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountCard;