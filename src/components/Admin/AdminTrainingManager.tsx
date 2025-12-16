import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Plus, Trash2, BookOpen, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrainingModule {
  id?: number;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  participants: string;
  topics: string[];
}

export default function AdminTrainingManager() {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingModule, setEditingModule] = useState<TrainingModule | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTrainingModules();
  }, []);

  const loadTrainingModules = async () => {
    try {
      const { data, error } = await supabase
        .from("training_modules")
        .select("*")
        .order("created_at");

      if (error) throw error;

      if (data) {
        setModules(data.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description,
          duration: module.duration,
          difficulty: module.difficulty as "Beginner" | "Intermediate" | "Advanced",
          participants: module.participants,
          topics: Array.isArray(module.topics) ? module.topics : []
        })));
      } else {
        // Load default modules if no data exists
        setModules([
          {
            title: "Waste Sorting Basics",
            description: "Learn the fundamentals of proper waste segregation and sorting techniques for maximum recycling efficiency.",
            duration: "45 mins",
            difficulty: "Beginner",
            participants: "Community Members",
            topics: ["Recyclables", "Organics", "Hazardous Waste", "General Waste"]
          },
          {
            title: "Advanced Recycling Techniques",
            description: "Deep dive into specialized recycling methods and emerging technologies in waste management.",
            duration: "90 mins",
            difficulty: "Advanced",
            participants: "Facility Operators",
            topics: ["Material Recovery", "Chemical Recycling", "Upcycling", "Technology Integration"]
          },
          {
            title: "Safety Protocols",
            description: "Essential safety measures and protocols for waste handling and facility operations.",
            duration: "60 mins",
            difficulty: "Intermediate",
            participants: "All Staff",
            topics: ["PPE Usage", "Chemical Safety", "Emergency Procedures", "Risk Assessment"]
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading training modules:", error);
    }
  };

  const saveModule = async (module: TrainingModule) => {
    setIsLoading(true);
    try {
      const moduleData = {
        title: module.title,
        description: module.description,
        duration: module.duration,
        difficulty: module.difficulty,
        participants: module.participants,
        topics: module.topics,
        updated_at: new Date().toISOString()
      };

      if (module.id) {
        // Update existing module
        const { error } = await supabase
          .from("training_modules")
          .update(moduleData)
          .eq("id", module.id);

        if (error) throw error;
      } else {
        // Create new module
        const { error } = await supabase
          .from("training_modules")
          .insert(moduleData);

        if (error) throw error;
      }

      toast({
        title: "Training Module Saved",
        description: "Changes have been saved successfully."
      });

      setEditingModule(null);
      loadTrainingModules();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save training module.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteModule = async (moduleId: number) => {
    if (!confirm("Are you sure you want to delete this training module?")) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("training_modules")
        .delete()
        .eq("id", moduleId);

      if (error) throw error;

      toast({
        title: "Training Module Deleted",
        description: "Module has been removed successfully."
      });

      loadTrainingModules();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete training module.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewModule = () => {
    setEditingModule({
      title: "",
      description: "",
      duration: "",
      difficulty: "Beginner",
      participants: "",
      topics: []
    });
  };

  const updateEditingModule = (field: string, value: any) => {
    if (editingModule) {
      setEditingModule({ ...editingModule, [field]: value });
    }
  };

  const addTopic = (topic: string) => {
    if (editingModule && topic.trim() && !editingModule.topics.includes(topic.trim())) {
      setEditingModule({
        ...editingModule,
        topics: [...editingModule.topics, topic.trim()]
      });
    }
  };

  const removeTopic = (topicToRemove: string) => {
    if (editingModule) {
      setEditingModule({
        ...editingModule,
        topics: editingModule.topics.filter(topic => topic !== topicToRemove)
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Training Modules Management</h3>
          <p className="text-sm text-muted-foreground">Create and manage training content for your team</p>
        </div>
        <Button onClick={addNewModule} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Module
        </Button>
      </div>

      {/* Module Editor */}
      {editingModule && (
        <Card>
          <CardHeader>
            <CardTitle>{editingModule.id ? "Edit Module" : "Create New Module"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="module-title">Title</Label>
                <Input
                  id="module-title"
                  value={editingModule.title}
                  onChange={(e) => updateEditingModule("title", e.target.value)}
                  placeholder="Enter module title"
                />
              </div>
              <div>
                <Label htmlFor="module-duration">Duration</Label>
                <Input
                  id="module-duration"
                  value={editingModule.duration}
                  onChange={(e) => updateEditingModule("duration", e.target.value)}
                  placeholder="e.g., 45 mins"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="module-difficulty">Difficulty</Label>
                <Select
                  value={editingModule.difficulty}
                  onValueChange={(value) => updateEditingModule("difficulty", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="module-participants">Target Participants</Label>
                <Input
                  id="module-participants"
                  value={editingModule.participants}
                  onChange={(e) => updateEditingModule("participants", e.target.value)}
                  placeholder="e.g., Community Members"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="module-description">Description</Label>
              <Textarea
                id="module-description"
                value={editingModule.description}
                onChange={(e) => updateEditingModule("description", e.target.value)}
                placeholder="Enter module description"
                rows={3}
              />
            </div>

            <div>
              <Label>Topics</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingModule.topics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {topic}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => removeTopic(topic)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add topic"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addTopic(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addTopic(input.value);
                    input.value = "";
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => saveModule(editingModule)} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {editingModule.id ? "Update" : "Create"} Module
              </Button>
              <Button variant="outline" onClick={() => setEditingModule(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules List */}
      <div className="grid gap-4">
        {modules.map((module, index) => (
          <Card key={module.id || index}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {module.participants}
                      </span>
                      <Badge variant={
                        module.difficulty === "Beginner" ? "default" :
                        module.difficulty === "Intermediate" ? "secondary" : "destructive"
                      }>
                        {module.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingModule(module)}
                  >
                    Edit
                  </Button>
                  {module.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteModule(module.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">{module.description}</CardDescription>
              <div className="flex flex-wrap gap-1">
                {module.topics.map((topic, topicIndex) => (
                  <Badge key={topicIndex} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}