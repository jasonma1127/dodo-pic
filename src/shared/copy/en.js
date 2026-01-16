/**
 * English Copy (UI Text)
 * Centralized location for all user-facing text in the application
 *
 * Usage in components:
 * import { COPY } from '@/shared/copy/en';
 * <button>{COPY.camera.startCamera}</button>
 */

export const COPY = {
  // Global
  global: {
    appName: "DodoPic",
    tagline: "Photo Booth in Your Browser",
    loading: "Loading...",
    error: "Oops! Something went wrong.",
    tryAgain: "Try Again",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
  },

  // Layout Selection (Step 1)
  layout: {
    welcome: "Welcome to DodoPic",
    title: "Choose Your Layout",
    subtitle: "Select a photo layout to get started",
    layouts: {
      '2x2': "Classic 2x2",
      '1x4': "Vertical Strip",
      '3x3': "Grid 3x3",
    },
    description: {
      '2x2': "Classic photo booth style",
      '1x4': "Vertical strip layout",
      '3x3': "Nine photos in a grid",
    },
  },

  // Camera & Capture (Step 2)
  camera: {
    title: "Capture Your Photos",
    subtitle: (current, total) => `Photo ${current} of ${total}`,
    startCamera: "Start Camera",
    stopCamera: "Stop Camera",
    capture: "Capture",
    retake: "Retake",
    retaking: "Retaking Photo",
    countdown: {
      ready: "Get Ready!",
      smile: "Smile!",
    },
    photoCounter: (current, total) => `${current}/${total}`,
    progress: {
      remaining: (count) => `${count} ${count === 1 ? 'photo' : 'photos'} remaining`,
      complete: "All photos captured!",
      next: "Proceeding to editor...",
    },
    permissions: {
      denied: "Camera access denied",
      deniedHelp: "Please enable camera permissions in your browser settings to use DodoPic",
      error: "Unable to access camera",
      errorHelp: "Please check your camera connection and try again",
      requesting: "Requesting camera access...",
    },
    hints: {
      position: "Position yourself in the frame",
      countdown: "Photo will be taken automatically",
      retakeHint: "Not happy with a photo? Click 'Retake' to replace it",
    },
  },

  // Editor (Step 3)
  editor: {
    title: "Edit Your Photos",
    subtitle: "Apply filters and frames",
    tabs: {
      filters: "Filters",
      frames: "Frames",
    },
    filters: {
      title: "Choose a Filter",
      noFilter: "Original",
      apply: "Apply",
      applied: "Applied",
    },
    frames: {
      title: "Select a Frame",
      noFrame: "No Frame",
      preview: "Preview",
    },
    actions: {
      delete: "Delete",
      reset: "Reset All",
      confirmReset: "Are you sure you want to reset all edits?",
      undo: "Undo",
      redo: "Redo",
    },
    hints: {
      filterHint: "Filters are applied to all photos",
      frameHint: "Frames wrap around the entire layout",
    },
  },

  // Export & Share (Step 4)
  export: {
    title: "Your DodoPic is Ready!",
    subtitle: "Download or share your creation",
    composing: "Creating your masterpiece...",
    download: "Download",
    share: "Share",
    copy: "Copy to Clipboard",
    copied: "Copied!",
    restart: "Start Over",
    fileSize: "File Size",
    error: "Failed to create image",
    restartConfirm: {
      title: "Start Over?",
      message: "This will clear all your photos and edits. Are you sure?",
      confirm: "Yes, Start Over",
      cancel: "Cancel",
    },
    preview: {
      title: "Preview",
      loading: "Creating your masterpiece...",
      rendering: "Rendering final image...",
      ready: "Ready to download!",
    },
    actions: {
      download: "Download",
      share: "Share",
      startOver: "Start Over",
      downloading: "Downloading...",
      sharing: "Sharing...",
    },
    messages: {
      downloadSuccess: "Downloaded successfully!",
      downloadError: "Download failed. Please try again.",
      shareSuccess: "Shared successfully!",
      shareCopied: "Image copied to clipboard!",
      shareFallback: "Share not available. Image downloaded instead.",
      shareError: "Share failed. Please try again.",
    },
    fileInfo: {
      format: "PNG",
      quality: "High Quality",
      size: (width, height) => `${width}×${height}px`,
    },
  },

  // Workflow Navigation
  workflow: {
    steps: {
      layout: "Layout",
      camera: "Capture",
      editor: "Edit",
      export: "Export",
    },
    stepDescriptions: {
      layout: "Choose your photo layout",
      camera: "Take your photos",
      editor: "Add filters and decorations",
      export: "Download or share",
    },
    navigation: {
      next: "Next",
      previous: "Previous",
      skip: "Skip",
      finish: "Finish",
      backToLayout: "Back to Layout",
      backToCamera: "Back to Camera",
      backToEditor: "Back to Editor",
    },
    validation: {
      layoutRequired: "Please select a layout first",
      photosIncomplete: (remaining) =>
        `Capture ${remaining} more ${remaining === 1 ? 'photo' : 'photos'}`,
      cameraNotReady: "Camera is not ready",
      noPhotos: "No photos captured yet",
    },
    progress: {
      step: (current, total) => `Step ${current} of ${total}`,
      completion: (percent) => `${percent}% complete`,
    },
  },

  // Filters
  filters: {
    none: {
      name: "Original",
      description: "No filter applied",
    },
    bw: {
      name: "Black & White",
      description: "Classic monochrome look",
    },
    vintage: {
      name: "Vintage",
      description: "Retro film aesthetic",
    },
    vivid: {
      name: "Vivid",
      description: "Enhanced colors and contrast",
    },
    cool: {
      name: "Cool Tone",
      description: "Blue-ish tint for a calm vibe",
    },
    warm: {
      name: "Warm Tone",
      description: "Golden hour feeling",
    },
  },

  // Frames
  frames: {
    none: {
      name: "No Frame",
      description: "Clean look without borders",
    },
    rounded: {
      name: "Rounded Corners",
      description: "Soft, modern corners",
    },
    film: {
      name: "Film Strip",
      description: "Classic photo booth style",
    },
    torn: {
      name: "Torn Edges",
      description: "Artistic rough edges",
    },
    polaroid: {
      name: "Polaroid",
      description: "Instant camera look",
    },
  },

  // Error Messages
  errors: {
    generic: "Something went wrong. Please try again.",
    network: "Network error. Please check your connection.",
    camera: {
      notFound: "No camera found",
      permission: "Camera permission denied",
      inUse: "Camera is already in use",
      notSupported: "Camera not supported in this browser",
    },
    export: {
      failed: "Failed to export image",
      tooLarge: "Image is too large to export",
      formatNotSupported: "Export format not supported",
    },
    layout: {
      notSelected: "Please select a layout",
      invalid: "Invalid layout selected",
    },
  },

  // Accessibility Labels (for screen readers)
  a11y: {
    closeButton: "Close",
    menuButton: "Menu",
    settingsButton: "Settings",
    deleteButton: "Delete",
    editButton: "Edit",
    layoutOption: (name) => `Select ${name} layout`,
    filterOption: (name) => `Apply ${name} filter`,
    frameOption: (name) => `Apply ${name} frame`,
    photoThumbnail: (index, total) => `Photo ${index} of ${total}`,
    retakePhoto: (index) => `Retake photo ${index}`,
  },

  // Loading States
  loading: {
    app: "Loading DodoPic...",
    camera: "Initializing camera...",
    photos: "Loading photos...",
    exporting: "Preparing your image...",
    sharing: "Preparing to share...",
  },

  // Success Messages
  success: {
    photosCaptured: "All photos captured!",
    filterApplied: "Filter applied successfully",
    frameApplied: "Frame applied",
    exported: "Image ready for download!",
  },
};

/**
 * Helper function to get nested copy safely
 * @param {string} path - Dot notation path (e.g., 'camera.startCamera')
 * @param {Object} defaultValue - Default value if path not found
 * @returns {*} - The copy value or default
 */
export const getCopy = (path, defaultValue = '') => {
  return path.split('.').reduce((obj, key) => obj?.[key], COPY) ?? defaultValue;
};

/**
 * Export individual sections for convenience
 */
export const {
  global,
  layout,
  camera,
  editor,
  export: exportCopy,
  workflow,
  filters,
  frames,
  errors,
  a11y,
  loading,
  success,
} = COPY;
