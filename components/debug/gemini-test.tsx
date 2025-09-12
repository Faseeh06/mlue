"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { financeAI } from '@/lib/gemini';

export function GeminiTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testGemini = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      const result = await financeAI.processMessage('I spent $10 on coffee', []);
      setTestResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="font-semibold mb-2">Gemini API Test</h3>
      <Button onClick={testGemini} disabled={isLoading}>
        {isLoading ? 'Testing...' : 'Test Gemini API'}
      </Button>
      {testResult && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-64">
          {testResult}
        </pre>
      )}
    </div>
  );
}
