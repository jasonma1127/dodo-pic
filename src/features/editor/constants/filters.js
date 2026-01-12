/**
 * Filter Constants
 * Defines all available photo filters with CSS filter values
 *
 * Each filter object contains:
 * - id: Unique identifier
 * - name: Display name (from COPY)
 * - filter: CSS filter string
 * - preview: Optional preview description
 */

export const FILTERS = [
  {
    id: 'none',
    name: 'Original',
    filter: 'none',
    preview: 'No filter applied',
  },
  {
    id: 'bw',
    name: 'Black & White',
    filter: 'grayscale(100%)',
    preview: 'Classic monochrome',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    filter: 'sepia(50%) contrast(110%) brightness(105%)',
    preview: 'Warm retro feel',
  },
  {
    id: 'vivid',
    name: 'Vivid',
    filter: 'saturate(150%) contrast(110%)',
    preview: 'Bold and vibrant',
  },
  {
    id: 'cool',
    name: 'Cool Tone',
    filter: 'hue-rotate(180deg) saturate(120%) brightness(95%)',
    preview: 'Blue-tinted cool',
  },
  {
    id: 'warm',
    name: 'Warm Tone',
    filter: 'sepia(30%) saturate(120%) brightness(105%)',
    preview: 'Golden warm glow',
  },
  {
    id: 'fade',
    name: 'Faded',
    filter: 'brightness(110%) contrast(85%) saturate(80%)',
    preview: 'Soft and dreamy',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    filter: 'contrast(130%) brightness(95%) saturate(110%)',
    preview: 'High contrast punch',
  },
];

/**
 * Get filter by ID
 * @param {string} filterId - Filter identifier
 * @returns {Object|null} Filter object or null if not found
 */
export const getFilterById = (filterId) => {
  return FILTERS.find(f => f.id === filterId) || null;
};

/**
 * Get filter CSS string by ID
 * @param {string} filterId - Filter identifier
 * @returns {string} CSS filter string
 */
export const getFilterCSS = (filterId) => {
  const filter = getFilterById(filterId);
  return filter ? filter.filter : 'none';
};
