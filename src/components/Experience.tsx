import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import { useState } from 'react'
import { experience } from '../data/profile'
import { Reveal, SectionHead } from './ui'

const ease = [0.22, 1, 0.36, 1] as const

export function Experience() {
  /* newest role open by default; the rest expand on demand */
  const [open, setOpen] = useState<string | null>(experience[0].id)

  return (
    <section id="experience" className="section relative">
      <div className="wrap">
        <SectionHead
          index="03"
          eyebrow="Experience"
          title={
            <>
              Four roles, <span className="grad">one direction.</span>
            </>
          }
        />

        <div className="relative" style={{ perspective: '1400px' }}>
          {/* the timeline spine */}
          <span
            className="absolute top-2 bottom-2 left-[7px] w-px md:left-[calc(11rem+7px)]"
            style={{
              background:
                'linear-gradient(var(--blue), var(--cyan) 45%, var(--violet) 100%)',
              opacity: 0.45,
            }}
            aria-hidden
          />

          {experience.map((r, i) => {
            const isOpen = open === r.id
            return (
              <Reveal key={r.id} delay={i * 0.06}>
                <article className="relative grid gap-3 pb-7 pl-8 md:grid-cols-[11rem_1fr] md:gap-8 md:pl-0">
                  {/* node on the spine */}
                  <span
                    className="absolute top-2 left-0 z-10 grid h-3.5 w-3.5 place-items-center rounded-full md:left-[11rem]"
                    style={{
                      background: 'var(--bg)',
                      border: `2px solid ${r.current ? 'var(--cyan)' : 'var(--line-2)'}`,
                      boxShadow: r.current
                        ? '0 0 0 5px color-mix(in oklab, var(--cyan) 16%, transparent)'
                        : 'none',
                    }}
                    aria-hidden
                  />

                  <div className="md:pr-8 md:text-right">
                    {r.current && (
                      <span
                        className="mono mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[0.6rem]"
                        style={{
                          color: 'var(--cyan)',
                          border: '1px solid color-mix(in oklab, var(--cyan) 50%, transparent)',
                          background: 'color-mix(in oklab, var(--cyan) 10%, transparent)',
                        }}
                      >
                        Current
                      </span>
                    )}
                    <p className="mono" style={{ color: 'var(--ink-faint)' }}>
                      {r.period}
                    </p>
                    <p className="mt-1.5 text-[0.9rem] font-semibold" style={{ color: 'var(--ink)' }}>
                      {r.company}
                    </p>
                    <p
                      className="flex items-center gap-1 text-[0.78rem] md:justify-end"
                      style={{ color: 'var(--ink-faint)' }}
                    >
                      <MapPin size={12} aria-hidden /> {r.location}
                    </p>
                  </div>

                  <div className="glass glass-hover rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : r.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <h3
                        className="display text-[1.05rem] md:text-[1.2rem]"
                        style={{ letterSpacing: '-0.02em' }}
                      >
                        {r.title}
                      </h3>
                      <ChevronDown
                        size={17}
                        aria-hidden
                        className="shrink-0 transition-transform duration-300"
                        style={{
                          color: 'var(--ink-faint)',
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                        }}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.38, ease }}
                          className="overflow-hidden"
                        >
                          <ul className="grid gap-2.5 px-5 pb-5">
                            {r.bullets.map((b) => (
                              <li
                                key={b}
                                className="relative pl-5 text-[0.88rem]"
                                style={{ color: 'var(--ink-dim)', lineHeight: 1.62 }}
                              >
                                <span
                                  className="absolute top-[0.62em] left-0 h-px w-2.5"
                                  style={{ background: 'var(--cyan)' }}
                                  aria-hidden
                                />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
