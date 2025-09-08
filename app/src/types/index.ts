export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  dietary_restrictions?: string[]
  cooking_level?: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  user_id: string
  title: string
  description?: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  cooking_time?: number
  difficulty_level?: 'easy' | 'medium' | 'hard'
  cuisine_type: string
  image_url?: string
  is_favorite: boolean
  created_at: string
}

export interface Ingredient {
  name: string
  amount: string
  unit?: string
}

export interface Instruction {
  step: number
  description: string
}

export interface RecipeRequest {
  ingredients: string[]
  userId: string
  preferences?: {
    cookingTime?: number
    difficulty?: 'easy' | 'medium' | 'hard'
    dietaryRestrictions?: string[]
  }
}

export interface RecipeResponse {
  mainRecipe: Recipe
  variations: Recipe[]
  tips: string[]
}