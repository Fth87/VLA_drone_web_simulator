import { MathUtils } from 'three'

export function clampActionValue(value: number) {
  return MathUtils.clamp(value, -1, 1)
}

export function normalizeHeadingDegrees(radians: number) {
  const degrees = MathUtils.radToDeg(radians)
  return ((degrees % 360) + 360) % 360
}
