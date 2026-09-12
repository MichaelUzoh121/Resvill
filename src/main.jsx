import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";

import Layout from "./Layout";
import { CartProvider } from "./context/CartContext";

import Home from "./home/Home";
import NoPage from "./components/NoPage";
import Menu from "./menu/Menu";
import FoodCustomization from "./food/FoodCustomization";
import GroupOrder from "./group/GroupOrder";
import Reservation from "./reservation/Reservation";
import About from "./about/About";
import Gallery from "./gallery/Gallery";
import Faq from "./faq/Faq";
import Contact from "./contact/Contact";

import Cart from "./cart/Cart";
import Checkout from "./checkout/Checkout";
import TrackOrder from "./orders/TrackOrder";
import OrderHistory from "./orders/OrderHistory";

import {
  OrderConfirmation,
  OrderTracker,
} from "./orders/OrderPages";

import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Profile from "./user/profile/Profile";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isSignedIn = localStorage.getItem("resvill_auth_v1") === "true";

  if (!isSignedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{ duration: 2600 }}
        />

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="menu" element={<Menu />} />

            <Route
              path="menu/:slug"
              element={<FoodCustomization />}
            />

            <Route path="cart" element={<Cart />} />

            <Route path="checkout" element={<Checkout />} />

            <Route
              path="order-history"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="group-order"
              element={<GroupOrder />}
            />

            <Route
              path="reservation"
              element={<Reservation />}
            />

            <Route path="about" element={<About />} />

            <Route path="gallery" element={<Gallery />} />

            <Route path="faq" element={<Faq />} />

            <Route path="contact" element={<Contact />} />

            <Route path="login" element={<Login />} />

            <Route path="register" element={<Register />} />

            <Route path="forgot-password" element={<ForgotPassword />} />

            <Route path="reset-password/:token" element={<ResetPassword />} />

            <Route
              path="user/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="order-confirmation/:id"
            element={<OrderConfirmation />}
          />

          <Route path="track-order" element={<TrackOrder />} />


          <Route
            path="track/:id"
            element={<OrderTracker />}
          />

          <Route path="*" element={<NoPage />} />

        </Routes>

      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
);

