export type RedSignalCode = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8'
export type RedSignalStatus = 'Yes' | 'No' | 'Partial' | 'Unknown'
export type DDATSignal = 'Red' | 'Yellow' | 'Green'

export interface RedSignalAssessment {
  code: RedSignalCode
  status: RedSignalStatus
}

export interface DDATCase {
  id: string
  caseId: string
  title: string
  domain: string
  systemType: string
  decisionType: string
  coreProblem: string
  evidenceLevel: 'High' | 'Medium' | 'Low' | 'Preliminary'
  sourceNotes: string
  publicationStatus: 'Draft' | 'Internal' | 'Published'
  signals: Record<RedSignalCode, RedSignalStatus>
  auditResult: AuditResult
  createdAt: string
  updatedAt: string
}

export interface AuditResult {
  ddatSignal: DDATSignal
  redSignalEquivalentCount: number
  yesCount: number
  partialCount: number
  unknownCount: number
  forcedRedReasons: string[]
  transparencyRisk: boolean
  requiredRedesignActions: RequiredRedesignAction[]
  shortDiagnosis: string
}

export interface RequiredRedesignAction {
  code: RedSignalCode
  title: string
  actions: string[]
}
