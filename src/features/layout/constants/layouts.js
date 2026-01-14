/**
 * Layout Configurations
 * Defines all available photo layouts
 */

export const LAYOUTS = [
  {
    id: '2x2',
    name: 'Classic 2x2',
    rows: 2,
    cols: 2,
    total: 4,
    previewImage: '/assets/layout-previews/2x2.jpg',
    description: 'Classic photo booth style with 4 photos',
  },
  {
    id: '1x4',
    name: 'Vertical Strip',
    rows: 4,
    cols: 1,
    total: 4,
    previewImage: '/assets/layout-previews/1x4.jpg',
    description: 'Vertical strip layout',
  },
  {
    id: '3x3',
    name: 'Grid 3x3',
    rows: 3,
    cols: 3,
    total: 9,
    previewImage: '/assets/layout-previews/3x3.jpg',
    description: 'Nine photos in a grid',
  },
];

/**
 * Get layout by ID
 * @param {string} layoutId - Layout identifier
 * @returns {Object|null} Layout object or null if not found
 */
export const getLayoutById = (layoutId) => {
  return LAYOUTS.find((layout) => layout.id === layoutId) || null;
};

/**
 * Get default layout (2x2)
 * @returns {Object} Default layout
 */
export const getDefaultLayout = () => {
  return LAYOUTS[0]; // 2x2
};
