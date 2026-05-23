import { googleLogin, register } from "@/api/auth";
import AuthImagePanel from "@/components/auth/AuthImagePanel";
import routes from "@/config/routes";
import useAuthStore from "@/store/authStore";
import React, { useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await register({ name, email, password, role });
      useAuthStore.getState().login(data.user, data.accessToken);
      const userRole = data.user.role;

      if (userRole === "customer") {
        navigate(routes.customer.home);
      } else if (userRole === "vendor") {
        navigate(routes.vendor.details);
      } else if (userRole === "admin") {
        navigate(routes.admin.dashboard);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong try after some time",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-green-50 relative overflow-hidden">
      {/* Image — slides in from LEFT */}
      <motion.div
        className="h-48 lg:h-full w-full lg:w-[50%] flex-shrink-0"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <AuthImagePanel />
      </motion.div>

      {/* Form — slides in from RIGHT */}
      <motion.div
        className="flex flex-1 flex-col justify-center px-8 lg:px-16 overflow-y-auto py-10 lg:py-0"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="hidden lg:block absolute top-8 right-16 bg-green-900 text-gold-500 cursor-pointer p-[0.6rem] rounded-md">
          Back to home →
        </div>
        <div className="section-eyebrow">Get Started</div>
        <h1 className="text-green-900 font-bold text-4xl font-display mt-2 mb-1">
          CREATE ACCOUNT
        </h1>
        <p className="text-sm font-sans text-gray-500 mb-8">
          Already have an account?
          <span
            className="text-green-700 ml-1 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate(routes.auth.login)}
          >
            Sign In
          </span>
        </p>
        <label className="text-sm text-green-900 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-green-200 rounded-md bg-white text-sm text-green-900 outline-none mt-1 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-green-700/60 transition-all duration-200"
        />
        <label className="text-sm text-green-900 font-medium mt-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@gmail.com"
          className="w-full px-4 py-3 border border-green-200 rounded-md bg-white text-sm text-green-900 outline-none mt-1 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-green-700/60 transition-all duration-200"
        />
        <label className="text-sm font-medium text-green-900 mt-2">
          Password
        </label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-green-200 rounded-md bg-white text-sm text-green-900 outline-none pr-10 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-green-700/60 transition-all duration-200"
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
            className="absolute top-1/2 right-8 -translate-y-1/2 text-green-700 cursor-pointer"
          >
            {showPassword ? <VscEye size={18} /> : <VscEyeClosed size={18} />}
          </button>
        </div>
        <label className="text-sm font-medium text-green-900 mt-2">
          Select Your Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 border border-green-200 rounded-md bg-white text-sm text-green-900 outline-none mt-1 focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        <button
          type="button"
          className="border-2 mt-5 bg-green-800 text-white p-3 rounded-md text-lg text-center font-semibold hover:bg-green-700 transition-all duration-200 hover:shadow-md"
          disabled={isloading}
          onClick={handleRegister}
        >
          {isloading ? "Signing up..." : "Sign Up"}
        </button>
        <div className="flex items-center my-2">
          <div className="flex-grow border-t-2 border-green-800/20"></div>
          <span className="font-sans mx-2 text-green-800">
            or continue with
          </span>
          <div className="flex-grow border-t-2 border-green-800/20"></div>
        </div>
        <button
          onClick={googleLogin}
          className="flex flex-row items-center text-center mt-2 justify-center border-2 border-green-700/20 p-3 rounded-lg bg-white font-semibold text-base text-green-800"
        >
          <svg className="w-6 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
