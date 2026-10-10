const env = {
  // Keep browser API requests same-origin in production so Safari accepts
  // the HTTP-only session cookie instead of treating it as a third-party cookie.
  apiUrl: import.meta.env.PROD
    ? "/api"
    : import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  socketUrl: import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
};

export default env;
