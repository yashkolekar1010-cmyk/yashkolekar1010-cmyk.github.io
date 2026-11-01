import { AnimatePresence, motion } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/profile'
import type { Project, Track } from '../data/profile'
import { Btn, Chip, KeyChip, SectionHead } from './ui'

const ease = [0.22, 1, 0.36, 1] as const

/** Pointer-driven rotateX/rotateY. Inner layers sit on different Z, so the
 *  rotation reads as depth rather than a flat skew. Fine pointers only. */
function useTilt(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    let rx = 0
    let ry = 0
    const apply = () => {
      frame = 0
      el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    }
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      ry = ((e.clientX - b.left) / b.width - 0.5) * 7
      rx = ((e.clientY - b.top) / b.height - 0.5) * -5
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const leave = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      el.style.transform = ''
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled])

  return ref
}

function Card({ p, pos, calm, onOpen }: { p: Project; pos: number; calm: boolean; onOpen: () => void }) {
  const tilt = useTilt(!calm)

  return (
    <article
      style={{
        order: pos,
        perspective: '1100px',
        /* editorial stagger follows VISUAL order, so reordering by track
           never leaves two indented cards adjacent */
        paddingLeft: pos % 2 === 1 ? 'clamp(0rem,4vw,4rem)' : undefined,
        paddingRight: pos % 2 === 0 ? 'clamp(0rem,2vw,2rem)' : undefined,
      }}
    >
      <div
        ref={tilt}
        className="glass glass-hover relative grid gap-6 rounded-2xl p-6 md:grid-cols-[1fr_0.8fr] md:p-8"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <span
          className="display pointer-events-none absolute top-4 right-5 select-none"
          style={{
            fontSize: 'clamp(2.4rem,2rem+2.6vw,4rem)',
            color: 'var(--line)',
            transform: 'translateZ(14px)',
          }}
          aria-hidden
        >
          {String(p.id).padStart(2, '0')}
        </span>

        <div style={{ transform: 'translateZ(26px)' }}>
          <p className="mono mb-2.5" style={{ color: 'var(--cyan)' }}>
            {p.kind}
          </p>
          <h3
            className="display mb-3 max-w-[24ch] text-[1.25rem] md:text-[1.5rem]"
            style={{ letterSpacing: '-0.025em' }}
          >
            {p.title}
          </h3>
          <p className="max-w-[54ch] text-[0.9rem]" style={{ color: 'var(--ink-dim)' }}>
            {p.blurb}
          </p>
        </div>

        <div className="self-end" style={{ transform: 'translateZ(40px)' }}>
          {p.demoNote && (
            <p
              className="mb-4 flex items-start gap-2 rounded-lg px-3 py-2.5 text-[0.74rem]"
              style={{
                border: '1px dashed var(--line-2)',
                color: 'var(--ink-faint)',
                lineHeight: 1.5,
              }}
            >
              <Info size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--cyan)' }} aria-hidden />
              {p.demoNote}
            </p>
          )}

          <div className="mb-4 flex flex-wrap gap-1.5">
            {p.stack.map((s, i) =>
              i < 2 ? <KeyChip key={s} label={s} /> : <Chip key={s} label={s} />,
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Btn small onClick={onOpen}>
              Details
            </Btn>
            {/* only rendered when the repo actually has code in it */}
            {p.repo && (
              <Btn small variant="fill" href={p.repo} external>
                <GithubIcon size={14} /> View the code
              </Btn>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function Modal({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'color-mix(in oklab, var(--bg) 82%, transparent)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      />
      <motion.div
        className="glass relative max-h-[86svh] w-full max-w-[46rem] overflow-y-auto rounded-2xl p-6 md:p-8"
        initial={{ scale: 0.95, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 10 }}
        transition={{ duration: 0.32, ease }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg-2)' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 grid h-9 w-9 shrink-0 place-items-center rounded-full"
          style={{ border: '1px solid var(--line-2)', color: 'var(--ink-dim)' }}
        >
          <X size={16} />
        </button>

        <p className="mono mb-2" style={{ color: 'var(--cyan)' }}>
          {p.kind}
        </p>
        <h3 className="display mb-5 max-w-[22ch] text-[1.4rem] md:text-[1.8rem]">{p.title}</h3>

        <ul className="mb-6 grid gap-3">
          {p.detail.map((d) => (
            <li
              key={d}
              className="relative pl-5 text-[0.9rem]"
              style={{ color: 'var(--ink-dim)', lineHeight: 1.65 }}
            >
              <span
                className="absolute top-[0.65em] left-0 h-px w-2.5"
                style={{ background: 'var(--cyan)' }}
                aria-hidden
              />
              {d}
            </li>
          ))}
        </ul>

        <div className="mb-6 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <Chip key={s} label={s} />
          ))}
        </div>

        {p.repo ? (
          <Btn variant="fill" href={p.repo} external>
            <GithubIcon size={16} /> View the code
          </Btn>
        ) : (
          <p className="text-[0.78rem]" style={{ color: 'var(--ink-faint)' }}>
            No public repository for this one.
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

export function Projects({ track, calm }: { track: Track; calm: boolean }) {
  const [openId, setOpenId] = useState<number | null>(null)
  const open = projects.find((p) => p.id === openId) ?? null

  return (
    <section id="projects" className="section relative">
      <div className="wrap">
        <SectionHead
          index="04"
          eyebrow="Projects"
          title={
            <>
              Four systems, <span className="grad">start to finish.</span>
            </>
          }
          lede="Ordered for the role track you picked above."
        />

        <div className="flex flex-col gap-6 md:gap-9">
          {projects.map((p) => (
            <Card
              key={p.id}
              p={p}
              pos={track.order.indexOf(p.id)}
              calm={calm}
              onOpen={() => setOpenId(p.id)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>{open && <Modal p={open} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </section>
  )
}
