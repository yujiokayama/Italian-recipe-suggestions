'use client'

import { useEffect, useState } from 'react'

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
        {/* 湯気のアニメーション */}
        <div className="relative w-32 h-32 flex items-end justify-center">
          {/* 複数の湯気パーティクル */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-white/80 rounded-full"
              style={{
                left: `${45 + Math.sin(index * 0.785) * 15}%`,
                bottom: '10%',
                animation: `steam 2s infinite ease-out ${index * 0.2}s`,
              }}
            />
          ))}
          {/* 追加の湯気パーティクル */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`extra-${index}`}
              className="absolute w-1.5 h-1.5 bg-white/60 rounded-full"
              style={{
                left: `${35 + Math.sin((index + 4) * 0.785) * 25}%`,
                bottom: '20%',
                animation: `steam 2.5s infinite ease-out ${index * 0.15 + 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* 完成メッセージ */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <div className="text-6xl mb-4">🍝</div>
            <h3 className="text-2xl font-bold text-italian-red mb-2">
              Buonissimo!
            </h3>
            <p className="text-gray-600">
              美味しいレシピが完成しました！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
