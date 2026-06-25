import { getMyEvents, deleteEvent, toggleEventStatus } from "@/api/event";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  TriangleAlert,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EventCardSkeleton from "@/components/event/EventCardSkeleton";
import VendorEventCard from "@/components/event/VendorEventCard";

const MyEventsPage = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const [eventToDelete, setEventToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await getMyEvents({ page: currentPage });
      setEvents(response.events);
      setTotalPages(response.totalPage);
      setTotalEvents(response.totalEvents);
    } catch (err) {
      console.log("Error Occurred", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const handleToggleStatus = async (eventId) => {
    setActionLoading(eventId);
    try {
      await toggleEventStatus(eventId);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, isActive: !event.isActive }
            : event,
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
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete);
      setEventToDelete(null);

      if (events.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchEvents();
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError(err.message || "Failed to delete event");
      setEventToDelete(null);
    }
  };

  return (
    <div className="page-wrapper py-10">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-green-900">
              My Events
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              {totalEvents} event{totalEvents !== 1 ? "s" : ""} listed
            </p>
          </div>
          <button
            className="flex gap-2 justify-center items-center border border-green-950 bg-green-900 px-3 py-[10px] rounded-lg text-gold-500 hover:bg-green-800 hover:border-green-800 hover:text-yellow-500 transition-all duration-200 w-full sm:w-auto"
            onClick={() => navigate("/vendor/add-event")}
          >
            <Plus size={20} />
            Add New Event
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
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="mt-10 flex flex-col items-center text-center px-4">
            <PartyPopper size={40} className="text-green-300 mb-3" />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">
              No events listed yet
            </h3>
            <p className="text-sm sm:text-base mt-2 font-medium text-gray-500 font-label">
              Start earning by listing your first event
            </p>

            <button
              onClick={() => navigate("/vendor/add-event")}
              className="flex gap-2 items-center justify-center border border-green-950 bg-green-900 hover:bg-green-800 text-gold-500 px-4 py-2.5 rounded-lg mt-4 w-full sm:w-auto"
            >
              <Plus size={18} />
              Add Your First Event
            </button>
          </div>
        )}

        {!isLoading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <VendorEventCard
                key={event._id}
                event={event}
                onToggleStatus={handleToggleStatus}
                onDeleteClick={setEventToDelete}
                isToggling={actionLoading === event._id}
              />
            ))}
          </div>
        )}

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

        {eventToDelete && (
          <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <TriangleAlert size={28} className="text-red-500" />
                <h2 className="text-xl font-semibold text-green-900">
                  Delete Event?
                </h2>
              </div>

              <p className="text-gray-500 mb-6">
                This action cannot be undone. The event will be permanently
                removed from your listings.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEventToDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
