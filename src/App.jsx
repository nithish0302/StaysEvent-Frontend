import React from "react";
import AppRouter from "./router/AppRouter";
import Navbar from "./components/common/Navbar";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";


const App = () => {
  const location = useLocation();
  const hideNavBar = [
    "/login",
    "/register",
    "/auth/callback",
    "/auth/role-selection",
  ];
  const shouldHideNavbar = hideNavBar.includes(location.pathname);
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontSize: "14px", borderRadius: "10px" },
          success: { style: { background: "#E8F2EB", color: "#1A3C34" } },
          error: { style: { background: "#FEE2E2", color: "#991B1B" } },
        }}
      />
      {!shouldHideNavbar && <Navbar />}
      <AppRouter />
    </>
  );
};

export default App;
