import { ArrowUp, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './components/BrandIcons'
import { useEffect, useMemo, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { HowIWork } from './components/HowIWork'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { navLinks, profile, tracks } from './data/profile'
import { useActiveSection } from './hooks/useActiveSection'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useTheme } from './hooks/useTheme'

/** Checked once: if a WebGL context cannot be created, the CSS gradient
 *  fallback stands alone rather than mounting a broken canvas. */
function webglSupported() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const { theme, toggle } = useTheme()
  const calm = useReducedMotion()
  const ids = useMemo(() => navLinks.map((l) => l.id), [])
  const active = useActiveSection(ids)

  const [webgl] = useState(webglSupported)
  const [trackId, setTrackId] = useState(() => {
    try {
      const saved = localStorage.getItem('yk-track')
      if (saved && tracks.some((t) => t.id === saved)) return saved
    } catch {
      /* private mode */
    }
    return tracks[0].id
  })
  const track = tracks.find((t) => t.id === trackId) ?? tracks[0]

  const setTrack = (id: string) => {
    setTrackId(id)
    try {
      localStorage.setItem('yk-track', id)
    } catch {
      /* private mode */
    }
  }

  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 900)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[99] -translate-y-[200%] rounded-lg px-4 py-2 font-semibold transition-transform duration-250 focus:translate-y-0"
        style={{ background: 'var(--blue)', color: '#fff' }}
      >
        Skip to content
      </a>

      <Nav theme={theme} toggleTheme={toggle} active={active} />

      <main id="main">
        <Hero calm={calm} track={track} setTrack={setTrack} webgl={webgl} />
        <About />
        <Skills track={track} />
        <Experience />
        <Projects track={track} calm={calm} />
        <HowIWork />
        <Education />
        <Contact />
      </main>

      <footer style={{ borderTop: '1px solid var(--line)' }}>
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-8">
          <small style={{ color: 'var(--ink-faint)' }}>
            © {new Date().getFullYear()} {profile.name} — built with React, Three.js and
            React Three Fiber.
          </small>
          <div className="flex gap-2">
            <Social href={`mailto:${profile.contact.email}`} label="Email">
              <Mail size={16} />
            </Social>
            <Social href={profile.contact.linkedin} label="LinkedIn" external>
              <LinkedinIcon size={16} />
            </Social>
            <Social href={profile.contact.github} label="GitHub" external>
              <GithubIcon size={16} />
            </Social>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' })}
        aria-label="Back to top"
        className="fixed right-4 bottom-4 z-40 grid h-11 w-11 place-items-center rounded-full transition-all duration-300"
        style={{
          background: 'linear-gradient(104deg, var(--blue), var(--violet))',
          color: '#fff',
          boxShadow: '0 10px 28px -12px var(--glow)',
          opacity: showTop ? 1 : 0,
          visibility: showTop ? 'visible' : 'hidden',
          transform: showTop ? 'none' : 'translateY(12px) scale(.9)',
        }}
      >
        <ArrowUp size={17} />
      </button>
    </>
  )
}

function Social({
  href,
  label,
  children,
  external,
}: {
  href: string
  label: string
  children: React.ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-250"
      style={{ border: '1px solid var(--line-2)', color: 'var(--ink-dim)' }}
    >
      {children}
    </a>
  )
}
