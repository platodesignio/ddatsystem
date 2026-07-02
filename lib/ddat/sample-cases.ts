import { DDATCase, RedSignalCode, RedSignalStatus } from './schema'
import { auditCase } from './audit'

function makeSignals(map: Partial<Record<RedSignalCode, RedSignalStatus>>): Record<RedSignalCode, RedSignalStatus> {
  const codes: RedSignalCode[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']
  const result = {} as Record<RedSignalCode, RedSignalStatus>
  for (const code of codes) {
    result[code] = map[code] ?? 'Unknown'
  }
  return result
}

const case001Signals = makeSignals({
  R1: 'Unknown',
  R2: 'Yes',
  R3: 'Partial',
  R4: 'Yes',
  R5: 'Partial',
  R6: 'Unknown',
  R7: 'Partial',
  R8: 'Unknown',
})

const case002Signals = makeSignals({
  R1: 'Partial',
  R2: 'Yes',
  R3: 'Yes',
  R4: 'Yes',
  R5: 'Partial',
  R6: 'Unknown',
  R7: 'Unknown',
  R8: 'Unknown',
})

const case003Signals = makeSignals({
  R1: 'Partial',
  R2: 'Partial',
  R3: 'Partial',
  R4: 'Unknown',
  R5: 'Partial',
  R6: 'Unknown',
  R7: 'Partial',
  R8: 'Unknown',
})

export const SAMPLE_CASES: DDATCase[] = [
  {
    id: 'seed-case-001',
    caseId: 'DDAT-CASE-001',
    title: 'Hiring AI and the Closure of Latent Capacity',
    domain: 'Hiring',
    systemType: 'AI Screening',
    decisionType: 'Candidate rejection / ranking / screening',
    coreProblem:
      'AI screening systems reject candidates at scale without providing reasons, appeal pathways, or re-application guidance. Candidates are classified as low-fit without human review and without any mechanism to understand or contest the outcome. Rejected candidates are often permanently excluded from the pipeline without any re-entry condition.',
    evidenceLevel: 'Preliminary',
    sourceNotes:
      'Based on aggregated structural analysis of AI hiring systems. No individual candidate data included.',
    publicationStatus: 'Internal',
    signals: case001Signals,
    auditResult: auditCase(case001Signals),
    createdAt: '2026-07-02T00:00:00.000Z',
    updatedAt: '2026-07-02T00:00:00.000Z',
  },
  {
    id: 'seed-case-002',
    caseId: 'DDAT-CASE-002',
    title: 'Welfare AI and the Conversion of Need into Risk',
    domain: 'Welfare',
    systemType: 'Risk Scoring / Eligibility Assessment',
    decisionType: 'Benefit denial / investigation / risk classification',
    coreProblem:
      'Welfare risk scoring systems classify individuals as high-risk for fraud or non-compliance and route them to investigation or benefit denial. No human review is systematically applied before adverse action. Responsibility for the decision is diffuse across automated systems and institutional actors. The classification can persist and affect future eligibility across programs.',
    evidenceLevel: 'Preliminary',
    sourceNotes:
      'Structural pattern analysis based on publicly documented welfare automation systems. No personal welfare records included.',
    publicationStatus: 'Internal',
    signals: case002Signals,
    auditResult: auditCase(case002Signals),
    createdAt: '2026-07-02T00:00:00.000Z',
    updatedAt: '2026-07-02T00:00:00.000Z',
  },
  {
    id: 'seed-case-003',
    caseId: 'DDAT-CASE-003',
    title: 'Medical Prediction AI and the Gap between Prediction and Care',
    domain: 'Medical',
    systemType: 'Prediction / Risk Stratification',
    decisionType: 'Risk classification / care prioritization / intervention routing',
    coreProblem:
      'Medical AI systems predict patient risk and route individuals to different care pathways without clear support mechanisms for those classified as high-risk but not prioritized for intervention. The gap between prediction and care action is structurally unaddressed. Human review occurs at clinical level but is not systematically linked to AI classification review.',
    evidenceLevel: 'Preliminary',
    sourceNotes:
      'Structural analysis based on published literature on medical AI deployment patterns. No patient records or clinical data included.',
    publicationStatus: 'Internal',
    signals: case003Signals,
    auditResult: auditCase(case003Signals),
    createdAt: '2026-07-02T00:00:00.000Z',
    updatedAt: '2026-07-02T00:00:00.000Z',
  },
]
