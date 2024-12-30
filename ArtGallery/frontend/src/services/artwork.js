import api from './axios';

export const artworkService = {
  getAllArtworks: async (params) => {
    const response = await api.get('/artworks', { params });
    return response.data;
  },

  getArtwork: async (id) => {
    const response = await api.get(`/artworks/${id}`);
    return response.data;
  },

  createArtwork: async (artworkData) => {
    const response = await api.post('/artworks', artworkData);
    return response.data;
  },

  updateArtwork: async (id, artworkData) => {
    const response = await api.put(`/artworks/${id}`, artworkData);
    return response.data;
  },

  uploadImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await api.post(`/artworks/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};