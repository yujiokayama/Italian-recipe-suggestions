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
    console.log('Received recipe request:', body)

    // バリデーション
    if (!body.ingredients || body.ingredients.length === 0) {
      return NextResponse.json(
        { error: '食材を少なくとも1つ指定してください' },
        { status: 400 }
      )
    }

    // VoltAgentのエンドポイントURL（localhost:3141）
    const voltAgentUrl = process.env.VOLTAGENT_URL || 'http://localhost:3141'
    console.log('VoltAgent URL:', voltAgentUrl)
    
    // レシピリクエストを自然言語のプロンプトに変換
    const prompt = `以下の条件でイタリアンレシピを生成してください：

食材: ${body.ingredients.join(', ')}
${body.preferences?.difficulty ? `難易度: ${body.preferences.difficulty}` : ''}
${body.preferences?.servings ? `人数: ${body.preferences.servings}人分` : ''}
${body.preferences?.dietaryRestrictions?.length ? `食事制限: ${body.preferences.dietaryRestrictions.join(', ')}` : ''}
${body.includeVariations ? `バリエーションレシピも含める` : ''}
${body.requestedVariations?.length ? `希望するバリエーション: ${body.requestedVariations.join(', ')}` : ''}

JSON形式でレシピを返してください。`

    console.log('Generated prompt:', prompt)

    try {
      // VoltAgentのエージェントを呼び出し
      console.log('Calling VoltAgent...')
      const voltAgentResponse = await fetch(`${voltAgentUrl}/agents/italian-recipe-chef/text`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt)
      })

      console.log('VoltAgent response status:', voltAgentResponse.status)

      if (!voltAgentResponse.ok) {
        const errorText = await voltAgentResponse.text()
        console.error('VoltAgent error:', voltAgentResponse.status, errorText)
        throw new Error(`VoltAgent request failed: ${voltAgentResponse.status}`)
      }

      const voltAgentResult = await voltAgentResponse.json()
      console.log('VoltAgent response:', voltAgentResult)
      
      // VoltAgentからのテキストレスポンスをパース
      let parsedResult
      try {
        // レスポンスの構造を確認
        let responseText = ''
        if (voltAgentResult.output) {
          responseText = voltAgentResult.output
        } else if (voltAgentResult.result) {
          responseText = voltAgentResult.result
        } else if (typeof voltAgentResult === 'string') {
          responseText = voltAgentResult
        } else {
          // 直接JSONオブジェクトの場合
          if (voltAgentResult.mainRecipe) {
            parsedResult = voltAgentResult
          } else {
            throw new Error('Unexpected response format from VoltAgent')
          }
        }

        // テキストからJSONを抽出
        if (!parsedResult && responseText) {
          // JSONブロックを探す（```json...```または{...}）
          const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                           responseText.match(/(\{[\s\S]*\})/)
          
          if (jsonMatch) {
            const jsonString = jsonMatch[1]
            parsedResult = JSON.parse(jsonString)
          } else {
            throw new Error('No JSON found in response')
          }
        }

        if (!parsedResult) {
          throw new Error('Failed to parse VoltAgent response')
        }

      } catch (parseError) {
        console.error('Failed to parse VoltAgent response:', parseError)
        console.log('VoltAgent raw response:', voltAgentResult)
        throw new Error('Failed to parse VoltAgent response')
      }

      // VoltAgentからのレスポンスをフロントエンド用の形式に変換
      const response: RecipeResponse = {
        mainRecipe: parsedResult.mainRecipe,
        variations: parsedResult.variations,
        ingredientAnalysis: parsedResult.ingredientAnalysis,
        metadata: {
          generated_at: new Date().toISOString(),
          language: 'ja',
          format: 'JSON',
          workflow_version: '1.0',
          agent_used: 'voltagent'
        }
      }

      return NextResponse.json(response)

    } catch (voltAgentError) {
      console.error('VoltAgent request failed:', voltAgentError)
      
      // VoltAgentが利用できない場合はフォールバックとしてモックレスポンスを使用
      console.log('Falling back to mock response due to VoltAgent error')
      const mockResponse = createMockResponse(body)
      return NextResponse.json(mockResponse)
    }

  } catch (error) {
    console.error('Recipe generation error:', error)
    
    // エラー時はフォールバックとしてモックレスポンスを試行
    try {
      const body: RecipeRequest = await request.json()
      console.log('Using fallback mock response due to error:', error)
      const mockResponse = createMockResponse(body)
      return NextResponse.json(mockResponse)
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'レシピ生成中にエラーが発生しました' },
        { status: 500 }
      )
    }
  }
}
