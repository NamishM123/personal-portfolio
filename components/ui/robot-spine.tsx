'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import type { Group } from 'three'
import { type MotionValue } from 'framer-motion'

const VERTEBRA_COUNT = 60
const SPACING = 0.22

function Vertebra({ y, index }: { y: number; index: number }) {
  // Tiny variation between vertebrae so the column feels organic
  const torusRadius = 0.34 + Math.sin(index * 0.6) * 0.04
  const tubeRadius = 0.11 + Math.cos(index * 0.4) * 0.015
  const wingLength = 0.22 + Math.sin(index * 0.9) * 0.04
  const tilt = Math.sin(index * 0.3) * 0.05

  return (
    <group position={[0, y, 0]} rotation={[tilt, 0, tilt * 0.5]}>
      {/* main vertebral body — chunky torus */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[torusRadius, tubeRadius, 24, 48]} />
        <meshPhysicalMaterial
          color="#1c1c24"
          metalness={0.95}
          roughness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.18}
          envMapIntensity={1.4}
          emissive="#1a1a3a"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* transverse processes (side wings) */}
      <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.035, wingLength, 14]} />
        <meshPhysicalMaterial
          color="#262630"
          metalness={0.9}
          roughness={0.3}
          clearcoat={0.8}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh position={[0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.035, wingLength, 14]} />
        <meshPhysicalMaterial
          color="#262630"
          metalness={0.9}
          roughness={0.3}
          clearcoat={0.8}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* small endcaps on the wings */}
      <mesh position={[-0.55, 0, 0]}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshPhysicalMaterial
          color="#2a2a36"
          metalness={0.95}
          roughness={0.25}
          clearcoat={1}
        />
      </mesh>
      <mesh position={[0.55, 0, 0]}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshPhysicalMaterial
          color="#2a2a36"
          metalness={0.95}
          roughness={0.25}
          clearcoat={1}
        />
      </mesh>

      {/* spinous process — small bump on top */}
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.055, 0.13, 10]} />
        <meshPhysicalMaterial
          color="#222230"
          metalness={0.92}
          roughness={0.25}
          clearcoat={1}
        />
      </mesh>

      {/* glowing core — the "spinal cord" segment */}
      <mesh>
        <sphereGeometry args={[0.065, 20, 20]} />
        <meshStandardMaterial
          color="#7c8aff"
          emissive="#6366f1"
          emissiveIntensity={3.8}
          toneMapped={false}
        />
      </mesh>

      {/* thin connecting disc between vertebrae */}
      <mesh position={[0, SPACING / 2, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.04, 20]} />
        <meshPhysicalMaterial
          color="#0f0f18"
          metalness={0.8}
          roughness={0.5}
          emissive="#3730a3"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}

function Spine({ progress }: { progress: MotionValue<number> }) {
  const groupRef = useRef<Group>(null)
  const innerRef = useRef<Group>(null)
  const smoothed = useRef(0)

  // Pre-compute vertebra positions
  const vertebrae = useMemo(
    () =>
      Array.from({ length: VERTEBRA_COUNT }, (_, i) => ({
        y: (i - VERTEBRA_COUNT / 2) * SPACING,
        index: i,
      })),
    []
  )

  useFrame((_, delta) => {
    if (!groupRef.current || !innerRef.current) return
    const target = progress.get()
    // Critical-damped lerp toward target so motion stays smooth
    smoothed.current += (target - smoothed.current) * Math.min(1, delta * 4)
    const p = smoothed.current

    // Full sweep: rotate ~200° around Y as you scroll the section
    groupRef.current.rotation.y = (p - 0.5) * Math.PI * 1.1
    groupRef.current.rotation.x = (0.5 - p) * 0.25
    groupRef.current.position.y = (0.5 - p) * 0.6

    // Subtle continuous breathing rotation
    innerRef.current.rotation.z = Math.sin(performance.now() * 0.0005) * 0.04
  })

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        {vertebrae.map((v) => (
          <Vertebra key={v.index} y={v.y} index={v.index} />
        ))}
      </group>
    </group>
  )
}

interface RobotSpineProps {
  progress: MotionValue<number>
}

export function RobotSpine({ progress }: RobotSpineProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} color="#c4b5fd" />
          <pointLight position={[-6, -4, 4]} intensity={2} color="#6366f1" />
          <pointLight position={[6, 4, 4]} intensity={1.5} color="#a78bfa" />
          <pointLight position={[0, 0, 6]} intensity={0.8} color="#ffffff" />
          <Environment preset="night" />
          <Spine progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  )
}
