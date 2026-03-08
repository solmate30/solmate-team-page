'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

const N = 120
const CONN_DIST = 2.8
const MOUSE_DIST = 3.4

const COLD = new THREE.Color('#94a3b8')
const WARM = new THREE.Color('#f97316')
const tmpColor = new THREE.Color()

interface ParticleConfig {
  basePos: THREE.Vector3
  speed: number
  phaseX: number
  phaseY: number
  phaseZ: number
}

function Scene({ mouseNDC }: { mouseNDC: React.MutableRefObject<THREE.Vector2> }) {
  const { camera } = useThree()

  const configs = useMemo<ParticleConfig[]>(() =>
    Array.from({ length: N }, () => ({
      basePos: new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 13,
        (Math.random() - 0.5) * 5,
      ),
      speed: 0.06 + Math.random() * 0.12,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseZ: Math.random() * Math.PI * 2,
    })), []
  )

  // Particle geometry buffers
  const { pGeo, pPosBuf, pColBuf, pPosArr, pColArr } = useMemo(() => {
    const posArr = new Float32Array(N * 3)
    const colArr = new Float32Array(N * 3)
    configs.forEach((cfg, i) => {
      posArr[i * 3] = cfg.basePos.x
      posArr[i * 3 + 1] = cfg.basePos.y
      posArr[i * 3 + 2] = cfg.basePos.z
      colArr[i * 3] = COLD.r; colArr[i * 3 + 1] = COLD.g; colArr[i * 3 + 2] = COLD.b
    })
    const posBuf = new THREE.BufferAttribute(posArr, 3)
    const colBuf = new THREE.BufferAttribute(colArr, 3)
    posBuf.setUsage(THREE.DynamicDrawUsage)
    colBuf.setUsage(THREE.DynamicDrawUsage)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', posBuf)
    geo.setAttribute('color', colBuf)
    return { pGeo: geo, pPosBuf: posBuf, pColBuf: colBuf, pPosArr: posArr, pColArr: colArr }
  }, [configs])

  // Soft circle texture (works on light background)
  const particleTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64; canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.45, 'rgba(255,255,255,0.6)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  const pMat = useMemo(() => new THREE.PointsMaterial({
    size: 0.22,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    map: particleTex,
    depthWrite: false,
    alphaTest: 0.01,
  }), [particleTex])

  // Connection line buffers
  const MAX_SEGS = 700
  const { cGeo, cMat, cPosBuf, cColBuf, cPosArr, cColArr } = useMemo(() => {
    const posArr = new Float32Array(MAX_SEGS * 6)
    const colArr = new Float32Array(MAX_SEGS * 6)
    const posBuf = new THREE.BufferAttribute(posArr, 3)
    const colBuf = new THREE.BufferAttribute(colArr, 3)
    posBuf.setUsage(THREE.DynamicDrawUsage)
    colBuf.setUsage(THREE.DynamicDrawUsage)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', posBuf)
    geo.setAttribute('color', colBuf)
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    })
    return { cGeo: geo, cMat: mat, cPosBuf: posBuf, cColBuf: colBuf, cPosArr: posArr, cColArr: colArr }
  }, [])

  const curPos = useRef<THREE.Vector3[]>(configs.map(c => c.basePos.clone()))
  const offsets = useRef<THREE.Vector3[]>(Array.from({ length: N }, () => new THREE.Vector3()))
  const warmth = useRef(new Float32Array(N))

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0))
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const tmpVec = useMemo(() => new THREE.Vector3(), [])

  const REPULSION_FORCE = 0.28
  const DAMPING = 0.91
  const MAX_OFFSET = 4.0

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Mouse → world position
    if (mouseNDC.current.x < 900) {
      raycaster.setFromCamera(mouseNDC.current as unknown as THREE.Vector2, camera)
      raycaster.ray.intersectPlane(plane, mouseWorld.current)
    }

    // Floating animation + repulsion offset
    for (let i = 0; i < N; i++) {
      const cfg = configs[i]
      const offset = offsets.current[i]

      // 1. Base floating position
      const floatX = cfg.basePos.x + Math.sin(t * cfg.speed + cfg.phaseX) * 0.6
      const floatY = cfg.basePos.y + Math.cos(t * cfg.speed * 0.8 + cfg.phaseY) * 0.4
      const floatZ = cfg.basePos.z + Math.sin(t * cfg.speed * 0.6 + cfg.phaseZ) * 0.25

      // 2. Repulsion from mouse
      tmpVec.set(floatX, floatY, floatZ)
      const dist = tmpVec.distanceTo(mouseWorld.current)
      if (dist < MOUSE_DIST && dist > 0.01) {
        const strength = (1 - dist / MOUSE_DIST) * REPULSION_FORCE
        tmpVec.sub(mouseWorld.current).normalize().multiplyScalar(strength)
        offset.add(tmpVec)
        if (offset.length() > MAX_OFFSET) offset.setLength(MAX_OFFSET)
      }

      // 3. Damping — always pulls offset back to zero
      offset.multiplyScalar(DAMPING)

      // 4. Final position
      const pos = curPos.current[i]
      pos.x = floatX + offset.x
      pos.y = floatY + offset.y
      pos.z = floatZ + offset.z
      pPosArr[i * 3] = pos.x
      pPosArr[i * 3 + 1] = pos.y
      pPosArr[i * 3 + 2] = pos.z
    }

    // Warmth: mouse proximity + chain propagation
    for (let i = 0; i < N; i++) {
      const nearMouse = curPos.current[i].distanceTo(mouseWorld.current) < MOUSE_DIST
      let connected = false
      if (!nearMouse) {
        for (let j = 0; j < N; j++) {
          if (i === j) continue
          if (
            curPos.current[i].distanceTo(curPos.current[j]) < CONN_DIST &&
            warmth.current[j] > 0.18
          ) {
            connected = true
            break
          }
        }
      }
      const target = nearMouse ? 1.0 : connected ? 0.42 : 0.0
      warmth.current[i] += (target - warmth.current[i]) * 0.065

      const w = warmth.current[i]
      tmpColor.lerpColors(COLD, WARM, w)
      pColArr[i * 3] = tmpColor.r
      pColArr[i * 3 + 1] = tmpColor.g
      pColArr[i * 3 + 2] = tmpColor.b
    }

    // Connection lines between warm particles
    let seg = 0
    for (let i = 0; i < N && seg < MAX_SEGS; i++) {
      for (let j = i + 1; j < N && seg < MAX_SEGS; j++) {
        const dist = curPos.current[i].distanceTo(curPos.current[j])
        if (dist < CONN_DIST) {
          const w = (warmth.current[i] + warmth.current[j]) * 0.5
          if (w > 0.02) {
            const fade = 1 - dist / CONN_DIST
            tmpColor.lerpColors(COLD, WARM, w * fade)
            const b = seg * 6
            cPosArr[b] = curPos.current[i].x; cPosArr[b + 1] = curPos.current[i].y; cPosArr[b + 2] = curPos.current[i].z
            cPosArr[b + 3] = curPos.current[j].x; cPosArr[b + 4] = curPos.current[j].y; cPosArr[b + 5] = curPos.current[j].z
            cColArr[b] = tmpColor.r; cColArr[b + 1] = tmpColor.g; cColArr[b + 2] = tmpColor.b
            cColArr[b + 3] = tmpColor.r; cColArr[b + 4] = tmpColor.g; cColArr[b + 5] = tmpColor.b
            seg++
          }
        }
      }
    }

    cGeo.setDrawRange(0, seg * 2)
    pPosBuf.needsUpdate = true
    pColBuf.needsUpdate = true
    cPosBuf.needsUpdate = true
    cColBuf.needsUpdate = true
  })

  return (
    <>
      <points geometry={pGeo} material={pMat} />
      <lineSegments geometry={cGeo} material={cMat} />
    </>
  )
}

export function HouseScene() {
  const mouseNDC = useRef(new THREE.Vector2(999, 999))
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      mouseNDC.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseNDC.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    const onLeave = () => mouseNDC.current.set(999, 999)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene mouseNDC={mouseNDC} />
      </Canvas>
    </div>
  )
}
