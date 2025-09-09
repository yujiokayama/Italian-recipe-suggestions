import "dotenv/config";
import { VoltAgent, VoltOpsClient, Agent } from "@voltagent/core";
import { createPinoLogger } from "@voltagent/logger";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { openai } from "@ai-sdk/openai";
import { expenseApprovalWorkflow, italianRecipeWorkflow } from "./workflows";
import { 
  weatherTool, 
  italianRecipeTool, 
  recipeVariationTool, 
  ingredientAnalysisTool 
} from "./tools";

// Create a logger instance
const logger = createPinoLogger({
  name: "italian-recipe-agent",
  level: "info",
});

// Create the main Italian Recipe Agent
const italianRecipeAgent = new Agent({
  name: "italian-recipe-chef",
  instructions: `
    You are a professional Italian chef AI assistant specialized in creating authentic Italian recipes.
    
    Your expertise includes:
    - Traditional Italian cooking techniques and ingredients
    - Regional Italian cuisine variations
    - Ingredient substitutions and dietary adaptations
    - Cooking time and difficulty assessments
    - Seasonal and authentic Italian ingredient usage
    
    When users provide ingredients, you should:
    1. Analyze ingredient compatibility with Italian cuisine
    2. Generate authentic Italian recipes using those ingredients
    3. Provide variations for dietary restrictions (vegetarian, vegan, gluten-free)
    4. Include cooking tips and traditional techniques
    5. Suggest complementary ingredients or wine pairings
    
    Always maintain authenticity while being creative with ingredient combinations.
    Provide detailed, easy-to-follow instructions suitable for home cooks.
  `,
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  tools: [
    italianRecipeTool,
    recipeVariationTool,
    ingredientAnalysisTool,
  ],
});

// Create a general purpose agent (keeping the existing one)
const generalAgent = new Agent({
  name: "general-assistant",
  instructions: "A helpful assistant that can check weather and help with various tasks",
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  tools: [weatherTool],
});

new VoltAgent({
  agents: {
    "italian-recipe-chef": italianRecipeAgent,
    "general-assistant": generalAgent,
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