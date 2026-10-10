function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md border border-dark-200 px-4 py-2 text-sm font-medium text-dark-700 transition hover:border-primary-500 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <span className="px-3 text-sm font-medium text-dark-600">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md border border-dark-200 px-4 py-2 text-sm font-medium text-dark-700 transition hover:border-primary-500 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;