import { GoogleGenAI } from "@google/genai";
import { ServiceId, FormData } from '../types';

const generatePrompt = (serviceId: ServiceId, data: FormData): string => {
  switch (serviceId) {
    case ServiceId.CROP_RECOMMENDATION:
      return `
        Act as an expert agronomist. Based on the following farm conditions, recommend the top 3 most suitable crops.
        For each crop, provide a single, concise sentence explaining why it's a good choice based on the provided data.
        Format your response in Markdown with a main heading "Crop Recommendations" and subheadings for each crop.

        Farm Conditions:
        - Expected Annual Rainfall: ${data.rainfall} mm
        - Average Temperature: ${data.temperature} °C
        - Average Humidity: ${data.humidity} %
        - Soil Type: ${data.soilType}
        - Soil pH Level: ${data.soilPh}
        - Preferred Season: ${data.season}
        - Farm Size: ${data.farmSize} hectares
        - Water Availability: ${data.waterAvailability}
        - Farmer's Experience: ${data.experience} years
        - Market Preferences: ${data.market || 'Not specified'}
      `;
    case ServiceId.YIELD_PREDICTION:
      return `
        Act as an agricultural data scientist. Predict the potential yield for the specified crop given the conditions.
        Provide the predicted yield in tons per hectare.
        Also, include one sentence explaining the key factors influencing this prediction based on the data.
        Format your response in Markdown with a main heading "Yield Prediction for ${data.cropType}".

        Conditions:
        - Crop Type: ${data.cropType}
        - Annual Rainfall: ${data.rainfall} mm
        - Pesticide Usage: ${data.pesticide} kg/ha
        - Average Temperature: ${data.temperature} °C
      `;
    case ServiceId.DISEASE_RISK:
      return `
        Act as a plant pathologist. Assess the disease risk for the given crop under the specified conditions.
        State the overall risk level (e.g., Low, Medium, High).
        Then, list 2-3 potential diseases that are most likely. For each, provide one sentence on its description and one on prevention.
        Format your response in Markdown with a main heading "Disease Risk Assessment for ${data.cropType}".

        Conditions:
        - Crop Type: ${data.cropType}
        - Recent Rainfall: ${data.recentRainfall} mm
        - Average Temperature: ${data.temperature} °C
        - Humidity: ${data.humidity} %
        - Last Pesticide Application: ${data.pesticideDays} days ago
        - Current Season: ${data.season}
      `;
    case ServiceId.FERTILIZER_RECOMMENDATION:
        return `
        Act as a soil scientist and agronomist. Recommend a fertilizer plan for the specified crop.
        Provide specific recommendations for N-P-K (Nitrogen-Phosphorus-Potassium) ratios.
        Suggest an appropriate application method and timing based on the growth stage.
        Format your response in Markdown with a main heading "Fertilizer Recommendation for ${data.cropType}".

        Crop and Field Details:
        - Crop Type: ${data.cropType}
        - Expected Annual Rainfall: ${data.rainfall} mm
        - Soil Type: ${data.soilType}
        - Field Size: ${data.fieldSize} hectares
        - Current Growth Stage: ${data.growthStage}
        - Soil pH: ${data.soilPh || 'Not specified'}
      `;
    case ServiceId.WEATHER_FORECAST:
      return `
        Act as a meteorologist specializing in agriculture. Provide a long-range agricultural weather forecast.
        The forecast should cover the specified year and region, focusing on the season of interest.
        Briefly discuss expected rainfall patterns, temperature trends, and potential extreme weather events.
        Conclude with one key planning tip based on the forecast.
        Format your response in Markdown with a main heading "Agricultural Weather Forecast for ${data.location}, ${data.year}".

        Forecast Parameters:
        - Forecast Year: ${data.year}
        - Location/Region: ${data.location}
        - Primary Season of Interest: ${data.season}
        - Crop Cycle Planning Context: ${data.planning || 'General farming'}
      `;
    default:
      return '';
  }
};

export const getAiResponse = async (serviceId: ServiceId, data: FormData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = generatePrompt(serviceId, data);
  if (!prompt) {
    return Promise.reject('Invalid service ID.');
  }

  const maxRetries = 2;
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "No insights could be generated at this time.";
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error("AI response failed after all retries.", lastError);
  return Promise.reject("Service unavailable. Please try again later.");
};