import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { useMemo, useRef, useState } from 'react'

// Convert RA/Dec to 3D coordinates (in visual space units)
function convertToXYZ(raStr, decStr, distanceKpc = 3) {
  if (!raStr || !decStr) throw new Error("Missing RA or Dec")

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
  const r = 1.5 + Math.log10(distanceKpc + 1) * 3.5

  const x = r * Math.cos(dec) * Math.cos(ra)
  const y = r * Math.sin(dec)
  const z = r * Math.cos(dec) * Math.sin(ra)

  return [x, y, z]
}

function Earth() {
  const texture = useLoader(TextureLoader, process.env.PUBLIC_URL + '/images/earth.jpg')
  return (
    <mesh>
      <sphereGeometry args={[0.4, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

function StarBackground() {
  const starTexture = useLoader(TextureLoader, process.env.PUBLIC_URL + '/images/starfield.jpg')
  return (
    <mesh>
      <sphereGeometry args={[100, 64, 64]} />
      <meshBasicMaterial map={starTexture} side={THREE.BackSide} />
    </mesh>
  )
}

function PulsarDot({ id, position, name, ra, dec, onHover, hovered }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const scale = 0.8 + 0.3 * Math.sin(t * 4 + id)
    ref.current.scale.set(scale, scale, scale)
  })

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={() => onHover(id)}
      onPointerOut={() => onHover(null)}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial emissive="hotpink" emissiveIntensity={1.5} />
      {hovered === id && (
        <Html position={[0, 0.25, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]} occlude={false}>
          <div className="bg-black/75 text-white text-xs px-3 py-2 rounded-lg max-w-[180px] whitespace-nowrap shadow-lg backdrop-blur">
            <strong>{name}</strong><br />
            RA: {ra}<br />
            Dec: {dec}
          </div>
        </Html>
      )}

    </mesh>
  )
}

export default function PulsarGalaxyBeautified({ pulsars }) {
  const [isCanvasHovered, setIsCanvasHovered] = useState(false)
  const [activeId, setActiveId] = useState(null)


  const points = useMemo(() => {
    return pulsars.map((pulsar, index) => {
      const name = pulsar.name || pulsar.display_name
      const ra = pulsar.position?.rightAscension || pulsar.coordinates?.ra || pulsar.ra
      const dec = pulsar.position?.declination || pulsar.coordinates?.dec || pulsar.dec
      const distance = pulsar.distance?.value || pulsar.distance || 3

      if (!ra || !dec || typeof ra !== 'string' || typeof dec !== 'string') return null

      try {
        const position = convertToXYZ(ra, dec, distance)
        return { id: index, name, ra, dec, position }
      } catch (e) {
        console.warn(`Failed to parse RA/Dec for ${name}:`, e)
        return null
      }
    }).filter(Boolean)
  }, [pulsars])

  return (
    <div
      onMouseEnter={() => setIsCanvasHovered(true)}
      onMouseLeave={() => setIsCanvasHovered(false)}
      style={{ width: '100%', height: '100%' }}
    >

      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <OrbitControls autoRotate={!isCanvasHovered} autoRotateSpeed={0.2} />
        <StarBackground />
        <Earth />
        {points.map(p => (
          <PulsarDot key={p.id} {...p} onHover={setActiveId} hovered={activeId} />
        ))}
      </Canvas>
    </div>

  )
}
