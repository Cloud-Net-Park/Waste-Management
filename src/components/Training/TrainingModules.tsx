import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, CheckCircle, Play, Award } from "lucide-react";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  participants: number;
  progress: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "not-started" | "in-progress" | "completed";
  category: "segregation" | "composting" | "recycling" | "safety";
}

const TrainingModules = () => {
  const modules: TrainingModule[] = [
    {
      id: "1",
      title: "Waste Segregation Basics",
      description: "Learn the fundamentals of proper waste segregation for households and communities",
      duration: "45 min",
      participants: 1247,
      progress: 0,
      difficulty: "Beginner",
      status: "not-started",
      category: "segregation"
    },
    {
      id: "2",
      title: "Home Composting Techniques",
      description: "Master the art of converting organic waste into nutrient-rich compost at home",
      duration: "1h 20min",
      participants: 892,
      progress: 65,
      difficulty: "Intermediate",
      status: "in-progress",
      category: "composting"
    },
    {
      id: "3",
      title: "Recycling Best Practices",
      description: "Understand what can be recycled and how to prepare materials for recycling",
      duration: "35 min",
      participants: 1523,
      progress: 100,
      difficulty: "Beginner",
      status: "completed",
      category: "recycling"
    },
    {
      id: "4",
      title: "Waste Worker Safety Protocols",
      description: "Essential safety measures and protective equipment for waste management workers",
      duration: "2h 15min",
      participants: 456,
      progress: 0,
      difficulty: "Advanced",
      status: "not-started",
      category: "safety"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      segregation: "bg-primary/10 text-primary",
      composting: "bg-waste-composting/10 text-waste-composting",
      recycling: "bg-waste-recycling/10 text-waste-recycling",
      safety: "bg-warning/10 text-warning"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "bg-primary/10 text-primary",
      Intermediate: "bg-warning/10 text-warning",
      Advanced: "bg-destructive/10 text-destructive"
    };
    return colors[difficulty as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Training Modules</h2>
          <p className="text-muted-foreground">Build knowledge for effective waste management</p>
        </div>
        <Button variant="eco">
          <Award className="h-4 w-4 mr-2" />
          View Certificates
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getCategoryColor(module.category)}`}>
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <Badge variant="secondary" className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                </div>
              </div>
              {module.status === "completed" && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{module.title}</h3>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </div>

              {module.status === "in-progress" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{module.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{module.participants.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button 
                variant={module.status === "completed" ? "outline" : "eco"} 
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                {module.status === "completed" ? "Review Module" : 
                 module.status === "in-progress" ? "Continue Learning" : "Start Module"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainingModules;