/**
 * Frame Constants
 * Defines all available photo frames with CSS styling
 *
 * Each frame object contains:
 * - id: Unique identifier
 * - name: Display name
 * - style: CSS properties object
 * - preview: Preview description
 */

export const FRAMES = [
  {
    id: 'none',
    name: 'No Frame',
    style: {},
    preview: 'Clean, no border',
  },
  {
    id: 'classic-white',
    name: 'Classic White',
    style: {
      border: '16px solid white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    },
    preview: 'Polaroid style',
  },
  {
    id: 'classic-black',
    name: 'Classic Black',
    style: {
      border: '12px solid #1a1a1a',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    },
    preview: 'Gallery frame',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    style: {
      border: '8px solid white',
      borderRadius: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    },
    preview: 'Soft rounded edges',
  },
  {
    id: 'film',
    name: 'Film Strip',
    style: {
      border: '4px solid #2a2a2a',
      borderTop: '24px solid #2a2a2a',
      borderBottom: '24px solid #2a2a2a',
      position: 'relative',
    },
    preview: 'Vintage film look',
    decorator: 'film-holes', // Special decorator for film perforations
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    style: {
      border: '4px solid #fff',
      boxShadow: '0 0 20px rgba(0, 122, 255, 0.6), 0 0 40px rgba(0, 122, 255, 0.4)',
    },
    preview: 'Glowing neon edge',
  },
  {
    id: 'torn',
    name: 'Torn Edge',
    style: {
      border: '8px solid white',
      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
    },
    preview: 'Rough torn paper',
    decorator: 'torn-edge', // Special SVG path for torn effect
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
 * Get frame style by ID
 * @param {string} frameId - Frame identifier
 * @returns {Object} CSS style object
 */
export const getFrameStyle = (frameId) => {
  const frame = getFrameById(frameId);
  return frame ? frame.style : {};
};

/**
 * Check if frame has decorator
 * @param {string} frameId - Frame identifier
 * @returns {string|null} Decorator type or null
 */
export const getFrameDecorator = (frameId) => {
  const frame = getFrameById(frameId);
  return frame?.decorator || null;
};
