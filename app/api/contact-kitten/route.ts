import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'

export const runtime = 'nodejs'

type KittenInquiryPayload = {
  fullName?: string
  allergic?: string
  specificKitten?: string
  futureLitter?: string
  colorPreference?: string
  aboutYou?: string
  email?: string
  locale?: string
  kittenSlug?: string
  kittenName?: string
  kittenImageUrl?: string
}

type RequestOrigin = {
  ip: string
  country: string
  region: string
  city: string
}

function required(value: string | undefined) {
  return typeof value === 'string' && value.trim().length > 0
}

function getRequestOrigin(headers: Headers): RequestOrigin {
  const forwardedFor = headers.get('x-forwarded-for') || ''
  const firstForwardedIp = forwardedFor.split(',')[0]?.trim()
  const ip =
    firstForwardedIp ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'

  const country = headers.get('x-vercel-ip-country') || 'unknown'
  const region = headers.get('x-vercel-ip-country-region') || 'unknown'
  const city = headers.get('x-vercel-ip-city') || 'unknown'

  return { ip, country, region, city }
}

function buildMessage(payload: KittenInquiryPayload, origin: RequestOrigin) {
  const subject = `Kitten inquiry - ${payload.kittenName || payload.kittenSlug || 'unknown kitten'} - ${payload.fullName}`
  const userLocale = payload.locale || 'unknown'
  const selectedKitten = payload.kittenName || payload.kittenSlug || '-'

  const text = [
    `Navigation language: ${userLocale}`,
    `IP origin: ${origin.ip} (${origin.city}, ${origin.region}, ${origin.country})`,
    `Selected kitten: ${selectedKitten}`,
    `Kitten slug: ${payload.kittenSlug || '-'}`,
    `Kitten image: ${payload.kittenImageUrl || '-'}`,
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Cat allergy: ${payload.allergic}`,
    `Specific kitten note: ${payload.specificKitten || '-'}`,
    `Upcoming litter interest: ${payload.futureLitter || '-'}`,
    `Color preference: ${payload.colorPreference || '-'}`,
    '',
    'Additional notes:',
    payload.aboutYou || '-',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">New kitten inquiry</h2>
      <p><strong>Navigation language:</strong> ${userLocale}</p>
      <p><strong>IP origin:</strong> ${origin.ip} (${origin.city}, ${origin.region}, ${origin.country})</p>
      <p><strong>Selected kitten:</strong> ${selectedKitten}</p>
      <p><strong>Kitten slug:</strong> ${payload.kittenSlug || '-'}</p>
      <p><strong>Kitten image:</strong> ${payload.kittenImageUrl || '-'}</p>
      <p><strong>Name:</strong> ${payload.fullName}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Cat allergy:</strong> ${payload.allergic}</p>
      <p><strong>Specific kitten note:</strong> ${payload.specificKitten || '-'}</p>
      <p><strong>Upcoming litter interest:</strong> ${payload.futureLitter || '-'}</p>
      <p><strong>Color preference:</strong> ${payload.colorPreference || '-'}</p>
      <p><strong>Additional notes:</strong><br/>${(payload.aboutYou || '-').replace(/\n/g, '<br/>')}</p>
    </div>
  `

  return { subject, text, html }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as KittenInquiryPayload
    const origin = getRequestOrigin(request.headers)

    if (!required(payload.fullName) || !required(payload.email) || !required(payload.aboutYou) || !required(payload.allergic)) {
      return NextResponse.json({ message: 'Required fields are missing.' }, { status: 400 })
    }

    const contactTo = process.env.CONTACT_TO
    const contactFrom = process.env.CONTACT_FROM
    const resendApiKey = process.env.RESEND_API_KEY
    const resendFrom = process.env.RESEND_FROM || contactFrom

    if (!contactTo || !contactFrom) {
      return NextResponse.json(
        { message: 'Email configuration is missing. Set at least CONTACT_FROM and CONTACT_TO in environment variables.' },
        { status: 500 }
      )
    }

    const { subject, text, html } = buildMessage(payload, origin)

    let resendError: unknown = null

    if (resendApiKey && resendFrom) {
      try {
        const resend = new Resend(resendApiKey)
        const response = await resend.emails.send({
          from: resendFrom,
          to: contactTo,
          replyTo: payload.email,
          subject,
          text,
          html,
        })

        if (response.error) {
          throw new Error(response.error.message || 'Resend send failed')
        }

        return NextResponse.json({ message: 'Request sent successfully. Thank you!' })
      } catch (error) {
        resendError = error
        console.error('Kitten inquiry API resend error, falling back to SMTP:', error)
      }
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT)
    const smtpSecure = String(process.env.SMTP_SECURE).toLowerCase() === 'true'
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpFrom = process.env.SMTP_FROM || contactFrom

    if (!smtpHost || !Number.isFinite(smtpPort) || !smtpUser || !smtpPass) {
      const reason = resendError ? 'Resend failed and SMTP fallback is not configured.' : 'SMTP fallback is not configured.'
      return NextResponse.json({ message: reason }, { status: 500 })
    }

    if (!smtpFrom) {
      return NextResponse.json({ message: 'SMTP fallback is missing sender address. Set SMTP_FROM or CONTACT_FROM.' }, { status: 500 })
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

    await transporter.verify()

    await transporter.sendMail({
      from: smtpFrom,
      to: contactTo,
      replyTo: payload.email,
      subject,
      text,
      html,
    })

    return NextResponse.json({ message: 'Request sent successfully. Thank you!' })
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; response?: string }
    const details = `${err.code || 'UNKNOWN'} ${err.message || ''} ${err.response || ''}`.toLowerCase()

    let message = 'Error while sending request.'

    if (details.includes('auth') || details.includes('535') || details.includes('invalid login')) {
      message = 'SMTP authentication failed. Check SMTP_USER/SMTP_PASS and SMTP access on your provider.'
    } else if (details.includes('timeout') || details.includes('etimedout') || details.includes('econnrefused')) {
      message = 'SMTP connection failed. Check SMTP_HOST/SMTP_PORT/SMTP_SECURE.'
    } else if (details.includes('self signed') || details.includes('certificate')) {
      message = 'SMTP TLS/SSL error. Verify provider security settings.'
    }

    console.error('Kitten inquiry API email error:', {
      code: err.code,
      message: err.message,
      response: err.response,
    })

    return NextResponse.json({ message }, { status: 500 })
  }
}
