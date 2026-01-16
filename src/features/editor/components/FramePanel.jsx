/**
 * FramePanel Component
 * Frame selector with live previews
 *
 * Features:
 * - Displays all available frames
 * - Shows current frame selection
 * - Live preview with sample image
 * - Applies frame to entire photo grid
 */

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store';
import { usePhotoStore } from '@/store';
import { FRAMES } from '../constants/frames';
import { COPY } from '@/shared/copy/en';

const FramePanel = () => {
  const { photos } = usePhotoStore();
  const { selectedFrame, setFrame } = useEditorStore();

  // Use first photo for frame preview
  const previewPhoto = photos[0] || null;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {COPY.editor.frames.title}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {FRAMES.map((frame) => (
          <FrameItem
            key={frame.id}
            frame={frame}
            isSelected={selectedFrame === frame.id}
            previewPhoto={previewPhoto}
            onSelect={() => setFrame(frame.id)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * FrameItem - Individual frame option
 */
const FrameItem = ({ frame, isSelected, previewPhoto, onSelect }) => {
  return (
    <motion.button
      onClick={onSelect}
      className={`
        p-4 rounded-xl transition-all duration-200
        ${isSelected
          ? 'bg-ios-blue ring-2 ring-ios-blue shadow-lg'
          : 'bg-white hover:bg-ios-gray-50 ring-1 ring-gray-200'
        }
      `}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Frame Preview */}
      <div className="mb-3">
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
          {previewPhoto ? (
            <div className="w-full h-full" style={frame.style}>
              <img
                src={previewPhoto}
                alt={frame.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"
              style={frame.style}
            />
          )}
        </div>
      </div>

      {/* Frame Name */}
      <div className="text-center">
        <p className={`
          text-sm font-medium
          ${isSelected ? 'text-white' : 'text-gray-900'}
        `}>
          {frame.name}
        </p>
        <p className={`
          text-xs mt-1
          ${isSelected ? 'text-blue-100' : 'text-gray-500'}
        `}>
          {frame.preview}
        </p>
      </div>
    </motion.button>
  );
};

export default FramePanel;
