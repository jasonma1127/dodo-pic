/**
 * Sticker Constants
 * Defines all available stickers using emoji/unicode characters
 *
 * Each sticker object contains:
 * - id: Unique identifier
 * - emoji: Unicode emoji character
 * - name: Display name
 * - category: Category for grouping
 */

export const STICKERS = [
  // Emotions
  { id: 'heart', emoji: '❤️', name: 'Heart', category: 'emotions' },
  { id: 'star', emoji: '⭐', name: 'Star', category: 'emotions' },
  { id: 'sparkles', emoji: '✨', name: 'Sparkles', category: 'emotions' },
  { id: 'fire', emoji: '🔥', name: 'Fire', category: 'emotions' },
  { id: 'smile', emoji: '😊', name: 'Smile', category: 'emotions' },
  { id: 'cool', emoji: '😎', name: 'Cool', category: 'emotions' },
  { id: 'love', emoji: '😍', name: 'Love Eyes', category: 'emotions' },
  { id: 'party', emoji: '🎉', name: 'Party', category: 'emotions' },

  // Symbols
  { id: 'check', emoji: '✓', name: 'Check', category: 'symbols' },
  { id: 'cross', emoji: '✗', name: 'Cross', category: 'symbols' },
  { id: 'arrow-right', emoji: '→', name: 'Arrow Right', category: 'symbols' },
  { id: 'arrow-left', emoji: '←', name: 'Arrow Left', category: 'symbols' },
  { id: 'music', emoji: '♪', name: 'Music', category: 'symbols' },
  { id: 'peace', emoji: '☮', name: 'Peace', category: 'symbols' },

  // Objects
  { id: 'camera', emoji: '📷', name: 'Camera', category: 'objects' },
  { id: 'balloon', emoji: '🎈', name: 'Balloon', category: 'objects' },
  { id: 'gift', emoji: '🎁', name: 'Gift', category: 'objects' },
  { id: 'crown', emoji: '👑', name: 'Crown', category: 'objects' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', category: 'objects' },
  { id: 'sun', emoji: '☀️', name: 'Sun', category: 'objects' },
];

/**
 * Sticker categories for filtering
 */
export const STICKER_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'emotions', name: 'Emotions' },
  { id: 'symbols', name: 'Symbols' },
  { id: 'objects', name: 'Objects' },
];

/**
 * Get stickers by category
 * @param {string} categoryId - Category identifier
 * @returns {Array} Array of sticker objects
 */
export const getStickersByCategory = (categoryId) => {
  if (categoryId === 'all') return STICKERS;
  return STICKERS.filter(s => s.category === categoryId);
};

/**
 * Get sticker by ID
 * @param {string} stickerId - Sticker identifier
 * @returns {Object|null} Sticker object or null if not found
 */
export const getStickerById = (stickerId) => {
  return STICKERS.find(s => s.id === stickerId) || null;
};
