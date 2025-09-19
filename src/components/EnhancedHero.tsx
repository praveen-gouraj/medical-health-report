import { useState, useEffect } from 'react';
import { SDGBadges } from './SDGBadges';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Stethoscope, 
  Activity, 
  Shield, 
  Sparkles, 
  Heart, 
  Users, 
  TrendingUp, 
  Globe, 
  ChevronDown,
  Target,
  Award
} from 'lucide-react';

interface EnhancedHeroProps {
  onScrollToFeatures: () => void;
}

export function EnhancedHero({ onScrollToFeatures }: EnhancedHeroProps) {
  const [currentStat, setCurrentStat] = useState(0);
  
  const impactStats = [
    { label: "Health Reports Simplified", value: "10,000+", icon: Activity },
    { label: "Patients Educated", value: "25,000+", icon: Users },
    { label: "Languages Supported", value: "15+", icon: Globe },
    { label: "Medical Terms Explained", value: "5,000+", icon: Heart }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % impactStats.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [impactStats.length]);

  return (
    <div className="text-center mb-16">
      {/* Main Hero Content */}
      <div className="relative mb-12">
        {/* Floating icons animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center opacity-20 animate-bounce">
            <Stethoscope className="w-8 h-8 text-blue-500" />
          </div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center opacity-20 animate-bounce delay-75">
            <Heart className="w-6 h-6 text-green-500" />
          </div>
          <div className="absolute bottom-20 left-20 w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center opacity-20 animate-bounce delay-150">
            <Activity className="w-7 h-7 text-purple-500" />
          </div>
        </div>

        {/* Logo with enhanced design */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-3xl shadow-2xl">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
              <Award className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
          AI Medical Report
          <br />
          <span className="text-4xl sm:text-5xl lg:text-6xl">Simplifier</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
          Transform complex medical test reports into clear, easy-to-understand explanations. 
          Supporting <span className="font-semibold text-blue-600">SDG 3: Good Health</span> and 
          <span className="font-semibold text-purple-600"> SDG 10: Reduced Inequalities</span> through accessible healthcare information.
        </p>

        {/* Animated impact stat */}
        <div className="flex justify-center mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-xl p-6 max-w-xs">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                {(() => { 
                  const IconComponent = impactStats[currentStat].icon;
                  return <IconComponent className="w-6 h-6 text-white" />;
                })()}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {impactStats[currentStat].value}
              </div>
              <div className="text-sm text-gray-600">
                {impactStats[currentStat].label}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Feature highlights with enhanced design */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Badge className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 px-4 py-2 hover:shadow-lg transition-all duration-200">
          <Activity className="w-4 h-4 mr-2" />
          AI-Powered Analysis
        </Badge>
        <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 px-4 py-2 hover:shadow-lg transition-all duration-200">
          <Shield className="w-4 h-4 mr-2" />
          Private & Secure
        </Badge>
        <Badge className="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200 px-4 py-2 hover:shadow-lg transition-all duration-200">
          <Stethoscope className="w-4 h-4 mr-2" />
          Patient-Friendly
        </Badge>
        <Badge className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 px-4 py-2 hover:shadow-lg transition-all duration-200">
          <Globe className="w-4 h-4 mr-2" />
          Accessible Healthcare
        </Badge>
      </div>

      {/* SDG Integration Section */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Target className="w-5 h-5 text-blue-500" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Supporting UN Sustainable Development Goals
          </h2>
        </div>
        <SDGBadges variant="detailed" />
      </div>

      {/* Call to action */}
      <Button
        onClick={onScrollToFeatures}
        className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
      >
        Get Started Now
        <ChevronDown className="w-5 h-5 ml-2 animate-bounce" />
      </Button>

      {/* Trust indicator */}
      <div className="mt-12">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-100">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Your medical data is processed securely and never stored</span>
          <div className="flex gap-1 ml-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
}