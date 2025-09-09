'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRecipeGeneration } from '@/hooks/useRecipeGeneration'
import type { RecipeRequest } from '@/types'

interface RecipeGenerationFormProps {
  onBack?: () => void
}

export function RecipeGenerationForm({ onBack }: RecipeGenerationFormProps) {
  const [ingredients, setIngredients] = useState<string[]>([''])
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [cookingTime, setCookingTime] = useState<number>(30)
  const [servings, setServings] = useState<number>(4)
  const [includeVariations, setIncludeVariations] = useState<boolean>(true)
  
  const { generateRecipe, isLoading, result, error, clearResult, voltAgentStatus, checkVoltAgentStatus } = useRecipeGeneration()

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const addIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const filteredIngredients = ingredients.filter(ingredient => ingredient.trim() !== '')
    
    if (filteredIngredients.length === 0) {
      alert('少なくとも1つの食材を入力してください')
      return
    }

    const request: RecipeRequest = {
      ingredients: filteredIngredients,
      preferences: {
        difficulty,
        cookingTime,
        servings,
      },
      includeVariations,
      requestedVariations: includeVariations ? ['vegetarian'] : [],
    }

    await generateRecipe(request)
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">生成されたレシピ</h2>
        </div>
        
        {/* メインレシピ */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-italian-red mb-2">
            {result.mainRecipe.recipeName}
          </h3>
          <p className="text-gray-600 mb-4">{result.mainRecipe.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 食材 */}
            <div>
              <h4 className="font-semibold mb-3">食材 ({result.mainRecipe.servings}人分)</h4>
              <ul className="space-y-1">
                {result.mainRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm">
                    {ingredient.name}: {ingredient.amount} {ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 作り方 */}
            <div>
              <h4 className="font-semibold mb-3">作り方</h4>
              <ol className="space-y-2">
                {result.mainRecipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{index + 1}. </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {/* 調理情報とコツ */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">調理情報</h4>
                <p className="text-sm text-gray-600">
                  調理時間: {result.mainRecipe.cookingTime}分<br />
                  難易度: {result.mainRecipe.difficulty}<br />
                  地方: {result.mainRecipe.region || 'イタリア全土'}
                </p>
                {result.mainRecipe.wine_pairing && (
                  <p className="text-sm text-gray-600 mt-2">
                    おすすめワイン: {result.mainRecipe.wine_pairing}
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">調理のコツ</h4>
                <ul className="space-y-1">
                  {result.mainRecipe.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* バリエーション */}
        {result.variations && result.variations.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">アレンジレシピ</h3>
            <div className="space-y-4">
              {result.variations.map((variation, index) => (
                <div key={index} className="bg-white rounded p-4">
                  <h4 className="font-semibold text-italian-green mb-2">
                    {variation.variationName}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    タイプ: {variation.modificationType}
                  </p>
                  
                  {variation.substitutions.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-1">食材の変更:</h5>
                      <ul className="text-sm space-y-1">
                        {variation.substitutions.map((sub, subIndex) => (
                          <li key={subIndex} className="text-gray-600">
                            {sub.original} → {sub.replacement} ({sub.reason})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        レシピを生成する
      </h2>
      
      {/* VoltAgentステータス表示 */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">VoltAgent 接続状態:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                voltAgentStatus === 'connected' ? 'bg-green-500' :
                voltAgentStatus === 'disconnected' ? 'bg-yellow-500' :
                voltAgentStatus === 'error' ? 'bg-red-500' :
                'bg-gray-400'
              }`} />
              <span className="text-sm text-gray-600">
                {voltAgentStatus === 'connected' ? '接続済み' :
                 voltAgentStatus === 'disconnected' ? '未接続（モック使用）' :
                 voltAgentStatus === 'error' ? 'エラー' :
                 '不明'}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={checkVoltAgentStatus}
            className="text-xs px-2 py-1"
          >
            ステータス確認
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 食材入力 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            使用する食材
          </label>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={`食材 ${index + 1}`}
                  className="flex-1"
                />
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    className="px-3"
                  >
                    削除
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIngredient}
            className="mt-2"
          >
            + 食材を追加
          </Button>
        </div>

        {/* 設定 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              難易度
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-italian-red"
            >
              <option value="easy">簡単</option>
              <option value="medium">普通</option>
              <option value="hard">上級</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              調理時間（分）
            </label>
            <Input
              type="number"
              value={cookingTime}
              onChange={(e) => setCookingTime(Number(e.target.value))}
              min="5"
              max="240"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              人数分
            </label>
            <Input
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              min="1"
              max="20"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeVariations"
              checked={includeVariations}
              onChange={(e) => setIncludeVariations(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="includeVariations" className="text-sm font-medium text-gray-700">
              アレンジレシピも生成
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'レシピを生成中...' : 'レシピを生成する'}
        </Button>
      </form>
    </div>
  )
}
