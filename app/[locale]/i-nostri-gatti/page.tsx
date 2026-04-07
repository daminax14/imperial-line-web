import { redirect } from 'next/navigation'

export default async function CatsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  redirect(`/${locale}/i-nostri-gatti/kings`)
}
