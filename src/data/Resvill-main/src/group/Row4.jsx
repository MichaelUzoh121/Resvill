// import React from "react";
// import { ArrowRight, Check, Users } from "lucide-react";

// const benefits = [
//   "Everyone chooses their own meal",
//   "One shared group order",
//   "Easy invite link",
//   "Perfect for offices, families and events",
// ];

// function Row4() {
//   return (
//     <section className="px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
//       <div className="mx-auto max-w-7xl">
//         <div className="overflow-hidden rounded-3xl bg-dark-950 px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
//           <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
//             {/* Content */}
//             <div className="max-w-2xl">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 text-white">
//                 <Users size={23} />
//               </div>

//               <h2 className="mt-6 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
//                 Planning a meal with a group?
//               </h2>

//               <p className="mt-4 max-w-xl text-sm leading-6 text-dark-300 sm:text-base">
//                 Stop collecting food orders through chats. Create a
//                 Resvill group order and let everyone add their own
//                 meal in one place.
//               </p>

//               <div className="mt-6 grid gap-3 sm:grid-cols-2">
//                 {benefits.map((benefit) => (
//                   <div
//                     key={benefit}
//                     className="flex items-center gap-2 text-sm text-dark-200"
//                   >
//                     <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
//                       <Check size={12} />
//                     </span>

//                     {benefit}
//                   </div>
//                 ))}
//               </div>

//               <button
//                 type="button"
//                 className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
//               >
//                 Start a Group Order
//                 <ArrowRight size={17} />
//               </button>
//             </div>

//             {/* Stat */}
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center lg:min-w-52">
//               <p className="text-sm font-medium text-dark-300">
//                 One order
//               </p>

//               <p className="mt-2 font-heading text-4xl font-extrabold text-white">
//                 Everyone
//               </p>

//               <p className="mt-2 text-sm text-dark-400">
//                 gets exactly what they want.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Row4;





import React from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Link2,
  ShoppingBag,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Everyone orders",
    text: "Each person picks their own meal.",
  },
  {
    icon: Link2,
    title: "One simple link",
    text: "Invite everyone with one shareable link.",
  },
  {
    icon: Clock3,
    title: "Set a deadline",
    text: "Choose when the group order closes.",
  },
];

function Row4() {
  return (
    <section className="bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary-50">
          {/* Decorative shapes */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-100" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/70" />

          <div className="relative grid items-center gap-12 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-16">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-2 text-xs font-bold text-primary-600 shadow-sm">
                <Users size={14} />
                Built for groups
              </div>

              <h2 className="mt-5 max-w-xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-dark-950 sm:text-4xl lg:text-5xl">
                Good food is better when
                <span className="text-primary-500"> everyone is involved.</span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-dark-600 sm:text-base">
                Planning an office lunch, family dinner, birthday or
                hangout? Create a group order and let everyone choose
                exactly what they want.
              </p>

              {/* Benefits */}
              <div className="mt-8 space-y-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="flex items-start gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-500 shadow-sm">
                        <Icon size={18} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-dark-900">
                          {benefit.title}
                        </h3>

                        <p className="mt-0.5 text-xs leading-5 text-dark-500">
                          {benefit.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <button
                type="button"
                className="mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-hover"
              >
                Create a Group Order
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Right - Visual Order Preview */}
            <div className="relative mx-auto w-full max-w-md">
              {/* Main card */}
              <div className="rounded-3xl border border-white bg-white p-5 shadow-card sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-dark-400">
                      Group order
                    </p>

                    <h3 className="mt-1 font-heading text-xl font-extrabold text-dark-950">
                      Friday Lunch
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                    <ShoppingBag size={19} />
                  </div>
                </div>

                {/* Members */}
                <div className="mt-6 rounded-2xl bg-dark-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-dark-400">
                        Group members
                      </p>

                      <p className="mt-1 font-heading text-lg font-bold text-dark-950">
                        6 people
                      </p>
                    </div>

                    <div className="flex -space-x-2">
                      {["M", "J", "A", "D", "K", "+"].map(
                        (initial, index) => (
                          <div
                            key={`${initial}-${index}`}
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold ${
                              index === 5
                                ? "bg-primary-50 text-primary-500"
                                : "bg-dark-200 text-dark-700"
                            }`}
                          >
                            {initial}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-dark-700">
                      Ordering progress
                    </span>

                    <span className="font-bold text-primary-500">
                      4 / 6
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-dark-100">
                    <div className="h-full w-2/3 rounded-full bg-primary-500" />
                  </div>
                </div>

                {/* Deadline */}
                <div className="mt-5 flex items-center justify-between border-t border-dark-100 pt-5">
                  <div className="flex items-center gap-2 text-dark-500">
                    <Clock3 size={15} />

                    <span className="text-xs font-medium">
                      Ordering closes
                    </span>
                  </div>

                  <span className="text-xs font-bold text-dark-800">
                    1:00 PM
                  </span>
                </div>
              </div>

              {/* Floating invite card */}
              <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-dark-100 bg-white px-4 py-3 shadow-card sm:-left-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white">
                  <Check size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-medium text-dark-400">
                    Group link
                  </p>

                  <p className="text-xs font-bold text-dark-800">
                    resvill.com/group/ABC123
                  </p>
                </div>
              </div>

              {/* Floating status */}
              <div className="absolute -right-3 -top-5 rounded-2xl border border-dark-100 bg-white px-4 py-3 shadow-card sm:-right-7">
                <p className="text-[10px] font-medium text-dark-400">
                  Status
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary-500" />

                  <span className="text-xs font-bold text-dark-800">
                    Open
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row4;

