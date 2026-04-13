import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import {
  NeutralToneMapping,
  PMREMGenerator,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { TONE_MAPPING_EXPOSURE } from '../../constants'

export function SceneEnvironment() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const environmentScene = useMemo(() => new RoomEnvironment(), [])

  useEffect(() => {
    const previousEnvironment = scene.environment
    const previousToneMapping = gl.toneMapping
    const previousToneMappingExposure = gl.toneMappingExposure
    const pmremGenerator = new PMREMGenerator(gl)
    const environmentRenderTarget = pmremGenerator.fromScene(environmentScene)

    gl.toneMapping = NeutralToneMapping
    gl.toneMappingExposure = TONE_MAPPING_EXPOSURE
    scene.environment = environmentRenderTarget.texture

    return () => {
      scene.environment = previousEnvironment
      gl.toneMapping = previousToneMapping
      gl.toneMappingExposure = previousToneMappingExposure
      environmentRenderTarget.dispose()
      pmremGenerator.dispose()
    }
  }, [environmentScene, gl, scene])

  return null
}
