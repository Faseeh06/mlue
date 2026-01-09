import { ChatMessage } from './gemini';
import { Transaction } from './types';
import { financeAI } from './gemini';
import { groqFinanceAI } from './groq';
import { aiModelStorage, apiKeyStorage, type AIModel } from './storage';

// Unified AI provider that routes to the selected model
export class UnifiedFinanceAI {
  async processMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<ChatMessage> {
    const model = aiModelStorage.get();
    const hasApiKey = apiKeyStorage.hasForModel(model);
    
    if (!hasApiKey) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'API_KEY_MISSING',
        timestamp: new Date(),
      };
    }
    
    if (model === 'groq') {
      return await groqFinanceAI.processMessage(userMessage, conversationHistory);
    } else {
      return await financeAI.processMessage(userMessage, conversationHistory);
    }
  }

  async getSummaryInsights(transactions: Transaction[]): Promise<string> {
    const model = aiModelStorage.get();
    const hasApiKey = apiKeyStorage.hasForModel(model);
    
    if (!hasApiKey) {
      return 'Please add your API key in Settings to get insights.';
    }
    
    if (model === 'groq') {
      return await groqFinanceAI.getSummaryInsights(transactions);
    } else {
      return await financeAI.getSummaryInsights(transactions);
    }
  }
  
  getCurrentModel(): AIModel {
    return aiModelStorage.get();
  }
  
  hasApiKey(): boolean {
    const model = aiModelStorage.get();
    return apiKeyStorage.hasForModel(model);
  }
}

export const unifiedFinanceAI = new UnifiedFinanceAI();

