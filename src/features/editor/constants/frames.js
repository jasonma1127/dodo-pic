/**
 * Frame Constants
 * Defines all available photo frames
 *
 * Each frame object contains:
 * - id: Unique identifier
 * - name: Display name
 * - layouts: Object mapping layout IDs to frame image paths
 * - preview: Preview description
 * - previewStyle: CSS style for preview in editor (optional)
 *
 * Frame images should be placed in /public/frames/{frame-id}/
 * Each frame needs separate images for different layouts (2x2, 4x1, 1x4, 3x3, 2x3, etc.)
 * Images should have transparent center area where photos will show through
 *
 * IMPORTANT: Frame image dimensions (fixed sizes, 4:3 landscape):
 * - 2x2: 3920 x 3560 pixels
 * - 4x1: 7728 x 2104 pixels
 * - 1x4: 1984 x 6368 pixels
 * - 3x3: 5840 x 4960 pixels
 * - 2x3: 3920 x 4960 pixels
 *
 * Each photo cell is 1920x1440 pixels (4:3 landscape) with 16px gaps, 32px padding, and 300px top/bottom decoration
 */

export const FRAMES = [
  {
    id: 'none',
    name: 'No Frame',
    layouts: {},
    preview: 'Clean, no border',
    previewStyle: {}, // No style for preview
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    layouts: {
      '2x2': '/frames/polaroid/2x2.png',
      '4x1': '/frames/polaroid/4x1.png',
      '1x4': '/frames/polaroid/1x4.png',
      '3x3': '/frames/polaroid/3x3.png',
      '2x3': '/frames/polaroid/2x3.png',
    },
    preview: 'Classic instant photo',
    previewStyle: {
      border: '16px solid white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    },
  },
];

/**
 * Get frame by ID
 * @param {string} frameId - Frame identifier
 * @returns {Object|null} Frame object or null if not found
 */
export const getFrameById = (frameId) => {
  return FRAMES.find(f => f.id === frameId) || null;
};

/**
 * Get frame preview style by ID (for Editor preview only)
 * @param {string} frameId - Frame identifier
 * @returns {Object} CSS style object for preview
 */
export const getFrameStyle = (frameId) => {
  const frame = getFrameById(frameId);
  return frame ? (frame.previewStyle || {}) : {};
};

/**
 * Get frame image path by ID and layout
 * @param {string} frameId - Frame identifier
 * @param {string} layoutId - Layout identifier (e.g., '2x2', '4x1', '1x4', '3x3', '2x3')
 * @returns {string|null} Path to frame image or null
 */
export const getFrameImagePath = (frameId, layoutId) => {
  const frame = getFrameById(frameId);
  return frame?.layouts?.[layoutId] || null;
};
