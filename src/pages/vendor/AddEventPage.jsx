import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "@/api/event";
import { amenityIcons, DefaultAmenityIcon } from "@/constants/amenityIcons";
import { categoryIcons, DefaultCategoryIcon } from "@/constants/categoryIcons";
import {
  PartyPopper,
  MapPin,
  Calendar,
  Globe,
  Lock,
  Building2,
  Ticket,
  Gem,
  ImagePlus,
  CloudUpload,
  Trash2,
  X,
  TriangleAlert,
} from "lucide-react";
import { TbCalendarPlus } from "react-icons/tb";
import routes from "@/config/routes";

const AddEventPage = () => {
  const navigate = useNavigate();

  const initialEventData = {
    name: "",
    description: "",
    category: "",
    otherCategoryName: "",
    bookingType: "hall",
    hallDetails: { pricePerDay: 0, totalHalls: 0 },
    ticketDetails: { price: 0, totalSeats: 0 },
    location: { city: "", state: "", address: "", pinCode: "" },
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    registrationDeadline: "",
    isPublic: true,
    amenities: [],
    photos: [],
  };

  const [eventData, setEventData] = useState(initialEventData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const categories = [
    "Wedding",
    "Conference",
    "Concert",
    "Birthday",
    "Corporate",
    "Exhibition",
    "Other",
  ];

  const eventAmenitiesList = [
    "Parking",
    "Catering",
    "AC",
    "WiFi",
    "Stage",
    "Sound System",
    "Photography",
  ];

  const isHall = eventData.bookingType === "hall";
  const isOtherCategory = eventData.category === "Other";

  useEffect(() => {
    document.body.style.overflow =
      previewImage || photoToDelete !== null ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [previewImage, photoToDelete]);

  const clearFieldError = (name) => {
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

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
    clearFieldError("pricePerDay");
    clearFieldError("totalHalls");
    clearFieldError("price");
    clearFieldError("totalSeats");
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
    setEventData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
    clearFieldError(name);
  };

  const togglePublic = (value) => {
    setEventData((prev) => ({ ...prev, isPublic: value }));
  };

  const toggleAmenity = (amenityName) => {
    setEventData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter((item) => item !== amenityName)
        : [...prev.amenities, amenityName],
    }));
    clearFieldError("amenities");
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    setEventData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
    clearFieldError("photos");
  };

  const removePhoto = () => {
    if (photoToDelete === null) return;
    setEventData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== photoToDelete),
    }));
    setPhotoToDelete(null);
  };

  const validation = () => {
    const errors = {};

    if (!eventData.name.trim()) errors.name = "Event name is required";
    if (!eventData.description.trim())
      errors.description = "Event description is required";
    if (!eventData.category) errors.category = "Please select a category";
    if (isOtherCategory && !eventData.otherCategoryName.trim()) {
      errors.otherCategoryName = "Please specify the event category name";
    }

    if (isHall) {
      if (!eventData.hallDetails.pricePerDay) {
        errors.pricePerDay = "Price per day is required";
      } else if (eventData.hallDetails.pricePerDay <= 0) {
        errors.pricePerDay = "Price must be greater than 0";
      }
      if (!eventData.hallDetails.totalHalls) {
        errors.totalHalls = "Total halls is required";
      } else if (eventData.hallDetails.totalHalls <= 0) {
        errors.totalHalls = "Total halls must be greater than 0";
      }
    } else {
      if (!eventData.ticketDetails.price) {
        errors.price = "Ticket price is required";
      } else if (eventData.ticketDetails.price <= 0) {
        errors.price = "Price must be greater than 0";
      }
      if (!eventData.ticketDetails.totalSeats) {
        errors.totalSeats = "Total seats is required";
      } else if (eventData.ticketDetails.totalSeats <= 0) {
        errors.totalSeats = "Total seats must be greater than 0";
      }
    }

    if (!eventData.location.address.trim())
      errors.address = "Address is required";
    if (!eventData.location.city.trim()) errors.city = "City is required";
    if (!eventData.location.state.trim()) errors.state = "State is required";
    if (!eventData.location.pinCode.trim()) {
      errors.pinCode = "Pin code is required";
    } else if (!/^\d{6}$/.test(eventData.location.pinCode)) {
      errors.pinCode = "Pin code must be 6 digits";
    }

    if (!eventData.startDate) errors.startDate = "Start date is required";
    if (!eventData.endDate) errors.endDate = "End date is required";
    if (
      eventData.startDate &&
      eventData.endDate &&
      new Date(eventData.endDate) < new Date(eventData.startDate)
    ) {
      errors.endDate = "End date must be after start date";
    }
    if (!eventData.startTime) errors.startTime = "Start time is required";
    if (!eventData.endTime) errors.endTime = "End time is required";

    if (
      eventData.registrationDeadline &&
      eventData.startDate &&
      new Date(eventData.registrationDeadline) >= new Date(eventData.startDate)
    ) {
      errors.registrationDeadline =
        "Registration deadline must be before the start date";
    }

    if (!eventData.amenities || eventData.amenities.length === 0) {
      errors.amenities = "Select at least one amenity";
    }

    if (!eventData.photos || eventData.photos.length === 0) {
      errors.photos = "At least one photo is required";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const resetForm = () => {
    setEventData(initialEventData);
    setError("");
    setFieldErrors({});
    setPreviewImage(null);
    setPhotoToDelete(null);
  };

  const handleCancel = () => {
    resetForm();
    navigate(routes.vendor.myEvents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { isValid, errors } = validation();

    if (!isValid) {
      setFieldErrors(errors);
      setError("Please fix the highlighted fields below");
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        ...eventData,
        hallDetails: isHall ? eventData.hallDetails : null,
        ticketDetails: isHall ? null : eventData.ticketDetails,
      };
      await createEvent(payload);
      resetForm();
      navigate(routes.vendor.myEvents);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create event",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
    ) : null;

  const inputClass = (name) =>
    `w-full border p-2 rounded-md placeholder:text-green-800/50
    ${fieldErrors[name] ? "border-red-400" : "border-green-100"}`;

  return (
    <div className="page-wrapper py-10">
      <div className="px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-6">
          <h1 className="font-semibold text-2xl sm:text-3xl">
            List Your Event
          </h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Fill in the details below to publish your event on StayEvents
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl mb-6">
            <TriangleAlert size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* SECTION 1 — Basic Information */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-1">
              <PartyPopper
                className="text-green-800 border border-green-100 py-2 px-1 bg-green-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Basic Information
              </h1>
            </div>

            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium">Event Name</p>
              <input
                type="text"
                name="name"
                placeholder="eg: Chennai Music Festival"
                className={`${inputClass("name")} w-full md:w-1/2 my-2`}
                value={eventData.name}
                onChange={handleChange}
              />
              <FieldError name="name" />
            </div>

            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium">Description</p>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe your event, what makes it special, who should attend..."
                className={`${inputClass("description")} w-full md:w-1/2 my-2`}
                value={eventData.description}
                onChange={handleChange}
              />
              <FieldError name="description" />
            </div>

            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium mb-2">Category</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat] || DefaultCategoryIcon;
                  const selected = eventData.category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => selectCategory(cat)}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-sm
                        ${
                          selected
                            ? "bg-green-800 text-yellow-400 border-green-900"
                            : "border-green-200 text-green-800 hover:bg-green-50"
                        }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="truncate">{cat}</span>
                    </button>
                  );
                })}
              </div>
              <FieldError name="category" />

              {isOtherCategory && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="otherCategoryName"
                    placeholder="Specify event category"
                    className={`${inputClass("otherCategoryName")} w-full md:w-1/2`}
                    value={eventData.otherCategoryName}
                    onChange={handleChange}
                  />
                  <FieldError name="otherCategoryName" />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2 — Booking Type */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <Building2
                className="text-blue-600 border border-blue-50 py-2 px-1 bg-blue-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Booking Type
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button
                type="button"
                onClick={() => toggleBookingType("hall")}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                  ${
                    isHall
                      ? "bg-green-800 text-yellow-400 border-green-900"
                      : "border-green-200 text-green-800 hover:bg-green-50"
                  }`}
              >
                <Building2 size={20} />
                <span className="font-medium">Hall Rental</span>
              </button>

              <button
                type="button"
                onClick={() => toggleBookingType("ticket")}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                  ${
                    !isHall
                      ? "bg-green-800 text-yellow-400 border-green-900"
                      : "border-green-200 text-green-800 hover:bg-green-50"
                  }`}
              >
                <Ticket size={20} />
                <span className="font-medium">Ticket</span>
              </button>
            </div>

            {isHall ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p>Price Per Day (₹)</p>
                  <input
                    type="text"
                    name="pricePerDay"
                    placeholder="eg: 85000"
                    className={`${inputClass("pricePerDay")} mt-1`}
                    value={eventData.hallDetails.pricePerDay}
                    onChange={handleHallDetailChange}
                  />
                  <FieldError name="pricePerDay" />
                </div>
                <div>
                  <p>Total Halls</p>
                  <input
                    type="text"
                    name="totalHalls"
                    placeholder="eg: 5"
                    className={`${inputClass("totalHalls")} mt-1`}
                    value={eventData.hallDetails.totalHalls}
                    onChange={handleHallDetailChange}
                  />
                  <FieldError name="totalHalls" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p>Ticket Price (₹)</p>
                  <input
                    type="text"
                    name="price"
                    placeholder="eg: 999"
                    className={`${inputClass("price")} mt-1`}
                    value={eventData.ticketDetails.price}
                    onChange={handleTicketDetailChange}
                  />
                  <FieldError name="price" />
                </div>
                <div>
                  <p>Total Seats</p>
                  <input
                    type="text"
                    name="totalSeats"
                    placeholder="eg: 500"
                    className={`${inputClass("totalSeats")} mt-1`}
                    value={eventData.ticketDetails.totalSeats}
                    onChange={handleTicketDetailChange}
                  />
                  <FieldError name="totalSeats" />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3 — Location */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <MapPin
                className="text-yellow-600 border border-yellow-50 py-2 px-1 bg-yellow-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Location
              </h1>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-800 font-medium mb-1">Address</p>
                  <input
                    type="text"
                    name="address"
                    placeholder="eg: Palace Grounds, Jayamahal Road"
                    className={inputClass("address")}
                    value={eventData.location.address}
                    onChange={handleLocationChange}
                  />
                  <FieldError name="address" />
                </div>
                <div>
                  <p className="text-green-800 font-medium mb-1">City</p>
                  <input
                    type="text"
                    name="city"
                    placeholder="eg: Bengaluru"
                    className={inputClass("city")}
                    value={eventData.location.city}
                    onChange={handleLocationChange}
                  />
                  <FieldError name="city" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-800 font-medium mb-1">State</p>
                  <input
                    type="text"
                    name="state"
                    placeholder="eg: Karnataka"
                    className={inputClass("state")}
                    value={eventData.location.state}
                    onChange={handleLocationChange}
                  />
                  <FieldError name="state" />
                </div>
                <div>
                  <p className="text-green-800 font-medium mb-1">Pincode</p>
                  <input
                    type="text"
                    name="pinCode"
                    placeholder="eg: 560001"
                    className={inputClass("pinCode")}
                    value={eventData.location.pinCode}
                    onChange={handleLocationChange}
                  />
                  <FieldError name="pinCode" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4 — Date & Time */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <Calendar
                className="text-purple-600 border border-purple-50 py-2 px-1 bg-purple-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Date & Time
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-green-800 font-medium mb-1">Start Date</p>
                <input
                  type="date"
                  name="startDate"
                  className={inputClass("startDate")}
                  value={eventData.startDate}
                  onChange={handleChange}
                />
                <FieldError name="startDate" />
              </div>
              <div>
                <p className="text-green-800 font-medium mb-1">End Date</p>
                <input
                  type="date"
                  name="endDate"
                  className={inputClass("endDate")}
                  value={eventData.endDate}
                  onChange={handleChange}
                />
                <FieldError name="endDate" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-green-800 font-medium mb-1">Start Time</p>
                <input
                  type="time"
                  name="startTime"
                  className={inputClass("startTime")}
                  value={eventData.startTime}
                  onChange={handleChange}
                />
                <FieldError name="startTime" />
              </div>
              <div>
                <p className="text-green-800 font-medium mb-1">End Time</p>
                <input
                  type="time"
                  name="endTime"
                  className={inputClass("endTime")}
                  value={eventData.endTime}
                  onChange={handleChange}
                />
                <FieldError name="endTime" />
              </div>
            </div>

            <div className="sm:w-1/2">
              <p className="text-green-800 font-medium mb-1">
                Registration Deadline{" "}
                <span className="text-gray-400 text-sm">(optional)</span>
              </p>
              <input
                type="date"
                name="registrationDeadline"
                className={inputClass("registrationDeadline")}
                value={eventData.registrationDeadline}
                onChange={handleChange}
              />
              <FieldError name="registrationDeadline" />
            </div>
          </div>

          {/* SECTION 5 — Visibility */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <Globe
                className="text-emerald-600 border border-emerald-50 py-2 px-1 bg-emerald-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Event Visibility
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => togglePublic(true)}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                  ${
                    eventData.isPublic
                      ? "bg-green-800 text-yellow-400 border-green-900"
                      : "border-green-200 text-green-800 hover:bg-green-50"
                  }`}
              >
                <Globe size={18} />
                <span className="font-medium">Public Event</span>
              </button>

              <button
                type="button"
                onClick={() => togglePublic(false)}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                  ${
                    !eventData.isPublic
                      ? "bg-green-800 text-yellow-400 border-green-900"
                      : "border-green-200 text-green-800 hover:bg-green-50"
                  }`}
              >
                <Lock size={18} />
                <span className="font-medium">Invite Only</span>
              </button>
            </div>
          </div>

          {/* SECTION 6 — Amenities */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-2">
              <Gem
                className="text-purple-600 border border-purple-50 py-2 px-1 bg-purple-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Amenities
              </h1>
            </div>
            <p className="sm:ml-12 text-gray-400 text-sm">
              Select all that apply
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
              {eventAmenitiesList.map((amenity) => {
                const Icon = amenityIcons[amenity] || DefaultAmenityIcon;
                const selected = eventData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-sm
                      ${
                        selected
                          ? "bg-green-800 text-yellow-400 border-green-900"
                          : "border-green-200 text-green-800 hover:bg-green-50"
                      }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
            <FieldError name="amenities" />
          </div>

          {/* SECTION 7 — Photos */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <ImagePlus
                className="text-orange-600 border border-orange-50 py-2 px-1 bg-orange-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Photos
              </h1>
            </div>

            <label
              htmlFor="photos"
              className={`flex flex-col items-center justify-center h-44 sm:h-52 px-4 text-center border-2 border-dashed rounded-2xl cursor-pointer hover:bg-green-50/30 transition-all duration-200
                ${fieldErrors.photos ? "border-red-300" : "border-green-200"}`}
            >
              <CloudUpload size={36} className="text-green-700 mb-3" />
              <p className="text-base sm:text-xl font-medium text-green-900">
                Drag photos here or click to upload
              </p>
              <p className="text-sm text-gray-400 mt-2">Max 10 photos</p>
              <input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handlePhotosChange}
              />
            </label>
            <FieldError name="photos" />

            {eventData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {eventData.photos.map((file, index) => (
                  <div
                    key={index}
                    className="relative h-32 rounded-xl border border-green-200 overflow-hidden bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setPhotoToDelete(index)}
                      className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                    <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      onClick={() => setPreviewImage(URL.createObjectURL(file))}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {previewImage && (
            <div
              className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
              onClick={() => setPreviewImage(null)}
            >
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-6 right-6 text-white"
              >
                <X size={32} />
              </button>
              <img
                src={previewImage}
                alt="Preview"
                onClick={(e) => e.stopPropagation()}
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />
            </div>
          )}

          {photoToDelete !== null && (
            <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <TriangleAlert size={28} className="text-red-500" />
                  <h2 className="text-xl font-semibold text-green-900">
                    Delete Photo?
                  </h2>
                </div>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete this photo?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPhotoToDelete(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              type="button"
              className="w-full sm:w-48 bg-white py-3 rounded-xl border border-green-100 text-lg font-medium order-2 sm:order-1"
              onClick={() => setShowCancelConfirm(true)}
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowPublishConfirm(true)}
              className="w-full sm:w-80 flex items-center justify-center gap-2 bg-green-900 py-3 rounded-xl text-gold-500 text-lg font-medium disabled:opacity-70 order-1 sm:order-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <TbCalendarPlus size={20} />
                  Publish Event
                </>
              )}
            </button>
          </div>

          {showCancelConfirm && (
            <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <TriangleAlert size={28} className="text-yellow-500" />
                  <h2 className="text-xl font-semibold text-green-900">
                    Cancel Event Creation?
                  </h2>
                </div>
                <p className="text-gray-500 mb-6">
                  All unsaved changes will be lost. Are you sure you want to
                  leave this page?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Continue Editing
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Leave Page
                  </button>
                </div>
              </div>
            </div>
          )}

          {showPublishConfirm && (
            <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold text-green-900 mb-3">
                  Publish Event?
                </h2>
                <p className="text-gray-500 mb-6">
                  Your event listing will be submitted and become available to
                  customers.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPublishConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      setShowPublishConfirm(false);
                      handleSubmit(e);
                    }}
                    className="px-4 py-2 bg-green-900 text-gold-500 rounded-lg"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;
