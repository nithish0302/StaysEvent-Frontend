import React, { useEffect, useState } from "react";
import {
  MapPin,
  X,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getAllEvents } from "@/api/event";
import EventCard from "@/components/event/EventCard";
import EventFilterSidebar from "@/components/event/EventFilterSidebar";
import EventCardSkeleton from "@/components/event/EventCardSkeleton";

const EventListingPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBookingTypeDropdown, setShowBookingTypeDropdown] = useState(false);

  const [filter, setFilter] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    amenities: [],
    category: "",
    bookingType: "",
    status: [],
  });

  const categories = [
    "Wedding",
    "Conference",
    "Concert",
    "Birthday",
    "Corporate",
    "Exhibition",
    "Other",
  ];

  const bookingTypes = ["hall", "ticket"];

  const amenitiesList = [
    "Parking",
    "Catering",
    "AC",
    "WiFi",
    "Stage",
    "Sound System",
    "Photography",
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(filter.category.toLowerCase()),
  );

  const filteredBookingTypes = bookingTypes.filter((type) =>
    type.toLowerCase().includes(filter.bookingType.toLowerCase()),
  );

  const activeFilterCount =
    (filter.amenities.length > 0 ? 1 : 0) +
    (filter.city ? 1 : 0) +
    (filter.minPrice ? 1 : 0) +
    (filter.maxPrice ? 1 : 0) +
    (filter.category ? 1 : 0) +
    (filter.bookingType ? 1 : 0) +
    (filter.status.length > 0 ? 1 : 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [filter, currentPage]);

  const handleSearch = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getAllEvents({
        ...filter,
        page: currentPage,
      });
      setEvents(data.events);
      setTotalEvents(data.totalEvents);
      setTotalPages(data.totalPage);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "minPrice" || name === "maxPrice") &&
      value !== "" &&
      isNaN(value)
    )
      return;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFilter((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const toggleStatus = (status) => {
    setFilter((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((item) => item !== status)
        : [...prev.status, status],
    }));
  };

  const handleClearAll = () => {
    setFilter({
      city: "",
      minPrice: "",
      maxPrice: "",
      amenities: [],
      category: "",
      bookingType: "",
      status: [],
    });
  };

  return (
    <div className="page-wrapper">
      {/* HERO */}
      <section className="bg-green-900 pb-10">
        <div className="container-main">
          <p className="section-eyebrow text-center mb-4">
            Discover events across India
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-white leading-tight mb-10">
            Find Your Next
            <span className="italic text-gold-500"> Experience</span>
          </h1>

          {/* SEARCH BOX */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {/* City */}
              <div className="relative xl:col-span-2">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700"
                />
                <input
                  type="text"
                  name="city"
                  value={filter.city}
                  onChange={handleFilterChange}
                  placeholder="Search by city..."
                  className="w-full bg-green-50 border border-green-100 rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:border-green-900 focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Category dropdown */}
              <div className="relative">
                <input
                  type="text"
                  name="category"
                  value={filter.category}
                  onFocus={() => setShowCategoryDropdown(true)}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }));
                    setShowCategoryDropdown(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowCategoryDropdown(false), 200)
                  }
                  placeholder="All Categories"
                  className="w-full bg-green-50 border border-green-100 rounded-lg py-3.5 px-4 text-sm outline-none focus:border-green-900 focus:bg-white transition-all duration-200"
                />
                {showCategoryDropdown && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[350px] max-w-[90vw] bg-white border border-green-100 rounded-2xl shadow-xl p-4 z-50">
                    <div className="flex flex-wrap gap-2">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setFilter((prev) => ({ ...prev, category }));
                              setShowCategoryDropdown(false);
                            }}
                            className="px-4 py-2 rounded-full bg-green-50 text-green-900 hover:bg-green-100 transition-colors text-sm"
                          >
                            {category}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No categories found
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Type dropdown */}
              <div className="relative">
                <input
                  type="text"
                  name="bookingType"
                  value={filter.bookingType}
                  onFocus={() => setShowBookingTypeDropdown(true)}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      bookingType: e.target.value,
                    }));
                    setShowBookingTypeDropdown(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowBookingTypeDropdown(false), 200)
                  }
                  placeholder="Booking Type"
                  className="w-full bg-green-50 border border-green-100 rounded-lg py-3.5 px-4 text-sm outline-none focus:border-green-900 focus:bg-white transition-all duration-200"
                />
                {showBookingTypeDropdown && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[250px] max-w-[90vw] bg-white border border-green-100 rounded-2xl shadow-xl p-4 z-50">
                    <div className="flex flex-wrap gap-2">
                      {filteredBookingTypes.length > 0 ? (
                        filteredBookingTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setFilter((prev) => ({
                                ...prev,
                                bookingType: type,
                              }));
                              setShowBookingTypeDropdown(false);
                            }}
                            className="px-4 py-2 rounded-full bg-green-50 text-green-900 hover:bg-green-100 transition-colors text-sm capitalize"
                          >
                            {type}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No types found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-green-900 hover:bg-green-800 text-gold-500 rounded-lg px-6 py-3.5 font-medium transition-all duration-200"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
        {/* FIX 6: Mobile filter button — was missing entirely in EventListingPage */}
        <div className="lg:hidden mb-5">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-white border border-green-100 px-4 py-3 rounded-lg shadow-sm text-green-900"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-green-900 text-gold-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* FIX 7: Mobile filter drawer — was missing entirely */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 bg-green-50 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl text-green-900">
                  Filters
                </h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="text-green-900" />
                </button>
              </div>
              <EventFilterSidebar
                filter={filter}
                setFilter={setFilter}
                handleFilterChange={handleFilterChange}
                handleSearch={handleSearch}
                amenitiesList={amenitiesList}
                toggleAmenity={toggleAmenity}
                handleClearAll={handleClearAll}
                setShowMobileFilters={setShowMobileFilters}
                toggleStatus={toggleStatus}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>
        )}

        <div className="flex items-start gap-8 xl:gap-10">
          {/* SIDEBAR */}
          <div className="sticky top-20">
            <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0 ">
              <EventFilterSidebar
                filter={filter}
                setFilter={setFilter}
                handleFilterChange={handleFilterChange}
                handleSearch={handleSearch}
                amenitiesList={amenitiesList}
                toggleAmenity={toggleAmenity}
                handleClearAll={handleClearAll}
                setShowMobileFilters={setShowMobileFilters}
                toggleStatus={toggleStatus}
                activeFilterCount={activeFilterCount}
              />
            </aside>
          </div>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {/* RESULT COUNT */}
            {!isLoading && events.length > 0 && (
              <div className="mb-6">
                <p className="text-green-700 text-sm">
                  Showing{" "}
                  <span className="font-semibold text-green-900">
                    {events.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-green-900">
                    {totalEvents}
                  </span>{" "}
                  events
                  {filter.city && (
                    <>
                      {" "}
                      in{" "}
                      <span className="text-gold-600 font-semibold">
                        {filter.city}
                      </span>
                    </>
                  )}
                </p>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
                {error}
              </div>
            )}

            {/* LOADING */}
            {isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!isLoading && events.length === 0 && (
              <div className="flex flex-col items-center text-center py-24">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <MapPin className="text-green-900" />
                </div>
                <h3 className="font-display text-3xl text-green-900 font-semibold mb-3">
                  No Events Found
                </h3>
                <p className="text-green-700 max-w-sm">
                  Try adjusting your filters or search a different city.
                </p>
              </div>
            )}

            {/* GRID */}
            {!isLoading && events.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-2 rounded-lg border border-green-100 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      currentPage === i + 1
                        ? "bg-green-900 border-green-900 text-gold-500"
                        : "bg-white border-green-100 text-green-900 hover:bg-green-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 rounded-lg border border-green-100 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EventListingPage;
