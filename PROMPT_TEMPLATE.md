# イタリアンレシピ提案アプリケーション開発プロンプトテンプレート

## プロジェクト概要
ユーザーが複数の食材を入力すると、それらを使ったイタリアンレシピをAIが提案するWebアプリケーションを開発します。

### 機能概要
- **食材入力**: フォームから複数の食材を手動で入力
- **レシピ提案**: 入力された食材を使ったイタリアンレシピをAIが生成
- **OCR機能**: 食材リストを画像から読み取る機能（将来的に追加予定）
- **アレンジ提案**: メインレシピに加えて、複数のアレンジレシピも提案

## 技術スタック

### フロントエンド
- **Framework**: Next.js(latest)
- **Language**: TypeScript
- **UI Library**: React
- **Styling**: Tailwind CSS

### バックエンド
- **AI Agent**: VoltAgent
- **API**: Next.js API Routes
- **Language**: TypeScript

### データベース・認証
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (レシピ画像用)

### デプロイ・ホスティング
- **Platform**: Vercel
- **Environment**: Production & Preview environments

## 機能要件

### 1. ユーザー認証
```
- ユーザー登録（Email + Password）
- ログイン・ログアウト
- プロフィール管理
- パスワードリセット
```

### 2. レシピ生成機能
```
- 複数食材の入力フォーム（手動入力）
- AIによるイタリアンレシピ生成
- アレンジレシピの提案
- レシピの詳細表示（材料、手順、調理時間等）
- OCR機能による食材リスト読み取り（将来的な機能）
```

### 3. レシピ管理
```
- お気に入りレシピの保存
- 過去のレシピ履歴
- レシピの検索・フィルタリング
- レシピの共有機能
```

### 4. ユーザープロフィール
```
- 食材の好み設定
- アレルギー情報の管理
- 調理レベルの設定
- 過去の評価履歴
```

## データベーススキーマ

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  avatar_url TEXT,
  dietary_restrictions JSONB,
  cooking_level VARCHAR DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Recipes Table
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  cooking_time INTEGER,
  difficulty_level VARCHAR,
  cuisine_type VARCHAR DEFAULT 'italian',
  image_url TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Recipe_History Table
```sql
CREATE TABLE recipe_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  recipe_id UUID REFERENCES recipes(id),
  input_ingredients JSONB,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## VoltAgent 実装

### AI Agent Configuration
```typescript
// src/agents/recipe-agent.ts
interface RecipeRequest {
  ingredients: string[];
  userId: string;
  preferences?: {
    cookingTime?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    dietaryRestrictions?: string[];
  };
}

interface RecipeResponse {
  mainRecipe: Recipe;
  variations: Recipe[];
  tips: string[];
}
```

### Agent Workflow
1. 食材の前処理・正規化
2. イタリア料理データベースとのマッチング
3. メインレシピの生成
4. アレンジレシピの提案（3-5パターン）
5. 調理のコツ・注意点の生成

## API エンドポイント設計

### Authentication
```
POST /api/auth/register - ユーザー登録
POST /api/auth/login - ログイン
POST /api/auth/logout - ログアウト
GET /api/auth/profile - プロフィール取得
PUT /api/auth/profile - プロフィール更新
```

### Recipe Generation
```
POST /api/recipes/generate - レシピ生成
GET /api/recipes - レシピ一覧取得
GET /api/recipes/:id - 特定レシピ取得
POST /api/recipes/:id/favorite - お気に入り追加
DELETE /api/recipes/:id/favorite - お気に入り削除
```

### Recipe Management
```
GET /api/recipes/history - レシピ履歴
GET /api/recipes/favorites - お気に入り一覧
POST /api/recipes/:id/share - レシピ共有
```

## フロントエンド コンポーネント設計

### Pages
```
/                    - ホームページ
/login              - ログインページ
/register           - 登録ページ
/generate           - レシピ生成ページ（フォーム入力）
/generate/ocr       - OCR機能ページ（将来実装予定）
/recipes            - レシピ一覧ページ
/recipes/[id]       - レシピ詳細ページ
/profile            - プロフィールページ
/history            - 履歴ページ
/favorites          - お気に入りページ
```

### Key Components
```typescript
// 食材入力フォーム（手動入力）
<IngredientInputForm onSubmit={handleGenerate} />

// OCR食材読み取りコンポーネント（将来実装予定）
<OCRIngredientScanner onIngredientsDetected={handleOCRResult} />

// レシピカード
<RecipeCard recipe={recipe} onFavorite={toggleFavorite} />

// レシピ詳細
<RecipeDetail recipe={recipe} variations={variations} />

// ユーザープロフィール
<UserProfile user={user} onUpdate={updateProfile} />

// ナビゲーション
<Navigation user={user} />
```

## 開発プロンプト例

### Phase 1: プロジェクトセットアップ
```
Next.js 14とTypeScriptを使用して、Italian Recipe Suggestionsアプリケーションの基本セットアップを行ってください。

要件:
- App Routerを使用
- Tailwind CSSの設定
- Supabaseクライアントの設定
- 基本的なフォルダ構造の作成
- 環境変数の設定

必要なパッケージ:
- @supabase/supabase-js
- zustand
- react-hook-form
- @hookform/resolvers/zod
- zod
- axios
- lucide-react
```

### Phase 2: 認証システム
```
Supabase Authを使用したユーザー認証システムを実装してください。

実装内容:
1. ログイン・登録フォームの作成
2. 認証状態の管理（Zustand）
3. 保護されたルートの実装
4. ユーザープロフィール管理
5. パスワードリセット機能

コンポーネント:
- LoginForm.tsx
- RegisterForm.tsx
- ProtectedRoute.tsx
- UserProfile.tsx
```

### Phase 3: レシピ生成UI
```
食材入力からレシピ生成までのユーザーインターフェースを実装してください。

要件:
1. 複数食材の動的入力フォーム（手動入力）
2. 料理の好み設定
3. 生成ボタンとローディング状態
4. レシピ結果の表示
5. バリエーション提案の表示
6. OCR機能用のUI設計（将来実装予定のため基本設計のみ）

使用技術:
- React Hook Form + Zod
- Tailwind CSS for styling
- Lucide React for icons

注意: OCR機能は将来的な機能のため、現在は手動での食材入力フォームに重点を置いてください。
```

### Phase 4: VoltAgent統合
```
VoltAgentを使用してAIレシピ生成機能を実装してください。

実装内容:
1. レシピ生成エージェントの作成
2. 食材の前処理・正規化
3. イタリア料理専門のプロンプト設計
4. アレンジレシピの生成ロジック
5. API エンドポイントの実装

エージェント設計:
- 入力: 食材リスト、ユーザー設定
- 出力: メインレシピ + 3-5個のバリエーション
- 特化: イタリア料理に特化した知識
```

### Phase 5: データベース連携
```
Supabaseデータベースとの連携機能を実装してください。

実装内容:
1. レシピの保存・取得
2. お気に入り機能
3. レシピ履歴の管理
4. ユーザー設定の永続化
5. 画像アップロード（Supabase Storage）

テーブル操作:
- users, recipes, recipe_history
- RLS (Row Level Security) の設定
- リアルタイムサブスクリプション
```

### Phase 6: OCR機能実装（将来的な拡張）
```
画像から食材リストを読み取るOCR機能を実装してください。

実装内容:
1. 画像アップロード機能
2. OCRライブラリの統合（Tesseract.js等）
3. 食材名の認識・正規化
4. 認識結果の修正UI
5. 手動入力との統合

技術選択肢:
- Tesseract.js (クライアントサイド)
- Google Cloud Vision API
- AWS Textract
- Azure Computer Vision

注意: この機能は将来的な拡張として設計し、現在は手動入力を優先してください。
```

### Phase 7: デプロイ・最適化
```
Vercelへのデプロイと本番環境の最適化を行ってください。

作業内容:
1. Vercelプロジェクトの設定
2. 環境変数の設定
3. ビルド最適化
4. SEO対応
5. パフォーマンス改善
6. エラーハンドリング

最適化項目:
- 画像最適化
- バンドルサイズ削減
- キャッシュ戦略
- レスポンシブデザイン
```

## 品質管理

### Testing Strategy
```
- Unit Tests: Jest + React Testing Library
- Integration Tests: API endpoint testing
- E2E Tests: Playwright
- Type Safety: TypeScript strict mode
```

### Code Quality
```
- ESLint + Prettier
- Husky + lint-staged
- Conventional Commits
- GitHub Actions CI/CD
```

## セキュリティ考慮事項
```
- Supabase RLS設定
- API Rate Limiting
- 入力値検証（Zod）
- XSS/CSRF対策
- 環境変数の適切な管理
```

このプロンプトテンプレートを参考に、各フェーズごとに詳細な実装を進めてください。
