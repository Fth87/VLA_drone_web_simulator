import { useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useState } from 'react'
import { Box3, Mesh, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRONE_MODEL_URL } from '../../constants'

export function DroneVisual({ visible }: { visible: boolean }) {
  const gltf = useLoader(GLTFLoader, DRONE_MODEL_URL)
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  const [offset, setOffset] = useState<[number, number, number]>([0, 0, 0])
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const box = new Box3().setFromObject(scene)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const maxAxis = Math.max(size.x, size.y, size.z) || 1

    setOffset([-center.x, -box.min.y, -center.z])
    setScale(1 / maxAxis)

    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <group visible={visible} scale={scale}>
      <primitive object={scene} position={offset} />
    </group>
  )
}
