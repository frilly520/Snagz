import { GoogleGenAI } from '@google/genai';
import { ParsedShoppingQuery } from './providers/types';
import { parseVehicleInfo } from './shoppingDataSources';

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export async function interpretShoppingQuery(rawQuery: string): Promise<ParsedShoppingQuery> {
  const trimmed = (rawQuery || '').trim();
  const lower = trimmed.toLowerCase();
  const keywords = lower.split(/\s+/).filter(Boolean);

  // Baseline vehicle extraction
  const vehicle = parseVehicleInfo(rawQuery);

  // Default fallback parsed object
  const fallback: ParsedShoppingQuery = {
    rawQuery: trimmed,
    normalizedQuery: lower,
    keywords,
    isVehiclePart: vehicle.isVehiclePart,
    vehicleYear: vehicle.year,
    vehicleMake: vehicle.make,
    vehicleModel: vehicle.model,
    vehicleEngine: vehicle.engine,
    vehicleDrivetrain: vehicle.drivetrain
  };

  // Extract common pattern attributes heuristically
  // 1. Part numbers (e.g. K7401, DCD771C2, WH-1000XM5)
  const partMatch = trimmed.match(/\b([A-Z0-9]{2,5}[-_]?[A-Z0-9]{3,7})\b/i);
  if (partMatch) {
    fallback.partNumber = partMatch[1];
  }

  // 2. Oil viscosity (e.g. 5W-30, 0W-20, 10W-40)
  const oilViscMatch = trimmed.match(/\b(\d{1,2}W-\d{2})\b/i);
  if (oilViscMatch) {
    fallback.specs = { ...fallback.specs, 'Viscosity': oilViscMatch[1].toUpperCase() };
    fallback.productType = 'motor oil';
  }

  // 3. Size (e.g. size 10, 40 oz, 1 gallon, 76 count)
  const sizeMatch = trimmed.match(/\b(size\s+\d+(\.\d+)?|\d+\s*(?:oz|fl\s*oz|gal|gallon|quart|qt|pk|pack|count|ct))\b/i);
  if (sizeMatch) {
    fallback.size = sizeMatch[1];
  }

  // 4. Common brands
  const brandKeywords = [
    'sony', 'apple', 'nike', 'dewalt', 'samsung', 'stanley', 'tide', 'dyson',
    'valvoline', 'mobil 1', 'castrol', 'pennzoil', 'moog', 'bounty', 'charmin',
    'purina', 'blue buffalo', 'anker', 'logitech', 'bose', 'garmin'
  ];
  for (const b of brandKeywords) {
    if (lower.includes(b)) {
      fallback.brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }

  // 5. Budget constraint (e.g. "under $50", "below 100")
  const budgetMatch = trimmed.match(/(?:under|below|<)\s*\$?(\d+(?:\.\d+)?)/i);
  if (budgetMatch) {
    fallback.budgetMax = parseFloat(budgetMatch[1]);
  }

  // 6. Color
  const colors = ['midnight blue', 'blue', 'black', 'white', 'silver', 'grey', 'gray', 'red', 'green', 'gold'];
  for (const c of colors) {
    if (lower.includes(c)) {
      fallback.color = c;
      break;
    }
  }

  // Try fast Gemini 3.1 Flash Lite structured parse if available
  const ai = getAI();
  if (ai && trimmed.length > 2) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Analyze this shopper search query: "${trimmed}".
Extract semantic attributes without hallucinating missing vehicle or product info.
Return JSON with:
{
  "productType": string,
  "brand": string or null,
  "model": string or null,
  "modelNumber": string or null,
  "partNumber": string or null,
  "upc": string or null,
  "size": string or null,
  "quantity": number or null,
  "color": string or null,
  "category": string,
  "budgetMax": number or null,
  "isVehiclePart": boolean,
  "vehicleYear": string or null,
  "vehicleMake": string or null,
  "vehicleModel": string or null,
  "vehicleEngine": string or null
}`,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          rawQuery: trimmed,
          normalizedQuery: lower,
          keywords,
          productType: parsed.productType || fallback.productType,
          brand: parsed.brand || fallback.brand,
          model: parsed.model,
          modelNumber: parsed.modelNumber || fallback.partNumber,
          partNumber: parsed.partNumber || fallback.partNumber,
          upc: parsed.upc,
          size: parsed.size || fallback.size,
          quantity: parsed.quantity,
          color: parsed.color || fallback.color,
          category: parsed.category,
          budgetMax: parsed.budgetMax || fallback.budgetMax,
          specs: fallback.specs,
          isVehiclePart: parsed.isVehiclePart ?? fallback.isVehiclePart,
          vehicleYear: parsed.vehicleYear || fallback.vehicleYear,
          vehicleMake: parsed.vehicleMake || fallback.vehicleMake,
          vehicleModel: parsed.vehicleModel || fallback.vehicleModel,
          vehicleEngine: parsed.vehicleEngine || fallback.vehicleEngine,
          vehicleDrivetrain: fallback.vehicleDrivetrain
        };
      }
    } catch (err: any) {
      // Graceful fallback to heuristic parsing
      // console.warn('[QueryInterpreter] LLM parsing bypassed:', err.message);
    }
  }

  return fallback;
}
