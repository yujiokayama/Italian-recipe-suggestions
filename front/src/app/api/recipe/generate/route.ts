import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // voltagentサーバーにリクエストを転送
    const response = await fetch('http://localhost:3141/agents/buono-kun/text', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Voltagent API error:', errorText)
      return NextResponse.json(
        { error: `レシピ生成に失敗しました: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'レシピ生成中にエラーが発生しました' },
      { status: 500 }
    )
  }
}
