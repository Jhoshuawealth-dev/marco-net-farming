import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, TrendingUp, Coins, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { markSplashCompleted } = useAuth();

  const pages = [
    {
      icon: Users,
      title: "Connect & Engage",
      subtitle: "Social Section",
      description: "Connect with others, post content, and earn rewards from engagement. Build your network and grow together.",
      features: ["Share your farming journey", "Engage with community", "Earn rewards for interactions"],
      gradient: "from-primary to-primary-light"
    },
    {
      icon: TrendingUp,
      title: "Smart Investments",
      subtitle: "Investment Section", 
      description: "Explore virtual and real investments with live profit tracking. Watch your portfolio grow in real-time.",
      features: ["Track live profits", "Virtual & real investments", "Portfolio analytics"],
      gradient: "from-accent to-accent-light"
    },
    {
      icon: Coins,
      title: "Mine ZukaCoin",
      subtitle: "Mining Section",
      description: "Earn ZukaCoin through simulated in-app mining. Start generating passive income today.",
      features: ["Simulate mining operations", "Earn ZukaCoin rewards", "Passive income generation"],
      gradient: "from-success to-success-light"
    }
  ];

  const handleNext = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleGetStarted = async () => {
    await markSplashCompleted();
    onComplete();
  };

  const currentPageData = pages[currentPage];
  const Icon = currentPageData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto p-8 border-0 shadow-2xl bg-card/95 backdrop-blur">
        <div className="text-center space-y-8">
          {/* Page Indicator */}
          <div className="flex justify-center space-x-2">
            {pages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPage 
                    ? 'bg-primary w-8' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Icon with Gradient Background */}
          <div className={`mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br ${currentPageData.gradient} flex items-center justify-center shadow-xl`}>
            <Icon className="w-12 h-12 text-white" />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{currentPageData.subtitle}</p>
              <h1 className="text-3xl font-bold text-foreground mt-2">{currentPageData.title}</h1>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {currentPageData.description}
            </p>

            {/* Features */}
            <div className="space-y-2 pt-4">
              {currentPageData.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-8">
            {currentPage < pages.length - 1 ? (
              <Button 
                onClick={handleNext}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleGetStarted}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90"
                size="lg"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SplashScreen;