# 🍝 Italian Recipe Agent

AI-powered Italian recipe generation system built with [VoltAgent](https://voltagent.dev). This agent specializes in creating authentic Italian recipes based on available ingredients, with support for dietary variations and cooking preferences.

## 🎯 Features

### Core Capabilities
- **🍅 Italian Recipe Generation**: Create authentic Italian recipes from your ingredients
- **🥗 Dietary Variations**: Generate vegetarian, vegan, and gluten-free alternatives
- **📊 Ingredient Analysis**: Analyze ingredient compatibility with Italian cuisine
- **👨‍🍳 Professional Guidance**: Expert cooking tips and traditional techniques
- **🍷 Pairing Suggestions**: Wine and side dish recommendations

### Agent Types
- **Italian Recipe Chef**: Specialized in Italian cuisine and recipe generation
- **General Assistant**: Weather information and general tasks

### Workflows
- **Italian Recipe Generation**: Complete recipe creation with variations
- **Expense Approval**: Example workflow for business processes

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))
- VoltAgent Account (Optional - for production monitoring)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Configuration

Edit `.env` file:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# Optional: VoltOps Platform (for monitoring)
VOLTAGENT_PUBLIC_KEY=your-public-key
VOLTAGENT_SECRET_KEY=your-secret-key

# Development settings
NODE_ENV=development
LOG_LEVEL=info
PORT=3000
```

### Running the Application

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix
```

## 🍝 Using the Italian Recipe Agent

### Example Recipe Generation

#### Basic Recipe Request
```json
{
  "ingredients": ["tomatoes", "basil", "mozzarella", "pasta"],
  "preferences": {
    "difficulty": "easy",
    "cookingTime": 30,
    "servings": 4
  },
  "includeVariations": true
}
```

#### Advanced Recipe with Dietary Restrictions
```json
{
  "ingredients": ["eggplant", "zucchini", "bell peppers", "onion", "garlic"],
  "preferences": {
    "difficulty": "medium",
    "cookingTime": 45,
    "servings": 6,
    "dietaryRestrictions": ["vegetarian"]
  },
  "includeVariations": true,
  "requestedVariations": ["vegan", "gluten-free"]
}
```

#### Quick Simple Recipe
```json
{
  "ingredients": ["pasta", "olive oil", "garlic", "parmesan"],
  "preferences": {
    "difficulty": "easy",
    "cookingTime": 15,
    "servings": 2
  },
  "includeVariations": false
}
```

### Agent Capabilities

#### 1. Italian Recipe Tool
```typescript
italianRecipeTool.execute({
  ingredients: ["chicken", "tomatoes", "basil"],
  difficulty: "medium",
  cookingTime: 45,
  servings: 4
})
```

#### 2. Recipe Variation Tool
```typescript
recipeVariationTool.execute({
  baseRecipe: "Chicken Parmigiana",
  variationType: "vegetarian",
  additionalIngredients: ["eggplant", "zucchini"]
})
```

#### 3. Ingredient Analysis Tool
```typescript
ingredientAnalysisTool.execute({
  ingredients: ["tomatoes", "mozzarella", "basil", "pasta"]
})
```

## 🏗️ Project Structure

```
agent/
├── src/
│   ├── index.ts                 # Main agent configuration
│   ├── tools/
│   │   ├── index.ts            # Tool exports
│   │   ├── recipe.ts           # Italian recipe tools
│   │   └── weather.ts          # Weather tool (example)
│   └── workflows/
│       ├── index.ts            # Workflow exports
│       ├── recipe.ts           # Italian recipe workflow
│       └── (expense workflow)   # Example business workflow
├── .env.example                # Environment template
├── Dockerfile                  # Production deployment
├── package.json
└── tsconfig.json
```

## 🔧 Development

### Adding New Recipe Tools

Create additional tools in `src/tools/recipe.ts`:

```typescript
export const nutritionAnalysisTool = createTool({
  name: "analyzeNutrition",
  description: "Analyze nutritional content of Italian recipes",
  parameters: z.object({
    recipe: z.object({
      ingredients: z.array(z.string()),
      servings: z.number(),
    }),
  }),
  execute: async ({ recipe }) => {
    // Nutritional analysis logic
    return { calories: 450, protein: "25g", carbs: "60g" };
  },
});
```

### Customizing the Recipe Workflow

Modify `src/workflows/recipe.ts` to add new steps:

```typescript
// Add new step to the workflow
.andThen({
  id: "calculate-nutrition",
  execute: async ({ data }) => {
    // Add nutritional calculation step
    return { ...data, nutrition: calculatedNutrition };
  },
})
```

### Testing the Agent

#### Via VoltOps Console
1. Start the agent: `npm run dev`
2. Visit [console.voltagent.dev](https://console.voltagent.dev)
3. Test workflows and tools in real-time

#### Via API Integration
Connect your frontend application to the running agent for recipe generation.

## 🐳 Production Deployment

### Docker
```bash
# Build image
docker build -t italian-recipe-agent .

# Run container
docker run -p 3000:3000 --env-file .env italian-recipe-agent
```

### Environment Variables for Production
```env
NODE_ENV=production
OPENAI_API_KEY=your-production-key
VOLTAGENT_PUBLIC_KEY=your-production-public-key
VOLTAGENT_SECRET_KEY=your-production-secret-key
LOG_LEVEL=warn
```

## 📊 Monitoring with VoltOps

### Development Monitoring
- Real-time agent execution visualization
- Step-by-step workflow debugging
- Performance insights
- Local execution - no data leaves your machine

### Production Monitoring
- Distributed tracing across agent executions
- Error tracking and alerting
- Usage analytics
- Performance optimization insights

## 🤝 Integration Examples

### Next.js Frontend Integration
```typescript
// Call the Italian recipe agent from your frontend
const generateRecipe = async (ingredients: string[]) => {
  const response = await fetch('/api/recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients, preferences: { difficulty: 'easy' } })
  });
  return response.json();
};
```

### API Route Example
```typescript
// pages/api/recipe.ts or app/api/recipe/route.ts
export async function POST(request: Request) {
  const { ingredients, preferences } = await request.json();
  
  // Call VoltAgent workflow
  const result = await voltAgent.runWorkflow('italian-recipe-generation', {
    ingredients,
    preferences,
    includeVariations: true
  });
  
  return Response.json(result);
}
```

## 📚 Resources

- **VoltAgent Documentation**: [voltagent.dev/docs](https://voltagent.dev/docs/)
- **API Reference**: [voltagent.dev/docs/api](https://voltagent.dev/docs/api)
- **Community Discord**: [Join here](https://s.voltagent.dev/discord)
- **Examples Repository**: [GitHub Examples](https://github.com/VoltAgent/voltagent/tree/main/examples)

## 🍝 Recipe Categories Supported

- **Pasta Dishes**: Spaghetti, Penne, Lasagna, Ravioli
- **Risotto**: Mushroom, Seafood, Vegetable variants
- **Pizza**: Traditional and modern toppings
- **Antipasti**: Appetizers and small plates
- **Secondi**: Main courses with meat, fish, or vegetables
- **Dolci**: Traditional Italian desserts

## 🔮 Future Enhancements

- [ ] Image recognition for ingredient identification
- [ ] Seasonal ingredient recommendations
- [ ] Regional Italian cuisine specialization
- [ ] Wine pairing intelligence
- [ ] Meal planning workflows
- [ ] Shopping list generation
- [ ] Cooking video integration

---

<div align="center">
  <p>🍝 Built with passion for Italian cuisine using <a href="https://voltagent.dev">VoltAgent</a> 🇮🇹</p>
</div>