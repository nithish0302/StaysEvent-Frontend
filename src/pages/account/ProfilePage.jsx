import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { updateProfile, changePassword, logout as logoutApi } from "@/api/auth";
import routes from "@/config/routes";
import {
  User,
  Phone,
  Mail,
  Save,
  Loader2,
  CheckCircle2,
  TriangleAlert,
  Lock,
  ShieldCheck,
  Briefcase,
  MapPin,
  CreditCard,
  FileText,
  LogOut,
} from "lucide-react";

const ROLE_BADGE = {
  customer: "bg-blue-50 text-blue-700 border-blue-200",
  vendor: "bg-purple-50 text-purple-700 border-purple-200",
  admin: "bg-amber-50 text-amber-700 border-amber-200",
};

const VENDOR_STATUS_BADGE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-gray-100 text-gray-600 border-gray-300",
};

// ── Profile tab: editable name/phone, read-only email, vendor business info ────
const ProfileTab = ({ user, onSaved }) => {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const vd = user?.vendorDetails || {};
  const isVendor = user?.role === "vendor";

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian phone number");
      return;
    }

    setSaving(true);
    try {
      const data = await updateProfile({ name: name.trim(), phone: phone || null });
      onSaved(data.user);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="bg-white border border-green-100 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-green-900">Basic Details</h2>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-sm">
            <TriangleAlert size={16} /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl text-sm">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-green-800 font-medium flex items-center gap-1.5 mb-1">
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-green-100 p-2.5 rounded-lg text-sm focus:outline-none focus:border-green-400"
            />
          </div>
          <div>
            <label className="text-sm text-green-800 font-medium flex items-center gap-1.5 mb-1">
              <Phone size={14} /> Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full border border-green-100 p-2.5 rounded-lg text-sm focus:outline-none focus:border-green-400"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-green-800 font-medium flex items-center gap-1.5 mb-1">
            <Mail size={14} /> Email Address
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full border border-green-100 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-900 text-white rounded-xl font-medium disabled:opacity-70"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {isVendor && (
        <div className="bg-white border border-green-100 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-900">Business Details</h2>
            <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium capitalize ${VENDOR_STATUS_BADGE[user.vendorStatus] || VENDOR_STATUS_BADGE.pending}`}>
              {user.vendorStatus || "pending"}
            </span>
          </div>
          <p className="text-xs text-gray-400 -mt-2">
            Business details are reviewed by admins and can't be self-edited here. Contact support if something needs to change.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Briefcase size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400">Business Name</p>
                <p className="font-medium text-green-900">{vd.businessName || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Briefcase size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400">Business Type</p>
                <p className="font-medium text-green-900 capitalize">{vd.businessType || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CreditCard size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400">GST Number</p>
                <p className="font-medium text-green-900">{vd.gstNumber || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400">PAN Number</p>
                <p className="font-medium text-green-900">{vd.panNumber || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:col-span-2">
              <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400">Address</p>
                <p className="font-medium text-green-900">
                  {vd.businessAddress ? `${vd.businessAddress}, ` : ""}{vd.city || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Settings tab: change password + logout ─────────────────────────────────────
const SettingsTab = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore — clear local state regardless
    } finally {
      useAuthStore.getState().logout();
      navigate(routes.customer.home);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white border border-green-100 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-green-900 flex items-center gap-2">
          <Lock size={18} /> Change Password
        </h2>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-sm">
            <TriangleAlert size={16} /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl text-sm">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        <div>
          <label className="text-sm text-green-800 font-medium block mb-1">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border border-green-100 p-2.5 rounded-lg text-sm focus:outline-none focus:border-green-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-green-800 font-medium block mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border border-green-100 p-2.5 rounded-lg text-sm focus:outline-none focus:border-green-400"
            />
          </div>
          <div>
            <label className="text-sm text-green-800 font-medium block mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-green-100 p-2.5 rounded-lg text-sm focus:outline-none focus:border-green-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-900 text-white rounded-xl font-medium disabled:opacity-70"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {saving ? "Updating..." : "Update Password"}
        </button>
      </form>

      <div className="bg-white border border-red-100 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-1">Account</h2>
        <p className="text-sm text-gray-500 mb-4">Sign out of your account on this device.</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const activeTab = location.pathname === routes.account.settings ? "settings" : "profile";

  const handleProfileSaved = (updatedUser) => {
    setUser({ ...user, ...updatedUser });
  };

  return (
    <div className="page-wrapper py-10 px-4 sm:px-8 lg:px-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-2xl shrink-0">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">{user?.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium capitalize ${ROLE_BADGE[user?.role] || ROLE_BADGE.customer}`}>
              {user?.role}
            </span>
            <span className="text-xs text-gray-400">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-green-100">
        <button
          onClick={() => navigate(routes.account.profile)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-green-800 text-green-900"
              : "border-transparent text-gray-400 hover:text-green-700"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => navigate(routes.account.settings)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "settings"
              ? "border-green-800 text-green-900"
              : "border-transparent text-gray-400 hover:text-green-700"
          }`}
        >
          Settings
        </button>
      </div>

      {activeTab === "profile" ? (
        <ProfileTab user={user} onSaved={handleProfileSaved} />
      ) : (
        <SettingsTab />
      )}
    </div>
  );
};

export default ProfilePage;
