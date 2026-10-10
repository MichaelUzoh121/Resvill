import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "./config/queryClient";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2600,
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
