import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "@/api/wishlist";
import routes from "@/config/routes";
import {
  Heart, Hotel, CalendarDays, MapPin, IndianRupee,
  Star, Loader2, Building2, Ticket, Trash2, Search,
} from "lucide-react";

const StarRow = ({ n }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={11} className={i < n ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
    ))}
  </span>
);

const WishlistCard = ({ item, onRemove }) => {
  const navigate = useNavigate();
  const isHotel = item.itemType === "HOTEL";
  const listing = item.itemId;
  const photo = listing?.photos?.[0];
  const [removing, setRemoving] = useState(false);

  const price = isHotel
    ? listing?.pricePerNight
    : listing?.bookingType === "hall"
    ? listing?.hallDetails?.pricePerDay
    : listing?.ticketDetails?.price;

  const priceLabel = isHotel ? "/ night" : listing?.bookingType === "hall" ? "/ day" : "/ ticket";

  const handleNavigate = () => {
    if (isHotel) navigate(routes.customer.hotelDetail.replace(":id", listing?._id));
    else navigate(routes.customer.eventDetails.replace(":id", listing?._id));
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    setRemoving(true);
    try { await onRemove(listing?._id, item.itemType); }
    finally { setRemoving(false); }
  };

  if (!listing) return null;

  return (
    <div className="bg-white rounded-2xl border border-green-100 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
      {/* Photo */}
      <div onClick={handleNavigate} className="sm:w-44 h-36 sm:h-auto shrink-0 bg-green-50 overflow-hidden cursor-pointer relative group">
        {photo ? (
          <img src={photo} alt={listing.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isHotel ? <Hotel size={36} className="text-green-200" /> : <CalendarDays size={36} className="text-blue-200" />}
          </div>
        )}
        <span className={`absolute top-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${isHotel ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
          {isHotel ? "Hotel" : "Event"}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p onClick={handleNavigate} className="font-semibold text-green-900 cursor-pointer hover:underline line-clamp-1">
              {listing.name}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin size={10} />{listing.location?.city}, {listing.location?.state}
            </p>
          </div>
          <button onClick={handleRemove} disabled={removing}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50">
            {removing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>

        {isHotel ? (
          <div className="flex items-center gap-3">
            <StarRow n={listing.starRating || 0} />
            <span className="text-xs text-gray-400">{listing.availableRooms} rooms available</span>
          </div>
        ) : (
          <span className={`text-xs px-2 py-0.5 rounded-full w-fit border flex items-center gap-1 ${listing.bookingType === "hall" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
            {listing.bookingType === "hall" ? <><Building2 size={10} /> Hall booking</> : <><Ticket size={10} /> Ticket booking</>}
          </span>
        )}

        <div className="mt-auto pt-2 border-t border-green-50 flex items-center justify-between">
          <p className="text-green-800 font-bold text-sm flex items-center gap-0.5">
            <IndianRupee size={13} />{price?.toLocaleString("en-IN")}
            <span className="text-gray-400 font-normal text-xs ml-1">{priceLabel}</span>
          </p>
          <button onClick={handleNavigate}
            className="text-xs px-3 py-1.5 bg-green-900 text-white rounded-lg hover:bg-green-800">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getWishlist();
      setItems(data.wishlist || []);
    } catch {
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const handleRemove = async (itemId, itemType) => {
    try {
      await removeFromWishlist(itemId, itemType);
      setItems((prev) => prev.filter((i) => !(i.itemId?._id === itemId && i.itemType === itemType)));
    } catch {
      setError("Failed to remove item.");
    }
  };

  return (
    <div className="page-wrapper py-10 px-4 sm:px-8 lg:px-16">
      <div className="flex items-center gap-3 mb-1">
        <Heart size={22} className="text-red-400 fill-red-400" />
        <h1 className="text-2xl font-bold text-green-900">My Wishlist</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8">Your saved hotels and events</p>

      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 size={32} className="animate-spin text-green-700" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Heart size={52} className="text-green-100" />
          <p className="text-green-800 font-medium">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm">Save hotels and events you love to find them here</p>
          <button onClick={() => navigate(routes.customer.hotel)}
            className="px-5 py-2.5 bg-green-900 text-white rounded-xl text-sm">
            Explore Hotels
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item, idx) => (
            <WishlistCard key={`${item.itemId?._id}-${item.itemType}-${idx}`} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
