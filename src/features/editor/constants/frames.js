/**
 * Frame Constants
 * Defines all available photo frames grouped by artists
 *
 * File structure:
 * public/frames/
 *   ├── {artistId}/
 *   │   ├── artist.json          (artist metadata)
 *   │   ├── 2x2/
 *   │   │   └── {frameId}.png
 *   │   ├── 1x4/
 *   │   │   └── {frameId}.png
 *   │   └── 3x3/
 *   │       └── {frameId}.png
 *
 * Each frame object contains:
 * - id: Unique identifier
 * - name: Display name
 * - artistId: Reference to artist (or null for built-in frames)
 * - preview: Preview description
 *
 * Frame images have transparent center area where photos show through
 *
 * IMPORTANT: Frame image dimensions (4:3 landscape photos):
 * Each photo cell: 1920x1440 pixels (4:3 landscape)
 * Cell gap: 64px between photos
 *
 * Frame sizes by layout:
 * - 2x2: 4168 x 4120 pixels (cellGap: 64, sideBorder: 60, topBorder: 1000, bottomBorder: 120)
 * - 1x4: 2040 x 7480 pixels (cellGap: 64, sideBorder: 60, topBorder: 120, bottomBorder: 1000)
 * - 3x3: 6088 x 6880 pixels (cellGap: 64, sideBorder: 60, topBorder: 1200, bottomBorder: 1200)
 *
 * Frame generation: Use tools/frame-generator.html with matching parameters
 */

/**
 * Artist information
 */
export const ARTISTS = {
  builtin: {
    id: 'builtin',
    name: 'Built-in',
    instagram: null,
    bio: 'Default frames',
  },
  'dodo-lin': {
    id: 'dodo-lin',
    name: 'Dodo Lin',
    instagram: '@july1st_2014',
    bio: 'Frame designer and artist',
  },
  // Add more artists here as they join
};

export const FRAMES = [
  {
    id: 'none',
    name: 'No Frame',
    artistId: 'builtin',
    preview: 'Clean, no border',
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    artistId: 'dodo-lin',
    preview: 'Classic instant photo',
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
 * Get frame image path by ID and layout
 * Uses new structure: /frames/{artistId}/{layoutId}/{frameId}.png
 * @param {string} frameId - Frame identifier
 * @param {string} layoutId - Layout identifier (e.g., '2x2', '1x4', '3x3')
 * @returns {string|null} Path to frame image or null
 */
export const getFrameImagePath = (frameId, layoutId) => {
  const frame = getFrameById(frameId);
  if (!frame || !frame.artistId) return null;

  // No frame returns null (no image)
  if (frameId === 'none') return null;

  // New structure: /frames/{artistId}/{layoutId}/{frameId}.png
  return `/frames/${frame.artistId}/${layoutId}/${frameId}.png`;
};

/**
 * Get artist by ID
 * @param {string} artistId - Artist identifier
 * @returns {Object|null} Artist object or null if not found
 */
export const getArtistById = (artistId) => {
  return ARTISTS[artistId] || null;
};

/**
 * Get frames grouped by artist
 * @returns {Object} Object with artistId as keys and array of frames as values
 */
export const getFramesByArtist = () => {
  const grouped = {};

  FRAMES.forEach(frame => {
    const artistId = frame.artistId || 'builtin';
    if (!grouped[artistId]) {
      grouped[artistId] = [];
    }
    grouped[artistId].push(frame);
  });

  return grouped;
};

/**
 * Get all unique artists who have frames
 * @returns {Array} Array of artist objects
 */
export const getFrameArtists = () => {
  const artistIds = [...new Set(FRAMES.map(f => f.artistId || 'builtin'))];
  return artistIds.map(id => ARTISTS[id]).filter(Boolean);
};
