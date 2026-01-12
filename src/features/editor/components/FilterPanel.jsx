/**
 * FilterPanel Component
 * Horizontal scrollable filter selector with live previews
 *
 * Features:
 * - Displays all available filters with preview
 * - Shows current filter selection
 * - Applies filter to all photos in photoStore
 * - Smooth animations on selection
 */

import { motion } from 'framer-motion';
import { usePhotoStore } from '@/store';
import { useEditorStore } from '@/store';
import { FILTERS } from '../constants/filters';
import { COPY } from '@/shared/copy/en';

const FilterPanel = () => {
  const { photos } = usePhotoStore();
  const { currentFilter, setFilter } = useEditorStore();

  // Use first photo for filter preview
  const previewPhoto = photos[0] || null;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {COPY.editor.filters.title}
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {FILTERS.map((filter) => (
          <FilterItem
            key={filter.id}
            filter={filter}
            isSelected={currentFilter === filter.id}
            previewPhoto={previewPhoto}
            onSelect={() => setFilter(filter.id)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * FilterItem - Individual filter option
 */
const FilterItem = ({ filter, isSelected, previewPhoto, onSelect }) => {
  return (
    <motion.button
      onClick={onSelect}
      className={`
        flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl
        transition-all duration-200
        ${isSelected
          ? 'bg-ios-blue text-white shadow-lg'
          : 'bg-white text-gray-700 hover:bg-ios-gray-100'
        }
      `}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Filter Preview */}
      <div className={`
        w-20 h-20 rounded-lg overflow-hidden
        ${isSelected ? 'ring-2 ring-white' : 'ring-1 ring-gray-200'}
      `}>
        {previewPhoto ? (
          <img
            src={previewPhoto}
            alt={filter.name}
            className="w-full h-full object-cover"
            style={{ filter: filter.filter }}
          />
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"
            style={{ filter: filter.filter }}
          />
        )}
      </div>

      {/* Filter Name */}
      <span className={`
        text-sm font-medium whitespace-nowrap
        ${isSelected ? 'text-white' : 'text-gray-700'}
      `}>
        {filter.name}
      </span>
    </motion.button>
  );
};

export default FilterPanel;
