const EventDetailsSkeleton = () => {
  return (
    <div className="page-wrapper animate-pulse">
      <div className="container-main py-8">
        {/* Back Button */}
        <div className="h-9 w-36 bg-green-200 rounded-lg mb-6" />

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          <div className="lg:col-span-2 h-[320px] sm:h-[380px] lg:h-[420px] bg-green-200 rounded-2xl" />
          <div className="flex flex-row lg:flex-col gap-3">
            <div className="shrink-0 w-32 lg:w-auto h-[100px] lg:h-[130px] bg-green-200 rounded-lg" />
            <div className="shrink-0 w-32 lg:w-auto h-[100px] lg:h-[130px] bg-green-200 rounded-lg" />
            <div className="shrink-0 w-32 lg:w-auto h-[100px] lg:h-[130px] bg-green-200 rounded-lg" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-10">
            {/* Name + Rating */}
            <div>
              <div className="h-3 w-24 bg-green-200 rounded mb-3" />
              <div className="h-10 w-3/4 bg-green-200 rounded mb-4" />
              <div className="h-4 w-1/2 bg-green-100 rounded mb-4" />
              <div className="h-px bg-green-200 mb-4" />
              <div className="flex gap-4">
                <div className="h-5 w-16 bg-green-200 rounded" />
                <div className="h-5 w-24 bg-green-100 rounded" />
                <div className="h-5 w-20 bg-green-100 rounded" />
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="h-6 w-40 bg-green-200 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-green-100 rounded" />
                <div className="h-4 w-full bg-green-100 rounded" />
                <div className="h-4 w-2/3 bg-green-100 rounded" />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <div className="h-6 w-32 bg-green-200 rounded mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-green-200 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="h-6 w-28 bg-green-200 rounded mb-4" />
              <div className="h-[280px] bg-green-100 rounded-xl" />
            </div>
          </div>

          {/* Right — Booking Card */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <div className="h-12 w-40 bg-green-200 rounded mb-2" />
              <div className="h-4 w-28 bg-green-100 rounded mb-5" />
              <div className="h-px bg-green-100 mb-5" />
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 bg-green-200 rounded" />
                    <div className="h-6 w-8 bg-green-200 rounded" />
                    <div className="h-3 w-12 bg-green-100 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-20 bg-green-50 rounded-xl mb-6" />
              <div className="h-14 bg-green-200 rounded-xl mb-3" />
              <div className="h-3 w-40 bg-green-100 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSkeleton;
