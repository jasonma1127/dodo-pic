/**
 * Editor Store
 * Manages photo editing state (filters and frames)
 *
 * This store handles:
 * - Currently applied filter
 * - Selected frame overlay
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useEditorStore = create(
  devtools(
    (set, get) => ({
      /**
       * State
       */
      currentFilter: 'none',   // string - Currently selected filter ID
      selectedFrame: 'solid-color',   // string - Selected frame ID
      frameColor: '#FFFFFF',   // string - Custom frame color (for solid-color frame)

      /**
       * Actions
       */

      /**
       * Set the current filter
       * @param {string} filterId - Filter identifier ('none', 'bw', 'vintage', etc.)
       */
      setFilter: (filterId) =>
        set(
          {
            currentFilter: filterId,
          },
          false,
          'editor/setFilter'
        ),

      /**
       * Set the frame overlay
       * @param {string} frameId - Frame ID to apply
       */
      setFrame: (frameId) =>
        set(
          {
            selectedFrame: frameId,
          },
          false,
          'editor/setFrame'
        ),

      /**
       * Set custom frame color
       * @param {string} color - Hex color code (e.g., '#FFFFFF')
       */
      setFrameColor: (color) =>
        set(
          {
            frameColor: color,
          },
          false,
          'editor/setFrameColor'
        ),

      /**
       * Reset all editor state to defaults
       */
      resetEditor: () =>
        set(
          {
            currentFilter: 'none',
            selectedFrame: 'solid-color',
            frameColor: '#FFFFFF',
          },
          false,
          'editor/reset'
        ),
    }),
    {
      name: 'editor-storage',
      enabled: true,
    }
  )
);
