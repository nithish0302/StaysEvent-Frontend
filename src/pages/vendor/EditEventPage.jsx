import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "@/api/event";
import { amenityIcons, DefaultAmenityIcon } from "@/constants/amenityIcons";
import { categoryIcons, DefaultCategoryIcon } from "@/constants/categoryIcons";
import PhotoUploadSection from "@/components/common/PhotoUploadSection";
import {
  PartyPopper,
  MapPin,
  Calendar,
  Globe,
  Lock,
  Building2,
  Ticket,
  Gem,
  TriangleAlert,
  Locate,
  Loader2,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { TbCalendarCog } from "react-icons/tb";
import routes from "@/config/routes";

// Helper: format a date string/Date to "yyyy-MM-dd" for <input type="date">
const toDateInput = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d)) return typeof val === "string" ? val.slice(0, 10) : "";
  return d.toISOString().slice(0, 10);
};

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotoUrls, setNewPhotoUrls] = useState([]);
  const [isPhotosUploading, setIsPhotosUploading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const categories = [
    "Wedding", "Conference", "Concert", "Birthday", "Corporate", "Exhibition", "Other",
  ];

  const eventAmenitiesList = [
    "Parking", "Catering", "AC", "WiFi", "Stage", "Sound System", "Photography",
  ];

  // ── fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getEventById(id);
        const e = data.event || data;
        setEventData({
          name: e.name || "",
          description: e.description || "",
          category: e.category || "",
          otherCategoryName: e.otherCategoryName || "",
          bookingType: e.bookingType || "hall",
          hallDetails: {
            pricePerDay: e.hallDetails?.pricePerDay ?? 0,
            totalHalls: e.hallDetails?.totalHalls ?? 0,
          },
          ticketDetails: {
            price: e.ticketDetails?.price ?? 0,
            totalSeats: e.ticketDetails?.totalSeats ?? 0,
          },
          location: {
            city: e.location?.city || "",
            state: e.location?.state || "",
            address: e.location?.address || "",
            pinCode: e.location?.pinCode || "",
            coordinates: {
              longitude: e.location?.coordinates?.longitude ?? "",
              latitude: e.location?.coordinates?.latitude ?? "",
            },
          },
          startDate: toDateInput(e.startDate),
          endDate: toDateInput(e.endDate),
          startTime: e.startTime || "",
          endTime: e.endTime || "",
          registrationDeadline: toDateInput(e.registrationDeadline),
          isPublic: e.isPublic !== undefined ? e.isPublic : true,
          amenities: e.amenities || [],
        });
        setExistingPhotos(e.photos || []);
      } catch (err) {
        setError("Failed to load event details. Please go back and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  // ── derived ────────────────────────────────────────────────────────────────
  const isHall = eventData?.bookingType === "hall";
  const isOtherCategory = eventData?.category === "Other";

  // ── helpers ────────────────────────────────────────────────────────────────
  const clearFieldError = (name) =>
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const selectCategory = (category) => {
    setEventData((prev) => ({
      ...prev,
      category,
      otherCategoryName: category === "Other" ? prev.otherCategoryName : "",
    }));
    clearFieldError("category");
    clearFieldError("otherCategoryName");
  };

  const toggleBookingType = (type) => {
    setEventData((prev) => ({ ...prev, bookingType: type }));
    ["pricePerDay", "totalHalls", "price", "totalSeats"].forEach(clearFieldError);
  };

  const handleHallDetailChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      hallDetails: { ...prev.hallDetails, [name]: Number(value) },
    }));
    clearFieldError(name);
  };

  const handleTicketDetailChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      ticketDetails: { ...prev.ticketDetails, [name]: Number(value) },
    }));
    clearFieldError(name);
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    if (name === "longitude" || name === "latitude") {
      setEventData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: { ...prev.location.coordinates, [name]: value },
        },
      }));
    } else {
      setEventData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    }
    clearFieldError(name);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation is not supported by your browser"); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setEventData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
            },
          },
        }));
        clearFieldError("latitude");
        clearFieldError("longitude");
        setIsLocating(false);
      },
      () => { setError("Unable to retrieve your location"); setIsLocating(false); },
    );
  };

  const togglePublic = (value) =>
    setEventData((prev) => ({ ...prev, isPublic: value }));

  const toggleAmenity = (amenityName) => {
    setEventData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter((a) => a !== amenityName)
        : [...prev.amenities, amenityName],
    }));
    clearFieldError("amenities");
  };

  const removeExistingPhoto = (url) =>
    setExistingPhotos((prev) => prev.filter((p) => p !== url));

  // ── validation ─────────────────────────────────────────────────────────────
  const validation = () => {
    const errors = {};
    if (!eventData.name.trim()) errors.name = "Event name is required";
    if (!eventData.description.trim()) errors.description = "Event description is required";
    if (!eventData.category) errors.category = "Please select a category";
    if (isOtherCategory && !eventData.otherCategoryName.trim())
      errors.otherCategoryName = "Please specify the event category name";

    if (isHall) {
      if (!eventData.hallDetails.pricePerDay || eventData.hallDetails.pricePerDay <= 0)
        errors.pricePerDay = "Price per day must be greater than 0";
      if (!eventData.hallDetails.totalHalls || eventData.hallDetails.totalHalls <= 0)
        errors.totalHalls = "Total halls must be greater than 0";
    } else {
      if (!eventData.ticketDetails.price || eventData.ticketDetails.price <= 0)
        errors.price = "Ticket price must be greater than 0";
      if (!eventData.ticketDetails.totalSeats || eventData.ticketDetails.totalSeats <= 0)
        errors.totalSeats = "Total seats must be greater than 0";
    }

    if (!eventData.location.address.trim()) errors.address = "Address is required";
    if (!eventData.location.city.trim()) errors.city = "City is required";
    if (!eventData.location.state.trim()) errors.state = "State is required";
    if (!eventData.location.pinCode?.trim()) {
      errors.pinCode = "Pin code is required";
    } else if (!/^\d{6}$/.test(eventData.location.pinCode)) {
      errors.pinCode = "Pin code must be 6 digits";
    }

    const { latitude, longitude } = eventData.location.coordinates;
    if (latitude !== "" && (isNaN(latitude) || latitude < -90 || latitude > 90))
      errors.latitude = "Latitude must be between -90 and 90";
    if (longitude !== "" && (isNaN(longitude) || longitude < -180 || longitude > 180))
      errors.longitude = "Longitude must be between -180 and 180";

    if (!eventData.startDate) errors.startDate = "Start date is required";
    if (!eventData.endDate) errors.endDate = "End date is required";
    if (eventData.startDate && eventData.endDate && new Date(eventData.endDate) < new Date(eventData.startDate))
      errors.endDate = "End date must be after start date";
    if (!eventData.startTime) errors.startTime = "Start time is required";
    if (!eventData.endTime) errors.endTime = "End time is required";

    if (
      eventData.registrationDeadline &&
      eventData.startDate &&
      new Date(eventData.registrationDeadline) >= new Date(eventData.startDate)
    ) {
      errors.registrationDeadline = "Registration deadline must be before the start date";
    }

    if (!eventData.amenities?.length) errors.amenities = "Select at least one amenity";

    const totalPhotos = existingPhotos.length + newPhotoUrls.length;
    if (totalPhotos === 0) errors.photos = "At least one photo is required";

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    if (isPhotosUploading) { setError("Please wait for photos to finish uploading"); return; }
    const { isValid, errors } = validation();
    if (!isValid) { setFieldErrors(errors); setError("Please fix the highlighted fields below"); return; }
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const payload = {
        ...eventData,
        hallDetails: isHall ? eventData.hallDetails : null,
        ticketDetails: isHall ? null : eventData.ticketDetails,
        photos: [...existingPhotos, ...newPhotoUrls],
      };
      await updateEvent(id, payload);
      navigate(routes.vendor.myEvents);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldError = ({ name }) =>
    fieldErrors[name] ? <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p> : null;

  const inputClass = (name) =>
    `w-full border p-2 rounded-md placeholder:text-green-800/50 ${fieldErrors[name] ? "border-red-400" : "border-green-100"}`;

  // ── loading / error states ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={36} className="text-green-700 animate-spin" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <TriangleAlert size={40} className="text-red-400" />
        <p className="text-red-600 text-center">{error || "Event not found."}</p>
        <button onClick={() => navigate(routes.vendor.myEvents)} className="px-4 py-2 bg-green-900 text-white rounded-lg">
          Back to My Events
        </button>
      </div>
    );
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper py-10">
      <div className="px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-6">
          <h1 className="font-semibold text-2xl sm:text-3xl">Edit Event</h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Update your event details below
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl mb-6">
            <TriangleAlert size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ── Basic Info ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-1">
              <PartyPopper className="text-green-800 border border-green-100 py-2 px-1 bg-green-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Basic Information</h2>
            </div>

            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium">Event Name</p>
              <input type="text" name="name" placeholder="eg: Chennai Music Festival"
                className={`${inputClass("name")} w-full md:w-1/2 my-2`}
                value={eventData.name} onChange={handleChange} />
              <FieldError name="name" />
            </div>

            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium">Description</p>
              <textarea name="description" rows={3}
                placeholder="Describe your event..."
                className={`${inputClass("description")} w-full md:w-1/2 my-2`}
                value={eventData.description} onChange={handleChange} />
              <FieldError name="description" />
            </div>

            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium mb-2">Category</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat] || DefaultCategoryIcon;
                  const selected = eventData.category === cat;
                  return (
                    <button key={cat} type="button" onClick={() => selectCategory(cat)}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-sm
                        ${selected ? "bg-green-800 text-yellow-400 border-green-900" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
                      <Icon size={18} className="shrink-0" />
                      <span className="truncate">{cat}</span>
                    </button>
                  );
                })}
              </div>
              <FieldError name="category" />
              {isOtherCategory && (
                <div className="mt-3">
                  <input type="text" name="otherCategoryName"
                    placeholder="Specify event category"
                    className={`${inputClass("otherCategoryName")} w-full md:w-1/2`}
                    value={eventData.otherCategoryName} onChange={handleChange} />
                  <FieldError name="otherCategoryName" />
                </div>
              )}
            </div>
          </div>

          {/* ── Booking Type ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <Building2 className="text-blue-600 border border-blue-50 py-2 px-1 bg-blue-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Booking Type</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button type="button" onClick={() => toggleBookingType("hall")}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                  ${isHall ? "bg-green-800 text-yellow-400 border-green-900" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
                <Building2 size={20} />
                <span className="font-medium">Hall Rental</span>
              </button>
              <button type="button" onClick={() => toggleBookingType("ticket")}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                  ${!isHall ? "bg-green-800 text-yellow-400 border-green-900" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
                <Ticket size={20} />
                <span className="font-medium">Ticket</span>
              </button>
            </div>

            {isHall ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p>Price Per Day (₹)</p>
                  <input type="text" name="pricePerDay" placeholder="eg: 85000"
                    className={`${inputClass("pricePerDay")} mt-1`}
                    value={eventData.hallDetails.pricePerDay}
                    onChange={handleHallDetailChange} />
                  <FieldError name="pricePerDay" />
                </div>
                <div>
                  <p>Total Halls</p>
                  <input type="text" name="totalHalls" placeholder="eg: 5"
                    className={`${inputClass("totalHalls")} mt-1`}
                    value={eventData.hallDetails.totalHalls}
                    onChange={handleHallDetailChange} />
                  <FieldError name="totalHalls" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p>Ticket Price (₹)</p>
                  <input type="text" name="price" placeholder="eg: 999"
                    className={`${inputClass("price")} mt-1`}
                    value={eventData.ticketDetails.price}
                    onChange={handleTicketDetailChange} />
                  <FieldError name="price" />
                </div>
                <div>
                  <p>Total Seats</p>
                  <input type="text" name="totalSeats" placeholder="eg: 500"
                    className={`${inputClass("totalSeats")} mt-1`}
                    value={eventData.ticketDetails.totalSeats}
                    onChange={handleTicketDetailChange} />
                  <FieldError name="totalSeats" />
                </div>
              </div>
            )}
          </div>

          {/* ── Location ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <MapPin className="text-yellow-600 border border-yellow-50 py-2 px-1 bg-yellow-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Location</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-800 font-medium mb-1">Address</p>
                  <input type="text" name="address" placeholder="eg: Palace Grounds, Jayamahal Road"
                    className={inputClass("address")} value={eventData.location.address} onChange={handleLocationChange} />
                  <FieldError name="address" />
                </div>
                <div>
                  <p className="text-green-800 font-medium mb-1">City</p>
                  <input type="text" name="city" placeholder="eg: Bengaluru"
                    className={inputClass("city")} value={eventData.location.city} onChange={handleLocationChange} />
                  <FieldError name="city" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-800 font-medium mb-1">State</p>
                  <input type="text" name="state" placeholder="eg: Karnataka"
                    className={inputClass("state")} value={eventData.location.state} onChange={handleLocationChange} />
                  <FieldError name="state" />
                </div>
                <div>
                  <p className="text-green-800 font-medium mb-1">Pincode</p>
                  <input type="text" name="pinCode" placeholder="eg: 560001"
                    className={inputClass("pinCode")} value={eventData.location.pinCode} onChange={handleLocationChange} />
                  <FieldError name="pinCode" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <p className="text-green-800 font-medium">Coordinates <span className="text-gray-400 text-sm font-normal">(optional)</span></p>
                  <button type="button" onClick={useCurrentLocation} disabled={isLocating}
                    className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-900 disabled:opacity-50">
                    {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Locate size={14} />}
                    Use My Location
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input type="text" name="latitude" placeholder="eg: 12.9981"
                      className={inputClass("latitude")} value={eventData.location.coordinates.latitude} onChange={handleLocationChange} />
                    <FieldError name="latitude" />
                  </div>
                  <div>
                    <input type="text" name="longitude" placeholder="eg: 77.5920"
                      className={inputClass("longitude")} value={eventData.location.coordinates.longitude} onChange={handleLocationChange} />
                    <FieldError name="longitude" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Date & Time ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <Calendar className="text-purple-600 border border-purple-50 py-2 px-1 bg-purple-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Date & Time</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-green-800 font-medium mb-1">Start Date</p>
                <input type="date" name="startDate" className={inputClass("startDate")}
                  value={eventData.startDate} onChange={handleChange} />
                <FieldError name="startDate" />
              </div>
              <div>
                <p className="text-green-800 font-medium mb-1">End Date</p>
                <input type="date" name="endDate" className={inputClass("endDate")}
                  value={eventData.endDate} onChange={handleChange} />
                <FieldError name="endDate" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-green-800 font-medium mb-1">Start Time</p>
                <input type="time" name="startTime" className={inputClass("startTime")}
                  value={eventData.startTime} onChange={handleChange} />
                <FieldError name="startTime" />
              </div>
              <div>
                <p className="text-green-800 font-medium mb-1">End Time</p>
                <input type="time" name="endTime" className={inputClass("endTime")}
                  value={eventData.endTime} onChange={handleChange} />
                <FieldError name="endTime" />
              </div>
            </div>
            <div className="sm:w-1/2">
              <p className="text-green-800 font-medium mb-1">
                Registration Deadline <span className="text-gray-400 text-sm">(optional)</span>
              </p>
              <input type="date" name="registrationDeadline" className={inputClass("registrationDeadline")}
                value={eventData.registrationDeadline} onChange={handleChange} />
              <FieldError name="registrationDeadline" />
            </div>
          </div>

          {/* ── Visibility ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <Globe className="text-emerald-600 border border-emerald-50 py-2 px-1 bg-emerald-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Event Visibility</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => togglePublic(true)}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                  ${eventData.isPublic ? "bg-green-800 text-yellow-400 border-green-900" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
                <Globe size={18} />
                <span className="font-medium">Public Event</span>
              </button>
              <button type="button" onClick={() => togglePublic(false)}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                  ${!eventData.isPublic ? "bg-green-800 text-yellow-400 border-green-900" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
                <Lock size={18} />
                <span className="font-medium">Invite Only</span>
              </button>
            </div>
          </div>

          {/* ── Amenities ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-2">
              <Gem className="text-purple-600 border border-purple-50 py-2 px-1 bg-purple-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Amenities</h2>
            </div>
            <p className="sm:ml-12 text-gray-400 text-sm">Select all that apply</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
              {eventAmenitiesList.map((amenity) => {
                const Icon = amenityIcons[amenity] || DefaultAmenityIcon;
                const selected = eventData.amenities.includes(amenity);
                return (
                  <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-sm
                      ${selected ? "bg-green-800 text-yellow-400 border-green-900" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
                    <Icon size={18} className="shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
            <FieldError name="amenities" />
          </div>

          {/* ── Photos ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <ImagePlus className="text-orange-600 border border-orange-50 py-2 px-1 bg-orange-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Photos</h2>
            </div>

            {existingPhotos.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-green-700 font-medium mb-2">Current Photos</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {existingPhotos.map((url, i) => (
                    <div key={url} className="relative h-24 rounded-xl border border-green-200 overflow-hidden">
                      <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingPhoto(url)}
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-green-700 font-medium mb-2">Add New Photos</p>
            <PhotoUploadSection
              preset={import.meta.env.VITE_CLOUDINARY_HOTEL_PRESET}
              onUrlsChange={setNewPhotoUrls}
              onUploadingChange={setIsPhotosUploading}
              error={fieldErrors.photos}
              maxPhotos={10 - existingPhotos.length}
            />
          </div>

          {/* ── Actions ── */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button type="button" onClick={() => setShowCancelConfirm(true)}
              className="w-full sm:w-48 bg-white py-3 rounded-xl border border-green-100 text-lg font-medium order-2 sm:order-1">
              Cancel
            </button>
            <button type="button" disabled={isSubmitting || isPhotosUploading}
              onClick={() => setShowSaveConfirm(true)}
              className="w-full sm:w-80 flex items-center justify-center gap-2 bg-green-900 py-3 rounded-xl text-gold-500 text-lg font-medium disabled:opacity-70 order-1 sm:order-2">
              {isSubmitting ? (
                <><div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />Saving...</>
              ) : (
                <><TbCalendarCog size={20} />Save Changes</>
              )}
            </button>
          </div>

          {/* Cancel confirm */}
          {showCancelConfirm && (
            <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <TriangleAlert size={28} className="text-yellow-500" />
                  <h2 className="text-xl font-semibold text-green-900">Discard Changes?</h2>
                </div>
                <p className="text-gray-500 mb-6">All unsaved changes will be lost.</p>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowCancelConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg">Continue Editing</button>
                  <button type="button" onClick={() => navigate(routes.vendor.myEvents)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Leave Page</button>
                </div>
              </div>
            </div>
          )}

          {/* Save confirm */}
          {showSaveConfirm && (
            <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold text-green-900 mb-3">Save Changes?</h2>
                <p className="text-gray-500 mb-6">Your event listing will be updated with the new details.</p>
                {isPhotosUploading && (
                  <p className="text-amber-600 text-sm mb-4 flex items-center gap-1.5">
                    <Loader2 size={14} className="animate-spin" />Photos still uploading — please wait
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowSaveConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                  <button type="button"
                    onClick={() => { setShowSaveConfirm(false); handleSubmit(); }}
                    disabled={isPhotosUploading || isSubmitting}
                    className="px-4 py-2 bg-green-900 text-gold-500 rounded-lg disabled:opacity-50">Save</button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
