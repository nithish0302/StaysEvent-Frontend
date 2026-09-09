import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHotelById, updateHotel } from "@/api/hotel";
import { amenityIcons, DefaultAmenityIcon } from "@/constants/amenityIcons";
import PhotoUploadSection from "@/components/common/PhotoUploadSection";
import {
  Building,
  MapPin,
  IndianRupee,
  Star,
  Gem,
  TriangleAlert,
  Locate,
  Loader2,
  Trash2,
  ImagePlus,
} from "lucide-react";
import { TbBuildingCog } from "react-icons/tb";
import routes from "@/config/routes";

const EditHotelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotoUrls, setNewPhotoUrls] = useState([]);
  const [isPhotosUploading, setIsPhotosUploading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [customAmenity, setCustomAmenity] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const starOptions = [3, 4, 5];
  const [amenitiesOptions, setAmenitiesOptions] = useState([
    "WiFi", "Parking", "AC", "TV", "Pool", "Gym",
    "Restaurant", "Room Service", "Laundry", "Security",
    "Power Backup", "Breakfast Included",
  ]);

  // ── fetch existing hotel data ──────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getHotelById(id);
        const h = data.hotel || data;
        setHotelData({
          name: h.name || "",
          description: h.description || "",
          location: {
            city: h.location?.city || "",
            state: h.location?.state || "",
            address: h.location?.address || "",
            pinCode: h.location?.pinCode || "",
            coordinates: {
              longitude: h.location?.coordinates?.longitude ?? "",
              latitude: h.location?.coordinates?.latitude ?? "",
            },
          },
          amenities: h.amenities || [],
          starRating: h.starRating || null,
          pricePerNight: h.pricePerNight || 0,
          totalRooms: h.totalRooms || 0,
        });
        setExistingPhotos(h.photos || []);

        // merge any extra amenities from the hotel not in the default list
        if (h.amenities?.length) {
          setAmenitiesOptions((prev) => {
            const extras = h.amenities.filter((a) => !prev.includes(a));
            return [...prev, ...extras];
          });
        }
      } catch (err) {
        setError("Failed to load hotel details. Please go back and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const clearFieldError = (name) =>
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData((prev) => ({
      ...prev,
      [name]: name === "pricePerNight" || name === "totalRooms" ? Number(value) : value,
    }));
    clearFieldError(name);
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    if (name === "longitude" || name === "latitude") {
      setHotelData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: { ...prev.location.coordinates, [name]: value },
        },
      }));
    } else {
      setHotelData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    }
    clearFieldError(name);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHotelData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: {
              latitude: pos.coords.latitude.toFixed(6),
              longitude: pos.coords.longitude.toFixed(6),
            },
          },
        }));
        setIsLocating(false);
      },
      () => { setError("Unable to retrieve your location"); setIsLocating(false); },
    );
  };

  const toggleAmenity = (amenityName) => {
    setHotelData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter((a) => a !== amenityName)
        : [...prev.amenities, amenityName],
    }));
    clearFieldError("amenities");
  };

  const addCustomAmenity = () => {
    const amenity = customAmenity.trim();
    if (!amenity) return;
    setAmenitiesOptions((prev) => (prev.includes(amenity) ? prev : [...prev, amenity]));
    setHotelData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ? prev.amenities : [...prev.amenities, amenity],
    }));
    setCustomAmenity("");
  };

  const removeExistingPhoto = (url) =>
    setExistingPhotos((prev) => prev.filter((p) => p !== url));

  // ── validation ─────────────────────────────────────────────────────────────
  const validation = () => {
    const errors = {};
    if (!hotelData.name.trim()) errors.name = "Hotel name is required";
    if (!hotelData.description.trim()) errors.description = "Description is required";
    if (!hotelData.location.address.trim()) errors.address = "Address is required";
    if (!hotelData.location.city.trim()) errors.city = "City is required";
    if (!hotelData.location.state.trim()) errors.state = "State is required";
    if (!hotelData.location.pinCode?.trim()) {
      errors.pinCode = "Pin code is required";
    } else if (!/^\d{6}$/.test(hotelData.location.pinCode)) {
      errors.pinCode = "Pin code must be 6 digits";
    }
    const { latitude, longitude } = hotelData.location.coordinates;
    if (latitude !== "" && (isNaN(latitude) || latitude < -90 || latitude > 90))
      errors.latitude = "Latitude must be between -90 and 90";
    if (longitude !== "" && (isNaN(longitude) || longitude < -180 || longitude > 180))
      errors.longitude = "Longitude must be between -180 and 180";
    if (!hotelData.amenities?.length) errors.amenities = "Select at least one amenity";
    if (!hotelData.pricePerNight || hotelData.pricePerNight <= 0)
      errors.pricePerNight = "Price must be greater than 0";
    if (!hotelData.totalRooms || hotelData.totalRooms <= 0)
      errors.totalRooms = "Total rooms must be greater than 0";
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
      await updateHotel(id, { ...hotelData, photos: [...existingPhotos, ...newPhotoUrls] });
      navigate(routes.vendor.myHotel);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update hotel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldError = ({ name }) =>
    fieldErrors[name] ? <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p> : null;

  // ── loading / error states ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={36} className="text-green-700 animate-spin" />
      </div>
    );
  }

  if (!hotelData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <TriangleAlert size={40} className="text-red-400" />
        <p className="text-red-600 text-center">{error || "Hotel not found."}</p>
        <button onClick={() => navigate(routes.vendor.myHotel)} className="px-4 py-2 bg-green-900 text-white rounded-lg">
          Back to My Hotels
        </button>
      </div>
    );
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper py-10">
      <div className="px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-6">
          <h1 className="font-semibold text-2xl sm:text-3xl">Edit Hotel</h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Update your hotel details below
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
              <Building className="text-green-800 border border-green-100 py-2 px-1 bg-green-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Basic Information</h2>
            </div>
            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium">Hotel Name</p>
              <input
                type="text"
                name="name"
                value={hotelData.name}
                onChange={handleChange}
                placeholder="eg: The Stately Residence"
                className={`border p-2 rounded-md my-2 w-full md:w-1/2 placeholder:text-green-800/50 font-semibold ${fieldErrors.name ? "border-red-400" : "border-green-100"}`}
              />
              <FieldError name="name" />
            </div>
            <div className="my-3 sm:mx-5">
              <p className="text-green-800 font-medium">Description</p>
              <textarea
                name="description"
                value={hotelData.description}
                onChange={handleChange}
                placeholder="Describe your hotel..."
                rows={3}
                className={`border p-2 rounded-md my-2 w-full md:w-1/2 placeholder:text-green-800/50 font-semibold ${fieldErrors.description ? "border-red-400" : "border-green-100"}`}
              />
              <FieldError name="description" />
            </div>
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
                  <input type="text" name="address" value={hotelData.location.address} onChange={handleLocationChange}
                    placeholder="eg: 12 Main Street" className={`w-full border p-2 rounded-md ${fieldErrors.address ? "border-red-400" : "border-green-100"}`} />
                  <FieldError name="address" />
                </div>
                <div>
                  <p className="text-green-800 font-medium mb-1">City</p>
                  <input type="text" name="city" value={hotelData.location.city} onChange={handleLocationChange}
                    placeholder="eg: Coimbatore" className={`w-full border p-2 rounded-md ${fieldErrors.city ? "border-red-400" : "border-green-100"}`} />
                  <FieldError name="city" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-800 font-medium mb-1">State</p>
                  <input type="text" name="state" value={hotelData.location.state} onChange={handleLocationChange}
                    placeholder="eg: Tamil Nadu" className={`w-full border p-2 rounded-md ${fieldErrors.state ? "border-red-400" : "border-green-100"}`} />
                  <FieldError name="state" />
                </div>
                <div>
                  <p className="text-green-800 font-medium mb-1">Pincode</p>
                  <input type="text" name="pinCode" value={hotelData.location.pinCode} onChange={handleLocationChange}
                    placeholder="eg: 641001" className={`w-full border p-2 rounded-md ${fieldErrors.pinCode ? "border-red-400" : "border-green-100"}`} />
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
                    <input type="text" name="latitude" value={hotelData.location.coordinates.latitude} onChange={handleLocationChange}
                      placeholder="eg: 13.0827" className={`w-full border p-2 rounded-md ${fieldErrors.latitude ? "border-red-400" : "border-green-100"}`} />
                    <FieldError name="latitude" />
                  </div>
                  <div>
                    <input type="text" name="longitude" value={hotelData.location.coordinates.longitude} onChange={handleLocationChange}
                      placeholder="eg: 80.2707" className={`w-full border p-2 rounded-md ${fieldErrors.longitude ? "border-red-400" : "border-green-100"}`} />
                    <FieldError name="longitude" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Price & Rooms ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <IndianRupee className="text-blue-600 border border-blue-50 py-2 px-1 bg-blue-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Price & Rooms</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p>Price Per Night</p>
                <input type="number" name="pricePerNight" value={hotelData.pricePerNight} onChange={handleChange}
                  placeholder="eg: 4000" className={`w-full border p-2 rounded-md mt-1 ${fieldErrors.pricePerNight ? "border-red-400" : "border-green-100"}`} />
                <FieldError name="pricePerNight" />
              </div>
              <div>
                <p>Total Rooms</p>
                <input type="number" name="totalRooms" value={hotelData.totalRooms} onChange={handleChange}
                  placeholder="eg: 30" className={`w-full border p-2 rounded-md mt-1 ${fieldErrors.totalRooms ? "border-red-400" : "border-green-100"}`} />
                <FieldError name="totalRooms" />
              </div>
            </div>
          </div>

          {/* ── Star Rating ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-2">
              <Star className="text-blue-600 border border-blue-50 py-2 px-1 bg-blue-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Star Rating</h2>
            </div>
            <p className="sm:ml-12 text-gray-400 text-sm">Leave unselected if Unrated — Optional</p>
            <div className="flex gap-3 flex-wrap mt-4 sm:ml-12">
              {starOptions.map((star) => (
                <button key={star} type="button"
                  onClick={() => setHotelData((p) => ({ ...p, starRating: p.starRating === star ? null : star }))}
                  className={`flex items-center gap-2 border px-4 py-3 rounded-md transition-all duration-200 ${hotelData.starRating === star ? "bg-green-800 text-white border-green-800" : "border-green-200 hover:bg-green-50 text-green-800"}`}>
                  <span>{star}</span>
                  <Star size={16} className={hotelData.starRating === star ? "text-yellow-400" : "text-yellow-500"}
                    fill={hotelData.starRating === star ? "currentColor" : "none"} />
                </button>
              ))}
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
              {amenitiesOptions.map((amenity) => {
                const Icon = amenityIcons[amenity] || DefaultAmenityIcon;
                return (
                  <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-sm ${hotelData.amenities.includes(amenity) ? "bg-green-800 text-yellow-400 border-green-900" : "border-green-200 text-green-800 hover:bg-green-50"}`}>
                    <Icon size={18} className="shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
            <FieldError name="amenities" />
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input type="text" value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Add custom amenity" className="w-full sm:flex-1 border border-green-200 rounded-lg px-3 py-2" />
              <button type="button" onClick={addCustomAmenity} className="w-full sm:w-auto bg-green-800 text-yellow-400 px-4 py-2 rounded-lg">Add</button>
            </div>
          </div>

          {/* ── Photos ── */}
          <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
            <div className="flex gap-2 items-center mb-4">
              <ImagePlus className="text-orange-600 border border-orange-50 py-2 px-1 bg-orange-100 rounded-sm shrink-0" size={32} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">Photos</h2>
            </div>

            {/* existing photos */}
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

            {/* new uploads */}
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
                <><TbBuildingCog size={20} />Save Changes</>
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
                  <button type="button" onClick={() => navigate(routes.vendor.myHotel)}
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
                <p className="text-gray-500 mb-6">Your hotel listing will be updated with the new details.</p>
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
                    className="px-4 py-2 bg-green-900 text-gold-500 rounded-lg">Save</button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditHotelPage;
