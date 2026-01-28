/**
 * Image Composite Utilities
 * Functions for compositing photos, filters, and frames into final image
 */

import { getFilterCSS } from '@/features/editor/constants/filters';
import { getFrameImagePath } from '@/features/editor/constants/frames';

// Standard photo booth dimensions (like real photo booth machines)
// Using 4:3 aspect ratio (landscape)
const STANDARD_CELL_WIDTH = 1920;  // Each photo cell width (4:3 landscape)
const STANDARD_CELL_HEIGHT = 1440; // Each photo cell height (4:3 landscape)
const CELL_GAP = 16;                // Gap between photos
const CANVAS_PADDING = 32;          // Padding around the entire grid
const DECORATION_TOP = 300;         // Top decoration area for logo/branding
const DECORATION_BOTTOM = 300;      // Bottom decoration area for logo/branding

/**
 * Calculate standard canvas dimensions for a layout
 * This ensures frame images can be designed with fixed dimensions
 *
 * Layout output sizes (with decoration areas, based on 1920x1440 cells):
 * - 2x2: 3904 x 3520 pixels (2920 photo area + 600 decoration)
 * - 4x1: 7728 x 2104 pixels (1504 photo area + 600 decoration)
 * - 1x4: 1984 x 6368 pixels (5768 photo area + 600 decoration)
 * - 3x3: 5840 x 4960 pixels (4360 photo area + 600 decoration)
 * - 2x3: 3904 x 4960 pixels (4360 photo area + 600 decoration)
 */
const getCanvasDimensions = (layout) => {
  const width = layout.cols * STANDARD_CELL_WIDTH + (layout.cols - 1) * CELL_GAP + CANVAS_PADDING * 2;
  const height = layout.rows * STANDARD_CELL_HEIGHT + (layout.rows - 1) * CELL_GAP + CANVAS_PADDING * 2 + DECORATION_TOP + DECORATION_BOTTOM;
  return { width, height };
};

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
      // Use standard fixed dimensions (like real photo booth machines)
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(layout);

      // Create canvas with fixed dimensions
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load and draw all photos (resized to standard dimensions)
      const photoPromises = photos.map((photoUrl, index) => {
        return new Promise((resolvePhoto) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            const row = Math.floor(index / layout.cols);
            const col = index % layout.cols;

            // Calculate position using standard dimensions
            // Add DECORATION_TOP offset to Y position for top decoration area
            const x = CANVAS_PADDING + col * (STANDARD_CELL_WIDTH + CELL_GAP);
            const y = DECORATION_TOP + CANVAS_PADDING + row * (STANDARD_CELL_HEIGHT + CELL_GAP);

            // Save context
            ctx.save();

            // Apply filter
            const filterCSS = getFilterCSS(filterId);
            if (filterCSS !== 'none') {
              ctx.filter = filterCSS;
            }

            // Calculate scaling to cover the cell (like object-fit: cover)
            // This prevents distortion while filling the entire cell
            const imgAspect = img.width / img.height;
            const cellAspect = STANDARD_CELL_WIDTH / STANDARD_CELL_HEIGHT;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgAspect > cellAspect) {
              // Image is wider than cell - fit to height and crop width
              drawHeight = STANDARD_CELL_HEIGHT;
              drawWidth = img.width * (STANDARD_CELL_HEIGHT / img.height);
              offsetX = (STANDARD_CELL_WIDTH - drawWidth) / 2;
              offsetY = 0;
            } else {
              // Image is taller than cell - fit to width and crop height
              drawWidth = STANDARD_CELL_WIDTH;
              drawHeight = img.height * (STANDARD_CELL_WIDTH / img.width);
              offsetX = 0;
              offsetY = (STANDARD_CELL_HEIGHT - drawHeight) / 2;
            }

            // Clip to cell boundaries
            ctx.beginPath();
            ctx.rect(x, y, STANDARD_CELL_WIDTH, STANDARD_CELL_HEIGHT);
            ctx.clip();

            // Draw photo with cover scaling (maintains aspect ratio)
            ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);

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
        // Load and draw frame overlay (if exists)
        const framePath = getFrameImagePath(frameId, layout.id);

        if (framePath) {
          const frameImg = new Image();

          frameImg.onload = () => {
            // Draw frame as overlay on top of photos (frame will be exact canvas size)
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

            // Convert to data URL
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          };

          frameImg.onerror = () => {
            console.error('Failed to load frame image:', framePath);
            // Continue without frame
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          };

          frameImg.src = framePath;
        } else {
          // No frame, convert to data URL directly
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        }
      }).catch((error) => {
        console.error('Error loading photos:', error);
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
