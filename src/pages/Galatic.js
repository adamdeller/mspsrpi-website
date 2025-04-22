import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useState } from 'react'

// 工具函数：RA/Dec/Distance → x, y, z
function convertToXYZ(raStr, decStr, distanceKpc = 3) {
  const parseRA = (ra) => {
    const [h, m, s] = ra.match(/\d+(\.\d+)?/g).map(Number)
    return (h + m / 60 + s / 3600) * 15
  }

  const parseDec = (dec) => {
    const [d, m, s] = dec.match(/-?\d+(\.\d+)?/g).map(Number)
    const sign = dec.trim().startsWith('-') ? -1 : 1
    return sign * (Math.abs(d) + m / 60 + s / 3600)
  }

  const ra = THREE.MathUtils.degToRad(parseRA(raStr))
  const dec = THREE.MathUtils.degToRad(parseDec(decStr))

  // 🧠 改进点：加上偏移，避免靠近地球
  const baseOffset = 1.5
  const scaleFactor = 3.5
  const r = baseOffset + Math.log10(distanceKpc + 1) * scaleFactor

  const x = r * Math.cos(dec) * Math.cos(ra)
  const y = r * Math.sin(dec)
  const z = r * Math.cos(dec) * Math.sin(ra)

  return [x, y, z]
}



// 🔭 主组件
export default function PulsarGalaxy({ pulsars }) {
  const [hovered, setHovered] = useState(null)

  const points = useMemo(() => {
    return pulsars
      .map((pulsar, index) => {
        const name = pulsar.name || pulsar.display_name
        const ra =
          pulsar.position?.rightAscension || pulsar.coordinates?.ra || pulsar.ra
        const dec =
          pulsar.position?.declination || pulsar.coordinates?.dec || pulsar.dec
        const distance = pulsar.distance?.value || pulsar.distance || 1

        // 🛡️ 加防御性检查：只处理合法字符串
        if (typeof ra !== 'string' || typeof dec !== 'string') return null

        try {
          const position = convertToXYZ(ra, dec, distance)
          return { id: index, name, ra, dec, position }
        } catch (e) {
          console.warn(`Failed to parse RA/Dec for ${name}:`, e)
          return null
        }
      })
      .filter(Boolean)

  }, [pulsars])

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />

      {/* 地球 */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial emissive="skyblue" emissiveIntensity={0.5} />
      </mesh>

      {points.map(({ id, name, ra, dec, position }) => (
        <mesh
          key={id}
          position={position}
          onPointerOver={() => setHovered(id)}
          onPointerOut={() => setHovered(null)}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial emissive="deepskyblue" emissiveIntensity={1} />
          {hovered === id && (
            <Html distanceFactor={10}>
              <div className="bg-black/60 text-white text-xs p-2 rounded shadow-md">
                <strong>{name}</strong><br />
                RA: {ra}<br />
                Dec: {dec}
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </Canvas>
  )
}
