
// import React from "react";
// import { CalendarCheck } from "lucide-react";

// function Row1() {
//   return (
//     <section className="relative overflow-hidden bg-dark-950 px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
//       {/* Decorative background */}
//       <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />

//       <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-500/5 blur-3xl" />

//       <div className="relative mx-auto max-w-7xl">
//         <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
//           {/* Content */}
//           <div className="max-w-2xl">
//             {/* Eyebrow */}
//             <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-2">
//               <CalendarCheck
//                 size={16}
//                 className="text-primary-500"
//               />

//               <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
//                 Reservations
//               </span>
//             </div>

//             {/* Heading */}
//             <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
//               Make time for
//               <span className="block text-primary-500">
//                 good food.
//               </span>
//             </h1>

//             {/* Description */}
//             <p className="mt-6 max-w-xl text-base leading-7 text-dark-300 sm:text-lg">
//               Whether it's a casual meal, a family gathering, or a
//               special celebration, reserve your table at Resvill and
//               enjoy your time without the wait.
//             </p>
//           </div>

//           {/* Visual */}
//           <div className="relative">
//             <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-dark-900 shadow-card">
//               <div className="aspect-[4/3] overflow-hidden">
//                 <img
//                   src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85"
//                   alt="Restaurant dining table"
//                   className="h-full w-full object-cover"
//                 />
//               </div>

//               {/* Image overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent" />

//               {/* Bottom label */}
//               <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-dark-950/80 p-4 backdrop-blur-md">
//                 <p className="text-sm font-bold text-white">
//                   A table made for your moment.
//                 </p>

//                 <p className="mt-1 text-xs text-dark-300">
//                   Good food. Great company. Memorable moments.
//                 </p>
//               </div>
//             </div>

//             {/* Decorative element */}
//             <div className="absolute -bottom-4 -right-4 -z-0 h-24 w-24 rounded-2xl bg-primary-500/20 blur-xl" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Row1;




import React from "react";
import {
  CalendarDays,
  Clock3,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function Row1() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Content */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2">
              <Sparkles
                size={15}
                className="text-primary-500"
              />

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
                Plan Ahead
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-dark-950 sm:text-5xl lg:text-6xl">
              Great moments
              <span className="block text-primary-500">
                deserve great food.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-dark-500 sm:text-lg sm:leading-8">
              Planning a birthday, office lunch, family gathering, or
              special event? Reserve your food in advance and let
              Resvill take care of the meal when the moment arrives.
            </p>

            {/* Quick highlights */}
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-dark-100 bg-white px-4 py-3 shadow-sm">
                <CalendarDays
                  size={17}
                  className="text-primary-500"
                />

                <span className="text-sm font-semibold text-dark-700">
                  Pick a date
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-dark-100 bg-white px-4 py-3 shadow-sm">
                <Clock3
                  size={17}
                  className="text-primary-500"
                />

                <span className="text-sm font-semibold text-dark-700">
                  Choose a time
                </span>
              </div>
            </div>

            {/* CTA */}
            
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-xl">
            {/* Main image */}
            <div className="relative overflow-hidden rounded-[2rem] bg-dark-100 shadow-2xl">
              <div className="aspect-[4/4.2] overflow-hidden sm:aspect-[4/3.8]">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
                  alt="People enjoying food together"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Image gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />

              {/* Floating reservation card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-dark-400">
                      Your reservation
                    </p>

                    <p className="mt-1 font-heading text-base font-bold text-dark-950 sm:text-lg">
                      Saturday • 6:30 PM
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                    <CalendarDays
                      size={20}
                      className="text-primary-500"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-dark-100 pt-3">
                  <span className="h-2 w-2 rounded-full bg-primary-500" />

                  <span className="text-xs font-medium text-dark-500">
                    Food prepared for your special moment
                  </span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -left-4 top-8 hidden rounded-2xl border border-dark-100 bg-white px-4 py-3 shadow-xl sm:block lg:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
                  <Sparkles
                    size={17}
                    className="text-primary-500"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-dark-900">
                    Plan ahead
                  </p>

                  <p className="mt-0.5 text-[11px] text-dark-400">
                    We'll handle the food
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative shape */}
            <div className="pointer-events-none absolute -bottom-5 -right-5 -z-10 h-28 w-28 rounded-[2rem] bg-primary-500/15" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row1;

