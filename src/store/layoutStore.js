/**
 * Layout Store
 * Manages selected photo layout configuration
 *
 * This store handles:
 * - Currently selected layout
 * - Layout selection and clearing
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * @typedef {Object} Layout
 * @property {string} id - Layout identifier ('2x2', '1x4', '3x3')
 * @property {string} name - Display name
 * @property {number} rows - Number of rows in grid
 * @property {number} cols - Number of columns in grid
 * @property {number} total - Total number of photos (rows × cols)
 * @property {string} previewImage - Path to preview image
 */

export const useLayoutStore = create(
  devtools(
    (set, get) => ({
      /**
       * State
       */
      selectedLayout: null, // Layout | null - Currently selected layout

      /**
       * Actions
       */

      /**
       * Select a layout
       * @param {Layout} layout - Layout configuration object
       */
      selectLayout: (layout) =>
        set(
          (state) => {
            // Validate layout object
            if (!layout || !layout.id || !layout.total) {
              console.error('Invalid layout object');
              return state;
            }

            return {
              selectedLayout: layout,
            };
          },
          false,
          'layout/select'
        ),

      /**
       * Clear the selected layout
       */
      clearLayout: () =>
        set(
          {
            selectedLayout: null,
          },
          false,
          'layout/clear'
        ),

      /**
       * Check if a layout is selected
       * @returns {boolean}
       */
      hasLayoutSelected: () => {
        return get().selectedLayout !== null;
      },

      /**
       * Get the total number of photos for selected layout
       * @returns {number}
       */
      getPhotoCount: () => {
        const layout = get().selectedLayout;
        return layout ? layout.total : 0;
      },
    }),
    {
      name: 'layout-storage',
      enabled: true,
    }
  )
);
