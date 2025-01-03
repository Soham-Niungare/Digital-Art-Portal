import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const galleryService = {
  getAllArtworks: async (page = 1, itemsPerPage = 9) => {
    try {
      const response = await axios.get(`${API_URL}/api/artworks`, {
        params: {
          page,
          size: itemsPerPage
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

  searchArtworks: async (searchParams) => {
    try {
      const response = await axios.get(`${API_URL}/api/artworks`, { params: searchParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default galleryService;