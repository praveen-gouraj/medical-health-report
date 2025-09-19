import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MessageCircle, Send, Bot, User, Heart, Zap, Shield, X } from 'lucide-react';
import { analyzeHealthcareQuestion } from '../utils/geminiApi';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface HealthcareAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const commonQuestions = [
  "What does high cholesterol mean?",
  "How can I improve my blood test results?",
  "What is a normal hemoglobin level?",
  "When should I be concerned about my lab results?",
  "What lifestyle changes can improve my health?",
  "How often should I get blood tests?"
];

export function HealthcareAssistant({ isOpen, onClose }: HealthcareAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your healthcare assistant. I can help you understand medical terms, lab results, and provide general health information. Please remember that I'm here for educational purposes only - always consult your healthcare provider for medical advice. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (question?: string) => {
    const messageContent = question || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await analyzeHealthcareQuestion(messageContent);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Healthcare assistant error:', error);
      toast.error('Sorry, I encountered an error. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your question right now. Please try again in a moment, or consult with your healthcare provider for immediate assistance.",
        sender: 'assistant',
        timestamp: new Date()
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] bg-white/95 backdrop-blur-md shadow-2xl border-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Healthcare Assistant</h3>
              <p className="text-sm text-gray-600">AI-powered health guidance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Heart className="w-3 h-3 mr-1" />
              SDG 3
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Common Questions */}
        <div className="p-4 border-b bg-gray-50/50">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {commonQuestions.slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-white/80 hover:bg-blue-50 border-blue-200/50"
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
                        : 'bg-white border shadow-sm'
                    }`}
                  >
                    <p className={`text-sm leading-relaxed ${
                      message.sender === 'user' ? 'text-white' : 'text-gray-700'
                    }`}>
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border shadow-sm p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible div to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your health, lab results, or medical terms..."
              disabled={isLoading}
              className="flex-1 bg-white/80 border-gray-200"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <Shield className="w-3 h-3 inline mr-1" />
            This is for educational purposes only. Always consult your healthcare provider for medical advice.
          </p>
        </div>
      </Card>
    </div>
  );
}