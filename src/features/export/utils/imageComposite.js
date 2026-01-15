/**
 * Image Composite Utilities
 * Functions for compositing photos, filters, frames, and stickers into final image
 */

import { getFilterCSS } from '@/features/editor/constants/filters';
import { getFrameStyle } from '@/features/editor/constants/frames';

/**
 * Composite final image from photos, layout, filter, and frame
 * @param {Object} options - Composition options
 * @param {Array<string>} options.photos - Array of photo data URLs
 * @param {Object} options.layout - Layout configuration
 * @param {string} options.filterId - Filter ID
 * @param {string} options.frameId - Frame ID
 * @param {number} options.quality - Output quality (0-1), default 0.95
 * @returns {Promise<string>} Data URL of composed image
 */
export const compositeImage = async ({
  photos,
  layout,
  filterId = 'none',
  frameId = 'none',
  quality = 0.95,
}) => {
  return new Promise((resolve, reject) => {
    try {
      // First, load the first photo to get actual dimensions
      const firstImg = new Image();
      firstImg.crossOrigin = 'anonymous';

      firstImg.onload = () => {
        // Use actual photo dimensions (no resize!)
        const cellWidth = firstImg.width;
        const cellHeight = firstImg.height;
        const gap = 16; // gap between photos
        const padding = 32; // padding around grid

        console.log('Photo dimensions:', cellWidth, 'x', cellHeight);

        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = layout.cols * cellWidth + (layout.cols - 1) * gap + padding * 2;
        canvas.height = layout.rows * cellHeight + (layout.rows - 1) * gap + padding * 2;

        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

        // Fill background (white)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply frame background if needed
        const frameStyle = getFrameStyle(frameId);
        if (frameStyle.border) {
          // Parse border width from style
          const borderWidth = parseInt(frameStyle.border) || 0;
          ctx.fillStyle = frameStyle.border.includes('white') ? '#ffffff' : '#1a1a1a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Load and draw all photos
        const photoPromises = photos.map((photoUrl, index) => {
          return new Promise((resolvePhoto) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
              const row = Math.floor(index / layout.cols);
              const col = index % layout.cols;
              const x = padding + col * (cellWidth + gap);
              const y = padding + row * (cellHeight + gap);

              // Save context
              ctx.save();

              // Apply filter
              const filterCSS = getFilterCSS(filterId);
              if (filterCSS !== 'none') {
                ctx.filter = filterCSS;
              }

              // Draw photo at its original size (no resize!)
              ctx.drawImage(img, x, y, cellWidth, cellHeight);

              // Restore context
              ctx.restore();

              resolvePhoto();
            };

            img.onerror = () => {
              console.error('Failed to load photo:', index);
              resolvePhoto(); // Continue even if one photo fails
            };

            img.src = photoUrl;
          });
        });

        // Wait for all photos to load and draw
        Promise.all(photoPromises).then(() => {
          console.log('All photos loaded');
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        }).catch((error) => {
          console.error('Error loading photos:', error);
          reject(error);
        });
      };

      firstImg.onerror = () => {
        reject(new Error('Failed to load first photo'));
      };

      firstImg.src = photos[0];
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Create a preview thumbnail of the composite image
 * @param {string} dataUrl - Original data URL
 * @param {number} maxWidth - Maximum width
 * @returns {Promise<string>} Thumbnail data URL
 */
export const createThumbnail = (dataUrl, maxWidth = 400) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};
