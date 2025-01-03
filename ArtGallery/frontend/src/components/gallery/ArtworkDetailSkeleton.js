export default function ArtworkDetailSkeleton() {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
          <div className="md:flex">
            {/* Image placeholder */}
            <div className="md:w-1/2">
              <div className="h-[400px] bg-gray-200" />
            </div>
            
            {/* Details Section */}
            <div className="md:w-1/2 p-8">
              {/* Title and description */}
              <div className="mb-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
              
              <div className="space-y-6">
                {/* Price section */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-20 mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-32" />
                </div>
                
                {/* Details section */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-24 mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                
                {/* Tags section */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-16 mb-3" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 bg-gray-200 rounded w-20" />
                    <div className="h-8 bg-gray-200 rounded w-24" />
                    <div className="h-8 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
              
              {/* Back button */}
              <div className="mt-8">
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }