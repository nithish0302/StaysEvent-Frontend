// import React from "react";
// import { Sparkles, MapPin, Star, IndianRupee } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const HotelCard = ({ hotel }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       onClick={() => navigate(`/hotel/${hotel._id}`)}
//       className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
//     >
//       {/* IMAGE SECTION */}
//       <div className="relative h-64 overflow-hidden">
//         <img
//           src={hotel?.photos?.[0]}
//           alt={hotel.name}
//           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//         />

//         {/* GRADIENT OVERLAY */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

//         {/* RATING */}
//         {hotel.avgRating && (
//           <div className="absolute left-4 top-4 flex items-center gap-1 rounded-xl bg-white/90 px-3 py-1.5 text-sm font-semibold text-green-900 shadow-sm backdrop-blur-md">
//             <Star size={13} className="fill-yellow-400 text-yellow-400" />
//             <span>{hotel.avgRating}</span>
//           </div>
//         )}

//         {/* FEATURED */}
//         {hotel.isFeatured && (
//           <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#FFF3C4] px-3 py-1.5 text-xs font-semibold text-[#B7791F] border border-[#F6D365] shadow-sm">
//             <Sparkles size={12} />
//             Featured
//           </div>
//         )}

//         {/* HOTEL INFO */}
//         <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
//           <h2 className="mb-2 text-[1.9rem] font-bold leading-tight text-white drop-shadow-md">
//             {hotel.name}
//           </h2>

//           <div className="flex items-center gap-1.5 text-white/85">
//             <MapPin size={15} className="text-yellow-500" />

//             <span className="text-sm font-medium">
//               {hotel.location.city}, {hotel.location.state}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="flex flex-1 flex-col p-5">
//         {/* AMENITIES */}
//         <div className="mb-5 flex flex-wrap gap-2">
//           {hotel.amenities.slice(0, 4).map((amenity) => (
//             <span
//               key={amenity}
//               className="rounded-md bg-green-50 px-3 py-1 text-xs font-medium text-green-800 border border-green-100"
//             >
//               {amenity}
//             </span>
//           ))}
//         </div>

//         {/* FOOTER */}
//         <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
//           {/* PRICE */}
//           <div>
//             <p className="flex items-center text-[1.5rem] font-bold leading-none text-[#D4A017]">
//               <IndianRupee size={18} strokeWidth={2.5} />
//               {hotel.pricePerNight}
//             </p>

//             <p className="mt-1 text-sm text-gray-500">per night</p>
//           </div>

//           {/* BUTTON */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/hotel/${hotel._id}`);
//             }}
//             className="rounded-lg bg-[#D4A017] px-5 py-2 text-sm font-semibold text-green-900 transition-all duration-200 hover:bg-[#F0C040] hover:shadow-md"
//           >
//             View
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HotelCard;

import React from "react";
import { Sparkles, MapPin, Star, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/hotel/${hotel._id}`)}
      className="group flex flex-col overflow-hidden rounded-lg border border-green-100 bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={hotel?.photos?.[0]}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* RATING */}
        {hotel.avgRating && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-xl bg-white/90 px-3 py-1.5 text-sm font-semibold text-green-900 shadow-sm backdrop-blur-md">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span>{hotel.avgRating}</span>
          </div>
        )}

        {/* FEATURED */}
        {hotel.isFeatured && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#FFF3C4] px-3 py-1.5 text-xs font-semibold text-gold-600 border border-gold-300 shadow-sm">
            <Sparkles size={12} />
            Featured
          </div>
        )}

        {/* TITLE */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <h2 className="font-display text-3xl font-semibold text-white leading-tight mb-2">
            {hotel.name}
          </h2>

          <div className="flex items-center gap-1.5 text-white">
            <MapPin size={14} className="text-yellow-500" />

            <span className="font-sans text-sm">
              {hotel.location.city}, {hotel.location.state}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        {/* AMENITIES */}
        <div className="mb-5 flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="rounded-pill bg-green-100 px-3 py-1 text-[0.72rem] font-medium text-green-900"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-auto flex items-center justify-between border-t border-green-100 pt-4">
          {/* PRICE */}
          <div>
            <p className="flex items-center font-label text-[1.4rem] font-semibold text-gold-500 leading-none">
              <IndianRupee size={17} strokeWidth={2.5} />
              {hotel.pricePerNight}
            </p>

            <p className="mt-1 text-xs text-gray-500 font-sans">per night</p>
          </div>

          {/* BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/hotel/${hotel._id}`);
            }}
            className="rounded-md bg-green-900 px-5 py-2 text-sm font-semibold text-gold-500 transition-all duration-200 hover:bg-green-700"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
