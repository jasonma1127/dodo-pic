/**
 * Share Utilities
 * Functions for sharing images using Web Share API
 */

import { dataUrlToBlob } from './download';

/**
 * Check if Web Share API is supported
 * @returns {boolean} True if supported
 */
export const isShareSupported = () => {
  return navigator.share !== undefined && navigator.canShare !== undefined;
};

/**
 * Share image using Web Share API
 * @param {string} dataUrl - Image data URL
 * @param {Object} options - Share options
 * @param {string} options.title - Share title
 * @param {string} options.text - Share text
 * @param {string} options.filename - Image filename
 * @returns {Promise<void>}
 */
export const shareImage = async (dataUrl, options = {}) => {
  const {
    title = 'DodoPic Photo',
    text = 'Check out my DodoPic photo booth pictures!',
    filename = 'dodopic-photo.jpg',
  } = options;

  try {
    // Convert data URL to blob
    const blob = await dataUrlToBlob(dataUrl);

    // Create File object
    const file = new File([blob], filename, { type: 'image/jpeg' });

    // Check if sharing this file is supported
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      throw new Error('File sharing not supported on this device');
    }

    // Share using Web Share API
    await navigator.share({
      files: [file],
      title,
      text,
    });

    return { success: true };
  } catch (error) {
    // User cancelled or error occurred
    if (error.name === 'AbortError') {
      return { success: false, cancelled: true };
    }

    console.error('Share error:', error);
    throw error;
  }
};

/**
 * Copy image to clipboard
 * @param {string} dataUrl - Image data URL
 * @returns {Promise<void>}
 */
export const copyImageToClipboard = async (dataUrl) => {
  try {
    const blob = await dataUrlToBlob(dataUrl);

    // Use Clipboard API
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/jpeg': blob,
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Clipboard error:', error);
    throw error;
  }
};
