/**
 * PhotoGrid Component
 * Displays captured photos in a grid matching the selected layout
 * Allows retaking individual photos
 */

import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useLayoutStore, usePhotoStore } from '@/store';
import { Button } from '@/shared/components';
import { COPY } from '@/shared/copy/en';

const PhotoGrid = ({ onRetake }) => {
  const { selectedLayout } = useLayoutStore();
  const { photos, maxPhotos } = usePhotoStore();

  if (!selectedLayout) return null;

  // Create placeholders for all photo slots
  const slots = Array.from({ length: maxPhotos }, (_, index) => ({
    index,
    photo: photos[index] || null,
  }));

  // Calculate grid aspect ratio based on layout and cell aspect ratio (4:3 landscape)
  const gridAspectRatio = `${selectedLayout.cols * 4} / ${selectedLayout.rows * 3}`;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="grid gap-2 h-full"
        style={{
          gridTemplateRows: `repeat(${selectedLayout.rows}, 1fr)`,
          gridTemplateColumns: `repeat(${selectedLayout.cols}, 1fr)`,
          aspectRatio: gridAspectRatio,
        }}
      >
        {slots.map(({ index, photo }) => (
          <motion.div
            key={index}
            className="relative bg-ios-gray-100 rounded-lg overflow-hidden group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {photo ? (
              <>
                {/* Photo */}
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Photo Number Badge */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                  {index + 1}/{maxPhotos}
                </div>

                {/* Retake Button (on hover) */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onRetake(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {COPY.camera.retake}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Empty Slot */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-4xl text-ios-gray-300 mb-2">
                      {index + 1}
                    </div>
                    <div className="text-xs text-gray-500">
                      {photos.length === index ? 'Next' : 'Waiting'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
