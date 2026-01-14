/**
 * StickerPanel Component
 * Sticker selector with category filtering
 *
 * Features:
 * - Category tabs for filtering
 * - Grid layout for stickers
 * - Click to add sticker to canvas
 * - Visual feedback on selection
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store';
import { STICKERS, STICKER_CATEGORIES, getStickersByCategory } from '../constants/stickers';
import { COPY } from '@/shared/copy/en';

const StickerPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addSticker } = useEditorStore();

  const displayedStickers = getStickersByCategory(selectedCategory);

  const handleStickerClick = (sticker) => {
    // Add sticker to center of canvas with default properties
    addSticker({
      stickerId: sticker.id,
      emoji: sticker.emoji,
      x: 50, // Percentage from left
      y: 50, // Percentage from top
      scale: 1,
      rotation: 0,
    });
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {COPY.editor.stickers.title}
      </h3>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {STICKER_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              whitespace-nowrap transition-all duration-200
              ${selectedCategory === category.id
                ? 'bg-ios-blue text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-ios-gray-100'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Sticker Grid */}
      <div className="grid grid-cols-5 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
        {displayedStickers.map((sticker) => (
          <StickerItem
            key={sticker.id}
            sticker={sticker}
            onClick={() => handleStickerClick(sticker)}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        {COPY.editor.stickers.hint}
      </p>
    </div>
  );
};

/**
 * StickerItem - Individual sticker button
 */
const StickerItem = ({ sticker, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="
        aspect-square rounded-lg bg-white hover:bg-ios-gray-100
        flex items-center justify-center text-3xl
        transition-all duration-200
        border border-gray-200 hover:border-ios-blue
      "
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      title={sticker.name}
    >
      {sticker.emoji}
    </motion.button>
  );
};

export default StickerPanel;
