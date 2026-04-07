import { redirect } from 'next/navigation'

export default async function CatsGroupPage({
  params,
}: {
  params: Promise<{ locale: string; group: string }>
}) {
  const { locale, group } = await params
  redirect(`/${locale}/i-nostri-gatti/${group}/elenco`)
}