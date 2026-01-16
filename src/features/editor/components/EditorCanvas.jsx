/**
 * EditorCanvas Component
 * Main canvas for displaying photos with filters and frames
 *
 * Features:
 * - Displays photo grid matching selected layout
 * - Applies current filter to all photos
 * - Shows frame preview around entire composition
 */

import { usePhotoStore, useLayoutStore, useEditorStore } from '@/store';
import { getFilterCSS } from '../constants/filters';
import { getFrameStyle } from '../constants/frames';

const EditorCanvas = () => {
  const { photos } = usePhotoStore();
  const { selectedLayout } = useLayoutStore();
  const { currentFilter, selectedFrame } = useEditorStore();

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
        <div className="relative w-full h-full bg-white rounded-2xl shadow-macos overflow-hidden">
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
      </div>
    </div>
    </div>
  );
};

export default EditorCanvas;
