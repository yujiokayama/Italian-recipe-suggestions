"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SteamAnimation } from "@/components/ui/SteamAnimation";
import { useRecipeGeneration } from "@/hooks/useRecipeGeneration";
import type {
  NewRecipeRequest,
  RecipeResponse,
  RecipeVariationType,
  APIVariationResponse,
} from "@/types";
import { RECIPE_VARIATIONS, VARIATION_NAMES } from "@/types";
import Image from "next/image";

interface RecipeGenerationFormProps {
  onBack?: () => void;
  onRecipeGenerated?: (hasRecipe: boolean) => void;
}

export function RecipeGenerationForm({
  onBack,
  onRecipeGenerated,
}: RecipeGenerationFormProps) {
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [cookingTime, setCookingTime] = useState<number>(30);
  const [servings, setServings] = useState<number>(2);
  const [includeVariations, setIncludeVariations] = useState<boolean>(false);
  const [requestedVariations, setRequestedVariations] = useState<
    RecipeVariationType[]
  >([]);
  const [showSteamAnimation, setShowSteamAnimation] = useState<boolean>(false);
  const [justGenerated, setJustGenerated] = useState<boolean>(false);

  const {
    generateRecipe,
    isLoading,
    result,
    error,
    clearResult,
  } = useRecipeGeneration();

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleVariationChange = (
    variation: RecipeVariationType,
    checked: boolean
  ) => {
    let newVariations: RecipeVariationType[];
    if (checked) {
      newVariations = [...requestedVariations, variation];
    } else {
      newVariations = requestedVariations.filter((v) => v !== variation);
    }
    setRequestedVariations(newVariations);
    
    // バリエーションが1つもない場合は「アレンジレシピも提案する」をオフにする
    if (newVariations.length === 0) {
      setIncludeVariations(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredIngredients = ingredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );

    if (filteredIngredients.length === 0) {
      alert("少なくとも1つの食材を入力してください");
      return;
    }

    const request: NewRecipeRequest = [
      {
        type: "ingredients" as const,
        items: filteredIngredients,
      },
      {
        type: "preferences" as const,
        difficulty,
        cookingTime,
        servings,
      },
      {
        type: "variations" as const,
        includeVariations,
        requestedVariations: includeVariations ? requestedVariations : [],
      },
    ];

    await generateRecipe(request);
  };

  // 食材以外の不適切な入力を検出する関数
  const isInvalidIngredientError = (): boolean => {
    if (!result) return false;

    try {
      let textContent = result.data?.text;

      // または result.data.provider.steps の最後のステップから抽出
      if (!textContent) {
        const steps = result.data?.provider?.steps;
        if (steps && steps.length > 0) {
          const lastStep = steps[steps.length - 1];
          const content = lastStep?.content;
          if (content && content.length > 0) {
            textContent = content[content.length - 1]?.text || textContent;
          }
        }
      }

      if (!textContent) return false;

      // 食材として使用できない旨のメッセージを検出（複数食材の場合も含む）
      const invalidMessages = [
        "食材として使用できません",
        "食材ではありません", 
        "別の食材を指定",
        "食材を指定してください",
        "食材として適切ではありません",
        "申し訳ありませんが",
        "料理に使用できません",
        "食べ物ではありません",
        "食材として認識できません",
        "レシピを生成することができません",
        "具体的な食材を教えていただけますか",
        "別の具体的な食材",
        "適切な食材ではありません",
        "食材として利用できません",
        "料理に使用することはできません"
      ];

      const lowerTextContent = textContent.toLowerCase();
      return invalidMessages.some(message => 
        lowerTextContent.includes(message.toLowerCase())
      );
    } catch (error) {
      console.error("Error checking for invalid ingredient:", error);
      return false;
    }
  };

  // レスポンスからエラーメッセージを取得する関数
  const getErrorMessage = (): string | null => {
    if (!result) return null;

    try {
      let textContent = result.data?.text;

      // または result.data.provider.steps の最後のステップから抽出
      if (!textContent) {
        const steps = result.data?.provider?.steps;
        if (steps && steps.length > 0) {
          const lastStep = steps[steps.length - 1];
          const content = lastStep?.content;
          if (content && content.length > 0) {
            textContent = content[content.length - 1]?.text || textContent;
          }
        }
      }

      if (!textContent) return null;

      // JSONが含まれていない場合は、レスポンス全体をエラーメッセージとして扱う
      if (!textContent.includes('{') && textContent.length < 500) {
        return textContent.trim();
      }

      return null;
    } catch (error) {
      console.error("Error extracting error message:", error);
      return null;
    }
  };

  // 不適切な食材を抽出する関数
  const getInvalidIngredients = (): string[] => {
    if (!result) return [];

    try {
      let textContent = result.data?.text;

      // または result.data.provider.steps の最後のステップから抽出
      if (!textContent) {
        const steps = result.data?.provider?.steps;
        if (steps && steps.length > 0) {
          const lastStep = steps[steps.length - 1];
          const content = lastStep?.content;
          if (content && content.length > 0) {
            textContent = content[content.length - 1]?.text || textContent;
          }
        }
      }

      if (!textContent) return [];

      const invalidIngredients: string[] = [];

      // 複数食材のパターンを検索
      const multiplePatterns = [
        /食材「([^」]+)」と「([^」]+)」/,
        /指定された食材「([^」]+)」と「([^」]+)」/,
        /「([^」]+)」と「([^」]+)」では/,
        /「([^」]+)」.*?「([^」]+)」/,
      ];

      // 各パターンでマッチングを試行
      for (const pattern of multiplePatterns) {
        const match = textContent.match(pattern);
        if (match && match[1] && match[2]) {
          invalidIngredients.push(match[1]);
          invalidIngredients.push(match[2]);
          break; // 最初にマッチしたパターンを使用
        }
      }

      // 単一食材のパターン（複数が見つからなかった場合）
      if (invalidIngredients.length === 0) {
        const singlePatterns = [
          /食材「([^」]+)」/,
          /指定された食材「([^」]+)」/,
          /「([^」]+)」.*?食材/,
        ];

        for (const pattern of singlePatterns) {
          const match = textContent.match(pattern);
          if (match && match[1]) {
            invalidIngredients.push(match[1]);
            break;
          }
        }
      }

      // 一般的な「」囲みのパターン（他がない場合）
      if (invalidIngredients.length === 0) {
        const quotedMatches = textContent.match(/「([^」]+)」/g);
        if (quotedMatches) {
          quotedMatches.forEach(match => {
            const ingredient = match.replace(/[「」]/g, '');
            // 適切な長さで、一般的でない文字列のみを対象とする
            if (ingredient.length > 0 && ingredient.length < 20 && 
                !ingredient.includes('レシピ') && !ingredient.includes('料理')) {
              invalidIngredients.push(ingredient);
            }
          });
        }
      }

      // 重複を除去（ES5互換）
      const uniqueIngredients: string[] = [];
      invalidIngredients.forEach(ingredient => {
        if (uniqueIngredients.indexOf(ingredient) === -1) {
          uniqueIngredients.push(ingredient);
        }
      });

      return uniqueIngredients;
    } catch (error) {
      console.error("Error extracting invalid ingredients:", error);
      return [];
    }
  };

  // レスポンスからレシピデータを抽出する関数
  const getRecipeData = (): APIVariationResponse | RecipeResponse | null => {
    if (!result) return null;

    // 食材以外の不適切な入力の場合はnullを返す
    if (isInvalidIngredientError()) {
      return null;
    }

    try {
      console.log("Processing result:", result);

      // result.data.text からJSONを直接抽出する場合
      let textContent = result.data?.text;

      // または result.data.provider.steps の最後のステップから抽出
      if (!textContent) {
        const steps = result.data?.provider?.steps;
        if (steps && steps.length > 0) {
          const lastStep = steps[steps.length - 1];
          const content = lastStep?.content;
          if (content && content.length > 0) {
            textContent = content[content.length - 1]?.text || textContent;
          }
        }
      }

      if (!textContent) {
        console.log("No text content found in result:", result);
        return null;
      }

      console.log(
        "Extracted text content preview:",
        textContent.substring(0, 500)
      );

      // 直接JSONとして解析を試行（まず生のJSONかチェック）
      if (textContent.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(textContent);
          // mainRecipeプロパティがあれば通常のレシピレスポンス
          if (parsed.mainRecipe) {
            return parsed as RecipeResponse;
          }
          // variationNameプロパティがあればバリエーションレスポンス
          else if (parsed.variationName) {
            return parsed as APIVariationResponse;
          } else {
            console.log("Unknown JSON structure:", Object.keys(parsed));
            return parsed;
          }
        } catch (parseError) {
          console.log("Failed to parse as direct JSON, trying other methods");
        }
      }

      // JSONブロックを抽出（```json ... ``` の形式）
      const jsonMatch = textContent.match(/```json\s*\n([\s\S]*?)\n\s*```/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1].trim();
        console.log("Extracted JSON string:", jsonStr.substring(0, 300));
        const parsed = JSON.parse(jsonStr);

        // バリエーションレスポンスか通常のレシピレスポンスかを判定
        if (parsed.mainRecipe) {
          return parsed as RecipeResponse;
        } else if (parsed.variationName) {
          return parsed as APIVariationResponse;
        } else {
          console.log("Unknown JSON structure:", Object.keys(parsed));
          return parsed;
        }
      }

      console.log("No JSON found in text content");
      return null;
    } catch (error) {
      console.error("Recipe data parsing error:", error);
      console.error("Error details:", error);
      return null;
    }
  };

  const recipeData = getRecipeData();

  // バリエーションレスポンスかどうかをチェック
  const isVariationResponse = (data: any): data is APIVariationResponse => {
    return data && "variationName" in data && !("mainRecipe" in data);
  };

  // 表示用のレシピデータを正規化
  const getDisplayRecipe = () => {
    if (!recipeData) return null;

    if (isVariationResponse(recipeData)) {
      // バリエーションレスポンスの場合、mainRecipe形式に変換
      return {
        mainRecipe: {
          recipeName: recipeData.variationName,
          description: `${recipeData.originalRecipe}の${recipeData.modificationType}バージョン`,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          cookingTime: recipeData.cookingTime,
          difficulty: recipeData.difficulty,
          servings: 2, // デフォルト値
          tips: [], // バリエーションレスポンスにはtipsがない場合
          cuisine: recipeData.cuisine,
          region: undefined, // バリエーションレスポンスにはregionがない
          wine_pairing: undefined, // バリエーションレスポンスにはwine_pairingがない
          winePairing: undefined, // バリエーションレスポンスにはwinePairingがない
        },
        variations: [],
        ingredientAnalysis: undefined,
        substitutions: recipeData.substitutions,
        nutritionalBenefits: recipeData.nutritionalBenefits,
      };
    } else {
      return recipeData as RecipeResponse;
    }
  };

  const displayRecipe = getDisplayRecipe();

  // レシピ生成状態を親コンポーネントに通知 & 湯気アニメーション制御
  useEffect(() => {
    if (onRecipeGenerated) {
      // エラー状態の場合はfalseを通知
      if (error || (result && isInvalidIngredientError())) {
        onRecipeGenerated(false);
      } else {
        onRecipeGenerated(!!displayRecipe);
      }
    }

    // レシピが新しく生成された時に湯気アニメーションを表示
    if (displayRecipe && !justGenerated) {
      setShowSteamAnimation(true);
      setJustGenerated(true);
    }
  }, [displayRecipe, onRecipeGenerated, justGenerated, error, result]);

  // 湯気アニメーション完了時の処理
  const handleSteamAnimationComplete = () => {
    setShowSteamAnimation(false);
  };

  // 新しいレシピ生成時の状態リセット
  const handleNewRecipe = () => {
    clearResult();
    setJustGenerated(false);
    setShowSteamAnimation(false);
    // 食材入力をリセットし、フォーカスを戻す
    setIngredients([""]);
    if (onRecipeGenerated) {
      onRecipeGenerated(false);
    }
  };

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <Image
            src="/images/buono-kun-recipe-think.png"
            alt="考え中のBuonoくん"
            width={300}
            height={300}
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-baseline justify-center gap-3">
            <span>レシピを考え中</span>
            <div className="flex items-baseline space-x-1">
              <div className="w-2 h-2 bg-italian-red rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-italian-red rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-italian-red rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </h2>
        </div>
      </div>
    );
  }

  // 食材以外の不適切な入力エラーの表示
  if (result && isInvalidIngredientError()) {
    const errorMessage = getErrorMessage();
    const invalidIngredients = getInvalidIngredients();
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <Image
            src="/images/buono-kun-error.png"
            alt="困ったBuonoくん"
            width={400}
            height={400}
            className="mx-auto mb-6"
          />
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              適切な食材を入力してください
            </h2>
            
            {/* 不適切な食材の表示 */}
            {invalidIngredients.length > 0 && (
              <div className="mb-4 p-3 bg-red-100 rounded border border-red-200">
                <p className="text-red-800 font-medium mb-2">
                  以下は料理の食材として使用できません：
                </p>
                <div className="flex flex-wrap gap-2">
                  {invalidIngredients.map((ingredient, index) => (
                    <span 
                      key={index}
                      className="inline-block px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* エラーメッセージの表示 */}
            {errorMessage && (
              <p className="text-red-700 mb-4 bg-white rounded p-3 border border-red-100 text-sm">
                {errorMessage}
              </p>
            )}
            
            <p className="text-red-700 mb-4">
              トマト、パスタ、チーズなどの料理に使える食材を入力してください。
            </p>
            
            <div className="space-y-2 mb-6">
              <p className="text-sm text-red-600">
                <strong>食材の例：</strong>
              </p>
              <p className="text-sm text-red-600">
                ✓ トマト、玉ねぎ、にんにく、オリーブオイル
              </p>
              <p className="text-sm text-red-600">
                ✓ パスタ、ベーコン、チーズ、卵
              </p>
              <p className="text-sm text-red-600">
                ✓ 鶏肉、ズッキーニ、バジル、モッツァレラチーズ
              </p>
            </div>
            
            <Button onClick={handleNewRecipe} className="bg-italian-red hover:bg-red-700">
              食材を入力し直す
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 通常のエラー（ネットワークエラーなど）の表示
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <Image
            src="/images/buono-kun-error.png"
            alt="困ったBuonoくん"
            width={300}
            height={300}
            className="mx-auto mb-6"
          />
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-orange-800 mb-4">
              エラーが発生しました
            </h2>
            <p className="text-orange-700 mb-4">
              {error}
            </p>
            <Button onClick={handleNewRecipe} className="bg-italian-red hover:bg-red-700">
              もう一度試す
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (displayRecipe) {
    return (
      <>
        {/* 湯気アニメーション */}
        <SteamAnimation
          isVisible={showSteamAnimation}
          onAnimationComplete={handleSteamAnimationComplete}
          duration={3000}
        />

        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              生成されたレシピ
            </h2>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleNewRecipe}>
                新しいレシピを生成
              </Button>
            </div>
          </div>

          {/* メインレシピ */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-italian-red mb-2">
              {displayRecipe.mainRecipe.recipeName}
            </h3>
            <p className="text-gray-600 mb-4">
              {displayRecipe.mainRecipe.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 食材 */}
              <div>
                <h4 className="font-semibold mb-3">
                  食材 ({displayRecipe.mainRecipe.servings}人分)
                </h4>
                <ul className="space-y-1">
                  {displayRecipe.mainRecipe.ingredients.map(
                    (ingredient: any, index: number) => (
                      <li key={index} className="text-sm">
                        {ingredient.name}: {
                          ingredient.unit === '大さじ' || ingredient.unit === '小さじ' 
                            ? `${ingredient.unit}${ingredient.amount}`
                            : `${ingredient.amount} ${ingredient.unit}`
                        }
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* 作り方 */}
              <div>
                <h4 className="font-semibold mb-3">作り方</h4>
                <ol className="space-y-2">
                  {displayRecipe.mainRecipe.instructions.map(
                    (instruction: string, index: number) => (
                      <li key={index} className="text-sm">
                        {index + 1}. {instruction}
                      </li>
                    )
                  )}
                </ol>
              </div>
            </div>

            {/* 調理情報とコツ */}
            <div className="mt-6 pt-6 border-t">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">調理情報</h4>
                  <p className="text-sm text-gray-600">
                    調理時間: {displayRecipe.mainRecipe.cookingTime}分<br />
                    難易度: {displayRecipe.mainRecipe.difficulty}
                    <br />
                    料理: {displayRecipe.mainRecipe.cuisine || "イタリア料理"}
                    <br />
                    地方: {displayRecipe.mainRecipe.region || "イタリア全土"}
                  </p>
                  {((displayRecipe.mainRecipe as any).wine_pairing ||
                    (displayRecipe.mainRecipe as any).winePairing) && (
                    <p className="text-sm text-gray-600 mt-2">
                      おすすめワイン:{" "}
                      {(displayRecipe.mainRecipe as any).wine_pairing ||
                        (displayRecipe.mainRecipe as any).winePairing}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">調理のコツ</h4>
                  <ul className="space-y-1">
                    {displayRecipe.mainRecipe.tips?.map(
                      (tip: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {tip}
                        </li>
                      )
                    ) || <li className="text-sm text-gray-600">特になし</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* バリエーション情報（バリエーションレスポンスの場合） */}
          {isVariationResponse(recipeData) &&
            displayRecipe &&
            "substitutions" in displayRecipe &&
            displayRecipe.substitutions &&
            displayRecipe.substitutions.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">
                  このバリエーションについて
                </h3>
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold text-italian-green mb-2">
                    食材の変更点
                  </h4>
                  <ul className="text-sm space-y-1">
                    {displayRecipe.substitutions.map(
                      (sub: any, subIndex: number) => (
                        <li key={subIndex} className="text-gray-600">
                          {sub.original} → {sub.replacement} ({sub.reason})
                        </li>
                      )
                    )}
                  </ul>
                  {displayRecipe.nutritionalBenefits && (
                    <div className="mt-3">
                      <h5 className="font-medium mb-1">栄養面での利点:</h5>
                      <p className="text-sm text-gray-600">
                        {displayRecipe.nutritionalBenefits}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* バリエーション（通常のレシピレスポンスの場合） */}
          {!isVariationResponse(recipeData) &&
            displayRecipe.variations &&
            displayRecipe.variations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">アレンジレシピ</h3>
                <div className="space-y-6">
                  {displayRecipe.variations.map(
                    (variation: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-6 border"
                      >
                        <h4 className="text-xl font-bold text-italian-green mb-2">
                          {variation.variationName}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          タイプ: {variation.modificationType}
                        </p>

                        {/* 材料 */}
                        {variation.ingredients &&
                          variation.ingredients.length > 0 && (
                            <div className="mb-6">
                              <h5 className="font-semibold mb-3">
                                材料 ({variation.servings || 2}人分)
                              </h5>
                              <div className="grid md:grid-cols-2 gap-2">
                                {variation.ingredients.map(
                                  (
                                    ingredient: any,
                                    ingredientIndex: number
                                  ) => (
                                    <div
                                      key={ingredientIndex}
                                      className="flex justify-between py-1"
                                    >
                                      <span className="text-gray-700">
                                        {ingredient.name}
                                      </span>
                                      <span className="font-medium">
                                        {ingredient.amount} {ingredient.unit}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* 作り方 */}
                        {variation.instructions &&
                          variation.instructions.length > 0 && (
                            <div className="mb-6">
                              <h5 className="font-semibold mb-3">作り方</h5>
                              <ol className="space-y-2">
                                {variation.instructions.map(
                                  (step: string, stepIndex: number) => (
                                    <li
                                      key={stepIndex}
                                      className="text-sm text-gray-700 leading-relaxed"
                                    >
                                      {step}
                                    </li>
                                  )
                                )}
                              </ol>
                            </div>
                          )}

                        {/* 調理情報 */}
                        <div className="mb-4 pt-4 border-t">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h6 className="font-semibold mb-2">調理情報</h6>
                              <p className="text-sm text-gray-600">
                                {variation.cookingTime && (
                                  <>
                                    調理時間: {variation.cookingTime}分<br />
                                  </>
                                )}
                                {variation.difficulty && (
                                  <>
                                    難易度: {variation.difficulty}
                                    <br />
                                  </>
                                )}
                                {variation.cuisine && (
                                  <>料理: {variation.cuisine}</>
                                )}
                              </p>
                            </div>

                            {/* 栄養面での利点 */}
                            {variation.nutritionalBenefits && (
                              <div>
                                <h6 className="font-semibold mb-2">
                                  栄養面での利点
                                </h6>
                                <p className="text-sm text-gray-600">
                                  {variation.nutritionalBenefits}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 食材の変更点（従来の表示も残す） */}
                        {variation.substitutions &&
                          variation.substitutions.length > 0 && (
                            <div className="pt-4 border-t">
                              <h6 className="font-semibold mb-2">
                                食材の変更:
                              </h6>
                              <ul className="text-sm space-y-1">
                                {variation.substitutions.map(
                                  (sub: any, subIndex: number) => (
                                    <li
                                      key={subIndex}
                                      className="text-gray-600"
                                    >
                                      {sub.original} → {sub.replacement} (
                                      {sub.reason})
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* 食材分析 */}
          {displayRecipe.ingredientAnalysis && (
            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-bold mb-4">食材分析</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">
                    相性度: {displayRecipe.ingredientAnalysis.compatibility}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    難易度評価:{" "}
                    {displayRecipe.ingredientAnalysis.difficultyAssessment}
                  </p>
                  <h5 className="font-medium mb-1">推奨料理タイプ:</h5>
                  <ul className="text-sm space-y-1">
                    {displayRecipe.ingredientAnalysis.suggestedDishTypes.map(
                      (type: string, index: number) => (
                        <li key={index} className="text-gray-600">
                          • {type}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium mb-1">おすすめ追加食材:</h5>
                  <ul className="text-sm space-y-1">
                    {displayRecipe.ingredientAnalysis.recommendedAdditions.map(
                      (addition: any, index: number) => (
                        <li key={index} className="text-gray-600">
                          • {addition.ingredient} - {addition.reason}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 食材入力 */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            使用する食材
          </label>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                  placeholder={`食材 ${index + 1}`}
                  className="flex-1"
                />
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    className="px-3"
                  >
                    削除
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIngredient}
            className="mt-2"
          >
            + 食材を追加
          </Button>
        </div>

        {/* 設定 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              難易度
            </label>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "easy" | "medium" | "hard")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-italian-red"
            >
              <option value="easy">簡単</option>
              <option value="medium">普通</option>
              <option value="hard">上級</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              人数分
            </label>
            <Input
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              min="1"
              max="20"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeVariations"
              checked={includeVariations}
              onChange={(e) => setIncludeVariations(e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="includeVariations"
              className="text-sm font-medium text-gray-700"
            >
              アレンジレシピも提案する
            </label>
          </div>
        </div>

        {/* バリエーション選択UI */}
        {includeVariations && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              生成するバリエーション（複数選択可）
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {RECIPE_VARIATIONS.map((variation) => (
                <div key={variation} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`variation-${variation}`}
                    checked={requestedVariations.includes(variation)}
                    onChange={(e) =>
                      handleVariationChange(variation, e.target.checked)
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor={`variation-${variation}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {VARIATION_NAMES[variation]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Button type="submit" size="lg" disabled={isLoading} className="w-full">
          {isLoading ? "レシピを生成中..." : "レシピを生成する"}
        </Button>
      </form>
    </div>
  );
}
