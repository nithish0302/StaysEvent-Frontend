import React, { useState } from "react";
import { Clock } from "lucide-react";
import { logout } from "@/api/auth";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import routes from "@/config/routes";

const VendorPendingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handlelogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      useAuthStore.getState().logout();
      navigate(routes.auth.login);
    } catch (err) {
      console.error(`Error Occured ${err}`);
      alert(`Error Occurred`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="border-2 border-green-900 w-full max-w-4xl rounded-2xl bg-green-900 shadow-xl px-4 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-center">
          <Clock
            size={36}
            className="text-yellow-500 sm:w-[42px] sm:h-[42px]"
          />

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-200 leading-tight">
            Application Under Review
          </h1>
        </div>

        {/* Content */}
        <div className="mt-8 sm:mt-10 text-center space-y-3">
          <p className="text-lg sm:text-xl md:text-2xl text-green-100">
            Our Team is reviewing your application
          </p>

          <p className="text-base sm:text-lg md:text-2xl text-green-200">
            You'll receive an email once approved
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handlelogout}
          disabled={isLoading}
          className="block w-full sm:w-fit border-2 border-green-100 text-green-50 my-8 mx-auto rounded-lg px-5 py-2 font-light text-base sm:text-lg hover:bg-green-800 transition-all duration-200"
        >
          {isLoading ? "Logging Out" : "Visit Later"}
        </button>
      </div>
    </div>
  );
};

export default VendorPendingPage;
