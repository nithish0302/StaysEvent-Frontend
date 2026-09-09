import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "@/api/booking";
import {
  Hotel,
  CalendarDays,
  MapPin,
  IndianRupee,
  Building2,
  Ticket,
  XCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Loader2,
  TriangleAlert,
  Search,
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

const BookingCard = ({ booking, onCancel }) => {
  const isHotel = booking.bookingCategory === "hotel";
  const listing = isHotel ? booking.hotelId : booking.eventId;
  const StatusIcon = STATUS_ICONS[booking.status] || Clock;
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancel(booking._id);
    } finally {
      setCancelling(false);
      setShowConfirm(false);
    }
  };

  const photo = listing?.photos?.[0];

  return (
    <div className="bg-white border border-green-100 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
      {/* Photo */}
      <div className="sm:w-44 h-36 sm:h-auto shrink-0 bg-green-50 relative">
        {photo ? (
          <img src={photo} alt={listing?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isHotel ? <Hotel size={36} className="text-green-300" /> : <CalendarDays size={36} className="text-green-300" />}
          </div>
        )}
        <span className={`absolute top-2 left-2 text-[11px] font-medium px-2 py-0.5 rounded-full border ${isHotel ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
          {isHotel ? "Hotel" : "Event"}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-green-900">{listing?.name || "Listing removed"}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={11} />{listing?.location?.city || "—"}
            </p>
          </div>
          <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[booking.status]}`}>
            <StatusIcon size={12} />
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        {/* Booking details */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {isHotel ? (
            <>
              <span>Check-in: <strong>{new Date(booking.checkIn).toLocaleDateString("en-IN")}</strong></span>
              <span>Check-out: <strong>{new Date(booking.checkOut).toLocaleDateString("en-IN")}</strong></span>
              <span>Rooms: <strong>{booking.rooms}</strong></span>
            </>
          ) : (
            <>
              {booking.eventBookingType === "hall" ? (
                <span className="flex items-center gap-1"><Building2 size={13} /> Halls: <strong>{booking.halls}</strong></span>
              ) : (
                <span className="flex items-center gap-1"><Ticket size={13} /> Tickets: <strong>{booking.tickets}</strong></span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-2 border-t border-green-50">
          <p className="font-bold text-green-900 flex items-center gap-1">
            <IndianRupee size={14} />{booking.totalAmount?.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-400">
            Booked {new Date(booking.createdAt).toLocaleDateString("en-IN")}
          </p>

          {["pending", "confirmed"].includes(booking.status) && (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Cancel confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <TriangleAlert size={24} className="text-red-500" />
              <h3 className="font-semibold text-green-900">Cancel Booking?</h3>
            </div>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone. Your booking will be marked as cancelled.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                Keep Booking
              </button>
              <button onClick={handleCancel} disabled={cancelling}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm flex items-center gap-2 disabled:opacity-60">
                {cancelling && <Loader2 size={14} className="animate-spin" />}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MyBookingPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyBookings({ status: statusFilter || undefined, page, limit: 8 });
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId, "Customer requested cancellation");
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Cancellation failed");
    }
  };

  const statuses = ["", "pending", "confirmed", "completed", "cancelled"];
  const statusLabels = { "": "All", pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" };

  return (
    <div className="page-wrapper py-10 px-4 sm:px-8 lg:px-16">
      <h1 className="text-2xl font-bold text-green-900 mb-1">My Bookings</h1>
      <p className="text-gray-400 text-sm mb-6">Track and manage all your reservations</p>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${statusFilter === s ? "bg-green-800 text-white border-green-800" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mb-4 text-sm">
          <TriangleAlert size={16} /> {error}
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
            {statusFilter ? `No ${statusFilter} bookings yet.` : "You haven't made any bookings yet."}
          </p>
          <button onClick={() => navigate("/")} className="px-5 py-2.5 bg-green-900 text-white rounded-xl text-sm">
            Explore Hotels & Events
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <BookingCard key={b._id} booking={b} onCancel={handleCancel} />
            ))}
          </div>

          {/* Pagination */}
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

export default MyBookingPage;
