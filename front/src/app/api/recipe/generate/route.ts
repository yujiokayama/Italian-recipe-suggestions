import { NextRequest, NextResponse } from 'next/server'
import type { RecipeRequest, RecipeResponse } from '@/types'

// VoltAgentのモックレスポンス（開発用）
function createMockResponse(request: RecipeRequest): RecipeResponse {
  const { ingredients, preferences } = request
  
  return {
    mainRecipe: {
      recipeName: `${ingredients[0]}のイタリアンパスタ`,
      description: `新鮮な${ingredients.join('、')}を使った本格的なイタリア料理です。`,
      ingredients: ingredients.map(ingredient => ({
        name: ingredient,
        amount: '適量',
        unit: ''
      })).concat([
        { name: 'オリーブオイル', amount: '大さじ2', unit: '' },
        { name: 'にんにく', amount: '2片', unit: '' },
        { name: 'パスタ', amount: '400', unit: 'g' }
      ]),
      instructions: [
        'パスタを茹でるためのお湯を沸かし、塩を加えます。',
        'フライパンにオリーブオイルを熱し、みじん切りにしたにんにくを炒めます。',
        `${ingredients.join('、')}を加えて炒めます。`,
        '茹でたパスタを加えて混ぜ合わせます。',
        '味を調整して皿に盛り付けます。'
      ],
      cookingTime: preferences?.cookingTime || 30,
      difficulty: preferences?.difficulty || 'medium',
      servings: preferences?.servings || 4,
      tips: [
        'パスタは表示時間より1分短く茹でて、アルデンテに仕上げましょう。',
        'パスタの茹で汁を少し残しておくと、ソースと絡めやすくなります。',
        '新鮮な食材を使うことで、より美味しく仕上がります。'
      ],
      cuisine: 'Italian',
      region: 'イタリア全土',
      wine_pairing: 'キャンティ・クラシコまたはピノ・グリージョ'
    },
    variations: request.includeVariations ? [
      {
        variationName: `${ingredients[0]}のベジタリアンパスタ`,
        modificationType: 'ベジタリアン',
        ingredients: ingredients.map(ingredient => ({
          name: ingredient,
          amount: '適量',
          unit: '',
          substitution: false
        })).concat([
          { name: '植物性オリーブオイル', amount: '大さじ2', unit: '', substitution: false },
          { name: 'パスタ', amount: '400', unit: 'g', substitution: false }
        ]),
        instructions: [
          'ベジタリアン向けに調整した作り方です。',
          '動物性の食材を使わずに仕上げます。'
        ],
        substitutions: [
          {
            original: 'バター',
            replacement: 'オリーブオイル',
            reason: 'ベジタリアン対応のため'
          }
        ],
        nutritionalBenefits: '植物性食材のみを使用し、健康的です。',
        difficulty: preferences?.difficulty || 'medium',
        cookingTime: (preferences?.cookingTime || 30) + 5,
        cuisine: 'Italian'
      }
    ] : undefined,
    ingredientAnalysis: {
      compatibility: '高',
      suggestedDishTypes: ['パスタ', 'リゾット', 'サラダ'],
      recommendedAdditions: [
        {
          ingredient: 'パルミジャーノ・レッジャーノ',
          reason: 'イタリア料理の風味を高めるため',
          priority: 'high'
        },
        {
          ingredient: 'バジル',
          reason: '香りと彩りを加えるため',
          priority: 'medium'
        }
      ],
      difficultyAssessment: preferences?.difficulty || 'medium',
      cookingMethods: ['炒める', '茹でる', '和える'],
      regionalSuggestions: [
        {
          region: 'トスカーナ',
          dishName: 'ペンネ・アラビアータ',
          reason: 'トマトベースのシンプルな料理が特徴'
        }
      ]
    },
    metadata: {
      generated_at: new Date().toISOString(),
      language: 'ja',
      format: 'JSON',
      workflow_version: '1.0'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RecipeRequest = await request.json()
    
    // バリデーション
    if (!body.ingredients || body.ingredients.length === 0) {
      return NextResponse.json(
        { error: '食材を少なくとも1つ指定してください' },
        { status: 400 }
      )
    }

    // 実際の実装では、ここでVoltAgentのワークフローを呼び出します
    // const response = await callVoltAgentWorkflow(body)
    
    // 開発用のモックレスポンス
    const mockResponse = createMockResponse(body)
    
    return NextResponse.json(mockResponse)
    
  } catch (error) {
    console.error('Recipe generation error:', error)
    return NextResponse.json(
      { error: 'レシピ生成中にエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 実際のVoltAgent連携用の関数（今後実装）
// async function callVoltAgentWorkflow(request: RecipeRequest): Promise<RecipeResponse> {
//   const voltAgentEndpoint = process.env.VOLTAGENT_ENDPOINT || 'http://localhost:8000'
//   
//   const response = await fetch(`${voltAgentEndpoint}/workflows/italian-recipe-generation`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.VOLTAGENT_API_KEY}`,
//     },
//     body: JSON.stringify(request),
//   })
//   
//   if (!response.ok) {
//     throw new Error(`VoltAgent error: ${response.statusText}`)
//   }
//   
//   return response.json()
// }
