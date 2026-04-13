import { VLA_IMAGE_SIZE, VLA_JPEG_QUALITY } from '../constants'

const captureCanvas =
  typeof document === 'undefined' ? null : document.createElement('canvas')

if (captureCanvas) {
  captureCanvas.width = VLA_IMAGE_SIZE
  captureCanvas.height = VLA_IMAGE_SIZE
}

const captureContext = captureCanvas?.getContext('2d', { alpha: false }) ?? null

function captureSourceToJpegBlob(
  source: HTMLCanvasElement | HTMLVideoElement,
): Promise<Blob | null> {
  if (typeof document === 'undefined') {
    return Promise.resolve(null)
  }

  if (!captureCanvas || !captureContext) {
    return Promise.resolve(null)
  }

  captureContext.drawImage(source, 0, 0, VLA_IMAGE_SIZE, VLA_IMAGE_SIZE)

  return new Promise((resolve) => {
    captureCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', VLA_JPEG_QUALITY)
  })
}

export async function captureVideoFrame(
  video: HTMLVideoElement,
): Promise<Blob | null> {
  return captureSourceToJpegBlob(video)
}

export async function captureCanvasFrame(
  canvas: HTMLCanvasElement,
): Promise<Blob | null> {
  return captureSourceToJpegBlob(canvas)
}
