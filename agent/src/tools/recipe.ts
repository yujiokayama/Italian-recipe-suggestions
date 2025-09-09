import { createTool } from "@voltagent/core";
import { z } from "zod";

/**
 * A tool for generating Italian recipes based on given ingredients
 */
export const italianRecipeTool = createTool({
  name: "generateItalianRecipe",
  description: "Generate an Italian recipe using the provided ingredients",
  parameters: z.object({
    ingredients: z.array(z.string()).describe("List of ingredients to use in the recipe"),
    difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("Preferred difficulty level"),
    cookingTime: z.number().optional().describe("Maximum cooking time in minutes"),
    servings: z.number().optional().describe("Number of servings"),
  }),
  execute: async ({ ingredients, difficulty = "medium", cookingTime, servings = 4 }) => {
    // Create a detailed prompt for recipe generation
    const recipePrompt = `
      Create an authentic Italian recipe using these ingredients: ${ingredients.join(", ")}.
      
      Requirements:
      - Difficulty: ${difficulty}
      ${cookingTime ? `- Maximum cooking time: ${cookingTime} minutes` : ""}
      - Servings: ${servings}
      - Must be an authentic Italian dish
      - Include exact measurements
      - Provide step-by-step instructions
      - Include cooking tips
      
      Format the response as a JSON object with:
      - recipeName: string
      - description: string
      - ingredients: array of objects with {name, amount, unit}
      - instructions: array of step-by-step instructions
      - cookingTime: number (in minutes)
      - difficulty: string
      - servings: number
      - tips: array of cooking tips
      - cuisine: "Italian"
    `;

    // This would typically call an LLM to generate the recipe
    // For now, return a structured response that can be used by the workflow
    return {
      prompt: recipePrompt,
      ingredients: ingredients,
      preferences: {
        difficulty,
        cookingTime,
        servings,
      },
      message: `Recipe generation request prepared for ${ingredients.length} ingredients: ${ingredients.join(", ")}`,
    };
  },
});

/**
 * A tool for generating recipe variations/arrangements
 */
export const recipeVariationTool = createTool({
  name: "generateRecipeVariations",
  description: "Generate variations of an existing Italian recipe",
  parameters: z.object({
    baseRecipe: z.string().describe("The base recipe name or description"),
    variationType: z.enum(["vegetarian", "vegan", "gluten-free", "spicy", "creamy", "light"]).describe("Type of variation to create"),
    additionalIngredients: z.array(z.string()).optional().describe("Additional ingredients to incorporate"),
  }),
  execute: async ({ baseRecipe, variationType, additionalIngredients = [] }) => {
    const variationPrompt = `
      Create a ${variationType} variation of this Italian recipe: ${baseRecipe}
      
      ${additionalIngredients.length > 0 ? `Additional ingredients to include: ${additionalIngredients.join(", ")}` : ""}
      
      Requirements:
      - Maintain Italian authenticity
      - Clearly explain modifications from the original
      - Ensure the variation meets the ${variationType} requirements
      - Provide substitution explanations
      
      Format as JSON with:
      - variationName: string
      - originalRecipe: string
      - modificationType: string
      - ingredients: array with substitutions noted
      - instructions: modified step-by-step instructions
      - substitutions: array of {original, replacement, reason}
      - nutritionalBenefits: string (if applicable)
    `;

    return {
      prompt: variationPrompt,
      baseRecipe,
      variationType,
      additionalIngredients,
      message: `Recipe variation request prepared: ${variationType} version of ${baseRecipe}`,
    };
  },
});

/**
 * A tool for analyzing ingredient compatibility with Italian cuisine
 */
export const ingredientAnalysisTool = createTool({
  name: "analyzeIngredients",
  description: "Analyze ingredients for Italian recipe compatibility and suggest combinations",
  parameters: z.object({
    ingredients: z.array(z.string()).describe("Ingredients to analyze"),
  }),
  execute: async ({ ingredients }) => {
    const analysisPrompt = `
      Analyze these ingredients for Italian recipe compatibility: ${ingredients.join(", ")}
      
      Provide analysis including:
      - Traditional Italian usage of each ingredient
      - Compatibility ratings between ingredients
      - Suggested Italian dish categories (pasta, risotto, pizza, etc.)
      - Seasonal considerations
      - Regional Italian variations
      - Missing ingredients that would complement the selection
      
      Format as JSON with:
      - ingredientAnalysis: array of {ingredient, italianUsage, seasonality, region}
      - compatibility: object with compatibility scores
      - suggestedDishTypes: array of Italian dish categories
      - recommendedAdditions: array of complementary ingredients
      - difficultyAssessment: string
    `;

    return {
      prompt: analysisPrompt,
      ingredients,
      analysis: {
        ingredientCount: ingredients.length,
        complexity: ingredients.length > 5 ? "high" : ingredients.length > 3 ? "medium" : "low",
      },
      message: `Ingredient analysis prepared for ${ingredients.length} ingredients`,
    };
  },
});