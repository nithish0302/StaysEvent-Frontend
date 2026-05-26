import React from "react";
import LoginPage from "../auth/LoginPage";
import RoleSelectionPage from "../auth/RoleSelectionPage";
import RegisterPage from "../auth/RegisterPage";
import Navbar from "@/components/common/Navbar";
import VendorDetailsPage from "../vendor/VendorDetailsPage";
import VendorPendingPage from "../vendor/VendorPendingPage";
import HotelListingPage from "./HotelListingPage";
import HotelCard from "@/components/hotel/HotelCard";

const HomePage = () => {
  return (
    // <div className="min-h-screen bg-green-50">
    //   <div className="max-w-7xl mx-auto px-6 py-10">
    //     <h1 className="text-4xl font-bold text-green-900 mb-4">StayEvents</h1>

    //     <p className="text-gray-700 text-lg mb-10">
    //       Hotel and Event Management Platform
    //     </p>

    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //       <div className="bg-white rounded-2xl shadow-md p-6">
    //         <h2 className="text-2xl font-semibold text-green-800 mb-3">
    //           Login Page
    //         </h2>

    //         <p className="text-gray-600 mb-4">Test the login functionality.</p>

    //         <button className="bg-yellow-500 text-green-900 px-5 py-2 rounded-full font-semibold">
    //           Open Login
    //         </button>
    //       </div>

    //       <div className="bg-white rounded-2xl shadow-md p-6">
    //         <h2 className="text-2xl font-semibold text-green-800 mb-3">
    //           Register Page
    //         </h2>

    //         <p className="text-gray-600 mb-4">
    //           Test the register functionality.
    //         </p>

    //         <button className="bg-yellow-500 text-green-900 px-5 py-2 rounded-full font-semibold">
    //           Open Register
    //         </button>
    //       </div>

    //       <div className="bg-white rounded-2xl shadow-md p-6">
    //         <h2 className="text-2xl font-semibold text-green-800 mb-3">
    //           Role Selection
    //         </h2>

    //         <p className="text-gray-600 mb-4">
    //           Choose customer, vendor, or admin.
    //         </p>

    //         <button className="bg-yellow-500 text-green-900 px-5 py-2 rounded-full font-semibold">
    //           Open Roles
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <HotelListingPage />
  );
};

export default HomePage;
