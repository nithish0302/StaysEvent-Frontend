import React, { useEffect, useState } from "react";
import { getAdminStats, getVendors, updateVendorStatus, getAllUsers } from "@/api/admin";
import {
  Users, Hotel, CalendarDays, BookOpen, IndianRupee,
  Clock, CheckCircle2, XCircle, Loader2, TriangleAlert,
  ShieldCheck, ShieldOff, ChevronDown, X, Phone, Mail, MapPin,
  Building2, FileText, CreditCard, Briefcase,
} from "lucide-react";

const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, sub }) => (
  <div className="bg-white border border-green-100 rounded-2xl p-5 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
      <Icon size={20} className={iconColor} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-green-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-gray-100 text-gray-600 border-gray-300",
};

// Once approved, a vendor can only be suspended (not sent back to
// pending/rejected). A suspended vendor can only be re-activated (approved).
const ALLOWED_TRANSITIONS = {
  pending: ["approved", "rejected"],
  approved: ["suspended"],
  suspended: ["approved"],
  rejected: ["approved"],
};

const ACTION_LABELS = {
  approved: "Approve",
  rejected: "Reject",
  pending: "Set Pending",
  suspended: "Suspend",
};

// ── Vendor Detail Modal ────────────────────────────────────────────────────────
const VendorDetailModal = ({ vendor, onClose, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const vd = vendor.vendorDetails || {};

  const handleStatus = async (status) => {
    setLoading(true);
    try { await onStatusUpdate(vendor._id, status); }
    finally { setLoading(false); }
  };

  const Field = ({ label, value, icon: Icon }) =>
    value ? (
      <div className="flex items-start gap-2">
        {Icon && <Icon size={14} className="text-gray-400 mt-0.5 shrink-0" />}
        <div>
          <p className="text-[11px] text-gray-400 leading-none mb-0.5">{label}</p>
          <p className="text-sm text-green-900 font-medium">{value}</p>
        </div>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-green-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-base shrink-0">
              {vendor.name?.[0]?.toUpperCase() || "V"}
            </div>
            <div>
              <h2 className="font-semibold text-green-900">{vendor.name}</h2>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[vendor.vendorStatus] || STATUS_STYLES.pending}`}>
                {vendor.vendorStatus}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-50 rounded-xl text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Hotel / Event counts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
              <Hotel size={18} className="text-green-700" />
              <div>
                <p className="text-[11px] text-gray-500">Hotels Published</p>
                <p className="text-xl font-bold text-green-900">{vendor.hotelCount ?? 0}</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3">
              <CalendarDays size={18} className="text-blue-700" />
              <div>
                <p className="text-[11px] text-gray-500">Events Published</p>
                <p className="text-xl font-bold text-blue-900">{vendor.eventCount ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Email" value={vendor.email} icon={Mail} />
              <Field label="Phone" value={vd.phone} icon={Phone} />
            </div>
          </div>

          {/* Business */}
          {(vd.businessName || vd.businessType || vd.gstNumber || vd.panNumber) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Business</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Business Name" value={vd.businessName} icon={Briefcase} />
                <Field label="Business Type" value={vd.businessType} icon={Building2} />
                <Field label="GST Number" value={vd.gstNumber} icon={CreditCard} />
                <Field label="PAN Number" value={vd.panNumber} icon={FileText} />
              </div>
            </div>
          )}

          {/* Location */}
          {(vd.city || vd.address) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Location</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="City" value={vd.city} icon={MapPin} />
                <Field label="Address" value={vd.address} icon={MapPin} />
              </div>
            </div>
          )}

          {/* Bio */}
          {vd.bio && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">About</p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{vd.bio}</p>
            </div>
          )}

          {/* Documents */}
          {(vd.idProof || vd.businessDoc) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Documents</p>
              <div className="flex flex-wrap gap-2">
                {vd.idProof && (
                  <a href={vd.idProof} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-700 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                    <FileText size={13} /> ID Proof
                  </a>
                )}
                {vd.businessDoc && (
                  <a href={vd.businessDoc} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-700 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                    <FileText size={13} /> Business Doc
                  </a>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400">
            Registered: {new Date(vendor.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          {/* Action buttons — only the statuses this vendor can actually move to */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-green-50">
            {(ALLOWED_TRANSITIONS[vendor.vendorStatus] || ALLOWED_TRANSITIONS.pending).map((target) => {
              const isReactivate = vendor.vendorStatus === "suspended" && target === "approved";
              const label = isReactivate ? "Activate" : ACTION_LABELS[target];
              const styles =
                target === "approved"
                  ? "flex-1 bg-green-800 text-white"
                  : target === "rejected"
                  ? "flex-1 bg-red-500 text-white"
                  : target === "suspended"
                  ? "flex-1 border border-gray-300 text-gray-700 bg-gray-50"
                  : "border border-amber-300 text-amber-700 bg-amber-50";
              const Icon =
                target === "approved" ? CheckCircle2
                : target === "rejected" ? XCircle
                : target === "suspended" ? ShieldOff
                : Clock;
              return (
                <button
                  key={target}
                  onClick={() => handleStatus(target)}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60 ${styles}`}
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Vendor row ─────────────────────────────────────────────────────────────────
const VendorRow = ({ vendor, onStatusUpdate, onViewDetails }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleUpdate = async (status) => {
    setOpen(false);
    setLoading(true);
    try { await onStatusUpdate(vendor._id, status); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-green-50 last:border-0">
      {/* Clickable vendor info */}
      <button
        onClick={() => onViewDetails(vendor)}
        className="flex items-center gap-3 text-left hover:opacity-75 transition-opacity flex-1 min-w-0"
      >
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold text-sm shrink-0">
          {vendor.name?.[0]?.toUpperCase() || "V"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-green-900 truncate">{vendor.name}</p>
          <p className="text-xs text-gray-400 truncate">{vendor.email}</p>
          {vendor.vendorDetails?.businessName && (
            <p className="text-xs text-gray-400 truncate">{vendor.vendorDetails.businessName}</p>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-green-600 flex items-center gap-0.5">
              <Hotel size={10} /> {vendor.hotelCount ?? 0} hotels
            </span>
            <span className="text-[11px] text-blue-600 flex items-center gap-0.5">
              <CalendarDays size={10} /> {vendor.eventCount ?? 0} events
            </span>
          </div>
        </div>
      </button>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_STYLES[vendor.vendorStatus] || STATUS_STYLES.pending}`}>
          {vendor.vendorStatus}
        </span>
        <div className="relative">
          <button onClick={() => setOpen((v) => !v)} disabled={loading}
            className="flex items-center gap-1 text-xs border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-50 text-green-800 disabled:opacity-50">
            {loading ? <Loader2 size={11} className="animate-spin" /> : <>Update <ChevronDown size={11} /></>}
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-green-100 rounded-xl shadow-lg z-10 overflow-hidden min-w-[120px]">
              {(ALLOWED_TRANSITIONS[vendor.vendorStatus] || ALLOWED_TRANSITIONS.pending).map((s) => {
                const isReactivate = vendor.vendorStatus === "suspended" && s === "approved";
                return (
                  <button key={s} onClick={() => handleUpdate(s)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-green-50 text-green-900">
                    {isReactivate ? "Activate" : ACTION_LABELS[s]}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Admin Dashboard Page ───────────────────────────────────────────────────────
const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendorFilter, setVendorFilter] = useState("pending");
  const [statsLoading, setStatsLoading] = useState(true);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);

  const fmt = (n) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K`
    : `₹${n}`;

  useEffect(() => {
    getAdminStats().then((d) => setStats(d.stats)).catch(() => {}).finally(() => setStatsLoading(false));
    getAllUsers({ limit: 5, role: "customer" }).then((d) => setUsers(d.users || [])).catch(() => {}).finally(() => setUsersLoading(false));
  }, []);

  useEffect(() => {
    setVendorsLoading(true);
    getVendors({ status: vendorFilter || undefined, limit: 20 })
      .then((d) => setVendors(d.vendors || []))
      .catch(() => setError("Failed to load vendors."))
      .finally(() => setVendorsLoading(false));
  }, [vendorFilter]);

  const handleVendorStatusUpdate = async (vendorId, newStatus) => {
    try {
      await updateVendorStatus(vendorId, newStatus);
      setVendors((prev) =>
        prev.map((v) => v._id === vendorId ? { ...v, vendorStatus: newStatus } : v)
      );
      // Keep modal in sync
      setSelectedVendor((prev) =>
        prev?._id === vendorId ? { ...prev, vendorStatus: newStatus } : prev
      );
      // Remove from list if it no longer matches the active filter
      if (vendorFilter && newStatus !== vendorFilter) {
        setVendors((prev) => prev.filter((v) => v._id !== vendorId));
        setSelectedVendor(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="page-wrapper py-10 px-4 sm:px-8 lg:px-16">
      <h1 className="text-2xl font-bold text-green-900 mb-1">Admin Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Platform overview and vendor management</p>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mb-4 text-sm">
          <TriangleAlert size={16} /> {error}
          <button onClick={() => setError("")} className="ml-auto text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Stats */}
      {statsLoading ? (
        <div className="flex justify-center items-center h-24"><Loader2 size={24} className="animate-spin text-green-600" /></div>
      ) : (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Platform Stats</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <StatCard icon={Users} iconBg="bg-blue-100" iconColor="text-blue-700" label="Customers" value={stats?.customers ?? 0} />
            <StatCard icon={ShieldCheck} iconBg="bg-purple-100" iconColor="text-purple-700" label="Vendors" value={stats?.vendors ?? 0} sub={`${stats?.pendingVendors ?? 0} pending`} />
            <StatCard icon={Hotel} iconBg="bg-green-100" iconColor="text-green-700" label="Hotels" value={stats?.hotels ?? 0} />
            <StatCard icon={CalendarDays} iconBg="bg-indigo-100" iconColor="text-indigo-700" label="Events" value={stats?.events ?? 0} />
            <StatCard icon={BookOpen} iconBg="bg-yellow-100" iconColor="text-yellow-700" label="Bookings" value={stats?.bookings ?? 0} />
            <StatCard icon={IndianRupee} iconBg="bg-emerald-100" iconColor="text-emerald-700" label="Revenue" value={stats ? fmt(stats.revenue) : "₹0"} sub="confirmed + completed" />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor management */}
        <div className="bg-white border border-green-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-green-900">Vendor Management</h2>
            <div className="flex gap-1">
              {["", "pending", "approved", "rejected", "suspended"].map((s) => (
                <button key={s} onClick={() => setVendorFilter(s)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${vendorFilter === s ? "bg-green-800 text-white border-green-800" : "border-green-200 text-green-700 hover:bg-green-50"}`}>
                  {s || "All"}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mb-4">Click a vendor name to view full details</p>

          {vendorsLoading ? (
            <div className="flex justify-center items-center h-20"><Loader2 size={20} className="animate-spin text-green-600" /></div>
          ) : vendors.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No vendors found</p>
          ) : (
            <div>
              {vendors.map((v) => (
                <VendorRow
                  key={v._id}
                  vendor={v}
                  onStatusUpdate={handleVendorStatusUpdate}
                  onViewDetails={setSelectedVendor}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent customers */}
        <div className="bg-white border border-green-100 rounded-2xl p-5">
          <h2 className="font-semibold text-green-900 mb-4">Recent Customers</h2>
          {usersLoading ? (
            <div className="flex justify-center items-center h-20"><Loader2 size={20} className="animate-spin text-green-600" /></div>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No users yet</p>
          ) : (
            <div>
              {users.map((u) => (
                <div key={u._id} className="flex items-center gap-3 py-3 border-b border-green-50 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                    {u.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onStatusUpdate={handleVendorStatusUpdate}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
