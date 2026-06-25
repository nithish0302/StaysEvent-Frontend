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
  Building2,
  Ticket,
} from "lucide-react";

const VendorEventCard = ({
  event,
  onToggleStatus,
  onDeleteClick,
  isToggling,
}) => {
  const navigate = useNavigate();

  const statusColors = {
    upcoming: "bg-blue-50 text-blue-700",
    ongoing: "bg-emerald-50 text-emerald-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-50 text-red-700",
  };

  const isHall = event.bookingType === "hall";

  const price = isHall
    ? event.hallDetails?.pricePerDay
    : event.ticketDetails?.price;

  return (
    <div className="bg-white rounded-xl border border-green-100 overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-36">
        <img
          src={event.photos?.[0]}
          alt={event.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* BADGES */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 items-end">
          <span
            className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${
              event.isActive
                ? "bg-emerald-50 text-emerald-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                event.isActive ? "bg-emerald-600" : "bg-gray-400"
              }`}
            />
            {event.isActive ? "Active" : "Inactive"}
          </span>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${
              statusColors[event.status]
            }`}
          >
            {event.status}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <h3 className="font-semibold text-green-900 text-[15px] truncate">
          {event.name}
        </h3>

        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="flex items-center gap-1 text-xs text-green-600 min-w-0">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">
              {event.location.city}, {event.location.state}
            </span>
          </div>

          <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full shrink-0">
            <CalendarDays size={12} />
            {event.category}
          </span>
        </div>

        <div className="mt-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700">
            {isHall ? (
              <>
                <Building2 size={12} />
                Hall Rental
              </>
            ) : (
              <>
                <Ticket size={12} />
                Ticket
              </>
            )}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1 text-base font-semibold text-gold-600">
          <IndianRupee size={15} />
          {price?.toLocaleString()}
          <span className="text-xs font-normal text-green-500 ml-1">
            / {isHall ? "day" : "ticket"}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
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
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs border-r border-green-100 hover:bg-green-50 transition-colors disabled:opacity-50 ${
            event.isActive ? "text-green-900" : "text-emerald-700"
          }`}
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
