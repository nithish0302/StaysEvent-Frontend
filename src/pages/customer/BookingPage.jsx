import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getHotelById } from "@/api/hotel";
import { getEventById } from "@/api/event";
import { createBooking } from "@/api/booking";
import { payForBooking } from "@/api/payment";
import useAuthStore from "@/store/authStore";
import routes from "@/config/routes";
import {
  Hotel,
  CalendarDays,
  MapPin,
  Star,
  IndianRupee,
  Users,
  Building2,
  Ticket,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  TriangleAlert,
  User,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";

// ── Step indicator ─────────────────────────────────────────────────────────────
const StepBar = ({ step }) => {
  const steps = ["Choose Options", "Guest Details", "Review & Confirm"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
              ${i < step ? "bg-green-800 border-green-800 text-white" : i === step ? "border-green-800 text-green-800 bg-white" : "border-gray-200 text-gray-400 bg-white"}`}
            >
              {i < step ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span
              className={`text-xs mt-1 font-medium hidden sm:block ${i === step ? "text-green-800" : "text-gray-400"}`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mb-4 ${i < step ? "bg-green-800" : "bg-gray-200"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "hotel"; // "hotel" | "event"
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(0);
  const [listing, setListing] = useState(null);
  const [loadingListing, setLoadingListing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [paymentPending, setPaymentPending] = useState(false);
  const [payingNow, setPayingNow] = useState(false);

  // ── Booking form state ──────────────────────────────────────────────────────
  const [options, setOptions] = useState({
    // hotel
    checkIn: "",
    checkOut: "",
    rooms: 1,
    // event
    eventBookingType: "ticket",
    tickets: 1,
    halls: 1,
    eventDate: "",
  });
  const [guest, setGuest] = useState({
    guestName: user?.name || "",
    guestEmail: user?.email || "",
    guestPhone: "",
    specialRequests: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Fetch listing ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        if (type === "hotel") {
          const data = await getHotelById(id);
          setListing(data.hotel || data);
          // init event booking type from listing
        } else {
          const data = await getEventById(id);
          const e = data.event || data;
          setListing(e);
          setOptions((p) => ({
            ...p,
            eventBookingType: e.bookingType || "ticket",
          }));
        }
      } catch {
        setError("Failed to load listing details.");
      } finally {
        setLoadingListing(false);
      }
    };
    fetch();
  }, [id, type]);

  // ── Derived price ───────────────────────────────────────────────────────────
  const calcPrice = () => {
    if (!listing) return { pricePerUnit: 0, units: 0, total: 0, label: "" };
    if (type === "hotel") {
      const nights =
        options.checkIn && options.checkOut
          ? Math.ceil(
              (new Date(options.checkOut) - new Date(options.checkIn)) /
                86400000,
            )
          : 0;
      const pricePerUnit = listing.pricePerNight;
      const units = Math.max(nights, 0);
      return {
        pricePerUnit,
        units,
        total: pricePerUnit * Number(options.rooms) * units,
        label: `₹${pricePerUnit}/night × ${options.rooms} room${options.rooms > 1 ? "s" : ""} × ${units} night${units !== 1 ? "s" : ""}`,
      };
    } else {
      if (options.eventBookingType === "hall") {
        const price = listing.hallDetails?.pricePerDay || 0;
        return {
          pricePerUnit: price,
          units: Number(options.halls),
          total: price * Number(options.halls),
          label: `₹${price}/hall × ${options.halls} hall${options.halls > 1 ? "s" : ""}`,
        };
      } else {
        const price = listing.ticketDetails?.price || 0;
        return {
          pricePerUnit: price,
          units: Number(options.tickets),
          total: price * Number(options.tickets),
          label: `₹${price}/ticket × ${options.tickets} ticket${options.tickets > 1 ? "s" : ""}`,
        };
      }
    }
  };

  const priceInfo = calcPrice();

  // ── Validation per step ─────────────────────────────────────────────────────
  const validateStep0 = () => {
    const errs = {};
    if (type === "hotel") {
      if (!options.checkIn) errs.checkIn = "Check-in date required";
      if (!options.checkOut) errs.checkOut = "Check-out date required";
      if (
        options.checkIn &&
        options.checkOut &&
        new Date(options.checkOut) <= new Date(options.checkIn)
      )
        errs.checkOut = "Check-out must be after check-in";
      if (!options.rooms || options.rooms < 1)
        errs.rooms = "Select at least 1 room";
    } else {
      if (
        options.eventBookingType === "hall" &&
        (!options.halls || options.halls < 1)
      )
        errs.halls = "Select at least 1 hall";
      if (
        options.eventBookingType === "ticket" &&
        (!options.tickets || options.tickets < 1)
      )
        errs.tickets = "Select at least 1 ticket";
    }
    return errs;
  };

  const validateStep1 = () => {
    const errs = {};
    if (!guest.guestName.trim()) errs.guestName = "Name is required";
    if (!guest.guestEmail.trim()) errs.guestEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.guestEmail))
      errs.guestEmail = "Invalid email";
    if (!guest.guestPhone.trim()) errs.guestPhone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(guest.guestPhone))
      errs.guestPhone = "Invalid Indian phone number";
    return errs;
  };

  const nextStep = () => {
    setError("");
    let errs = {};
    if (step === 0) errs = validateStep0();
    if (step === 1) errs = validateStep1();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const payload = {
        bookingCategory: type,
        ...(type === "hotel"
          ? {
              hotelId: id,
              checkIn: options.checkIn,
              checkOut: options.checkOut,
              rooms: Number(options.rooms),
            }
          : {
              eventId: id,
              eventBookingType: options.eventBookingType,
              halls:
                options.eventBookingType === "hall"
                  ? Number(options.halls)
                  : undefined,
              tickets:
                options.eventBookingType === "ticket"
                  ? Number(options.tickets)
                  : undefined,
              eventDate: options.eventDate || undefined,
            }),
        guestName: guest.guestName,
        guestEmail: guest.guestEmail,
        guestPhone: guest.guestPhone,
        specialRequests: guest.specialRequests || undefined,
      };
      const data = await createBooking(payload);
      const bookingId = data.booking?._id;
      setCreatedBookingId(bookingId);

      // Booking + inventory are reserved server-side; now collect payment.
      try {
        await payForBooking({ bookingId });
        setSuccess(true);
      } catch (payErr) {
        // Booking still exists (reserved) but payment didn't go through —
        // let the customer retry from here or later from My Bookings.
        setPaymentPending(true);
        setError(payErr.message || "Payment was not completed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryPayment = async () => {
    if (!createdBookingId) return;
    setPayingNow(true);
    setError("");
    try {
      await payForBooking({ bookingId: createdBookingId });
      setPaymentPending(false);
      setSuccess(true);
    } catch (payErr) {
      setError(payErr.message || "Payment was not completed.");
    } finally {
      setPayingNow(false);
    }
  };

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
    ) : null;

  const inputCls = (name) =>
    `w-full border p-2.5 rounded-lg text-sm ${fieldErrors[name] ? "border-red-400" : "border-green-100"} focus:outline-none focus:border-green-400`;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loadingListing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-green-700" />
      </div>
    );
  }

  if (!listing && !loadingListing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <TriangleAlert size={40} className="text-red-400" />
        <p className="text-red-600">{error || "Listing not found"}</p>
      </div>
    );
  }

  // ── Payment pending screen ──────────────────────────────────────────────────
  if (paymentPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
          <TriangleAlert size={40} className="text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-green-900">
          Booking Reserved — Payment Pending
        </h1>
        <p className="text-gray-500 text-center max-w-sm">
          Your booking for <strong>{listing?.name}</strong> is reserved, but
          the payment wasn't completed. Complete it now to confirm your
          booking, or pay later from My Bookings.
        </p>
        {error && (
          <p className="text-sm text-red-600 max-w-sm text-center">{error}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={retryPayment}
            disabled={payingNow}
            className="px-6 py-3 bg-green-900 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-70"
          >
            {payingNow && <Loader2 size={16} className="animate-spin" />}
            {payingNow ? "Opening..." : "Pay Now"}
          </button>
          <button
            onClick={() => navigate(routes.customer.mybooking)}
            className="px-6 py-3 border border-green-200 text-green-800 rounded-xl font-medium"
          >
            Pay Later from My Bookings
          </button>
        </div>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={44} className="text-green-700" />
        </div>
        <h1 className="text-2xl font-bold text-green-900">
          Booking Confirmed &amp; Paid!
        </h1>
        <p className="text-gray-500 text-center max-w-sm">
          Your booking for <strong>{listing.name}</strong> has been confirmed
          and payment received. Check your bookings for details.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(routes.customer.mybooking)}
            className="px-6 py-3 bg-green-900 text-white rounded-xl font-medium"
          >
            My Bookings
          </button>
          <button
            onClick={() => navigate(routes.customer.home)}
            className="px-6 py-3 border border-green-200 text-green-800 rounded-xl font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const photo = listing.photos?.[0];
  const city = listing.location?.city;

  return (
    <div className="page-wrapper py-10 px-4 sm:px-8 lg:px-16">
      <h1 className="text-2xl font-bold text-green-900 mb-2">Book Now</h1>
      <p className="text-gray-400 text-sm mb-6">
        Complete the steps below to confirm your booking
      </p>

      <StepBar step={step} />

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
          <TriangleAlert size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Form ── */}
        <div className="lg:col-span-2">
          {/* Step 0 — Options */}
          {step === 0 && (
            <div className="bg-white border border-green-100 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-green-900">
                Booking Options
              </h2>

              {type === "hotel" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-green-800 font-medium block mb-1">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        className={inputCls("checkIn")}
                        min={new Date().toISOString().split("T")[0]}
                        value={options.checkIn}
                        onChange={(e) => {
                          setOptions((p) => ({
                            ...p,
                            checkIn: e.target.value,
                          }));
                          setFieldErrors((p) => ({ ...p, checkIn: undefined }));
                        }}
                      />
                      <FieldError name="checkIn" />
                    </div>
                    <div>
                      <label className="text-sm text-green-800 font-medium block mb-1">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        className={inputCls("checkOut")}
                        min={
                          options.checkIn ||
                          new Date().toISOString().split("T")[0]
                        }
                        value={options.checkOut}
                        onChange={(e) => {
                          setOptions((p) => ({
                            ...p,
                            checkOut: e.target.value,
                          }));
                          setFieldErrors((p) => ({
                            ...p,
                            checkOut: undefined,
                          }));
                        }}
                      />
                      <FieldError name="checkOut" />
                    </div>
                  </div>
                  <div className="sm:w-1/2">
                    <label className="text-sm text-green-800 font-medium block mb-1">
                      Number of Rooms
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={listing.availableRooms}
                      className={inputCls("rooms")}
                      value={options.rooms}
                      onChange={(e) => {
                        setOptions((p) => ({ ...p, rooms: e.target.value }));
                        setFieldErrors((p) => ({ ...p, rooms: undefined }));
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {listing.availableRooms} rooms available
                    </p>
                    <FieldError name="rooms" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-3">
                    {["ticket", "hall"].map((bt) => (
                      <button
                        key={bt}
                        type="button"
                        onClick={() =>
                          setOptions((p) => ({ ...p, eventBookingType: bt }))
                        }
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all
                          ${options.eventBookingType === bt ? "bg-green-800 text-yellow-400 border-green-900" : "border-green-200 text-green-800 hover:bg-green-50"}`}
                      >
                        {bt === "hall" ? (
                          <Building2 size={16} />
                        ) : (
                          <Ticket size={16} />
                        )}
                        {bt === "hall" ? "Hall Rental" : "Ticket"}
                      </button>
                    ))}
                  </div>

                  {options.eventBookingType === "hall" ? (
                    <div className="sm:w-1/2">
                      <label className="text-sm text-green-800 font-medium block mb-1">
                        Number of Halls
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={listing.hallDetails?.availableHalls}
                        className={inputCls("halls")}
                        value={options.halls}
                        onChange={(e) => {
                          setOptions((p) => ({ ...p, halls: e.target.value }));
                          setFieldErrors((p) => ({ ...p, halls: undefined }));
                        }}
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {listing.hallDetails?.availableHalls} halls available
                      </p>
                      <FieldError name="halls" />
                    </div>
                  ) : (
                    <div className="sm:w-1/2">
                      <label className="text-sm text-green-800 font-medium block mb-1">
                        Number of Tickets
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={listing.ticketDetails?.availableSeats}
                        className={inputCls("tickets")}
                        value={options.tickets}
                        onChange={(e) => {
                          setOptions((p) => ({
                            ...p,
                            tickets: e.target.value,
                          }));
                          setFieldErrors((p) => ({ ...p, tickets: undefined }));
                        }}
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {listing.ticketDetails?.availableSeats} seats available
                      </p>
                      <FieldError name="tickets" />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 1 — Guest details */}
          {step === 1 && (
            <div className="bg-white border border-green-100 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-green-900">
                Guest Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-green-800 font-medium flex items-center gap-1.5 mb-1">
                    <User size={14} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className={inputCls("guestName")}
                    value={guest.guestName}
                    onChange={(e) => {
                      setGuest((p) => ({ ...p, guestName: e.target.value }));
                      setFieldErrors((p) => ({ ...p, guestName: undefined }));
                    }}
                  />
                  <FieldError name="guestName" />
                </div>
                <div>
                  <label className="text-sm text-green-800 font-medium flex items-center gap-1.5 mb-1">
                    <Phone size={14} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    className={inputCls("guestPhone")}
                    value={guest.guestPhone}
                    onChange={(e) => {
                      setGuest((p) => ({ ...p, guestPhone: e.target.value }));
                      setFieldErrors((p) => ({ ...p, guestPhone: undefined }));
                    }}
                  />
                  <FieldError name="guestPhone" />
                </div>
              </div>
              <div>
                <label className="text-sm text-green-800 font-medium flex items-center gap-1.5 mb-1">
                  <Mail size={14} />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={inputCls("guestEmail")}
                  value={guest.guestEmail}
                  onChange={(e) => {
                    setGuest((p) => ({ ...p, guestEmail: e.target.value }));
                    setFieldErrors((p) => ({ ...p, guestEmail: undefined }));
                  }}
                />
                <FieldError name="guestEmail" />
              </div>
              <div>
                <label className="text-sm text-green-800 font-medium flex items-center gap-1.5 mb-1">
                  <MessageSquare size={14} />
                  Special Requests{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Any special requirements..."
                  className="w-full border border-green-100 p-2.5 rounded-lg text-sm"
                  value={guest.specialRequests}
                  onChange={(e) =>
                    setGuest((p) => ({ ...p, specialRequests: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          {/* Step 2 — Review */}
          {step === 2 && (
            <div className="bg-white border border-green-100 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-green-900">
                Review Your Booking
              </h2>
              <div className="divide-y divide-green-50">
                <div className="py-3">
                  <p className="text-xs text-gray-400 mb-1">Listing</p>
                  <p className="font-semibold text-green-900">{listing.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={12} />
                    {city}
                  </p>
                </div>
                {type === "hotel" ? (
                  <div className="py-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Check-in</p>
                      <p className="font-medium">{options.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Check-out</p>
                      <p className="font-medium">{options.checkOut}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Rooms</p>
                      <p className="font-medium">{options.rooms}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Nights</p>
                      <p className="font-medium">{priceInfo.units}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Booking Type</p>
                      <p className="font-medium capitalize">
                        {options.eventBookingType}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">
                        {options.eventBookingType === "hall"
                          ? "Halls"
                          : "Tickets"}
                      </p>
                      <p className="font-medium">
                        {options.eventBookingType === "hall"
                          ? options.halls
                          : options.tickets}
                      </p>
                    </div>
                  </div>
                )}
                <div className="py-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Guest Name</p>
                    <p className="font-medium">{guest.guestName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Phone</p>
                    <p className="font-medium">{guest.guestPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 text-xs">Email</p>
                    <p className="font-medium">{guest.guestEmail}</p>
                  </div>
                  {guest.specialRequests && (
                    <div className="col-span-2">
                      <p className="text-gray-400 text-xs">Requests</p>
                      <p className="font-medium">{guest.specialRequests}</p>
                    </div>
                  )}
                </div>
                <div className="py-3">
                  <p className="text-xs text-gray-400 mb-1">Price Breakdown</p>
                  <p className="text-sm text-gray-500">{priceInfo.label}</p>
                  <p className="text-xl font-bold text-green-900 mt-1 flex items-center gap-1">
                    <IndianRupee size={16} />
                    {priceInfo.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-5">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 px-5 py-2.5 border border-green-200 rounded-xl text-green-800 font-medium"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-2.5 border border-green-200 rounded-xl text-green-800 font-medium"
              >
                <ChevronLeft size={16} /> Cancel
              </button>
            )}
            {step < 2 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-900 text-white rounded-xl font-medium"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-900 text-white rounded-xl font-medium disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                {isSubmitting ? "Processing..." : "Confirm & Pay"}
              </button>
            )}
          </div>
        </div>

        {/* ── Summary card ── */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-green-100 rounded-2xl p-5 sticky top-24">
            {photo ? (
              <img
                src={photo}
                alt={listing.name}
                className="w-full h-36 object-cover rounded-xl mb-4"
              />
            ) : (
              <div className="w-full h-36 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                {type === "hotel" ? (
                  <Hotel size={40} className="text-green-300" />
                ) : (
                  <CalendarDays size={40} className="text-green-300" />
                )}
              </div>
            )}
            <h3 className="font-semibold text-green-900 text-base">
              {listing.name}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin size={12} />
              {listing.location?.address}, {city}
            </p>
            {type === "hotel" && listing.starRating && (
              <p className="text-sm flex items-center gap-1 mt-1 text-yellow-600">
                <Star size={12} fill="currentColor" />
                {listing.starRating} Star Hotel
              </p>
            )}
            <div className="border-t border-green-50 mt-4 pt-4">
              <p className="text-xs text-gray-400 mb-1">Estimated Total</p>
              <p className="text-2xl font-bold text-green-900 flex items-center gap-1">
                <IndianRupee size={18} />
                {priceInfo.total.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-400 mt-1">{priceInfo.label}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
