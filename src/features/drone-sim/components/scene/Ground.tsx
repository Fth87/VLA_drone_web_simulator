import { useGroundTexture } from '../../hooks/useGroundTexture'

export function Ground() {
  const texture = useGroundTexture()

  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1600, 1600, 1, 1]} />
      <meshStandardMaterial
        map={texture ?? undefined}
        color="#bcc6cf"
        roughness={0.98}
      />
    </mesh>
  )
}
