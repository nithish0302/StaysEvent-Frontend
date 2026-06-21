import { getEventById } from "@/api/event";
import EventDetailsSkeleton from "@/components/event/EventDetailSkeleton";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TriangleAlert,
  ArrowLeft,
  MapPin,
  Dot,
  Star,
  IndianRupee,
  Sparkles,
  Lock,
  CalendarDays,
  Clock,
  CalendarX,
  CheckCircle2,
  Building2,
  Ticket,
  BedDouble,
  MessageCircle,
  Info,
} from "lucide-react";
import { amenityIcons, DefaultAmenityIcon } from "@/constants/amenityIcons";
import { categoryIcons, DefaultCategoryIcon } from "@/constants/categoryIcons";

const EventsDetailPage = () => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [mapError, setMapError] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const data = await getEventById(id);
        setEvent(data.event);
        setActivePhoto(0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load event");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (error)
    return (
      <div className="page-wrapper flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 px-6 py-4 rounded-xl">
          <TriangleAlert size={20} />
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-green-900 text-gold-500 py-3 px-6 rounded-lg hover:bg-green-800 transition-all duration-200"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    );

  // FIX 2: guard against event being null on first render before fetch resolves
  if (!event) return null;

  const vendor = event.vendorId;
  const isHall = event.bookingType === "hall";

  // FIX 3: category icon + hall purpose helpers (the feature you asked for)
  const CategoryIcon = categoryIcons[event.category] || DefaultCategoryIcon;

  const hallPurposeLabel =
    event.category === "Other"
      ? event.otherCategoryName || null
      : event.category;

  const isGeneralPurpose =
    event.category === "Other" && !event.otherCategoryName;

  // FIX 4: date formatting helper — was missing entirely, left side was empty
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const ticketProgress =
    !isHall && event.ticketDetails.totalSeats
      ? Math.round(
          ((event.ticketDetails.totalSeats -
            event.ticketDetails.availableSeats) /
            event.ticketDetails.totalSeats) *
            100,
        )
      : 0;

  return (
    <div className="page-wrapper">
      <div className="container-main py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-green-900 border border-green-900 text-gold-500 py-2 px-4 rounded-lg hover:bg-green-800 transition-all duration-200 mb-6"
        >
          <ArrowLeft size={18} />
          {/* FIX 5: was "Back to Hotels" on an Event page */}
          Back to Events
        </button>

        {/* PHOTO GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          <div className="lg:col-span-2 relative h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden">
            <img
              src={event.photos[activePhoto]}
              alt={event.name}
              className="w-full h-full object-cover select-none transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {event.isFeatured && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-yellow-100 border border-yellow-400 text-yellow-600 px-3 py-1.5 rounded-full text-sm font-label">
                <Sparkles size={13} />
                Featured
              </div>
            )}

            {/* FIX 6: status badge was missing on the image — added top-right */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-green-900 px-3 py-1.5 rounded-full text-sm font-semibold capitalize">
              {event.status}
            </div>

            <div className="absolute bottom-4 left-4">
              <div className="border border-green-700 px-4 py-2 rounded-full bg-green-900/70 backdrop-blur-sm font-label">
                <div className="flex items-center gap-1.5 text-yellow-400 text-sm">
                  <MapPin size={13} className="text-red-400" />
                  {event.location.address.split(",")[0]}
                </div>
                <div className="text-yellow-300 text-xs pl-5">
                  {event.location.city}, {event.location.state}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-1 lg:pb-0">
            {event.photos.map((photo, index) => (
              <div
                key={index}
                onClick={() => setActivePhoto(index)}
                className={`shrink-0 w-32 lg:w-auto h-[100px] lg:h-[130px] rounded-lg overflow-hidden cursor-pointer select-none transition-all duration-200
                  ${activePhoto === index ? "ring-2 ring-green-900 opacity-100" : "opacity-60 hover:opacity-90"}`}
              >
                <img
                  src={photo}
                  alt={`Event photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT SIDE — FIX 7: was a completely empty div, built out all sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Name + Badges + Info Grid */}
            <div className="bg-white rounded-2xl border border-green-100 p-6">
              <p className="section-eyebrow mb-2">
                {event.category === "Other"
                  ? event.otherCategoryName
                  : event.category}{" "}
                · {event.location.city}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-green-900 mb-4">
                {event.name}
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                  ${
                    isHall
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {isHall ? <Building2 size={13} /> : <Ticket size={13} />}
                  {isHall ? "Hall Rental" : "Ticket"}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-900">
                  <CategoryIcon size={13} />
                  {event.category}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800">
                  {event.isPublic ? "Public Event" : "Invite Only"}
                </span>
              </div>

              <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-4" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2.5">
                  <CalendarDays size={17} className="text-gold-500 shrink-0" />
                  <div>
                    <p className="text-xs text-green-500">Date</p>
                    <p className="font-medium text-green-900">
                      {formatDate(event.startDate)} –{" "}
                      {formatDate(event.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={17} className="text-gold-500 shrink-0" />
                  <div>
                    <p className="text-xs text-green-500">Time</p>
                    <p className="font-medium text-green-900">
                      {event.startTime} – {event.endTime}
                    </p>
                  </div>
                </div>
                {event.registrationDeadline && (
                  <div className="flex items-center gap-2.5">
                    <CalendarX size={17} className="text-gold-500 shrink-0" />
                    <div>
                      <p className="text-xs text-green-500">
                        {isHall ? "Book halls before" : "Registration closes"}
                      </p>
                      <p className="font-medium text-green-900">
                        {formatDate(event.registrationDeadline)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <MapPin size={17} className="text-gold-500 shrink-0" />
                  <div>
                    <p className="text-xs text-green-500">Venue</p>
                    <p className="font-medium text-green-900">
                      {event.location.address}, {event.location.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-green-100 p-6">
              <h2 className="font-display text-xl font-semibold text-green-900 mb-3">
                About This Event
              </h2>
              <p className="text-green-800 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* HALL DETAILS — conditional */}
            {isHall && (
              <div className="bg-white rounded-2xl border border-emerald-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-50 p-2.5 rounded-lg">
                    <Building2 size={20} className="text-green-900" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-green-900">
                      Hall Details
                    </h2>
                    <p className="text-xs text-green-600">
                      Book a hall for your event
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gold-50 rounded-lg p-4 text-center">
                    <p className="text-xl font-semibold text-green-900">
                      ₹{event.hallDetails.pricePerDay.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600">per day</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-xl font-semibold text-green-900">
                      {event.hallDetails.totalHalls}
                    </p>
                    <p className="text-xs text-green-600">total halls</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="text-xl font-semibold text-emerald-700">
                      {event.hallDetails.availableHalls}
                    </p>
                    <p className="text-xs text-emerald-700">available</p>
                  </div>
                </div>

                {/* FIX 8: hall purpose banner — the feature requested */}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-green-50 border border-green-100">
                  {isGeneralPurpose ? (
                    <>
                      <CheckCircle2
                        size={17}
                        className="text-green-700 shrink-0"
                      />
                      <p className="text-sm text-green-900">
                        This hall is available for{" "}
                        <span className="font-semibold">
                          all types of events
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <CategoryIcon
                        size={17}
                        className="text-green-900 shrink-0"
                      />
                      <p className="text-sm text-green-900">
                        This hall is designated for{" "}
                        <span className="font-semibold">
                          {hallPurposeLabel} events only
                        </span>
                      </p>
                    </>
                  )}
                </div>

                {event.hallDetails.availableHalls <= 1 &&
                  event.hallDetails.availableHalls > 0 && (
                    <div className="flex items-center gap-2 mt-3 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-100">
                      <Info size={15} className="text-amber-700 shrink-0" />
                      <p className="text-xs text-amber-800">
                        Only {event.hallDetails.availableHalls} hall left — book
                        before the deadline.
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* TICKET DETAILS — conditional */}
            {!isHall && (
              <div className="bg-white rounded-2xl border border-amber-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-50 p-2.5 rounded-lg">
                    <Ticket size={20} className="text-gold-600" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-green-900">
                    Ticket Details
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gold-50 rounded-lg p-4 text-center">
                    <p className="text-xl font-semibold text-green-900">
                      ₹{event.ticketDetails.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600">per ticket</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-xl font-semibold text-green-900">
                      {event.ticketDetails.totalSeats}
                    </p>
                    <p className="text-xs text-green-600">total seats</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="text-xl font-semibold text-emerald-700">
                      {event.ticketDetails.availableSeats}
                    </p>
                    <p className="text-xs text-emerald-700">available</p>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-green-600 mb-1.5">
                  <span>{ticketProgress}% seats booked</span>
                  <span>
                    {event.ticketDetails.availableSeats} /{" "}
                    {event.ticketDetails.totalSeats} left
                  </span>
                </div>
                <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-900 rounded-full"
                    style={{ width: `${ticketProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Amenities */}
            {event.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-green-100 p-6">
                <h2 className="font-display text-xl font-semibold text-green-900 mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || DefaultAmenityIcon;
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2.5 bg-green-900 text-gold-500 px-4 py-3 rounded-lg"
                      >
                        <Icon size={17} />
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-display text-xl font-semibold text-green-900 mb-4">
                Location
              </h2>
              <div className="w-full h-[280px] rounded-xl overflow-hidden border border-2 border-green-200">
                {mapError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-green-50 gap-3">
                    <MapPin size={32} className="text-green-300" />
                    <p className="text-green-700 text-sm">Unable to load map</p>
                    <a
                      href={`https://www.google.com/maps?q=${event.location.coordinates?.latitude},${event.location.coordinates?.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-900 text-gold-500 rounded-lg text-sm"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                ) : (
                  <iframe
                    title="Hotel Location"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen
                    onError={() => setMapError(true)}
                    src={`https://maps.google.com/maps?q=${event.location.coordinates?.latitude},${event.location.coordinates?.longitude}&z=15&output=embed`}
                  />
                )}
              </div>
            </div>

            {/* NEARBY HOTELS — core StayEvents feature */}
            {event.nearbyHotels?.length > 0 && (
              <div className="bg-white rounded-2xl border border-emerald-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-900 p-2.5 rounded-lg">
                      <BedDouble size={18} className="text-gold-500" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-green-900">
                        Nearby Hotels
                      </h2>
                      <p className="text-xs text-green-600">
                        Stay close to the event · {event.location.city}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                    {event.nearbyHotels.length} hotels
                  </span>
                </div>

                <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-4" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {event.nearbyHotels.map((hotel) => (
                    <div
                      key={hotel._id}
                      onClick={() => navigate(`/hotels/${hotel._id}`)}
                      className="border border-green-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
                    >
                      <div className="h-20 relative overflow-hidden">
                        <img
                          src={hotel.photos?.[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <p className="absolute bottom-1.5 left-2 right-2 text-white text-xs font-medium truncate">
                          {hotel.name}
                        </p>
                      </div>
                      <div className="p-2.5">
                        <div className="flex items-center gap-1 mb-1">
                          <Star
                            size={11}
                            className="fill-gold-500 text-gold-500"
                          />
                          <span className="text-xs font-medium text-green-900">
                            {hotel.avgRating || "New"}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gold-600">
                          ₹{hotel.pricePerNight?.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-green-500">per night</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews placeholder */}
            <div className="bg-white rounded-2xl border border-green-100 p-6">
              <h2 className="font-display text-xl font-semibold text-green-900 mb-4">
                Reviews
              </h2>
              <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
                <MessageCircle
                  size={28}
                  className="text-green-200 mx-auto mb-2"
                />
                <p className="text-green-700 text-sm font-medium">
                  Reviews coming in Week 5
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — Booking Card */}
          <div className="lg:col-span-1 self-start lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <div className="mb-5">
                {isHall && <p className="section-eyebrow mb-2">Hall Rental</p>}
                <div className="flex items-baseline gap-1">
                  <IndianRupee size={22} className="text-gold-500" />
                  <span className="text-4xl font-manrope font-semibold text-green-900">
                    {isHall
                      ? event.hallDetails.pricePerDay.toLocaleString()
                      : event.ticketDetails.price.toLocaleString()}
                  </span>
                </div>
                {/* FIX 9: was hardcoded "per night" for an Event page — now conditional */}
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <span>{isHall ? "per day" : "per ticket"}</span>
                  <Dot size={14} />
                  <span>taxes included</span>
                </div>
                {/* FIX 10: purpose label inside the booking card too */}
                {isHall && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <CategoryIcon size={13} className="text-green-700" />
                    <span className="text-xs text-green-700">
                      {isGeneralPurpose
                        ? "Suitable for all events"
                        : `For ${hallPurposeLabel} events`}
                    </span>
                  </div>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-5" />

              {isHall && (
                <div className="grid grid-cols-2 gap-2 text-center py-4 border-y border-green-100 mb-6">
                  <div>
                    <p className="text-xl font-semibold text-green-900">
                      {event.hallDetails.totalHalls}
                    </p>
                    <p className="text-xs text-green-600">Total Halls</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-emerald-600">
                      {event.hallDetails.availableHalls}
                    </p>
                    <p className="text-xs text-green-600">Available Halls</p>
                  </div>
                </div>
              )}

              {!isHall && (
                <div className="mb-6">
                  {/* FIX 11: was a 2-col grid with stray bg-green-100 on only one cell */}
                  <div className="grid grid-cols-2 gap-2 text-center py-4 border-y border-green-100 mb-3">
                    <div>
                      <p className="text-xl font-semibold text-green-900">
                        {event.ticketDetails.totalSeats}
                      </p>
                      <p className="text-xs text-green-600">Total Tickets</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-emerald-600">
                        {event.ticketDetails.availableSeats}
                      </p>
                      <p className="text-xs text-green-600">
                        Available Tickets
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-900 rounded-full"
                      style={{ width: `${ticketProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-600 mt-1.5 text-center">
                    {ticketProgress}% booked
                  </p>
                </div>
              )}

              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <p className="section-eyebrow mb-3">
                  {isHall ? "Listed By" : "Organized By"}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-900 text-gold-500 flex items-center justify-center font-semibold text-lg shrink-0">
                    {vendor?.name?.charAt(0) || "V"}
                  </div>
                  <div>
                    <p className="font-semibold text-green-900 text-sm">
                      {vendor?.name || "Vendor"}
                    </p>
                    <p className="text-xs text-green-600">
                      {vendor?.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              <button
                disabled
                className="w-full bg-green-900 text-gold-500 py-4 rounded-xl font-semibold text-base opacity-75 cursor-not-allowed transition-all duration-200 mb-3"
              >
                {/* FIX 12: typo "Comming" → "Coming" */}
                {isHall ? "Book Hall" : "Book Ticket"} — Coming Soon
              </button>
              <p className="text-xs text-center text-green-500 flex items-center justify-center gap-1">
                <Lock size={11} />
                Booking available in Week 4
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsDetailPage;
