import { RecipeGenerationForm } from '@/components/forms/RecipeGenerationForm'

export default function RecipePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            イタリアンレシピ生成
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Buonoくんに本格的なイタリア料理のレシピを提案してもらいましょう
          </p>
        </div>
        <RecipeGenerationForm />
      </div>
    </main>
  )
}
