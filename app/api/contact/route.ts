import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

type ContactPayload = {
  fullName?: string
  allergic?: string
  gender?: string
  specificKitten?: string
  futureLitter?: string
  colorPreference?: string
  otherPets?: string
  aboutYou?: string
  email?: string
}

function required(value: string | undefined) {
  return typeof value === 'string' && value.trim().length > 0
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload

    if (!required(payload.fullName) || !required(payload.email) || !required(payload.aboutYou) || !required(payload.allergic) || !required(payload.gender) || !required(payload.otherPets)) {
      return NextResponse.json({ message: 'Campi obbligatori mancanti.' }, { status: 400 })
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT)
    const smtpSecure = String(process.env.SMTP_SECURE).toLowerCase() === 'true'
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const contactTo = process.env.CONTACT_TO
    const contactFrom = process.env.CONTACT_FROM

    if (!smtpHost || !Number.isFinite(smtpPort) || !smtpUser || !smtpPass || !contactFrom || !contactTo) {
      return NextResponse.json(
        { message: 'Configurazione email mancante. Imposta SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_FROM e CONTACT_TO nelle variabili ambiente.' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const subject = `Nuova richiesta contatto Imperial Line - ${payload.fullName}`
    const text = [
      `Nome: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `Allergico ai gatti: ${payload.allergic}`,
      `Preferenza sesso: ${payload.gender}`,
      `Interesse gattino specifico: ${payload.specificKitten || '-'}`,
      `Interesse prossima cucciolata: ${payload.futureLitter || '-'}`,
      `Preferenza colore: ${payload.colorPreference || '-'}`,
      `Altri animali: ${payload.otherPets}`,
      '',
      'Racconto:',
      payload.aboutYou || '-',
    ].join('\n')

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Nuova richiesta contatto Imperial Line</h2>
        <p><strong>Nome:</strong> ${payload.fullName}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Allergico ai gatti:</strong> ${payload.allergic}</p>
        <p><strong>Preferenza sesso:</strong> ${payload.gender}</p>
        <p><strong>Interesse gattino specifico:</strong> ${payload.specificKitten || '-'}</p>
        <p><strong>Interesse prossima cucciolata:</strong> ${payload.futureLitter || '-'}</p>
        <p><strong>Preferenza colore:</strong> ${payload.colorPreference || '-'}</p>
        <p><strong>Altri animali:</strong> ${payload.otherPets}</p>
        <p><strong>Racconto:</strong><br/>${(payload.aboutYou || '-').replace(/\n/g, '<br/>')}</p>
      </div>
    `

    await transporter.sendMail({
      from: contactFrom,
      to: contactTo,
      replyTo: payload.email,
      subject,
      text,
      html,
    })

    return NextResponse.json({ message: 'Richiesta inviata con successo. Grazie!' })
  } catch {
    return NextResponse.json({ message: 'Errore durante invio richiesta.' }, { status: 500 })
  }
}
