import Image from 'next/image';
import Link from 'next/link';

export default function ArtworkDetail({ artwork }) {
  if (!artwork) return null;
  
  const fullImageUrl = `http://localhost:8082${artwork.imageUrl}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2">
            <div className="relative h-[400px] w-full">
              <Image
                src={fullImageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
                unoptimized={true}
                loader={({ src }) => src}
              />
            </div>
          </div>
          
          {/* Details Section */}
          <div className="md:w-1/2 p-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
              <p className="text-gray-600">{artwork.description}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Price</h3>
                <p className="text-2xl font-bold">${artwork.price.toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Details</h3>
                <ul className="space-y-2">
                  <li><span className="text-gray-600">Medium:</span> {artwork.medium}</li>
                  <li><span className="text-gray-600">Dimensions:</span> {artwork.dimensions}</li>
                  <li><span className="text-gray-600">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      artwork.status === 'SOLD' ? 'bg-red-100 text-red-800' :
                      artwork.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {artwork.status}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Tags</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link
                href="/gallery"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}