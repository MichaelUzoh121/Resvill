import React from "react";

function DriverStatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition-shadow duration-200 hover:shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
            {label}
          </p>

          <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-dark-900">
            {value}
          </p>
        </div>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverStatCard;