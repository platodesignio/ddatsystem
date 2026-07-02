import { DDATCase } from './schema'
import { RED_SIGNAL_MAP } from './rules'

export function generateMarkdownReport(c: DDATCase): string {
  const { auditResult: a } = c
  const codes = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'] as const

  const signalTable = codes
    .map((code) => {
      const meta = RED_SIGNAL_MAP[code]
      const status = c.signals[code]
      return `| ${code} | ${meta.label} | ${status} |`
    })
    .join('\n')

  const redesignSection = a.requiredRedesignActions
    .map((r) => {
      const actions = r.actions.map((a) => `  - ${a}`).join('\n')
      return `### ${r.code}: ${r.title}\n${actions}`
    })
    .join('\n\n')

  return `# DDAT Case Report: ${c.caseId}
*Generated: ${new Date().toISOString().split('T')[0]}*

## Case Metadata
- **Case ID:** ${c.caseId}
- **Title:** ${c.title}
- **Domain:** ${c.domain}
- **System Type:** ${c.systemType}
- **Decision Type:** ${c.decisionType}
- **Evidence Level:** ${c.evidenceLevel}
- **Publication Status:** ${c.publicationStatus}
- **Created:** ${c.createdAt.split('T')[0]}
- **Updated:** ${c.updatedAt.split('T')[0]}

## Core Problem
${c.coreProblem}

## Source Notes
${c.sourceNotes || '_No source notes provided._'}

## Red Signal Assessment

| Code | Signal | Status |
|------|--------|--------|
${signalTable}

## DDAT Audit Result

**DDAT Signal: ${a.ddatSignal}**

- Red Signal Equivalent Count: ${a.redSignalEquivalentCount}
- Confirmed Yes: ${a.yesCount}
- Partial: ${a.partialCount}
- Unknown: ${a.unknownCount}
- Transparency Risk: ${a.transparencyRisk ? 'Yes' : 'No'}

${a.forcedRedReasons.length > 0 ? `### Forced Red Reasons\n${a.forcedRedReasons.map((r) => `- ${r}`).join('\n')}` : ''}

## Short Diagnosis
${a.shortDiagnosis}

## Required Redesign Actions
${redesignSection || '_No redesign actions required._'}
`
}

export function generatePublicSummary(c: DDATCase): string {
  const { auditResult: a } = c
  const signalWord =
    a.ddatSignal === 'Red'
      ? 'a Red (high-risk) DDAT signal'
      : a.ddatSignal === 'Yellow'
        ? 'a Yellow (moderate-risk) DDAT signal'
        : 'a Green (low-risk) DDAT signal'

  const redesignCount = a.requiredRedesignActions.length

  return `${c.title} (${c.domain}) receives ${signalWord} under the Decision Direction Audit Theory framework. ` +
    `The audit identified ${a.yesCount} confirmed and ${a.partialCount} partial red signals across ${8} structural dimensions, ` +
    `with ${a.unknownCount} signals requiring further investigation. ` +
    (redesignCount > 0
      ? `${redesignCount} redesign action${redesignCount > 1 ? 's are' : ' is'} required before this system can be considered structurally safe.`
      : 'No immediate redesign actions were identified under the current assessment.')
}

export function exportCaseJson(c: DDATCase): string {
  return JSON.stringify(c, null, 2)
}

export function exportCasesCsv(cases: DDATCase[]): string {
  const headers = [
    'Case ID',
    'Title',
    'Domain',
    'DDAT Signal',
    'Yes Count',
    'Partial Count',
    'Unknown Count',
    'Evidence Level',
    'Status',
  ]

  const rows = cases.map((c) => [
    c.caseId,
    `"${c.title.replace(/"/g, '""')}"`,
    c.domain,
    c.auditResult.ddatSignal,
    String(c.auditResult.yesCount),
    String(c.auditResult.partialCount),
    String(c.auditResult.unknownCount),
    c.evidenceLevel,
    c.publicationStatus,
  ])

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
}
