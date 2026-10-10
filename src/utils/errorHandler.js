export const getErrorMessage = (error) => {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (error.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }

  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  const status = error.response?.status || error.status;
  const data = error.response?.data || error.data;

  switch (status) {
    case 400:
      return data?.message || "Invalid request.";

    case 401:
      return data?.message || "You are not authenticated.";

    case 403:
      return data?.message || "You do not have permission to perform this action.";

    case 404:
      return data?.message || "The requested resource was not found.";

    case 422:
      return data?.message || "Some of the information provided is invalid.";

    case 429:
      return data?.message || "Too many requests. Please try again later.";

    case 500:
      return data?.message || "Something went wrong on the server.";

    default:
      return (
        error.message ||
        data?.message ||
        "Something went wrong. Please try again."
      );
  }
};

export default getErrorMessage;