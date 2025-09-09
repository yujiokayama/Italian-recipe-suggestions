'use client'

import { useState } from 'react'
import type { RecipeRequest, RecipeResponse } from '@/types'

interface UseRecipeGenerationReturn {
  generateRecipe: (request: RecipeRequest) => Promise<void>
  isLoading: boolean
  result: RecipeResponse | null
  error: string | null
  clearResult: () => void
}

export function useRecipeGeneration(): UseRecipeGenerationReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RecipeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'レシピ生成に失敗しました')
    } finally {
      setIsLoading(false)
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
  }
}
