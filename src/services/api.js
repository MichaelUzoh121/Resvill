import axios from "axios";
import env from "../config/env";

const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error?.response;

    const message =
      response?.data?.message ||
      response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({
      ...error,
      message,
      status: response?.status,
      data: response?.data,
    });
  }
);

export default api;