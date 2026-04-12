import { PortableText } from '@portabletext/react'

type RichTextContentProps = {
  value: unknown
  className?: string
}

type PortableTextBlock = {
  _type?: string
}

function isPortableTextValue(value: unknown): value is PortableTextBlock[] {
  return Array.isArray(value) && value.some((item) => item && typeof item === 'object' && '_type' in item)
}

function hasRenderableText(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return false
}

export default function RichTextContent({ value, className }: RichTextContentProps) {
  if (!hasRenderableText(value)) return null

  if (typeof value === 'string') {
    return <p className={className ? `${className} whitespace-pre-line` : 'whitespace-pre-line'}>{value}</p>
  }

  if (!isPortableTextValue(value)) {
    return null
  }

  return (
    <div className={className}>
      <PortableText
        value={value}
        components={{
          block: {
            normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          },
          marks: {
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
          },
        }}
      />
    </div>
  )
}
