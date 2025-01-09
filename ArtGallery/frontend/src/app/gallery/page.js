'use client';

import { useEffect , useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchArtworks, 
  fetchCategories, 
  setCurrentPage, 
  toggleCategory, 
  clearFilters 
} from '@/store/slices/gallerySlice';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import Pagination from '@/components/gallery/Pagination';
import GalleryGridSkeleton from '@/components/gallery/GalleryGridSkeleton';

export default function GalleryPage() {
  const dispatch = useDispatch();
  const { 
    artworks, 
    categories,
    selectedCategories,
    loading, 
    categoriesLoading,
    error, 
    pagination,
    filters 
  } = useSelector((state) => state.gallery);


  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  // Extract all artworks from categories when no specific category is selected
  const getAllArtworksFromCategories = () => {
    if (!categories) return [];
    return categories.reduce((allArtworks, category) => {
      return [...allArtworks, ...(category.artworks || [])];
    }, []);
  };

  // Get filtered artworks based on selected categories
  const getFilteredArtworks = () => {
    if (!categories) return [];
    if (selectedCategories.length === 0) {
      return getAllArtworksFromCategories();
    }
    return categories
      .filter(category => selectedCategories.includes(category.id))
      .reduce((allArtworks, category) => {
        return [...allArtworks, ...(category.artworks || [])];
      }, []);
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleCategoryToggle = (categoryId) => {
    dispatch(toggleCategory(categoryId));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };


  if (loading || categoriesLoading) return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Art Gallery</h1>
      <GalleryGridSkeleton />
    </div>
  );
  if (error) return <div>Error: {error}</div>;
  const displayArtworks = getFilteredArtworks();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Art Gallery</h1>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Categories Filter Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories && categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategories.includes(category.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {category.name} ({category.artworks?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-gray-600">
        Showing {displayArtworks.length} artworks
      </div>

      {/* Artworks Grid */}
      {displayArtworks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No artworks found in selected categories.</p>
        </div>
      )}

      {/* Pagination */}
      {displayArtworks.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={Math.ceil(displayArtworks.length / pagination.itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}