/**
 * Editor Store
 * Manages photo editing state (filters, stickers, frames)
 *
 * This store handles:
 * - Currently applied filter
 * - Stickers added to the canvas
 * - Selected frame overlay
 * - Editor operations (add, update, remove stickers)
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * @typedef {Object} Sticker
 * @property {string} id - Unique identifier
 * @property {string} src - Image source path or emoji
 * @property {number} x - X position in percentage (0-100)
 * @property {number} y - Y position in percentage (0-100)
 * @property {number} scale - Scale factor (0.5 - 2.0)
 * @property {number} rotation - Rotation in degrees (0 - 360)
 * @property {number} zIndex - Layer order
 */

export const useEditorStore = create(
  devtools(
    (set, get) => ({
      /**
       * State
       */
      currentFilter: 'none',   // string - Currently selected filter ID
      appliedStickers: [],     // Array<Sticker> - Stickers on canvas
      selectedFrame: 'none',   // string - Selected frame ID ('none' for no frame)
      selectedStickerId: null, // string | null - Currently selected sticker for editing

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
       * Add a sticker to the canvas
       * @param {Omit<Sticker, 'id' | 'zIndex'>} stickerData - Sticker data without id and zIndex
       */
      addSticker: (stickerData) =>
        set((state) => {
          // Generate unique ID
          const id = `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          // Calculate next z-index
          const maxZIndex = state.appliedStickers.reduce(
            (max, s) => Math.max(max, s.zIndex),
            0
          );

          const newSticker = {
            ...stickerData,
            id,
            zIndex: maxZIndex + 1,
          };

          return {
            appliedStickers: [...state.appliedStickers, newSticker],
            selectedStickerId: id, // Auto-select newly added sticker
          };
        }, false, 'editor/addSticker'),

      /**
       * Update sticker properties
       * @param {string} stickerId - Sticker ID to update
       * @param {Partial<Sticker>} updates - Properties to update
       */
      updateSticker: (stickerId, updates) =>
        set((state) => {
          const newStickers = state.appliedStickers.map((sticker) =>
            sticker.id === stickerId
              ? { ...sticker, ...updates }
              : sticker
          );

          return {
            appliedStickers: newStickers,
          };
        }, false, 'editor/updateSticker'),

      /**
       * Remove a sticker from canvas
       * @param {string} stickerId - Sticker ID to remove
       */
      removeSticker: (stickerId) =>
        set((state) => {
          const newStickers = state.appliedStickers.filter(
            (sticker) => sticker.id !== stickerId
          );

          return {
            appliedStickers: newStickers,
            // Deselect if removing selected sticker
            selectedStickerId:
              state.selectedStickerId === stickerId
                ? null
                : state.selectedStickerId,
          };
        }, false, 'editor/removeSticker'),

      /**
       * Select a sticker for editing
       * @param {string | null} stickerId - Sticker ID to select, or null to deselect
       */
      selectSticker: (stickerId) =>
        set(
          {
            selectedStickerId: stickerId,
          },
          false,
          'editor/selectSticker'
        ),

      /**
       * Bring sticker forward in z-index
       * @param {string} stickerId - Sticker ID
       */
      bringForward: (stickerId) =>
        set((state) => {
          const sticker = state.appliedStickers.find((s) => s.id === stickerId);
          if (!sticker) return state;

          const maxZIndex = state.appliedStickers.reduce(
            (max, s) => Math.max(max, s.zIndex),
            0
          );

          if (sticker.zIndex >= maxZIndex) return state; // Already on top

          const newStickers = state.appliedStickers.map((s) =>
            s.id === stickerId ? { ...s, zIndex: s.zIndex + 1 } : s
          );

          return {
            appliedStickers: newStickers,
          };
        }, false, 'editor/bringForward'),

      /**
       * Send sticker backward in z-index
       * @param {string} stickerId - Sticker ID
       */
      sendBackward: (stickerId) =>
        set((state) => {
          const sticker = state.appliedStickers.find((s) => s.id === stickerId);
          if (!sticker || sticker.zIndex <= 1) return state; // Can't go lower

          const newStickers = state.appliedStickers.map((s) =>
            s.id === stickerId ? { ...s, zIndex: s.zIndex - 1 } : s
          );

          return {
            appliedStickers: newStickers,
          };
        }, false, 'editor/sendBackward'),

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
            appliedStickers: [],
            selectedFrame: 'none',
            selectedStickerId: null,
          },
          false,
          'editor/reset'
        ),

      /**
       * Get selected sticker object
       * @returns {Sticker | null}
       */
      getSelectedSticker: () => {
        const state = get();
        if (!state.selectedStickerId) return null;

        return (
          state.appliedStickers.find((s) => s.id === state.selectedStickerId) ||
          null
        );
      },
    }),
    {
      name: 'editor-storage',
      enabled: true,
    }
  )
);
