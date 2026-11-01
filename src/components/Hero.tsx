import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail } from 'lucide-react'
import { Suspense, lazy } from 'react'
import { profile, tracks } from '../data/profile'
import type { Track } from '../data/profile'
import { Btn } from './ui'

/* three.js is ~600 kB. Lazy + Suspense keeps it out of the entry chunk so
   the copy paints first and the scene fades in behind it. */
const NeuralScene = lazy(() => import('../three/NeuralScene'))

const ease = [0.22, 1, 0.36, 1] as const

export function Hero({
  calm,
  track,
  setTrack,
  webgl,
}: {
  calm: boolean
  track: Track
  setTrack: (id: string) => void
  webgl: boolean
}) {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-16"
      aria-label="Introduction"
    >
      {/* CSS fallback stands on its own if WebGL is unavailable or the
          scene chunk never loads */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(120% 90% at 74% 24%, color-mix(in oklab, var(--blue) 24%, transparent) 0%, transparent 56%),' +
            'radial-gradient(90% 70% at 16% 86%, color-mix(in oklab, var(--violet) 20%, transparent) 0%, transparent 60%)',
        }}
      >
        {webgl && (
          <Suspense fallback={null}>
            <NeuralScene calm={calm} />
          </Suspense>
        )}
        {/* keeps the copy legible over the point cloud at every width */}
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--hero-veil)',
          }}
        />
      </div>

      <div className="wrap relative z-10 w-full">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.62fr] lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mono glass mb-7 inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2.5"
              style={{ color: 'var(--ink-dim)' }}
            >
              <span className="relative grid h-2 w-2 place-items-center">
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--cyan)' }}
                />
                {!calm && (
                  <span
                    className="absolute inset-[-5px] animate-ping rounded-full"
                    style={{ border: '1px solid var(--cyan)' }}
                  />
                )}
              </span>
              {profile.availability}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.06, ease }}
              className="display"
              style={{ fontSize: 'clamp(2.7rem, 1.9rem + 4.6vw, 6.2rem)' }}
            >
              YASH
              <br />
              <span className="grad">KOLEKAR</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.14, ease }}
              className="mono mt-4"
              style={{ color: 'var(--cyan)', fontSize: '0.8rem' }}
            >
              {profile.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="mt-5 max-w-[34ch]"
              style={{
                color: 'var(--ink)',
                fontSize: 'clamp(1.15rem, 1rem + 0.7vw, 1.7rem)',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
              }}
            >
              {profile.tagline}
            </motion.p>

            <motion.p
              key={track.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
              className="mt-5 max-w-[52ch]"
              style={{ color: 'var(--ink-dim)' }}
            >
              {track.note}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Btn href="#projects" variant="fill">
                Explore My Work <ArrowRight size={16} aria-hidden />
              </Btn>
              <Btn href={profile.resume.file} external>
                <Download size={16} aria-hidden /> {profile.resume.label}
              </Btn>
              <Btn href="#contact">
                <Mail size={16} aria-hidden /> Let&rsquo;s Connect
              </Btn>
            </motion.div>
          </div>

          {/* role track switcher — retargets project order and skill emphasis */}
          <motion.aside
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="glass rounded-2xl p-4"
            aria-label="Role focus"
          >
            <div className="mono mb-3 flex items-center justify-between gap-2" style={{ color: 'var(--ink-faint)' }}>
              <span>Tailor this page</span>
              <span>{tracks.length} tracks</span>
            </div>

            <div className="grid gap-1" role="group" aria-label="Choose a role track">
              {tracks.map((t) => {
                const on = t.id === track.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTrack(t.id)}
                    aria-pressed={on}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.85rem] font-medium transition-colors duration-250"
                    style={{
                      color: on ? 'var(--ink)' : 'var(--ink-dim)',
                      background: on ? 'var(--surface-2)' : 'transparent',
                      border: `1px solid ${on ? 'var(--line-2)' : 'transparent'}`,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-250"
                      style={{
                        background: on ? 'var(--cyan)' : 'var(--line-2)',
                        boxShadow: on ? '0 0 0 3px color-mix(in oklab, var(--cyan) 22%, transparent)' : 'none',
                      }}
                    />
                    {t.label}
                  </button>
                )
              })}
            </div>

            <p className="mono mt-4 border-t pt-3" style={{ borderColor: 'var(--line)', color: 'var(--ink-faint)' }}>
              Reorders projects &amp; skills
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
