import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Pencil,
  Power,
  Trash2,
  Loader2,
  Eye,
  X,
  Star,
  BedDouble,
} from "lucide-react";

const HotelDetailModal = ({ hotel, onClose }) => {
  const [activePhoto, setActivePhoto] = useState(0);
  if (!hotel) return null;
  const photos = hotel.photos?.length ? hotel.photos : [];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 overflow-y-auto p-3 sm:p-4"
      onClick={onClose}
    >
      <div className="min-h-full flex items-start sm:items-center justify-center">
        <div
          className="bg-white rounded-xl w-full max-w-lg sm:max-w-2xl my-4 sm:my-8"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="relative h-40 sm:h-56 bg-green-950 rounded-t-xl overflow-hidden">
          <img
            src={photos[activePhoto] || photos[0]}
            alt={hotel.name}
            className="w-full h-full object-contain"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 hover:bg-white"
          >
            <X size={18} className="text-green-900" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-semibold text-green-900">
              {hotel.name}
            </h2>
            <span
              className={`shrink-0 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${
                hotel.isActive
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {hotel.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-green-600 mt-1.5">
            <MapPin size={14} />
            <span>
              {hotel.location?.address}, {hotel.location?.city},{" "}
              {hotel.location?.state} - {hotel.location?.pinCode}
            </span>
          </div>

          {hotel.starRating ? (
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className={
                    i < hotel.starRating
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          ) : null}

          <p className="text-sm text-green-800/80 mt-3 leading-relaxed">
            {hotel.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-[11px] text-green-600 mb-0.5">
                Price / Night
              </p>
              <p className="flex items-center gap-0.5 font-semibold text-green-900">
                <IndianRupee size={14} />
                {hotel.pricePerNight?.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-[11px] text-green-600 mb-0.5">
                Rooms Available
              </p>
              <p className="flex items-center gap-1 font-semibold text-green-900">
                <BedDouble size={14} />
                {hotel.availableRooms} / {hotel.totalRooms}
              </p>
            </div>
          </div>

          {hotel.amenities?.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] text-green-600 mb-1.5">Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {hotel.amenities.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {photos.length > 1 && (
            <div className="mt-4">
              <p className="text-[11px] text-green-600 mb-1.5">
                Photos ({photos.length})
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(i)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      i === activePhoto
                        ? "border-yellow-500"
                        : "border-transparent hover:border-green-200"
                    }`}
                  >
                    <img
                      src={p}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

const VendorHotelCard = ({
  hotel,
  onToggleStatus,
  onDeleteClick,
  isToggling,
}) => {
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-green-100 overflow-hidden">
      {/* IMAGE */}
      <div
        className="relative h-32 sm:h-36 cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
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
      <div
        className="p-3 cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
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
          onClick={() => setShowDetail(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-green-900 border-r border-green-100 hover:bg-green-50 transition-colors"
        >
          <Eye size={14} />
          View
        </button>

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

      {showDetail && (
        <HotelDetailModal hotel={hotel} onClose={() => setShowDetail(false)} />
      )}
    </div>
  );
};

export default VendorHotelCard;
