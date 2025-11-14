import { Transaction } from './types';
import { generateId } from './finance-utils';

// Manual fallback parser for when Gemini API fails
export function parseTransactionManually(userMessage: string): Transaction | null {
  const message = userMessage.toLowerCase();
  
  // Extract amount using regex
  const amountMatch = message.match(/\$?(\d+(?:\.\d{2})?)/);
  if (!amountMatch) return null;
  
  const amount = parseFloat(amountMatch[1]);
  
  // Determine type
  const isIncome = /earn|salary|income|paid|received|got money|freelance|bonus/.test(message);
  const isExpense = /spent|bought|paid for|cost|purchase|bill/.test(message);
  
  if (!isIncome && !isExpense) return null;
  
  // Extract description (try to get context around the amount)
  let description = userMessage;
  if (message.includes(' on ')) {
    const onMatch = message.match(/on (.+?)(\.|$|,)/);
    if (onMatch) description = onMatch[1];
  } else if (message.includes(' for ')) {
    const forMatch = message.match(/for (.+?)(\.|$|,)/);
    if (forMatch) description = forMatch[1];
  }
  
  // Determine category based on keywords
  let category = 'Other';
  if (/food|lunch|dinner|breakfast|coffee|restaurant|pizza|burger/.test(message)) {
    category = 'Food & Dining';
  } else if (/gas|uber|taxi|bus|train|transport/.test(message)) {
    category = 'Transportation';
  } else if (/shopping|clothes|amazon|store/.test(message)) {
    category = 'Shopping';
  } else if (/movie|game|entertainment/.test(message)) {
    category = 'Entertainment';
  } else if (/bill|electric|water|internet|phone/.test(message)) {
    category = 'Bills & Utilities';
  } else if (/doctor|medicine|health|hospital/.test(message)) {
    category = 'Healthcare';
  } else if (/salary|paycheck|income|freelance/.test(message)) {
    category = isIncome ? 'Salary' : 'Other';
  }
  
  return {
    id: generateId(),
    amount,
    description: description.charAt(0).toUpperCase() + description.slice(1),
    category,
    type: isIncome ? 'income' : 'expense',
    date: new Date().toISOString().split('T')[0],
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    userPrompt: userMessage,
  };
}
