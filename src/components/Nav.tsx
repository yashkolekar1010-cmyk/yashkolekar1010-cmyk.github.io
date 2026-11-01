import { Download, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navLinks, profile } from '../data/profile'
import type { Theme } from '../hooks/useTheme'

export function Nav({
  theme,
  toggleTheme,
  active,
}: {
  theme: Theme
  toggleTheme: () => void
  active: string
}) {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setStuck(window.scrollY > 24)
    window.addEventListener('scroll', on, { passive: true })
    on()
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', esc)
    }
  }, [open])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-400"
        style={{
          paddingBlock: stuck ? '0.6rem' : '1.05rem',
          background: stuck ? 'color-mix(in oklab, var(--bg) 76%, transparent)' : 'transparent',
          backdropFilter: stuck ? 'blur(18px) saturate(150%)' : 'none',
          WebkitBackdropFilter: stuck ? 'blur(18px) saturate(150%)' : 'none',
          borderBottom: `1px solid ${stuck ? 'var(--line)' : 'transparent'}`,
        }}
      >
        <div className="wrap flex items-center gap-3">
          <a
            href="#home"
            className="display mr-auto text-[1.05rem] tracking-tight"
            aria-label={`${profile.name} — home`}
          >
            YASH<span style={{ color: 'var(--cyan)' }}>.</span>K
          </a>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={active === l.id ? 'true' : undefined}
                className="relative rounded px-3 py-2 text-[0.85rem] font-medium transition-colors duration-250"
                style={{ color: active === l.id ? 'var(--ink)' : 'var(--ink-dim)' }}
              >
                {l.label}
                <span
                  className="absolute right-3 bottom-1 left-3 h-px origin-left transition-transform duration-300"
                  style={{
                    background: 'linear-gradient(90deg, var(--blue), var(--cyan))',
                    transform: active === l.id ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </a>
            ))}
          </nav>

          {/* hidden under 560px: brand + résumé + theme + burger will not
              fit one row, and the burger is the one that must stay */}
          <a
            href={profile.resume.file}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-[0.78rem] font-semibold transition-colors duration-250 min-[560px]:inline-flex"
            style={{ border: '1px solid var(--line-2)', background: 'var(--surface)' }}
          >
            <Download size={15} aria-hidden /> Resume
          </a>

          <IconBtn
            onClick={toggleTheme}
            label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
          </IconBtn>

          <span className="lg:hidden">
            <IconBtn
              onClick={() => setOpen((o) => !o)}
              label={open ? 'Close menu' : 'Open menu'}
              expanded={open}
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </IconBtn>
          </span>
        </div>
      </header>

      <div
        className="fixed inset-0 z-40 grid place-content-center gap-1 transition-[opacity,visibility] duration-400 lg:hidden"
        style={{
          background: 'color-mix(in oklab, var(--bg) 96%, transparent)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
        }}
      >
        {navLinks.map((l, i) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={() => setOpen(false)}
            className="display text-center transition-all duration-500"
            style={{
              fontSize: 'clamp(1.7rem, 1.3rem + 3vw, 2.6rem)',
              lineHeight: 1.3,
              color: 'var(--ink-dim)',
              opacity: open ? 1 : 0,
              transform: open ? 'none' : 'translateY(14px)',
              transitionDelay: open ? `${60 + i * 45}ms` : '0ms',
            }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  )
}

function IconBtn({
  children,
  onClick,
  label,
  expanded,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  expanded?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      /* shrink-0 matters: flex would otherwise squash these into ovals */
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-250"
      style={{ border: '1px solid var(--line-2)', color: 'var(--ink-dim)' }}
    >
      {children}
    </button>
  )
}
