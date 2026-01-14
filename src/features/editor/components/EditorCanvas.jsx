/**
 * EditorCanvas Component
 * Main canvas for displaying photos with filters, stickers, and frames
 *
 * Features:
 * - Displays photo grid matching selected layout
 * - Applies current filter to all photos
 * - Renders stickers with drag/scale/rotate support
 * - Shows frame around entire composition
 * - Click sticker to select, drag to move, handles to resize/rotate
 */

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RotateCw, Maximize2 } from 'lucide-react';
import { usePhotoStore, useLayoutStore, useEditorStore } from '@/store';
import { getFilterCSS } from '../constants/filters';
import { getFrameStyle } from '../constants/frames';

const EditorCanvas = () => {
  const canvasRef = useRef(null);
  const { photos } = usePhotoStore();
  const { selectedLayout } = useLayoutStore();
  const { currentFilter, appliedStickers, selectedStickerId, selectedFrame } = useEditorStore();

  if (!selectedLayout || photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-ios-gray-100 rounded-2xl">
        <p className="text-gray-500">No photos to edit</p>
      </div>
    );
  }

  const filterCSS = getFilterCSS(currentFilter);
  const frameStyle = getFrameStyle(selectedFrame);

  // Calculate grid layout
  const gridStyle = {
    display: 'grid',
    gridTemplateRows: `repeat(${selectedLayout.rows}, 1fr)`,
    gridTemplateColumns: `repeat(${selectedLayout.cols}, 1fr)`,
    gap: '8px',
    ...frameStyle,
  };

  // Calculate aspect ratio for the canvas container (same as PhotoGrid)
  const canvasAspectRatio = `${selectedLayout.cols * 3} / ${selectedLayout.rows * 4}`;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="h-full"
        style={{ aspectRatio: canvasAspectRatio }}
      >
        {/* Main Canvas */}
        <div
          ref={canvasRef}
          className="relative w-full h-full bg-white rounded-2xl shadow-macos overflow-hidden"
        >
        {/* Photo Grid */}
        <div style={gridStyle} className="w-full h-full p-2">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ filter: filterCSS }}
              />
            </div>
          ))}
        </div>

        {/* Stickers Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {appliedStickers.map((sticker) => (
            <Sticker
              key={sticker.id}
              sticker={sticker}
              isSelected={selectedStickerId === sticker.id}
              canvasRef={canvasRef}
            />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

/**
 * Sticker Component
 * Individual draggable/scalable/rotatable sticker
 */
const Sticker = ({ sticker, isSelected, canvasRef }) => {
  const { updateSticker, removeSticker, selectSticker } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    selectSticker(sticker.id);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    updateSticker(sticker.id, { x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleRotate = () => {
    updateSticker(sticker.id, { rotation: (sticker.rotation + 45) % 360 });
  };

  const handleScale = (delta) => {
    const newScale = Math.max(0.5, Math.min(3, sticker.scale + delta));
    updateSticker(sticker.id, { scale: newScale });
  };

  const handleDelete = () => {
    removeSticker(sticker.id);
  };

  return (
    <>
      <motion.div
        className={`
          absolute pointer-events-auto cursor-move select-none
          ${isSelected ? 'z-20' : 'z-10'}
        `}
        style={{
          left: `${sticker.x}%`,
          top: `${sticker.y}%`,
          transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
          fontSize: '3rem',
        }}
        onMouseDown={handleMouseDown}
        whileTap={{ scale: sticker.scale * 1.1 }}
      >
        {sticker.emoji}

        {/* Selection Ring */}
        {isSelected && (
          <div className="absolute inset-0 -m-4 border-2 border-ios-blue rounded-lg pointer-events-none" />
        )}
      </motion.div>

      {/* Sticker Controls */}
      {isSelected && (
        <div
          className="absolute pointer-events-auto flex gap-2"
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y - 8}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <button
            onClick={handleRotate}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-ios-gray-100 transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => handleScale(0.2)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-ios-gray-100 transition-colors"
            title="Scale up"
          >
            <Maximize2 className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => handleScale(-0.2)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-ios-gray-100 transition-colors"
            title="Scale down"
          >
            <span className="text-sm font-bold text-gray-700">-</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </>
  );
};

export default EditorCanvas;
