'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtworkById } from '@/store/slices/gallerySlice';
import ArtworkDetail from '@/components/gallery/ArtworkDetail';
import { useParams } from 'next/navigation';
import ArtworkDetailSkeleton from '@/components/gallery/ArtworkDetailSkeleton';

export default function ArtworkDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { selectedArtwork, loading, error } = useSelector((state) => state.gallery);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchArtworkById(params.id));
    }
  }, [dispatch, params?.id]);

  if (loading) return <ArtworkDetailSkeleton />;
  if (error) return <div className="container mx-auto px-4 py-8">Error: {error}</div>;

  return <ArtworkDetail artwork={selectedArtwork} />;
}