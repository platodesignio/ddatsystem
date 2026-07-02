'use client'

import { RedSignalCode, RedSignalStatus } from '@/lib/ddat/schema'
import { RED_SIGNAL_MAP } from '@/lib/ddat/rules'
import { SignalBadge } from './SignalBadge'

interface RedSignalRowProps {
  code: RedSignalCode
  status: RedSignalStatus
}

export function RedSignalRow({ code, status }: RedSignalRowProps) {
  const meta = RED_SIGNAL_MAP[code]
  return (
    <tr className="border-b border-white/10 odd:bg-white/5">
      <td className="px-4 py-3 font-mono font-bold text-sm text-white whitespace-nowrap">{code}</td>
      <td className="px-4 py-3 text-sm font-semibold text-white whitespace-nowrap">{meta.label}</td>
      <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">{meta.description}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <SignalBadge signal={status} size="sm" />
      </td>
    </tr>
  )
}
