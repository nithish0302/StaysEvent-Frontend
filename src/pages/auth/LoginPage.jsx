import AuthImagePanel from "@/components/auth/AuthImagePanel";
import React, { useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "@/api/auth";
import useAuthStore from "@/store/authStore";
import routes from "@/config/routes";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await login({ email, password });
      useAuthStore.getState().login(data.user, data.accessToken);
      const role = data.user.role;
      const vendorStatus = data.user.vendorStatus;
      if (role === "customer") {
        navigate(routes.customer.home);
      } else if (role === "vendor" && vendorStatus === "approved") {
        navigate(routes.vendor.dashboard);
      } else if (role === "vendor" && vendorStatus === "pending") {
        navigate(routes.vendor.pendingApproval);
      } else if (role === "admin") {
        navigate(routes.admin.dashboard);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong try after some time",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-green-50 relative overflow-hidden">
      {/* Form — slides in from LEFT */}

      <motion.div
        className="flex flex-1 flex-col justify-center px-8 lg:px-16 overflow-y-auto py-10 lg:py-0"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="hidden lg:block absolute top-8 left-8 cursor-pointer bg-green-900 text-gold-500 p-[0.6rem] rounded-md">
          Back to home →
        </div>
        <div className="section-eyebrow">WELCOME BACK</div>
        <h1 className="font-display text-4xl font-bold text-green-900 mt-2 mb-1">
          Sign In
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Don't you have an account?
          <span
            className="ml-1 text-green-700 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate(routes.auth.register)}
          >
            Create one
          </span>
        </p>
        <label className="text-sm font-medium text-green-900">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=""
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
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-8 -translate-y-1/2 text-green-700 cursor-pointer"
          >
            {showPassword ? <VscEye size={18} /> : <VscEyeClosed size={18} />}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <div className="text-end mt-1 mr-2 cursor-pointer text-[14.5px] font-sans text-green-700 font-medium hover:underline">
          Forgot Password ?
        </div>
        <button
          type="button"
          className="border-2 mt-5 bg-green-800 text-white p-3 rounded-md text-lg text-center font-semibold hover:bg-green-700 transition-all duration-200 hover:shadow-md"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
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

      {/* Image — slides in from RIGHT */}
      <motion.div
        className="h-48 lg:h-full w-full lg:w-[50%] flex-shrink-0"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <AuthImagePanel />
      </motion.div>
    </div>
  );
};

export default LoginPage;
