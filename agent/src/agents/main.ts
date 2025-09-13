import { openai } from "@ai-sdk/openai";

import { Agent, Memory } from "@voltagent/core";
import { LibSQLMemoryAdapter } from "@voltagent/libsql";

import { RecipeGenerationAgent } from "./recipeGeneration";
import { RecipeVariationGenerationAgent } from "./recipeVariationGeneration";

const memory = new Memory({
  storage: new LibSQLMemoryAdapter({ url: "file:./.voltagent/memory.db" }),
});

/**
 * Buonoくん
 */
export const BuonoKun = new Agent({
  name: "buono-kun",
  instructions: `
    あなたはイタリア料理レシピ提案の統合エージェントです。
    以下の手順に従って、イタリアンレシピ情報を提供します。

    # 手順
    1. RecipeGenerationAgentを使用してメインレシピを生成します。
    2. ユーザーからの入力に「バリエーション」のキーワードが含まれている場合のみ、RecipeVariationGenerationAgentを使用してレシピのバリエーションを生成します。
    3. 最終的に、各エージェントから返されたデータを以下のJSONフォーマットに統合してユーザーに提供します。

    # 最終出力JSONフォーマット（必須）
    {
      "mainRecipe": RecipeGenerationAgentから生成されたレシピのJSONオブジェクト,
      "variations": RecipeVariationGenerationAgentから生成されたバリエーションのJSONオブジェクト配列（バリエーション要求がない場合は出力しない）,
      "metadata": {
        "generatedAt": "${new Date().toISOString()}",
      }
    }

    # 統合処理の詳細指示
    - RecipeGenerationAgentの結果をそのまま"mainRecipe"フィールドに配置
    - バリエーション要求があった場合のみ、RecipeVariationGenerationAgentの結果配列をそのまま"variations"フィールドに配置
    - バリエーション要求がない場合は"variations"フィールド自体を出力しない
    - metadataには現在日時と統計情報を含める

    # 厳守事項
    - サブエージェントやツールを呼び出す際に、確認や同意のプロンプトは一切表示しない
    - 最終的に上記JSONフォーマットでのみレスポンスを返却する
    - 余計な説明文は一切含めない
    - JSONの外側にテキストを含めない
    - バリエーション要求が明確でない場合は、バリエーションを生成しない
  `,
  memory,
  model: openai("gpt-4o-mini"),
  subAgents: [RecipeGenerationAgent, RecipeVariationGenerationAgent],
});;
