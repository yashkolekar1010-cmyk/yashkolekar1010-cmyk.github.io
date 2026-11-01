import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  FogExp2,
  NormalBlending,
  Object3D,
} from 'three'
import type {
  Group,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  Points,
  PointsMaterial,
} from 'three'

/**
 * The page-wide 3D layer: a lit, shaded "AI core" with orbiting rings and
 * satellites, sitting behind every section rather than just the hero.
 *
 * Why shaded geometry and not a point cloud: unlit points always read as a
 * flat background texture no matter how many you draw. Volume comes from
 * specular highlights moving across curved surfaces, objects occluding each
 * other, and perspective changing as the camera moves — so this scene is
 * built from real meshes under coloured lights, and the camera orbits and
 * dollies with scroll position.
 */

const css = (v: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(v).trim()

function radialSprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.3, 'rgba(255,255,255,.55)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return new CanvasTexture(c)
}

interface Props {
  lean: boolean
  calm: boolean
}

function World({ lean, calm }: Props) {
  const rig = useRef<Group>(null!)          // everything, orbited by scroll
  const core = useRef<Group>(null!)         // the shell + inner solid
  const shell = useRef<Mesh>(null!)
  const inner = useRef<Mesh>(null!)
  const rings = useRef<Group>(null!)
  const sats = useRef<InstancedMesh>(null!)
  const dust = useRef<Points>(null!)

  const shellMat = useRef<MeshStandardMaterial>(null!)
  const innerMat = useRef<MeshStandardMaterial>(null!)
  const ringMats = [
    useRef<MeshStandardMaterial>(null!),
    useRef<MeshStandardMaterial>(null!),
    useRef<MeshStandardMaterial>(null!),
  ]
  const satMat = useRef<MeshStandardMaterial>(null!)
  const dustMat = useRef<PointsMaterial>(null!)
  const lightA = useRef<PointLight>(null!)
  const lightB = useRef<PointLight>(null!)
  const lightC = useRef<PointLight>(null!)

  const { camera, scene, invalidate } = useThree()
  const sprite = useMemo(radialSprite, [])
  const dummy = useMemo(() => new Object3D(), [])

  const SATS = lean ? 16 : 38
  const DUST = lean ? 300 : 900

  /* satellites: each on its own tilted orbit so they cross in front of and
     behind the core, which is what sells the depth */
  const orbits = useMemo(
    () =>
      Array.from({ length: SATS }, () => ({
        r: 11 + Math.random() * 10,
        speed: (0.08 + Math.random() * 0.22) * (Math.random() < 0.5 ? -1 : 1),
        phase: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 1.5,
        yaw: Math.random() * Math.PI,
        size: 0.12 + Math.random() * 0.3,
      })),
    [SATS],
  )

  const dustPos = useMemo(() => {
    const a = new Float32Array(DUST * 3)
    for (let i = 0; i < DUST; i++) {
      const r = 16 + Math.random() * 34
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      a[i * 3] = r * Math.sin(ph) * Math.cos(th)
      a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7
      a[i * 3 + 2] = r * Math.cos(ph)
    }
    return a
  }, [DUST])

  /* ── theme ── */
  useEffect(() => {
    const apply = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light'
      const a = new Color(css('--scene-a'))
      const b = new Color(css('--scene-b'))
      const c = new Color(css('--scene-c'))

      if (lightA.current) { lightA.current.color.copy(a); lightA.current.intensity = light ? 220 : 340 }
      if (lightB.current) { lightB.current.color.copy(c); lightB.current.intensity = light ? 130 : 220 }
      if (lightC.current) { lightC.current.color.copy(b); lightC.current.intensity = light ? 110 : 190 }

      if (shellMat.current) {
        shellMat.current.color.copy(b)
        shellMat.current.emissive.copy(b)
        shellMat.current.emissiveIntensity = light ? 0.22 : 0.62
        shellMat.current.opacity = light ? 0.28 : 0.42
      }
      if (innerMat.current) {
        innerMat.current.color.set(light ? '#cdd9f5' : '#0b1430')
        innerMat.current.emissive.copy(a)
        innerMat.current.emissiveIntensity = light ? 0.12 : 0.42
      }
      ringMats.forEach((m, i) => {
        if (!m.current) return
        m.current.color.copy(i === 0 ? a : i === 1 ? b : c)
        m.current.emissive.copy(i === 0 ? a : i === 1 ? b : c)
        m.current.emissiveIntensity = light ? 0.18 : 0.7
        m.current.opacity = light ? 0.4 : 0.78
      })
      if (satMat.current) {
        satMat.current.color.copy(b)
        satMat.current.emissive.copy(b)
        satMat.current.emissiveIntensity = light ? 0.28 : 0.95
      }
      if (dustMat.current) {
        dustMat.current.color.copy(a)
        dustMat.current.opacity = light ? 0.4 : 0.62
        dustMat.current.blending = light ? NormalBlending : AdditiveBlending
        dustMat.current.needsUpdate = true
      }

      scene.fog = new FogExp2(
        new Color(css('--scene-bg')).getHex(),
        light ? 0.013 : 0.02,
      )
      invalidate()
    }
    apply()
    window.addEventListener('yk-themechange', apply)
    return () => window.removeEventListener('yk-themechange', apply)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, invalidate])

  /* ── scroll + pointer ── */
  const scrollT = useRef(0)
  const scrollCur = useRef(0)
  const ptr = useRef({ x: 0, y: 0 })
  const ptrCur = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollT.current = max > 0 ? window.scrollY / max : 0
      if (calm) invalidate()
    }
    const onMove = (e: PointerEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      ptr.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    if (!calm) window.addEventListener('pointermove', onMove, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
    }
  }, [calm, invalidate])

  const place = (t: number) => {
    /* the camera travels a wide arc as the page scrolls: the core swings
       from the right of the hero to the left and recedes, so every section
       sees a different angle of the same object */
    const s = scrollCur.current
    const ang = -0.5 + s * 2.4
    const dist = 34 + s * 26

    camera.position.x = Math.sin(ang) * dist + ptrCur.current.x * 3
    camera.position.z = Math.cos(ang) * dist
    camera.position.y = 2 + s * 10 - ptrCur.current.y * 2.4
    const offX = (1 - Math.min(s * 2, 1)) * 7
    camera.lookAt(-offX, s * 2.5, 0)

    if (core.current) {
      core.current.rotation.y = t * 0.12 + s * 2.2
      core.current.rotation.x = Math.sin(t * 0.18) * 0.18 + s * 0.5
    }
    if (rings.current) {
      rings.current.rotation.y = -t * 0.17 - s * 1.4
      rings.current.rotation.z = t * 0.07
    }
    if (shell.current) shell.current.rotation.y = -t * 0.25
    if (inner.current) {
      const p = 1 + Math.sin(t * 0.9) * 0.05
      inner.current.scale.setScalar(p)
    }
    if (dust.current) dust.current.rotation.y = t * 0.02

    if (sats.current) {
      for (let i = 0; i < orbits.length; i++) {
        const o = orbits[i]
        const a = o.phase + t * o.speed
        const x = Math.cos(a) * o.r
        const z = Math.sin(a) * o.r
        const y = Math.sin(a * 1.3) * o.r * 0.22
        dummy.position.set(
          x * Math.cos(o.yaw) - z * Math.sin(o.yaw),
          y + Math.sin(o.tilt) * 2.5,
          x * Math.sin(o.yaw) + z * Math.cos(o.yaw),
        )
        dummy.scale.setScalar(o.size)
        dummy.updateMatrix()
        sats.current.setMatrixAt(i, dummy.matrix)
      }
      sats.current.instanceMatrix.needsUpdate = true
    }
  }

  useEffect(() => {
    if (!calm) return
    scrollCur.current = scrollT.current
    place(0)
    invalidate()
  })

  useFrame((state) => {
    if (calm) return
    scrollCur.current += (scrollT.current - scrollCur.current) * 0.07
    ptrCur.current.x += (ptr.current.x - ptrCur.current.x) * 0.05
    ptrCur.current.y += (ptr.current.y - ptrCur.current.y) * 0.05
    place(state.clock.elapsedTime)
  })

  const seg = lean ? 1 : 2

  return (
    <group ref={rig}>
      <ambientLight intensity={0.5} />
      <pointLight ref={lightA} position={[16, 10, 14]} distance={90} decay={2} />
      <pointLight ref={lightB} position={[-18, -8, 10]} distance={90} decay={2} />
      <pointLight ref={lightC} position={[0, 14, -16]} distance={90} decay={2} />

      <group ref={core}>
        {/* faceted shell — the wireframe that reads as structure */}
        <mesh ref={shell}>
          <icosahedronGeometry args={[6, seg]} />
          <meshStandardMaterial
            ref={shellMat}
            wireframe
            transparent
            metalness={0.6}
            roughness={0.3}
            depthWrite={false}
          />
        </mesh>

        {/* solid core — specular highlights on this are what say "3D" */}
        <mesh ref={inner}>
          <icosahedronGeometry args={[3.4, lean ? 1 : 3]} />
          <meshStandardMaterial
            ref={innerMat}
            metalness={0.95}
            roughness={0.18}
            flatShading
          />
        </mesh>
      </group>

      {/* orbiting rings, each on its own axis */}
      <group ref={rings}>
        <mesh rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[9, 0.05, 8, lean ? 60 : 128]} />
          <meshStandardMaterial ref={ringMats[0]} transparent metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 5, 0]}>
          <torusGeometry args={[11.5, 0.04, 8, lean ? 60 : 128]} />
          <meshStandardMaterial ref={ringMats[1]} transparent metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, -Math.PI / 6, Math.PI / 8]}>
          <torusGeometry args={[14, 0.035, 8, lean ? 60 : 128]} />
          <meshStandardMaterial ref={ringMats[2]} transparent metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* satellites: real spheres that pass in front of and behind the core */}
      <instancedMesh ref={sats} args={[undefined, undefined, SATS]}>
        <sphereGeometry args={[1, lean ? 8 : 16, lean ? 8 : 16]} />
        <meshStandardMaterial ref={satMat} metalness={0.7} roughness={0.2} />
      </instancedMesh>

      {/* far dust for parallax depth */}
      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={dustMat}
          size={0.42}
          sizeAttenuation
          map={sprite}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  )
}

export default function Scene3D({ calm }: { calm: boolean }) {
  const [lean] = useState(
    () => (navigator.hardwareConcurrency || 4) <= 4 || window.innerWidth < 820,
  )

  return (
    <Canvas
      frameloop={calm ? 'demand' : 'always'}
      dpr={[1, lean ? 1.25 : 1.75]}
      camera={{ position: [0, 2, 26], fov: 55, near: 0.1, far: 200 }}
      gl={{
        antialias: !lean,
        alpha: true,
        /* the calm path draws one frame and never loops, so the buffer would
           be cleared before compositing */
        preserveDrawingBuffer: calm,
        powerPreference: 'high-performance',
      }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <World lean={lean} calm={calm} />
    </Canvas>
  )
}
