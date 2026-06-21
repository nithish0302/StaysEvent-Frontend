import React from "react";
import { Star, X } from "lucide-react";

export const HotelFilterSidebar = ({
  activeFilterCount,
  handleClearAll,
  amenitiesList,
  filter,
  toggleAmenity,
  starRatingList,
  setFilter,
  handleSearch,
  setShowMobileFilters,
}) => {
  return (
    <div className="bg-green-100 rounded-xl border border-green-100 shadow-sm p-6 sticky top-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-2xl font-semibold text-green-900">
          Filters
        </h3>

        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="group flex items-center gap-1 text-sm text-gold-600 hover:text-gold-500 transition-all duration-300 animate-[slideFade_.35s_ease]"
          >
            <X
              size={13}
              className="animate-[spinIn_.45s_ease] transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110"
            />

            <span className="transition-all duration-300 group-hover:translate-x-0.5">
              Clear All
            </span>
          </button>
        )}
      </div>

      {/* divider */}
      <div className="h-px bg-gradient-to-r from-gold-300 to-transparent mb-6" />

      {/* AMENITIES */}
      <div className="mb-8">
        <p className="section-eyebrow mb-4">Amenities</p>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filter.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="accent-green-900 cursor-pointer"
              />

              <span className="text-sm text-green-900">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* divider */}
      <div className="h-px bg-green-100 mb-6" />

      {/* STAR RATING */}
      <div className="mb-8">
        <p className="section-eyebrow mb-4">Star Rating</p>

        <div className="flex flex-col gap-3">
          {starRatingList.map((star) => (
            <label
              key={star}
              className="flex items-center gap-2 cursor-pointer group/radio"
            >
              <input
                type="radio"
                name="starRating"
                value={star}
                checked={filter.starRating === String(star)}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, starRating: e.target.value }))
                }
                className="accent-green-800 cursor-pointer"
              />
              <span className="flex items-center gap-1 text-base font-[DM_Sans] text-green-800">
                {star}
                <span className="flex">
                  {[...Array(star)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="fill-gold-500 text-gold-500"
                    />
                  ))}
                </span>
                <span className="text-[#7a9990] text-sm">& above</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* APPLY BUTTON */}
      <button
        onClick={() => {
          handleSearch();
          setShowMobileFilters(false);
        }}
        className="w-full bg-green-900 hover:bg-green-800 text-gold-500 py-3 rounded-lg font-medium transition-all duration-200"
      >
        Apply Filters
      </button>
    </div>
  );
};
