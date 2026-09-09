import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Pencil,
  Power,
  Trash2,
  Loader2,
  CalendarDays,
  Ticket,
  Building2,
} from "lucide-react";

const VendorEventCard = ({
  event,
  onToggleStatus,
  onDeleteClick,
  isToggling,
}) => {
  const navigate = useNavigate();

  const isHall = event.bookingType === "hall";
  const price = isHall
    ? event.hallDetails?.pricePerDay
    : event.ticketDetails?.price;

  const startDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const statusColors = {
    upcoming: "bg-blue-50 text-blue-800",
    ongoing: "bg-emerald-50 text-emerald-800",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl border border-green-100 overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-32 sm:h-36">
        <img
          src={event.photos?.[0]}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Active badge */}
        <span
          className={`absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full
            ${
              event.isActive
                ? "bg-emerald-50 text-emerald-800"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${event.isActive ? "bg-emerald-600" : "bg-gray-400"}`}
          />
          {event.isActive ? "Active" : "Inactive"}
        </span>

        {/* Event status badge */}
        <span
          className={`absolute top-2.5 left-2.5 text-[11px] font-medium px-2.5 py-1 rounded-full capitalize
            ${statusColors[event.status] || "bg-gray-100 text-gray-600"}`}
        >
          {event.status}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <p className="font-semibold text-green-900 text-[15px] mb-1 truncate">
          {event.name}
        </p>

        <div className="flex items-center gap-1 text-xs text-green-600 mb-1">
          <MapPin size={13} />
          <span className="truncate">
            {event.location?.city}, {event.location?.state}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <CalendarDays size={12} />
          <span>{startDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <p className="flex items-center gap-0.5 text-base font-semibold text-gold-600">
            <IndianRupee size={14} />
            {price?.toLocaleString() ?? "—"}
            <span className="text-xs text-green-500 font-normal ml-1">
              {isHall ? "/ day" : "/ ticket"}
            </span>
          </p>
          <span className="ml-auto flex items-center gap-1 text-[11px] text-gray-500">
            {isHall ? <Building2 size={12} /> : <Ticket size={12} />}
            {isHall ? "Hall" : "Ticket"}
          </span>
        </div>
      </div>

      {/* ACTION ROW */}
      <div className="flex border-t border-green-100">
        <button
          onClick={() => navigate(`/vendor/edit-event/${event._id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-green-900 border-r border-green-100 hover:bg-green-50 transition-colors"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          onClick={() => onToggleStatus(event._id)}
          disabled={isToggling}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs border-r border-green-100 hover:bg-green-50 transition-colors disabled:opacity-50
            ${event.isActive ? "text-green-900" : "text-emerald-700"}`}
        >
          {isToggling ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Power size={14} />
          )}
          {event.isActive ? "Disable" : "Enable"}
        </button>

        <button
          onClick={() => onDeleteClick(event._id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-red-700 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default VendorEventCard;
