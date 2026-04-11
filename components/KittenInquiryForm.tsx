'use client'

import { FormEvent, useMemo, useRef, useState } from 'react'

type KittenRef = {
  slug: string
  name: string
  imageUrl?: string
}

type FormState = {
  fullName: string
  allergic: string
  specificKitten: string
  futureLitter: string
  colorPreference: string
  aboutYou: string
  email: string
}

type FieldKey = keyof FormState
type FieldErrors = Partial<Record<FieldKey, string>>

const initialState: FormState = {
  fullName: '',
  allergic: '',
  specificKitten: '',
  futureLitter: '',
  colorPreference: '',
  aboutYou: '',
  email: '',
}

export default function KittenInquiryForm({ locale, kitten }: { locale: string; kitten: KittenRef }) {
  const [formState, setFormState] = useState<FormState>(initialState)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  const requiredFields = useMemo(
    () => [
      { key: 'fullName', label: 'Nome e cognome' },
      { key: 'allergic', label: 'Allergie ai gatti' },
      { key: 'aboutYou', label: 'Raccontaci di te' },
      { key: 'email', label: 'Email' },
    ] as Array<{ key: FieldKey; label: string }>,
    [],
  )

  const setField = (key: FieldKey, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const getFieldClassName = (key: FieldKey) =>
    `w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none border transition-colors ${
      fieldErrors[key]
        ? 'border-rose-400 bg-rose-50/80 focus:border-rose-500'
        : 'border-white/30 focus:border-[#2f6f99]/50'
    }`

  const getChoiceClassName = (key: FieldKey) =>
    `block rounded-xl border px-3 py-2 text-[12px] text-slate-800 transition-colors ${
      fieldErrors[key]
        ? 'border-rose-300 bg-rose-50/70'
        : 'border-transparent hover:border-[#2f6f99]/20 hover:bg-white/35'
    }`

  function validateForm() {
    const nextErrors: FieldErrors = {}

    for (const field of requiredFields) {
      const value = formState[field.key]
      if (!String(value || '').trim()) {
        nextErrors[field.key] = `${field.label} obbligatorio.`
      }
    }

    const emailValue = String(formState.email || '').trim()
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = 'Formato email non valido. Usa ad esempio nome@example.com.'
    }

    return nextErrors
  }

  function focusFirstInvalidField(errors: FieldErrors) {
    const firstInvalidKey = requiredFields.find((field) => errors[field.key])?.key
    if (!firstInvalidKey || !formRef.current) return

    requestAnimationFrame(() => {
      const section = formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalidKey}"]`)
      section?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const focusTarget = section?.querySelector<HTMLElement>('input, textarea')
      focusTarget?.focus()
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setFeedback({
        type: 'error',
        text: Object.values(validationErrors)[0] || 'Controlla i campi evidenziati prima di inviare.',
      })
      focusFirstInvalidField(validationErrors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact-kitten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          locale,
          kittenSlug: kitten.slug,
          kittenName: kitten.name,
          kittenImageUrl: kitten.imageUrl,
        }),
      })

      const payload = (await response.json()) as { message?: string }
      if (!response.ok) throw new Error(payload.message || 'Errore durante l invio.')

      setFeedback({ type: 'success', text: payload.message || 'Richiesta inviata correttamente. Grazie.' })
      setFormState(initialState)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore durante l invio.'
      setFeedback({ type: 'error', text: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} className="space-y-5" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="kittenSlug" value={kitten.slug} />
      <input type="hidden" name="kittenName" value={kitten.name} />

      <div className="rounded-2xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-4 flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/70 bg-slate-100 flex-shrink-0">
          {kitten.imageUrl ? (
            <img src={kitten.imageUrl} alt={kitten.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 text-xl">◦</div>
          )}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2f6f99]/75">Gattino selezionato</p>
          <p className="text-lg font-serif italic text-[#1f3c57] leading-tight">{kitten.name}</p>
        </div>
      </div>

      {feedback && (
        <div
          className={`rounded-2xl border px-4 py-3.5 text-sm shadow-sm ${
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50/90 text-emerald-700'
              : 'border-rose-200 bg-rose-50/95 text-rose-700'
          }`}
          role="alert"
          aria-live="polite"
        >
          <p className="font-semibold">{feedback.text}</p>
          {feedback.type === 'error' && Object.keys(fieldErrors).length > 0 ? (
            <p className="mt-1 text-xs text-rose-600/90">Controlla i campi evidenziati qui sotto.</p>
          ) : null}
        </div>
      )}

      <div className="space-y-2" data-field="fullName">
        <label className="text-[12px] font-semibold text-slate-800">Nome e cognome*</label>
        <input
          type="text"
          value={formState.fullName}
          onChange={(event) => setField('fullName', event.target.value)}
          placeholder="Il tuo nome completo"
          className={getFieldClassName('fullName')}
        />
        {fieldErrors.fullName ? <p className="text-xs font-medium text-rose-600">{fieldErrors.fullName}</p> : null}
      </div>

      <fieldset className="space-y-2" data-field="allergic">
        <legend className="text-[12px] font-semibold text-slate-800">Sei allergico ai gatti?*</legend>
        <label className={getChoiceClassName('allergic')}>
          <input type="radio" name="allergic" className="mr-2" checked={formState.allergic === 'yes'} onChange={() => setField('allergic', 'yes')} />
          Sì
        </label>
        <label className={getChoiceClassName('allergic')}>
          <input type="radio" name="allergic" className="mr-2" checked={formState.allergic === 'no'} onChange={() => setField('allergic', 'no')} />
          No
        </label>
        {fieldErrors.allergic ? <p className="text-xs font-medium text-rose-600">{fieldErrors.allergic}</p> : null}
      </fieldset>

      <div className="space-y-2" data-field="specificKitten">
        <label className="text-[12px] font-semibold text-slate-800">Vuoi proprio questo gattino o vuoi valutarne altri? (opzionale)</label>
        <textarea
          rows={2}
          value={formState.specificKitten}
          onChange={(event) => setField('specificKitten', event.target.value)}
          placeholder={`Es. Sono interessato a ${kitten.name}, ma valuto anche alternative`}
          className={getFieldClassName('specificKitten')}
        ></textarea>
      </div>

      <fieldset className="space-y-2" data-field="futureLitter">
        <legend className="text-[12px] font-semibold text-slate-800">Vuoi prenotare anche per una prossima cucciolata? (opzionale)</legend>
        <label className={getChoiceClassName('futureLitter')}>
          <input type="radio" name="futureLitter" className="mr-2" checked={formState.futureLitter === 'yes'} onChange={() => setField('futureLitter', 'yes')} />
          Sì
        </label>
        <label className={getChoiceClassName('futureLitter')}>
          <input type="radio" name="futureLitter" className="mr-2" checked={formState.futureLitter === 'no'} onChange={() => setField('futureLitter', 'no')} />
          No
        </label>
      </fieldset>

      <div className="space-y-2" data-field="colorPreference">
        <label className="text-[12px] font-semibold text-slate-800">Preferenze di colore (opzionale)</label>
        <input
          type="text"
          value={formState.colorPreference}
          onChange={(event) => setField('colorPreference', event.target.value)}
          placeholder="Es. Neva Masquerade, Blue tabby, ..."
          className={getFieldClassName('colorPreference')}
        />
      </div>

      <div className="space-y-2" data-field="aboutYou">
        <label className="text-[12px] font-semibold text-slate-800">Raccontaci di te*</label>
        <textarea
          rows={4}
          value={formState.aboutYou}
          onChange={(event) => setField('aboutYou', event.target.value)}
          placeholder="Parlaci della tua famiglia, casa, esperienza con i gatti, ecc."
          className={getFieldClassName('aboutYou')}
        ></textarea>
        {fieldErrors.aboutYou ? <p className="text-xs font-medium text-rose-600">{fieldErrors.aboutYou}</p> : null}
      </div>

      <div className="space-y-2" data-field="email">
        <label className="text-[12px] font-semibold text-slate-800">Email*</label>
        <input
          type="email"
          value={formState.email}
          onChange={(event) => setField('email', event.target.value)}
          placeholder="La tua email"
          className={getFieldClassName('email')}
        />
        {fieldErrors.email ? <p className="text-xs font-medium text-rose-600">{fieldErrors.email}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="gold-hover-button w-full md:w-auto md:px-10 bg-[#2f6f99] text-white font-semibold py-3 rounded-full text-sm uppercase tracking-[0.18em] disabled:opacity-60"
      >
        {isSubmitting ? 'Invio in corso...' : 'Invia richiesta informazioni'}
      </button>
    </form>
  )
}
