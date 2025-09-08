import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="container mx-auto px-4 pt-10 pb-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="md:text-5xl font-bold text-gray-900 mb-4">
            <span className='text-sm'>イタリア料理レシピ提案</span>
            <span className="block text-italian-red">Buonoくん</span>
          </h1>
          <Image 
            src="/images/buono-kun.png" 
            alt="Buonoくん" 
            width={400}
            height={400}
            className="mx-auto mb-8" 
          />
          <p className="text-xl text-gray-600 leading-relaxed mb-10">
            手持ちの食材を入力するだけで、AIがあなたにぴったりの
            <br className="hidden md:block" />
            本格イタリア料理レシピを瞬時に提案します
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4">
              レシピを生成する
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4">
              サンプルを見る
            </Button>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          主な機能
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-italian-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🍝</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">食材ベースレシピ生成</h3>
            <p className="text-gray-600">
              冷蔵庫にある食材を入力するだけで、美味しいイタリア料理のレシピを瞬時に生成
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-italian-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">アレンジ提案</h3>
            <p className="text-gray-600">
              メインレシピに加えて、複数のバリエーションレシピも同時に提案
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-italian-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">プロのコツ</h3>
            <p className="text-gray-600">
              レシピと一緒に、料理を成功させるためのプロのコツやポイントも提供
            </p>
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section className="bg-italian-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">今すぐ始めよう</h2>
          <p className="text-xl mb-8 opacity-90">
            あなたの冷蔵庫の食材が、本格イタリア料理に変身します
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-italian-green hover:bg-gray-100">
            無料で始める
          </Button>
        </div>
      </section>
    </main>
  )
}