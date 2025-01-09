import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import galleryService from '@/services/gallery.service';

export const fetchArtworks = createAsyncThunk(
  'gallery/fetchArtworks',
  async ({ page, filters }, { rejectWithValue }) => {
    try {
      const response = await galleryService.getAllArtworks(page, 9, filters);
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

export const fetchCategories = createAsyncThunk(
  'gallery/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await galleryService.getAllCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchArtworksByCategory = createAsyncThunk(
  'gallery/fetchArtworksByCategory',
  async ({ categoryId, page }, { rejectWithValue }) => {
    try {
      const response = await galleryService.getArtworksByCategory(categoryId, page);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  artworks: [],
  categories: [],
  selectedArtwork: null,
  selectedCategories: [],
  loading: false,
  categoriesLoading: false,
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
    tags: [],
    categories: []
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
      state.selectedCategories = []; // Reset selectedCategories as well
      state.pagination.currentPage = 1; // Reset to first page
    },
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setCurrentPage: (state, action) => {
        state.pagination.currentPage = action.payload;
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
      state.filters.categories = action.payload;
    },
    toggleCategory: (state, action) => {
      const categoryId = action.payload;
      const index = state.selectedCategories.indexOf(categoryId);
      if (index === -1) {
        state.selectedCategories.push(categoryId);
      } else {
        state.selectedCategories.splice(index, 1);
      }
      state.filters.categories = state.selectedCategories;
    }
  },
  extraReducers: (builder) => {
    builder
      // artwork reducers
      .addCase(fetchArtworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number + 1,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalElements,
          itemsPerPage: state.pagination.itemsPerPage
        };
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Categories reducers
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      })
      // Existing artwork by ID reducers
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

export const {
  setFilters,
  clearFilters,
  setSearchTerm,
  setCurrentPage,
  setSelectedCategories,
  toggleCategory
} = gallerySlice.actions;
export default gallerySlice.reducer;