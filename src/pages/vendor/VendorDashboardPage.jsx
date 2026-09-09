import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorStats } from "@/api/booking";
import useAuthStore from "@/store/authStore";
import routes from "@/config/routes";
import {
  Hotel,
  CalendarDays,
  BookOpen,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, sub }) => (
  <div className="bg-white border border-green-100 rounded-2xl p-5 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
      <Icon size={22} className={iconColor} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-green-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const VendorDashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getVendorStats();
        setStats(data.stats);
      } catch (_) {
        // stats failed — still show empty dashboard
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fmt = (n) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : n >= 1000
        ? `₹${(n / 1000).toFixed(1)}K`
        : `₹${n}`;

  return (
    <div className="page-wrapper py-10 px-4 sm:px-8 lg:px-16">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-900">
          Welcome back, {user?.name?.split(" ")[0] || "Vendor"} 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Here's an overview of your listings and bookings
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 size={32} className="animate-spin text-green-700" />
        </div>
      ) : (
        <>
          {/* ── Listings row ── */}
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Your Listings
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Hotel}
              iconBg="bg-green-100"
              iconColor="text-green-800"
              label="Total Hotels"
              value={stats?.hotels?.total ?? 0}
              sub={`${stats?.hotels?.active ?? 0} active`}
            />
            <StatCard
              icon={CalendarDays}
              iconBg="bg-blue-100"
              iconColor="text-blue-700"
              label="Total Events"
              value={stats?.events?.total ?? 0}
              sub={`${stats?.events?.active ?? 0} active`}
            />
            <StatCard
              icon={BookOpen}
              iconBg="bg-purple-100"
              iconColor="text-purple-700"
              label="Total Bookings"
              value={stats?.bookings?.total ?? 0}
              sub={`${stats?.bookings?.confirmed ?? 0} confirmed`}
            />
            <StatCard
              icon={IndianRupee}
              iconBg="bg-yellow-100"
              iconColor="text-yellow-700"
              label="Revenue"
              value={stats ? fmt(stats.revenue) : "₹0"}
              sub="confirmed + completed"
            />
          </div>

          {/* ── Booking breakdown ── */}
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Booking Status
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              {
                label: "Pending",
                icon: Clock,
                color: "text-amber-600",
                bg: "bg-amber-50",
                key: "pending",
              },
              {
                label: "Confirmed",
                icon: CheckCircle2,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                key: "confirmed",
              },
              {
                label: "Completed",
                icon: TrendingUp,
                color: "text-blue-600",
                bg: "bg-blue-50",
                key: "completed",
              },
              {
                label: "Cancelled",
                icon: XCircle,
                color: "text-red-500",
                bg: "bg-red-50",
                key: "cancelled",
              },
            ].map(({ label, icon: Icon, color, bg, key }) => (
              <div
                key={key}
                className={`${bg} border border-opacity-30 rounded-2xl p-4 flex items-center gap-3`}
              >
                <Icon size={20} className={color} />
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>
                    {stats?.bookings?.[key] ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Quick actions ── */}
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Quick Actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                label: "Add Hotel",
                desc: "List a new hotel property",
                to: routes.vendor.addHotel,
                icon: PlusCircle,
                color: "text-green-700",
              },
              {
                label: "Add Event",
                desc: "Publish a new event listing",
                to: routes.vendor.addEvent,
                icon: PlusCircle,
                color: "text-blue-700",
              },
              {
                label: "My Hotels",
                desc: "Manage your hotel listings",
                to: routes.vendor.myHotel,
                icon: Hotel,
                color: "text-green-700",
              },
              {
                label: "My Events",
                desc: "Manage your event listings",
                to: routes.vendor.myEvents,
                icon: CalendarDays,
                color: "text-blue-700",
              },
              {
                label: "Bookings",
                desc: "View and manage all bookings",
                to: routes.vendor.bookings,
                icon: BookOpen,
                color: "text-purple-700",
              },
            ].map(({ label, desc, to, icon: Icon, color }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                className="bg-white border border-green-100 rounded-2xl p-5 flex items-center justify-between hover:border-green-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={color} />
                  <div>
                    <p className="font-semibold text-green-900">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-300 group-hover:text-green-600 transition-colors"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDashboardPage;
