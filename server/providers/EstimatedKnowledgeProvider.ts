import { GoogleGenAI } from '@google/genai';
import { PriceFinderProduct } from '../../src/types';
import { ProductSearchProvider, ParsedShoppingQuery, ProviderDiagnostics } from './types';

/**
 * EstimatedKnowledgeProvider is strictly for non-price informational assistance.
 * Per policy, it MUST NOT generate fictional retailer prices, fictional product listings,
 * fictional availability, fictional UPCs, fictional SKUs, or fictional discounts.
 */
export class EstimatedKnowledgeProvider implements ProductSearchProvider {
  name = 'EstimatedProductKnowledge';
  priority = 4;

  private aiClient: GoogleGenAI | null = null;
  private lastDiagnostics: ProviderDiagnostics | null = null;

  private getAI(): GoogleGenAI | null {
    if (!this.aiClient && process.env.GEMINI_API_KEY) {
      this.aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return this.aiClient;
  }

  isConfigured(): boolean {
    return true;
  }

  getLastDiagnostics(): ProviderDiagnostics | null {
    return this.lastDiagnostics;
  }

  async search(query: string, parsed: ParsedShoppingQuery): Promise<PriceFinderProduct[]> {
    // POLICY: EstimatedKnowledgeProvider does NOT generate fictional retailer prices or fake product listings.
    // It returns empty results so the system never returns fabricated shopping comparison data.
    this.lastDiagnostics = {
      providerName: this.name,
      liveGoogleSearchExecuted: false,
      searchQueriesGenerated: [],
      groundedSourcesFound: 0,
      validProductListingsExtracted: 0,
      retailerDomains: [],
      relevanceFilteredOutCount: 0,
      status: 'NO_RESULTS',
      message: 'Estimated provider does not fabricate shopping listings or retailer prices per strict No Fake Data policy.'
    };

    return [];
  }

  /**
   * Optional non-price informational assistance (e.g. buying advice, spec guide)
   */
  async getInformationalAdvice(query: string): Promise<{ tip: string; specsGuide?: Record<string, string> } | null> {
    const ai = this.getAI();
    if (!ai) return null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Provide general non-pricing consumer purchasing considerations and specifications guide for: "${query}". Do not mention specific retailer prices. Return JSON: { "tip": string, "specsGuide": Record<string, string> }`,
        config: { responseMimeType: 'application/json' }
      });
      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch {
      // Graceful fallback
    }
    return null;
  }
}

