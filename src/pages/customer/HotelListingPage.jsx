import React, { useEffect, useState } from "react";

import { getAllHotels } from "@/api/hotel";

import {
  MapPin,
  Star,
  ArrowLeft,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  UtensilsCrossed,
  AirVent,
  Sparkles,
  Wine,
  Users,
  BedDouble,
  IndianRupee,
} from "lucide-react";

import HotelCard from "@/components/hotel/HotelCard";

const HotelListingPage = () => {
  const [hotels, setHotels] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalHotels, setTotalHotels] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filter, setFilter] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    amenities: [],
    starRating: "",
  });

  useEffect(() => {
    setHotels([
      {
        _id: "1",
        name: "Golden Palms Retreat",
        location: {
          city: "Mysore",
          state: "Karnataka",
        },
        photos: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        ],
        amenities: ["Pool", "Spa", "Restaurant", "Bar"],
        pricePerNight: 8500,
        avgRating: 4.8,
        isFeatured: true,
      },
    ]);
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);

    setError("");

    try {
      const data = await getAllHotels({
        ...filter,
        page: currentPage,
      });

      setHotels(data.hotels);

      setTotalHotels(data.totalHotels);

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
    ) {
      return;
    }

    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleAmenity = (amenity) => {
    setFilter((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleClearAll = () => {
    setFilter({
      city: "",
      minPrice: "",
      maxPrice: "",
      amenities: [],
      starRating: "",
    });
  };

  const amenitiesList = [
    "WiFi",
    "Pool",
    "Gym",
    "Parking",
    "Restaurant",
    "AC",
    "Spa",
    "Bar",
  ];

  const starRatingList = [5, 4, 3];

  const activeFilterCount =
    filter.amenities.length +
    (filter.starRating ? 1 : 0) +
    (filter.minPrice ? 1 : 0) +
    (filter.maxPrice ? 1 : 0);

  const FilterSidebar = () => (
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

  return (
    <div className="page-wrapper">
      {/* HERO */}
      <section className="bg-green-900  pb-10">
        <div className="container-main">
          {/* eyebrow */}
          <p className="section-eyebrow text-center mb-4">
            Discover hotels across India
          </p>

          {/* heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-white leading-tight mb-10">
            Find Your <span className="italic text-gold-500">Perfect</span> Stay
          </h1>

          {/* SEARCH BOX */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {/* city */}
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

              {/* min */}
              <input
                type="text"
                name="minPrice"
                value={filter.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                className="w-full bg-green-50 border border-green-100 rounded-lg py-3.5 px-4 text-sm outline-none focus:border-green-900 focus:bg-white transition-all duration-200"
              />

              {/* max */}
              <input
                type="text"
                name="maxPrice"
                value={filter.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                className="w-full bg-green-50 border border-green-100 rounded-lg py-3.5 px-4 text-sm outline-none focus:border-green-900 focus:bg-white transition-all duration-200"
              />

              {/* button */}
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

      {/* MAIN */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
        {/* MOBILE FILTER BUTTON */}
        <div className="lg:hidden mb-5">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-white border border-green-100 px-4 py-3 rounded-lg shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* MOBILE FILTER DRAWER */}
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

              <FilterSidebar />
            </div>
          </div>
        )}

        <div className="flex items-start gap-8 xl:gap-10">
          {/* SIDEBAR */}
          <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0">
            <FilterSidebar />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {/* RESULT COUNT */}
            {!isLoading && hotels.length > 0 && (
              <div className="mb-6">
                <p className="text-green-700 text-sm">
                  Showing{" "}
                  <span className="font-semibold text-green-900">
                    {hotels.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-green-900">
                    {totalHotels}
                  </span>{" "}
                  hotels
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-xl h-[460px] animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!isLoading && hotels.length === 0 && (
              <div className="flex flex-col items-center text-center py-24">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <MapPin className="text-green-900" />
                </div>

                <h3 className="font-display text-3xl text-green-900 font-semibold mb-3">
                  No Hotels Found
                </h3>

                <p className="text-green-700 max-w-sm">
                  Try adjusting your filters or search a different city.
                </p>
              </div>
            )}

            {/* GRID */}
            {!isLoading && hotels.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} />
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

export default HotelListingPage;
