import Image from 'next/image';
import Link from 'next/link';

export default function ArtworkCard({ artwork }) {
  // Convert relative URL to absolute URL
  const fullImageUrl = `http://localhost:8082${artwork.imageUrl}`;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={fullImageUrl}
          alt={artwork.title}
          fill
          className="object-cover"
          // Add these props to handle external images
          unoptimized={true}
          loader={({ src }) => src}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{artwork.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{artwork.medium}</p>
        <p className="text-gray-800 font-bold">${artwork.price.toFixed(2)}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {artwork.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href={`/gallery/${artwork.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}