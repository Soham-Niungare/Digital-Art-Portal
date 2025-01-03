'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtworks, setCurrentPage } from '@/store/slices/gallerySlice';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import Pagination from '@/components/gallery/Pagination';
import GalleryGridSkeleton from '@/components/gallery/GalleryGridSkeleton';

export default function GalleryPage() {
  const dispatch = useDispatch();
  const { artworks, loading, error, pagination } = useSelector((state) => state.gallery);

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch, pagination.currentPage]);

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Art Gallery</h1>
      <GalleryGridSkeleton />
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Art Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}