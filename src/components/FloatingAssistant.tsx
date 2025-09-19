import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { HealthcareAssistant } from './HealthcareAssistant';
import { MessageCircle, Sparkles, Heart } from 'lucide-react';

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          {/* Pulse animation ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur opacity-75 animate-pulse"></div>
          
          <Button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-full w-14 h-14 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          
          {/* Notification badge */}
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full shadow-md">
              <Sparkles className="w-2.5 h-2.5 mr-0.5" />
              AI
            </Badge>
          </div>

          {/* Helper tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Ask me about your health! 
            <div className="flex items-center gap-1 mt-1">
              <Heart className="w-3 h-3 text-green-400" />
              <span className="text-xs text-gray-300">Healthcare Assistant</span>
            </div>
            <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Assistant Modal */}
      <HealthcareAssistant 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}