'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DDATCase, DDATSignal } from '@/lib/ddat/schema'
import { getCases } from '@/lib/ddat/storage'
import { DDATNav } from '@/components/ddat/DDATNav'
import { SignalBadge } from '@/components/ddat/SignalBadge'

export default function CaseLedger() {
  const [cases, setCases] = useState<DDATCase[]>([])
  const [domainFilter, setDomainFilter] = useState('')
  const [signalFilter, setSignalFilter] = useState('')
  const [evidenceFilter, setEvidenceFilter] = useState('')

  useEffect(() => {
    setCases(getCases())
  }, [])

  const domains = Array.from(new Set(cases.map((c) => c.domain))).sort()
  const evidenceLevels = Array.from(new Set(cases.map((c) => c.evidenceLevel))).sort()

  const filtered = cases.filter((c) => {
    if (domainFilter && c.domain !== domainFilter) return false
    if (signalFilter && c.auditResult.ddatSignal !== signalFilter) return false
    if (evidenceFilter && c.evidenceLevel !== evidenceFilter) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <DDATNav />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Case Ledger</h1>
            <p className="text-gray-400 text-sm mt-1">{filtered.length} case{filtered.length !== 1 ? 's' : ''} shown</p>
          </div>
          <Link
            href="/ddat-system/new"
            className="px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-100 transition-colors"
          >
            + New Case
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-[#0f1f3a] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
          >
            <option value="">All Domains</option>
            {domains.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={signalFilter}
            onChange={(e) => setSignalFilter(e.target.value)}
            className="bg-[#0f1f3a] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
          >
            <option value="">All Signals</option>
            {(['Red', 'Yellow', 'Green'] as DDATSignal[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={evidenceFilter}
            onChange={(e) => setEvidenceFilter(e.target.value)}
            className="bg-[#0f1f3a] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
          >
            <option value="">All Evidence Levels</option>
            {evidenceLevels.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          {(domainFilter || signalFilter || evidenceFilter) && (
            <button
              onClick={() => { setDomainFilter(''); setSignalFilter(''); setEvidenceFilter('') }}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                {['Case ID', 'Title', 'Domain', 'DDAT Signal', 'Red Count', 'Unknown Count', 'Evidence Level', 'Status', 'Last Updated', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-gray-400 font-medium text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No cases found.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.id} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/5' : ''} hover:bg-white/10 transition-colors`}>
                    <td className="px-4 py-3 font-mono text-sm text-white">{c.caseId}</td>
                    <td className="px-4 py-3 text-white max-w-[200px] truncate">{c.title}</td>
                    <td className="px-4 py-3 text-gray-300">{c.domain}</td>
                    <td className="px-4 py-3">
                      <SignalBadge signal={c.auditResult.ddatSignal} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-red-400 font-semibold">{c.auditResult.yesCount}</td>
                    <td className="px-4 py-3 text-slate-400">{c.auditResult.unknownCount}</td>
                    <td className="px-4 py-3 text-gray-300">{c.evidenceLevel}</td>
                    <td className="px-4 py-3 text-gray-300">{c.publicationStatus}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.updatedAt.split('T')[0]}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/ddat-system/cases/${c.id}`}
                        className="text-white text-xs font-semibold hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
