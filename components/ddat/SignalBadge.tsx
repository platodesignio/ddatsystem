'use client'

import { DDATSignal, RedSignalStatus } from '@/lib/ddat/schema'

type SignalValue = DDATSignal | RedSignalStatus

interface SignalBadgeProps {
  signal: SignalValue
  size?: 'sm' | 'md'
}

function getBadgeClass(signal: SignalValue): string {
  switch (signal) {
    case 'Red':
      return 'bg-red-700 text-white'
    case 'Yellow':
      return 'bg-yellow-600 text-white'
    case 'Green':
      return 'bg-green-700 text-white'
    case 'Yes':
      return 'bg-red-700 text-white'
    case 'No':
      return 'bg-gray-700 text-white'
    case 'Partial':
      return 'bg-orange-700 text-white'
    case 'Unknown':
      return 'bg-slate-600 text-white'
    default:
      return 'bg-gray-700 text-white'
  }
}

export function SignalBadge({ signal, size = 'md' }: SignalBadgeProps) {
  const base = getBadgeClass(signal)
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span className={`inline-flex items-center font-semibold rounded ${base} ${padding}`}>
      {signal}
    </span>
  )
}
