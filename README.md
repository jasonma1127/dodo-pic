# DodoPic 📸

**A modern, browser-based photo booth application**

Create instant photo collages with filters, stickers, and frames—all in your browser. No backend required, photos stay on your device.

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.0-FF6B6B)](https://zustand-demo.pmnd.rs/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Features

- **3 Photo Layouts**: Classic 2x2, vertical strip, and 3x3 grid
- **Webcam Capture**: Take multiple photos with countdown timer
- **Retake Functionality**: Replace individual photos without starting over
- **Creative Filters**: Black & White, Vintage, Vivid, Cool/Warm tones
- **Sticker Decorations**: Drag, scale, and rotate fun stickers
- **Decorative Frames**: Add stylish borders to your collage
- **Instant Export**: Download or share your creation
- **Modern UI**: macOS/iOS-inspired design with smooth animations
- **100% Client-Side**: No server needed, photos never leave your device

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Modern browser with webcam support (Chrome, Safari, Firefox)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dodopic.git

# Navigate to project directory
cd dodopic

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Important**: Webcam access requires HTTPS or localhost. Use `https://localhost:5173` or deploy to a secure host.

---

## 📖 How It Works

DodoPic follows a simple 4-step workflow:

```
1. Choose Layout → 2. Capture Photos → 3. Edit & Decorate → 4. Download/Share
```

### Step 1: Choose Your Layout
Select from 3 photo layouts (2x2, 1x4, 3x3). Each layout determines how many photos you'll capture.

### Step 2: Capture Photos
- Click "Start Camera" to enable your webcam
- Follow the 3-second countdown
- Photos are captured automatically based on your layout
- Use "Retake" to replace any photo

### Step 3: Edit & Decorate
- **Filters**: Apply one of 6 preset filters to all photos
- **Stickers**: Add, drag, resize, and rotate fun decorations
- **Frames**: Choose a decorative border for the final image

### Step 4: Export
- Preview your final creation
- Download as PNG (1200x1800px+)
- Share via Web Share API (mobile) or clipboard (desktop)
- Start over to create another!

---

## 🛠️ Tech Stack

| Technology | Purpose | Why? |
|------------|---------|------|
| **React 19** | UI Framework | Latest stable, excellent performance |
| **Vite 6** | Build Tool | Fast HMR, optimized builds |
| **Zustand 5** | State Management | Lightweight (2KB), simple API, no boilerplate |
| **Tailwind CSS 3** | Styling | Rapid development, consistent design system |
| **react-webcam** | Camera Access | Reliable WebRTC wrapper |
| **Framer Motion** | Animations | Declarative, spring-based physics |
| **Canvas API** | Image Processing | Native browser API for compositing |
| **lucide-react** | Icons | Modern, tree-shakeable icon library |

**Why Zustand over Redux?**
- 95% smaller bundle (2KB vs 40KB)
- No boilerplate code
- Built-in DevTools support
- Perfect for this project's state needs

See [SPEC.md](./SPEC.md) for detailed technical decisions.

---

## 📁 Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── layout/        # Layout selection
│   ├── camera/        # Photo capture
│   ├── editor/        # Filters, stickers, frames
│   ├── export/        # Download & share
│   └── workflow/      # Step progression
├── store/             # Zustand state management
├── shared/            # Reusable components, utils, copy
├── App.jsx            # Main application
└── main.jsx           # Entry point
```

**Key Architectural Decisions**:
- **Feature-based organization**: Each feature has its own components, hooks, and utils
- **Zustand stores**: Separate stores for photos, layout, editor, and workflow
- **Centralized copy**: All UI text in `shared/copy/en.js` for easy localization
- **Canvas-based rendering**: Efficient image processing and export

See [SPEC.md](./SPEC.md) for complete file structure and naming conventions.

---

## 🎨 Design System

DodoPic uses a macOS/iOS-inspired design language:

- **Colors**: iOS system colors (blue, indigo, pink, etc.)
- **Typography**: SF Pro Display / Inter fallback
- **Shadows**: Subtle, layered macOS-style shadows
- **Blur**: Backdrop blur for overlays and modals
- **Animations**: Spring-based, natural motion
- **Responsiveness**: Mobile-first, adaptive layouts

**Responsive Breakpoints**:
- Mobile: < 768px (full-screen, bottom navigation)
- Tablet: 768px - 1024px (split views)
- Desktop: > 1024px (multi-column layouts)

---

## 📚 Documentation

- **[SPEC.md](./SPEC.md)**: Complete Software Design Specification
  - System architecture
  - Feature specifications
  - API documentation
  - UI/UX guidelines
  - Testing strategy

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

# Format code (if configured)
npm run format
```

### Browser DevTools

Zustand integrates with Redux DevTools for state debugging:
1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open browser DevTools
3. Navigate to "Redux" tab
4. Inspect state changes in real-time

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

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Code Style**: All code (including comments) must be in English
2. **Naming**: Use descriptive, English names for variables, functions, and files
3. **Documentation**: Update SPEC.md if changing architecture
4. **Testing**: Add tests for new features
5. **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) format

```bash
# Example commit messages
feat: Add retake functionality for individual photos
fix: Resolve camera permission error on Safari
docs: Update API specifications in SPEC.md
```

---

## 📝 Roadmap

### Current Version: 2.0.0
- ✅ 3 photo layouts
- ✅ Webcam capture with countdown
- ✅ Retake individual photos
- ✅ 6 filter presets
- ✅ Sticker decorations
- ✅ Decorative frames
- ✅ Download & share

### Future (V3.0)
- [ ] Multi-language support (i18n)
- [ ] Custom text overlay
- [ ] AI-powered filters (beauty mode)
- [ ] Cloud storage (optional)
- [ ] Advanced editing (crop, brightness/contrast)
- [ ] GIF export
- [ ] PWA support (offline mode)

See [SPEC.md - Appendix A](./SPEC.md#appendix-a-future-enhancements-v2) for complete list.

---

## 🐛 Troubleshooting

### Camera Not Working
- **Check permissions**: Browser needs camera access
- **Use HTTPS**: Webcam API requires secure context
- **Check browser support**: Chrome 53+, Safari 11+, Firefox 36+

### Low Image Quality
- Check `canvas.toDataURL()` quality parameter in `export/utils/imageComposite.js`
- Default is `1.0` (highest quality PNG)

### Share Not Working
- **Web Share API** is only available on:
  - Mobile browsers (iOS Safari 12.2+, Chrome Mobile 61+)
  - Desktop Chrome 89+ (limited support)
- Fallback: Clipboard API or download prompt

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

## 📧 Contact

Questions? Suggestions? Open an issue or reach out!

**Built with ❤️ using modern web technologies**
