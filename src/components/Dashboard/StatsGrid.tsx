import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, trend, icon, color }: StatCardProps) => {
  const trendIcon = {
    up: <TrendingUp className="h-4 w-4 text-primary" />,
    down: <TrendingDown className="h-4 w-4 text-destructive" />,
    neutral: <Minus className="h-4 w-4 text-muted-foreground" />,
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="flex items-center space-x-1">
          {trendIcon[trend]}
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-primary' : 
            trend === 'down' ? 'text-destructive' : 
            'text-muted-foreground'
          }`}>
            {change}
          </span>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </Card>
  );
};

const StatsGrid = () => {
  const stats = [
    {
      title: "Total Waste Collected",
      value: "1,247 kg",
      change: "+12%",
      trend: "up" as const,
      icon: <div className="h-6 w-6 bg-waste-recycling rounded" />,
      color: "bg-waste-recycling/10"
    },
    {
      title: "Active Citizens",
      value: "15,847",
      change: "+8%",
      trend: "up" as const,
      icon: <div className="h-6 w-6 bg-primary rounded" />,
      color: "bg-primary/10"
    },
    {
      title: "Facilities Online",
      value: "127",
      change: "+5%",
      trend: "up" as const,
      icon: <div className="h-6 w-6 bg-accent rounded" />,
      color: "bg-accent/10"
    },
    {
      title: "Pending Reports",
      value: "23",
      change: "-15%",
      trend: "down" as const,
      icon: <div className="h-6 w-6 bg-warning rounded" />,
      color: "bg-warning/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;