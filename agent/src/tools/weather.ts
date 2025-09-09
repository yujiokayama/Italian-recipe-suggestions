import { createTool } from "@voltagent/core";
import { z } from "zod";

/**
 * A tool for fetching weather information for a given location
 * This is a mock implementation - replace with real weather API
 */
export const weatherTool = createTool({
	name: "getWeather",
	description: "特定の場所の現在の天気を取得する",
	parameters: z.object({
		location: z.string().describe("天気を取得する都市または場所"),
	}),
	execute: async ({ location }) => {
		// TODO: 実際の天気APIコール（OpenWeatherMap、WeatherAPI、またはAccuWeatherなど）に置き換える

		const conditions = ["晴れ", "曇り", "雨", "雪", "部分的に曇り"];
		const mockWeatherData = {
			location,
			temperature: Math.floor(Math.random() * 30) + 5, // 5-35℃のランダム温度
			condition: conditions[Math.floor(Math.random() * 5)],
			humidity: Math.floor(Math.random() * 60) + 30, // 30-90%のランダム湿度
			windSpeed: Math.floor(Math.random() * 30), // 0-30 km/hのランダム風速
		};

		return {
			type: "weather_response",
			data: {
				weather: mockWeatherData,
				location_searched: location,
				timestamp: new Date().toISOString(),
				units: {
					temperature: "celsius",
					wind_speed: "km/h",
					humidity: "percentage",
				},
			},
			message: `${location}の現在の天気：気温${mockWeatherData.temperature}℃、${mockWeatherData.condition}、湿度${mockWeatherData.humidity}%、風速${mockWeatherData.windSpeed}km/h`,
			format: "JSON",
		};
	},
});
