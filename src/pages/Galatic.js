import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { useMemo, useRef, useState, useEffect } from 'react'

// Convert RA/Dec to 3D coordinates
function convertToXYZ(raStr, decStr, distanceKpc = 3) {
  if (!raStr || !decStr) throw new Error("Missing RA or Dec data")

  console.log(`Processing coordinates: RA=${raStr}, Dec=${decStr}, Distance=${distanceKpc}`)

  // Improved RA parsing - supports multiple formats
  const parseRA = (ra) => {
    try {
      // First try to match "19h55m27.8737345s" format
      const hMatch = ra.match(/(\d+(\.\d+)?)h/)
      const mMatch = ra.match(/(\d+(\.\d+)?)m/)
      const sMatch = ra.match(/(\d+(\.\d+)?)s/)

      if (hMatch || mMatch || sMatch) {
        const h = parseFloat(hMatch?.[1] || 0)
        const m = parseFloat(mMatch?.[1] || 0)
        const s = parseFloat(sMatch?.[1] || 0)
        return (h + m / 60 + s / 3600) * 15
      } else {
        // Try to match simple numeric format
        const parts = ra.match(/[\d.-]+/g)
        if (parts && parts.length >= 3) {
          return (parseFloat(parts[0]) + parseFloat(parts[1]) / 60 + parseFloat(parts[2]) / 3600) * 15
        } else if (parts && parts.length === 1) {
          return parseFloat(parts[0]) // Direct decimal degrees
        }
        throw new Error("Could not parse RA: " + ra)
      }
    } catch (e) {
      console.error("RA parsing error:", e, "Input:", raStr)
      throw e
    }
  }

  // Improved Dec parsing - supports multiple formats
  const parseDec = (dec) => {
    try {
      const sign = dec.includes('-') ? -1 : 1

      // First try to match "+29°08'43.4405934\"" format
      const dMatch = dec.match(/(-?\d+(\.\d+)?)°/)
      const mMatch = dec.match(/(\d+(\.\d+)?)'/)
      const sMatch = dec.match(/(\d+(\.\d+)?)"/)

      if (dMatch || mMatch || sMatch) {
        const d = parseFloat(dMatch?.[1] || 0)
        const m = parseFloat(mMatch?.[1] || 0)
        const s = parseFloat(sMatch?.[1] || 0)
        return sign * (Math.abs(d) + m / 60 + s / 3600)
      } else {
        // Try to match simple numeric format
        const parts = dec.match(/[\d.-]+/g)
        if (parts && parts.length >= 3) {
          return sign * (Math.abs(parseFloat(parts[0])) + parseFloat(parts[1]) / 60 + parseFloat(parts[2]) / 3600)
        } else if (parts && parts.length === 1) {
          return parseFloat(parts[0]) // Direct decimal degrees
        }
        throw new Error("Could not parse Dec: " + dec)
      }
    } catch (e) {
      console.error("Dec parsing error:", e, "Input:", decStr)
      throw e
    }
  }

  const ra = THREE.MathUtils.degToRad(parseRA(raStr))
  const dec = THREE.MathUtils.degToRad(parseDec(decStr))

  // Process distance - supports different formats
  let distanceValue = distanceKpc
  if (typeof distanceKpc === 'string') {
    // Extract numeric value from string like "1.5 kpc"
    const match = distanceKpc.match(/(\d+(\.\d+)?)/);
    if (match) {
      distanceValue = parseFloat(match[1]);
    }
  } else if (typeof distanceKpc === 'object' && distanceKpc !== null) {
    // Handle {value: "1.5 kpc"} format
    if (distanceKpc.value) {
      if (typeof distanceKpc.value === 'string') {
        const match = distanceKpc.value.match(/(\d+(\.\d+)?)/);
        if (match) {
          distanceValue = parseFloat(match[1]);
        }
      } else if (typeof distanceKpc.value === 'number') {
        distanceValue = distanceKpc.value;
      }
    }
  }

  const r = 1.5 + Math.log10(distanceValue + 1) * 3.5

  const x = r * Math.cos(dec) * Math.cos(ra)
  const y = r * Math.sin(dec)
  const z = r * Math.cos(dec) * Math.sin(ra)

  return [x, y, z]
}

function Earth() {
  const texture = useLoader(TextureLoader, process.env.PUBLIC_URL + '/images/3D_Visualisation/earth.jpg')
  return (
    <mesh>
      <sphereGeometry args={[0.4, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

function StarBackground() {
  const starTexture = useLoader(TextureLoader, process.env.PUBLIC_URL + '/images/3D_Visualisation/starfield.jpg')
  return (
    <mesh>
      <sphereGeometry args={[100, 64, 64]} />
      <meshBasicMaterial map={starTexture} side={THREE.BackSide} />
    </mesh>
  )
}

function PulsarDot({ id, position, name, ra, dec, type, onHover, hovered, onTap, tapped }) {
  const coreRef = useRef()
  const glowRef = useRef()
  const [localHovered, setLocalHovered] = useState(false)

  // Determine color based on pulsar type
  const getPulsarColor = (type) => {
    if (!type) return "#60a5fa" // Default blue

    if (type.includes("Black Widow")) return "#ff5555" // Black Widow pulsar - red
    if (type.includes("Binary")) return "#55ff55" // Binary system - green
    if (type.includes("Solitary")) return "#ffaa00" // Solitary pulsar - orange
    if (type.includes("Double")) return "#ff00ff" // Double neutron star system - purple
    if (type.includes("Globular")) return "#55ffff" // Globular cluster pulsar - cyan

    return "#60a5fa" // Default blue
  }

  const pulsarColor = getPulsarColor(type)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (hovered === id || tapped === id) {
      coreRef.current.scale.set(1.2, 1.2, 1.2)
    } else {
      const coreScale = 0.8 + 0.2 * Math.sin(t * 4 + id)
      coreRef.current.scale.set(coreScale, coreScale, coreScale)
    }

    const glowScale = 1 + 0.15 * Math.sin(t * 2 + id)
    glowRef.current.scale.set(glowScale, glowScale, glowScale)
  })

  const randomRotation = useMemo(() => [
    Math.random() * Math.PI * 0.2,
    Math.random() * Math.PI * 0.2,
    Math.random() * Math.PI * 0.2
  ], [])

  // Handle click for mobile
  const handleClick = (e) => {
    e.stopPropagation()
    // If already selected, deselect; otherwise select
    if (tapped === id) {
      onTap(null)
    } else {
      onTap(id)
    }
  }

  // Determine if we should show the tooltip
  const showTooltip = hovered === id || tapped === id

  return (
    <group
      position={position}
      onPointerOver={() => {
        setLocalHovered(true)
        onHover(id)
      }}
      onPointerOut={() => {
        setLocalHovered(false)
        onHover(null)
      }}
      onClick={handleClick}
    >
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={pulsarColor}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Info tooltip */}
      {showTooltip && (
        <Html
          position={[0, 0.35, 0]}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[100, 0]}
          occlude={false}
        >
          <div className="bg-black/75 text-white text-xs px-3 py-2 rounded-lg max-w-[220px] whitespace-nowrap shadow-lg backdrop-blur">
            <strong>{name}</strong><br />
            {type && <span>Type: {type}<br /></span>}
            RA: {ra}<br />
            Dec: {dec}
            {tapped === id && (
              <div className="text-gray-300 mt-1 text-[10px]">Tap again to close</div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

export default function PulsarGalaxyBeautified({ pulsars }) {
  const [isCanvasHovered, setIsCanvasHovered] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [tappedId, setTappedId] = useState(null)
  const [status, setStatus] = useState("Loading...")
  const [isMobile, setIsMobile] = useState(false)

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle canvas click to deselect pulsars on mobile
  const handleCanvasClick = () => {
    if (isMobile && tappedId !== null) {
      setTappedId(null)
    }
  }

  // Handle different data formats
  const processPulsars = (pulsarData) => {
    // Check and normalize data structure
    let normalizedPulsars = [];

    if (Array.isArray(pulsarData)) {
      // If array format (mspsrpi2Pulsars.json)
      normalizedPulsars = pulsarData;
    } else if (pulsarData && pulsarData.pulsars && Array.isArray(pulsarData.pulsars)) {
      // If {pulsars: [...]} format (pulsars.json)
      normalizedPulsars = pulsarData.pulsars;
    } else {
      console.error("Unknown pulsar data format", pulsarData);
      setStatus("Data format error");
      return [];
    }

    return normalizedPulsars;
  }

  const points = useMemo(() => {
    console.log("Original pulsar data:", pulsars);

    if (!pulsars || (Array.isArray(pulsars) && pulsars.length === 0)) {
      setStatus("No pulsar data");
      return [];
    }

    const normalizedPulsars = processPulsars(pulsars);
    console.log("Normalized pulsar data:", normalizedPulsars);

    if (normalizedPulsars.length === 0) {
      setStatus("Cannot parse pulsar data");
      return [];
    }

    setStatus(`Processing ${normalizedPulsars.length} pulsar data...`);

    return normalizedPulsars.map((pulsar, index) => {
      try {
        // Get name
        const name = pulsar.name || pulsar.display_name || `Pulsar ${index + 1}`;

        // Get type
        const type = pulsar.type || (pulsar.memberships ? pulsar.memberships.join(", ") : null);

        // Get RA and Dec
        let ra = null;
        let dec = null;

        if (pulsar.position) {
          ra = pulsar.position.rightAscension;
          dec = pulsar.position.declination;
        } else if (pulsar.coordinates) {
          ra = pulsar.coordinates.ra;
          dec = pulsar.coordinates.dec;
        } else {
          ra = pulsar.ra;
          dec = pulsar.dec;
        }

        // Get distance
        let distance = 0; // Default distance

        if (pulsar.distance) {
          if (typeof pulsar.distance === 'object' && pulsar.distance.value) {
            distance = pulsar.distance.value;
          } else {
            distance = pulsar.distance;
          }
        }

        console.log(`Processing pulsar ${name}: RA=${ra}, Dec=${dec}, Distance=${distance}, Type=${type}`);

        if (!ra || !dec) {
          console.warn(`Skipping pulsar ${name}: Missing RA or Dec data`);
          return null;
        }

        try {
          // Convert coordinates to 3D position
          const position = convertToXYZ(ra, dec, distance);
          console.log(`Pulsar ${name} position:`, position);

          return { id: index, name, ra, dec, position, type };
        } catch (e) {
          console.error(`Coordinate conversion failed ${name}:`, e.message);
          return null;
        }
      } catch (e) {
        console.error(`Failed to process pulsar data, index ${index}:`, e);
        return null;
      }
    }).filter(Boolean);
  }, [pulsars]);

  console.log("Generated points:", points);

  // Update status when points change
  useEffect(() => {
    if (points.length > 0) {
      setStatus(`Displaying ${points.length} pulsars`);
    }
  }, [points]);

  return (
    <div
      onMouseEnter={() => setIsCanvasHovered(true)}
      onMouseLeave={() => setIsCanvasHovered(false)}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        onClick={handleCanvasClick}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <OrbitControls autoRotate={!isCanvasHovered} autoRotateSpeed={0.2} />
        <StarBackground />
        <Earth />
        {points.length > 0 ? (
          points.map(p => (
            <PulsarDot
              key={p.id}
              {...p}
              onHover={setActiveId}
              hovered={activeId}
              onTap={setTappedId}
              tapped={tappedId}
            />
          ))
        ) : (
          <Html center>
            <div className="bg-black/75 text-white p-4 rounded">
              {status}
            </div>
          </Html>
        )}
      </Canvas>

      {/* Mobile usage hint */}
      {isMobile && points.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)',
          padding: '6px 12px',
          borderRadius: '20px',
          color: 'white',
          fontSize: '12px',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          Tap on a pulsar to view details
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        padding: '8px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '12px'
      }}>
        <div style={{ marginBottom: '4px' }}>Pulsar Types:</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ff5555', marginRight: '5px', borderRadius: '50%' }}></span>
          <span>Black Widow Pulsar</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#55ff55', marginRight: '5px', borderRadius: '50%' }}></span>
          <span>Binary System</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ffaa00', marginRight: '5px', borderRadius: '50%' }}></span>
          <span>Solitary Pulsar</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ff00ff', marginRight: '5px', borderRadius: '50%' }}></span>
          <span>Double Neutron Star System</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#60a5fa', marginRight: '5px', borderRadius: '50%' }}></span>
          <span>Other Types</span>
        </div>
      </div>
    </div>
  )
}