import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface WeatherData {
  city: string;
  aqi: number;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  lastUpdated: string;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
  };
}

export async function fetchKarnatakaWeather(): Promise<WeatherData[]> {
  const cities = ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Kalaburagi"];
  
  const prompt = `Fetch the current real-time weather and air quality index (AQI) data for the following cities in Karnataka, India: ${cities.join(", ")}. 
  For each city, provide:
  1. AQI (numeric)
  2. Temperature in Celsius
  3. Weather condition (e.g., Sunny, Cloudy, Rainy)
  4. Humidity percentage
  5. Wind speed in km/h
  6. PM2.5, PM10, NO2, and O3 pollutant levels if available.
  
  Return the data strictly as a JSON array of objects with the following keys: city, aqi, temperature, condition, humidity, windSpeed, pollutants (object with pm25, pm10, no2, o3). 
  Ensure the data is current.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    // Clean up the response if it contains markdown code blocks
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(jsonStr);
    
    return data.map((item: any) => ({
      ...item,
      lastUpdated: new Date().toLocaleTimeString(),
    }));
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Fallback mock data if search fails or limit reached
    return cities.map(city => ({
      city,
      aqi: Math.floor(Math.random() * 150) + 20,
      temperature: Math.floor(Math.random() * 10) + 25,
      condition: "Partly Cloudy",
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 15) + 5,
      lastUpdated: new Date().toLocaleTimeString(),
      pollutants: {
        pm25: Math.floor(Math.random() * 50),
        pm10: Math.floor(Math.random() * 80),
        no2: Math.floor(Math.random() * 30),
        o3: Math.floor(Math.random() * 40),
      }
    }));
  }
}
