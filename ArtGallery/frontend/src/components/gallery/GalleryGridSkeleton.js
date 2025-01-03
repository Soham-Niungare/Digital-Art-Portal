import ArtworkCardSkeleton from './ArtworkCardSkeleton';

export default function GalleryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, index) => (
        <ArtworkCardSkeleton key={index} />
      ))}
    </div>
  );
}