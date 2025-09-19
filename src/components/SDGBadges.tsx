import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Heart, Users, Globe, Target, TrendingUp, Award } from 'lucide-react';

interface SDGBadgesProps {
  variant?: 'compact' | 'detailed';
}

export function SDGBadges({ variant = 'compact' }: SDGBadgesProps) {
  const sdgData = [
    {
      id: 3,
      title: "Good Health and Well-being",
      description: "Ensuring healthy lives and promoting well-being for all at all ages",
      icon: Heart,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      impacts: [
        "Democratizing medical information access",
        "Reducing health literacy barriers",
        "Empowering informed healthcare decisions"
      ]
    },
    {
      id: 10,
      title: "Reduced Inequalities",
      description: "Reducing inequality within and among countries",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      impacts: [
        "Equal access to health information",
        "Breaking down technical language barriers",
        "Supporting underserved communities"
      ]
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        {sdgData.map((sdg) => {
          const IconComponent = sdg.icon;
          return (
            <Badge
              key={sdg.id}
              className={`${sdg.bgColor} ${sdg.textColor} ${sdg.borderColor} border px-3 py-1.5 hover:shadow-md transition-all duration-200`}
            >
              <IconComponent className="w-3 h-3 mr-1.5" />
              SDG {sdg.id}: {sdg.title.split(' ').slice(0, 2).join(' ')}
            </Badge>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {sdgData.map((sdg) => {
        const IconComponent = sdg.icon;
        return (
          <Card key={sdg.id} className={`${sdg.bgColor} border-2 ${sdg.borderColor} p-6 hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${sdg.color} rounded-xl flex items-center justify-center shadow-md`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`${sdg.textColor} ${sdg.borderColor} font-semibold`}>
                    SDG {sdg.id}
                  </Badge>
                  <Award className={`w-4 h-4 ${sdg.textColor}`} />
                </div>
                
                <h4 className={`font-semibold ${sdg.textColor} mb-2`}>{sdg.title}</h4>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{sdg.description}</p>
                
                <div className="space-y-2">
                  <p className={`text-sm font-medium ${sdg.textColor} flex items-center gap-1`}>
                    <Target className="w-3 h-3" />
                    Our Impact:
                  </p>
                  <ul className="space-y-1">
                    {sdg.impacts.map((impact, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                        <TrendingUp className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                        {impact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}