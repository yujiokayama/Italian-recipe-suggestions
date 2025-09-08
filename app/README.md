# Italian Recipe Suggestions Frontend

Next.js 14 + TypeScript + Tailwind CSSを使用したフロントエンドアプリケーション

## 開発環境のセットアップ

### 前提条件
- Node.js 18.17以上
- npm または yarn

### インストール

1. 依存関係をインストール:
```bash
npm install
```

2. 環境変数を設定:
```bash
cp .env.example .env.local
# .env.localファイルを編集してSupabaseの設定を追加
```

3. 開発サーバーを起動:
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 を開く

## 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用ビルドを作成
- `npm run start` - 本番サーバーを起動
- `npm run lint` - ESLintでコードをチェック
- `npm run type-check` - TypeScriptの型チェック

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # ホームページ
│   ├── providers.tsx   # Providerコンポーネント
│   └── globals.css     # グローバルスタイル
├── components/         # 再利用可能なコンポーネント
│   ├── ui/            # UIコンポーネント
│   └── forms/         # フォームコンポーネント
├── lib/               # ユーティリティ関数
├── store/             # Zustand状態管理
├── types/             # TypeScript型定義
└── hooks/             # カスタムフック
```

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Database**: Supabase
- **Icons**: Lucide React

## 次のステップ

1. Supabase設定の完了
2. 認証システムの実装
3. レシピ生成機能の実装
4. VoltAgentとの統合