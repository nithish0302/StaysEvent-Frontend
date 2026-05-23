import React, { useEffect } from "react";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import routes from "@/config/routes";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();

  const handleCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const isNew = params.get("isNew") === "true";

    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      useAuthStore.getState().login(res.data.user, token);
      if (isNew) {
        navigate(routes.auth.roleSelection);
      }
      if (!isNew) {
        const role = res.data.user.role;
        const vendorStatus = res.data.user.vendorStatus;

        if (role === "customer") {
          navigate(routes.customer.home);
        } else if (role === "vendor" && vendorStatus === "approved") {
          navigate(routes.vendor.dashboard);
        } else if (role === "vendor" && vendorStatus === "pending") {
          navigate(routes.vendor.pendingApproval);
        } else if (role === "admin") {
          navigate(routes.admin.dashboard);
        }
      }
    } catch (err) {
      console.error(`Error Occurred ${err}`);
      navigate(routes.auth.login);
    }
  };
  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-800 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-green-900 font-sans text-sm">
          Signing you in...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
