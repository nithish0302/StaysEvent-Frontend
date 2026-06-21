const EventCardSkeleton = () => {
  return (
   
    <div className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-md animate-pulse">
   
      <div className="h-64 bg-green-100 relative">
        <div className="absolute top-4 left-4 h-8 w-20 rounded-xl bg-green-200" />
        <div className="absolute top-4 right-4 h-7 w-24 rounded-full bg-green-200" />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="h-8 w-3/4 bg-green-200 rounded mb-3" />
          <div className="h-4 w-1/2 bg-green-200 rounded" />
        </div>
      </div>

  
      <div className="p-5">
   
        <div className="flex gap-2 mb-5">
          <div className="h-7 w-20 rounded-full bg-green-100" />
          <div className="h-7 w-24 rounded-full bg-green-100" />
        </div>

        <div className="flex gap-2 mb-5">
          <div className="h-6 w-16 rounded-full bg-green-50" />
          <div className="h-6 w-20 rounded-full bg-green-50" />
          <div className="h-6 w-14 rounded-full bg-green-50" />
        </div>

      
        <div className="h-4 w-40 bg-green-100 rounded mb-6" />

      
        <div className="border-t border-green-100 pt-4 flex justify-between items-center">
          <div>
            <div className="h-8 w-24 bg-green-100 rounded mb-2" />
            <div className="h-3 w-16 bg-green-50 rounded" />
          </div>
          <div className="h-10 w-24 bg-green-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
