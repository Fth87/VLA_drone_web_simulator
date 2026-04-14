# Drone VLA Simulator

Simulator drone 3D dengan  **TanStack Start**, **React Three Fiber**, dan **Three.js**. Aplikasi ini menampilkan simulator fullscreen dengan integrasi model VLA untuk autonomous flight control testing dan manual drone operation.

## Prerequisites

Untuk menjalankan project ini, pastikan sudah install:

- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x ([install pnpm](https://pnpm.io/installation))

## Setup

### 1. Backend VLA API (Required)

Simulator memerlukan backend VLA API untuk inference. Clone dan setup backend terlebih dahulu:

```bash
git clone https://github.com/Fth87/VLA_drone_backend_web_simulator-.git
cd VLA_drone_backend_web_simulator-
# lalu Ikuti instruksi di README backend untuk setup environment dan menjalankan API
```

Backend akan berjalan di `http://localhost:8000`. Pastikan endpoint ini accessible sebelum menjalankan simulator.

### 2. Environment Variables

Copy `.env.example` ke `.env` lalu sesuaikan nilai:

```bash
cp .env.example .env
```

Isi `.env` dengan:

```bash
# Supabase (opsional untuk auth features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# VLA API Backend (REQUIRED)
VITE_VLA_API_URL=http://localhost:8000
```

**Notes:**

- `VITE_SUPABASE_ANON_KEY` adalah public key — safe untuk expose di browser
- Jangan hardcode service role key di client bundle
- `VITE_VLA_API_URL` harus pointing ke backend API yang sudah dijalankan

### 3. Frontend Setup

```bash
pnpm install
pnpm dev
```

Frontend akan berjalan di `http://localhost:5173`. Buka di browser untuk mulai testing simulator.

## Build & Deploy

### Production Build

Verify build lokal terlebih dahulu sebelum deploy:

```bash
pnpm run build
```

Output:

- Client bundle: `dist/`
- Server handler (Netlify): `.netlify/v1/functions/server.mjs`

### Deploy ke Netlify

Project ini siap deploy ke Netlify dengan plugin resmi TanStack Start (`@netlify/vite-plugin-tanstack-start`).

**Via Dashboard Netlify:**

1. Push ke Git provider (GitHub/GitLab/Bitbucket)
2. Di Netlify → **Add new site** → **Import an existing project**
3. Pilih repository ini
4. Build settings sudah auto-detected, tinggal review:
   - Build command: `pnpm build`
   - Publish directory: kosongkan (ditangani oleh plugin)
5. **Deploy**

**Via CLI:**

```bash
pnpm dlx netlify-cli deploy --build          # Preview
pnpm dlx netlify-cli deploy --build --prod   # Production
```

**Environment Variables di Netlify:**

Set di Netlify dashboard under **Site Settings → Environment**:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_VLA_API_URL=https://your-backend-api-url.com
```

Pastikan backend API URL accessible dari public internet jika deploy ke Netlify.

## Production Best Practices

- **VLA API:** Pastikan backend API selalu running dan accessible. Monitor latency — overhead inference > 1s akan terasa janky di simulator.
- **Bundle size:** Three.js bisa berat (~1.2MB). Jika perlu optimize, split scene/komponen berat dengan lazy loading per route.
- **3D Assets:** Compress `.glb` models (Draco encoding, mesh optimization) sebelum commit. Simpan di `public/` dengan path konsisten.
- **Secrets:** Never hardcode API keys. Gunakan environment variables di build time atau runtime config.
- **Testing:** Jalankan `pnpm build` lokal sebelum merge untuk verifikasi output SSR + client bundle.
- **SSL/HTTPS:** Backend API harus HTTPS di production untuk CORS sama frontend di domain berbeda.
- **Server Timeout:** Set `VLA_REQUEST_TIMEOUT_MS` (default 10s) sesuai kebutuhan inference model.

## Troubleshooting

**"API unreachable — is the backend running?"**

- Pastikan backend API sudah dijalankan di `VITE_VLA_API_URL`
- Cek endpoint `/health` dari browser: `curl http://localhost:8000/health`
- Jika production, pastikan firewall/CORS allow request dari domain frontend

**Drone tidak respond terhadap keyboard input**

- Klik di area canvas simulator dulu untuk focus
- Cek console untuk error messages

**Model drone tidak visible**

- Pastikan file di `public/drone model/drone_model.glb` ada
- Cek browser console untuk loading errors
- Try refresh atau hard refresh (Ctrl+Shift+R)

**Inference berjalan tapi action tidak update drone**

- Cek format prompt di control panel (minimal 1 karakter)
- Baca error di inference status badge
- Pastikan backend mengembalikan `first_action` array dengan 4 values
- Monitor network tab untuk response payload

## Fitur Utama

- Arena fullscreen dengan ground tiled dan target merah
- Model drone GLB dari `public/drone model/drone_model.glb`
- **Mode Kamera:**
  - `1` = FPV (first-person view)
  - `3` = 3rd person follow
  - `4` = fixed corner view
- **Keyboard Controls:**
  - `W/S` = maju/mundur (vz)
  - `Q/E` = naik/turun (vy)
  - `←/→` atau `A/D` = strafe kiri/kanan (vx) / yaw (A/D)
- **Action Sliders:** Manual kontrol 4-axis (vx, vy, vz, yaw) dengan range -1 sampai 1
- **VLA Integration:** Submit natural language prompt → backend infer → drone execute action
- **Live Telemetry:** Posisi, heading, aksi current, status inference di HUD
- **Payload Preview:** Download capture frame terakhir yang dikirim ke VLA API

## VLA Integration Details

### API Spec

Backend endpoint: `POST /infer`

**Request (multipart/form-data):**

```
image_input: <224x224 JPEG blob>
task_input: <string> "go to the red box"
state_input: <string> optional drone state context
```

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

`first_action` array format: `[vx, vy, vz, yaw]` dengan range -1..1

### Global Bridge (Optional)

Simulator juga support manual action injection via browser console:

```js
// Set drone action manually
window.setDroneAction({
  vx: 0.0,
  vy: 0.1,
  vz: 0.8,
  yaw: -0.2,
})

// Update inference prompt
window.setDronePrompt('hover above the target')
```

Semua nilai di-clamp automatic ke range -1..1.

## Customization & Tuning

### Movement Gains

Adjust drone responsiveness di `src/features/drone-sim/constants.ts`:

```ts
export const ACTION_GAIN = {
  vx: 1.8, // lateral speed
  vy: 1.4, // vertical speed
  vz: 2.1, // forward speed
  yaw: 0.9, // rotation speed
}
```

Increase gain untuk lebih responsive, decrease untuk lebih smooth.

### Arena Bounds

Set drone flight boundaries di `src/features/drone-sim/constants.ts`:

```ts
export const DRONE_BOUNDS = {
  x: 28, // lateral limit
  yMin: 0.35, // floor
  yMax: 12, // ceiling
  z: 28, // depth limit
}
```

### Camera Presets

Adjust camera distance, height, FOV di Control Panel **Settings** → **Advanced** atau di constants.

## Project Structure

Feature simulator di `src/features/drone-sim/`:

**Core:**

- `types.ts` — Domain types (DroneAction, InferenceState, etc.)
- `constants.ts` — Tunable params (gains, bounds, initial state)
- `schema.ts` — Validation (prompt sanitization)
- `utils/` — Helpers (clamp, frame capture, state builders)
- `services/vla-api.ts` — Backend API client (health check, inference)

**Hooks:**

- `useDroneActionBridge.ts` — Merge keyboard + VLA model actions → final action
- `useVlaInference.ts` — Inference loop, health check, payload preview management

**UI Components:**

- `components/controls/` — Action sliders, camera mode button, control panel
- `components/overlay/` — Status HUD, settings panel, toolbar toggle
- `components/scene/` — Three.js scene, drone rig, environment setup

**Entry:**

- `src/components/RobloxModelViewer.tsx` — Main container, state orchestration
