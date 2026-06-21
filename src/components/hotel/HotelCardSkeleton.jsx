import React from "react";

const HotelCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-md animate-pulse">
      {/* Image */}
      <div className="h-64 bg-green-100 relative">
        {/* Rating */}
        <div className="absolute top-4 left-4 h-8 w-20 rounded-xl bg-green-200" />

        {/* Featured */}
        <div className="absolute top-4 right-4 h-7 w-24 rounded-full bg-green-200" />

        {/* Hotel Name & Location */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="h-8 w-3/4 rounded bg-green-200 mb-3" />
          <div className="h-4 w-1/2 rounded bg-green-200" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="h-7 w-20 rounded-full bg-green-100" />
          <div className="h-7 w-24 rounded-full bg-green-100" />
          <div className="h-7 w-16 rounded-full bg-green-100" />
          <div className="h-7 w-20 rounded-full bg-green-100" />
        </div>

        {/* Address */}
        <div className="h-4 w-40 bg-green-100 rounded mb-6" />

        {/* Footer */}
        <div className="border-t border-green-100 pt-4 flex justify-between items-center">
          <div>
            <div className="h-8 w-24 bg-green-100 rounded mb-2" />
            <div className="h-3 w-16 bg-green-50 rounded" />
          </div>

          <div className="h-10 w-24 bg-green-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default HotelCardSkeleton;
