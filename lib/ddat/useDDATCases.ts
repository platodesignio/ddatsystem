'use client'

import { useState, useEffect, useCallback } from 'react'
import { DDATCase } from './schema'
import {
  getCases,
  saveCase as storageSave,
  deleteCase as storageDelete,
  seedInitialCasesIfEmpty,
  resetToSeedCases,
} from './storage'

export interface UseDDATCasesResult {
  cases: DDATCase[]
  isLoaded: boolean
  error: string | null
  saveCase: (c: DDATCase) => void
  deleteCase: (id: string) => void
  refreshCases: () => void
  resetDemoCases: () => void
  seedDemoCasesIfEmpty: () => void
}

export function useDDATCases(): UseDDATCasesResult {
  const [cases, setCases] = useState<DDATCase[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    try {
      seedInitialCasesIfEmpty()
      const loaded = getCases()
      setCases(loaded)
      setError(null)
    } catch {
      setError('Demo cases could not be loaded. Click Reset Demo Cases.')
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const saveCase = useCallback((c: DDATCase) => {
    storageSave(c)
    setCases(getCases())
  }, [])

  const deleteCase = useCallback((id: string) => {
    storageDelete(id)
    setCases(getCases())
  }, [])

  const resetDemoCases = useCallback(() => {
    resetToSeedCases()
    setCases(getCases())
    setError(null)
  }, [])

  const seedDemoCasesIfEmpty = useCallback(() => {
    seedInitialCasesIfEmpty()
    setCases(getCases())
  }, [])

  return {
    cases,
    isLoaded,
    error,
    saveCase,
    deleteCase,
    refreshCases: refresh,
    resetDemoCases,
    seedDemoCasesIfEmpty,
  }
}
