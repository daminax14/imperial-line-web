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
      setFeedback({ type: 'error', text: contact?.messages?.required || 'Please fill in all required fields before sending.' })
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-[12px] font-semibold text-slate-800">{fields.name || 'Full name*'}</label>
        <input
          type="text"
          value={formState.fullName}
          onChange={(event) => setField('fullName', event.target.value)}
          placeholder={fields.namePlaceholder || 'Your full name'}
          className="w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none border border-white/30 focus:border-[#2f6f99]/50"
          required
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.allergic || 'Are you allergic to cats?*'}</legend>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="allergic" className="mr-2" checked={formState.allergic === 'yes'} onChange={() => setField('allergic', 'yes')} required />
          {options.yes || 'Yes'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="allergic" className="mr-2" checked={formState.allergic === 'no'} onChange={() => setField('allergic', 'no')} required />
          {options.no || 'No'}
        </label>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.genderPreference || 'Do you prefer a female or male kitten?*'}</legend>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="gender" className="mr-2" checked={formState.gender === 'female'} onChange={() => setField('gender', 'female')} required />
          {options.female || 'Female'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="gender" className="mr-2" checked={formState.gender === 'male'} onChange={() => setField('gender', 'male')} required />
          {options.male || 'Male'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="gender" className="mr-2" checked={formState.gender === 'none'} onChange={() => setField('gender', 'none')} required />
          {options.noPreference || 'No preference / Not sure yet'}
        </label>
      </fieldset>

      <div className="space-y-2">
        <label className="text-[12px] font-semibold text-slate-800">{fields.specificKitten || 'Are you interested in a specific kitten? *optional'}</label>
        <textarea
          rows={2}
          value={formState.specificKitten}
          onChange={(event) => setField('specificKitten', event.target.value)}
          placeholder={fields.specificKittenPlaceholder || 'Write your message'}
          className="w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none resize-none border border-white/30 focus:border-[#2f6f99]/50"
        ></textarea>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.futureLitter || 'Would you like to reserve a kitten from an upcoming litter? *optional'}</legend>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="futureLitter" className="mr-2" checked={formState.futureLitter === 'yes'} onChange={() => setField('futureLitter', 'yes')} />
          {options.yes || 'Yes'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="futureLitter" className="mr-2" checked={formState.futureLitter === 'no'} onChange={() => setField('futureLitter', 'no')} />
          {options.no || 'No'}
        </label>
      </fieldset>

      <div className="space-y-2">
        <label className="text-[12px] font-semibold text-slate-800">{fields.colorPreference || 'If yes, do you have a color preference? *optional'}</label>
        <input
          type="text"
          value={formState.colorPreference}
          onChange={(event) => setField('colorPreference', event.target.value)}
          placeholder={fields.colorPlaceholder || 'Short answer'}
          className="w-full bg-white/70 text-slate-800 placeholder:text-slate-500 rounded-xl px-4 py-3 outline-none border border-white/30 focus:border-[#2f6f99]/50"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-[12px] font-semibold text-slate-800">{fields.otherPets || 'Do you have other pets?*'}</legend>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="otherPets" className="mr-2" checked={formState.otherPets === 'otherCats'} onChange={() => setField('otherPets', 'otherCats')} required />
          {options.otherCats || 'Yes, I have other cats'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="otherPets" className="mr-2" checked={formState.otherPets === 'otherAnimals'} onChange={() => setField('otherPets', 'otherAnimals')} required />
          {options.noOtherCats || 'Yes, but no other cats'}
        </label>
        <label className="block text-[12px] text-slate-800">
          <input type="radio" name="otherPets" className="mr-2" checked={formState.otherPets === 'wantCat'} onChange={() => setField('otherPets', 'wantCat')} required />
          {options.wantCat || 'No, but I would like a cat'}
        </label>
      </fieldset>

      <div className="space-y-2">
        <label className="text-[12px] font-semibold text-slate-800">{fields.aboutYou || 'Tell us about yourself*'}</label>
        <textarea
          rows={3}
          value={formState.aboutYou}
          onChange={(event) => setField('aboutYou', event.target.value)}
          placeholder={fields.aboutYouPlaceholder || 'Write your message'}
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
          placeholder={fields.emailPlaceholder || 'Your email address'}
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
        {isSubmitting ? (contact?.messages?.sendInProgress || 'Sending...') : contact.submit || 'Send'}
      </button>
    </form>
  )
}
