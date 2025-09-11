import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { openai } from "@ai-sdk/openai";

import { ingredientAnalystAgent } from "./ingredientAnalyst";
import { recipeChefAgent } from "./recipeChef";
import { variationChefAgent } from "./variationChef";


import { z } from "zod";

/**
 * メインエージェント
 */
export const mainAgent = new Agent({
  name: "italian-recipe-chef",
  instructions: `
    あなたは本格的なイタリア料理のレシピを作成するエキスパートシェフです。

    ユーザーのリクエストを理解し、次のフローで対応してください：
    1. 食材の分析：提供された食材のイタリア料理への適性を評価し、相性や地方ごとの使用法を提案します。
    2. レシピの生成：分析結果とユーザーの条件に基づき、詳細なイタリアンレシピを作成します。
    3. レシピのバリエーション生成：必要に応じて、指定されたスタイルや条件に合わせたレシピの変更案を提供します。
  `,
  parameters: z.object({
    prompt: z.string().describe("ユーザーからの入力プロンプト"),
  }),
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  subAgents: [ingredientAnalystAgent, recipeChefAgent, variationChefAgent],
});
