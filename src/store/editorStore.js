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
      selectedFrame: 'none',   // string - Selected frame ID ('none' for no frame)

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
       * @param {string} frameId - Frame ID to apply ('none' to remove)
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
       * Reset all editor state to defaults
       */
      resetEditor: () =>
        set(
          {
            currentFilter: 'none',
            selectedFrame: 'none',
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
