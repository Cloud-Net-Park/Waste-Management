import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Recycle, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-environment.jpg";

const HeroSection = () => {
  const stats = [
    { icon: Recycle, label: "Waste Processed", value: "1.2M kg", color: "text-waste-recycling" },
    { icon: Users, label: "Active Citizens", value: "15,847", color: "text-primary" },
    { icon: TrendingUp, label: "Efficiency", value: "87%", color: "text-accent" },
  ];

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">

              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-foreground">Transform</span>{" "}
                <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                  Waste Management
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Comprehensive digital platform for citizen training, waste tracking, and sustainable community participation. 
                Join the movement to scientifically treat India's 1.7 lakh tonnes of daily municipal waste.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="eco" size="lg" className="group">
                Start Managing Waste
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                View Training Modules
              </Button>
            </div>

            {/* Problem Statement */}
            <Card className="p-6 bg-warning/5 border-warning/20">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">The Challenge</h3>
                  <p className="text-sm text-muted-foreground">
                    Only 54% of India's municipal waste is scientifically treated. 24% ends up in landfills, 
                    22% remains unaccounted - often dumped or burned illegally.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-background rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;