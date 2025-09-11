import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { openai } from "@ai-sdk/openai";

import { recipeChefAgent } from "./recipeChef";
import { variationChefAgent } from "./variationChef";
import { ingredientAnalystAgent } from "./ingredientAnalyst";

import { z } from "zod";

/**
 * メインエージェント
 */
export const mainAgent = new Agent({
  name: "italian-recipe-chef",
  instructions: `
    あなたは本格的なイタリア料理アシスタントのメインエージェントです。

    ユーザーのリクエストを理解し、次のいずれかのタスクに振り分けます：
    - レシピ生成（与えられた食材・条件からレシピを作る）
    - レシピのバリエーション生成（指定スタイルに合わせて変更案を作る）
    - 食材分析（相性・地方・手法の提案）
  `,
  parameters: z.object({
    prompt: z.string().describe("ユーザーからの入力プロンプト"),
  }),
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  subAgents: [recipeChefAgent, variationChefAgent, ingredientAnalystAgent],
});
