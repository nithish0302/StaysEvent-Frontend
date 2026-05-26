import useAuthStore from "@/store/authStore";
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { logout } from "@/api/auth";
import routes from "@/config/routes";
const Navbar = () => {
  const { user, isLoggedIn } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const handleLogout = async () => {
    try {
      await logout();
      useAuthStore.getState().logout();
      navigate(routes.customer.home);
    } catch (err) {
      console.error(`error occurred ${err}`);
      alert("Error Occurred during the logout");
    }
  };
  return (
    <nav className="bg-green-900 sticky z-50 shadow-md ">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        <div
          onClick={() => navigate(routes.customer.home)}
          className="font-display text-gray-50 font-bold text-3xl cursor-pointer mt-1"
        >
          Stays <span className="text-yellow-500">Event</span>{" "}
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {!isLoggedIn && (
            <>
              <div
                className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
                  isActive(routes.customer.hotel)
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-white"
                }`}
              >
                Hotels
              </div>
              <div
                className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
                  isActive(routes.customer.events)
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-white"
                }`}
              >
                Events
              </div>
            </>
          )}
          {user?.role.toLowerCase() === "customer" && (
            <>
              <Link
                to="/hotel"
                className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
                  isActive(routes.customer.hotel)
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-white"
                }`}
              >
                Hotels
              </Link>
              <Link
                to="/events"
                className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
                  isActive(routes.customer.events)
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-white"
                }`}
              >
                Events
              </Link>
              <Link
                to="/my-bookings"
                className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
                  isActive(routes.customer.mybooking)
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-white"
                }`}
              >
                My Bookings
              </Link>
              <Link
                to="/wishlist"
                className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
                  isActive(routes.customer.wishlist)
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-white"
                }`}
              >
                Wishlist
              </Link>
            </>
          )}
          {user?.role.toLowerCase() === "vendor" && (
            <Link
              to="/dashboard"
              className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
                isActive(routes.vendor.dashboard)
                  ? "text-yellow-500 border-b-2 border-yellow-500"
                  : "text-white"
              }`}
            >
              Dashboard
            </Link>
          )}
          {user?.role.toLowerCase() === "admin" && (
            <Link
              to="/admin"
              className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
                isActive(routes.admin.dashboard)
                  ? "text-yellow-500 border-b-2 border-yellow-500"
                  : "text-white"
              }`}
            >
              Dashboard
            </Link>
          )}

          {!isLoggedIn && (
            <button
              className="  bg-yellow-600 text-green-900 font-sans font-semibold px-5 py-2 rounded-full hover:bg-yellow-500 text-sm transition-all duration-200"
              onClick={() => navigate("/login")}
            >
              Book Now
            </button>
          )}
          {isLoggedIn && (
            <div className="relative group">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full bg-yellow-600 flex items-center 
    justify-center text-green-900 font-bold text-sm cursor-pointer"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              {/* Dropdown */}
              <div
                className="absolute right-0 top-10 w-44 bg-white rounded-lg shadow-lg 
    border border-green-100 opacity-0 invisible group-hover:opacity-100 
    group-hover:visible transition-all duration-200 z-50"
              >
                <div className="px-4 py-2 text-sm text-green-900 hover:bg-green-50 cursor-pointer">
                  Profile
                </div>
                <div className="px-4 py-2 text-sm text-green-900 hover:bg-green-50 cursor-pointer">
                  Settings
                </div>
                <div className="border-t border-green-100 my-1"></div>
                <div
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer font-medium"
                >
                  Logout
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {menuOpen && (
          <div
            className="absolute top-16 left-0 w-full lg:hidden bg-green-900 
    border-t border-green-700 px-6 py-5 flex flex-col gap-5 shadow-lg z-50"
          >
            {!isLoggedIn && (
              <>
                <Link
                  to={routes.customer.hotel}
                  onClick={() => setMenuOpen(false)}
                  className={`font-sans text-sm font-medium ${
                    isActive(routes.customer.hotel)
                      ? "text-yellow-500"
                      : "text-white"
                  }`}
                >
                  Hotels
                </Link>

                <Link
                  to={routes.customer.events}
                  onClick={() => setMenuOpen(false)}
                  className={`font-sans text-sm font-medium ${
                    isActive(routes.customer.events)
                      ? "text-yellow-500"
                      : "text-white"
                  }`}
                >
                  Events
                </Link>

                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="bg-yellow-600 text-green-900 font-semibold py-2 rounded-full"
                >
                  Book Now
                </button>
              </>
            )}

            {user?.role?.toLowerCase() === "customer" && (
              <>
                <Link
                  to={routes.customer.hotel}
                  onClick={() => setMenuOpen(false)}
                  className={`font-sans text-sm font-medium ${
                    isActive(routes.customer.hotel)
                      ? "text-yellow-500"
                      : "text-white"
                  }`}
                >
                  Hotels
                </Link>

                <Link
                  to={routes.customer.events}
                  onClick={() => setMenuOpen(false)}
                  className={`font-sans text-sm font-medium ${
                    isActive(routes.customer.events)
                      ? "text-yellow-500"
                      : "text-white"
                  }`}
                >
                  Events
                </Link>

                <Link
                  to={routes.customer.mybooking}
                  onClick={() => setMenuOpen(false)}
                  className={`font-sans text-sm font-medium ${
                    isActive(routes.customer.mybooking)
                      ? "text-yellow-500"
                      : "text-white"
                  }`}
                >
                  My Bookings
                </Link>

                <Link
                  to={routes.customer.wishlist}
                  onClick={() => setMenuOpen(false)}
                  className={`font-sans text-sm font-medium ${
                    isActive(routes.customer.wishlist)
                      ? "text-yellow-500"
                      : "text-white"
                  }`}
                >
                  Wishlist
                </Link>
              </>
            )}

            {user?.role?.toLowerCase() === "vendor" && (
              <Link
                to={routes.vendor.dashboard}
                onClick={() => setMenuOpen(false)}
                className={`font-sans text-sm font-medium ${
                  isActive(routes.vendor.dashboard)
                    ? "text-yellow-500"
                    : "text-white"
                }`}
              >
                Dashboard
              </Link>
            )}

            {user?.role?.toLowerCase() === "admin" && (
              <Link
                to={routes.admin.dashboard}
                onClick={() => setMenuOpen(false)}
                className={`font-sans text-sm font-medium ${
                  isActive(routes.admin.dashboard)
                    ? "text-yellow-500"
                    : "text-white"
                }`}
              >
                Dashboard
              </Link>
            )}

            {isLoggedIn && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 text-white py-2 rounded-full font-medium"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
