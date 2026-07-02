import { DDATCase } from './schema'
import { SAMPLE_CASES } from './sample-cases'

const STORAGE_KEY = 'ddat_cases'

export function getCases(): DDATCase[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DDATCase[]
  } catch {
    return []
  }
}

export function saveCase(c: DDATCase): void {
  if (typeof window === 'undefined') return
  const cases = getCases()
  const idx = cases.findIndex((x) => x.id === c.id)
  if (idx >= 0) {
    cases[idx] = c
  } else {
    cases.push(c)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases))
}

export function getCaseById(id: string): DDATCase | null {
  const cases = getCases()
  return cases.find((c) => c.id === id) ?? null
}

export function deleteCase(id: string): void {
  if (typeof window === 'undefined') return
  const cases = getCases().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases))
}

export function seedInitialCasesIfEmpty(): void {
  if (typeof window === 'undefined') return
  const existing = getCases()
  if (existing.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_CASES))
  }
}
