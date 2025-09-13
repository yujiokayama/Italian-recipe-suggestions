"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { RecipeGenerationForm } from "@/components/forms/RecipeGenerationForm";

export default function HomePage() {
  const [_, setHasRecipe] = useState(false);
  return (
    <main className="min-h-screen">
      {/* 共通ヘッダー */}
      <header className="container mx-auto px-4 pt-10 pb-4">
        <div className="text-center">
          <h1 className="md:text-5xl font-bold text-gray-900 mb-4">
            <span
              className="inline-block text-italian-red cursor-pointer"
              onClick={() => {
                setHasRecipe(false);
              }}
            >
              Buono<span className="text-base">くん</span>
            </span>
          </h1>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="container mx-auto px-4 pb-10">
        <div className="text-center max-w-4xl mx-auto">
          <Image
            src="/images/buono-kun.png"
            alt="Buonoくん"
            width={400}
            height={400}
            className="mx-auto mb-8"
          />
          <p className="text-xl text-gray-600 leading-relaxed mb-3">
            食材を入力するだけで、Buonoくんがあなたにぴったりの
            <br className="hidden md:block" />
            本格イタリア料理レシピを瞬時に提案します!
          </p>
        </div>
      </section>
      <section>
        {/* レシピ生成フォーム表示 */}
        <div className="bg-gray-50">
          <div className="container mx-auto px-4">
            <RecipeGenerationForm
              onRecipeGenerated={(hasRecipe) => setHasRecipe(hasRecipe)}
            />
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
            <div className="w-16 h-16 bg-italian-red/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="/images/buono-kun-recipe-read.png"
                alt="レシピを読むBuonoくん"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">食材ベースレシピ生成</h3>
            <p className="text-gray-600">
              食材を入力するだけで、美味しいイタリア料理のレシピを瞬時に生成
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-italian-green/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="/images/buono-kun-recipe-arrange.png"
                alt="レシピをアレンジするBuonoくん"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">アレンジ提案</h3>
            <p className="text-gray-600">
              メインレシピに加えて、複数のバリエーションレシピも同時に提案
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-italian-red/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="/images/buono-kun-recipe-success.png"
                alt="レシピを成功させるBuonoくん"
                className="w-full h-full object-cover rounded-full"
              />
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
            Buoonoくんが、本格イタリア料理のレシピを提案します!
          </p>
        </div>
      </section>
    </main>
  );
}
