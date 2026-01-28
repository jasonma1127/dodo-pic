/**
 * EditorCanvas Component
 * Main canvas for displaying photos with filters and frames
 *
 * Features:
 * - Displays photo grid matching selected layout
 * - Applies current filter to all photos
 * - Shows live frame preview with actual frame images
 */

import { useState, useEffect } from 'react';
import { usePhotoStore, useLayoutStore, useEditorStore } from '@/store';
import { compositeImage } from '@/features/export/utils/imageComposite';

const EditorCanvas = () => {
  const { photos } = usePhotoStore();
  const { selectedLayout } = useLayoutStore();
  const { currentFilter, selectedFrame } = useEditorStore();
  const [previewImage, setPreviewImage] = useState(null);
  const [isComposing, setIsComposing] = useState(false);

  // Compose preview whenever filter or frame changes
  useEffect(() => {
    let isMounted = true;

    const composePreview = async () => {
      if (!selectedLayout || !photos || photos.length === 0) {
        return;
      }

      try {
        setIsComposing(true);

        const dataUrl = await compositeImage({
          photos,
          layout: selectedLayout,
          filterId: currentFilter,
          frameId: selectedFrame,
          quality: 0.7, // Lower quality for faster preview
        });

        if (isMounted) {
          setPreviewImage(dataUrl);
        }
      } catch (error) {
        console.error('Preview composition failed:', error);
      } finally {
        if (isMounted) {
          setIsComposing(false);
        }
      }
    };

    composePreview();

    return () => {
      isMounted = false;
    };
  }, [photos, selectedLayout, currentFilter, selectedFrame]);

  if (!selectedLayout || photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-ios-gray-100 rounded-2xl">
        <p className="text-gray-500">No photos to edit</p>
      </div>
    );
  }

  // Calculate aspect ratio for the canvas container (4:3 landscape)
  const canvasAspectRatio = `${selectedLayout.cols * 4} / ${selectedLayout.rows * 3}`;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="h-full"
        style={{ aspectRatio: canvasAspectRatio }}
      >
        {/* Main Canvas */}
        <div className="relative w-full h-full">
          {isComposing && !previewImage ? (
            <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl shadow-macos">
              <p className="text-gray-500">Loading preview...</p>
            </div>
          ) : previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl shadow-macos">
              <p className="text-gray-500">No preview available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
