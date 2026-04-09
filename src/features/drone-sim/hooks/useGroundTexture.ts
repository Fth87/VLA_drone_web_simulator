import { useMemo } from 'react'
import {
  CanvasTexture,
  LinearFilter,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three'

export function useGroundTexture() {
  return useMemo(() => {
    const tileSize = 128
    const canvas = document.createElement('canvas')
    canvas.width = tileSize
    canvas.height = tileSize
    const context = canvas.getContext('2d')

    if (!context) {
      return null
    }

    context.fillStyle = '#aeb8c4'
    context.fillRect(0, 0, tileSize, tileSize)

    context.fillStyle = '#b8c2cc'
    context.fillRect(0, 0, tileSize / 2, tileSize / 2)
    context.fillRect(tileSize / 2, tileSize / 2, tileSize / 2, tileSize / 2)

    context.strokeStyle = '#8f99a6'
    context.lineWidth = 4
    context.strokeRect(0, 0, tileSize, tileSize)

    context.strokeStyle = '#9da7b3'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(tileSize / 2, 0)
    context.lineTo(tileSize / 2, tileSize)
    context.moveTo(0, tileSize / 2)
    context.lineTo(tileSize, tileSize / 2)
    context.stroke()

    const texture = new CanvasTexture(canvas)
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(480, 480)
    texture.colorSpace = SRGBColorSpace
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter

    return texture
  }, [])
}
