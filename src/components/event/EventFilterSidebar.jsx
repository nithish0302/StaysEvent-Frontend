import React from "react";
import { X } from "lucide-react";

const EventFilterSidebar = ({
  filter,
  setFilter,
  handleFilterChange,
  handleClearAll,
  amenitiesList,
  activeFilterCount,
  toggleAmenity,
  handleSearch,
  setShowMobileFilters,
  toggleStatus,
}) => {
  return (
    <div className="bg-green-100 rounded-xl border border-green-100 shadow-sm p-6 ">
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

      {/* Price */}
      <div className="mb-8">
        <p className="section-eyebrow mb-4">Price Range</p>
        <div className="m-2 flex flex-col gap-2 ">
          <input
            type="text"
            name="minPrice"
            value={filter.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            className="w-full bg-green-50 border border-green-100 rounded-lg py-3.5 px-4 text-sm outline-none focus:border-green-900 focus:bg-white transition-all duration-200 "
          />
          <input
            type="text"
            name="maxPrice"
            value={filter.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            className="w-full bg-green-50 border border-green-100 rounded-lg py-3.5 px-4 text-sm outline-none focus:border-green-900 focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      <div className="mb-8">
        <p className="section-eyebrow mb-4">Status</p>

        <div className="flex flex-col gap-3">
          {["upcoming", "ongoing"].map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer capitalize"
            >
              <input
                type="checkbox"
                checked={filter.status.includes(status)}
                onChange={() => toggleStatus(status)}
                className="accent-green-800"
              />

              <span className="text-green-900">{status}</span>
            </label>
          ))}
        </div>
      </div>
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

export default EventFilterSidebar;
