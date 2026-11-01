import { useEffect, useRef } from 'react'

/**
 * Pointer-driven 3D tilt for a card.
 *
 * Two things make this read as depth rather than a flat skew:
 *  - the card's inner layers are offset on Z (`translateZ`), so rotating the
 *    parent moves them by different amounts — real parallax;
 *  - a specular glare follows the pointer, which is how a physical surface
 *    behaves under a light and is most of why it looks dimensional.
 *
 * Fine pointers only: on touch there is no hover to drive it, and tilting
 * under a finger just fights the scroll.
 */
export function useTilt(enabled: boolean, max = 12) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    let rx = 0
    let ry = 0
    let gx = 50
    let gy = 50

    const apply = () => {
      frame = 0
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      el.style.setProperty('--gx', `${gx.toFixed(1)}%`)
      el.style.setProperty('--gy', `${gy.toFixed(1)}%`)
      el.style.setProperty('--glare', '1')
    }

    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      const px = (e.clientX - b.left) / b.width
      const py = (e.clientY - b.top) / b.height
      ry = (px - 0.5) * max
      rx = (py - 0.5) * -max * 0.72
      gx = px * 100
      gy = py * 100
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const leave = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      el.style.transform = ''
      el.style.setProperty('--glare', '0')
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled, max])

  return ref
}
