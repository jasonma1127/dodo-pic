# DodoPic 📸

**A modern, browser-based photo booth application**

Create instant photo collages with filters and frames—all in your browser. No backend required, photos stay on your device.

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.0-FF6B6B)](https://zustand-demo.pmnd.rs/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Features

- **3 Photo Layouts**: Classic 2x2 grid, vertical strip (1x4), and 3x3 grid
- **Webcam Capture**: Take multiple photos with countdown timer
- **Retake Functionality**: Replace individual photos without starting over
- **Creative Filters**: Black & White, Vintage, Vivid, Cool/Warm tones
- **Decorative Frames**: PNG overlays with layout-specific designs
- **Instant Export**: Download high-resolution JPEG or share your creation
- **Modern UI**: macOS/iOS-inspired design with smooth animations
- **100% Client-Side**: No server needed, photos never leave your device

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern browser with webcam support (Chrome, Safari, Firefox)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dodopic.git
cd dodopic

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Important**: Webcam access requires HTTPS or localhost.

---

## 📖 How It Works

DodoPic follows a simple 4-step workflow:

```
1. Choose Layout → 2. Capture Photos → 3. Edit & Decorate → 4. Download/Share
```

### 1. Choose Your Layout
Select from 3 photo layouts (2x2, 1x4, 3x3). Each layout determines how many photos you'll capture.

### 2. Capture Photos
- Click "Start Camera" to enable your webcam
- Follow the 3-second countdown
- Photos are captured automatically based on your layout
- Use "Retake" to replace any photo

### 3. Edit & Decorate
- **Filters**: Apply one of 8 preset filters to all photos
- **Frames**: Choose a decorative PNG overlay (layout-specific designs)

### 4. Export
- Preview your final creation
- Download as high-resolution JPEG
- Share via Web Share API (mobile) or clipboard (desktop)
- Start over to create another!

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite 6** | Build Tool |
| **Zustand 5** | State Management |
| **Tailwind CSS 3** | Styling |
| **react-webcam** | Camera Access |
| **Framer Motion** | Animations |
| **Canvas API** | Image Processing |
| **lucide-react** | Icons |

**Why Zustand?** 95% smaller than Redux (2KB vs 40KB), no boilerplate, built-in DevTools support.

See [SPEC.md](./SPEC.md) for detailed technical specifications.

---

## 📁 Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── layout/        # Layout selection
│   ├── camera/        # Photo capture
│   ├── editor/        # Filters & frames
│   ├── export/        # Download & share
│   └── workflow/      # Step progression
├── store/             # Zustand state management
├── shared/            # Reusable components, utils, copy
├── App.jsx            # Main application
└── main.jsx           # Entry point
```

---

## 🎨 Technical Specifications

### Photo Specifications
- **Aspect Ratio**: 4:3 landscape
- **Cell Dimensions**: 1920×1440 pixels
- **Cell Gap**: 64 pixels between photos

### Layout Dimensions
- **2x2**: 4168 × 4120 pixels (4 photos)
- **1x4**: 2040 × 7480 pixels (4 photos)
- **3x3**: 6088 × 6880 pixels (9 photos)

### Frame Parameters (Layout-Specific)
Each layout uses different frame borders for visual balance:

| Layout | Cell Gap | Side Border | Top Border | Bottom Border |
|--------|----------|-------------|------------|---------------|
| 2x2    | 64px     | 60px        | 1000px     | 120px         |
| 1x4    | 64px     | 60px        | 120px      | 1000px        |
| 3x3    | 64px     | 60px        | 1200px     | 1200px        |

Frame generation uses `frame-generator.html` (external tool).

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Browser DevTools

Zustand integrates with Redux DevTools for state debugging:
1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open browser DevTools → "Redux" tab
3. Inspect state changes in real-time

---

## 🚢 Deployment

DodoPic is a static site and can be deployed to any hosting platform:

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag & drop `dist/` folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Deploy `dist/` folder to gh-pages branch
```

**Note**: Ensure hosting supports HTTPS for webcam access.

---

## 📚 Documentation

- **[SPEC.md](./SPEC.md)**: Complete Software Design Specification
  - System architecture
  - Feature specifications
  - API documentation
  - UI/UX guidelines
  - Testing strategy

---

## 🐛 Troubleshooting

### Camera Not Working
- **Check permissions**: Browser needs camera access
- **Use HTTPS**: Webcam API requires secure context
- **Check browser support**: Chrome 53+, Safari 11+, Firefox 36+

### Low Image Quality
- Check `canvas.toDataURL()` quality parameter in `export/utils/imageComposite.js`
- Default is `0.95` (high quality JPEG)
- All photos use fixed dimensions (1920×1440 per cell)

### Share Not Working
- **Web Share API** is only available on:
  - Mobile browsers (iOS Safari 12.2+, Chrome Mobile 61+)
  - Desktop Chrome 89+ (limited support)
- Fallback: Clipboard API or download prompt

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Code Style**: All code (including comments) must be in English
2. **Naming**: Use descriptive, English names for variables, functions, and files
3. **Documentation**: Update SPEC.md if changing architecture
4. **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) format

```bash
# Example commit messages
feat: Add new filter preset
fix: Resolve camera permission error on Safari
docs: Update frame specifications in SPEC.md
```

---

## 📝 Version History

### Current Version: 2.2.0
- ✅ 3 photo layouts (2x2, 1x4, 3x3)
- ✅ 4:3 landscape photo format (1920×1440px)
- ✅ Webcam capture with countdown
- ✅ Retake individual photos
- ✅ 8 filter presets
- ✅ Layout-specific frame parameters
- ✅ PNG frame overlays
- ✅ High-resolution JPEG export
- ✅ Download & share

See [SPEC.md - Appendix B](./SPEC.md#appendix-b-changelog) for complete changelog.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- [react-webcam](https://github.com/mozmorris/react-webcam) for reliable webcam access
- [Zustand](https://github.com/pmndrs/zustand) for simple state management
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for rapid styling

---

**Built with ❤️ using modern web technologies**
