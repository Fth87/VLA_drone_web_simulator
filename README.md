# Drone VLA Simulator

Simulator drone sederhana berbasis TanStack Start, React Three Fiber, dan Three.js. Route home (`/`) menampilkan simulator fullscreen untuk menguji kontrol drone manual maupun output aksi dari model VLA.

## Menjalankan Project

```bash
pnpm install
pnpm dev
```

Build production:

```bash
pnpm run build
```

## Deploy ke Netlify

Project ini sudah disiapkan untuk Netlify dengan plugin resmi TanStack Start:

- `@netlify/vite-plugin-tanstack-start` di `vite.config.ts`
- konfigurasi build di `netlify.toml`

### Opsi 1: Deploy via Dashboard Netlify

1. Push repository ke Git provider (GitHub/GitLab/Bitbucket).
2. Di Netlify, pilih **Add new site** -> **Import an existing project**.
3. Pilih repository ini.
4. Pastikan Build settings:

- Build command: `pnpm build`
- Publish directory: kosongkan/default (ditangani plugin Netlify + TanStack Start)

5. Deploy.

### Opsi 2: Deploy via Netlify CLI

```bash
pnpm dlx netlify-cli deploy --build
pnpm dlx netlify-cli deploy --build --prod
```

### Verifikasi Lokal Sebelum Deploy

```bash
pnpm build
```

Build sukses akan menghasilkan output server Netlify di:

- `.netlify/v1/functions/server.mjs`

## Best Practices (Three.js + TanStack Start di Netlify)

- Pertahankan plugin resmi `@netlify/vite-plugin-tanstack-start` agar output SSR/handler Netlify tetap kompatibel.
- Simpan secret/API key di Netlify Environment Variables, jangan di-hardcode ke source code.
- Monitor ukuran bundle Three.js. Jika chunk utama makin besar, split scene/fitur berat dengan `lazy()` atau dynamic `import()` per route/fitur.
- Kompres aset 3D (`.glb`) sebelum commit (contoh: Draco/mesh optimization) untuk menurunkan waktu load awal.
- Simpan file model/texture di `public/` dengan nama path yang konsisten (hindari perubahan path saat runtime).
- Jalankan `pnpm build` di lokal sebelum merge untuk memastikan output SSR + client tetap valid.

## Fitur Utama

- Arena fullscreen dengan ground tiled dan target kotak merah
- Model drone dari `public/drone model/drone_model.glb`
- Mode kamera:
  - `1` = FPV
  - `3` = 3rd person
  - `4` = fixed corner view
- Kontrol keyboard:
  - `W / S` = maju / mundur
  - `Q / E` = turun / naik
  - `ArrowLeft / ArrowRight` = strafe kiri / kanan
  - `A / D` = yaw kiri / kanan
- Kontrol aksi VLA dengan `vx`, `vy`, `vz`, `yaw`
- Prompt input lokal dan bridge prompt global

## Integrasi Dengan Model VLA

Simulator mengekspos bridge global sederhana:

```js
window.setDroneAction({
  vx: 0.0,
  vy: 0.1,
  vz: 0.8,
  yaw: -0.2,
})

window.setDronePrompt('go to the red box and hover')
```

Semua nilai aksi di-clamp ke rentang `-1..1`.

## Tuning Gerakan

Gain gerakan dipusatkan di:

[src/features/drone-sim/constants.ts](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/constants.ts)

```ts
export const ACTION_GAIN = {
  vx: 1.8,
  vy: 1.4,
  vz: 2.1,
  yaw: 0.9,
}
```

Arti parameter:

- `vx`: kecepatan strafe kiri/kanan
- `vy`: kecepatan naik/turun
- `vz`: kecepatan maju/mundur
- `yaw`: kecepatan rotasi yaw

## Struktur Kode

Feature simulator dipisah ke folder:

- [src/features/drone-sim/types.ts](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/types.ts)
  - Tipe domain simulator dan bridge global
- [src/features/drone-sim/constants.ts](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/constants.ts)
  - Konstanta domain seperti bounds, gain, dan initial state
- [src/features/drone-sim/utils.ts](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/utils.ts)
  - Helper umum seperti clamp dan normalisasi heading
- [src/features/drone-sim/hooks/useDroneActionBridge.ts](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/hooks/useDroneActionBridge.ts)
  - Menggabungkan input keyboard dan model VLA ke action final
- [src/features/drone-sim/hooks/useGroundTexture.ts](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/hooks/useGroundTexture.ts)
  - Texture procedural untuk ground
- [src/features/drone-sim/components/Ground.tsx](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/components/Ground.tsx)
  - Mesh ground arena
- [src/features/drone-sim/components/DroneVisual.tsx](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/components/DroneVisual.tsx)
  - Render dan normalisasi model drone
- [src/features/drone-sim/components/DroneRig.tsx](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/components/DroneRig.tsx)
  - Movement, camera follow, reset, target, dan telemetry
- [src/features/drone-sim/components/SimulatorScene.tsx](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/components/SimulatorScene.tsx)
  - Scene Three.js / R3F utama
- [src/features/drone-sim/components/ActionSlider.tsx](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/components/ActionSlider.tsx)
  - Slider UI generik untuk aksi
- [src/features/drone-sim/components/ViewModeButton.tsx](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/components/ViewModeButton.tsx)
  - Tombol mode kamera
- [src/features/drone-sim/components/ControlPanel.tsx](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/components/ControlPanel.tsx)
  - Panel input aksi, prompt, kamera, dan reset
- [src/features/drone-sim/components/StatusHud.tsx](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/features/drone-sim/components/StatusHud.tsx)
  - HUD bawah untuk posisi, heading, action, dan status prompt
- [src/components/RobloxModelViewer.tsx](/mnt/data/1%20FP%20KCV%20/web/drone_vla_3d/src/components/RobloxModelViewer.tsx)
  - Container tipis yang merangkai feature simulator

## Prinsip Refactor

Refactor ini menjaga:

- Tampilan tetap sama
- Perilaku simulator tetap sama
- Separation of concern lebih jelas
- Domain logic dipisah dari presentational UI
- Tidak overengineering: belum menambah state manager atau abstraction yang belum dibutuhkan
