function EmptyState({
  title = "Nothing here yet",
  message = "There is nothing to display at the moment.",
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="font-heading text-lg font-bold text-dark-900">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-dark-600">
        {message}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;