# DodoPic Setup Instructions

## Step 1: Install Dependencies

Run the following command in your terminal:

```bash
npm install
```

This will install all the required dependencies listed in `package.json`:

**Dependencies:**
- `zustand@^5.0.0` - State management
- `framer-motion@^11.0.0` - Animations
- `lucide-react@^0.400.0` - Icons
- `react@^19.0.0` - UI framework
- `react-dom@^19.0.0` - React DOM
- `react-webcam@^7.2.0` - Webcam access

**DevDependencies:**
- `tailwindcss@^3.4.0` - CSS framework
- `postcss@^8.4.0` - CSS processing
- `autoprefixer@^10.4.0` - CSS vendor prefixes
- `vite@^6.2.0` - Build tool
- ESLint and plugins

## Step 2: Verify Configuration Files

The following configuration files have been created:

- ✅ `tailwind.config.js` - Tailwind CSS with macOS/iOS design system
- ✅ `postcss.config.js` - PostCSS configuration
- ✅ `src/index.css` - Global styles with Tailwind directives

## Step 3: Start Development Server

After installing dependencies, start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Note:** Webcam access requires HTTPS or localhost.

## Step 4: Verify Setup

1. Open browser to `http://localhost:5173`
2. Check browser console for any errors
3. Verify Tailwind CSS is working (inspect elements for utility classes)

## Troubleshooting

### Tailwind CSS not working
- Ensure `src/index.css` is imported in `src/main.jsx`
- Check that `tailwind.config.js` content paths are correct
- Clear Vite cache: `rm -rf node_modules/.vite`

### Webcam not working
- Use HTTPS or localhost (HTTP is not allowed for webcam access)
- Check browser permissions
- Verify `react-webcam` is installed

## Next Steps

After setup is complete, refer to [SPEC.md](./SPEC.md) for:
- Project structure
- Feature specifications
- Development guidelines
