import React from "react";
import AppRouter from "./router/AppRouter";
import Navbar from "./components/common/Navbar";
import { useLocation } from "react-router-dom";

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
      {!shouldHideNavbar && <Navbar />}
      <AppRouter />
    </>
  );
};

export default App;
