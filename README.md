# イタリア料理レシピ提案システム

食材ベースのレシピ生成とバリエーション提案機能を持つAI搭載イタリア料理レシピ提案アプリケーション。

## アーキテクチャ

- **AIエージェント**: VoltAgent搭載レシピ生成（`/agent`内に配置）
- **フロントエンド**: Next.js 14 with React 18（計画中）
- **バックエンド**: Next.js API Routes（計画中）
- **データベース**: Supabase PostgreSQL（計画中）
- **認証**: Supabase Auth（計画中）
- **デプロイ**: Vercel（計画中）

## 現在の実装状況

### ✅ 完了
- VoltAgent AIエージェントセットアップ
- プロジェクト構造とドキュメント
- 開発環境設定

### 🚧 進行中
- レシピ生成ツールとワークフロー

### 📋 計画中
- Next.jsフロントエンドアプリケーション
- Supabaseデータベース統合
- ユーザー認証
- レシピ管理機能
- Vercelへのデプロイ

## クイックスタート

### 前提条件

- Node.js 20+
- npm
- OpenAI API Key

### セットアップ

1. リポジトリをクローン:
   ```bash
   git clone <repository-url>
   cd Italian-recipe-suggestions
   ```

2. 依存関係をインストール:
   ```bash
   cd agent
   npm install
   ```

3. 環境変数を設定:
   ```bash
   cd agent
   cp .env.example .env
   # .envファイルをOpenAI APIキーで編集
   ```

4. 開発サーバーを起動:
   ```bash
   npm run dev
   ```

## プロジェクト構造

```
Italian-recipe-suggestions/
├── README.md                   # このファイル
├── PROMPT_TEMPLATE.md          # プロジェクト仕様と設計
├── .gitignore                  # Git無視ルール
├── agent/                      # VoltAgent AI実装
│   ├── src/
│   │   ├── index.ts           # メインエントリーポイント
│   │   ├── tools/             # カスタムツール
│   │   └── workflows/         # ワークフロー定義
│   ├── package.json           # 依存関係とスクリプト
│   ├── tsconfig.json          # TypeScript設定
│   └── README.md              # エージェント固有のドキュメント
└── .serena/                   # Serenaプロジェクト設定
    └── project.yml            # プロジェクト設定
```

## 開発コマンド

### エージェント開発
```bash
cd agent

# ホットリロード付き開発モード
npm run dev

# 本番用ビルド
npm run build

# 本番ビルドを実行
npm start

# 型チェック
npm run typecheck

# リンティング
npm run lint
npm run lint:fix
```

## 技術スタック

### 現在の実装
- **VoltAgent**: AIエージェントフレームワーク
- **TypeScript**: 型安全なJavaScript
- **OpenAI GPT-4o-mini**: 言語モデル
- **Biome**: リンティングとフォーマット
- **Zod**: スキーマ検証

### 追加予定
- **Next.js 14**: App Routerを使用したReactフレームワーク
- **Tailwind CSS**: ユーティリティファーストCSSフレームワーク
- **Zustand**: 状態管理
- **React Hook Form + Zod**: フォーム処理
- **Supabase**: データベース、認証、ストレージ
- **Vercel**: デプロイプラットフォーム

## 機能

### コア機能（計画中）
- 🍝 食材ベースのイタリア料理レシピ生成
- 🔄 レシピのバリエーションと代替案
- 👤 ユーザー認証とプロフィール
- ❤️ お気に入りレシピ管理
- 📱 レスポンシブWebインターフェース
- 🔍 レシピ検索とフィルタリング

### AIエージェント機能（現在）
- 食材ベースのレシピ生成
- レシピのバリエーション提案
- 調理のコツと手順
- 難易度レベル評価

## 貢献

1. リポジトリをフォーク
2. 機能ブランチを作成
3. 変更を加える
4. テストとリンティングを実行
5. プルリクエストを提出

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。

## サポート

質問やサポートについては、GitHubリポジトリでIssueを作成してください。
# イタリア料理レシピ提案システム
