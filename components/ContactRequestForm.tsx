'use client'

import { FormEvent, useMemo, useRef, useState } from 'react'

type ContactFields = {
  name?: string
  namePlaceholder?: string
  allergic?: string
  genderPreference?: string
  specificKitten?: string
  specificKittenPlaceholder?: string
  futureLitter?: string
  colorPreference?: string
  colorPlaceholder?: string
  otherPets?: string
  aboutYou?: string
  aboutYouPlaceholder?: string
  email?: string
  emailPlaceholder?: string
}

type ContactOptions = {
  yes?: string
  no?: string
  female?: string
  male?: string
  noPreference?: string
  otherCats?: string
  noOtherCats?: string
  wantCat?: string
}

type ContactTexts = {
  submit?: string
  messages?: {
    required?: string
    sendFailed?: string
    sendInProgress?: string
    sendSuccess?: string
  }
}

type ContactFormState = {
  fullName: string
  allergic: string
  gender: string
  specificKitten: string
  futureLitter: string
  colorPreference: string
  otherPets: string
  aboutYou: string
  email: string
}

type ContactFieldKey = keyof ContactFormState

type FieldErrors = Partial<Record<ContactFieldKey, string>>

const initialState: ContactFormState = {
  fullName: '',
  allergic: '',
  gender: '',
  specificKitten: '',
  futureLitter: '',
  colorPreference: '',
  otherPets: '',
  aboutYou: '',
  email: '',
}

export default function ContactRequestForm({
  fields,
  options,
  contact,
  locale,
}: {
  fields: ContactFields
  options: ContactOptions
  contact: ContactTexts
  locale: string
}) {
  const [formState, setFormState] = useState<ContactFormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const formRef = useRef<HTMLFormElement | null>(null)

  const requiredFields = useMemo(
    () => [
      { key: 'fullName', label: fields.name || 'Full name' },
      { key: 'allergic', label: fields.allergic || 'Are you allergic to cats?' },
      { key: 'gender', label: fields.genderPreference || 'Do you prefer a female or male kitten?' },
      { key: 'otherPets', label: fields.otherPets || 'Do you have other pets?' },
      { key: 'aboutYou', label: fields.aboutYou || 'Tell us about yourself' },
      { key: 'email', label: fields.email || 'Email' },
    ] as Array<{ key: ContactFieldKey; label: string }>,
    [fields],
  )

  const setField = (key: keyof ContactFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const getFieldClassName = (key: ContactFieldKey) =>
    `w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none border transition-colors ${
      fieldErrors[key]
        ? 'border-rose-400 bg-rose-50/80 focus:border-rose-500'
        : 'border-white/30 focus:border-[#2f6f99]/50'
    }`

  const getChoiceClassName = (key: ContactFieldKey) =>
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
        nextErrors[field.key] = `${field.label} is required.`
      }
    }

    const emailValue = String(formState.email || '').trim()
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = 'Email format is invalid. Use something like name@example.com.'
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
      const errorMessages = Object.values(validationErrors).filter(Boolean)
      setFeedback({
        type: 'error',
        text: errorMessages[0] || 'Please review the highlighted fields before sending.',
      })
      focusFirstInvalidField(validationErrors)
      return
    }

    setFieldErrors({})

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formState, locale }),
      })

      const payload = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(payload.message || contact?.messages?.sendFailed || 'Unable to send request.')
      }

      setFeedback({ type: 'success', text: payload.message || contact?.messages?.sendSuccess || 'Request sent successfully.' })
      setFormState(initialState)
    } catch (error) {
      const message = error instanceof Error ? error.message : contact?.messages?.sendFailed || 'Unable to send request.'
      setFeedback({ type: 'error', text: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} className="space-y-5" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="locale" value={locale} />

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
            <p className="mt-1 text-xs text-rose-600/90">Review the fields highlighted below.</p>
          ) : null}
        </div>
      )}

      <div className="space-y-2" data-field="fullName">
        <label className="text-[12px] font-semibold text-slate-800">{fields.name || 'Full name*'}</label>
        <input
          type="text"
          value={formState.fullName}
          onChange={(event) => setField('fullName', event.target.value)}
          placeholder={fields.namePlaceholder || 'Your full name'}
          className={getFieldClassName('fullName')}
        />
        {fieldErrors.fullName ? <p className="text-xs font-medium text-rose-600">{fieldErrors.fullName}</p> : null}
      </div>

      <fieldset className="space-y-2" data-field="allergic">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.allergic || 'Are you allergic to cats?*'}</legend>
        <label className={getChoiceClassName('allergic')}>
          <input type="radio" name="allergic" className="mr-2" checked={formState.allergic === 'yes'} onChange={() => setField('allergic', 'yes')} />
          {options.yes || 'Yes'}
        </label>
        <label className={getChoiceClassName('allergic')}>
          <input type="radio" name="allergic" className="mr-2" checked={formState.allergic === 'no'} onChange={() => setField('allergic', 'no')} />
          {options.no || 'No'}
        </label>
        {fieldErrors.allergic ? <p className="text-xs font-medium text-rose-600">{fieldErrors.allergic}</p> : null}
      </fieldset>

      <fieldset className="space-y-2" data-field="gender">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.genderPreference || 'Do you prefer a female or male kitten?*'}</legend>
        <label className={getChoiceClassName('gender')}>
          <input type="radio" name="gender" className="mr-2" checked={formState.gender === 'female'} onChange={() => setField('gender', 'female')} />
          {options.female || 'Female'}
        </label>
        <label className={getChoiceClassName('gender')}>
          <input type="radio" name="gender" className="mr-2" checked={formState.gender === 'male'} onChange={() => setField('gender', 'male')} />
          {options.male || 'Male'}
        </label>
        <label className={getChoiceClassName('gender')}>
          <input type="radio" name="gender" className="mr-2" checked={formState.gender === 'none'} onChange={() => setField('gender', 'none')} />
          {options.noPreference || 'No preference / Not sure yet'}
        </label>
        {fieldErrors.gender ? <p className="text-xs font-medium text-rose-600">{fieldErrors.gender}</p> : null}
      </fieldset>

      <div className="space-y-2" data-field="specificKitten">
        <label className="text-[12px] font-semibold text-slate-800">{fields.specificKitten || 'Are you interested in a specific kitten? *optional'}</label>
        <textarea
          rows={2}
          value={formState.specificKitten}
          onChange={(event) => setField('specificKitten', event.target.value)}
          placeholder={fields.specificKittenPlaceholder || 'Write your message'}
          className={getFieldClassName('specificKitten')}
        ></textarea>
      </div>

      <fieldset className="space-y-2" data-field="futureLitter">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.futureLitter || 'Would you like to reserve a kitten from an upcoming litter? *optional'}</legend>
        <label className={getChoiceClassName('futureLitter')}>
          <input type="radio" name="futureLitter" className="mr-2" checked={formState.futureLitter === 'yes'} onChange={() => setField('futureLitter', 'yes')} />
          {options.yes || 'Yes'}
        </label>
        <label className={getChoiceClassName('futureLitter')}>
          <input type="radio" name="futureLitter" className="mr-2" checked={formState.futureLitter === 'no'} onChange={() => setField('futureLitter', 'no')} />
          {options.no || 'No'}
        </label>
      </fieldset>

      <div className="space-y-2" data-field="colorPreference">
        <label className="text-[12px] font-semibold text-slate-800">{fields.colorPreference || 'If yes, do you have a color preference? *optional'}</label>
        <input
          type="text"
          value={formState.colorPreference}
          onChange={(event) => setField('colorPreference', event.target.value)}
          placeholder={fields.colorPlaceholder || 'Short answer'}
          className={getFieldClassName('colorPreference')}
        />
      </div>

      <fieldset className="space-y-2" data-field="otherPets">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.otherPets || 'Do you have other pets?*'}</legend>
        <label className={getChoiceClassName('otherPets')}>
          <input type="radio" name="otherPets" className="mr-2" checked={formState.otherPets === 'otherCats'} onChange={() => setField('otherPets', 'otherCats')} />
          {options.otherCats || 'Yes, I have other cats'}
        </label>
        <label className={getChoiceClassName('otherPets')}>
          <input type="radio" name="otherPets" className="mr-2" checked={formState.otherPets === 'otherAnimals'} onChange={() => setField('otherPets', 'otherAnimals')} />
          {options.noOtherCats || 'Yes, but no other cats'}
        </label>
        <label className={getChoiceClassName('otherPets')}>
          <input type="radio" name="otherPets" className="mr-2" checked={formState.otherPets === 'wantCat'} onChange={() => setField('otherPets', 'wantCat')} />
          {options.wantCat || 'No, but I would like a cat'}
        </label>
        {fieldErrors.otherPets ? <p className="text-xs font-medium text-rose-600">{fieldErrors.otherPets}</p> : null}
      </fieldset>

      <div className="space-y-2" data-field="aboutYou">
        <label className="text-[12px] font-semibold text-slate-800">{fields.aboutYou || 'Tell us about yourself*'}</label>
        <textarea
          rows={3}
          value={formState.aboutYou}
          onChange={(event) => setField('aboutYou', event.target.value)}
          placeholder={fields.aboutYouPlaceholder || 'Write your message'}
          className={getFieldClassName('aboutYou')}
        ></textarea>
        {fieldErrors.aboutYou ? <p className="text-xs font-medium text-rose-600">{fieldErrors.aboutYou}</p> : null}
      </div>

      <div className="space-y-2" data-field="email">
        <label className="text-[12px] font-semibold text-slate-800">{fields.email || 'Email*'}</label>
        <input
          type="email"
          value={formState.email}
          onChange={(event) => setField('email', event.target.value)}
          placeholder={fields.emailPlaceholder || 'Your email address'}
          className={getFieldClassName('email')}
        />
        {fieldErrors.email ? <p className="text-xs font-medium text-rose-600">{fieldErrors.email}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="gold-hover-button w-full md:w-auto md:px-10 bg-[#2f6f99] text-white font-semibold py-3 rounded-full text-sm uppercase tracking-[0.18em] disabled:opacity-60"
      >
        {isSubmitting ? (contact?.messages?.sendInProgress || 'Sending...') : contact.submit || 'Send'}
      </button>
    </form>
  )
}
