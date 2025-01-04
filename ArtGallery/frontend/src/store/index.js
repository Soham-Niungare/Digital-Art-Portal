import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import galleryReducer from './slices/gallerySlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gallery: galleryReducer,
    order: orderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;