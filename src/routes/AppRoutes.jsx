import { Routes, Route } from "react-router-dom";

import Layout from "../Layout";

// Public pages
import Home from "../home/Home";
import Menu from "../menu/Menu";
import FoodCustomization from "../food/FoodCustomization";
import GroupOrder from "../group/GroupOrder";
import Reservation from "../reservation/Reservation";
import About from "../about/About";
import Gallery from "../gallery/Gallery";
import Faq from "../faq/Faq";
import Contact from "../contact/Contact";
import NoPage from "../components/NoPage";

// Checkout
import Cart from "../cart/Cart";
import Checkout from "../checkout/Checkout";

// Orders
import TrackOrder from "../orders/TrackOrder";
import OrderHistory from "../orders/OrderHistory";
import OrderConfirmation from "../orders/OrderConfirmation";

// Auth
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import VerifyEmail from "../auth/VerifyEmail";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import StaffRoute from "./StaffRoute";
import DriverRoute from "./DriverRoute";
import ResendVerification from "../auth/ResendVerification";
import PaymentCallback from "../checkout/PaymentCallback";

// Customer
import UserLayout from "../user/UserLayout";
import AccountDashboard from "../user/account/AccountDashboard";
import Profile from "../user/account/Profile";
import Addresses from "../user/account/Addresses";
import Favorites from "../user/account/Favorites";
import Payments from "../user/account/Payments";
import Notifications from "../user/account/Notifications";
import Loyalty from "../user/account/Loyalty";
import Settings from "../user/account/Settings";
import OrderDetails from "../orders/OrderDetails";
import OrderTracker from "../orders/OrderTracker";
import Reviews from "../user/account/Reviews";
import Recommendations from "../recommendations/Recommendations";
import GroupOrderEntry from "../group/components/GroupOrderEntry";

// Admin
import AdminDashboard from "../admin/dashboard/AdminDashboard";
import AdminLayout from "../admin/components/AdminLayout";
import AdminCustomers from "../admin/customers/AdminCustomers";
import AdminCustomerDetails from "../admin/customers/AdminCustomerDetails";
import AdminFoods from "../admin/foods/AdminFoods";
import AdminCategoryCreate from "../admin/categories/AdminCategoryCreate";
import AdminCategoryEdit from "../admin/categories/AdminCategoryEdit";
import AdminCategories from "../admin/categories/AdminCategories";
import AdminFoodCreate from "../admin/foods/AdminFoodCreate";
import AdminFoodEdit from "../admin/foods/AdminFoodEdit";
import AdminFoodDetails from "../admin/foods/AdminFoodDetails";
import AdminOrderDetails from "../admin/orders/AdminOrderDetails";
import AdminOrders from "../admin/orders/AdminOrders";
import AdminPayments from "../admin/payments/AdminPayments";
import AdminReviews from "../admin/reviews/AdminReviews";
import AdminReviewDetails from "../admin/reviews/AdminReviewDetails";
import AdminCoupons from "../admin/coupons/AdminCoupons";
import AdminCouponCreate from "../admin/coupons/AdminCouponCreate";
import AdminCouponDetails from "../admin/coupons/AdminCouponDetails";
import AdminCouponEdit from "../admin/coupons/AdminCouponEdit";
import AdminDelivery from "../admin/delivery/AdminDelivery";
import AdminDeliveryDetails from "../admin/delivery/AdminDeliveryDetails";
import AdminAnalytics from "../admin/analytics/AdminAnalytics";
import AdminDeliveryLocations from "../admin/delivery-locations/AdminDeliveryLocations";
import AdminAccounts from "../admin/accounts/AdminAccounts";
import AdminSettings from "../admin/settings/AdminSettings";

// Staff
import StaffLayout from "../staff/components/StaffLayout";
import StaffDashboard from "../staff/dashboard/StaffDashboard";
import StaffOrders from "../staff/orders/StaffOrders";
import StaffOrderDetails from "../staff/orders/StaffOrderDetails";
import StaffDeliveries from "../staff/deliveries/StaffDeliveries";
import StaffDeliveryDetails from "../staff/deliveries/StaffDeliveryDetails";
import StaffKitchen from "../staff/kitchen/StaffKitchen";
import StaffNotifications from "../staff/notifications/StaffNotifications";
import StaffAccount from "../staff/account/StaffAccount";
import DriverLayout from "../driver/components/DriverLayout";
import DriverDashboard from "../driver/dashboard/DriverDashboard";
import DriverOffers from "../driver/offers/DriverOffers";
import DriverActiveDeliveries from "../driver/deliveries/DriverActiveDeliveries";
import DriverHistory from "../driver/history/DriverHistory";
import DriverCurrentDelivery from "../driver/deliveries/DriverCurrentDelivery";
import DriverDeliveryDetails from "../driver/deliveries/DriverDeliveryDetails";
import DriverAccount from "../driver/account/DriverAccount";
import StaffCreateOrder from "../staff/orders/StaffCreateOrder";

function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC / CUSTOMER ROUTES
      ===================================================== */}

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="menu" element={<Menu />} />
        <Route path="menu/:slug" element={<FoodCustomization />} />

        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />

        <Route path="group-order" element={<GroupOrder />} />

        <Route path="group-order/:groupCode" element={<GroupOrderEntry />} />

        <Route path="reservation" element={<Reservation />} />

        <Route path="about" element={<About />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />

        {/* Authentication */}
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />
        <Route path="auth/forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route
          path="auth/resend-verification"
          element={<ResendVerification />}
        />

        <Route path="payment/callback" element={<PaymentCallback />} />

        <Route path="track" element={<TrackOrder />} />

        {/* Guest order tracking */}
        <Route path="track/:id" element={<OrderTracker />} />

        <Route path="recommendations" element={<Recommendations />} />
      </Route>

      {/* =====================================================
          CUSTOMER PROTECTED ROUTES
      ===================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<UserLayout />}>
          <Route index element={<AccountDashboard />} />

          <Route path="profile" element={<Profile />} />

          <Route path="addresses" element={<Addresses />} />

          <Route path="favorites" element={<Favorites />} />

          <Route path="payments" element={<Payments />} />

          <Route path="orders" element={<OrderHistory />} />

          <Route path="orders/:orderId" element={<OrderDetails />} />

          <Route path="notifications" element={<Notifications />} />

          <Route path="/account/reviews" element={<Reviews />} />

          <Route path="loyalty" element={<Loyalty />} />

          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route
        path="/account/order-confirmation/:id"
        element={<OrderConfirmation />}
      />

      {/* =====================================================
          ADMIN ROUTES
      ===================================================== */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="orders" element={<AdminOrders />} />

          <Route path="orders/:id" element={<AdminOrderDetails />} />

          <Route path="foods" element={<AdminFoods />} />

          <Route path="foods/new" element={<AdminFoodCreate />} />

          <Route path="foods/:id" element={<AdminFoodDetails />} />

          <Route path="foods/:id/edit" element={<AdminFoodEdit />} />

          <Route path="categories" element={<AdminCategories />} />

          <Route path="categories/create" element={<AdminCategoryCreate />} />

          <Route path="categories/:id" element={<AdminCategoryEdit />} />

          <Route path="customers" element={<AdminCustomers />} />

          <Route
            path="/admin/customers/:customerId"
            element={<AdminCustomerDetails />}
          />

          <Route path="payments" element={<AdminPayments />} />

          <Route path="coupons" element={<AdminCoupons />} />

          <Route path="coupons/create" element={<AdminCouponCreate />} />

          <Route path="coupons/:id/edit" element={<AdminCouponEdit />} />

          <Route path="coupons/:id" element={<AdminCouponDetails />} />

          <Route path="reviews" element={<AdminReviews />} />

          <Route path="reviews/:id" element={<AdminReviewDetails />} />

          <Route path="delivery" element={<AdminDelivery />} />

          <Route
            path="delivery/:deliveryId"
            element={<AdminDeliveryDetails />}
          />

          <Route path="analytics" element={<AdminAnalytics />} />

          <Route
            path="delivery-locations"
            element={<AdminDeliveryLocations />}
          />

          <Route path="accounts" element={<AdminAccounts />} />

          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* =====================================================
          STAFF ROUTES
      ===================================================== */}

      <Route element={<StaffRoute />}>
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="orders" element={<StaffOrders />} />
          <Route path="orders/create" element={<StaffCreateOrder />} />
          <Route path="orders/:orderId" element={<StaffOrderDetails />} />
          <Route path="deliveries" element={<StaffDeliveries />} />
          <Route
            path="deliveries/:deliveryId"
            element={<StaffDeliveryDetails />}
          />
          <Route path="kitchen" element={<StaffKitchen />} />
          <Route path="notifications" element={<StaffNotifications />} />
          <Route path="account" element={<StaffAccount />} />
        </Route>
      </Route>

      {/* =====================================================
          DRIVER ROUTES
      ===================================================== */}

      <Route element={<DriverRoute />}>
        <Route path="/driver" element={<DriverLayout />}>
          <Route index element={<DriverDashboard />} />
          <Route path="offers" element={<DriverOffers />} />
          <Route path="active" element={<DriverActiveDeliveries />} />
          <Route
            path="deliveries/:deliveryId"
            element={<DriverDeliveryDetails />}
          />
          <Route path="current" element={<DriverCurrentDelivery />} />
          <Route path="history" element={<DriverHistory />} />

          <Route path="account" element={<DriverAccount />} />
        </Route>
      </Route>

      {/* =====================================================
          FALLBACK
      ===================================================== */}

      <Route path="*" element={<NoPage />} />
    </Routes>
  );
}

export default AppRoutes;
