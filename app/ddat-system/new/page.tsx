'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RedSignalCode, RedSignalStatus, DDATCase } from '@/lib/ddat/schema'
import { auditCase } from '@/lib/ddat/audit'
import { saveCase, getCases } from '@/lib/ddat/storage'
import { RED_SIGNALS } from '@/lib/ddat/rules'
import { DDATNav } from '@/components/ddat/DDATNav'
import { SignalBadge } from '@/components/ddat/SignalBadge'

const CODES: RedSignalCode[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']
const STATUS_OPTIONS: RedSignalStatus[] = ['Yes', 'No', 'Partial', 'Unknown']
const PII_KEYWORDS = ['name', 'email', 'phone', 'resume', 'medical record', 'patient name', 'student name', 'address']

function defaultSignals(): Record<RedSignalCode, RedSignalStatus> {
  return Object.fromEntries(CODES.map((c) => [c, 'Unknown'])) as Record<RedSignalCode, RedSignalStatus>
}

function generateCaseId(existingCases: DDATCase[]): string {
  const maxNum = existingCases.reduce((max, c) => {
    const match = c.caseId.match(/DDAT-CASE-(\d+)/)
    if (match) return Math.max(max, parseInt(match[1], 10))
    return max
  }, 0)
  return `DDAT-CASE-${String(maxNum + 1).padStart(3, '0')}`
}

function hasPII(text: string): boolean {
  const lower = text.toLowerCase()
  return PII_KEYWORDS.some((k) => lower.includes(k))
}

export default function NewCasePage() {
  const router = useRouter()

  const [caseId, setCaseId] = useState('')
  const [title, setTitle] = useState('')
  const [domain, setDomain] = useState('')
  const [systemType, setSystemType] = useState('')
  const [decisionType, setDecisionType] = useState('')
  const [coreProblem, setCoreProblem] = useState('')
  const [evidenceLevel, setEvidenceLevel] = useState<DDATCase['evidenceLevel']>('Preliminary')
  const [sourceNotes, setSourceNotes] = useState('')
  const [publicationStatus, setPublicationStatus] = useState<DDATCase['publicationStatus']>('Draft')
  const [signals, setSignals] = useState<Record<RedSignalCode, RedSignalStatus>>(defaultSignals())
  const [piiWarning, setPiiWarning] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const existing = getCases()
    setCaseId(generateCaseId(existing))
  }, [])

  const checkPII = useCallback((text: string) => {
    setPiiWarning(hasPII(text) || hasPII(coreProblem))
  }, [coreProblem])

  const liveAudit = auditCase(signals)

  function handleSignalChange(code: RedSignalCode, value: RedSignalStatus) {
    setSignals((prev) => ({ ...prev, [code]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const now = new Date().toISOString()
    const audit = auditCase(signals)
    const newCase: DDATCase = {
      id: crypto.randomUUID(),
      caseId,
      title,
      domain,
      systemType,
      decisionType,
      coreProblem,
      evidenceLevel,
      sourceNotes,
      publicationStatus,
      signals,
      auditResult: audit,
      createdAt: now,
      updatedAt: now,
    }

    saveCase(newCase)
    router.push(`/ddat-system/cases/${newCase.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <DDATNav />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">New DDAT Case</h1>
          <p className="text-gray-400 mt-1 text-sm">Create a new structural decision audit case.</p>
        </div>

        {/* PII Warning Banner */}
        <div className="mb-6 border border-red-800 bg-red-900/20 rounded-lg px-5 py-4">
          <p className="text-red-400 text-sm font-semibold">
            Zero-PII mode: Do not enter names, emails, resumes, medical records, demographic
            attributes, or raw personal data. DDAT audits decision architectures, not people.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Metadata */}
          <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6 space-y-5">
            <h2 className="text-white font-semibold text-lg">Case Metadata</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Case ID</label>
                <input
                  type="text"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  required
                  className="w-full bg-[#0a1628] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Case Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#0a1628] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                  placeholder="e.g. Hiring, Welfare, Medical"
                  className="w-full bg-[#0a1628] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">System Type</label>
                <input
                  type="text"
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value)}
                  required
                  placeholder="e.g. AI Screening, Risk Scoring"
                  className="w-full bg-[#0a1628] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1.5">Decision Type</label>
                <input
                  type="text"
                  value={decisionType}
                  onChange={(e) => setDecisionType(e.target.value)}
                  required
                  placeholder="e.g. Candidate rejection / ranking / screening"
                  className="w-full bg-[#0a1628] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Core Problem</label>
              <textarea
                value={coreProblem}
                onChange={(e) => {
                  setCoreProblem(e.target.value)
                  setPiiWarning(hasPII(e.target.value) || hasPII(sourceNotes))
                }}
                required
                rows={4}
                className="w-full bg-[#0a1628] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Evidence Level</label>
                <select
                  value={evidenceLevel}
                  onChange={(e) => setEvidenceLevel(e.target.value as DDATCase['evidenceLevel'])}
                  className="w-full bg-[#0a1628] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                >
                  {['High', 'Medium', 'Low', 'Preliminary'].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Publication Status</label>
                <select
                  value={publicationStatus}
                  onChange={(e) => setPublicationStatus(e.target.value as DDATCase['publicationStatus'])}
                  className="w-full bg-[#0a1628] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                >
                  {['Draft', 'Internal', 'Published'].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Source Notes</label>
              <textarea
                value={sourceNotes}
                onChange={(e) => {
                  setSourceNotes(e.target.value)
                  checkPII(e.target.value)
                }}
                rows={3}
                className="w-full bg-[#0a1628] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50 resize-none"
              />
            </div>

            {piiWarning && (
              <div className="border border-red-700 bg-red-900/30 rounded px-4 py-3">
                <p className="text-red-400 text-sm">
                  Potential PII detected. Remove personal data before saving.
                </p>
              </div>
            )}
          </div>

          {/* R1-R8 Assessment */}
          <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-lg">Red Signal Assessment (R1–R8)</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                Live Signal:
                <SignalBadge signal={liveAudit.ddatSignal} size="sm" />
              </div>
            </div>

            <div className="space-y-5">
              {RED_SIGNALS.map((signal) => (
                <div key={signal.code} className="border border-white/10 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded text-sm shrink-0">
                      {signal.code}
                    </span>
                    <div>
                      <div className="text-white font-semibold text-sm">{signal.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{signal.labelJa}</div>
                      <div className="text-gray-400 text-xs mt-1">{signal.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <label key={status} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={signal.code}
                          value={status}
                          checked={signals[signal.code] === status}
                          onChange={() => handleSignalChange(signal.code, status)}
                          className="accent-white"
                        />
                        <span
                          className={`text-sm font-medium ${
                            status === 'Yes'
                              ? 'text-red-400'
                              : status === 'Partial'
                                ? 'text-orange-400'
                                : status === 'Unknown'
                                  ? 'text-slate-400'
                                  : 'text-gray-300'
                          }`}
                        >
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Audit Preview */}
            <div className="mt-6 border border-white/10 bg-[#0a1628] rounded-lg p-4">
              <h3 className="text-sm text-gray-400 font-semibold mb-3">Live Audit Preview</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>
                  Signal: <SignalBadge signal={liveAudit.ddatSignal} size="sm" />
                </span>
                <span className="text-gray-300">
                  Equiv: <strong className="text-white">{liveAudit.redSignalEquivalentCount}</strong>
                </span>
                <span className="text-red-400">
                  Yes: <strong>{liveAudit.yesCount}</strong>
                </span>
                <span className="text-orange-400">
                  Partial: <strong>{liveAudit.partialCount}</strong>
                </span>
                <span className="text-slate-400">
                  Unknown: <strong>{liveAudit.unknownCount}</strong>
                </span>
              </div>
              {liveAudit.forcedRedReasons.length > 0 && (
                <div className="mt-3 space-y-1">
                  {liveAudit.forcedRedReasons.map((r) => (
                    <div key={r} className="text-xs text-red-400 flex items-center gap-1">
                      <span>⚠</span> {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-white text-black font-semibold text-sm rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save Case'}
            </button>
            <a
              href="/ddat-system/cases"
              className="px-6 py-2.5 border border-white text-white font-semibold text-sm rounded hover:bg-white/10 transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </main>
    </div>
  )
}
