import React, { useEffect, useState } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    tagline: "DISCOVERY OF LUXURY HOTEL",
  },
  {
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    tagline: "Experience Unforgettable Events",
  },
  {
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    tagline: "Your Perfect Stay Awaits",
  },
];

const AuthImagePanel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full relative overflow-hidden  rounded-[2px]">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${slides[activeIndex].image})` }}
      ></div>
      <div className="absolute inset-0 bg-green-900/65 "></div>
      <div className="absolute top-7 left-7 text-gray-50 font-display text-2xl font-bold">
        Stays <span className="text-yellow-500">Event</span>
      </div>

      <div className="absolute bottom-8 left-8  right-8 flex flex-col gap-3">
        <div className="section-eyebrow">Premium Experience</div>
        <div className="font-display text-3xl font-bold text-white">
          {slides[activeIndex].tagline}
        </div>

        <div className="flex gap-2 mt-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-7 bg-yellow-500" : `w-1.5 bg-white/40`}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthImagePanel;
