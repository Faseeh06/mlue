import { Transaction } from './types';
import { generateId } from './finance-utils';
import { apiKeyStorage } from './storage';
import { ChatMessage } from './gemini';

// Groq API configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

// Get Groq API key from storage
const getGroqApiKey = (): string | null => {
  return apiKeyStorage.getGroq();
};

export class GroqFinanceAI {
  async processMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<ChatMessage> {
    try {
      const apiKey = getGroqApiKey();
      if (!apiKey) {
        throw new Error('API_KEY_MISSING');
      }

      console.log('Processing message with Groq:', userMessage);

      // Build conversation context
      const messages = conversationHistory
        .slice(-5) // Keep last 5 messages for context
        .map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        }));

      // Add system prompt and current user message
      const systemPrompt = `You are a helpful AI finance assistant. Your job is to:
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

      const requestBody = {
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
          { role: 'user', content: fullPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      };

      console.log('Sending request to Groq...');
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Groq API error:', errorData);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error('API_KEY_MISSING');
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || '';
      console.log('Groq response:', responseText);

      // Clean and parse JSON response
      let aiMessage: string;
      let extractedTransactions: Transaction[] = [];

      try {
        // Clean the response - remove any markdown code blocks or extra text
        let cleanResponse = responseText.trim();
        
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
        console.log('Raw response:', responseText);
        // If not JSON, treat as plain text response
        aiMessage = responseText;
      }

      return {
        id: generateId(),
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date(),
        transactions: extractedTransactions.length > 0 ? extractedTransactions : undefined,
      };
    } catch (error) {
      console.error('Groq AI Error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // More specific error messages
      let errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message === 'API_KEY_MISSING' || error.message.includes('API_KEY') || error.message.includes('invalid key')) {
          errorMessage = 'API_KEY_MISSING';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'API quota exceeded. The free tier has limits. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        }
        console.log('Specific error message:', error.message);
      } else if (typeof error === 'string' && error === 'API_KEY_MISSING') {
        errorMessage = 'API_KEY_MISSING';
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
      const apiKey = getGroqApiKey();
      if (!apiKey) {
        throw new Error('API_KEY_MISSING');
      }

      const recentTransactions = transactions.slice(-10);
      const transactionSummary = recentTransactions.map(t => 
        `${t.type}: $${t.amount} - ${t.description} (${t.category})`
      ).join('\n');

      const prompt = `Based on these recent transactions, provide brief financial insights and tips:

${transactionSummary}

Keep your response conversational and under 100 words.`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'I can help you track your finances! Just tell me about your income or expenses.';
    } catch (error) {
      console.error('Error getting insights:', error);
      return 'I can help you track your finances! Just tell me about your income or expenses.';
    }
  }
}

export const groqFinanceAI = new GroqFinanceAI();

