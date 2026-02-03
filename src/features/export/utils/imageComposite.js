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

/**
 * Frame parameters by layout
 * Each layout can have different frame settings
 * IMPORTANT: These must match the frame images generated with frame-generator.html
 */
const FRAME_SETTINGS = {
  '2x2': {
    cellGap: 64,
    sideBorder: 60,
    topBorder: 1000,
    bottomBorder: 120,
  },
  '1x4': {
    cellGap: 64,
    sideBorder: 60,
    topBorder: 120,
    bottomBorder: 1000,
  },
  '3x3': {
    cellGap: 64,
    sideBorder: 60,
    topBorder: 1200,
    bottomBorder: 1200,
  },
}

/**
 * Get canvas dimensions for a specific layout
 * @param {Object} layout - Layout configuration with id, rows, cols
 * @returns {Object} Canvas width and height
 */
const getCanvasDimensions = (layout) => {
  const settings = FRAME_SETTINGS[layout.id];
  if (!settings) {
    throw new Error(`No frame settings found for layout: ${layout.id}`);
  }

  // Calculate photo grid dimensions (without frame borders)
  const gridWidth = layout.cols * STANDARD_CELL_WIDTH + (layout.cols - 1) * settings.cellGap;
  const gridHeight = layout.rows * STANDARD_CELL_HEIGHT + (layout.rows - 1) * settings.cellGap;

  // Canvas size = grid + borders (no extra padding)
  const width = gridWidth + settings.sideBorder * 2;
  const height = gridHeight + settings.topBorder + settings.bottomBorder;

  return { width, height };
};

/**
 * Composite final image from photos, layout, filter, and frame
 * @param {Object} options - Composition options
 * @param {Array<string>} options.photos - Array of photo data URLs
 * @param {Object} options.layout - Layout configuration
 * @param {string} options.filterId - Filter ID
 * @param {string} options.frameId - Frame ID
 * @param {string} options.frameColor - Frame color (for solid-color frame)
 * @param {number} options.quality - Output quality (0-1), default 0.95
 * @returns {Promise<string>} Data URL of composed image
 */
export const compositeImage = async ({
  photos,
  layout,
  filterId = 'none',
  frameId = 'solid-color',
  frameColor = '#FFFFFF',
  quality = 0.95,
}) => {
  return new Promise((resolve, reject) => {
    try {
      // Get frame settings for this layout
      const settings = FRAME_SETTINGS[layout.id];
      if (!settings) {
        reject(new Error(`No frame settings found for layout: ${layout.id}`));
        return;
      }

      // Use standard fixed dimensions (like real photo booth machines)
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(layout);

      // Create canvas with fixed dimensions
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fill background (use frame color for solid-color frame, white for others)
      ctx.fillStyle = frameId === 'solid-color' ? frameColor : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load and draw all photos (resized to standard dimensions)
      const photoPromises = photos.map((photoUrl, index) => {
        return new Promise((resolvePhoto) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            const row = Math.floor(index / layout.cols);
            const col = index % layout.cols;

            // Calculate position using layout-specific settings
            // Start from frame borders (no extra padding)
            const x = settings.sideBorder + col * (STANDARD_CELL_WIDTH + settings.cellGap);
            const y = settings.topBorder + row * (STANDARD_CELL_HEIGHT + settings.cellGap);

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
