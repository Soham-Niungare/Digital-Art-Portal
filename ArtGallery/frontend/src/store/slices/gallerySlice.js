import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import galleryService from '@/services/gallery.service';

export const fetchArtworks = createAsyncThunk(
  'gallery/fetchArtworks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await galleryService.getAllArtworks();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchArtworkById = createAsyncThunk(
  'gallery/fetchArtworkById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await galleryService.getArtworkById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
    artworks: [],
    selectedArtwork: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 9
    },
    filters: {
      searchTerm: '',
      status: '',
      priceRange: { min: 0, max: Infinity },
      tags: []
    }
  };

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setCurrentPage: (state, action) => {
        state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = action.payload;
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchArtworkById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworkById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArtwork = action.payload;
      })
      .addCase(fetchArtworkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters, setSearchTerm, setCurrentPage } = gallerySlice.actions;
export default gallerySlice.reducer;