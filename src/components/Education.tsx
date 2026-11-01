import { BadgeCheck, GraduationCap } from 'lucide-react'
import { certifications, education } from '../data/profile'
import { Reveal, SectionHead } from './ui'

export function Education() {
  return (
    <section id="education" className="section relative">
      <div className="wrap">
        <SectionHead
          index="06"
          eyebrow="Education"
          title={
            <>
              Degree &amp; <span className="grad">certifications.</span>
            </>
          }
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="glass glass-hover h-full rounded-2xl p-6">
              <GraduationCap size={22} style={{ color: 'var(--cyan)' }} aria-hidden />
              <p className="mono mt-4" style={{ color: 'var(--ink-faint)' }}>
                {education.period}
              </p>
              <h3
                className="display mt-2 text-[1.1rem] md:text-[1.3rem]"
                style={{ letterSpacing: '-0.02em', lineHeight: 1.25 }}
              >
                {education.degree}
              </h3>
              <p className="mt-1.5 text-[0.88rem]" style={{ color: 'var(--ink-dim)' }}>
                {education.school}
              </p>

              {/* the one number allowed anywhere on this site */}
              <p
                className="mt-5 inline-flex items-baseline gap-1.5 rounded-full px-3.5 py-1.5"
                style={{
                  border: '1px solid color-mix(in oklab, var(--cyan) 50%, transparent)',
                  background: 'color-mix(in oklab, var(--cyan) 10%, transparent)',
                }}
              >
                <span className="text-[1.15rem] font-semibold" style={{ color: 'var(--cyan)' }}>
                  {education.cgpa}
                </span>
                <span className="mono" style={{ color: 'var(--ink-dim)' }}>
                  CGPA
                </span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="glass glass-hover h-full rounded-2xl p-6">
              <p className="mono" style={{ color: 'var(--ink-faint)' }}>
                Certifications
              </p>
              <ul className="mt-4 grid">
                {certifications.map((c, i) => (
                  <li
                    key={c}
                    className="flex items-center gap-3 py-3.5 text-[0.88rem]"
                    style={{ borderTop: i ? '1px solid var(--line)' : 'none' }}
                  >
                    <BadgeCheck size={17} className="shrink-0" style={{ color: 'var(--cyan)' }} aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
