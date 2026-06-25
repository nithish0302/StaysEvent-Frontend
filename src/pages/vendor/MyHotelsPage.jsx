import { getMyHotels, deleteHotel, toggleHotelStatus } from "@/api/hotel";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  TriangleAlert,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import HotelCardSkeleton from "@/components/hotel/HotelCardSkeleton";

import VendorHotelCard from "@/components/vendor/VendorHotelCard";

const MyHotelsPage = () => {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);

  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchHotel = async () => {
    setIsLoading(true);
    try {
      const response = await getMyHotels({ page: currentPage });
      setHotels(response.hotels);

      setTotalPages(response.totalPage);
      setTotalHotels(response.totalHotels);
    } catch (err) {
      console.log("Error Occurred", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, [currentPage]);

  const handleToggleStatus = async (hotelId) => {
    setActionLoading(hotelId);
    try {
      await toggleHotelStatus(hotelId);

      setHotels((prevHotels) =>
        prevHotels.map((hotel) =>
          hotel._id === hotelId
            ? { ...hotel, isActive: !hotel.isActive }
            : hotel,
        ),
      );
    } catch (err) {
      console.log("Error Occurred", err);
      setError(err.message || "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!hotelToDelete) return;

    try {
      await deleteHotel(hotelToDelete);
      setHotelToDelete(null);

      if (hotels.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchHotel();
      }
    } catch (err) {
      console.error("Failed to delete hotel:", err);
      setError(err.message || "Failed to delete hotel");
      setHotelToDelete(null);
    }
  };

  return (
    <div className="page-wrapper py-10">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-green-900">
              My Hotels
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              {totalHotels} hotel{totalHotels !== 1 ? "s" : ""} listed
            </p>
          </div>
          <button
            className="flex gap-2 justify-center items-center border border-green-950 bg-green-900 px-3 py-[10px] rounded-lg text-gold-500 hover:bg-green-800 hover:border-green-800 hover:text-yellow-500 transition-all duration-200 w-full sm:w-auto"
            onClick={() => navigate("/vendor/add-hotel")}
          >
            <Plus size={20} />
            Add New Hotel
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <HotelCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && hotels.length === 0 && (
          <div className="mt-10 flex flex-col items-center text-center px-4">
            <Building size={40} className="text-green-300 mb-3" />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">
              No hotels listed yet
            </h3>
            <p className="text-sm sm:text-base mt-2 font-medium text-gray-500 font-label">
              Start earning by listing your first hotel
            </p>

            <button
              onClick={() => navigate("/vendor/add-hotel")}
              className="flex gap-2 items-center justify-center border border-green-950 bg-green-900 hover:bg-green-800 text-gold-500 px-4 py-2.5 rounded-lg mt-4 w-full sm:w-auto"
            >
              <Plus size={18} />
              Add Your First Hotel
            </button>
          </div>
        )}

        {!isLoading && hotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <VendorHotelCard
                key={hotel._id}
                hotel={hotel}
                onToggleStatus={handleToggleStatus}
                onDeleteClick={setHotelToDelete}
                isToggling={actionLoading === hotel._id}
              />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-3 flex-wrap">
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

        {hotelToDelete && (
          <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <TriangleAlert size={28} className="text-red-500" />
                <h2 className="text-xl font-semibold text-green-900">
                  Delete Hotel?
                </h2>
              </div>

              <p className="text-gray-500 mb-6">
                This action cannot be undone. The hotel will be permanently
                removed from your listings.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setHotelToDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete Hotel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHotelsPage;
