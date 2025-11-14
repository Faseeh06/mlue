import { GoogleGenerativeAI } from '@google/generative-ai';
import { Transaction } from './types';
import { generateId } from './finance-utils';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyC5YlVzsdilgNIm0vyo_toSZJnYj3atinI');

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  transactions?: Transaction[];
}

export class FinanceAI {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  private systemPrompt = `You are a helpful AI finance assistant. Your job is to:
1. Help users track their income and expenses through natural conversation
2. Extract financial data from user messages and convert them into structured transaction data
3. Provide insights about spending patterns and budgeting advice
4. Respond in a friendly, conversational tone

When a user mentions a financial transaction, always extract:
- Amount (number)
- Description (detailed description including location/vendor if mentioned)
- Category (from the predefined list below)
- Type (income or expense)
- Date (use today's date: ${new Date().toISOString().split('T')[0]} if not specified)
- Day (day of week: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })})
- UserPrompt (the original user message)

ALWAYS respond with valid JSON when extracting transactions:
{
  "message": "Got it! I've recorded your expense/income.",
  "transactions": [
    {
      "amount": 25.50,
      "description": "Coffee and breakfast at Starbucks",
      "category": "Food & Dining",
      "type": "expense",
      "date": "${new Date().toISOString().split('T')[0]}",
      "day": "${new Date().toLocaleDateString('en-US', { weekday: 'long' })}",
      "userPrompt": "I spent $25.50 on coffee and breakfast at Starbucks"
    }
  ]
}

If no financial transaction is mentioned, respond with:
{
  "message": "Your conversational response here"
}

Categories to use (pick the most appropriate):
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Salary
- Freelance
- Investment
- Other`;

  async processMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<ChatMessage> {
    try {
      console.log('Processing message:', userMessage);
      
      // Build conversation context
      const context = conversationHistory
        .slice(-5) // Keep last 5 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `Extract financial data from this message: "${userMessage}"

If it mentions spending money or earning money, respond with this exact JSON format:
{
  "message": "Got it! I've recorded your transaction.",
  "transactions": [
    {
      "amount": 25.50,
      "description": "detailed description here",
      "category": "Food & Dining",
      "type": "expense",
      "date": "${new Date().toISOString().split('T')[0]}",
      "day": "${new Date().toLocaleDateString('en-US', { weekday: 'long' })}",
      "userPrompt": "${userMessage}"
    }
  ]
}

Categories: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Salary, Freelance, Investment, Other
Type: "income" or "expense"

If no financial transaction, respond with:
{
  "message": "How can I help you with your finances?"
}

Only return valid JSON.`;

      console.log('Sending prompt to Gemini...');
      const result = await this.model.generateContent(fullPrompt);
      const response = result.response.text();
      console.log('Gemini response:', response);

      // Clean and parse JSON response
      let aiMessage: string;
      let extractedTransactions: Transaction[] = [];

      try {
        // Clean the response - remove any markdown code blocks or extra text
        let cleanResponse = response.trim();
        
        // Remove markdown code blocks if present
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Find JSON object in the response
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanResponse = jsonMatch[0];
        }
        
        console.log('Cleaned response:', cleanResponse);
        const parsed = JSON.parse(cleanResponse);
        aiMessage = parsed.message || 'Transaction processed!';
        
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          extractedTransactions = parsed.transactions.map((t: any) => ({
            id: generateId(),
            amount: parseFloat(t.amount) || 0,
            description: t.description || 'Unknown transaction',
            category: t.category || 'Other',
            type: t.type === 'income' ? 'income' : 'expense',
            date: t.date || new Date().toISOString().split('T')[0],
            day: t.day || new Date().toLocaleDateString('en-US', { weekday: 'long' }),
            userPrompt: t.userPrompt || userMessage,
          }));
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.log('Raw response:', response);
        // If not JSON, treat as plain text response
        aiMessage = response;
      }

      return {
        id: generateId(),
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date(),
        transactions: extractedTransactions.length > 0 ? extractedTransactions : undefined,
      };
    } catch (error) {
      console.error('Gemini AI Error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // More specific error messages
      let errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('API_KEY') || error.message.includes('invalid key')) {
          errorMessage = 'API key issue. Please get a new API key from Google AI Studio (aistudio.google.com).';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'API quota exceeded. The free tier has limits. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('model')) {
          errorMessage = 'Model not found. Using gemini-1.5-flash-latest model.';
        }
        console.log('Specific error message:', error.message);
      }
      
      return {
        id: generateId(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };
    }
  }

  async getSummaryInsights(transactions: Transaction[]): Promise<string> {
    try {
      const recentTransactions = transactions.slice(-10);
      const transactionSummary = recentTransactions.map(t => 
        `${t.type}: $${t.amount} - ${t.description} (${t.category})`
      ).join('\n');

      const prompt = `Based on these recent transactions, provide brief financial insights and tips:

${transactionSummary}

Keep your response conversational and under 100 words.`;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error getting insights:', error);
      return 'I can help you track your finances! Just tell me about your income or expenses.';
    }
  }
}

export const financeAI = new FinanceAI();
