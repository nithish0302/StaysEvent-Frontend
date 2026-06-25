import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Pencil,
  Power,
  Trash2,
  Loader2,
} from "lucide-react";

const VendorHotelCard = ({
  hotel,
  onToggleStatus,
  onDeleteClick,
  isToggling,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-green-100 overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-32 sm:h-36">
        <img
          src={hotel.photos?.[0]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Status badge */}
        <span
          className={`absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full
            ${
              hotel.isActive
                ? "bg-emerald-50 text-emerald-800"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${hotel.isActive ? "bg-emerald-600" : "bg-gray-400"}`}
          />
          {hotel.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <p className="font-semibold text-green-900 text-[15px] mb-1 truncate">
          {hotel.name}
        </p>
        <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
          <MapPin size={13} />
          <span className="truncate">
            {hotel.location.city}, {hotel.location.state}
          </span>
        </div>
        <p className="flex items-center gap-0.5 text-base font-semibold text-gold-600">
          <IndianRupee size={14} />
          {hotel.pricePerNight.toLocaleString()}
          <span className="text-xs text-green-500 font-normal ml-1">
            / night
          </span>
        </p>
      </div>

      {/* ACTION ROW */}
      <div className="flex border-t border-green-100">
        <button
          onClick={() => navigate(`/vendor/edit-hotel/${hotel._id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-green-900 border-r border-green-100 hover:bg-green-50 transition-colors"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          onClick={() => onToggleStatus(hotel._id)}
          disabled={isToggling}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs border-r border-green-100 hover:bg-green-50 transition-colors disabled:opacity-50
            ${hotel.isActive ? "text-green-900" : "text-emerald-700"}`}
        >
          {isToggling ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Power size={14} />
          )}
          {hotel.isActive ? "Disable" : "Enable"}
        </button>

        <button
          onClick={() => onDeleteClick(hotel._id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-red-700 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default VendorHotelCard;
