'use client'

import { FormEvent, useState } from 'react'

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
}: {
  fields: ContactFields
  options: ContactOptions
  contact: ContactTexts
}) {
  const [formState, setFormState] = useState<ContactFormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const setField = (key: keyof ContactFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    if (!formState.fullName || !formState.email || !formState.aboutYou || !formState.allergic || !formState.gender || !formState.otherPets) {
      setFeedback({ type: 'error', text: 'Compila tutti i campi obbligatori prima di inviare.' })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })

      const payload = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(payload.message || 'Invio non riuscito.')
      }

      setFeedback({ type: 'success', text: payload.message || 'Richiesta inviata con successo.' })
      setFormState(initialState)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invio non riuscito.'
      setFeedback({ type: 'error', text: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-[12px] font-semibold text-slate-800">{fields.name || 'Nome e Cognome*'}</label>
        <input
          type="text"
          value={formState.fullName}
          onChange={(event) => setField('fullName', event.target.value)}
          placeholder={fields.namePlaceholder || 'Il tuo nome e cognome'}
          className="w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none border border-white/30 focus:border-[#2f6f99]/50"
          required
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.allergic || 'Sei allergico ai gatti?*'}</legend>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="allergic" className="mr-2" checked={formState.allergic === 'yes'} onChange={() => setField('allergic', 'yes')} required />
          {options.yes || 'Si'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="allergic" className="mr-2" checked={formState.allergic === 'no'} onChange={() => setField('allergic', 'no')} required />
          {options.no || 'No'}
        </label>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.genderPreference || 'Vuoi una femminuccia o un maschietto?*'}</legend>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="gender" className="mr-2" checked={formState.gender === 'female'} onChange={() => setField('gender', 'female')} required />
          {options.female || 'Femmina'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="gender" className="mr-2" checked={formState.gender === 'male'} onChange={() => setField('gender', 'male')} required />
          {options.male || 'Maschio'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="gender" className="mr-2" checked={formState.gender === 'none'} onChange={() => setField('gender', 'none')} required />
          {options.noPreference || 'Non e importante/Non lo so ancora'}
        </label>
      </fieldset>

      <div className="space-y-2">
        <label className="text-[12px] font-semibold text-slate-800">{fields.specificKitten || 'Sei interessato ad un gattino in particolare? *facoltativo'}</label>
        <textarea
          rows={2}
          value={formState.specificKitten}
          onChange={(event) => setField('specificKitten', event.target.value)}
          placeholder={fields.specificKittenPlaceholder || 'Inserisci il tuo messaggio'}
          className="w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none resize-none border border-white/30 focus:border-[#2f6f99]/50"
        ></textarea>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.futureLitter || 'Vuoi prenotare un gattino da una prossima cucciolata? *facoltativo'}</legend>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="futureLitter" className="mr-2" checked={formState.futureLitter === 'yes'} onChange={() => setField('futureLitter', 'yes')} />
          {options.yes || 'Si'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="futureLitter" className="mr-2" checked={formState.futureLitter === 'no'} onChange={() => setField('futureLitter', 'no')} />
          {options.no || 'No'}
        </label>
      </fieldset>

      <div className="space-y-2">
        <label className="text-[12px] font-semibold text-slate-800">{fields.colorPreference || 'Se si, hai qualche preferenza di colore? *facoltativo'}</label>
        <input
          type="text"
          value={formState.colorPreference}
          onChange={(event) => setField('colorPreference', event.target.value)}
          placeholder={fields.colorPlaceholder || 'Risposta breve'}
          className="w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none border border-white/30 focus:border-[#2f6f99]/50"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.otherPets || 'Hai altri animali domestici?*'}</legend>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="otherPets" className="mr-2" checked={formState.otherPets === 'otherCats'} onChange={() => setField('otherPets', 'otherCats')} required />
          {options.otherCats || 'Si, ho altri gatti'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="otherPets" className="mr-2" checked={formState.otherPets === 'otherAnimals'} onChange={() => setField('otherPets', 'otherAnimals')} required />
          {options.noOtherCats || 'Si, ma non ho altri gatti'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="otherPets" className="mr-2" checked={formState.otherPets === 'wantCat'} onChange={() => setField('otherPets', 'wantCat')} required />
          {options.wantCat || 'No, ma vorrei avere un gatto'}
        </label>
      </fieldset>

      <div className="space-y-2">
        <label className="text-[12px] font-semibold text-slate-800">{fields.aboutYou || 'Raccontaci di te*'}</label>
        <textarea
          rows={3}
          value={formState.aboutYou}
          onChange={(event) => setField('aboutYou', event.target.value)}
          placeholder={fields.aboutYouPlaceholder || 'Inserisci il tuo messaggio'}
          className="w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none resize-none border border-white/30 focus:border-[#2f6f99]/50"
          required
        ></textarea>
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-semibold text-slate-800">{fields.email || 'Email*'}</label>
        <input
          type="email"
          value={formState.email}
          onChange={(event) => setField('email', event.target.value)}
          placeholder={fields.emailPlaceholder || 'Il tuo indirizzo email'}
          className="w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none border border-white/30 focus:border-[#2f6f99]/50"
          required
        />
      </div>

      {feedback && (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            feedback.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}
        >
          {feedback.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto md:px-10 bg-[#2f6f99] hover:bg-[#245878] text-white font-semibold py-3 rounded-full text-sm uppercase tracking-[0.18em] transition-colors disabled:opacity-60"
      >
        {isSubmitting ? 'Invio in corso...' : contact.submit || 'Invia'}
      </button>
    </form>
  )
}
