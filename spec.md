## **Product Overview: AirDraw - Gesture-Controlled Drawing Studio**

### **Core Concept**
A web-based drawing application where users draw in the air using hand gestures captured by their webcam. The system tracks hand movements in real-time and translates them into digital strokes on a canvas, with AI-powered shape refinement capabilities in future iterations.

---

## **MVP Features (Phase 1)**

### **1. Gesture Recognition & Drawing**
- **Primary Gesture**: Index finger extended = drawing cursor
- **Drawing Activation**: Pinch gesture (thumb + index finger together) = start/stop drawing
- **Hand Tracking**: Real-time hand landmark detection using MediaPipe or TensorFlow.js
- **Smooth Drawing**: Interpolation between points for fluid lines
- **Z-depth Control**: Hand distance from camera could control brush opacity (closer = more opaque)

### **2. Canvas Area (Left Panel - 75-80% width)**
- **Clean White Canvas**: Minimalist design to focus on artwork
- **Grid Overlay Toggle**: Optional grid for precision drawing
- **Zoom Controls**: Pinch gesture with two hands or button controls
- **Pan Capability**: Two-finger drag gesture or pan mode
- **Undo/Redo**: Gesture-based (closed fist = undo) or button-based
- **Mini Video Preview**: Small floating window showing camera feed with hand tracking visualization (skeleton overlay showing tracked points)

### **3. Settings Panel (Right Panel - 20-25% width)**

**Tool Selection:**
- Pen/Brush tool
- Eraser tool
- Line tool (straight lines)
- Shape tools (circle, rectangle, triangle)
- Fill bucket (for closed shapes)

**Color Palette:**
- Primary color picker with color wheel
- Quick access swatches (12-16 preset colors)
- Recent colors history (last 5-6 used)
- Custom RGB/HEX input
- Color eyedropper tool

**Brush Settings:**
- Stroke width slider (1-50px)
- Opacity slider (0-100%)
- Brush style: solid, dashed, dotted
- Smoothing level (for shaky hand compensation)

**Canvas Controls:**
- Clear canvas button (with confirmation)
- Background color selector
- Canvas size preset options
- Export options (PNG, JPG, SVG)
- Save/Load functionality

---

## **Design System & Aesthetics**

### **Color Scheme**
**Primary Theme: Modern Dark with Vibrant Accents**

- **Background Colors:**
  - Canvas: Pure white (#FFFFFF) or light cream (#FEFEF8)
  - Settings Panel: Deep charcoal (#1E1E1E) or slate (#2D3748)
  - Hover states: Lighter gray (#3A3A3A)

- **Accent Colors:**
  - Primary action: Electric blue (#3B82F6) - for active tools
  - Success: Emerald green (#10B981) - for saves, confirmations
  - Destructive: Coral red (#EF4444) - for delete, clear actions
  - Warning: Amber (#F59E0B) - for alerts

- **Text Colors:**
  - Primary text: Pure white (#FFFFFF) on dark backgrounds
  - Secondary text: Light gray (#9CA3AF)
  - Canvas text: Dark gray (#1F2937)

### **Typography**
- **Headings**: Inter or Poppins (modern, clean sans-serif)
- **Body/UI Text**: System font stack for performance
- **Size Hierarchy**:
  - Panel title: 20-24px, semi-bold
  - Section headers: 14-16px, medium
  - Labels: 12-14px, regular

### **UI/UX Design Principles**

**Settings Panel Layout:**
- Collapsible sections with smooth animations
- Icon-first design (icons with labels)
- Tooltips on hover for all tools
- Visual feedback for active states (glow, border highlight)
- Compact but not cramped (generous padding)

**Canvas Interactions:**
- Crosshair cursor following hand position
- Drawing trail preview (faint line showing recent path)
- Real-time gesture status indicator (top-right corner)
  - Green dot: Hand detected
  - Red dot: Drawing active
  - Gray dot: No hand detected
- Confidence meter showing tracking quality

**Responsive Behavior:**
- Panel can collapse to icon-only mode for maximum canvas space
- Floating toolbar option for quick access
- Keyboard shortcuts for power users

---

## **Extra MVP Features (Nice-to-Have)**

### **1. Gesture Commands**
- **Open Palm (5 seconds)**: Pause tracking
- **Fist**: Undo last stroke
- **Peace Sign**: Switch to eraser
- **Thumbs Up**: Save current work
- **Two Hands Spread**: Clear canvas

### **2. Layers System (Simple)**
- 2-3 layers max for MVP
- Layer visibility toggle
- Basic layer ordering
- Merge layers option

### **3. Performance & Feedback**
- FPS counter (debug mode)
- Latency indicator
- Gesture confidence visualization
- Tutorial overlay on first use

### **4. Social Features**
- Quick share link generation
- Time-lapse recording of drawing session
- Gallery of saved drawings
- Export drawing as animated GIF

### **5. Calibration & Settings**
- Hand size calibration
- Sensitivity adjustment
- Left/right hand mode
- Mirror video feed toggle
- Custom gesture mapping

---

## **Future AI Integration (Phase 2)**

### **Smart Shape Recognition**
**Feature: "AI Shape Refine"**
- User draws rough shapes (circle, square, house, etc.)
- AI detects intent and suggests refined version
- User can accept, reject, or partially adopt refinement
- Machine learning model trained on common shapes and objects

**Implementation Ideas:**
- **Shape Detection**: CNN model recognizes drawn shapes
- **Vectorization**: Convert raster strokes to clean vector paths
- **Style Transfer**: Apply artistic styles to drawings
- **Object Recognition**: Identify what user is trying to draw

### **AI Enhancement Tools**

**1. Smart Complete**
- AI predicts and completes partial drawings
- Example: Draw half a circle, AI completes the perfect circle
- Works for common shapes: stars, arrows, speech bubbles

**2. Architecture Mode** (Your House Example)
- User draws rough house outline
- AI recognizes it as architecture
- Offers refined versions:
  - Perspective-corrected walls
  - Symmetrical windows/doors
  - Proper roof angles
  - Architectural style suggestions (modern, cottage, villa)
- User can iterate: "make windows bigger", "add chimney"

**3. Smart Beautify**
- One-click enhancement of entire drawing
- Cleans up wobbly lines
- Adjusts proportions
- Adds depth/shadows
- Color harmony suggestions

**4. AI Assistant Panel**
- Text prompt input: "Make this house more modern"
- Style suggestions based on drawing content
- Color palette generation from drawing
- Composition improvement suggestions

### **Technical Stack for AI Features**
- **TensorFlow.js**: On-device inference for real-time features
- **Cloud API**: Anthropic Claude API for complex refinements
- **Models Needed**:
  - Object detection (YOLO or similar)
  - Style transfer (CycleGAN)
  - Image-to-image translation (Pix2Pix)
  - Stable Diffusion for complex enhancements

---

## **User Flow Example**

1. **Launch App** → Welcome screen with tutorial
2. **Allow Camera** → Camera permission prompt
3. **Calibration** → Quick hand calibration (5 seconds)
4. **Start Drawing** → Hand tracking activates
5. **Draw in Air** → Gestures create strokes on canvas
6. **Adjust Settings** → Change colors, brush size on the fly
7. **AI Enhance** (Future) → Select area → "Make this better" → AI refines
8. **Export/Share** → Download or share link

---

## **Success Metrics for MVP**

- **Technical**: <100ms latency from gesture to stroke
- **Usability**: Users can draw recognizable shapes in <2 minutes
- **Accuracy**: >90% gesture recognition accuracy
- **Engagement**: Average session >5 minutes
- **Performance**: Runs smoothly on mid-range devices (30+ FPS)

---

## **Differentiation & Unique Value**

**Why this is exciting:**
1. **Touchless Drawing**: Hands-free, natural interaction
2. **Accessibility**: No stylus/tablet required
3. **AI Augmentation**: Not just capture, but improve drawings
4. **Educational**: Great for kids, presentations, teaching
5. **Fun Factor**: Novelty of drawing in air
6. **Portable**: Works anywhere with a camera