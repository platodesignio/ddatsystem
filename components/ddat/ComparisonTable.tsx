'use client'

import { DDATCase, RedSignalCode } from '@/lib/ddat/schema'
import { RED_SIGNALS } from '@/lib/ddat/rules'
import { SignalBadge } from './SignalBadge'

interface ComparisonTableProps {
  cases: DDATCase[]
}

export function ComparisonTable({ cases }: ComparisonTableProps) {
  if (cases.length === 0) return <p className="text-gray-400">No cases selected.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/20">
            <th className="px-4 py-3 text-left text-gray-400 font-medium w-24">Signal</th>
            <th className="px-4 py-3 text-left text-gray-400 font-medium w-40">Label</th>
            {cases.map((c) => (
              <th key={c.id} className="px-4 py-3 text-left text-white font-semibold">
                <div className="text-xs text-gray-400">{c.caseId}</div>
                <div className="text-sm truncate max-w-[160px]">{c.title}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RED_SIGNALS.map((signal) => (
            <tr key={signal.code} className="border-b border-white/10 odd:bg-white/5">
              <td className="px-4 py-3 font-mono font-bold text-white">{signal.code}</td>
              <td className="px-4 py-3 text-gray-300">{signal.label}</td>
              {cases.map((c) => (
                <td key={c.id} className="px-4 py-3">
                  <SignalBadge signal={c.signals[signal.code]} size="sm" />
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-b border-white/20 bg-white/10">
            <td className="px-4 py-3 text-gray-400 text-xs font-semibold" colSpan={2}>
              Red Equiv. Count
            </td>
            {cases.map((c) => (
              <td key={c.id} className="px-4 py-3 font-bold text-white">
                {c.auditResult.redSignalEquivalentCount}
              </td>
            ))}
          </tr>
          <tr className="border-b border-white/20 bg-white/10">
            <td className="px-4 py-3 text-gray-400 text-xs font-semibold" colSpan={2}>
              Unknown Count
            </td>
            {cases.map((c) => (
              <td key={c.id} className="px-4 py-3 font-bold text-yellow-400">
                {c.auditResult.unknownCount}
              </td>
            ))}
          </tr>
          <tr className="bg-white/10">
            <td className="px-4 py-3 text-gray-400 text-xs font-semibold" colSpan={2}>
              DDAT Signal
            </td>
            {cases.map((c) => (
              <td key={c.id} className="px-4 py-3">
                <SignalBadge signal={c.auditResult.ddatSignal} size="sm" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
