import { updateRole } from "@/api/auth";
import routes from "@/config/routes";
import useAuthStore from "@/store/authStore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/Logo1.png";
import RoleSlectionCard from "@/components/auth/RoleSlectionCard";

const RoleSelectionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, SetError] = useState("");
  const navigate = useNavigate();

  const customersOption = [
    "Browse Hotels",
    "Browse Events",
    "Book Hotels and Events",
    "Can book the Hotel nearby to the Event",
  ];
  const vendorOption = [
    "Rent the hotel",
    "Display the  different types of event",
    "Be a partner",
  ];

  const handleRoleSelection = async (SelectedRole) => {
    setIsLoading(true);
    try {
      await updateRole({ role: SelectedRole });
      const currUser = useAuthStore.getState().user;
      useAuthStore.getState().setUser({ ...currUser, role: SelectedRole });

      if (SelectedRole === "customer") {
        navigate(routes.customer.home);
      } else if (SelectedRole === "vendor") {
        navigate(routes.vendor.details);
      }
    } catch (err) {
      console.error(`Error Occurred ${err}`);
      SetError(
        err.response?.data?.message ||
          "Error Ocuured during the role updation,Kindly try after sometime",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-green-900 h-screen text-center ">
      <div className="relative flex items-center justify-center p-5 pt-8">
        <img
          src={logo}
          alt="Logo"
          className="absolute left-5 top-5 h-12 lg:h-24"
        />
        <h1 className="font-display font-bold text-green-50 text-xl sm:text-3xl lg:text-5xl pl-16 lg:pl-0">
          Welcome to Stays<span className="text-yellow-500"> Events</span>
        </h1>
      </div>
      {/* middle layer */}
      <div
        className="flex flex-col lg:flex-row font-sans text-green-50 justify-around 
text-center items-center h-auto lg:h-[70vh] gap-8 px-8 lg:px-16 py-8 lg:py-0"
      >
        <RoleSlectionCard
          role={"Customer"}
          roleOptions={customersOption}
          handleRoleSelection={handleRoleSelection}
          isLoading={isLoading}
        />
        <RoleSlectionCard
          role={"Vendor"}
          roleOptions={vendorOption}
          handleRoleSelection={handleRoleSelection}
          isLoading={isLoading}
        />
      </div>
      <div className="mx-8 lg:mx-16 mb-6 flex items-center justify-center gap-3 bg-red-500/20 border border-red-500/40 rounded-lg px-4 py-3 ">
        <span className="text-red-400 text-xl">⚠️</span>
        <p className="text-red-400 font-sans text-sm">
          <span className="font-bold">Warning:</span> You cannot change your
          role once selected. Choose carefully!
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
