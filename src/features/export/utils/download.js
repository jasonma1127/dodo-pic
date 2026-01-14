/**
 * Download Utilities
 * Functions for downloading images to user's device
 */

/**
 * Download image from data URL
 * @param {string} dataUrl - Image data URL
 * @param {string} filename - Filename for download (default: dodopic-{timestamp}.jpg)
 */
export const downloadImage = (dataUrl, filename = null) => {
  // Generate filename with timestamp if not provided
  if (!filename) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    filename = `dodopic-${timestamp}.jpg`;
  }

  // Create temporary link element
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Convert data URL to Blob
 * @param {string} dataUrl - Image data URL
 * @returns {Promise<Blob>} Image blob
 */
export const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

/**
 * Get file size from data URL
 * @param {string} dataUrl - Image data URL
 * @returns {string} Human-readable file size
 */
export const getFileSize = (dataUrl) => {
  // Remove data URL prefix
  const base64 = dataUrl.split(',')[1];
  const bytes = atob(base64).length;

  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${size} ${sizes[i]}`;
};
