'use client'

import { useState } from 'react'
import type { RecipeRequest, RecipeResponse } from '@/types'

interface UseRecipeGenerationReturn {
  generateRecipe: (request: RecipeRequest) => Promise<void>
  isLoading: boolean
  result: RecipeResponse | null
  error: string | null
  clearResult: () => void
  voltAgentStatus: 'unknown' | 'connected' | 'disconnected' | 'error'
  checkVoltAgentStatus: () => Promise<void>
}

export function useRecipeGeneration(): UseRecipeGenerationReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RecipeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [voltAgentStatus, setVoltAgentStatus] = useState<'unknown' | 'connected' | 'disconnected' | 'error'>('unknown')

  const generateRecipe = async (request: RecipeRequest) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/recipe/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`レシピ生成に失敗しました: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
      
      // レスポンスのメタデータからエージェントの使用状況を確認
      if (data.metadata?.agent_used === 'voltagent') {
        setVoltAgentStatus('connected')
      } else if (data.metadata?.agent_used === 'mock_fallback') {
        setVoltAgentStatus('disconnected')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'レシピ生成に失敗しました')
      setVoltAgentStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const checkVoltAgentStatus = async () => {
    try {
      const response = await fetch('/api/voltagent/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      setVoltAgentStatus(data.status)
    } catch (err) {
      setVoltAgentStatus('error')
    }
  }

  const clearResult = () => {
    setResult(null)
    setError(null)
  }

  return {
    generateRecipe,
    isLoading,
    result,
    error,
    clearResult,
    voltAgentStatus,
    checkVoltAgentStatus,
  }
}
