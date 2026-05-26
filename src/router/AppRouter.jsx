import React from "react";
import routes from "@/config/routes";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import HomePage from "@/pages/customer/HomePage";
import HotelListingPage from "@/pages/customer/HotelListingPage";
import HotelDetailPage from "@/pages/customer/HotelDetailPage";
import EventsPage from "@/pages/customer/EventsPage";
import EventsDetailPage from "@/pages/customer/EventsDetailPage";
import ProtectedRoutes from "@/components/common/ProtectedRoutes";
import WishlistPage from "@/pages/customer/WishlistPage";
import MyBookingPage from "@/pages/customer/MyBookingPage";
import BookingPage from "@/pages/customer/BookingPage";
import VendorDashboardPage from "@/pages/vendor/VendorDashboardPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import GoogleCallbackPage from "@/pages/auth/GoogleCallbackPage";
import RoleSelectionPage from "@/pages/auth/RoleSelectionPage";
import VendorDetailsPage from "@/pages/vendor/VendorDetailsPage";
import VendorPendingPage from "@/pages/vendor/VendorPendingPage";

const AppRouter = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path={routes.auth.register} element={<RegisterPage />} />
        <Route path={routes.auth.login} element={<LoginPage />} />
        <Route path="/auth/callback" element={<GoogleCallbackPage />} />
        <Route path="/auth/role-selection" element={<RoleSelectionPage />} />
        <Route path={routes.customer.home} element={<HomePage />} />
        <Route path={routes.customer.hotel} element={<HotelListingPage />} />
        <Route
          path={routes.customer.hotelDetail}
          element={<HotelDetailPage />}
        />
        <Route path={routes.customer.events} element={<EventsPage />} />
        <Route
          path={routes.customer.eventDetails}
          element={<EventsDetailPage />}
        />
        <Route
          path={routes.customer.wishlist}
          element={
            <ProtectedRoutes allowedRoles={["customer"]}>
              <WishlistPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path={routes.customer.mybooking}
          element={
            <ProtectedRoutes allowedRoles={["customer"]}>
              <MyBookingPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path={routes.customer.booking}
          element={
            <ProtectedRoutes allowedRoles={["customer"]}>
              <BookingPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path={routes.vendor.dashboard}
          element={
            <ProtectedRoutes allowedRoles={["vendor"]}>
              <VendorDashboardPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path={routes.vendor.details}
          element={
            <ProtectedRoutes allowedRoles={["vendor"]}>
              <VendorDetailsPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path={routes.vendor.pendingApproval}
          element={
            <ProtectedRoutes allowedRoles={["vendor"]}>
              <VendorPendingPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path={routes.admin.dashboard}
          element={
            <ProtectedRoutes allowedRoles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
export default AppRouter;
