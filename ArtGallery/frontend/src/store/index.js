import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import galleryReducer from './slices/gallerySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gallery: galleryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;