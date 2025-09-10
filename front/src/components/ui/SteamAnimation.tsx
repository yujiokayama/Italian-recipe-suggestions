'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface SteamAnimationProps {
  isVisible: boolean
  onAnimationComplete?: () => void
  duration?: number // アニメーション表示時間（ミリ秒）
}

export function SteamAnimation({ 
  isVisible, 
  onAnimationComplete, 
  duration = 3000 
}: SteamAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true)
      
      const timer = setTimeout(() => {
        setShowAnimation(false)
        onAnimationComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onAnimationComplete])

  if (!showAnimation) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative">
        {/* Buonoくん成功画像 */}
        <div className="relative animate-fade-in-up">
          <Image 
            src="/images/buono-kun-recipe-success-2.png" 
            alt="レシピ完成のBuonoくん" 
            width={400}
            height={400}
            className="mx-auto" 
          />
          
          {/* 湯気のアニメーション - Buonoくんの上部に表示 */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-48 h-32">
            {/* 大きな湯気パーティクル */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`steam-large-${index}`}
                className="absolute w-6 h-6 bg-white/90 rounded-full"
                style={{
                  left: `${35 + Math.sin(index * 1.256) * 25}%`,
                  bottom: '0%',
                  animation: `steam-large 2.5s infinite ease-out ${index * 0.4}s`,
                }}
              />
            ))}
            {/* 中サイズの湯気パーティクル */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`steam-medium-${index}`}
                className="absolute w-4 h-4 bg-white/80 rounded-full"
                style={{
                  left: `${30 + Math.sin(index * 0.785) * 30}%`,
                  bottom: '15%',
                  animation: `steam-medium 2s infinite ease-out ${index * 0.25 + 0.2}s`,
                }}
              />
            ))}
            {/* 小さな湯気パーティクル */}
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`steam-small-${index}`}
                className="absolute w-3 h-3 bg-white/70 rounded-full"
                style={{
                  left: `${25 + Math.sin(index * 0.524) * 35}%`,
                  bottom: '30%',
                  animation: `steam-small 1.5s infinite ease-out ${index * 0.15 + 0.5}s`,
                }}
              />
            ))}
            {/* 微細な湯気パーティクル */}
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={`steam-tiny-${index}`}
                className="absolute w-2 h-2 bg-white/60 rounded-full"
                style={{
                  left: `${20 + Math.sin(index * 0.419) * 40}%`,
                  bottom: '45%',
                  animation: `steam-tiny 1.2s infinite ease-out ${index * 0.1 + 0.8}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 完成メッセージ */}
        <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="bg-white/95 rounded-lg shadow-lg p-4 max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-italian-red mb-1">
              Buonissimo!
            </h3>
            <p className="text-gray-600 text-sm">
              美味しいレシピが完成しました！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
