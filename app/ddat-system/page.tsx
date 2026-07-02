'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DDATCase, RedSignalCode, RedSignalStatus } from '@/lib/ddat/schema'
import { getCases, seedInitialCasesIfEmpty, resetToSeedCases } from '@/lib/ddat/storage'
import { RED_SIGNALS } from '@/lib/ddat/rules'
import { DDATNav } from '@/components/ddat/DDATNav'
import { SignalBadge } from '@/components/ddat/SignalBadge'

const SIGNAL_CODES: RedSignalCode[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']

export default function DDATDashboard() {
  const [cases, setCases] = useState<DDATCase[]>([])

  useEffect(() => {
    seedInitialCasesIfEmpty()
    setCases(getCases())
  }, [])

  function handleReset() {
    if (confirm('Reset to the three seed cases? All other cases will be removed.')) {
      resetToSeedCases()
      setCases(getCases())
    }
  }

  const redCount = cases.filter((c) => c.auditResult.ddatSignal === 'Red').length
  const yellowCount = cases.filter((c) => c.auditResult.ddatSignal === 'Yellow').length
  const greenCount = cases.filter((c) => c.auditResult.ddatSignal === 'Green').length

  // Compute R1-R8 distribution across all cases
  const signalDist = SIGNAL_CODES.map((code) => {
    const yes = cases.filter((c) => c.signals[code] === 'Yes').length
    const partial = cases.filter((c) => c.signals[code] === 'Partial').length
    const unknown = cases.filter((c) => c.signals[code] === 'Unknown').length
    return { code, yes, partial, unknown }
  })

  const recentCases = [...cases].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5)

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <DDATNav />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">DDAT Evidence System v0.1</h1>
            <p className="text-gray-400 mt-1">
              Decision Direction Audit Theory — Internal Evidence Module
            </p>
          </div>
          <button
            onClick={handleReset}
            className="shrink-0 px-3 py-2 text-xs border border-white/20 text-gray-400 rounded hover:border-white/40 hover:text-white transition-colors"
          >
            Reset Demo Cases
          </button>
        </div>

        {/* PII Warning */}
        <div className="mb-8 border border-red-800 bg-red-900/20 rounded-lg px-5 py-4">
          <p className="text-red-400 text-sm font-semibold">
            Zero-PII mode: Do not enter names, emails, resumes, medical records, demographic
            attributes, or raw personal data. DDAT audits decision architectures, not people.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Cases', value: cases.length, color: 'text-white' },
            { label: 'Red', value: redCount, color: 'text-red-400' },
            { label: 'Yellow', value: yellowCount, color: 'text-yellow-400' },
            { label: 'Green', value: greenCount, color: 'text-green-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#0f1f3a] border border-white/10 rounded-lg px-6 py-5"
            >
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Red Signal Distribution */}
          <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
            <h2 className="text-white font-semibold text-lg mb-4">Red Signal Distribution</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 pb-2 font-medium">Code</th>
                  <th className="text-left text-gray-400 pb-2 font-medium">Label</th>
                  <th className="text-center text-red-400 pb-2 font-medium">Yes</th>
                  <th className="text-center text-orange-400 pb-2 font-medium">Partial</th>
                  <th className="text-center text-slate-400 pb-2 font-medium">Unknown</th>
                </tr>
              </thead>
              <tbody>
                {signalDist.map((row, i) => {
                  const meta = RED_SIGNALS.find((s) => s.code === row.code)!
                  return (
                    <tr key={row.code} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
                      <td className="py-2 font-mono font-bold text-white">{row.code}</td>
                      <td className="py-2 text-gray-300">{meta.label}</td>
                      <td className="py-2 text-center text-red-400 font-semibold">{row.yes || '—'}</td>
                      <td className="py-2 text-center text-orange-400 font-semibold">{row.partial || '—'}</td>
                      <td className="py-2 text-center text-slate-400">{row.unknown || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Recent Cases */}
          <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
            <h2 className="text-white font-semibold text-lg mb-4">Recent Cases</h2>
            {recentCases.length === 0 ? (
              <p className="text-gray-400 text-sm">No cases yet.</p>
            ) : (
              <div className="space-y-3">
                {recentCases.map((c) => (
                  <Link
                    key={c.id}
                    href={`/ddat-system/cases/${c.id}`}
                    className="flex items-center justify-between p-3 border border-white/10 rounded hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-white">
                        {c.caseId}
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-[220px]">{c.title}</div>
                    </div>
                    <SignalBadge signal={c.auditResult.ddatSignal} size="sm" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/ddat-system/new"
            className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded hover:bg-gray-100 transition-colors"
          >
            + New Case
          </Link>
          <Link
            href="/ddat-system/cases"
            className="px-5 py-2.5 border border-white text-white font-semibold text-sm rounded hover:bg-white/10 transition-colors"
          >
            Case Ledger
          </Link>
          <Link
            href="/ddat-system/compare"
            className="px-5 py-2.5 border border-white text-white font-semibold text-sm rounded hover:bg-white/10 transition-colors"
          >
            Compare
          </Link>
          <Link
            href="/ddat-system/reports"
            className="px-5 py-2.5 border border-white text-white font-semibold text-sm rounded hover:bg-white/10 transition-colors"
          >
            Reports
          </Link>
        </div>
      </main>
    </div>
  )
}
