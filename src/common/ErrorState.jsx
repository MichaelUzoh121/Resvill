import { getErrorMessage } from "../utils/errorHandler";

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="font-heading text-lg font-bold text-dark-900">
        Something went wrong
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-dark-600">
        {getErrorMessage(error)}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;