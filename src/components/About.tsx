import { education, experience, profile } from '../data/profile'
import { Blooms, Reveal, SectionHead } from './ui'

/* Only verified facts become "statistics" — the résumé rules allow CGPA as
   the single number, so nothing here is a fabricated count. */
const facts = [
  { k: 'Experience', v: profile.experienceYears },
  { k: 'Employers', v: String(experience.length) },
  { k: 'Currently', v: `${experience[0].title}, ${experience[0].company}` },
  { k: 'Based', v: `${profile.contact.location} · remote-friendly` },
  { k: 'Core', v: 'Python · FastAPI · LangGraph · RAG' },
  { k: 'Cloud', v: 'AWS (primary)' },
  { k: 'Education', v: `B.Tech CSE · CGPA ${education.cgpa}` },
  { k: 'Availability', v: 'Immediate joiner' },
]

export function About() {
  return (
    <section id="about" className="section relative overflow-hidden">
      <Blooms />
      <div className="wrap relative">
        <SectionHead
          index="01"
          eyebrow="About"
          title={
            <>
              From raw data to a service <span className="grad">people actually use.</span>
            </>
          }
        />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <Reveal>
            <div className="space-y-5" style={{ color: 'var(--ink-dim)' }}>
              <p style={{ color: 'var(--ink)', fontSize: 'clamp(1.05rem,1rem+.4vw,1.25rem)' }}>
                {profile.summary}
              </p>
              <p>
                Most of my work is the unglamorous half of Generative AI — deciding how a
                document gets chunked, why a retrieval returns the wrong passage, what a prompt
                should refuse to answer. I build on{' '}
                <strong style={{ color: 'var(--ink)' }}>LangChain, LangGraph and CrewAI</strong>,
                with Pinecone and FAISS behind them, and I tune accuracy through retrieval and
                prompt design before reaching for a fine-tune.
              </p>
              <p>
                Alongside that sits classical ML — classification, regression and forecasting
                with Scikit-learn, PyTorch and XGBoost — plus the SQL and ETL that keeps the
                inputs honest. Everything ships the same way:{' '}
                <strong style={{ color: 'var(--ink)' }}>FastAPI</strong> services, Docker
                containers, CI/CD on Jenkins, PyTest for the parts that must not break, and{' '}
                <strong style={{ color: 'var(--ink)' }}>AWS</strong> underneath.
              </p>
              <p>
                Right now I&rsquo;m at <strong style={{ color: 'var(--ink)' }}>Infosys</strong> in
                Bengaluru, building LLM chatbot and RAG retrieval components over enterprise
                operations data.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <dl className="glass rounded-2xl p-5">
              {facts.map((f, i) => (
                <div
                  key={f.k}
                  className="grid grid-cols-[7rem_1fr] items-baseline gap-3 py-3 max-[480px]:grid-cols-1 max-[480px]:gap-0.5"
                  style={{ borderTop: i ? '1px solid var(--line)' : 'none' }}
                >
                  <dt className="mono" style={{ color: 'var(--ink-faint)' }}>
                    {f.k}
                  </dt>
                  <dd className="text-[0.88rem] font-medium" style={{ color: 'var(--ink)' }}>
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
