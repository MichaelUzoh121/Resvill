function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-dark-100 ${className}`}
      aria-hidden="true"
    />
  );
}

export default Skeleton;