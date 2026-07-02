import { AuditResult, RedSignalCode, RedSignalStatus } from './schema'
import { REDESIGN_MAP } from './rules'

export function auditCase(signals: Record<RedSignalCode, RedSignalStatus>): AuditResult {
  let equiv = 0
  let yesCount = 0
  let partialCount = 0
  let unknownCount = 0

  const codes: RedSignalCode[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']
  for (const code of codes) {
    const s = signals[code]
    if (s === 'Yes') { equiv += 1; yesCount++ }
    else if (s === 'Partial') { equiv += 0.5; partialCount++ }
    else if (s === 'Unknown') { unknownCount++ }
  }

  const forcedRedReasons: string[] = []
  if (signals.R1 === 'Yes' && signals.R2 === 'Yes')
    forcedRedReasons.push('R1+R2: No Re-entry + No Contestability')
  if (signals.R2 === 'Yes' && signals.R3 === 'Yes')
    forcedRedReasons.push('R2+R3: No Contestability + Responsibility Gap')
  if (signals.R4 === 'Yes' && signals.R5 === 'Yes')
    forcedRedReasons.push('R4+R5: No Support Pathway + Long-term Lock-in')

  const transparencyRisk = unknownCount >= 4
  if (transparencyRisk)
    forcedRedReasons.push('Transparency Risk: 4+ Unknown critical fields')

  let ddatSignal: 'Red' | 'Yellow' | 'Green'
  if (forcedRedReasons.length > 0 || equiv >= 3) ddatSignal = 'Red'
  else if (equiv >= 2) ddatSignal = 'Yellow'
  else ddatSignal = 'Green'

  const requiredRedesignActions = codes
    .filter((c) => signals[c] === 'Yes' || signals[c] === 'Partial')
    .map((c) => REDESIGN_MAP[c])

  const shortDiagnosis = generateDiagnosis(
    ddatSignal,
    yesCount,
    partialCount,
    unknownCount,
    forcedRedReasons,
    transparencyRisk
  )

  return {
    ddatSignal,
    redSignalEquivalentCount: equiv,
    yesCount,
    partialCount,
    unknownCount,
    forcedRedReasons,
    transparencyRisk,
    requiredRedesignActions,
    shortDiagnosis,
  }
}

function generateDiagnosis(
  signal: 'Red' | 'Yellow' | 'Green',
  yesCount: number,
  partialCount: number,
  unknownCount: number,
  forcedRedReasons: string[],
  transparencyRisk: boolean
): string {
  const parts: string[] = []

  if (signal === 'Red') {
    if (forcedRedReasons.length > 0) {
      parts.push(
        `This system triggers a forced Red signal due to critical signal combinations: ${forcedRedReasons.join('; ')}.`
      )
    } else {
      parts.push(
        `This system receives a Red DDAT signal with ${yesCount} confirmed and ${partialCount} partial red signals — indicating structural closure of future possibility.`
      )
    }
    parts.push(
      'Immediate redesign is required before this system can be considered compliant with decision direction principles.'
    )
  } else if (signal === 'Yellow') {
    parts.push(
      `This system receives a Yellow DDAT signal with ${yesCount} confirmed and ${partialCount} partial red signals — indicating moderate risk of directional harm.`
    )
    parts.push(
      'Targeted redesign actions are recommended to address identified gaps before deployment or continued operation.'
    )
  } else {
    parts.push(
      `This system receives a Green DDAT signal with ${yesCount} confirmed red signals and ${partialCount} partial — indicating low directional harm risk under current assessment.`
    )
    parts.push('Continued monitoring and periodic re-audit are recommended.')
  }

  if (transparencyRisk) {
    parts.push(
      `Note: ${unknownCount} signals are Unknown, indicating significant transparency gaps that may conceal undisclosed harms.`
    )
  } else if (unknownCount > 0) {
    parts.push(`${unknownCount} signal(s) remain Unknown and require further investigation.`)
  }

  return parts.join(' ')
}
