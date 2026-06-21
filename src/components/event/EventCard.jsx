import React from "react";
import { Sparkles, MapPin, IndianRupee, CalendarDays } from "lucide-react";
import { categoryIcons, DefaultCategoryIcon } from "@/constants/categoryIcons";
import { useNavigate } from "react-router-dom";
import { amenityIcons, DefaultAmenityIcon } from "@/constants/amenityIcons";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const CategoryIcon = categoryIcons[event.category] || DefaultCategoryIcon;
  return (
    <div
      onClick={() => navigate(`/event/${event._id}`)}
      className="group flex flex-col overflow-hidden rounded-lg border border-green-100 bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={event?.photos?.[0]}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* STATUS */}
        <div className="absolute left-4 top-4">
          <span className="rounded-xl bg-white/90 px-3 py-1.5 text-sm font-semibold text-green-900 shadow-sm backdrop-blur-md">
            {event.status}
          </span>
        </div>

        {/* FEATURED */}
        {event.isFeatured && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#FFF3C4] px-3 py-1.5 text-xs font-semibold text-gold-600 border border-gold-300 shadow-sm">
            <Sparkles size={12} />
            Featured
          </div>
        )}

        {/* TITLE */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <h2 className="font-display text-3xl font-semibold text-white leading-tight mb-2">
            {event.name}
          </h2>

          <div className="flex items-center gap-1.5 text-white">
            <MapPin size={14} className="text-yellow-500" />

            <span className="font-sans text-sm">
              {event.location.city}, {event.location.state}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        {/* TAGS */}
        <div className="mb-5 flex flex-wrap gap-2">
          <span className="rounded-pill bg-purple-100 px-3 py-1 text-[0.72rem] font-medium text-purple-700">
            {event.bookingType === "hall" ? "Hall Rental" : "Ticket"}
          </span>

          <span className="rounded-pill bg-green-100 px-3 py-1 text-[0.72rem] font-medium text-green-900 flex gap-2">
            <CategoryIcon size={14} />
            {event.category}
          </span>
        </div>
        {/* AMENITIES */}
        <div className="mb-5 flex flex-wrap gap-2">
          {event.amenities?.slice(0, 3).map((amenity) => {
            const Icon = amenityIcons[amenity] || DefaultAmenityIcon;

            return (
              <span
                key={amenity}
                className="flex items-center gap-1.5 rounded-pill bg-green-50 px-3 py-1 text-[0.72rem] font-medium text-green-900 border border-green-100"
              >
                <Icon size={12} />
                {amenity}
              </span>
            );
          })}
        </div>

        {/* DATE */}
        <div className="mb-5 flex items-center gap-2 text-gray-700">
          <CalendarDays size={16} />
          <span className="text-sm font-medium">
            {new Date(event.startDate).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            })}
            {" - "}
            {new Date(event.endDate).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* FOOTER */}
        <div className="mt-auto flex items-center justify-between border-t border-green-100 pt-4">
          {/* PRICE */}
          <div>
            <p className="flex items-center font-manrope text-[1.4rem] font-semibold text-gold-500 leading-none">
              <IndianRupee size={17} strokeWidth={2.5} />
              {event.hallDetails?.pricePerDay?.toLocaleString() ||
                event.ticketDetails?.price?.toLocaleString() ||
                "-"}
            </p>

            <p className="mt-1 text-xs text-gray-500 font-sans">
              {event.bookingType === "hall" ? "per day" : "per ticket"}
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/event/${event._id}`);
            }}
            className="rounded-md bg-green-900 px-5 py-2 text-sm font-semibold text-gold-500 transition-all duration-200 hover:bg-green-700"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
