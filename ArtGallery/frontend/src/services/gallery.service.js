import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to clean and format filters
const formatFilters = (filters) => {
  const cleanFilters = {};
  
  if (filters) {
    // Handle search term
    if (filters.searchTerm) {
      cleanFilters.searchTerm = filters.searchTerm;
    }

    // Handle status
    if (filters.status) {
      cleanFilters.status = filters.status;
    }

    // Handle price range
    if (filters.priceRange) {
      if (typeof filters.priceRange.min === 'number' && filters.priceRange.min > 0) {
        cleanFilters.minPrice = filters.priceRange.min;
      }
      if (typeof filters.priceRange.max === 'number' && filters.priceRange.max < Infinity) {
        cleanFilters.maxPrice = filters.priceRange.max;
      }
    }

    // Handle tags
    if (filters.tags && filters.tags.length > 0) {
      cleanFilters.tags = filters.tags.join(',');
    }

    // Handle categories
    if (filters.categories && filters.categories.length > 0) {
      cleanFilters.categories = filters.categories.join(',');
    }
  }

  return cleanFilters;
};

const galleryService = {
  getAllArtworks: async (page = 1, itemsPerPage = 9, filters = {}) => {
    try {
      // Format the filters to remove invalid characters and values
      const cleanFilters = formatFilters(filters);
      const response = await axios.get(`${API_URL}/api/artworks`, {
        params: {
          page,
          size: itemsPerPage,
          ...cleanFilters
        },
        paramsSerializer: params => {
          return Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== '')
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getArtworkById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/artworks/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getArtworksByCategory: async (categoryId, page = 1, itemsPerPage = 9) => {
    try {
      const response = await axios.get(`${API_URL}/api/categories/${categoryId}/artworks`, {
        params: {
          page: page - 1, // Adjust for 0-based indexing in backend
          size: itemsPerPage
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

};

export default galleryService;