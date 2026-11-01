import { ArrowRight, Check, Copy, Mail, MapPin, Phone } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { useState } from 'react'
import { profile } from '../data/profile'
import { Blooms, Btn, Reveal, SectionHead } from './ui'

/* Web3Forms delivers straight to the inbox with no backend of our own.
   The access key is publishable by design — it only permits submissions
   to the address that created it. */
const KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined
const ENDPOINT = 'https://api.web3forms.com/submit'

type State = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the mailto link beside it still works */
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()

    if (!name || !email || !message) {
      setState('error')
      setMsg('Please fill in your name, email and a message.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState('error')
      setMsg('That email address does not look right.')
      return
    }
    if (!KEY) {
      /* Never pretend it sent. Say what happened and offer the real
         alternative instead of showing a fake success state. */
      setState('error')
      setMsg('The form is not configured yet — please use the email button above.')
      return
    }

    setState('sending')
    setMsg('')

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: KEY,
          subject: String(fd.get('subject') ?? '') || `Portfolio enquiry — ${name}`,
          from_name: name,
          name,
          email,
          message,
          botcheck: fd.get('botcheck') ?? '',
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setState('sent')
        setMsg("Thanks — your message is in. I'll reply within a few hours.")
        form.reset()
      } else {
        throw new Error(data.message || 'Request rejected')
      }
    } catch {
      setState('error')
      setMsg('Could not send just now. Please use the email button above instead.')
    }
  }

  return (
    <section id="contact" className="section relative overflow-hidden">
      <Blooms />
      <div className="wrap relative">
        <SectionHead
          index="07"
          eyebrow="Contact"
          title={
            <>
              Let&rsquo;s talk about the problem{' '}
              <span className="grad">you&rsquo;re actually stuck on.</span>
            </>
          }
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <ul className="grid">
              <Row icon={<Mail size={17} />} value={profile.contact.email} label="Email — usually the fastest" href={`mailto:${profile.contact.email}`} />
              <Row icon={<Phone size={17} />} value={profile.contact.phone} label="Phone" href={`tel:${profile.contact.phoneHref}`} />
              <Row icon={<LinkedinIcon size={17} />} value={profile.contact.linkedinLabel} label="LinkedIn" href={profile.contact.linkedin} external />
              <Row icon={<GithubIcon size={17} />} value={profile.contact.githubLabel} label="GitHub" href={profile.contact.github} external />
              <Row icon={<MapPin size={17} />} value={profile.contact.location} label={profile.availability} />
            </ul>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Btn variant="fill" href={`mailto:${profile.contact.email}`}>
                <Mail size={16} aria-hidden /> Email me
              </Btn>
              <Btn onClick={copyEmail} ariaLabel="Copy email address">
                {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                {copied ? 'Copied' : 'Copy email'}
              </Btn>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form onSubmit={submit} noValidate className="glass rounded-2xl p-5 md:p-6">
              {/* honeypot — bots fill it, people never see it */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                style={{ display: 'none' }}
                aria-hidden
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Field id="name" label="Your name *" placeholder="Jane Doe" autoComplete="name" />
                <Field id="email" label="Your email *" type="email" placeholder="jane@company.com" autoComplete="email" />
              </div>
              <Field id="subject" label="Subject" placeholder="AI Engineer role / RAG project" />
              <Field id="message" label="Message *" textarea placeholder="A couple of lines about what you're building." />

              <button
                type="submit"
                disabled={state === 'sending'}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.88rem] font-semibold transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(104deg, var(--blue), var(--violet))',
                  color: '#fff',
                  boxShadow: '0 10px 30px -14px var(--glow)',
                }}
              >
                {state === 'sending' ? 'Sending…' : 'Send message'}
                {state !== 'sending' && <ArrowRight size={16} aria-hidden />}
              </button>

              <p
                role="status"
                aria-live="polite"
                className="mt-3 min-h-[1.4em] text-[0.85rem]"
                style={{ color: state === 'error' ? '#f08a70' : 'var(--cyan)' }}
              >
                {msg}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Row({
  icon,
  value,
  label,
  href,
  external,
}: {
  icon: React.ReactNode
  value: string
  label: string
  href?: string
  external?: boolean
}) {
  const inner = (
    <>
      <span className="shrink-0" style={{ color: 'var(--cyan)' }} aria-hidden>
        {icon}
      </span>
      <span>
        {value}
        <small className="block text-[0.72rem]" style={{ color: 'var(--ink-faint)' }}>
          {label}
        </small>
      </span>
    </>
  )

  return (
    <li style={{ borderBottom: '1px solid var(--line)' }}>
      {href ? (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="flex items-center gap-3.5 py-3.5 text-[0.88rem] transition-[color,padding] duration-250 hover:pl-1.5"
        >
          {inner}
        </a>
      ) : (
        <span className="flex items-center gap-3.5 py-3.5 text-[0.88rem]">{inner}</span>
      )}
    </li>
  )
}

function Field({
  id,
  label,
  placeholder,
  type = 'text',
  textarea = false,
  autoComplete,
}: {
  id: string
  label: string
  placeholder?: string
  type?: string
  textarea?: boolean
  autoComplete?: string
}) {
  const style = {
    background: 'var(--bg-2)',
    border: '1px solid var(--line)',
    color: 'var(--ink)',
  }
  const cls =
    'mt-1.5 w-full rounded-lg px-3.5 py-3 text-[0.88rem] outline-none transition-colors duration-250 focus:border-[var(--cyan)]'

  return (
    <div className="mt-3 first:mt-0">
      <label htmlFor={id} className="mono" style={{ color: 'var(--ink-faint)' }}>
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={id} rows={5} placeholder={placeholder} className={`${cls} resize-y`} style={style} />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cls}
          style={style}
        />
      )}
    </div>
  )
}
