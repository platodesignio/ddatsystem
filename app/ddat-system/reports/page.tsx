'use client'

import { useEffect, useState } from 'react'
import { DDATCase, RedSignalCode } from '@/lib/ddat/schema'
import { getCases, seedInitialCasesIfEmpty } from '@/lib/ddat/storage'
import { generateMarkdownReport, generatePublicSummary, exportCaseJson, exportCasesCsv } from '@/lib/ddat/report'
import { RED_SIGNALS, REDESIGN_MAP } from '@/lib/ddat/rules'
import { DDATNav } from '@/components/ddat/DDATNav'
import { CopyButton, DownloadButton } from '@/components/ddat/ExportButtons'
import { SignalBadge } from '@/components/ddat/SignalBadge'

const CODES: RedSignalCode[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']

function generateEvidenceNote(selectedCases: DDATCase[]): string {
  if (selectedCases.length === 0) return ''

  const date = new Date().toISOString().split('T')[0]

  const caseList = selectedCases
    .map((c) => `- ${c.caseId}: ${c.title} (${c.domain})`)
    .join('\n')

  // Red signal matrix in markdown
  const header = '| Signal | Label | ' + selectedCases.map((c) => c.caseId).join(' | ') + ' |'
  const separator = '|--------|-------|' + selectedCases.map(() => '--------').join('|') + '|'
  const rows = CODES.map((code) => {
    const meta = RED_SIGNALS.find((s) => s.code === code)!
    const cells = selectedCases.map((c) => c.signals[code]).join(' | ')
    return `| ${code} | ${meta.label} | ${cells} |`
  }).join('\n')
  const matrix = `${header}\n${separator}\n${rows}`

  // Signal distribution
  const dist = selectedCases.map((c) => {
    const a = c.auditResult
    return `- ${c.caseId}: ${a.ddatSignal} (Yes: ${a.yesCount}, Partial: ${a.partialCount}, Unknown: ${a.unknownCount})`
  }).join('\n')

  // Per-case summaries
  const summaries = selectedCases.map((c) => {
    return `### ${c.caseId}: ${c.title}\n${c.auditResult.shortDiagnosis}`
  }).join('\n\n')

  // Merged unique redesign actions
  const allRedesignCodes = new Set<RedSignalCode>()
  for (const c of selectedCases) {
    for (const r of c.auditResult.requiredRedesignActions) {
      allRedesignCodes.add(r.code)
    }
  }
  const redesignSection = Array.from(allRedesignCodes).map((code) => {
    const r = REDESIGN_MAP[code]
    const inCases = selectedCases
      .filter((c) => c.auditResult.requiredRedesignActions.some((x) => x.code === code))
      .map((c) => c.caseId)
      .join(', ')
    return `#### ${code}: ${r.title} _(${inCases})_\n${r.actions.map((a) => `- ${a}`).join('\n')}`
  }).join('\n\n')

  return `# DDAT Evidence Note
*Generated: ${date}*

## Cases Included
${caseList}

## Red Signal Matrix
${matrix}

## Signal Distribution
${dist}

## Case Summaries
${summaries}

## Required Redesign (Cross-Case)
${redesignSection || '_No redesign actions identified._'}
`
}

export default function ReportsPage() {
  const [cases, setCases] = useState<DDATCase[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [evidenceNote, setEvidenceNote] = useState('')

  useEffect(() => {
    seedInitialCasesIfEmpty()
    const all = getCases()
    setCases(all)
    const defaultSelected = new Set(all.slice(0, 3).map((c) => c.id))
    setSelected(defaultSelected)
  }, [])

  function toggleCase(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedCases = cases.filter((c) => selected.has(c.id))

  function handleGenerateNote() {
    setEvidenceNote(generateEvidenceNote(selectedCases))
  }

  const allCasesJson = JSON.stringify(selectedCases, null, 2)
  const allCasesCsv = exportCasesCsv(cases)

  const publicSummaries = selectedCases.map((c) => generatePublicSummary(c)).join('\n\n')

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <DDATNav />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 text-sm mt-1">
            Generate evidence notes and export case data.
          </p>
        </div>

        {/* Case Selector */}
        <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-5 mb-6">
          <h2 className="text-white font-semibold text-sm mb-3">
            Select Cases for Report ({selected.size} selected)
          </h2>
          <div className="space-y-2">
            {cases.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded px-2 py-1.5 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.has(c.id)}
                  onChange={() => toggleCase(c.id)}
                  className="accent-white"
                />
                <span className="font-mono text-sm text-white">{c.caseId}</span>
                <span className="text-gray-400 text-sm truncate">{c.title}</span>
                <SignalBadge signal={c.auditResult.ddatSignal} size="sm" />
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleGenerateNote}
            disabled={selectedCases.length === 0}
            className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Generate Markdown Evidence Note
          </button>
          <DownloadButton
            content={allCasesJson}
            filename={`ddat-export-${new Date().toISOString().split('T')[0]}.json`}
            mimeType="application/json"
            label="Export JSON (selected cases)"
          />
          <DownloadButton
            content={allCasesCsv}
            filename={`ddat-cases-${new Date().toISOString().split('T')[0]}.csv`}
            mimeType="text/csv"
            label="Export CSV (all cases)"
          />
          {publicSummaries && (
            <CopyButton text={publicSummaries} label="Copy Public Summaries" />
          )}
        </div>

        {/* Evidence Note Preview */}
        {evidenceNote && (
          <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Markdown Evidence Note</h2>
              <div className="flex gap-2">
                <CopyButton text={evidenceNote} label="Copy" />
                <DownloadButton
                  content={evidenceNote}
                  filename={`ddat-evidence-note-${new Date().toISOString().split('T')[0]}.md`}
                  mimeType="text/markdown"
                  label="Download .md"
                />
              </div>
            </div>
            <pre className="text-xs text-gray-300 overflow-auto max-h-[600px] bg-[#0a1628] rounded p-4 border border-white/10 font-mono leading-relaxed whitespace-pre-wrap">
              {evidenceNote}
            </pre>
          </div>
        )}

        {/* Public Summaries Preview */}
        {selectedCases.length > 0 && (
          <div className="mt-6 bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
            <h2 className="text-white font-semibold mb-4">Public Summaries (Selected Cases)</h2>
            <div className="space-y-4">
              {selectedCases.map((c) => (
                <div key={c.id} className="border border-white/10 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-white">{c.caseId}</span>
                    <SignalBadge signal={c.auditResult.ddatSignal} size="sm" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{generatePublicSummary(c)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
