import { createWorkflowChain } from "@voltagent/core";
import { z } from "zod";

// バリエーションタイプの定数定義
export const RECIPE_VARIATIONS = [
	"vegetarian",
	"vegan", 
	"gluten-free",
	"spicy",
	"creamy",
	"light",
] as const;

export type RecipeVariationType = typeof RECIPE_VARIATIONS[number];

export const VARIATION_NAMES: Record<RecipeVariationType, string> = {
	vegetarian: "ベジタリアン",
	vegan: "ビーガン",
	"gluten-free": "グルテンフリー",
	spicy: "スパイシー",
	creamy: "クリーミー",
	light: "ライト",
};

// ==============================================================================
// Italian Recipe Generation Workflow
// This workflow handles the complete process of generating Italian recipes
// from user-provided ingredients with multiple variations and suggestions.
//
// Test Scenarios:
//
// Scenario 1: Basic recipe generation
// Input JSON:
// {
//   "ingredients": ["tomatoes", "basil", "mozzarella", "pasta"],
//   "preferences": {
//     "difficulty": "easy",
//     "cookingTime": 30,
//     "servings": 4
//   },
//   "includeVariations": true
// }
//
// Scenario 2: Complex recipe with dietary restrictions
// Input JSON:
// {
//   "ingredients": ["eggplant", "zucchini", "bell peppers", "onion", "garlic"],
//   "preferences": {
//     "difficulty": "medium",
//     "servings": 6,
//     "dietaryRestrictions": ["vegetarian"]
//   },
//   "includeVariations": true,
//   "requestedVariations": ["vegan", "gluten-free"]
// }
//
// Scenario 3: Quick recipe with limited ingredients
// Input JSON:
// {
//   "ingredients": ["pasta", "olive oil", "garlic", "parmesan"],
//   "preferences": {
//     "difficulty": "easy",
//     "cookingTime": 15,
//     "servings": 2
//   },
//   "includeVariations": false
// }
// ==============================================================================

export const italianRecipeWorkflow = createWorkflowChain({
	id: "italian-recipe-generation",
	name: "イタリアンレシピ生成ワークフロー",
	purpose:
		"提供された食材に基づいて本格的なイタリアンレシピとバリエーションを生成する",

	input: z.object({
		ingredients: z
			.array(z.string().min(1))
			.min(1)
			.describe("使用可能な食材のリスト"),
		preferences: z
			.object({
				difficulty: z
					.enum(["easy", "medium", "hard"])
					.optional()
					.default("medium"),
				cookingTime: z
					.number()
					.min(5)
					.max(240)
					.optional()
					.describe("最大調理時間（分）"),
				servings: z.number().min(1).max(20).optional().default(4),
				dietaryRestrictions: z
					.array(z.enum(["vegetarian", "vegan", "gluten-free"]))
					.optional()
					.default([]),
			})
			.optional()
			.default({}),
		includeVariations: z.boolean().optional().default(true),
		requestedVariations: z
			.array(z.enum(RECIPE_VARIATIONS))
			.optional()
			.default([]),
	}),

	result: z.object({
		mainRecipe: z.object({
			recipeName: z.string(),
			description: z.string(),
			ingredients: z.array(
				z.object({
					name: z.string(),
					amount: z.string(),
					unit: z.string(),
				}),
			),
			instructions: z.array(z.string()),
			cookingTime: z.number(),
			difficulty: z.string(),
			servings: z.number(),
			tips: z.array(z.string()),
			cuisine: z.literal("Italian"),
		}),
		variations: z
			.array(
				z.object({
					variationName: z.string(),
					modificationType: z.string(),
					ingredients: z.array(
						z.object({
							name: z.string(),
							amount: z.string(),
							unit: z.string(),
							substitution: z.boolean().optional(),
						}),
					),
					instructions: z.array(z.string()),
					substitutions: z.array(
						z.object({
							original: z.string(),
							replacement: z.string(),
							reason: z.string(),
						}),
					),
				}),
			)
			.optional(),
		ingredientAnalysis: z.object({
			compatibility: z.string(),
			suggestedDishTypes: z.array(z.string()),
			recommendedAdditions: z.array(z.string()),
			difficultyAssessment: z.string(),
		}),
	}),
})

	// ステップ1: イタリア料理の適性のために食材を分析
	.andThen({
		id: "analyze-ingredients",
		execute: async ({ data }) => {
			console.log(
				`イタリアンレシピの適性のために${data.ingredients.length}個の食材を分析中`,
			);

			// このステップではingredientAnalysisToolを使用する
			const analysis = {
				compatibility: data.ingredients.length >= 3 ? "高" : "中",
				suggestedDishTypes: ["パスタ", "リゾット", "ピッツァ"], // これはAIによって決定される
				recommendedAdditions: ["オリーブオイル", "にんにく", "ハーブ"], // これはAIによって決定される
				difficultyAssessment: data.preferences?.difficulty || "medium",
			};

			return {
				...data,
				ingredientAnalysis: analysis,
			};
		},
	})

	// ステップ2: メインのイタリアンレシピを生成
	.andThen({
		id: "generate-main-recipe",
		execute: async ({ data }) => {
			console.log(
				`${data.ingredients.join("、")}を使ったメインのイタリアンレシピを生成中`,
			);

			// このステップではitalianRecipeToolを使用する
			const mainRecipe = {
				recipeName: `イタリアン${data.ingredients[0]}料理`, // これはAIによって生成される
				description: `${data.ingredients.join("、")}を使った美味しいイタリア料理`,
				ingredients: data.ingredients.map((ingredient) => ({
					name: ingredient,
					amount: "お好みで", // これはAIによって決定される
					unit: "",
				})),
				instructions: [
					"すべての食材を準備する",
					"伝統的なイタリア料理の調理法に従う",
					"味を調整する",
					"熱いうちに提供する",
				], // これはAIによって生成される
				cookingTime: data.preferences?.cookingTime || 30,
				difficulty: data.preferences?.difficulty || "medium",
				servings: data.preferences?.servings || 4,
				tips: ["高品質な食材を使用する", "加熱しすぎない"], // これはAIによって生成される
				cuisine: "Italian" as const,
			};

			return {
				...data,
				mainRecipe,
			};
		},
	})

	// ステップ3: レシピのバリエーションを生成（要求された場合）
	.andThen({
		id: "generate-variations",
		execute: async ({ data }) => {
			if (!data.includeVariations) {
				console.log("バリエーションは要求されていないため、スキップします");
				return data;
			}

			console.log(
				`レシピバリエーションを生成中: ${data.requestedVariations?.join("、") || "デフォルトバリエーション"}`,
			);

			const variationsToGenerate: RecipeVariationType[] =
				data.requestedVariations && data.requestedVariations.length > 0
					? data.requestedVariations
					: ["vegetarian", "light"]; // デフォルトバリエーション

			// 新しく定義した定数を使用
			const variationNames = VARIATION_NAMES;

			const variations = variationsToGenerate.map((variationType: RecipeVariationType) => ({
				variationName: `${data.mainRecipe.recipeName}（${variationNames[variationType] || variationType}）`,
				modificationType: variationNames[variationType] || variationType,
				ingredients: data.mainRecipe.ingredients.map((ingredient) => ({
					...ingredient,
					substitution: false, // これはAIによって決定される
				})),
				instructions: data.mainRecipe.instructions, // これはAIによって修正される
				substitutions: [], // これはAIによって生成される
			}));

			return {
				...data,
				variations,
			} as typeof data & { variations: typeof variations };
		},
	})

	// ステップ4: 完全なレシピレスポンスを最終化とフォーマット
	.andThen({
		id: "finalize-recipe",
		execute: async ({ data }) => {
			console.log(`レシピを最終化中: ${data.mainRecipe.recipeName}`);

			// データに variations プロパティが存在することを型で保証
			const dataWithVariations = data as typeof data & {
				variations?: unknown[];
			};

			// 最終的な検証とフォーマット
			const result = {
				mainRecipe: dataWithVariations.mainRecipe,
				variations: dataWithVariations.variations,
				ingredientAnalysis: dataWithVariations.ingredientAnalysis,
				metadata: {
					generated_at: new Date().toISOString(),
					language: "ja",
					format: "JSON",
					workflow_version: "1.0",
				},
			};

			console.log(
				`レシピ生成完了。${dataWithVariations.variations?.length || 0}個のバリエーションを生成しました。`,
			);

			return result;
		},
	});
