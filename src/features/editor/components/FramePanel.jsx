/**
 * FramePanel Component
 * Frame selector with live previews grouped by artist
 *
 * Features:
 * - Displays frames grouped by artist
 * - Artist tabs for navigation
 * - Shows artist name and Instagram handle
 * - Live preview with sample image
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useEditorStore } from '@/store';
import { useLayoutStore } from '@/store';
import { getFramesByArtist, getFrameArtists, getArtistById, getFrameImagePath } from '../constants/frames';
import { COPY } from '@/shared/copy/en';

const FramePanel = () => {
  const { selectedFrame, setFrame } = useEditorStore();
  const { selectedLayout } = useLayoutStore();

  const framesByArtist = getFramesByArtist();
  const artists = getFrameArtists();
  const [selectedArtist, setSelectedArtist] = useState(artists[0]?.id || 'builtin');

  // Get current artist info
  const currentArtist = getArtistById(selectedArtist);
  const currentFrames = framesByArtist[selectedArtist] || [];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {COPY.editor.frames.title}
      </h3>

      {/* Artist Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {artists.map((artist) => (
          <button
            key={artist.id}
            onClick={() => setSelectedArtist(artist.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
              transition-all duration-200
              ${selectedArtist === artist.id
                ? 'bg-ios-blue text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-ios-gray-50 ring-1 ring-gray-200'
              }
            `}
          >
            <span className="font-medium">{artist.name}</span>
            {artist.instagram && (
              <span className="text-xs opacity-75">{artist.instagram}</span>
            )}
          </button>
        ))}
      </div>

      {/* Artist Info */}
      {currentArtist && currentArtist.instagram && (
        <div className="mb-4 p-3 bg-ios-gray-50 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{currentArtist.name}</p>
            <p className="text-xs text-gray-600">{currentArtist.bio}</p>
          </div>
          {currentArtist.instagram && (
            <a
              href={`https://instagram.com/${currentArtist.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-ios-blue hover:underline"
            >
              <Instagram size={14} />
              {currentArtist.instagram}
            </a>
          )}
        </div>
      )}

      {/* Frames Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {currentFrames.map((frame) => (
          <FrameItem
            key={frame.id}
            frame={frame}
            isSelected={selectedFrame === frame.id}
            layoutId={selectedLayout?.id}
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
const FrameItem = ({ frame, isSelected, layoutId, onSelect }) => {
  // Get frame preview image path for current layout
  const frameImagePath = layoutId ? getFrameImagePath(frame.id, layoutId) : null;

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
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {frameImagePath ? (
            <img
              src={frameImagePath}
              alt={frame.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-gray-600 text-sm">No Frame</span>
            </div>
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
