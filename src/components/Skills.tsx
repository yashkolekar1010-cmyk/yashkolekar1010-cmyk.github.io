import { skills } from '../data/profile'
import type { Track } from '../data/profile'
import { Chip, Reveal, SectionHead } from './ui'

const TIER_LABEL = { core: 'Core', strong: 'Strong', working: 'Working' } as const
const TIER_DOTS = { core: 3, strong: 2, working: 1 } as const

/**
 * Skills are listed at the depth they can be defended at. Anything the
 * résumé marks "(basic)" renders as a dashed chip and never as core — the
 * qualifier is part of the claim, not decoration.
 */
export function Skills({ track }: { track: Track }) {
  return (
    <section id="skills" className="section relative">
      <div className="wrap">
        <SectionHead
          index="02"
          eyebrow="Skills"
          title={
            <>
              What I actually <span className="grad">reach for.</span>
            </>
          }
          lede="Listed at the depth I'd defend in an interview. Anything I've only worked with occasionally is marked as such rather than padded into the main list."
        />

        <div style={{ borderTop: '1px solid var(--line-2)' }}>
          {skills.map((g, i) => {
            const lead = track.lead.includes(g.id)
            return (
              <Reveal key={g.id} delay={i * 0.04}>
                <div
                  className="grid items-start gap-4 py-5 transition-[background-color,padding] duration-300 md:grid-cols-[15rem_1fr_auto] md:gap-8"
                  style={{
                    borderBottom: '1px solid var(--line)',
                    background: lead
                      ? 'color-mix(in oklab, var(--blue) 7%, transparent)'
                      : 'transparent',
                    paddingInline: lead ? '0.8rem' : 0,
                  }}
                >
                  <h3
                    className="text-[1.05rem] font-semibold"
                    style={{ color: lead ? 'var(--cyan)' : 'var(--ink)' }}
                  >
                    {g.name}
                    <span className="mono mt-1 block" style={{ color: 'var(--ink-faint)' }}>
                      {g.note}
                    </span>
                  </h3>

                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <Chip key={it.label} label={it.label} soft={it.soft} />
                    ))}
                  </div>

                  <p
                    className="mono flex items-center gap-2 whitespace-nowrap max-md:order-first"
                    style={{ color: 'var(--ink-faint)' }}
                  >
                    {TIER_LABEL[g.tier]}
                    <span className="flex gap-[3px]">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-[5px] w-[5px] rounded-full"
                          style={{
                            background:
                              d < TIER_DOTS[g.tier] ? 'var(--cyan)' : 'var(--line-2)',
                          }}
                        />
                      ))}
                    </span>
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
