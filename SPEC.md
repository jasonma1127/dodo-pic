# DodoPic - Software Design Specification

**Version:** 2.3.0
**Last Updated:** 2026-02-04
**Status:** In Development

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack & Rationale](#3-technology-stack--rationale)
4. [Data Models & State Management](#4-data-models--state-management)
5. [Feature Specifications](#5-feature-specifications)
6. [API Specifications](#6-api-specifications)
7. [UI/UX Specifications](#7-uiux-specifications)
8. [File & Folder Structure](#8-file--folder-structure)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment & Build Configuration](#10-deployment--build-configuration)

---

## 1. Project Overview

### 1.1 Product Vision
DodoPic is a modern, web-based photo booth application that brings the joy of instant photo frames to the browser. Users can capture multiple photos, apply creative filters and frames, and instantly download or share their creations—all without requiring any backend infrastructure.

### 1.2 Target Users
- **Primary**: Social media users aged 18-35 who enjoy creating and sharing visual content
- **Secondary**: Event organizers, party hosts, and anyone looking for fun photo experiences
- **Tertiary**: Content creators seeking quick photo collage tools

### 1.3 Key Features
- **3 Layout Options**: Classic 2x2, vertical strip (1x4), and 3x3 grid
- **Complete Workflow**: Layout selection → Photo capture → Editing → Export/Share
- **Photo Editing**:
  - 6+ filter presets (B&W, Vintage, Vivid, Cool/Warm tones)
  - PNG frame overlays (layout-specific, high-resolution image overlays)
- **Retake Functionality**: Replace individual photos without restarting
- **Export Options**: Download high-resolution JPEG or share via Web Share API
- **Modern UI**: macOS/iOS-inspired design with smooth animations
- **Fixed Dimensions**: All photos use consistent 1920×1440 resolution (4:3 landscape aspect ratio)

### 1.4 Success Metrics
- **Performance**: Load time < 3s, capture-to-preview < 1s
- **Quality**: Final image export at high resolution (e.g., 2x2: 4168×4120px)
- **Compatibility**: Works on latest Chrome, Safari, Firefox (desktop + mobile)
- **User Experience**: Complete workflow in < 2 minutes

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React SPA                             │
│                                                              │
│  ┌────────────┐   ┌──────────────┐   ┌─────────────┐      │
│  │  Layout    │──▶│   Camera     │──▶│   Editor    │──┐   │
│  │ Selection  │   │  & Capture   │   │  (Filters,  │  │   │
│  └────────────┘   └──────────────┘   │   Frames)   │  │   │
│                                       │             │  │   │
│                                       └─────────────┘  │   │
│                                              │         │   │
│                                              ▼         │   │
│                                       ┌─────────────┐  │   │
│                                       │   Export    │◀─┘   │
│                                       │  & Share    │      │
│                                       └─────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Zustand State Management                     │  │
│  │  - photoStore    - editorStore                        │  │
│  │  - layoutStore   - workflowStore                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Browser APIs                                  │  │
│  │  - WebRTC (getUserMedia)  - Canvas API                │  │
│  │  - Web Share API          - Blob/File API             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Relationships

```
App.jsx
├── WorkflowStepper
│   └── Step indicators (Layout → Camera → Editor → Export)
│
├── LayoutSelector (Step 1)
│   ├── LayoutPreview × 3
│   └── [Triggers: layoutStore.selectLayout()]
│
├── CameraView (Step 2)
│   ├── Webcam (react-webcam)
│   ├── Countdown
│   ├── CaptureButton
│   ├── PhotoGrid
│   │   └── Photo × N (with retake button)
│   └── [Triggers: photoStore.addPhoto(), replacePhoto()]
│
├── EditorCanvas (Step 3)
│   ├── Canvas preview
│   ├── FilterPanel
│   │   └── FilterOption × 6
│   └── FramePanel
│       └── FrameOption (with layout-specific PNG overlays)
│   └── [Triggers: editorStore.setFilter(), setFrame()]
│
├── ExportPreview (Step 4)
│   ├── Final composite preview
│   ├── DownloadButton
│   ├── SharePanel
│   └── RestartButton
│
└── NavigationBar
    ├── PrevButton
    └── NextButton
```

### 2.3 Data Flow

```
User Action → Component → Zustand Store → Re-render

Example: Photo Capture Flow
1. User clicks "Capture" → CaptureButton.onClick()
2. useCamera hook calls webcamRef.current.getScreenshot()
3. photoStore.addPhoto(imageSrc)
4. Zustand updates state → PhotoGrid re-renders
5. If photos.length === maxPhotos → workflowStore.nextStep()
```

### 2.4 Browser Compatibility Matrix

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| WebRTC (Camera) | ✅ 53+ | ✅ 11+ | ✅ 36+ | ✅ 79+ |
| Canvas API | ✅ All | ✅ All | ✅ All | ✅ All |
| Web Share API | ✅ 61+ | ✅ 12.2+ | ❌ | ✅ 79+ |
| Backdrop Filter | ✅ 76+ | ✅ 9+ (-webkit) | ❌ 103+ | ✅ 79+ |
| ES6 Modules | ✅ 61+ | ✅ 11+ | ✅ 60+ | ✅ 79+ |

**Note**: Web Share API has fallback behavior (copy to clipboard or show link)

---

## 3. Technology Stack & Rationale

### 3.1 Core Technologies

| Technology | Version | Rationale |
|------------|---------|-----------|
| **React** | 19.0.0 | Latest stable, improved performance, excellent ecosystem |
| **Vite** | 6.2.0 | Fast HMR, optimized builds, superior DX vs CRA |
| **Zustand** | 5.0.0 | Lightweight (2KB), simple API, no boilerplate vs Redux |
| **Tailwind CSS** | 3.4.0 | Rapid UI development, consistent design system, smaller bundle vs CSS-in-JS |
| **react-webcam** | 7.2.0 | Reliable WebRTC wrapper, active maintenance |
| **Framer Motion** | 11.0.0 | Declarative animations, spring physics for macOS feel |
| **lucide-react** | 0.400.0 | Modern icon library, tree-shakeable, consistent style |

### 3.2 Why Zustand over Redux?

**Redux Toolkit Cons for this project**:
- ~40KB bundle size (vs 2KB for Zustand)
- Requires boilerplate (slices, reducers, actions)
- Overkill for 4 simple stores
- Steeper learning curve

**Zustand Advantages**:
- Minimal API: `create((set) => ({ ... }))`
- No Provider wrapper needed
- Built-in DevTools support
- Perfect for small-to-medium state needs

**Context API Cons**:
- Manual optimization (useMemo, useCallback) required
- Performance issues with frequent updates
- No DevTools

### 3.3 Why Tailwind over SCSS?

**SCSS Cons**:
- Requires build configuration
- Harder to maintain consistency
- Larger bundle (all styles shipped)
- Slower iteration

**Tailwind Advantages**:
- Utility-first = faster development
- PurgeCSS removes unused styles
- Built-in design system (spacing, colors)
- Better for rapid prototyping

### 3.4 Development Dependencies

```json
{
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.21.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 4. Data Models & State Management

### 4.1 Zustand Store Schemas

#### 4.1.1 photoStore

```javascript
/**
 * Manages photo capture state and operations
 */
{
  // State
  photos: [],              // Array<string> - Data URLs of captured photos
  currentPhotoIndex: 0,    // number - Currently selected photo for editing
  maxPhotos: 4,            // number - Total photos based on layout

  // Actions
  addPhoto: (photoDataUrl) => void,
  removePhoto: (index) => void,
  replacePhoto: (index, photoDataUrl) => void,  // For retake functionality
  clearPhotos: () => void,
  setCurrentPhotoIndex: (index) => void,
  setMaxPhotos: (count) => void,
}
```

**Usage Example**:
```javascript
import { usePhotoStore } from '@/store/photoStore';

const CameraView = () => {
  const { photos, addPhoto, maxPhotos } = usePhotoStore();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    addPhoto(imageSrc);
  };
};
```

#### 4.1.2 layoutStore

```javascript
/**
 * Manages selected photo layout configuration
 */
{
  // State
  selectedLayout: null,    // Layout | null

  // Actions
  selectLayout: (layout) => void,
  clearLayout: () => void,
}

/**
 * Layout Type Definition
 */
type Layout = {
  id: string,           // '2x2', '1x4', '3x3'
  name: string,         // 'Classic 2x2', 'Vertical Strip', 'Grid 3x3'
  rows: number,         // Grid rows
  cols: number,         // Grid columns
  total: number,        // rows × cols
  previewImage: string, // Path to preview image
}
```

#### 4.1.3 editorStore

```javascript
/**
 * Manages photo editing state (filters, frames)
 */
{
  // State
  currentFilter: 'none',           // FilterId
  selectedFrame: 'solid-color',    // FrameId (default: solid-color)
  frameColor: '#FFFFFF',           // Hex color for solid-color frame

  // Actions
  setFilter: (filterId) => void,
  setFrame: (frameId) => void,
  setFrameColor: (color) => void,  // Set custom frame color
  resetEditor: () => void,
}

/**
 * Artist Type Definition
 */
type Artist = {
  id: string,                      // 'builtin', 'dodo-lin', etc.
  name: string,                    // Display name
  instagram: string | null,        // Instagram handle (e.g., '@july1st_2014')
  bio: string,                     // Short description
}

/**
 * Frame Type Definition
 */
type Frame = {
  id: string,                      // 'solid-color', 'polaroid', etc.
  name: string,                    // Display name
  artistId: string,                // Reference to artist (e.g., 'builtin', 'dodo-lin')
  preview: string,                 // Preview description
  customizable?: boolean,          // True if frame has customizable options (e.g., color)
}

/**
 * Frame Image Requirements:
 * - PNG format with transparency
 * - Transparent center area where photos show through
 * - Fixed dimensions matching layout output size
 * - Each photo cell is 1920×1440px (4:3 landscape) with layout-specific gaps and borders
 * - Generated using tools/frame-generator.html with matching FRAME_SETTINGS
 * - Frames stored in /public/frames/{artistId}/{layoutId}/{frameId}.png
 * - Special case: solid-color frame has no image files (uses frameColor instead)
 */
```

#### 4.1.4 workflowStore

```javascript
/**
 * Manages multi-step workflow progression
 */
{
  // State
  currentStep: 'layout',   // 'layout' | 'camera' | 'editor' | 'export'
  steps: ['layout', 'camera', 'editor', 'export'],
  canGoNext: true,         // boolean - Validation for next step
  canGoPrev: false,        // boolean - Can go back

  // Actions
  nextStep: () => void,
  prevStep: () => void,
  goToStep: (step) => void,
  setCanGoNext: (canGo) => void,
  resetWorkflow: () => void,
}
```

### 4.2 State Persistence (Optional)

Using Zustand's persist middleware for recovery after page refresh:

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePhotoStore = create(
  persist(
    (set) => ({
      photos: [],
      // ... rest of state
    }),
    {
      name: 'dodopic-photos',  // localStorage key
      partialize: (state) => ({ photos: state.photos }), // Only persist photos
    }
  )
);
```

---

## 5. Feature Specifications

### 5.1 Layout Selection

#### User Stories
- **US-001**: As a user, I want to choose a photo layout before capturing so I know how many photos to take
- **US-002**: As a user, I want to preview what each layout looks like so I can pick the best one
- **US-003**: As a user, I want to see clear labels for each layout option

#### Acceptance Criteria
- [x] Displays 3 layout options in a responsive grid
- [x] Each option shows a preview image
- [x] Selected layout is visually highlighted
- [x] Clicking a layout automatically proceeds to camera step
- [x] Layout selection updates photoStore.maxPhotos

#### Supported Layouts

| Layout ID | Name | Grid | Photos | Dimensions (px) |
|-----------|------|------|--------|-----------------|
| 2x2 | Classic 2x2 | 2 rows × 2 cols | 4 | 4168 × 4120 |
| 1x4 | Vertical Strip | 4 rows × 1 col | 4 | 2040 × 7480 |
| 3x3 | Grid 3x3 | 3 rows × 3 cols | 9 | 6088 × 6880 |

#### Wireframe

```
┌────────────────────────────────────────┐
│     Choose Your Layout                  │
│     Select a photo layout to begin     │
│                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐           │
│  │ 2x2 │  │ 1x4 │  │ 3x3 │           │
│  │ ■ ■ │  │ ■   │  │■■■  │           │
│  │ ■ ■ │  │ ■   │  │■■■  │           │
│  └─────┘  │ ■   │  │■■■  │           │
│  Classic  │ ■   │  └─────┘           │
│   2x2     └─────┘  Grid 3x3          │
│           Vertical                    │
│            Strip                      │
└────────────────────────────────────────┘
```

#### Copy (UI Text)

```javascript
COPY.layout = {
  title: "Choose Your Layout",
  subtitle: "Select a photo layout to get started",
  layouts: {
    '2x2': "Classic 2x2",
    '1x4': "Vertical Strip",
    '3x3': "Grid 3x3",
  }
}
```

---

### 5.2 Photo Capture

#### User Stories
- **US-004**: As a user, I want to start my camera to take photos
- **US-005**: As a user, I want a countdown before each photo is taken
- **US-006**: As a user, I want to see thumbnails of photos I've already taken
- **US-007**: As a user, I want to retake individual photos if I'm not happy with them
- **US-008**: As a user, I want to automatically proceed to editing when all photos are captured

#### Acceptance Criteria
- [x] Camera starts only after user clicks "Start Camera"
- [x] 3-second countdown displays before each capture
- [x] Countdown shows large numbers (3, 2, 1) with animation
- [x] Shutter animation (white flash) plays on capture
- [x] Captured photos display in a grid matching the selected layout
- [x] Each photo thumbnail shows its number (1/4, 2/4, etc.)
- [x] Retake button appears on hover over each thumbnail
- [x] Photos are captured at 1920×1440 resolution (4:3 landscape)
- [x] Automatically proceeds to editor when all slots filled

#### Camera Initialization Flow

```
User clicks "Start Camera"
  ↓
Request navigator.mediaDevices.getUserMedia()
  ↓
Permission granted?
  ├─ Yes → Display video stream
  └─ No → Show error message + fallback instructions

User clicks "Capture"
  ↓
Display countdown (3... 2... 1...)
  ↓
Capture screenshot from webcam
  ↓
Play shutter animation
  ↓
Add to photoStore.photos[]
  ↓
Check if photos.length === maxPhotos
  ├─ Yes → workflowStore.nextStep()
  └─ No → Ready for next capture
```

#### Retake Functionality

```
User hovers over photo thumbnail
  ↓
Show "Retake" button
  ↓
User clicks "Retake"
  ↓
Open camera view with countdown
  ↓
Capture new photo
  ↓
photoStore.replacePhoto(index, newPhotoDataUrl)
  ↓
Return to photo grid
```

#### Copy (UI Text)

```javascript
COPY.camera = {
  startCamera: "Start Camera",
  stopCamera: "Stop Camera",
  capture: "Capture",
  retake: "Retake",
  countdown: {
    ready: "Get Ready!",
    numbers: ["3", "2", "1"],
    smile: "Smile! 📸"
  },
  photoCounter: (current, total) => `${current}/${total}`,
  permissionDenied: "Camera access denied. Please enable camera permissions.",
  cameraError: "Unable to access camera. Please try again.",
}
```

---

### 5.3 Photo Editor (Filters & Frames)

#### User Stories
- **US-009**: As a user, I want to apply filters to enhance my photos
- **US-010**: As a user, I want to add decorative frames around the final image
- **US-011**: As a user, I want to preview changes before finalizing

#### Acceptance Criteria
- [x] Filter panel displays 6 filter options with previews
- [x] Clicking a filter applies it to all photos instantly
- [x] Frame panel displays frame options
- [x] Frame preview shows CSS approximation in editor
- [x] Frame overlay is applied during final export
- [x] Each layout uses layout-specific frame image (PNG)
- [x] Frame images have transparent centers for photos to show through

#### Filter Specifications

```javascript
// features/editor/constants/filters.js
export const FILTERS = [
  {
    id: 'none',
    name: 'Original',
    filter: '',
    description: 'No filter applied'
  },
  {
    id: 'bw',
    name: 'Black & White',
    filter: 'grayscale(100%)',
    description: 'Classic monochrome'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    filter: 'sepia(50%) contrast(110%) brightness(95%)',
    description: 'Retro film look'
  },
  {
    id: 'vivid',
    name: 'Vivid',
    filter: 'saturate(150%) contrast(110%)',
    description: 'Boost colors'
  },
  {
    id: 'cool',
    name: 'Cool Tone',
    filter: 'hue-rotate(180deg) saturate(120%)',
    description: 'Blue-ish tint'
  },
  {
    id: 'warm',
    name: 'Warm Tone',
    filter: 'sepia(30%) saturate(120%) brightness(105%)',
    description: 'Golden hour vibe'
  },
];
```

#### Frame System

The frame system uses layout-specific parameters defined in `FRAME_SETTINGS`:

```javascript
// Photo dimensions (4:3 landscape)
const STANDARD_CELL_WIDTH = 1920;
const STANDARD_CELL_HEIGHT = 1440;

// Frame settings by layout
const FRAME_SETTINGS = {
  '2x2': {
    cellGap: 64,        // Gap between photos
    sideBorder: 60,     // Left/right border
    topBorder: 1000,    // Top border
    bottomBorder: 120,  // Bottom border
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
```

**Frame Canvas Dimensions**:

| Layout | Width (px) | Height (px) | Formula |
|--------|-----------|-------------|---------|
| 2x2 | 4168 | 4120 | (2×1920 + 1×64 + 2×60) × (2×1440 + 1×64 + 1000 + 120) |
| 1x4 | 2040 | 7480 | (1×1920 + 0×64 + 2×60) × (4×1440 + 3×64 + 120 + 1000) |
| 3x3 | 6088 | 6880 | (3×1920 + 2×64 + 2×60) × (3×1440 + 2×64 + 1200 + 1200) |

**Frame Generation**:
- Frames are generated using `frame-generator.html` (external tool, not in repo)
- Frame images must match exact canvas dimensions
- Transparent PNG with cutouts for photos
- Stored in `/public/frames/{frame-id}/{layout-id}.png`

#### Artist-Based Frame System

**Artist Management:**

```javascript
export const ARTISTS = {
  builtin: {
    id: 'builtin',
    name: 'Built-in',
    instagram: null,
    bio: 'Default frames',
  },
  'dodo-lin': {
    id: 'dodo-lin',
    name: 'Dodo Lin',
    instagram: '@july1st_2014',
    bio: 'Frame designer and artist',
  },
  // Add more artists here as they join
};
```

**Frame Options:**

```javascript
export const FRAMES = [
  {
    id: 'solid-color',
    name: 'Solid Color',
    artistId: 'builtin',
    preview: 'Custom color frame',
    customizable: true,  // Indicates this frame has customizable options
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    artistId: 'dodo-lin',
    preview: 'Classic instant photo',
  },
];
```

**Helper Functions:**

```javascript
// Get artist by ID
export const getArtistById = (artistId) => ARTISTS[artistId] || null;

// Get frames grouped by artist
export const getFramesByArtist = () => {
  const grouped = {};
  FRAMES.forEach(frame => {
    const artistId = frame.artistId || 'builtin';
    if (!grouped[artistId]) grouped[artistId] = [];
    grouped[artistId].push(frame);
  });
  return grouped;
};

// Get all unique artists who have frames
export const getFrameArtists = () => {
  const artistIds = [...new Set(FRAMES.map(f => f.artistId || 'builtin'))];
  return artistIds.map(id => ARTISTS[id]).filter(Boolean);
};

// Get frame image path (new artist-based structure)
export const getFrameImagePath = (frameId, layoutId) => {
  const frame = getFrameById(frameId);
  if (!frame || !frame.artistId) return null;

  // Frames without images return null
  if (frameId === 'none' || frameId === 'solid-color') return null;

  // New structure: /frames/{artistId}/{layoutId}/{frameId}.png
  return `/frames/${frame.artistId}/${layoutId}/${frameId}.png`;
};
```

#### Copy (UI Text)

```javascript
COPY.editor = {
  title: "Edit Your Photos",
  subtitle: "Apply filters and frames",
  tabs: {
    filters: "Filters",
    frames: "Frames",
  },
  filterPanel: {
    title: "Choose a Filter",
    apply: "Apply",
  },
  framePanel: {
    title: "Select a Frame",
  },
  actions: {
    reset: "Reset All",
  }
}
```

---

### 5.4 Export & Share

#### User Stories
- **US-012**: As a user, I want to preview the final composite image before downloading
- **US-013**: As a user, I want to download the image to my device
- **US-014**: As a user, I want to share the image on social media
- **US-015**: As a user, I want to start over and create a new photo

#### Acceptance Criteria
- [x] Final composite image renders at high quality (1920×1440px per photo)
- [x] Preview shows the exact image that will be downloaded
- [x] Download button triggers immediate file download
- [x] Downloaded file is named `dodopic-{timestamp}.jpg`
- [x] Share button opens native share sheet using Web Share API
- [x] Copy to clipboard button for devices that support it
- [x] "Start Over" button clears all stores and returns to layout selection
- [x] Loading state shows during image composition
- [x] File size display after composition

#### Image Composition Algorithm

```javascript
/**
 * Composites all photos into final layout with filters and frames
 *
 * @param {Array<string>} photos - Array of photo data URLs
 * @param {Layout} layout - Selected layout configuration
 * @param {string} filterId - Filter ID
 * @param {Frame|null} frameId - Selected frame ID
 * @returns {Promise<string>} - Final composite image as data URL
 */
export const compositeImage = async ({ photos, layout, filterId, frameId, quality = 0.95 }) => {
  const settings = FRAME_SETTINGS[layout.id];
  const { width, height } = getCanvasDimensions(layout);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  // Step 1: Draw white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Step 2: Place photos in grid with filter applied
  photos.forEach((photoDataUrl, index) => {
    const row = Math.floor(index / layout.cols);
    const col = index % layout.cols;
    const x = settings.sideBorder + col * (STANDARD_CELL_WIDTH + settings.cellGap);
    const y = settings.topBorder + row * (STANDARD_CELL_HEIGHT + settings.cellGap);

    // Apply filter and draw with object-fit: cover scaling
    ctx.save();
    ctx.filter = getFilterCSS(filterId);
    ctx.drawImage(img, x, y, STANDARD_CELL_WIDTH, STANDARD_CELL_HEIGHT);
    ctx.restore();
  });

  // Step 3: Draw frame overlay (if exists)
  const framePath = getFrameImagePath(frameId, layout.id);
  if (framePath) {
    const frameImg = new Image();
    frameImg.src = framePath;
    await frameImg.onload;
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  }

  // Step 4: Export as JPEG
  return canvas.toDataURL('image/jpeg', quality);
};
```

#### Download Implementation

```javascript
/**
 * Triggers browser download of image
 *
 * @param {string} dataUrl - Image data URL
 * @param {string} filename - Desired filename (default: dodopic-{timestamp}.jpg)
 */
export const downloadImage = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename || `dodopic-${Date.now()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

#### Share Implementation

```javascript
/**
 * Shares image using Web Share API (with fallback)
 *
 * @param {string} dataUrl - Image data URL
 * @returns {Promise<void>}
 */
export const shareImage = async (dataUrl) => {
  // Convert data URL to Blob
  const blob = await fetch(dataUrl).then(res => res.blob());
  const file = new File([blob], 'dodopic.jpg', { type: 'image/jpeg' });

  // Check if Web Share API is available
  if (navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'DodoPic Photo',
        text: 'Check out my DodoPic creation!',
      });
      return { success: true, method: 'native' };
    } catch (error) {
      console.error('Share failed:', error);
      return { success: false, error };
    }
  } else {
    // Fallback: Copy to clipboard or download
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/jpeg': blob })
      ]);
      return { success: true, method: 'clipboard' };
    } catch (error) {
      downloadImage(dataUrl);
      return { success: true, method: 'download' };
    }
  }
};
```

#### Copy (UI Text)

```javascript
COPY.export = {
  title: "Your DodoPic is Ready!",
  subtitle: "Download or share your creation",
  preview: {
    title: "Preview",
    loading: "Creating your masterpiece...",
  },
  actions: {
    download: "Download",
    share: "Share",
    startOver: "Start Over",
  },
  messages: {
    downloadSuccess: "Downloaded successfully!",
    shareSuccess: "Shared successfully!",
    shareCopied: "Image copied to clipboard!",
    shareFallback: "Share not available. Image downloaded instead.",
    error: "Something went wrong. Please try again.",
  },
  confirmRestart: {
    title: "Start Over?",
    message: "This will clear all your photos and edits.",
    confirm: "Yes, Start Over",
    cancel: "Cancel",
  }
}
```

---

### 5.5 Workflow Management

#### User Stories
- **US-016**: As a user, I want to see which step I'm on in the process
- **US-017**: As a user, I want to navigate back to previous steps if needed
- **US-018**: As a user, I want the app to prevent me from skipping steps

#### Acceptance Criteria
- [x] Step indicator shows all 4 steps: Layout → Camera → Editor → Export
- [x] Current step is visually highlighted
- [x] Completed steps show a checkmark
- [x] "Next" button is disabled if current step is incomplete
- [x] "Previous" button works at any step except Layout
- [x] Navigation bar with Previous/Next buttons
- [x] Step transitions have smooth animations (Framer Motion)

#### Step Validation Logic

```javascript
// workflowStore validation
const canProceedToCamera = () => {
  return layoutStore.selectedLayout !== null;
};

const canProceedToEditor = () => {
  return photoStore.photos.length === photoStore.maxPhotos;
};

const canProceedToExport = () => {
  // No validation needed - editor is optional
  return true;
};

const canGoBack = () => {
  return workflowStore.currentStep !== 'layout';
};
```

#### Copy (UI Text)

```javascript
COPY.workflow = {
  steps: {
    layout: "Layout",
    camera: "Capture",
    editor: "Edit",
    export: "Export",
  },
  navigation: {
    next: "Next",
    previous: "Previous",
    skip: "Skip",
  },
  validation: {
    layoutRequired: "Please select a layout first",
    photosIncomplete: (current, total) => `Capture ${total - current} more photo(s)`,
  }
}
```

---

## 6. API Specifications

### 6.1 Canvas Operations API

#### 6.1.1 applyFilterToCanvas

```javascript
/**
 * Applies CSS filter to image on canvas
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {string} filterString - CSS filter string (e.g., 'grayscale(100%)')
 * @param {HTMLImageElement} image - Image element to draw
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width to draw
 * @param {number} height - Height to draw
 */
export const applyFilterToCanvas = (ctx, filterString, image, x, y, width, height) => {
  ctx.save();
  ctx.filter = filterString;
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
};
```

#### 6.1.2 compositeImage

```javascript
/**
 * Composites photos, filter, and frame into final image
 *
 * @param {Object} options - Composition options
 * @param {Array<string>} options.photos - Array of photo data URLs
 * @param {Object} options.layout - Layout configuration
 * @param {string} options.filterId - Filter ID
 * @param {string} options.frameId - Frame ID
 * @param {string} options.frameColor - Custom frame color (for solid-color frame)
 * @param {number} options.quality - JPEG quality (0-1), default 0.95
 * @returns {Promise<string>} Data URL of composed image
 */
export const compositeImage = async ({ photos, layout, filterId, frameId, frameColor = '#FFFFFF', quality = 0.95 }) => {
  // Standard dimensions (4:3 landscape)
  const CELL_WIDTH = 1920;
  const CELL_HEIGHT = 1440;

  // Get layout-specific frame settings
  const settings = FRAME_SETTINGS[layout.id];

  // Calculate canvas dimensions
  const gridWidth = layout.cols * CELL_WIDTH + (layout.cols - 1) * settings.cellGap;
  const gridHeight = layout.rows * CELL_HEIGHT + (layout.rows - 1) * settings.cellGap;
  const width = gridWidth + settings.sideBorder * 2;
  const height = gridHeight + settings.topBorder + settings.bottomBorder;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  // 1. Draw background (white or custom color for solid-color frame)
  ctx.fillStyle = frameId === 'solid-color' ? frameColor : '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // 2. Draw photos with filter
  await Promise.all(photos.map((photoUrl, index) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const row = Math.floor(index / layout.cols);
        const col = index % layout.cols;
        const x = settings.sideBorder + col * (CELL_WIDTH + settings.cellGap);
        const y = settings.topBorder + row * (CELL_HEIGHT + settings.cellGap);

        // Apply filter and draw with object-fit: cover
        ctx.save();
        ctx.filter = getFilterCSS(filterId);
        // ... object-fit: cover logic ...
        ctx.restore();
        resolve();
      };
      img.src = photoUrl;
    });
  }));

  // 3. Draw frame overlay (if exists)
  const framePath = getFrameImagePath(frameId, layout.id);
  if (framePath) {
    const frameImg = new Image();
    await new Promise((resolve) => {
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, width, height);
        resolve();
      };
      frameImg.src = framePath;
    });
  }

  // 4. Export as JPEG
  return canvas.toDataURL('image/jpeg', quality);
};
```

#### 6.1.3 getFrameImagePath

```javascript
/**
 * Gets layout-specific frame image path
 * Uses new artist-based structure: /frames/{artistId}/{layoutId}/{frameId}.png
 *
 * @param {string} frameId - Frame identifier
 * @param {string} layoutId - Layout identifier (e.g., '2x2', '1x4', '3x3')
 * @returns {string|null} Path to frame image or null
 */
export const getFrameImagePath = (frameId, layoutId) => {
  const frame = getFrameById(frameId);
  if (!frame || !frame.artistId) return null;

  // Frames without images return null (e.g., solid-color)
  if (frameId === 'none' || frameId === 'solid-color') return null;

  // New structure: /frames/{artistId}/{layoutId}/{frameId}.png
  return `/frames/${frame.artistId}/${layoutId}/${frameId}.png`;
};
```

#### 6.1.4 Canvas Dimension Specifications

**Photo Dimensions (4:3 landscape aspect ratio)**:
- Each photo cell: **1920 × 1440 pixels**
- Aspect ratio: **4:3 (landscape)**

**Frame Settings by Layout**:

| Layout | Cell Gap | Side Border | Top Border | Bottom Border |
|--------|----------|-------------|------------|---------------|
| 2x2 | 64px | 60px | 1000px | 120px |
| 1x4 | 64px | 60px | 120px | 1000px |
| 3x3 | 64px | 60px | 1200px | 1200px |

**Layout Output Sizes**:

| Layout | Width (px) | Height (px) | Grid Size | Formula |
|--------|-----------|-------------|-----------|---------|
| 2×2 | 4168 | 4120 | 2 cols × 2 rows | (2×1920 + 1×64 + 2×60) × (2×1440 + 1×64 + 1000 + 120) |
| 1×4 | 2040 | 7480 | 1 col × 4 rows | (1×1920 + 0×64 + 2×60) × (4×1440 + 3×64 + 120 + 1000) |
| 3×3 | 6088 | 6880 | 3 cols × 3 rows | (3×1920 + 2×64 + 2×60) × (3×1440 + 2×64 + 1200 + 1200) |

**Object-fit: Cover Scaling**:
Photos are scaled to fill the cell while maintaining aspect ratio, with centered cropping to prevent distortion.

---

### 6.2 File Handling API

#### 6.2.1 convertDataUrlToBlob

```javascript
/**
 * Converts data URL to Blob object
 *
 * @param {string} dataUrl - Image data URL
 * @returns {Promise<Blob>}
 */
export const convertDataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return response.blob();
};
```

#### 6.2.2 generateFilename

```javascript
/**
 * Generates unique filename with timestamp
 *
 * @param {string} prefix - Filename prefix (default: 'dodopic')
 * @param {string} extension - File extension (default: 'jpg')
 * @returns {string} - Formatted filename
 */
export const generateFilename = (prefix = 'dodopic', extension = 'jpg') => {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
  return `${prefix}-${timestamp}.${extension}`;
};
```

---

### 6.3 Web Share API Integration

#### 6.3.1 canShare

```javascript
/**
 * Checks if Web Share API is available and can share files
 *
 * @returns {boolean}
 */
export const canShare = () => {
  return (
    'share' in navigator &&
    'canShare' in navigator &&
    navigator.canShare({ files: [new File([], 'test.jpg')] })
  );
};
```

#### 6.3.2 shareWithFallback

```javascript
/**
 * Attempts to share using Web Share API with multiple fallbacks
 *
 * @param {string} dataUrl - Image data URL
 * @param {Object} options - Share options
 * @returns {Promise<ShareResult>}
 */
export const shareWithFallback = async (dataUrl, options = {}) => {
  const blob = await convertDataUrlToBlob(dataUrl);
  const file = new File([blob], options.filename || 'dodopic.jpg', {
    type: 'image/jpeg'
  });

  // Try 1: Native Web Share API
  if (canShare()) {
    try {
      await navigator.share({
        files: [file],
        title: options.title || 'DodoPic Photo',
        text: options.text || 'Check out my DodoPic!',
      });
      return { success: true, method: 'web-share' };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, cancelled: true };
      }
      // Fall through to next method
    }
  }

  // Try 2: Clipboard API
  if ('clipboard' in navigator) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/jpeg': blob })
      ]);
      return { success: true, method: 'clipboard' };
    } catch (error) {
      // Fall through to next method
    }
  }

  // Try 3: Force download as fallback
  downloadImage(dataUrl, options.filename);
  return { success: true, method: 'download-fallback' };
};
```

---

## 7. UI/UX Specifications

### 7.1 Design System (macOS/iOS Style)

#### Color Palette

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // iOS System Colors
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          indigo: '#5856D6',
          orange: '#FF9500',
          pink: '#FF2D55',
          purple: '#AF52DE',
          red: '#FF3B30',
          teal: '#5AC8FA',
          yellow: '#FFCC00',
        },

        // iOS Gray Scale
        'ios-gray': {
          50: '#F2F2F7',   // Background tertiary
          100: '#E5E5EA',  // Background secondary
          200: '#D1D1D6',  // Border
          300: '#C7C7CC',  // Separator
          400: '#AEAEB2',  // Placeholder
          500: '#8E8E93',  // Label secondary
          600: '#636366',  // Label tertiary
          700: '#48484A',  // Label quaternary
          800: '#3A3A3C',  // Background elevated
          900: '#1C1C1E',  // Background primary (dark)
        },

        // Custom Brand Colors
        primary: '#007AFF',      // iOS blue
        secondary: '#5856D6',    // iOS indigo
        accent: '#FF2D55',       // iOS pink
        success: '#34C759',
        warning: '#FF9500',
        danger: '#FF3B30',
      },
    },
  },
};
```

#### Typography Scale

```javascript
fontFamily: {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'SF Pro Display',
    'Inter',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
},

fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
},

fontWeight: {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
},
```

#### Spacing System

```javascript
spacing: {
  px: '1px',
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
},
```

#### Shadow & Blur Specifications

```javascript
boxShadow: {
  // iOS-style shadows
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'DEFAULT': '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // macOS-specific
  'macos': '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
  'macos-lg': '0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
},

backdropBlur: {
  xs: '2px',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  'macos': '40px',  // macOS-style blur
},

backdropFilter: {
  none: 'none',
  blur: 'blur(40px)',
  'blur-sm': 'blur(20px)',
},
```

#### Border Radius

```javascript
borderRadius: {
  none: '0',
  sm: '0.25rem',   // 4px
  DEFAULT: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '3rem',   // 48px
  full: '9999px',
},
```

---

### 7.2 Component Library

#### 7.2.1 Button Component

```jsx
/**
 * Button Component - macOS/iOS Style
 *
 * Variants:
 * - primary: Blue filled button (main actions)
 * - secondary: Gray outline button (cancel, back)
 * - danger: Red filled button (destructive actions)
 * - ghost: Transparent button (subtle actions)
 *
 * Sizes:
 * - sm: Small (32px height)
 * - md: Medium (40px height) [default]
 * - lg: Large (48px height)
 */

<Button variant="primary" size="md" onClick={handleClick}>
  Capture Photo
</Button>

// CSS Classes
.btn-primary {
  @apply bg-ios-blue text-white;
  @apply hover:bg-blue-600 active:bg-blue-700;
  @apply transition-colors duration-150;
  @apply shadow-md hover:shadow-lg;
}

.btn-secondary {
  @apply bg-transparent border-2 border-ios-gray-300;
  @apply text-gray-700 hover:bg-ios-gray-50;
  @apply transition-all duration-150;
}

.btn-danger {
  @apply bg-ios-red text-white;
  @apply hover:bg-red-600 active:bg-red-700;
  @apply shadow-md hover:shadow-lg;
}
```

#### 7.2.2 Card Component

```jsx
/**
 * Card Component - macOS-style elevated surface
 *
 * Features:
 * - White background
 * - Subtle shadow
 * - Rounded corners
 * - Optional hover effect
 */

<Card hover={true} onClick={handleSelect}>
  <Card.Image src={layoutPreview} />
  <Card.Title>Classic 2x2</Card.Title>
</Card>

// CSS Classes
.card {
  @apply bg-white rounded-2xl;
  @apply shadow-macos;
  @apply transition-all duration-200;
}

.card-hover:hover {
  @apply shadow-macos-lg transform scale-105;
}

.card-selected {
  @apply ring-4 ring-ios-blue ring-opacity-50;
  @apply border-2 border-ios-blue;
}
```

#### 7.2.3 Modal Component

```jsx
/**
 * Modal Component - iOS-style sheet
 *
 * Features:
 * - Backdrop blur
 * - Slide up animation (mobile)
 * - Fade in animation (desktop)
 * - Swipe to dismiss (mobile)
 */

<Modal isOpen={showConfirm} onClose={handleClose}>
  <Modal.Header>Start Over?</Modal.Header>
  <Modal.Body>
    This will clear all your photos and edits.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="danger" onClick={handleConfirm}>Start Over</Button>
  </Modal.Footer>
</Modal>

// CSS Classes
.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-40;
  @apply backdrop-blur-sm;
  @apply transition-opacity duration-200;
}

.modal-content {
  @apply bg-white rounded-t-3xl md:rounded-2xl;
  @apply shadow-2xl;
  @apply max-w-md mx-auto;
}
```

---

### 7.3 Responsive Breakpoints

```javascript
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet portrait
  'lg': '1024px',  // Tablet landscape / Small desktop
  'xl': '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
}
```

#### Layout Behavior

| Breakpoint | Layout Selector | Camera View | Editor | Export |
|------------|----------------|-------------|--------|---------|
| **< 768px** (Mobile) | 1 column, stacked | Full-screen camera | Tabs at bottom | Full-screen preview |
| **768px - 1024px** (Tablet) | 2 columns | 60% camera, 40% grid | Side panels | 2-column layout |
| **> 1024px** (Desktop) | 3 columns, grid | 50/50 split | 3-panel layout | Centered preview |

---

### 7.4 Animation Specifications

#### Transition Durations

```javascript
transitionDuration: {
  75: '75ms',
  100: '100ms',
  150: '150ms',   // Default for most interactions
  200: '200ms',   // Hover states
  300: '300ms',   // Modal/drawer animations
  500: '500ms',   // Page transitions
  700: '700ms',
  1000: '1000ms',
}
```

#### Easing Functions

```javascript
transitionTimingFunction: {
  'ease-in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',  // macOS-style
  'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',       // iOS spring
  'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}
```

#### Key Animations

```javascript
// Framer Motion Variants

// Page Transitions
export const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

// Button Press
export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

// Shutter Flash
export const shutterFlash = {
  initial: { opacity: 0 },
  animate: { opacity: [0, 1, 0] },
  transition: { duration: 0.3, times: [0, 0.5, 1] },
};

// Countdown Numbers
export const countdownVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
  },
  exit: { scale: 0, opacity: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
};
```

---

### 7.5 Copy (All UI Text)

**Complete copy dictionary in `src/shared/copy/en.js`**:

```javascript
export const COPY = {
  // Global
  global: {
    appName: "DodoPic",
    tagline: "Photo Booth in Your Browser",
    loading: "Loading...",
    error: "Oops! Something went wrong.",
  },

  // Layout Selection (Step 1)
  layout: {
    title: "Choose Your Layout",
    subtitle: "Select a photo layout to get started",
    layouts: {
      '2x2': "Classic 2x2",
      '1x4': "Vertical Strip",
      '3x3': "Grid 3x3",
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
    countdown: {
      ready: "Get Ready!",
      smile: "Smile! 📸",
    },
    photoCounter: (current, total) => `${current}/${total}`,
    permissions: {
      denied: "Camera access denied",
      deniedHelp: "Please enable camera permissions in your browser settings",
      error: "Unable to access camera",
      errorHelp: "Please check your camera connection and try again",
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
    filterPanel: {
      title: "Choose a Filter",
      noFilter: "Original",
    },
    framePanel: {
      title: "Select a Frame",
      solidColor: "Solid Color",
      frameColor: "Frame Color",
    },
    actions: {
      reset: "Reset All",
      confirmReset: "Are you sure you want to reset all edits?",
    },
  },

  // Export & Share (Step 4)
  export: {
    title: "Your DodoPic is Ready!",
    subtitle: "Download or share your creation",
    preview: {
      title: "Preview",
      loading: "Creating your masterpiece...",
    },
    actions: {
      download: "Download",
      share: "Share",
      startOver: "Start Over",
    },
    messages: {
      downloadSuccess: "Downloaded successfully!",
      downloadError: "Download failed. Please try again.",
      shareSuccess: "Shared successfully!",
      shareCopied: "Image copied to clipboard!",
      shareFallback: "Share not available. Image downloaded instead.",
      shareError: "Share failed. Please try again.",
    },
    confirmRestart: {
      title: "Start Over?",
      message: "This will clear all your photos and edits.",
      confirm: "Yes, Start Over",
      cancel: "Cancel",
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
    navigation: {
      next: "Next",
      previous: "Previous",
      skip: "Skip",
      finish: "Finish",
    },
    validation: {
      layoutRequired: "Please select a layout first",
      photosIncomplete: (remaining) =>
        `Capture ${remaining} more photo${remaining > 1 ? 's' : ''}`,
      cameraNotReady: "Camera is not ready",
    },
  },

  // Filters
  filters: {
    none: {
      name: "Original",
      description: "No filter",
    },
    bw: {
      name: "Black & White",
      description: "Classic monochrome",
    },
    vintage: {
      name: "Vintage",
      description: "Retro film look",
    },
    vivid: {
      name: "Vivid",
      description: "Boost colors",
    },
    cool: {
      name: "Cool Tone",
      description: "Blue-ish tint",
    },
    warm: {
      name: "Warm Tone",
      description: "Golden hour vibe",
    },
  },
};
```

---

## 8. File & Folder Structure

```
dodopic/
├── public/
│   ├── frames/
│   │   ├── dodo-lin/
│   │   │   ├── artist.json
│   │   │   ├── 2x2/
│   │   │   │   └── polaroid.png
│   │   │   ├── 1x4/
│   │   │   │   └── polaroid.png
│   │   │   └── 3x3/
│   │   │       └── polaroid.png
│   │   └── ... (additional artists)
│   ├── assets/
│   │   └── layout-previews/
│   │       ├── 2x2.jpg
│   │       ├── 1x4.jpg
│   │       └── 3x3.jpg
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── features/
│   │   ├── layout/
│   │   │   ├── components/
│   │   │   │   ├── LayoutSelector.jsx
│   │   │   │   └── LayoutPreview.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useLayoutSelection.js
│   │   │   └── constants/
│   │   │       └── layouts.js
│   │   │
│   │   ├── camera/
│   │   │   ├── components/
│   │   │   │   ├── CameraView.jsx
│   │   │   │   ├── CaptureButton.jsx
│   │   │   │   ├── Countdown.jsx
│   │   │   │   └── PhotoGrid.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useCamera.js
│   │   │   └── utils/
│   │   │       └── photoCapture.js
│   │   │
│   │   ├── editor/
│   │   │   ├── components/
│   │   │   │   ├── EditorCanvas.jsx
│   │   │   │   ├── FilterPanel.jsx
│   │   │   │   ├── FramePanel.jsx
│   │   │   │   └── EditorToolbar.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useFilters.js
│   │   │   │   └── useCanvas.js
│   │   │   ├── utils/
│   │   │   │   ├── filters.js
│   │   │   │   └── canvas.js
│   │   │   └── constants/
│   │   │       ├── filters.js
│   │   │       └── frames.js
│   │   │
│   │   ├── export/
│   │   │   ├── components/
│   │   │   │   ├── ExportPreview.jsx
│   │   │   │   ├── DownloadButton.jsx
│   │   │   │   └── SharePanel.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useExport.js
│   │   │   └── utils/
│   │   │       ├── imageComposite.js
│   │   │       ├── download.js
│   │   │       └── share.js
│   │   │
│   │   └── workflow/
│   │       ├── components/
│   │       │   ├── WorkflowStepper.jsx
│   │       │   └── NavigationBar.jsx
│   │       └── hooks/
│   │           └── useWorkflow.js
│   │
│   ├── store/
│   │   ├── index.js
│   │   ├── photoStore.js
│   │   ├── layoutStore.js
│   │   ├── editorStore.js
│   │   └── workflowStore.js
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Loading.jsx
│   │   ├── hooks/
│   │   │   └── useMediaQuery.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   └── copy/
│   │       └── en.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── .eslintrc.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
└── SPEC.md (this file)
```

### 8.1 Naming Conventions

- **Components**: PascalCase (e.g., `LayoutSelector.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCamera.js`)
- **Utils**: camelCase (e.g., `imageComposite.js`)
- **Constants**: camelCase file, SCREAMING_SNAKE_CASE exports (e.g., `layouts.js` → `export const LAYOUTS`)
- **Stores**: camelCase with `Store` suffix (e.g., `photoStore.js`)

### 8.2 Import/Export Patterns

```javascript
// Named exports for utilities
export const compositeFinalImage = () => {};
export const downloadImage = () => {};

// Default export for components
export default function LayoutSelector() {}

// Default export for stores
export const usePhotoStore = create(() => {});

// Re-export from index for cleaner imports
// src/store/index.js
export { usePhotoStore } from './photoStore';
export { useLayoutStore } from './layoutStore';
export { useEditorStore } from './editorStore';
export { useWorkflowStore } from './workflowStore';

// Usage
import { usePhotoStore, useLayoutStore } from '@/store';
```

---

## 9. Testing Strategy

### 9.1 Unit Testing Approach

**Framework**: Vitest + React Testing Library

**Coverage Goals**:
- Utility functions: 90%+ coverage
- Stores: 80%+ coverage
- Components: 70%+ coverage

**Priority Test Areas**:
1. **Zustand Stores** - State mutations, action side effects
2. **Canvas Utils** - Image composition, filter application
3. **File Handling** - Download, share, blob conversion
4. **Workflow Logic** - Step validation, navigation

### 9.2 Integration Testing

**Test Scenarios**:
- Complete user flow: Layout → Capture → Edit → Export
- Retake photo functionality
- Filter application across all photos
- Frame application with layout-specific images
- Download and share flows

### 9.3 Browser Testing Matrix

| Browser | Desktop | Mobile | Priority |
|---------|---------|--------|----------|
| Chrome | ✅ Latest 3 | ✅ Latest 2 | High |
| Safari | ✅ Latest 2 | ✅ Latest 2 | High |
| Firefox | ✅ Latest 2 | ❌ | Medium |
| Edge | ✅ Latest 2 | ❌ | Low |

### 9.4 Manual Testing Checklist

**Camera Functionality**:
- [ ] Camera permissions request appears
- [ ] Video stream displays correctly
- [ ] Countdown shows before capture
- [ ] Shutter animation plays
- [ ] Photos capture at 1920×1440 resolution
- [ ] Retake replaces correct photo

**Editor Functionality**:
- [ ] Filters apply to all photos
- [ ] Filter preview matches final output
- [ ] Frame overlays correctly
- [ ] Frame preview shows in editor
- [ ] Layout-specific frames load correctly

**Export Functionality**:
- [ ] Composite image renders correctly
- [ ] Download triggers file save
- [ ] Downloaded image quality is high
- [ ] Downloaded image dimensions are correct
- [ ] Share opens native sheet (mobile)
- [ ] Share fallback works (desktop)
- [ ] Start Over clears all state

**Responsive Design**:
- [ ] Mobile portrait layout works
- [ ] Mobile landscape layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch gestures work (mobile)
- [ ] Mouse interactions work (desktop)

---

## 10. Deployment & Build Configuration

### 10.1 Build Commands

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx",
    "format": "prettier --write \"src/**/*.{js,jsx,css,md}\""
  }
}
```

### 10.2 Environment Variables

**No environment variables needed** - This is a fully client-side application.

Optional: Add analytics or error tracking
```env
# .env.production (optional)
VITE_ANALYTICS_ID=your-ga-id
VITE_SENTRY_DSN=your-sentry-dsn
```

### 10.3 Static Hosting Setup

**Recommended Platforms**:
1. **Vercel** (Best for Vite)
2. **Netlify**
3. **GitHub Pages**
4. **Cloudflare Pages**

**Vercel Deployment**:
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify Deployment**:
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 10.4 Performance Optimization

**Build Optimizations**:
- Tree-shaking (automatic with Vite)
- Code splitting by route
- Asset compression (gzip/brotli)
- Image optimization (use WebP for layout previews)

**Runtime Optimizations**:
- Lazy load frame assets
- Use `React.memo()` for expensive components
- Optimize canvas rendering (avoid unnecessary redraws)
- Preload camera permissions on layout selection

**Performance Budgets**:
- Initial load: < 300KB (compressed)
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

---

## Appendix A: Future Enhancements (V2+)

**Not included in initial release**:
- Multi-language support (i18n)
- Custom text overlay on photos
- AI-powered filters (beauty mode, background blur)
- Cloud storage integration
- User accounts & photo history
- Social sharing wall
- QR code generation for easy mobile access
- PWA support (offline mode)
- Advanced editing (crop, rotate, adjust brightness/contrast)
- Custom frame creator
- GIF export option
- Batch download (all individual photos)
- Additional layouts (square grid, custom arrangements)

---

## Appendix B: Changelog

**v2.3.0** (2026-02-04)
- Implemented artist-based frame organization system
- Added ARTISTS data structure with metadata (name, Instagram, bio)
- Reorganized frame file structure: `/frames/{artistId}/{layoutId}/{frameId}.png`
- Added first frame artist: Dodo Lin (@july1st_2014)
- Implemented artist tabs navigation in frame selector
- Added artist info cards with Instagram attribution
- Replaced 'No Frame' with customizable 'Solid Color' frame
- Added frameColor state to editorStore (default: #FFFFFF)
- Implemented color picker UI (HTML5 color input)
- Updated compositeImage() to support custom frame colors
- Added frame preview with actual frame images
- Created helper functions: getArtistById, getFramesByArtist, getFrameArtists
- Updated getFrameImagePath to use new artist-based structure

**v2.2.0** (2026-01-28)
- Updated to 4:3 landscape photo aspect ratio (1920×1440px)
- Removed 4x1 and 2x3 layouts (now supports: 2x2, 1x4, 3x3)
- Implemented layout-specific FRAME_SETTINGS system
- Removed all sticker functionality
- Updated frame dimensions to match new photo sizes
- Simplified editor to filters and frames only
- Updated all documentation to reflect current implementation

**v2.0.0** (2026-01-12)
- Complete architecture redesign
- Zustand state management
- Tailwind CSS styling
- macOS/iOS design system
- Feature-based folder structure
- Comprehensive SPEC documentation

**v1.0.0** (2025-03-08)
- Initial prototype
- Basic camera + frame selection
- SCSS styling
- Proof of concept

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.3.0 | 2026-02-04 | AI Assistant | Added artist-based frame system, customizable solid color frame |
| 2.2.0 | 2026-01-28 | AI Assistant | Updated for 4:3 landscape photos, removed stickers, updated layouts |
| 2.1.0 | 2026-01-16 | AI Assistant | Minor updates and clarifications |
| 2.0.0 | 2026-01-12 | AI Assistant | Complete SDD for refactor project |
| 1.0.0 | 2025-03-08 | Original Dev | Initial project setup |

---

**End of Specification Document**

For implementation questions or clarifications, refer to this document first. Update this SPEC as new decisions are made or requirements change.
