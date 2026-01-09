"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// Input removed in favor of Textarea
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/lib/gemini';
import { Transaction } from '@/lib/types';
import { transactionStorage, storage, apiKeyStorage, aiModelStorage, type AIModel } from '@/lib/storage';
import { unifiedFinanceAI } from '@/lib/ai-provider';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/finance-utils';
import { Send, Bot, User, TrendingUp, TrendingDown, Mic, MicOff } from 'lucide-react';

// Minimal typings for SpeechRecognition so TypeScript compiles without DOM lib
// These are intentionally loose; browsers that lack support will have the button disabled
type SpeechRecognition = any;
type SpeechRecognitionEvent = any;
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

interface AIChatProps {
  onTransactionAdded: (transaction: Transaction) => void;
}

const CHAT_STORAGE_KEY = 'mlue-finance-chat';

export function AIChat({ onTransactionAdded }: AIChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel>('gemini');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldSubmitOnEndRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check for API key and load chat history on mount
  useEffect(() => {
    const checkApiKey = () => {
      const model = aiModelStorage.get();
      const hasKey = unifiedFinanceAI.hasApiKey();
      setHasApiKey(hasKey);
      setCurrentModel(model);
      
      const modelName = model === 'groq' ? 'Groq' : 'Gemini';
      const apiKeyUrl = model === 'groq' 
        ? 'https://console.groq.com/keys' 
        : 'https://aistudio.google.com/app/apikey';
      
      if (!hasKey) {
        // Show welcome message asking for API key
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `Hi! To use AI chat features, please add your ${modelName} API key in Settings. You can get a free API key from ${model === 'groq' ? 'Groq Console' : 'Google AI Studio'}.`,
          timestamp: new Date(),
        }]);
      } else {
        // Load chat history if API key exists
        try {
          const saved = storage.get<unknown>(CHAT_STORAGE_KEY, null as any);
          if (saved && Array.isArray(saved)) {
            const restored = (saved as any[]).map((m) => ({
              ...m,
              timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
            })) as ChatMessage[];
            if (restored.length > 0) {
              setMessages(restored);
            } else {
              setMessages([{
                id: '1',
                role: 'assistant',
                content: 'Hi there, how can I help you?',
                timestamp: new Date(),
              }]);
            }
          } else {
            setMessages([{
              id: '1',
              role: 'assistant',
              content: 'Hi there, how can I help you?',
              timestamp: new Date(),
            }]);
          }
        } catch {
          setMessages([{
            id: '1',
            role: 'assistant',
            content: 'Hi there, how can I help you?',
            timestamp: new Date(),
          }]);
        }
      }
    };
    
    checkApiKey();
    
    // Listen for storage changes to update API key status and model
    const unsubscribe = storage.onStorageChange((key) => {
      if (key === 'mlue-finance-gemini-api-key' || key === 'mlue-finance-groq-api-key' || key === 'mlue-finance-ai-model') {
        checkApiKey();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Persist chat history when messages change
  useEffect(() => {
    try {
      const toSave = messages.slice(-100).map((m) => ({
        ...m,
        // Ensure Date is serialized
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
      }));
      storage.set(CHAT_STORAGE_KEY, toSave);
    } catch {}
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // TTS removed per request

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop any ongoing speech synthesis (legacy cleanup)
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
      // Stop any ongoing speech recognition
      try {
        recognitionRef.current?.stop();
      } catch {}
    };
  }, []);

  // TTS stop function removed

  // Initialize SpeechRecognition lazily
  const getRecognition = (): SpeechRecognition | null => {
    if (typeof window === 'undefined') return null;
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return null;
    if (!recognitionRef.current) {
      const rec: SpeechRecognition = new SpeechRecognitionCtor();
      rec.lang = 'en-US';
      rec.interimResults = true;
      rec.continuous = false;

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputMessage(transcript.trim());
      };

      rec.onstart = () => setIsRecording(true);
      rec.onerror = () => setIsRecording(false);
      rec.onend = () => {
        setIsRecording(false);
        if (shouldSubmitOnEndRef.current) {
          shouldSubmitOnEndRef.current = false;
          if (inputMessage.trim() && !isLoading) {
            // Submit the captured text
            handleSendMessage();
          }
        }
      };

      recognitionRef.current = rec;
    }
    return recognitionRef.current;
  };

  const toggleMic = () => {
    const rec = getRecognition();
    if (!rec || isLoading) return;
    if (!isRecording) {
      shouldSubmitOnEndRef.current = false;
      try {
        setInputMessage('');
        rec.start();
      } catch {}
    } else {
      // second click stops and submits
      shouldSubmitOnEndRef.current = true;
      try {
        rec.stop();
      } catch {}
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check for API key before sending
    if (!unifiedFinanceAI.hasApiKey()) {
      const model = aiModelStorage.get();
      const modelName = model === 'groq' ? 'Groq' : 'Gemini';
      const noKeyMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Please add your ${modelName} API key in Settings to use AI features. Click the button below to go to Settings.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, {
        id: (Date.now() - 1).toString(),
        role: 'user',
        content: inputMessage,
        timestamp: new Date(),
      }, noKeyMessage]);
      setInputMessage('');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await unifiedFinanceAI.processMessage(userMessage.content, messages);
      
      // Check if API key is missing
      if (aiResponse.content === 'API_KEY_MISSING') {
        const model = aiModelStorage.get();
        const modelName = model === 'groq' ? 'Groq' : 'Gemini';
        const noKeyMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `API key is missing or invalid. Please add your ${modelName} API key in Settings.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, noKeyMessage]);
        setHasApiKey(false);
      } else {
        // If AI extracted transactions, save them
        if (aiResponse.transactions && aiResponse.transactions.length > 0) {
          aiResponse.transactions.forEach(transaction => {
            transactionStorage.add(transaction);
            onTransactionAdded(transaction);
          });
        }

        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent border border-border/50 rounded-xl backdrop-blur-sm">
      {/* Chat Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-iris/5 to-transparent">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-iris rounded-full shadow-lg shadow-iris/20">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-serif font-semibold text-foreground mb-1">AI Finance Assistant</h3>
            <p className="text-sm text-muted-foreground">
              {!hasApiKey ? 'API key required' : isLoading ? 'Thinking...' : `Ready (${currentModel === 'groq' ? 'Groq' : 'Gemini'})`}
            </p>
          </div>
          {!hasApiKey && (
            <Button
              onClick={() => router.push('/settings')}
              size="sm"
              className="rounded-full bg-iris text-white hover:bg-iris/90"
            >
              Add API Key
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-end space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-foreground" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border border-border'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>

              {/* Show extracted transactions */}
              {message.transactions && message.transactions.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.transactions.map((transaction) => (
                    <Card key={transaction.id} className="p-3 bg-background border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1.5 rounded-full ${
                            transaction.type === 'income' ? 'bg-lime/20 text-iris' : 'bg-lilac/20 text-iris'
                          }`}>
                            {transaction.type === 'income' ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-foreground">{transaction.description}</p>
                            <div className="flex items-center space-x-2 flex-wrap mt-1">
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(transaction.date)}
                              </span>
                              {transaction.day && (
                                <span className="text-xs text-muted-foreground">
                                  {transaction.day}
                                </span>
                              )}
                            </div>
                            {transaction.userPrompt && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                "{transaction.userPrompt}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="font-serif text-foreground">
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="rounded-full border border-border focus-within:border-iris bg-background px-3 py-1 flex items-center">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything"
            disabled={isLoading}
            rows={2}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 focus:ring-0 ring-0 ring-offset-0 outline-none focus:outline-none shadow-none rounded-full font-light text-sm leading-snug resize-none min-h-[38px] max-h-[60px] py-0.5 placeholder:text-muted-foreground"
          />
          <div className="flex items-center space-x-1 pl-2">
            <Button
              onClick={toggleMic}
              disabled={isLoading || !(typeof window !== 'undefined' && (((window as any).SpeechRecognition) || ((window as any).webkitSpeechRecognition)))}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-accent rounded-full"
              title={!((typeof window !== 'undefined') && (((window as any).SpeechRecognition) || ((window as any).webkitSpeechRecognition))) ? 'Speech recognition not supported' : (isRecording ? 'Stop and send' : 'Start voice input')}
            >
              {isRecording ? <MicOff className="h-3.5 w-3.5 text-foreground" /> : <Mic className="h-3.5 w-3.5 text-foreground" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || !hasApiKey}
              size="sm"
              variant="default"
              className="h-7 w-7 p-0 rounded-full"
              title={!hasApiKey ? "Add API key in Settings to send messages" : "Send"}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
