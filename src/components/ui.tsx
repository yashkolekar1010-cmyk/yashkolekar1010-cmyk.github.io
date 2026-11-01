import { motion, useInView } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRef } from 'react'

/* Shared primitives. Framer Motion covers the scroll reveals, so GSAP is
   not pulled in — three.js is already the heavy dependency here. */

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={seen ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
}: {
  index: string
  eyebrow: string
  title: ReactNode
  lede?: string
}) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <p className="mono flex items-center gap-3" style={{ color: 'var(--ink-faint)' }}>
        <span style={{ color: 'var(--cyan)' }}>{index}</span>
        {eyebrow}
        <span className="hair flex-1" />
      </p>
      <h2
        className="display mt-4 max-w-[22ch]"
        style={{ fontSize: 'clamp(1.9rem, 1.4rem + 1.9vw, 3.1rem)' }}
      >
        {title}
      </h2>
      {lede && (
        <p
          className="mt-4 max-w-[58ch]"
          style={{ color: 'var(--ink-dim)', fontSize: 'clamp(1rem,.95rem+.3vw,1.15rem)' }}
        >
          {lede}
        </p>
      )}
    </Reveal>
  )
}

export function Chip({ label, soft = false }: { label: string; soft?: boolean }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[0.72rem] whitespace-nowrap transition-colors duration-200"
      style={{
        border: `1px ${soft ? 'dashed' : 'solid'} var(--line)`,
        background: soft ? 'transparent' : 'var(--surface)',
        color: soft ? 'var(--ink-faint)' : 'var(--ink-dim)',
      }}
    >
      {label}
    </span>
  )
}

export function KeyChip({ label }: { label: string }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[0.72rem] whitespace-nowrap"
      style={{
        border: '1px solid color-mix(in oklab, var(--blue) 55%, transparent)',
        background: 'color-mix(in oklab, var(--blue) 12%, transparent)',
        color: 'var(--ink)',
      }}
    >
      {label}
    </span>
  )
}

type BtnProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'fill' | 'line'
  small?: boolean
  download?: boolean
  external?: boolean
  className?: string
  ariaLabel?: string
}

export function Btn({
  children,
  href,
  onClick,
  variant = 'line',
  small = false,
  external = false,
  className = '',
  ariaLabel,
}: BtnProps) {
  const base =
    'inline-flex items-center gap-2 rounded-full font-semibold whitespace-nowrap ' +
    'transition-[transform,background-color,border-color,box-shadow,color] duration-300 ' +
    'hover:-translate-y-0.5 active:translate-y-0 ' +
    (small ? 'px-4 py-2 text-[0.78rem]' : 'px-5 py-3 text-[0.88rem]')

  const style =
    variant === 'fill'
      ? {
          background: 'linear-gradient(104deg, var(--blue), var(--violet))',
          color: '#fff',
          border: '1px solid transparent',
          boxShadow: '0 10px 30px -14px var(--glow)',
        }
      : {
          border: '1px solid var(--line-2)',
          color: 'var(--ink)',
          background: 'var(--surface)',
        }

  const cls = `${base} ${className}`

  if (href) {
    return (
      <a
        className={cls}
        style={style}
        href={href}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <button className={cls} style={style} onClick={onClick} aria-label={ariaLabel} type="button">
      {children}
    </button>
  )
}

/** Soft coloured blooms behind a section — the depth under the glass. */
export function Blooms() {
  return (
    <>
      <span
        className="bloom"
        style={{
          width: 380,
          height: 380,
          top: '-6rem',
          right: '-4rem',
          background: 'color-mix(in oklab, var(--blue) 42%, transparent)',
        }}
        aria-hidden
      />
      <span
        className="bloom"
        style={{
          width: 320,
          height: 320,
          bottom: '-6rem',
          left: '-5rem',
          background: 'color-mix(in oklab, var(--violet) 34%, transparent)',
        }}
        aria-hidden
      />
    </>
  )
}
