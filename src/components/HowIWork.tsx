import { useTilt } from '../hooks/useTilt'
import { howIWork } from '../data/profile'
import { Reveal, SectionHead } from './ui'

export function HowIWork({ calm }: { calm: boolean }) {
  return (
    <section id="how" className="section relative">
      <div className="wrap">
        <SectionHead
          index="05"
          eyebrow="How I work"
          title={
            <>
              The habits behind <span className="grad">the stack.</span>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howIWork.map((h, i) => (
            <Reveal key={h.n} delay={i * 0.07}>
              <Tile calm={calm}>
                <p className="mono" style={{ color: 'var(--cyan)' }}>
                  {h.n}
                </p>
                <h3 className="mt-3 mb-2 text-[0.98rem] font-semibold">{h.title}</h3>
                <p className="text-[0.85rem]" style={{ color: 'var(--ink-dim)' }}>
                  {h.body}
                </p>
              </Tile>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Tile({ calm, children }: { calm: boolean; children: React.ReactNode }) {
  const ref = useTilt(!calm, 10)
  return (
    <div ref={ref} className="glass tilt3d relative h-full rounded-2xl p-5">
      {children}
    </div>
  )
}
