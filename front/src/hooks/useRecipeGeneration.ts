'use client'

import { useState } from 'react'
import type { NewRecipeRequest, VoltAgentResponse, RecipeVariationType } from '@/types'
import { VARIATION_NAMES, DIFFICULTY_NAMES } from '@/types'

interface UseRecipeGenerationReturn {
  generateRecipe: (request: NewRecipeRequest) => Promise<void>
  isLoading: boolean
  result: VoltAgentResponse | null
  error: string | null
  clearResult: () => void
}

export function useRecipeGeneration(): UseRecipeGenerationReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VoltAgentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateRecipe = async (request: NewRecipeRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      // リクエストからプロンプトを生成
      const ingredientsSection = request.find(item => item.type === 'ingredients')
      const preferencesSection = request.find(item => item.type === 'preferences')
      const variationsSection = request.find(item => item.type === 'variations')

      let prompt = ''

      if (ingredientsSection && 'items' in ingredientsSection) {
        prompt += `食材: ${ingredientsSection.items.join(', ')}\n`
      }

      if (preferencesSection && 'difficulty' in preferencesSection) {
        const japaneseDifficulty = DIFFICULTY_NAMES[preferencesSection.difficulty as keyof typeof DIFFICULTY_NAMES] || preferencesSection.difficulty
        prompt += `難易度: ${japaneseDifficulty}\n`
        prompt += `人数: ${preferencesSection.servings}人分\n`
      }

      if (variationsSection && 'includeVariations' in variationsSection && variationsSection.includeVariations) {
        const japaneseVariations = variationsSection.requestedVariations.map(
          (variation: RecipeVariationType) => VARIATION_NAMES[variation]
        )

        prompt += `バリエーション: ${japaneseVariations.join(', ')}\n`
      }

      prompt += '\nこれらの条件でイタリア料理のレシピを教えてください。'

      // 新しいAPI routeを使用
      const response = await fetch('/api/recipe/generate', {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: prompt,
          options: {
            userId: "unique-user-id",
            conversationId: "unique-conversation-id",
            contextLimit: 10,
            temperature: 0.7,
            maxTokens: 100,
          },
        }),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()

        console.error('API error response:', errorText)
        throw new Error(`レシピ生成に失敗しました: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Received recipe data:', data)
      console.log('Data structure:', {
        hasData: !!data.data,
        hasText: !!data.data?.text,
        hasProvider: !!data.data?.provider,
        hasSteps: !!data.data?.provider?.steps,
        stepsLength: data.data?.provider?.steps?.length || 0,
        textPreview: data.data?.text?.substring(0, 200) || 'No text'
      })
      setResult(data)
    } catch (err) {
      console.error('Recipe generation error:', err)
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
