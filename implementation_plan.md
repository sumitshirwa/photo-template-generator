# Photo Template Generator - Implementation Plan

A premium, futuristic web app for uploading images, placing them inside predefined template frames, adjusting position/scale/rotation, and exporting the final composite. Built with React + Vite, Tailwind CSS, and Fabric.js. No backend required.

## Proposed Changes

### Project Scaffold

#### [NEW] Project root (`e:\Projects\navodya`)
- Initialize with `npx -y create-vite@latest ./ -- --template react`
- Install deps: `tailwindcss`, `@tailwindcss/vite`, `fabric` (v6+)
- Configure Tailwind via Vite plugin

---

### Global Styles & Design System

#### [NEW] [index.css](file:///e:/Projects/navodya/src/index.css)
- CSS custom properties for dark luxury palette, gradients, glassmorphism tokens
- Animated background aurora/blob keyframes
- Glassmorphism card, button, and panel utility classes
- Micro-interaction keyframes (fade-in, hover-lift, shine overlay, float)
- Responsive breakpoints

---

### Animated Background

#### [NEW] [AnimatedBackground.jsx](file:///e:/Projects/navodya/src/components/AnimatedBackground.jsx)
- Floating gradient blobs with CSS animations
- Aurora light effect layer
- Subtle particle/glow overlay

---

### Reusable UI Components

#### [NEW] [GlassCard.jsx](file:///e:/Projects/navodya/src/components/ui/GlassCard.jsx)
- Backdrop-blur frosted glass container with configurable props

#### [NEW] [GradientButton.jsx](file:///e:/Projects/navodya/src/components/ui/GradientButton.jsx)
- Gradient button with hover glow, lift animation, optional icon

#### [NEW] [Slider.jsx](file:///e:/Projects/navodya/src/components/ui/Slider.jsx)
- Styled range slider for zoom/rotate controls

---

### Layout Components

#### [NEW] [Navbar.jsx](file:///e:/Projects/navodya/src/components/Navbar.jsx)
- App logo (SVG camera/frame icon) + title "Photo Template Generator"
- Glassmorphism bar fixed at top

#### [NEW] [Footer.jsx](file:///e:/Projects/navodya/src/components/Footer.jsx)
- Minimal professional footer with credits

---

### Template System

#### [NEW] [TemplateSidebar.jsx](file:///e:/Projects/navodya/src/components/TemplateSidebar.jsx)
- Horizontal scrollable gallery on mobile, vertical sidebar on desktop
- Thumbnail cards for each template with active highlight
- onClick selects template and passes to canvas

#### [NEW] [templates.js](file:///e:/Projects/navodya/src/data/templates.js)
- Array of template metadata (id, name, thumbnail, frameSrc, dimensions)
- Templates are transparent PNG frames stored in `public/templates/`

#### [NEW] Template PNGs (`public/templates/`)
- 6 programmatically generated SVG-based transparent frame images (converted to PNG via canvas at build or at runtime)
- Frames: Polaroid, Circle, Vintage, Modern, Filmstrip, Elegant

---

### Core Canvas Editor

#### [NEW] [CanvasEditor.jsx](file:///e:/Projects/navodya/src/components/CanvasEditor.jsx)
- Fabric.js canvas initialization in `useEffect`
- **User image layer**: `fabric.Image` — draggable, scalable, rotatable
- **Template frame layer**: `fabric.Image` — locked (`selectable: false, evented: false`), rendered on top
- Handles template switching (removes old frame, adds new)
- Exposes methods via `useImperativeHandle` or context: `exportImage()`, `resetCanvas()`, `setZoom()`, `setRotation()`
- Responsive canvas sizing based on container

#### [NEW] [useCanvas.js](file:///e:/Projects/navodya/src/hooks/useCanvas.js)
- Custom hook encapsulating Fabric.js canvas lifecycle
- Manages canvas instance, user image object, template object refs
- Functions: `addUserImage(file)`, `setTemplate(templateSrc)`, `zoom(delta)`, `rotate(angle)`, `exportAsDataURL(format)`, `reset()`
- Keeps template always on top via `canvas.bringToFront(templateObj)`

---

### Control Panel

#### [NEW] [ControlPanel.jsx](file:///e:/Projects/navodya/src/components/ControlPanel.jsx)
- Zoom slider (calls `zoom()`)
- Rotate slider (calls `rotate()`)
- Reset button (calls `reset()`)
- Download button — triggers `exportAsDataURL('png')` → download via anchor
- Share button — uses `navigator.share()` with fallback to clipboard copy
- Format toggle (PNG / JPG)

---

### Image Upload

#### [NEW] [ImageUploader.jsx](file:///e:/Projects/navodya/src/components/ImageUploader.jsx)
- Drag-and-drop zone + file input button
- Accepts image/* files
- Reads file via `FileReader` → passes data URL to canvas hook
- Glassmorphism styled overlay/modal

---

### App Entry

#### [NEW] [App.jsx](file:///e:/Projects/navodya/src/App.jsx)
- Composes: `AnimatedBackground` + `Navbar` + `TemplateSidebar` + `CanvasEditor` + `ControlPanel` + `ImageUploader` + `Footer`
- State management via `useState`/`useRef` (no external state lib needed)
- Responsive grid layout

#### [MODIFY] [main.jsx](file:///e:/Projects/navodya/src/main.jsx)
- Standard React entry, imports `index.css`

---

## Verification Plan

### Automated Tests
- `npm run build` — must complete with zero errors/warnings

### Browser Verification (using browser tool)
1. Open `http://localhost:5173` and verify the app loads with animated background
2. Upload an image → verify it appears on canvas
3. Select different templates → verify frame changes
4. Drag/zoom/rotate the image → verify controls work
5. Click download → verify file downloads
6. Click reset → verify canvas clears
7. Resize browser → verify responsive layout

### Manual Verification
- User can visually confirm premium glassmorphism design
- User can test Web Share API on supported browsers/devices
