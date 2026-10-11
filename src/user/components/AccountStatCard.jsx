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