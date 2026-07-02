import { RedSignalCode, RequiredRedesignAction } from './schema'

export interface RedSignalMeta {
  code: RedSignalCode
  label: string
  labelJa: string
  description: string
}

export const RED_SIGNALS: RedSignalMeta[] = [
  {
    code: 'R1',
    label: 'No Re-entry Pathway',
    labelJa: '再参入経路なし',
    description: 'The decision permanently closes access without a defined pathway for re-application, appeal, or re-entry into the system or opportunity.',
  },
  {
    code: 'R2',
    label: 'No Contestability',
    labelJa: '異議申立不可',
    description: 'There is no mechanism for the affected individual to contest, challenge, or seek review of the adverse decision.',
  },
  {
    code: 'R3',
    label: 'Responsibility Gap',
    labelJa: '責任の空白',
    description: 'No human or institutional entity is clearly accountable for the decision, its consequences, or remediation of errors.',
  },
  {
    code: 'R4',
    label: 'No Support Pathway',
    labelJa: 'サポート経路なし',
    description: 'Risk classification or adverse decision connects to exclusion or penalty only, with no support, remediation, or improvement pathway offered.',
  },
  {
    code: 'R5',
    label: 'Long-term Lock-in',
    labelJa: '長期固定化',
    description: 'The decision produces cascading disadvantages across multiple domains or time periods without defined review points.',
  },
  {
    code: 'R6',
    label: 'No Score Decay or Review Cycle',
    labelJa: 'スコア更新サイクルなし',
    description: 'Classifications or scores have no expiration date, review cycle, or update condition — stale data governs future access indefinitely.',
  },
  {
    code: 'R7',
    label: 'No Meaningful Human Review',
    labelJa: '実質的な人間審査なし',
    description: 'Final adverse decisions are made without meaningful human review, or human review is nominal and does not affect outcomes.',
  },
  {
    code: 'R8',
    label: 'No System Revision Loop',
    labelJa: 'システム改訂ループなし',
    description: 'There is no mechanism for harms, errors, or appeals to feed back into system redesign or correction.',
  },
]

export const RED_SIGNAL_MAP: Record<RedSignalCode, RedSignalMeta> = Object.fromEntries(
  RED_SIGNALS.map((s) => [s.code, s])
) as Record<RedSignalCode, RedSignalMeta>

export const REDESIGN_MAP: Record<RedSignalCode, RequiredRedesignAction> = {
  R1: {
    code: 'R1',
    title: 'Define Re-entry Pathway',
    actions: [
      'Define a re-entry or re-application pathway.',
      'Clarify conditions for reconsideration.',
      'Prevent adverse decisions from becoming permanent closure.',
    ],
  },
  R2: {
    code: 'R2',
    title: 'Add Contestability Mechanism',
    actions: [
      'Provide reason disclosure.',
      'Add an appeal or contestation route.',
      'Enable correction and review.',
    ],
  },
  R3: {
    code: 'R3',
    title: 'Assign Responsibility',
    actions: [
      'Assign a responsible owner.',
      'Clarify operational, review, and remedy responsibility.',
      "Prevent 'AI made the decision' responsibility avoidance.",
    ],
  },
  R4: {
    code: 'R4',
    title: 'Add Support Pathway',
    actions: [
      'Add support, remediation, or improvement pathway.',
      'Connect risk classification to help, not only exclusion.',
      'Avoid purely punitive classification.',
    ],
  },
  R5: {
    code: 'R5',
    title: 'Limit Long-term Consequences',
    actions: [
      'Limit long-term adverse consequences.',
      'Prevent cascading disadvantage across systems.',
      'Add review points before long-term exclusion.',
    ],
  },
  R6: {
    code: 'R6',
    title: 'Add Score Decay or Review Cycle',
    actions: [
      'Add expiration, review cycle, or score decay.',
      'Define update conditions.',
      'Prevent stale classifications from governing future access.',
    ],
  },
  R7: {
    code: 'R7',
    title: 'Require Meaningful Human Review',
    actions: [
      'Add meaningful human review.',
      'Require human review before final adverse decision.',
      'Record human review actions.',
    ],
  },
  R8: {
    code: 'R8',
    title: 'Create System Revision Loop',
    actions: [
      'Add system revision loop.',
      'Record harms, errors, appeals, and corrections.',
      'Feed audit outcomes into redesign.',
    ],
  },
}
