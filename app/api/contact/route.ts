import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

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

    // Verify SMTP connectivity/auth first to provide clearer failures.
    await transporter.verify()

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
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; response?: string }
    const details = `${err.code || 'UNKNOWN'} ${err.message || ''} ${err.response || ''}`.toLowerCase()

    let message = 'Errore durante invio richiesta.'

    if (details.includes('auth') || details.includes('535') || details.includes('invalid login')) {
      message = 'Autenticazione SMTP fallita. Verifica SMTP_USER/SMTP_PASS e l\'abilitazione SMTP su Outlook.'
    } else if (details.includes('timeout') || details.includes('etimedout') || details.includes('econnrefused')) {
      message = 'Connessione SMTP non riuscita. Controlla SMTP_HOST/SMTP_PORT/SMTP_SECURE.'
    } else if (details.includes('self signed') || details.includes('certificate')) {
      message = 'Errore TLS/SSL SMTP. Verifica le impostazioni di sicurezza del provider.'
    }

    console.error('Contact API email error:', {
      code: err.code,
      message: err.message,
      response: err.response,
    })

    return NextResponse.json({ message }, { status: 500 })
  }
}
