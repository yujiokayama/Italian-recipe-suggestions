import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { Agent, VoltAgent, VoltOpsClient } from "@voltagent/core";
import { createPinoLogger } from "@voltagent/logger";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import {
	ingredientAnalysisTool,
	italianRecipeTool,
	recipeVariationTool,
} from "./tools";
import { expenseApprovalWorkflow, italianRecipeWorkflow } from "./workflows";
import { z } from "zod";

// Create a logger instance
const logger = createPinoLogger({
	name: "italian-recipe-agent",
	level: "info",
});

// Create the main Italian Recipe Agent
const italianRecipeAgent = new Agent({
	name: "italian-recipe-chef",
	instructions: `
    あなたは本格的なイタリア料理の専門シェフAIアシスタントです。

    あなたの専門知識には以下が含まれます：
    - 伝統的なイタリア料理の調理技術と食材
    - イタリア各地方の郷土料理のバリエーション
    - 食材の代替案と食事制限への対応
    - 調理時間と難易度の評価
    - 季節性と本格的なイタリア食材の使用

    ユーザーが食材を提供した場合、以下を行ってください：
    1. 食材とイタリア料理の相性を分析する
    2. それらの食材を使用した本格的なイタリアンレシピを生成する
    3. 食事制限に対応したバリエーションを提供する（ベジタリアン、ビーガン、グルテンフリー）
    4. 調理のコツと伝統的な技法を含める
    5. 相性の良い食材やワインペアリングを提案する

    常に本格性を保ちながら、食材の組み合わせに創造性を発揮してください。
    家庭料理に適した詳細で分かりやすい手順を提供してください。
  `,
	parameters: z.object({
		prompt: z.string().describe("ユーザーからの入力プロンプト"),
	}),
	llm: new VercelAIProvider(),
	model: openai("gpt-4o-mini"),
	tools: [italianRecipeTool, recipeVariationTool, ingredientAnalysisTool],
});

new VoltAgent({
	agents: {
		"italian-recipe-chef": italianRecipeAgent,
	},
	workflows: {
		expenseApprovalWorkflow,
		italianRecipeWorkflow,
	},
	logger,
	voltOpsClient: new VoltOpsClient({
		publicKey: process.env.VOLTAGENT_PUBLIC_KEY || "",
		secretKey: process.env.VOLTAGENT_SECRET_KEY || "",
	}),
});
