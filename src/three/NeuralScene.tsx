import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  CanvasTexture,
  Color,
  FogExp2,
  NormalBlending,
  Vector3,
} from 'three'
import type {
  BufferGeometry,
  Group,
  LineBasicMaterial,
  Points,
  PointsMaterial,
  ShaderMaterial,
} from 'three'

/**
 * An embedding space rendered as a neural network: clustered nodes, the
 * edges a retrieval would walk, and pulses travelling those edges.
 *
 * Three things here are deliberate, each one a bug fixed the hard way:
 *  1. Pulses carry a generated radial sprite. PointsMaterial with no `map`
 *     rasterises SQUARES, which read as rendering glitches at this size.
 *  2. Blending is additive on the dark theme and normal on the light one —
 *     additive on a pale background adds toward white and erases the scene.
 *  3. The reduced-motion path renders one still frame and never loops, so
 *     the drawing buffer would be cleared before compositing. That path
 *     needs preserveDrawingBuffer.
 */

const css = (v: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(v).trim()

function radialSprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.3, 'rgba(255,255,255,.6)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return new CanvasTexture(c)
}

const VERT = [
  'attribute float aSize;',
  'varying vec3 vCol;',
  'varying float vFade;',
  'uniform float uScale;',
  'uniform float uMin;',
  'void main() {',
  '  vCol = color;',
  '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
  '  gl_PointSize = aSize * (uScale / -mv.z);',
  '  vFade = clamp(1.0 - (-mv.z - 18.0) / 62.0, uMin, 1.0);',
  '  gl_Position = projectionMatrix * mv;',
  '}',
].join('\n')

const FRAG = [
  'varying vec3 vCol;',
  'varying float vFade;',
  'uniform float uAlpha;',
  'void main() {',
  '  vec2 d = gl_PointCoord - vec2(0.5);',
  '  float r = dot(d, d);',
  '  if (r > 0.25) discard;',
  '  float a = smoothstep(0.25, 0.015, r);',
  '  gl_FragColor = vec4(vCol, a * vFade * uAlpha);',
  '}',
].join('\n')

interface NetProps {
  nodes: number
  clusters: number
  pulses: number
  calm: boolean
}

function Network({ nodes: NODES, clusters: CLUST, pulses: PULSES, calm }: NetProps) {
  const group = useRef<Group>(null!)
  const nodePts = useRef<Points>(null!)
  const nodeMat = useRef<ShaderMaterial>(null!)
  const edgeMat = useRef<LineBasicMaterial>(null!)
  const pulseGeo = useRef<BufferGeometry>(null!)
  const pulseMat = useRef<PointsMaterial>(null!)

  const { gl, camera, scene, invalidate } = useThree()
  const sprite = useMemo(radialSprite, [])

  /* geometry: a handful of dense neighbourhoods, the way embeddings
     actually land, rather than a uniform cloud */
  const geo = useMemo(() => {
    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.9

    const centres: Vector3[] = []
    for (let i = 0; i < CLUST; i++) {
      const phi = Math.acos(rnd(-1, 1))
      const the = rnd(0, Math.PI * 2)
      const r = rnd(9, 19)
      centres.push(
        new Vector3(
          r * Math.sin(phi) * Math.cos(the),
          r * Math.sin(phi) * Math.sin(the) * 0.72,
          r * Math.cos(phi),
        ),
      )
    }

    const pos = new Float32Array(NODES * 3)
    const col = new Float32Array(NODES * 3)
    const size = new Float32Array(NODES)
    const cluster = new Int32Array(NODES)

    for (let i = 0; i < NODES; i++) {
      const ci = i % CLUST
      const c = centres[ci]
      const spread = rnd(2.2, 5.4)
      pos[i * 3] = c.x + gauss() * spread
      pos[i * 3 + 1] = c.y + gauss() * spread
      pos[i * 3 + 2] = c.z + gauss() * spread
      size[i] = rnd(1.6, 5.2)
      cluster[i] = ci
    }

    /* edges: chain each node to the next in its cluster, plus a few extra
       within-cluster links so the graph reads as connected */
    const pairs: number[] = []
    for (let i = 0; i < NODES; i++) {
      const j = i + CLUST
      if (j < NODES) pairs.push(i, j)
      if (Math.random() < 0.16) {
        const k = (i + CLUST * (2 + Math.floor(Math.random() * 3))) % NODES
        if (cluster[k] === cluster[i]) pairs.push(i, k)
      }
    }
    const edgePos = new Float32Array(pairs.length * 3)
    for (let n = 0; n < pairs.length; n++) {
      const p = pairs[n] * 3
      edgePos[n * 3] = pos[p]
      edgePos[n * 3 + 1] = pos[p + 1]
      edgePos[n * 3 + 2] = pos[p + 2]
    }

    return { pos, col, size, cluster, pairs, edgePos }
  }, [NODES, CLUST])

  const pulseState = useMemo(
    () =>
      Array.from({ length: PULSES }, () => ({
        e: Math.floor(Math.random() * (geo.pairs.length / 2)) * 2,
        t: Math.random(),
        v: 0.0035 + Math.random() * 0.0085,
      })),
    [PULSES, geo.pairs.length],
  )
  const pulsePos = useMemo(() => new Float32Array(Math.max(PULSES, 1) * 3), [PULSES])

  /* theme: recolour and re-blend without rebuilding geometry */
  useEffect(() => {
    const apply = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light'
      const a = new Color(css('--scene-a'))
      const b = new Color(css('--scene-b'))
      const c = new Color(css('--scene-c'))
      const edge = new Color(css('--scene-edge'))
      const tmp = new Color()

      for (let i = 0; i < NODES; i++) {
        const m = geo.cluster[i] % 3
        tmp.copy(m === 0 ? a : m === 1 ? b : c)
        geo.col[i * 3] = tmp.r
        geo.col[i * 3 + 1] = tmp.g
        geo.col[i * 3 + 2] = tmp.b
      }
      if (nodePts.current) {
        const attr = nodePts.current.geometry.getAttribute('color') as BufferAttribute
        if (attr) attr.needsUpdate = true
      }

      const blend = light ? NormalBlending : AdditiveBlending
      if (nodeMat.current) {
        nodeMat.current.blending = blend
        nodeMat.current.uniforms.uMin.value = light ? 0.28 : 0.16
        nodeMat.current.uniforms.uAlpha.value = light ? 0.72 : 0.95
        nodeMat.current.needsUpdate = true
      }
      if (edgeMat.current) {
        edgeMat.current.color.copy(edge)
        edgeMat.current.opacity = light ? 0.26 : 0.34
      }
      if (pulseMat.current) {
        pulseMat.current.color.copy(b)
        pulseMat.current.blending = blend
        pulseMat.current.needsUpdate = true
      }

      /* depth fog is tuned for near-black; on paper it erases everything */
      scene.fog = new FogExp2(
        new Color(css('--scene-bg')).getHex(),
        light ? 0.0065 : 0.016,
      )
      invalidate()
    }

    apply()
    window.addEventListener('yk-themechange', apply)
    return () => window.removeEventListener('yk-themechange', apply)
  }, [NODES, geo, scene, invalidate])

  /* pointer parallax */
  const target = useRef({ x: 0, y: 0 })
  const cur = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (calm) return
    const on = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [calm])

  useEffect(() => {
    if (!calm) return
    group.current.rotation.y = 0.5
    invalidate()
  }, [calm, invalidate])

  useFrame(() => {
    if (calm) return

    cur.current.x += (target.current.x - cur.current.x) * 0.045
    cur.current.y += (target.current.y - cur.current.y) * 0.045

    group.current.rotation.y += 0.00085
    group.current.rotation.x = cur.current.y * 0.17
    group.current.rotation.z = cur.current.x * 0.045

    camera.position.x = cur.current.x * 4.2
    camera.position.y = -cur.current.y * 2.8
    camera.lookAt(0, 0, 0)

    if (PULSES > 0 && pulseGeo.current) {
      for (let i = 0; i < pulseState.length; i++) {
        const s = pulseState[i]
        s.t += s.v
        if (s.t > 1) {
          s.t = 0
          s.e = Math.floor(Math.random() * (geo.pairs.length / 2)) * 2
        }
        const p1 = geo.pairs[s.e] * 3
        const p2 = geo.pairs[s.e + 1] * 3
        pulsePos[i * 3] = geo.pos[p1] + (geo.pos[p2] - geo.pos[p1]) * s.t
        pulsePos[i * 3 + 1] = geo.pos[p1 + 1] + (geo.pos[p2 + 1] - geo.pos[p1 + 1]) * s.t
        pulsePos[i * 3 + 2] = geo.pos[p1 + 2] + (geo.pos[p2 + 2] - geo.pos[p1 + 2]) * s.t
      }
      const attr = pulseGeo.current.getAttribute('position') as BufferAttribute
      if (attr) attr.needsUpdate = true
    }
  })

  const scale = gl.getPixelRatio() * 46

  return (
    <group ref={group}>
      <points ref={nodePts} name="nodes">
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geo.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[geo.col, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[geo.size, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={nodeMat}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={{
            uScale: { value: scale },
            uMin: { value: 0.16 },
            uAlpha: { value: 0.95 },
          }}
          transparent
          depthWrite={false}
          vertexColors
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geo.edgePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={edgeMat} transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      {PULSES > 0 && (
        <points>
          <bufferGeometry ref={pulseGeo}>
            <bufferAttribute attach="attributes-position" args={[pulsePos, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={pulseMat}
            size={3.2}
            sizeAttenuation
            map={sprite}
            transparent
            opacity={0.95}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  )
}

export default function NeuralScene({ calm }: { calm: boolean }) {
  /* Phones and low-core machines get a materially lighter scene rather than
     no scene at all — the goal is that it stays smooth, not that it hides. */
  const [lean] = useState(
    () => (navigator.hardwareConcurrency || 4) <= 4 || window.innerWidth < 820,
  )

  return (
    <Canvas
      frameloop={calm ? 'demand' : 'always'}
      dpr={[1, lean ? 1 : 1.75]}
      camera={{ position: [0, 0, 48], fov: 52, near: 0.1, far: 220 }}
      gl={{
        antialias: !lean,
        alpha: true,
        /* only matters on the calm path, where nothing redraws the buffer */
        preserveDrawingBuffer: calm,
        powerPreference: 'high-performance',
      }}
      style={{ pointerEvents: 'none' }}
    >
      <Network
        nodes={lean ? 620 : 1500}
        clusters={lean ? 7 : 10}
        pulses={lean ? 0 : 14}
        calm={calm}
      />
    </Canvas>
  )
}
