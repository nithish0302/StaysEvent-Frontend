import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHotel } from "@/api/hotel";
import { amenityIcons, DefaultAmenityIcon } from "@/constants/amenityIcons";
import {
  Building,
  MapPin,
  IndianRupee,
  Star,
  CloudUpload,
  Gem,
  ImagePlus,
  Trash2,
  X,
  TriangleAlert,
} from "lucide-react";
import { TbBuildingPlus } from "react-icons/tb";
import routes from "@/config/routes";

const AddHotelPage = () => {
  const navigate = useNavigate();

  const initialHotelData = {
    name: "",
    description: "",
    location: {
      city: "",
      state: "",
      address: "",
      pinCode: "",
      coordinates: {
        longitude: "",
        latitude: "",
      },
    },
    amenities: [],
    starRating: null,
    pricePerNight: 0,
    totalRooms: 0,
    photos: [],
  };

  const [hotelData, setHotelData] = useState(initialHotelData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [customAmenity, setCustomAmenity] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const starOption = [3, 4, 5];
  const [amenitiesOptions, setAmenitiesOptions] = useState([
    "WiFi",
    "Parking",
    "AC",
    "TV",
    "Pool",
    "Gym",
    "Restaurant",
    "Room Service",
    "Laundry",
    "Security",
    "Power Backup",
    "Breakfast Included",
  ]);

  const [previewImage, setPreviewImage] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  useEffect(() => {
    document.body.style.overflow =
      previewImage || photoToDelete !== null ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [previewImage, photoToDelete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData((prev) => ({
      ...prev,
      [name]:
        name === "pricePerNight" || name === "totalRooms"
          ? Number(value)
          : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);

    setHotelData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
    if (fieldErrors.photos) {
      setFieldErrors((prev) => ({ ...prev, photos: undefined }));
    }
  };

  const removePhoto = () => {
    if (photoToDelete === null) return;

    setHotelData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== photoToDelete),
    }));

    setPhotoToDelete(null);
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setHotelData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleAmenity = (amenityName) => {
    setHotelData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter((item) => item !== amenityName)
        : [...prev.amenities, amenityName],
    }));
    if (fieldErrors.amenities) {
      setFieldErrors((prev) => ({ ...prev, amenities: undefined }));
    }
  };

  const addCustomAmenity = () => {
    const amenity = customAmenity.trim();

    if (!amenity) return;

    setAmenitiesOptions((prev) =>
      prev.includes(amenity) ? prev : [...prev, amenity],
    );

    setHotelData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities
        : [...prev.amenities, amenity],
    }));

    setCustomAmenity("");
  };

  const selectStarRating = (star) => {
    setHotelData((prev) => ({
      ...prev,
      starRating: prev.starRating === star ? null : star,
    }));
  };

  const validation = () => {
    const errors = {};

    if (!hotelData.name.trim()) {
      errors.name = "Hotel name is required";
    }

    if (!hotelData.description.trim()) {
      errors.description = "Hotel description is required";
    }

    if (!hotelData.location.address.trim()) {
      errors.address = "Address is required";
    }
    if (!hotelData.location.city.trim()) {
      errors.city = "City is required";
    }
    if (!hotelData.location.state.trim()) {
      errors.state = "State is required";
    }
    if (!hotelData.location?.pinCode?.trim()) {
      errors.pinCode = "Pin code is required";
    } else if (!/^\d{6}$/.test(hotelData.location.pinCode)) {
      errors.pinCode = "Pin code must be 6 digits";
    }

    if (!hotelData.amenities || hotelData.amenities.length === 0) {
      errors.amenities = "Select at least one amenity";
    }

    if (!hotelData.pricePerNight) {
      errors.pricePerNight = "Price per night is required";
    } else if (hotelData.pricePerNight <= 0) {
      errors.pricePerNight = "Price must be greater than 0";
    }

    if (!hotelData.totalRooms) {
      errors.totalRooms = "Total rooms is required";
    } else if (hotelData.totalRooms <= 0) {
      errors.totalRooms = "Total rooms must be greater than 0";
    }

    if (!hotelData.photos || hotelData.photos.length === 0) {
      errors.photos = "At least one photo is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const { isValid, errors } = validation();

    if (!isValid) {
      setFieldErrors(errors);
      setError("Please fix the highlighted fields below");
      setIsSubmitting(false);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await createHotel(hotelData);
      resetForm();
      navigate(routes.vendor.myHotel);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create hotel",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setHotelData(initialHotelData);
    setCustomAmenity("");
    setError("");
    setFieldErrors({});
    setPreviewImage(null);
    setPhotoToDelete(null);
  };

  const handleCancel = () => {
    resetForm();
    navigate(routes.vendor.myHotel);
  };

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
    ) : null;

  return (
    <div className="page-wrapper py-10">
      <div className="px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-6">
          <h1 className="font-semibold text-2xl sm:text-3xl">
            List Your Hotel
          </h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Fill in the details below to publish your hotel on StayEvents
          </p>
        </div>

        {/* FIX 10: general error banner — was completely missing in the UI */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl mb-6">
            <TriangleAlert size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className=" bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-1">
              <Building
                className="text-green-800 border border-green-100 py-2 px-1 bg-green-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Basic Information
              </h1>
            </div>
            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium ">Hotel Name</p>
              <input
                type="text"
                placeholder="eg: The Stately Residence"
                className={`border p-2 rounded-md my-2 w-full md:w-1/2 placeholder:text-green-800/50 font-semibold
                  ${fieldErrors.name ? "border-red-400" : "border-green-100"}`}
                name="name"
                value={hotelData.name}
                onChange={handleChange}
              />
              <FieldError name="name" />
            </div>
            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium ">Description</p>
              <textarea
                placeholder="Descripe your hotel, its highlights and what make it special..."
                className={`border p-2 rounded-md my-2 w-full md:w-1/2 placeholder:text-green-800/50 font-semibold
                  ${fieldErrors.description ? "border-red-400" : "border-green-100"}`}
                rows={3}
                name="description"
                value={hotelData.description}
                onChange={handleChange}
              />
              <FieldError name="description" />
            </div>
          </div>

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
                    value={hotelData.location.address}
                    onChange={handleLocationChange}
                    placeholder="eg: The Stately Residence"
                    className={`w-full border p-2 rounded-md placeholder:text-green-800/50
                      ${fieldErrors.address ? "border-red-400" : "border-green-100"}`}
                  />
                  <FieldError name="address" />
                </div>

                <div>
                  <p className="text-green-800 font-medium mb-1">City</p>
                  <input
                    type="text"
                    name="city"
                    value={hotelData.location.city}
                    onChange={handleLocationChange}
                    placeholder="eg: Coimbatore"
                    className={`w-full border p-2 rounded-md placeholder:text-green-800/50
                      ${fieldErrors.city ? "border-red-400" : "border-green-100"}`}
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
                    value={hotelData.location.state}
                    onChange={handleLocationChange}
                    placeholder="eg: Tamil Nadu"
                    className={`w-full border p-2 rounded-md placeholder:text-green-800/50
                      ${fieldErrors.state ? "border-red-400" : "border-green-100"}`}
                  />
                  <FieldError name="state" />
                </div>

                <div>
                  <p className="text-green-800 font-medium mb-1">Pincode</p>
                  <input
                    type="text"
                    name="pinCode"
                    value={hotelData.location.pinCode}
                    onChange={handleLocationChange}
                    placeholder="eg: 641001"
                    className={`w-full border p-2 rounded-md placeholder:text-green-800/50
                      ${fieldErrors.pinCode ? "border-red-400" : "border-green-100"}`}
                  />
                  <FieldError name="pinCode" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <IndianRupee
                className="text-blue-600 border border-blue-50 py-2 px-1 bg-blue-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Price & Rooms
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="">Price Per Night</p>
                <input
                  type="text"
                  name="pricePerNight"
                  value={hotelData.pricePerNight}
                  onChange={handleChange}
                  placeholder="eg: 4000"
                  className={`w-full border p-2 rounded-md mt-1 placeholder:text-green-800/50
                    ${fieldErrors.pricePerNight ? "border-red-400" : "border-green-100"}`}
                />
                <FieldError name="pricePerNight" />
              </div>
              <div>
                <p className="">Total Rooms</p>
                <input
                  type="text"
                  name="totalRooms"
                  value={hotelData.totalRooms}
                  onChange={handleChange}
                  placeholder="eg: 30"
                  className={`w-full border p-2 rounded-md mt-1 placeholder:text-green-800/50
                    ${fieldErrors.totalRooms ? "border-red-400" : "border-green-100"}`}
                />
                <FieldError name="totalRooms" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-2">
              <Star
                className="text-blue-600 border border-blue-50 py-2 px-1 bg-blue-100 rounded-sm shrink-0"
                size={32}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
                Star Rating
              </h1>
            </div>
            <p className="sm:ml-12 text-gray-400 text-sm">
              Leave unselect if Unrated -Optional
            </p>

            <div className="flex gap-3 flex-wrap mt-4 sm:ml-12">
              {starOption.map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => selectStarRating(star)}
                  className={`flex items-center gap-2 border px-4 py-3 rounded-md transition-all duration-200
                    ${
                      hotelData.starRating === star
                        ? "bg-green-800 text-white border-green-800"
                        : "border-green-200 hover:bg-green-50 text-green-800"
                    }`}
                >
                  <span>{star}</span>
                  <Star
                    size={16}
                    className={
                      hotelData.starRating === star
                        ? "text-yellow-400"
                        : "text-yellow-500"
                    }
                    fill={
                      hotelData.starRating === star ? "currentColor" : "none"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-2">
              <Gem
                className="text-purple-600 border border-purple-50 py-2 px-1
                bg-purple-100 rounded-sm shrink-0"
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
              {amenitiesOptions.map((amenity) => {
                const Icon = amenityIcons[amenity] || DefaultAmenityIcon;

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-sm
                      ${
                        hotelData.amenities.includes(amenity)
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
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Add custom amenity"
                className="w-full sm:flex-1 border border-green-200 rounded-lg px-3 py-2"
              />

              <button
                type="button"
                onClick={addCustomAmenity}
                className="w-full sm:w-auto bg-green-800 text-yellow-400 px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>

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
              <CloudUpload
                size={36}
                className="text-green-700 mb-3 sm:size-[42px]"
              />

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

            {hotelData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {hotelData.photos.map((file, index) => (
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
                  <TbBuildingPlus size={20} />
                  Publish Hotel
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
                    Cancel Hotel Creation?
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
                  Publish Hotel?
                </h2>

                <p className="text-gray-500 mb-6">
                  Your hotel listing will be submitted and become available for
                  review.
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

export default AddHotelPage;
