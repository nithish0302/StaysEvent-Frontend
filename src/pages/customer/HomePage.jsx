import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHotels } from "@/api/hotel";
import { getAllEvents } from "@/api/event";
import routes from "@/config/routes";
import {
  Hotel, CalendarDays, MapPin, Star, IndianRupee,
  ArrowRight, Search, Loader2, Sparkles, Building2, Ticket,
} from "lucide-react";

const StarRow = ({ n }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={11} className={i < n ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
    ))}
  </span>
);

const HotelCard = ({ hotel, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-2xl border border-green-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
    <div className="h-44 bg-green-50 overflow-hidden relative">
      {hotel.photos?.[0] ? (
        <img src={hotel.photos[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"><Hotel size={40} className="text-green-200" /></div>
      )}
      {hotel.isFeatured && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles size={10} /> Featured
        </span>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-semibold text-green-900 line-clamp-1 flex-1">{hotel.name}</p>
        <StarRow n={hotel.starRating || 0} />
      </div>
      <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
        <MapPin size={11} />{hotel.location?.city}, {hotel.location?.state}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-green-800 font-bold text-sm flex items-center gap-0.5">
          <IndianRupee size={13} />{hotel.pricePerNight?.toLocaleString("en-IN")}
          <span className="text-gray-500 font-normal text-xs ml-1">/ night</span>
        </p>
        <span className="text-xs text-gray-500">{hotel.availableRooms} rooms left</span>
      </div>
    </div>
  </div>
);

const EventCard = ({ event, onClick }) => {
  const isHall = event.bookingType === "hall";
  const price = isHall ? event.hallDetails?.pricePerDay : event.ticketDetails?.price;
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-green-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="h-44 bg-blue-50 overflow-hidden relative">
        {event.photos?.[0] ? (
          <img src={event.photos[0]} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><CalendarDays size={40} className="text-blue-200" /></div>
        )}
        <span className={`absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${isHall ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
          {isHall ? <><Building2 size={10} /> Hall</> : <><Ticket size={10} /> Tickets</>}
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-green-900 line-clamp-1 mb-1">{event.name}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
          <MapPin size={11} />{event.location?.city}, {event.location?.state}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-green-800 font-bold text-sm flex items-center gap-0.5">
            <IndianRupee size={13} />{price?.toLocaleString("en-IN")}
            <span className="text-gray-500 font-normal text-xs ml-1">{isHall ? "/ day" : "/ ticket"}</span>
          </p>
          {event.startDate && (
            <span className="text-xs text-gray-500">
              {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, subtitle, viewAllTo, children, loading }) => {
  const navigate = useNavigate();
  return (
    <section className="mb-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-900">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
        <button onClick={() => navigate(viewAllTo)} className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900 font-medium">
          View all <ArrowRight size={14} />
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-44"><Loader2 size={28} className="animate-spin text-green-600" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{children}</div>
      )}
    </section>
  );
};

const Hero = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const handleSubmit = (e) => { e.preventDefault(); onSearch(query.trim()); };
  return (
    <div className="relative rounded-3xl overflow-hidden mb-14" style={{ background: "linear-gradient(135deg, #1A3C34 0%, #2d6a5f 100%)" }}>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: "#BFA060", transform: "translate(30%,-30%)" }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "#BFA060", transform: "translate(-30%,30%)" }} />
      <div className="relative z-10 px-8 py-14 sm:py-20 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight">
          Find your perfect
          <span className="block" style={{ color: "#BFA060" }}>stay or event</span>
        </h1>
        <p className="text-green-200 text-sm sm:text-base mb-8">Hotels, halls, and experiences — all in one place</p>
        <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-2xl overflow-hidden shadow-lg max-w-lg mx-auto">
          <Search size={18} className="ml-4 text-gray-400 shrink-0" />
          <input type="text" placeholder="Search by city..." value={query} onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-3.5 text-sm outline-none text-gray-700" />
          <button type="submit" className="px-5 py-3.5 text-sm font-semibold shrink-0" style={{ background: "#1A3C34", color: "#ffffff" }}>Search</button>
        </form>
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [events, setEvents] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    getAllHotels({ limit: 6, page: 1 }).then((d) => setHotels(d.hotels || [])).catch(() => {}).finally(() => setHotelsLoading(false));
    getAllEvents({ limit: 6, page: 1 }).then((d) => setEvents(d.events || [])).catch(() => {}).finally(() => setEventsLoading(false));
  }, []);

  const handleSearch = (city) => {
    if (city) navigate(`${routes.customer.hotel}?city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="page-wrapper py-8 px-4 sm:px-8 lg:px-16">
      <Hero onSearch={handleSearch} />

      <div className="grid grid-cols-3 gap-4 mb-14 text-center">
        {[{ value: "500+", label: "Hotels Listed" }, { value: "1,200+", label: "Events Hosted" }, { value: "10K+", label: "Happy Guests" }].map(({ value, label }) => (
          <div key={label} className="bg-white border border-green-100 rounded-2xl p-5">
            <p className="text-2xl font-bold text-green-900">{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* data-testid hooks: the e2e visual-regression suite masks these two
          sections out of its screenshot diff, since their content is live
          data (grows/changes as tests and real usage create hotels/events)
          and isn't something a pixel-diff baseline can stay in sync with. */}
      <div data-testid="home-hotels-section">
        <Section title="Featured Hotels" subtitle="Hand-picked properties for your next stay" viewAllTo={routes.customer.hotel} loading={hotelsLoading}>
          {hotels.slice(0, 6).map((h) => (
            <HotelCard key={h._id} hotel={h} onClick={() => navigate(routes.customer.hotelDetail.replace(":id", h._id))} />
          ))}
        </Section>
      </div>

      <div data-testid="home-events-section">
        <Section title="Upcoming Events" subtitle="Halls, shows, and experiences near you" viewAllTo={routes.customer.events} loading={eventsLoading}>
          {events.slice(0, 6).map((e) => (
            <EventCard key={e._id} event={e} onClick={() => navigate(routes.customer.eventDetails.replace(":id", e._id))} />
          ))}
        </Section>
      </div>

      <div className="rounded-3xl text-center py-12 px-6" style={{ background: "linear-gradient(135deg, #1A3C34, #2d6a5f)" }}>
        <h2 className="text-2xl font-bold text-white mb-2">List your property with us</h2>
        <p className="text-green-200 text-sm mb-6">Join hundreds of vendors and start earning today</p>
        <button onClick={() => navigate(routes.auth.register)} className="px-6 py-3 text-sm font-semibold rounded-xl text-green-900" style={{ background: "#BFA060" }}>
          Become a Vendor
        </button>
      </div>
    </div>
  );
};

export default HomePage;
