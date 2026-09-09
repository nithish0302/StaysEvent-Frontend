import React, { useEffect, useState, useCallback } from "react";
import { getVendorBookings, updateBookingStatus } from "@/api/booking";
import {
  Hotel,
  CalendarDays,
  MapPin,
  IndianRupee,
  Building2,
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Loader2,
  TriangleAlert,
  Phone,
  Mail,
  User,
  Search,
  ChevronDown,
} from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle2,
  completed: TrendingUp,
  cancelled: XCircle,
};

const ALLOWED_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const BookingRow = ({ booking, onStatusUpdate }) => {
  const isHotel = booking.bookingCategory === "hotel";
  const listing = isHotel ? booking.hotelId : booking.eventId;
  const StatusIcon = STATUS_ICONS[booking.status] || Clock;
  const [updating, setUpdating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const transitions = ALLOWED_TRANSITIONS[booking.status] || [];
  const photo = listing?.photos?.[0];

  const handleStatusChange = async (newStatus) => {
    setDropdownOpen(false);
    setUpdating(true);
    try {
      await onStatusUpdate(booking._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white border border-green-100 rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <div className="sm:w-36 h-28 sm:h-auto shrink-0 bg-green-50 relative">
          {photo ? (
            <img src={photo} alt={listing?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isHotel ? <Hotel size={28} className="text-green-300" /> : <CalendarDays size={28} className="text-green-300" />}
            </div>
          )}
          <span className={`absolute top-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${isHotel ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
            {isHotel ? "Hotel" : "Event"}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-green-900">{listing?.name || "Listing removed"}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin size={10} />{listing?.location?.city || "—"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[booking.status]}`}>
                <StatusIcon size={11} />
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>

              {/* Status update dropdown */}
              {transitions.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    disabled={updating}
                    className="flex items-center gap-1 text-xs border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-50 text-green-800 disabled:opacity-50"
                  >
                    {updating ? <Loader2 size={11} className="animate-spin" /> : <>Update <ChevronDown size={11} /></>}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-green-100 rounded-xl shadow-lg z-10 overflow-hidden min-w-[130px]">
                      {transitions.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(s)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-green-50 text-green-900"
                        >
                          Mark as {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Booking details */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
            {isHotel ? (
              <>
                <span>Check-in: <strong>{new Date(booking.checkIn).toLocaleDateString("en-IN")}</strong></span>
                <span>Check-out: <strong>{new Date(booking.checkOut).toLocaleDateString("en-IN")}</strong></span>
                <span>Rooms: <strong>{booking.rooms}</strong></span>
              </>
            ) : (
              <>
                {booking.eventBookingType === "hall" ? (
                  <span className="flex items-center gap-1"><Building2 size={12} /> Halls: <strong>{booking.halls}</strong></span>
                ) : (
                  <span className="flex items-center gap-1"><Ticket size={12} /> Tickets: <strong>{booking.tickets}</strong></span>
                )}
              </>
            )}
          </div>

          {/* Guest & Amount row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-green-50">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1"><User size={11} />{booking.guestName}</span>
              <span className="flex items-center gap-1"><Phone size={11} />{booking.guestPhone}</span>
              <span className="flex items-center gap-1"><Mail size={11} />{booking.guestEmail}</span>
            </div>
            <p className="font-bold text-green-900 flex items-center gap-1 text-sm">
              <IndianRupee size={13} />{booking.totalAmount?.toLocaleString("en-IN")}
              <span className="text-xs text-gray-400 font-normal ml-1">
                • {new Date(booking.createdAt).toLocaleDateString("en-IN")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VendorBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      const data = await getVendorBookings(params);
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, page]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const statuses = ["", "pending", "confirmed", "completed", "cancelled"];
  const statusLabels = { "": "All Status", pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" };
  const categories = ["", "hotel", "event"];
  const catLabels = { "": "All Types", hotel: "Hotels", event: "Events" };

  return (
    <div className="page-wrapper py-10 px-4 sm:px-8 lg:px-16">
      <h1 className="text-2xl font-bold text-green-900 mb-1">Bookings</h1>
      <p className="text-gray-400 text-sm mb-6">Manage all customer bookings across your listings</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${statusFilter === s ? "bg-green-800 text-white border-green-800" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
              {statusLabels[s]}
            </button>
          ))}
        </div>
        <div className="w-px bg-green-100" />
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c}
              onClick={() => { setCategoryFilter(c); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${categoryFilter === c ? "bg-blue-700 text-white border-blue-700" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
              {catLabels[c]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mb-4 text-sm">
          <TriangleAlert size={16} /> {error}
          <button onClick={() => setError("")} className="ml-auto text-xs underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 size={32} className="animate-spin text-green-700" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Search size={48} className="text-green-200" />
          <p className="text-green-800 font-medium">No bookings found</p>
          <p className="text-gray-400 text-sm">
            {statusFilter || categoryFilter ? "No bookings match the current filters." : "You haven't received any bookings yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <BookingRow key={b._id} booking={b} onStatusUpdate={handleStatusUpdate} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-medium border transition-all ${p === page ? "bg-green-800 text-white border-green-800" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VendorBookingsPage;
