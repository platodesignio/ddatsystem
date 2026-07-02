'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
}

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-100 transition-colors"
    >
      {copied ? 'Copied!' : label}
    </button>
  )
}

interface DownloadButtonProps {
  content: string
  filename: string
  mimeType?: string
  label?: string
}

export function DownloadButton({
  content,
  filename,
  mimeType = 'application/json',
  label = 'Download',
}: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 border border-white text-white text-sm font-semibold rounded hover:bg-white/10 transition-colors"
    >
      {label}
    </button>
  )
}
