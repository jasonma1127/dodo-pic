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
- **Creative Filters**: 8 preset filters (B&W, Vintage, Vivid, Cool/Warm tones, etc.)
- **Decorative Frames**: PNG overlays with layout-specific designs
- **Instant Export**: Download high-resolution JPEG or share via Web Share API
- **Modern UI**: macOS/iOS-inspired design with smooth animations
- **100% Client-Side**: No server needed, photos never leave your device

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/dodopic.git
cd dodopic
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Note**: Webcam requires HTTPS or localhost.

---

## 📖 How It Works

Simple 4-step workflow:

```
1. Choose Layout → 2. Capture Photos → 3. Apply Filters & Frames → 4. Download/Share
```

1. **Choose Layout**: Select 2x2, 1x4, or 3x3 grid
2. **Capture Photos**: Use your webcam with countdown timer, retake any photo
3. **Edit**: Apply filters and choose frame overlay
4. **Export**: Download or share your creation

---

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite 6** - Build tool and dev server
- **Zustand 5** - Lightweight state management (2KB)
- **Tailwind CSS 3** - Utility-first styling
- **Framer Motion** - Smooth animations
- **react-webcam** - Camera access
- **Canvas API** - Image processing and composition
- **lucide-react** - Icon library

---

## 🎨 Photo Specifications

- **Photo Size**: 1920×1440 pixels (4:3 landscape)
- **Cell Gap**: 64 pixels between photos
- **Output Formats**: High-resolution JPEG

**Layout Dimensions:**
- 2x2: 4168 × 4120 pixels (4 photos)
- 1x4: 2040 × 7480 pixels (4 photos)
- 3x3: 6088 × 6880 pixels (9 photos)

---

## 📚 Documentation

- **[SPEC.md](./SPEC.md)** - Complete technical specification
  - System architecture
  - Feature specifications
  - API documentation
  - Frame generation guide
  - Development guidelines

---

## 🚢 Deployment

Build for production:

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

**Important**: Ensure HTTPS for webcam access.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Built with ❤️ using modern web technologies**
