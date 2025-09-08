import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Italian Recipe Suggestions - AI搭載イタリア料理レシピ提案',
  description: '食材を入力するだけでAIがあなたにぴったりのイタリア料理レシピを提案します',
  keywords: ['イタリア料理', 'レシピ', 'AI', '食材', '料理'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}