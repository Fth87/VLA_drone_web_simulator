# Drone VLA Simulator

Simulator drone 3D untuk autonomous flight control testing berbasis **TanStack Start**, **React Three Fiber**, dan **Three.js**. Integrasi VLA memungkinkan drone bergerak sesuai prompt.

**Key Features:**

- Full 3D simulator dengan multi-camera modes (FPV, 3rd person, fixed view)
- VLA inference integration untuk autonomous control
- Manual 4-axis control (vx, vy, vz, yaw) via sliders atau keyboard
- Live telemetry & payload preview
- Custom Roblox Studio maps support (.GLB format)

---

## Quick Start

```bash
# 1. Setup backend VLA API terlebih dahulu
git clone https://github.com/Fth87/VLA_drone_backend_web_simulator-.git
cd VLA_drone_backend_web_simulator-
# Ikuti instruksi lengkap di repo backend

# 2. Setup frontend (di folder project ini)
cp .env.example .env
# Edit .env, set 
VITE_VLA_API_URL=dapat-dari-repo-backend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

pnpm install
pnpm dev
# Buka http://localhost:3000
```

---

## Prerequisites

- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x ([install](https://pnpm.io/installation))
- **Backend running:** [VLA Drone Backend](https://github.com/Fth87/VLA_drone_backend_web_simulator-) 

---

## Setup Instructions

### Step 1: Backend VLA API Setup

Backend adalah **requirement** untuk simulator bekerja.

```bash
git clone https://github.com/Fth87/VLA_drone_backend_web_simulator-.git
cd VLA_drone_backend_web_simulator-
```

Follow instruksi di README backend untuk setup environment. 

### Step 2: Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Supabase (untuk auth)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# VLA API Backend
VITE_VLA_API_URL=http://localhost:8000
```


### Step 3: Frontend Installation & Run

```bash
pnpm install
pnpm dev
```

Frontend berjalan di `http://localhost:3000`

---

## Usage Guide

### Controls

| Key/Control | Action                     |
| ----------- | -------------------------- |
| `W` / `S`   | Move forward/backward (vz) |
| `Q` / `E`   | Move up/down (vy)          |
| `A` / `D`   | Rotate left/right (yaw)    |
| `←` / `→`   | Strafe left/right (vx)     |
| `1`         | FPV camera mode            |
| `3`         | 3rd person camera          |
| `4`         | Fixed corner view          |

### Manual Control

Use **Action Sliders** di Control Panel:

- Vx (lateral): -1 (left) to 1 (right)
- Vy (vertical): -1 (down) to 1 (up)
- Vz (forward): -1 (back) to 1 (forward)
- Yaw (rotation): -1 (ccw) to 1 (cw)

### VLA Inference

1. Type prompt di **Prompt** field (e.g., "go to red box")
2. Click **Start Inference**
3. Drone executes VLA model predictions
4. View telemetry di HUD
5. Download payload frame jika perlu

---

## Assets & Customization

### Arena Maps (Custom Roblox Studio)

Replace arena dengan custom map dari Roblox Studio.

#### Folder Structure

```
public/
├── drone model/
│   └── drone_model.glb     # Drone 3D model
└── maps/
    └── maps_roblox.glb     # Arena/environment
```

#### How to Replace Map

**1. Export dari Roblox Studio:**

- Select model/landscape di Studio
- Right-click → **Save to File As...** → Choose `.glb` format
- Simpan sebagai `your-map.glb`

**2. Add to Project:**

```bash
# Copy ke folder
cp your-map.glb public/maps/

# Update path di src/features/drone-sim/constants.ts
export const MAP_MODEL_URL = '/maps/your-map.glb'

# Adjust scale jika perlu
export const MAP_FOOTPRINT_SIZE = 128  # Default = 128 units
```

**3. Refresh browser**


### Drone Model (Custom)

Proses mirip dengan map:

```bash
# Export drone dari Roblox → save ke public/drone model/
cp your-drone.glb public/drone\ model/

# Update path
export const DRONE_MODEL_URL = '/drone%20model/your-drone.glb'  # %20 = space
```

---

## Configuration

Semua tunable parameters di `src/features/drone-sim/constants.ts`:

### Movement Response

```ts
export const ACTION_GAIN = {
  vx: 1.8, // Lateral speed (left/right)
  vy: 1.4, // Vertical speed (up/down)
  vz: 2.1, // Forward speed
  yaw: 0.9, // Rotation speed
}
```

Increase untuk lebih responsive, decrease untuk lebih smooth.

### Flight Boundaries

```ts
export const DRONE_BOUNDS = {
  x: 28, // Lateral limit
  yMin: 0.35, // Floor
  yMax: 12, // Ceiling
  z: 28, // Depth limit
}
```

### Map Size

```ts
export const MAP_FOOTPRINT_SIZE = 128 // Width/depth in units
```

Increase jika map terasa terlalu kecil, decrease jika terlalu besar.

### VLA Inference

```ts
export const VLA_REQUEST_TIMEOUT_MS = 10_000 // 10 seconds
export const VLA_INFERENCE_INTERVAL_MS = 100 // Loop interval
export const VLA_IMAGE_SIZE = 224 // Capture resolution
export const VLA_PROMPT_MAX_LENGTH = 160 // Max chars
```

### Scene

```ts
export const SCENE_BACKGROUND_COLOR = '#8ecdf7' // Sky color
export const SCENE_FOG_COLOR = '#b6def6' // Fog color
export const MAP_MODEL_URL = '/maps/maps_roblox.glb' // Map file
export const DRONE_MODEL_URL = '/drone%20model/drone_model.glb'
```

---

## VLA Integration

### API Specification

**Endpoint:** `POST /infer`

**Request (multipart/form-data):**

| Field         | Type          | Required | Description                  |
| ------------- | ------------- | -------- | ---------------------------- |
| `image_input` | Binary (JPEG) | ✅       | 224x224 FPV frame            |
| `task_input`  | String        | ✅       | Natural language prompt      |
| `state_input` | String        | ❌       | Optional drone state context |

**Response (JSON):**

```json
{
  "success": true,
  "first_action": [0.2, 0.1, 0.8, -0.3],
  "trajectory": [[...], [...]] or null,
  "inference_time_ms": 245,
  "error": null
}
```

`first_action` format: `[vx, vy, vz, yaw]` dengan range -1..1

---

## Features

### Core

**Fullscreen 3D Simulator**

- Real-time rendering dengan shadows
- Three.js + React Three Fiber

**Multi-Camera Modes**

- FPV (first-person)
- 3rd person follow
- Fixed corner view

**Control Systems**

- Keyboard: W/S/Q/E/A/D + arrows
- Action sliders untuk 4-axis
- VLA inference integration

**Live Telemetry HUD**

- Drone position (X, Y, Z)
- Heading (Yaw)
- Current action values
- Inference status

**VLA Model Integration**

- Natural language → drone commands
- Real-time inference loop
- Payload frame preview & download

**Custom Assets**

- Import Roblox Studio maps (.GLB)
- Custom drone models
- Auto-scaling & centering

### Advanced

- TanStack Start SSR ready
- Netlify deployment optimized
- Supabase auth integration
- Performance monitoring (metrics in HUD)

---

## Troubleshooting

### General

| Issue                    | Solution                                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| **"API unreachable"**    | Ensure backend running on `VITE_VLA_API_URL`. Test with `curl http://localhost:8000/health`        |
| **Drone not visible**    | Check `public/drone model/drone_model.glb` exists. Refresh browser (Ctrl+Shift+R)                  |
| **Map not loading**      | Verify path in `constants.ts`. Check file exists in `public/maps/`. Check browser console for 404s |
| **Keyboard not working** | Click canvas first to focus. Check console for errors                                              |

### Map/Drone Issues

| Issue                        | Solution                                                                   |
| ---------------------------- | -------------------------------------------------------------------------- |
| **Map ter-scale besar**      | Decrease `MAP_FOOTPRINT_SIZE` atau increase size di Roblox sebelum export  |
| **Map ter-scale kecil**      | Increase `MAP_FOOTPRINT_SIZE`                                              |
| **Drone crash ke ground**    | Increase `DRONE_BOUNDS.yMin` atau check model origin di Roblox             |
| **Map .glb file besar/slow** | Use `gltf-transform compress` atau remove details di Roblox sebelum export |

### Inference

| Issue                                 | Solution                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Inference tidak jalan**             | Pastikan prompt tidak kosong (min 1 char). Check status badge untuk error. Check backend response di network tab    |
| **Action set tapi drone tidak gerak** | Verify action values di HUD. Check sliders tidak disabled (grayed out). Ensure drone model Y-offset valid           |
| **Latency lambat**                    | Monitor `inference_time_ms` di HUD. Reduce `VLA_REQUEST_TIMEOUT_MS` jika backend lebih cepat. Check network latency |

---

## Project Architecture

### Folder Structure

```
src/features/drone-sim/
├── constants.ts              # Configuration (EDIT THESE)
├── types.ts                  # Type definitions
├── schema.ts                 # Validation logic
├── utils/
│   ├── capture-frame.ts     # Canvas → JPEG capture
│   └── inference-state.ts   # State builders
├── services/
│   └── vla-api.ts           # Backend API client
├── hooks/
│   ├── useDroneActionBridge.ts    # Merge keyboard + VLA
│   └── useVlaInference.ts         # Inference loop
└── components/
    ├── controls/
    │   ├── ControlPanel.tsx       # Main UI panel
    │   ├── ActionSlider.tsx       # 4-axis sliders
    │   └── ViewModeButton.tsx     # Camera switcher
    ├── overlay/
    │   ├── StatusHud.tsx          # Telemetry display
    │   ├── SettingsPanel.tsx      # Settings UI
    │   └── OverlayToolbar.tsx     # Toggle buttons
    └── scene/
        ├── SimulatorScene.tsx     # R3F Canvas + lighting
        ├── EnvironmentMap.tsx     # Map loader → AUTO-SCALE
        ├── DroneVisual.tsx        # Drone loader → AUTO-SCALE
        ├── DroneRig.tsx           # Movement + camera + telemetry
        └── SceneEnvironment.tsx   # Tone mapping + effects
```

### Data Flow

```
useVlaInference Hook
├─ start() → validate prompt → health check
├─ runSingleInference() loop every VLA_INFERENCE_INTERVAL_MS
│  ├─ captureCanvasFrame() → 224x224 JPEG
│  ├─ POST /infer (multipart) → backend
│  ├─ Parse response → first_action array
│  └─ onAction(newDroneAction)
├─ payload preview → setLatestPayloadUrl()
└─ state management → InferenceState
```

Real-time control feedback cycle melewati React state, canvas rendering, dan telemetry sync.

### Loading Flow (Maps & Drones)

```
EnvironmentMap.tsx
├─ useLoader(GLTFLoader, MAP_MODEL_URL)
├─ Calculate bounding box
├─ Auto-center & scale ke MAP_FOOTPRINT_SIZE
├─ Setup shadows (Baseplate exclude cast)
└─ Render via R3F primitive

DroneVisual.tsx (same, but scale differently)
```


---

## Resources

- [TanStack Start Docs](https://tanstack.com/start/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Docs](https://threejs.org/docs/)
- [Roblox File Formats](https://developer.roblox.com/)
