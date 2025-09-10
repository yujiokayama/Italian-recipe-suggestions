import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const voltAgentUrl = process.env.VOLTAGENT_URL || 'http://localhost:3141'

    // VoltAgentのヘルスチェック
    const response = await fetch(`${voltAgentUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // タイムアウトを設定（5秒）
      signal: AbortSignal.timeout(5000)
    })

    if (response.ok) {
      const healthData = await response.json()
      return NextResponse.json({
        status: 'connected',
        url: voltAgentUrl,
        health: healthData,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        status: 'disconnected',
        url: voltAgentUrl,
        error: `HTTP ${response.status}`,
        timestamp: new Date().toISOString()
      }, { status: 503 })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      status: 'error',
      url: process.env.VOLTAGENT_URL || 'http://localhost:3141',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}
