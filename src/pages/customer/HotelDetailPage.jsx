import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelById } from "@/api/hotel";
import HotelDetailsSkeleton from "@/components/hotel/HotelDetailSkeleton";
import {
  Star,
  MapPin,
  IndianRupee,
  TriangleAlert,
  ArrowLeft,
  Sparkles,
  Dot,
  Wifi,
  Dumbbell,
  Car,
  Utensils,
  Snowflake,
  Wine,
  Waves,
  Coffee,
  Tv,
  Shield,
  Bath,
  Refrigerator,
  WashingMachine,
  Users,
  Baby,
  PawPrint,
  Briefcase,
  HeartPulse,
  ConciergeBell,
  ParkingCircle,
  CigaretteOff,
  Accessibility,
  Bike,
  Bus,
  TreePalm,
  Gamepad2,
  Music,
  Camera,
  ShieldCheck,
  CircleHelp,
  BedDouble,
  Lock,
} from "lucide-react";

const amenityIcons = {
  WiFi: Wifi,
  Pool: Waves,
  Gym: Dumbbell,
  Parking: Car,
  Restaurant: Utensils,
  AC: Snowflake,
  Spa: Sparkles,
  Bar: Wine,
  "Coffee Shop": Coffee,
  TV: Tv,
  Security: Shield,
  Bathtub: Bath,
  Refrigerator: Refrigerator,
  Laundry: WashingMachine,
  "Family Rooms": Users,
  "Kids Play Area": Baby,
  "Pet Friendly": PawPrint,
  "Business Center": Briefcase,
  "Medical Assistance": HeartPulse,
  RoomService: ConciergeBell,
  "Free Parking": ParkingCircle,
  "Non Smoking": CigaretteOff,
  Accessible: Accessibility,
  Bicycle: Bike,
  Shuttle: Bus,
  Garden: TreePalm,
  Gaming: Gamepad2,
  Entertainment: Music,
  CCTV: Camera,
  "24x7 Security": ShieldCheck,
};

const HotelDetailPage = () => {
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [mapError, setMapError] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHotel = async () => {
      setIsLoading(true);
      try {
        const data = await getHotelById(id);
        setHotel(data.hotel);
        setActivePhoto(0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load hotel");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotel();
  }, [id]);


  if (isLoading) return <HotelDetailsSkeleton />;

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

  if (!hotel) return null;

  const vendor = hotel.vendorId;

  return (
    <div className="page-wrapper">
      <div className="container-main py-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-green-900 border border-green-900 text-gold-500 py-2 px-4 rounded-lg hover:bg-green-800 transition-all duration-200 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Hotels
        </button>

        {/* PHOTO GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          {/* Main Photo */}
          <div className="lg:col-span-2 relative h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden">
            <img
              src={hotel.photos[activePhoto]}
              alt={hotel.name}
              className="w-full h-full object-cover select-none transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {hotel.isFeatured && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-yellow-100 border border-yellow-400 text-yellow-600 px-3 py-1.5 rounded-full text-sm font-label">
                <Sparkles size={13} />
                Featured
              </div>
            )}

            <div className="absolute bottom-4 left-4">
              <div className="border border-green-700 px-4 py-2 rounded-full bg-green-900/70 backdrop-blur-sm font-label">
                <div className="flex items-center gap-1.5 text-yellow-400 text-sm">
                  <MapPin size={13} className="text-red-400" />
                  {hotel.location.address.split(",")[0]}
                </div>
                <div className="text-yellow-300 text-xs pl-5">
                  {hotel.location.city}, {hotel.location.state}
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {/* Mobile: horizontal scroll | Desktop: vertical stack */}
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-1 lg:pb-0">
            {hotel.photos.map((photo, index) => (
              <div
                key={index}
                onClick={() => setActivePhoto(index)}
                className={`shrink-0 w-32 lg:w-auto h-[100px] lg:h-[130px] rounded-lg overflow-hidden cursor-pointer select-none transition-all duration-200
                  ${activePhoto === index ? "ring-2 ring-green-900 opacity-100" : "opacity-60 hover:opacity-90"}`}
              >
                <img
                  src={photo}
                  alt={`Hotel photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT — Hotel Info */}
          <div className="lg:col-span-2 space-y-10">
            {/* Name + Location + Rating */}
            <div>
              {hotel.isFeatured && (
                <p className="section-eyebrow mb-2">Premium Resort</p>
              )}
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-green-900 mb-3">
                {hotel.name}
              </h1>

              <div className="flex flex-wrap items-center gap-1 text-sm text-green-800 mb-4">
                <span>
                  {hotel.location.city}, {hotel.location.state}
                </span>
                <Dot size={16} />
                <span>{hotel.location.address}</span>

                <span>{hotel.location.pinCode}</span>
              </div>

              <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-4" />

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <Star size={15} className="fill-gold-500 text-gold-500" />
                  <span className="text-lg font-semibold text-green-900">
                    {hotel.avgRating}
                  </span>
                </div>
                <span className="text-green-700">
                  {hotel.reviewCount} reviews
                </span>
                <Dot size={14} className="text-green-300" />
                <div className="flex items-center gap-1">
                  <span>{hotel.starRating}</span>
                  <Star size={13} className="fill-gold-500 text-gold-500" />
                  <span className="text-green-700">Star Hotel</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-xl font-semibold text-green-900 mb-3">
                About This Hotel
              </h2>
              <p className="text-green-800 leading-relaxed">
                {hotel.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-display text-xl font-semibold text-green-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || CircleHelp;
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

            {/* Location Map */}
            <div>
              <h2 className="font-display text-xl font-semibold text-green-900 mb-4">
                Location
              </h2>
              <div className="w-full h-[280px] rounded-xl overflow-hidden border border-green-100">
                {mapError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-green-50 gap-3">
                    <MapPin size={32} className="text-green-300" />
                    <p className="text-green-700 text-sm">Unable to load map</p>
                    <a
                      href={`https://www.google.com/maps?q=${hotel.location.coordinates?.latitude},${hotel.location.coordinates?.longitude}`}
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
                    src={`https://maps.google.com/maps?q=${hotel.location.coordinates?.latitude},${hotel.location.coordinates?.longitude}&z=15&output=embed`}
                  />
                )}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-green-900 mb-4">
                Reviews
              </h2>
              <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
                <Star size={32} className="text-green-200 mx-auto mb-3" />
                <p className="text-green-700 font-medium">
                  Reviews coming in Week 5
                </p>
                <p className="text-green-500 text-sm mt-1">
                  Be the first to review after your stay
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — Booking Card */}
          <div className="lg:col-span-1 self-start lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <IndianRupee size={22} className="text-gold-500" />
                  <span className=" text-4xl  font-manrope font-semibold  text-green-900">
                    {hotel.pricePerNight.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <span>per night</span>
                  <Dot size={14} />
                  <span>taxes included</span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-5" />

              {/* Room Stats */}
              <div className="grid grid-cols-3 gap-2 text-center py-4 border-y border-green-100 mb-6">
                <div>
                  <BedDouble
                    size={20}
                    className="text-green-900 mx-auto mb-1"
                  />
                  <p className="text-xl font-semibold text-green-900">
                    {hotel.totalRooms}
                  </p>
                  <p className="text-xs text-green-600">Total</p>
                </div>
                <div>
                  <BedDouble
                    size={20}
                    className="text-emerald-600 mx-auto mb-1"
                  />
                  <p className="text-xl font-semibold text-emerald-600">
                    {hotel.availableRooms}
                  </p>
                  <p className="text-xs text-green-600">Available</p>
                </div>
                <div>
                  <Star
                    size={20}
                    className="fill-gold-500 text-gold-500 mx-auto mb-1"
                  />
                  <p className="text-xl font-semibold text-green-900">
                    {hotel.starRating} ★
                  </p>
                  <p className="text-xs text-green-600">Star Hotel</p>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <p className="section-eyebrow mb-3">Listed By</p>
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
                Book Now — Coming Soon
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

export default HotelDetailPage;
