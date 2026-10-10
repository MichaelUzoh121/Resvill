import Spinner from "./Spinner";

function Loader({ text = "Loading...", size = "md" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <Spinner size={size} />

      {text && (
        <span className="text-sm font-medium text-dark-600">
          {text}
        </span>
      )}
    </div>
  );
}

export default Loader;