export default function ArtworkCardSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        {/* Image placeholder */}
        <div className="h-48 bg-gray-200" />
        
        <div className="p-4">
          {/* Title placeholder */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          
          {/* Medium placeholder */}
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          
          {/* Price placeholder */}
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2" />
          
          {/* Tags placeholder */}
          <div className="flex flex-wrap gap-1 mt-2">
            <div className="h-6 bg-gray-200 rounded w-16" />
            <div className="h-6 bg-gray-200 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded w-14" />
          </div>
          
          {/* Link placeholder */}
          <div className="mt-4">
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
    );
  }