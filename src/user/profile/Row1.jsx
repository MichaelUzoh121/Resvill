import React from "react";
import { Camera, Mail, Pencil, Phone } from "lucide-react";

function Row1({ name = "Michael Uzoh", initials = "MU" }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-dark-200 bg-white shadow-soft">
      <div className="h-24 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 sm:h-32" />
      <div className="relative px-5 pb-5 sm:px-7 sm:pb-7">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-primary-100 font-heading text-2xl font-extrabold text-primary-600 shadow-card sm:h-28 sm:w-28">
              {initials}
              <button
                type="button"
                aria-label="Change profile photo"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-primary-500 text-white shadow-sm transition hover:bg-primary-600"
              >
                <Camera size={15} />
              </button>
            </div>
            <div className="pb-1">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-500">Food lover</p>
              <h2 className="mt-1 text-xl font-extrabold text-dark-900 sm:text-2xl">{name}</h2>
              <p className="mt-1 text-sm text-dark-600">Member since August 2026</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-bold text-dark-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
          >
            <Pencil size={15} />
            Edit profile
          </button>
        </div>

        <div className="mt-6 grid gap-3 border-t border-dark-100 pt-5 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-sm text-dark-600">
            <Mail size={17} className="text-primary-500" />
            <span>michael@example.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-dark-600">
            <Phone size={17} className="text-primary-500" />
            <span>+234 801 234 5678</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row1;