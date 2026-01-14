/**
 * Photo Store
 * Manages captured photos state and operations
 *
 * This store handles:
 * - Array of captured photo data URLs
 * - Current photo index for editing
 * - Maximum photos based on selected layout
 * - Photo capture, removal, and replacement operations
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const usePhotoStore = create(
  devtools(
    (set, get) => ({
      /**
       * State
       */
      photos: [],              // Array<string> - Data URLs of captured photos
      currentPhotoIndex: 0,    // number - Currently selected photo for editing
      maxPhotos: 4,            // number - Total photos based on layout (default 2x2)

      /**
       * Actions
       */

      /**
       * Add a new photo to the collection
       * @param {string} photoDataUrl - Base64 data URL of the captured photo
       */
      addPhoto: (photoDataUrl) =>
        set((state) => {
          // Only add if we haven't reached max photos
          if (state.photos.length >= state.maxPhotos) {
            console.warn('Maximum photos reached');
            return state;
          }

          return {
            photos: [...state.photos, photoDataUrl],
          };
        }, false, 'photo/add'),

      /**
       * Remove a photo by index
       * @param {number} index - Index of photo to remove
       */
      removePhoto: (index) =>
        set((state) => {
          if (index < 0 || index >= state.photos.length) {
            console.error('Invalid photo index');
            return state;
          }

          const newPhotos = state.photos.filter((_, i) => i !== index);

          return {
            photos: newPhotos,
            // Adjust current index if needed
            currentPhotoIndex:
              state.currentPhotoIndex >= newPhotos.length
                ? Math.max(0, newPhotos.length - 1)
                : state.currentPhotoIndex,
          };
        }, false, 'photo/remove'),

      /**
       * Replace a photo at specific index (for retake functionality)
       * @param {number} index - Index of photo to replace
       * @param {string} photoDataUrl - New photo data URL
       */
      replacePhoto: (index, photoDataUrl) =>
        set((state) => {
          if (index < 0 || index >= state.photos.length) {
            console.error('Invalid photo index');
            return state;
          }

          const newPhotos = [...state.photos];
          newPhotos[index] = photoDataUrl;

          return {
            photos: newPhotos,
          };
        }, false, 'photo/replace'),

      /**
       * Clear all photos
       */
      clearPhotos: () =>
        set(
          {
            photos: [],
            currentPhotoIndex: 0,
          },
          false,
          'photo/clear'
        ),

      /**
       * Set the currently selected photo index
       * @param {number} index - Photo index to select
       */
      setCurrentPhotoIndex: (index) =>
        set((state) => {
          if (index < 0 || index >= state.photos.length) {
            console.error('Invalid photo index');
            return state;
          }

          return {
            currentPhotoIndex: index,
          };
        }, false, 'photo/setCurrentIndex'),

      /**
       * Set maximum number of photos (based on layout)
       * @param {number} count - Maximum number of photos
       */
      setMaxPhotos: (count) =>
        set(
          (state) => {
            if (count < 1) {
              console.error('Max photos must be at least 1');
              return state;
            }

            return {
              maxPhotos: count,
            };
          },
          false,
          'photo/setMaxPhotos'
        ),

      /**
       * Check if all photos have been captured
       * @returns {boolean}
       */
      areAllPhotosCaptured: () => {
        const state = get();
        return state.photos.length === state.maxPhotos;
      },

      /**
       * Get remaining photos count
       * @returns {number}
       */
      getRemainingPhotosCount: () => {
        const state = get();
        return Math.max(0, state.maxPhotos - state.photos.length);
      },
    }),
    {
      name: 'photo-storage',
      // Enable Redux DevTools
      enabled: true,
    }
  )
);
