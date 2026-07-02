'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DDATCase, RedSignalCode } from '@/lib/ddat/schema'
import { getCaseById, deleteCase } from '@/lib/ddat/storage'
import { generateMarkdownReport, generatePublicSummary, exportCaseJson, exportCasesCsv } from '@/lib/ddat/report'
import { RED_SIGNAL_MAP } from '@/lib/ddat/rules'
import { DDATNav } from '@/components/ddat/DDATNav'
import { SignalBadge } from '@/components/ddat/SignalBadge'
import { RedSignalRow } from '@/components/ddat/RedSignalRow'
import { CopyButton, DownloadButton } from '@/components/ddat/ExportButtons'

const CODES: RedSignalCode[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']

export default function CaseDetail() {
  const params = useParams()
  const router = useRouter()
  const [c, setC] = useState<DDATCase | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  useEffect(() => {
    const id = params.id as string
    const found = getCaseById(id)
    if (found) setC(found)
    else setNotFound(true)
  }, [params.id])

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <DDATNav />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-gray-400 text-lg">Case not found.</p>
          <a href="/ddat-system/cases" className="text-white underline text-sm mt-4 inline-block">
            ← Back to Cases
          </a>
        </main>
      </div>
    )
  }

  if (!c) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <DDATNav />
        <main className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-gray-400">Loading…</p>
        </main>
      </div>
    )
  }

  const mdReport = generateMarkdownReport(c)
  const publicSummary = generatePublicSummary(c)
  const jsonExport = exportCaseJson(c)
  const csvExport = exportCasesCsv([c])
  const { auditResult: a } = c

  function handleDelete() {
    if (confirm(`Delete case ${c!.caseId}? This cannot be undone.`)) {
      deleteCase(c!.id)
      router.push('/ddat-system/cases')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <DDATNav />

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-1">{c.caseId}</div>
            <h1 className="text-2xl font-bold text-white">{c.title}</h1>
          </div>
          <div className="flex gap-2">
            <SignalBadge signal={a.ddatSignal} size="md" />
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">Case Metadata</h2>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
            {[
              ['Domain', c.domain],
              ['System Type', c.systemType],
              ['Decision Type', c.decisionType],
              ['Evidence Level', c.evidenceLevel],
              ['Publication Status', c.publicationStatus],
              ['Created', c.createdAt.split('T')[0]],
              ['Updated', c.updatedAt.split('T')[0]],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-gray-500 text-xs">{label}</dt>
                <dd className="text-white mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Core Problem */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
          <h2 className="text-white font-semibold mb-3">Core Problem</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{c.coreProblem}</p>
        </div>

        {/* R1-R8 Table */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-white font-semibold">Red Signal Assessment</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium">Code</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium">Label</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium hidden md:table-cell">Description</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {CODES.map((code) => (
                <RedSignalRow key={code} code={code} status={c.signals[code]} />
              ))}
            </tbody>
          </table>
        </div>

        {/* DDAT Signal Summary */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">DDAT Audit Result</h2>
          <div className="flex flex-wrap gap-6 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">DDAT Signal</div>
              <SignalBadge signal={a.ddatSignal} size="md" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Equiv. Count</div>
              <div className="text-2xl font-bold text-white">{a.redSignalEquivalentCount}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Confirmed Yes</div>
              <div className="text-2xl font-bold text-red-400">{a.yesCount}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Partial</div>
              <div className="text-2xl font-bold text-orange-400">{a.partialCount}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Unknown</div>
              <div className="text-2xl font-bold text-slate-400">{a.unknownCount}</div>
            </div>
          </div>

          {a.transparencyRisk && (
            <div className="border border-red-800 bg-red-900/20 rounded px-4 py-3 mb-4">
              <p className="text-red-400 text-sm font-semibold">Transparency Risk: 4+ signals Unknown</p>
            </div>
          )}

          {a.forcedRedReasons.length > 0 && (
            <div>
              <h3 className="text-sm text-gray-400 font-semibold mb-2">Forced Red Reasons</h3>
              <ul className="space-y-1">
                {a.forcedRedReasons.map((r) => (
                  <li key={r} className="text-red-400 text-sm flex items-center gap-2">
                    <span>⚠</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Required Redesign */}
        {a.requiredRedesignActions.length > 0 && (
          <div className="bg-[#0f1f3a] border border-white/10 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-semibold">Required Redesign Actions</h2>
            </div>
            <div className="divide-y divide-white/10">
              {a.requiredRedesignActions.map((r) => (
                <div key={r.code}>
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
                    onClick={() => setOpenAccordion(openAccordion === r.code ? null : r.code)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white font-bold text-sm">{r.code}</span>
                      <span className="text-white text-sm">{r.title}</span>
                      <SignalBadge signal={c.signals[r.code]} size="sm" />
                    </div>
                    <span className="text-gray-400">{openAccordion === r.code ? '▲' : '▼'}</span>
                  </button>
                  {openAccordion === r.code && (
                    <div className="px-6 pb-4 bg-[#0a1628]">
                      <ul className="space-y-2">
                        {r.actions.map((action) => (
                          <li key={action} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-white mt-0.5">→</span> {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Short Diagnosis */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
          <h2 className="text-white font-semibold mb-3">Short Diagnosis</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{a.shortDiagnosis}</p>
        </div>

        {/* Public Summary */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Public Summary</h2>
            <CopyButton text={publicSummary} label="Copy Summary" />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{publicSummary}</p>
        </div>

        {/* Source Notes */}
        {c.sourceNotes && (
          <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
            <h2 className="text-white font-semibold mb-3">Source Notes</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{c.sourceNotes}</p>
          </div>
        )}

        {/* Markdown Report Preview */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
          <h2 className="text-white font-semibold mb-3">Markdown Report</h2>
          <pre className="text-xs text-gray-400 overflow-auto max-h-64 bg-[#0a1628] rounded p-4 border border-white/10 font-mono leading-relaxed">
            {mdReport}
          </pre>
        </div>

        {/* Export Buttons */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">Export</h2>
          <div className="flex flex-wrap gap-3">
            <CopyButton text={mdReport} label="Copy Markdown" />
            <DownloadButton
              content={jsonExport}
              filename={`${c.caseId}.json`}
              mimeType="application/json"
              label="Export JSON"
            />
            <DownloadButton
              content={csvExport}
              filename={`${c.caseId}.csv`}
              mimeType="text/csv"
              label="Export CSV"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#0f1f3a] border border-red-800/50 rounded-lg p-6">
          <h2 className="text-red-400 font-semibold mb-3">Danger Zone</h2>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-700 text-red-400 text-sm font-semibold rounded hover:bg-red-900/30 transition-colors"
          >
            Delete Case
          </button>
        </div>
      </main>
    </div>
  )
}
