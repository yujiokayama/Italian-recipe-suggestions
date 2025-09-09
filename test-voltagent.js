#!/usr/bin/env node

/**
 * VoltAgent接続テスト用スクリプト
 * 使用方法: node test-voltagent.js
 */

const VOLTAGENT_URL = process.env.VOLTAGENT_URL || 'http://localhost:4310';

async function testVoltAgentConnection() {
  console.log('🔍 VoltAgent接続テストを開始します...');
  console.log(`📡 接続先: ${VOLTAGENT_URL}`);
  
  try {
    // ヘルスチェック
    console.log('\n1. ヘルスチェック...');
    const healthResponse = await fetch(`${VOLTAGENT_URL}/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ ヘルスチェック成功');
      console.log('   レスポンス:', JSON.stringify(healthData, null, 2));
    } else {
      console.log('❌ ヘルスチェック失敗:', healthResponse.status);
    }
    
    // レシピ生成テスト
    console.log('\n2. レシピ生成テスト...');
    const prompt = `以下の条件でイタリアンレシピを生成してください：

食材: トマト, バジル, モッツァレラ, パスタ
難易度: easy
調理時間: 30分
人数: 4人分
バリエーションレシピも含める
希望するバリエーション: vegetarian

JSON形式でレシピを返してください。`;

    const recipeRequest = {
      input: prompt,
      options: {
        userId: "test-user",
        conversationId: `test-${Date.now()}`,
        contextLimit: 10,
        temperature: 0.7,
        maxTokens: 2000,
      },
    };
    
    console.log('   リクエスト:', JSON.stringify(recipeRequest, null, 2));
    
    const recipeResponse = await fetch(`${VOLTAGENT_URL}/agents/italian-recipe-chef/text`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeRequest)
    });
    
    if (recipeResponse.ok) {
      const recipeData = await recipeResponse.json();
      console.log('✅ レシピ生成成功');
      console.log('   レスポンス:', JSON.stringify(recipeData, null, 2));
    } else {
      const errorText = await recipeResponse.text();
      console.log('❌ レシピ生成失敗:', recipeResponse.status);
      console.log('   エラー:', errorText);
    }
    
  } catch (error) {
    console.log('💥 接続エラー:', error.message);
    console.log('\n🔧 確認事項:');
    console.log('   1. VoltAgentが起動しているか確認');
    console.log('   2. ポート3141で動作しているか確認');
    console.log('   3. 環境変数 VOLTAGENT_URL が正しく設定されているか確認');
    console.log('   4. エンドポイント /agents/italian-recipe-chef/text が利用可能か確認');
  }
}

// メイン実行
testVoltAgentConnection();
