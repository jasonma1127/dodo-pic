# DodoPic Testing Checklist

## ✅ Static Code Analysis (Completed)

### Import/Export Verification
- [x] All component imports in App.jsx are correct
- [x] EditorView properly exported
- [x] ExportPreview properly exported
- [x] All EditorStore imports correct
- [x] All COPY references verified
- [x] All constants properly exported (FILTERS, STICKERS, FRAMES)
- [x] All utility functions properly exported

### COPY (UI Text) Verification
- [x] `COPY.editor.filters.title` ✓
- [x] `COPY.editor.stickers.title` ✓
- [x] `COPY.editor.stickers.hint` ✓
- [x] `COPY.editor.frames.title` ✓
- [x] `COPY.export.composing` ✓
- [x] `COPY.export.download` ✓
- [x] `COPY.export.share` ✓
- [x] `COPY.export.copy` ✓
- [x] `COPY.export.copied` ✓
- [x] `COPY.export.restart` ✓
- [x] `COPY.export.fileSize` ✓
- [x] `COPY.export.error` ✓
- [x] `COPY.export.restartConfirm.*` ✓
- [x] `COPY.export.title` ✓
- [x] `COPY.export.subtitle` ✓

### File Structure Verification
- [x] All editor components exist (9 files)
- [x] All export components exist (4 files)
- [x] No missing files

---

## 🧪 Manual Testing Required

### Prerequisites
```bash
npm install
npm run dev
```

Access at: `https://localhost:5173` (requires HTTPS for camera)

---

### Test Suite 1: Layout Selection

**Test 1.1: Display Layouts**
- [ ] All 3 layouts are displayed (2x2, 1x4, 3x3)
- [ ] Each layout shows preview (or placeholder grid)
- [ ] Layout names are in English
- [ ] Hover effects work

**Test 1.2: Selection**
- [ ] Click on a layout highlights it
- [ ] Auto-advances to camera step (~300ms delay)
- [ ] Layout selection is stored (check Redux DevTools)
- [ ] maxPhotos is set correctly (4 for 2x2, 9 for 3x3, etc.)

---

### Test Suite 2: Camera Capture

**Test 2.1: Camera Initialization**
- [ ] "Start Camera" button appears
- [ ] Camera permission prompt appears on click
- [ ] Video stream displays after permission granted
- [ ] Error message shows if permission denied

**Test 2.2: Photo Capture**
- [ ] "Capture" button is visible
- [ ] Countdown displays (3, 2, 1) before capture
- [ ] White flash effect plays on capture
- [ ] Photo appears in grid after capture
- [ ] Photo counter updates (e.g., "1/4", "2/4")

**Test 2.3: Photo Grid**
- [ ] Grid matches selected layout (e.g., 2x2 shows 2 rows, 2 cols)
- [ ] Photos display in correct order
- [ ] Each photo shows its number
- [ ] Hover over photo shows "Retake" button

**Test 2.4: Retake Functionality**
- [ ] Click "Retake" on a photo
- [ ] Countdown plays again
- [ ] New photo replaces old photo in same position
- [ ] Photo counter doesn't change

**Test 2.5: Auto-advance**
- [ ] After capturing all photos (e.g., 4/4), auto-advances to editor
- [ ] Delay is ~1.5 seconds
- [ ] All photos are preserved in editor

---

### Test Suite 3: Photo Editor

**Test 3.1: Filter Panel**
- [ ] "Filters" tab is active by default
- [ ] 8 filters are displayed with previews
- [ ] Filter names: Original, Black & White, Vintage, Vivid, Cool Tone, Warm Tone, Faded, Dramatic
- [ ] Click on filter applies it instantly to photo grid
- [ ] Selected filter is highlighted
- [ ] Preview uses first captured photo

**Test 3.2: Sticker Panel**
- [ ] Click "Stickers" tab switches panel
- [ ] Category tabs display (All, Emotions, Symbols, Objects)
- [ ] 20 emoji stickers are displayed
- [ ] Click category filters stickers
- [ ] Click sticker adds it to canvas center
- [ ] Sticker appears on top of photos

**Test 3.3: Sticker Interaction**
- [ ] Click on sticker selects it (blue ring appears)
- [ ] Drag sticker to move it
- [ ] Control buttons appear above selected sticker
- [ ] "Rotate" button rotates sticker by 45°
- [ ] "+" button scales up sticker
- [ ] "-" button scales down sticker
- [ ] "Delete" button (trash icon) removes sticker
- [ ] Click outside sticker deselects it

**Test 3.4: Frame Panel**
- [ ] Click "Frames" tab switches panel
- [ ] 7 frame options are displayed
- [ ] Frame names: No Frame, Classic White, Classic Black, Rounded, Film Strip, Neon Glow, Torn Edge
- [ ] Click frame applies it to entire composition
- [ ] Selected frame is highlighted
- [ ] Preview shows frame effect

**Test 3.5: Editor Canvas**
- [ ] Photos display in correct layout grid
- [ ] Filter is applied to all photos
- [ ] Stickers render on top of photos
- [ ] Frame wraps around entire composition
- [ ] Canvas is responsive

---

### Test Suite 4: Export & Share

**Test 4.1: Image Composition**
- [ ] Loading screen displays ("Creating your masterpiece...")
- [ ] Composition completes (usually < 2 seconds)
- [ ] Final image displays correctly
- [ ] All photos are in correct positions
- [ ] Filter is applied to final image
- [ ] Stickers are rendered with correct position/scale/rotation
- [ ] Frame is applied

**Test 4.2: File Information**
- [ ] File size is displayed (e.g., "1.2 MB")
- [ ] Preview shows exact image that will be downloaded

**Test 4.3: Download**
- [ ] "Download" button is visible
- [ ] Click download triggers file download
- [ ] Filename format: `dodopic-YYYY-MM-DDTHH-MM-SS.jpg`
- [ ] Downloaded image matches preview
- [ ] Image quality is good (800x1200px per photo)

**Test 4.4: Share (Mobile/Supported Browsers)**
- [ ] "Share" button appears if Web Share API is supported
- [ ] Click "Share" opens native share sheet
- [ ] Can share to social media apps
- [ ] Shared image matches downloaded image

**Test 4.5: Copy to Clipboard (Supported Browsers)**
- [ ] "Copy to Clipboard" button appears if supported
- [ ] Click "Copy" copies image to clipboard
- [ ] Button text changes to "Copied!" briefly
- [ ] Can paste image into other apps

**Test 4.6: Restart**
- [ ] "Start Over" button is visible
- [ ] Click "Start Over" shows confirmation modal
- [ ] Modal has title "Start Over?"
- [ ] Modal has message warning about clearing data
- [ ] "Cancel" button closes modal, no changes
- [ ] "Yes, Start Over" clears all data and returns to layout selection

---

### Test Suite 5: Workflow & Navigation

**Test 5.1: Step Indicator**
- [ ] Step indicator displays 4 steps: Layout, Capture, Edit, Export
- [ ] Current step is highlighted with blue color
- [ ] Completed steps show checkmark icon
- [ ] Indicator is sticky at top of page

**Test 5.2: Navigation Bar**
- [ ] Navigation bar is fixed at bottom
- [ ] "Previous" button works (except on Layout step)
- [ ] "Next" button works when step is complete
- [ ] "Next" button is disabled when step is incomplete
- [ ] "Restart" button shows confirmation modal
- [ ] Navigation has glass morphism effect

**Test 5.3: Page Transitions**
- [ ] Transitions are smooth (Framer Motion)
- [ ] Slide animation when changing steps
- [ ] No flickering or layout shift
- [ ] Animation duration is ~300ms

**Test 5.4: Workflow Validation**
- [ ] Cannot proceed to Camera without selecting layout
- [ ] Cannot proceed to Editor without capturing all photos
- [ ] Can always proceed from Editor to Export
- [ ] Can go back to any previous step

---

## 🌐 Cross-Browser Testing

### Desktop Browsers
- [ ] **Chrome** (latest): All features work
- [ ] **Safari** (latest): All features work
- [ ] **Firefox** (latest): All features work
- [ ] **Edge** (latest): All features work

### Mobile Browsers
- [ ] **iOS Safari**: Camera, download, share all work
- [ ] **Chrome Mobile (Android)**: Camera, download, share all work
- [ ] **Samsung Internet**: Camera, download, share all work

### Known Limitations
- [ ] Camera requires HTTPS or localhost
- [ ] Web Share API may not be supported on all browsers (show fallback)
- [ ] Clipboard API may not be supported on all browsers (hide button)

---

## 📱 Responsive Design Testing

### Desktop (> 1024px)
- [ ] Two-column layout (canvas + toolbar) in editor
- [ ] Comfortable spacing
- [ ] Large preview images

### Tablet (768px - 1024px)
- [ ] Single column layout in editor
- [ ] Readable text sizes
- [ ] Touch-friendly buttons

### Mobile (< 768px)
- [ ] Full-screen camera view
- [ ] Vertical layout selector
- [ ] Bottom sheet modals
- [ ] Large touch targets (min 44x44px)
- [ ] Readable font sizes

---

## ⚡ Performance Testing

### Image Processing
- [ ] Capture is fast (< 100ms)
- [ ] Filter application is instant (< 50ms)
- [ ] Sticker drag is smooth (60fps)
- [ ] Image composition completes in < 3 seconds

### Loading Times
- [ ] Initial page load < 2 seconds
- [ ] Step transitions < 300ms
- [ ] No long tasks blocking UI

### Memory Usage
- [ ] No memory leaks when restarting
- [ ] Photos are properly cleaned up
- [ ] Canvas is released after composition

---

## 🐛 Edge Cases & Error Handling

### Camera Errors
- [ ] Permission denied: Show helpful error message
- [ ] No camera found: Show error with troubleshooting steps
- [ ] Camera in use: Show error and suggest closing other apps

### Composition Errors
- [ ] Image too large: Handle gracefully
- [ ] Invalid photo data: Show error message
- [ ] Canvas error: Retry or show error

### Network Issues
- [ ] Works offline (no network requests needed)
- [ ] Assets load from local files

---

## 🎨 UI/UX Polish

### Visual Design
- [ ] macOS/iOS design language is consistent
- [ ] Colors match design system (iOS blue, grays)
- [ ] Shadows are subtle (macos shadow)
- [ ] Rounded corners everywhere (rounded-xl, rounded-2xl)
- [ ] Glass morphism effects on navigation and modals

### Typography
- [ ] Font is system-ui (SF Pro on macOS/iOS)
- [ ] Text sizes are readable
- [ ] Font weights are appropriate (medium for labels, bold for headings)

### Interactions
- [ ] Hover effects are smooth
- [ ] Click feedback on buttons (scale: 0.95)
- [ ] Loading states are clear
- [ ] Success/error messages are visible

### Accessibility
- [ ] All buttons have visible labels
- [ ] Color contrast is sufficient
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (aria labels)

---

## 📊 Testing Summary

**Total Tests**: 100+
**Categories**: 9
- Static Code Analysis: ✅ PASSED
- Layout Selection: ⏳ Manual testing required
- Camera Capture: ⏳ Manual testing required
- Photo Editor: ⏳ Manual testing required
- Export & Share: ⏳ Manual testing required
- Workflow & Navigation: ⏳ Manual testing required
- Cross-Browser: ⏳ Manual testing required
- Responsive Design: ⏳ Manual testing required
- Performance: ⏳ Manual testing required

---

## 🚀 Next Steps

1. **Run `npm install` and `npm run dev`**
2. **Test in Chrome first** (best developer tools)
3. **Use Redux DevTools** to monitor Zustand stores
4. **Test camera on HTTPS** (deploy to Vercel for quick test)
5. **Test on real mobile devices** (not just browser DevTools)
6. **Fix any bugs found**
7. **Deploy to production** (Vercel/Netlify)

---

**Generated**: 2026-01-12
**Version**: 2.0.0-beta
**Status**: Ready for manual testing
