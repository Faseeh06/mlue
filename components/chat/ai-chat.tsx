"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// Input removed in favor of Textarea
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatMessage, financeAI } from '@/lib/gemini';
import { Transaction } from '@/lib/types';
import { transactionStorage } from '@/lib/storage';
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

export function AIChat({ onTransactionAdded }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi there, how can I help you?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldSubmitOnEndRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      const aiResponse = await financeAI.processMessage(inputMessage, messages);
      
      // If AI extracted transactions, save them
      if (aiResponse.transactions && aiResponse.transactions.length > 0) {
        aiResponse.transactions.forEach(transaction => {
          transactionStorage.add(transaction);
          onTransactionAdded(transaction);
        });
      }

      setMessages(prev => [...prev, aiResponse]);
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
    <div className="flex flex-col h-[600px] bg-transparent border border-gray-200/50 rounded-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200/30">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-200 rounded-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-light tracking-tight">AI FINANCE ASSISTANT</h3>
            <p className="text-sm text-gray-600 font-light">
              {isLoading ? 'Thinking...' : 'Ready to help with your finances'}
            </p>
          </div>
          {/* Voice (TTS) removed */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-end space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-gradient-to-r from-orange-400 to-pink-400' : 'bg-gray-100'}`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white' 
                    : 'bg-gray-50 border border-gray-200/50'
                }`}>
                  <p className="text-sm font-light">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>

              {/* Show extracted transactions */}
              {message.transactions && message.transactions.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.transactions.map((transaction) => (
                    <Card key={transaction.id} className="p-3 bg-transparent border border-gray-200/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1.5 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'income' ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-light">{transaction.description}</p>
                            <div className="flex items-center space-x-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                              <span className="text-xs text-gray-600 font-light">
                                {formatDate(transaction.date)}
                              </span>
                              {transaction.day && (
                                <span className="text-xs text-gray-500 font-light">
                                  {transaction.day}
                                </span>
                              )}
                            </div>
                            {transaction.userPrompt && (
                              <p className="text-xs text-gray-400 font-light mt-1 italic">
                                "{transaction.userPrompt}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className={`font-light ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
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
      <div className="p-4 border-t border-gray-200/30">
        <div className="rounded-full border border-gray-400/60 focus-within:border-gray-600 bg-gray-100 px-3 py-1 flex items-center">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything"
            disabled={isLoading}
            rows={2}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 focus:ring-0 ring-0 ring-offset-0 outline-none focus:outline-none shadow-none rounded-full font-light text-sm leading-snug resize-none min-h-[38px] max-h-[60px] py-0.5 placeholder:text-gray-500"
          />
          <div className="flex items-center space-x-1 pl-2">
            <Button
              onClick={toggleMic}
              disabled={isLoading || !(typeof window !== 'undefined' && (((window as any).SpeechRecognition) || ((window as any).webkitSpeechRecognition)))}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
              title={!((typeof window !== 'undefined') && (((window as any).SpeechRecognition) || ((window as any).webkitSpeechRecognition))) ? 'Speech recognition not supported' : (isRecording ? 'Stop and send' : 'Start voice input')}
            >
              {isRecording ? <MicOff className="h-3.5 w-3.5 text-gray-700" /> : <Mic className="h-3.5 w-3.5 text-gray-700" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              className="h-7 w-7 p-0 rounded-full bg-gray-800 hover:bg-gray-900 text-white border-0"
              title="Send"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
