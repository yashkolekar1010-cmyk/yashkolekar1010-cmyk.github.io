import { howIWork } from '../data/profile'
import { Reveal, SectionHead } from './ui'

export function HowIWork() {
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
              <div className="glass glass-hover h-full rounded-2xl p-5">
                <p className="mono" style={{ color: 'var(--cyan)' }}>
                  {h.n}
                </p>
                <h3 className="mt-3 mb-2 text-[0.98rem] font-semibold">{h.title}</h3>
                <p className="text-[0.85rem]" style={{ color: 'var(--ink-dim)' }}>
                  {h.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
