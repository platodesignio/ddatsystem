'use client'

import { useState } from 'react'
import { RedSignalCode } from '@/lib/ddat/schema'
import { useDDATCases } from '@/lib/ddat/useDDATCases'
import { RED_SIGNALS } from '@/lib/ddat/rules'
import { DDATNav } from '@/components/ddat/DDATNav'
import { ComparisonTable } from '@/components/ddat/ComparisonTable'

const CODES: RedSignalCode[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']

export default function ComparePage() {
  const { cases, isLoaded, error } = useDDATCases()
  const [manualSelected, setManualSelected] = useState<Set<string> | null>(null)

  // Default: first 3 cases (seed cases). User can override.
  const selected: Set<string> =
    manualSelected ?? new Set(cases.slice(0, 3).map((c) => c.id))

  function toggleCase(id: string) {
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else if (next.size < 5) {
      next.add(id)
    }
    setManualSelected(next)
  }

  const selectedCases = cases.filter((c) => selected.has(c.id))

  const commonRedSignals = CODES.filter(
    (code) =>
      selectedCases.length > 1 &&
      selectedCases.every((c) => c.signals[code] === 'Yes')
  )

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <DDATNav />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Compare Cases</h1>
          <p className="text-gray-400 text-sm mt-1">
            Select up to 5 cases to compare red signal assessments side-by-side.
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-red-800 bg-red-900/20 rounded-lg px-5 py-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!isLoaded ? (
          <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6 animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-white/10 rounded" />
            ))}
          </div>
        ) : (
          <>
            {/* Case Selector */}
            <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-5 mb-6">
              <h2 className="text-white font-semibold text-sm mb-3">
                Select Cases ({selected.size}/5)
              </h2>
              {cases.length === 0 ? (
                <p className="text-gray-500 text-sm">No cases available.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {cases.map((c) => {
                    const isSelected = selected.has(c.id)
                    const disabled = !isSelected && selected.size >= 5
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded border text-sm transition-colors ${
                          isSelected
                            ? 'border-white/40 bg-white/10 text-white'
                            : disabled
                              ? 'border-white/10 text-gray-600 cursor-not-allowed'
                              : 'border-white/20 text-gray-300 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={disabled}
                          onChange={() => toggleCase(c.id)}
                          className="accent-white"
                        />
                        <span className="font-mono text-xs">{c.caseId}</span>
                        <span className="hidden sm:inline truncate max-w-[140px]">{c.title}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Comparison Table */}
            {selectedCases.length > 0 ? (
              <div className="bg-[#0f1f3a] border border-white/10 rounded-lg overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="text-white font-semibold">Signal Comparison Matrix</h2>
                </div>
                <div className="p-6 overflow-x-auto">
                  <ComparisonTable cases={selectedCases} />
                </div>
              </div>
            ) : (
              <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-8 text-center text-gray-500 mb-6">
                Select at least one case to display the comparison matrix.
              </div>
            )}

            {/* Common Red Signals */}
            {selectedCases.length > 1 && (
              <div className="bg-[#0f1f3a] border border-white/10 rounded-lg p-6">
                <h2 className="text-white font-semibold mb-3">
                  Common Red Signals (Yes in All Selected Cases)
                </h2>
                {commonRedSignals.length === 0 ? (
                  <p className="text-gray-500 text-sm">No signals are confirmed Yes in all selected cases.</p>
                ) : (
                  <div className="space-y-2">
                    {commonRedSignals.map((code) => {
                      const meta = RED_SIGNALS.find((s) => s.code === code)!
                      return (
                        <div
                          key={code}
                          className="flex items-center gap-3 border border-red-800/50 bg-red-900/20 rounded px-4 py-3"
                        >
                          <span className="font-mono font-bold text-white text-sm">{code}</span>
                          <span className="text-red-400 text-sm font-semibold">{meta.label}</span>
                          <span className="text-red-400/60 text-xs hidden md:inline">{meta.description}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
