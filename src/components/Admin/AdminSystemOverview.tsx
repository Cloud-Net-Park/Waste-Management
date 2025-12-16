import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Save, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSystemOverview() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Hero Content State
  const [heroContent, setHeroContent] = useState({
    title: "Smart Waste Management Solutions",
    subtitle: "Revolutionizing waste collection and recycling for a cleaner tomorrow",
    description: "Our intelligent waste management system helps communities reduce environmental impact through optimized collection routes, real-time monitoring, and comprehensive recycling programs."
  });

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState([
    { title: "Total Waste Collected", value: "2,450", unit: "tons" },
    { title: "Recycling Rate", value: "78", unit: "%" },
    { title: "Active Facilities", value: "24", unit: "" },
    { title: "Carbon Saved", value: "1,200", unit: "kg CO₂" }
  ]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load hero content with error handling
      const { data: heroData, error: heroError } = await supabase
        .from("hero_content")
        .select("*")
        .single();

      if (heroError) {
        console.warn("Hero content table not found or empty, using defaults:", heroError.message);
      } else if (heroData) {
        setHeroContent({
          title: heroData.title || heroContent.title,
          subtitle: heroData.subtitle || heroContent.subtitle,
          description: heroData.description || heroContent.description
        });
      }

      // Load dashboard stats with error handling (without display_order)
      const { data: statsData, error: statsError } = await supabase
        .from("dashboard_stats")
        .select("*");

      if (statsError) {
        console.warn("Dashboard stats table not found, using defaults:", statsError.message);
      } else if (statsData && statsData.length > 0) {
        setDashboardStats(statsData.map(stat => ({
          title: stat.title,
          value: stat.value,
          unit: stat.unit || ""
        })));
      }
    } catch (error) {
      console.error("Error loading content:", error);
      // Keep default values if there's an error
    }
  };

  const saveHeroContent = async () => {
    setIsLoading(true);
    try {
      // First, try to get existing hero content
      const { data: existing } = await supabase
        .from("hero_content")
        .select("id")
        .limit(1)
        .single();

      let heroId = existing?.id;
      
      if (!heroId) {
        // If no existing content, create new with INSERT
        const { data, error } = await supabase
          .from("hero_content")
          .insert({
            title: heroContent.title,
            subtitle: heroContent.subtitle,
            description: heroContent.description
          })
          .select("id")
          .single();

        if (error) {
          if (error.message.includes('relation "hero_content" does not exist')) {
            toast({
              title: "Table Missing",
              description: "Please run the database setup script to create the hero_content table.",
              variant: "destructive"
            });
            return;
          } else {
            throw error;
          }
        }
        heroId = data.id;
      } else {
        // Update existing content
        const { error } = await supabase
          .from("hero_content")
          .update({
            title: heroContent.title,
            subtitle: heroContent.subtitle,
            description: heroContent.description
          })
          .eq("id", heroId);

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Hero Content Updated",
        description: "Changes have been saved successfully."
      });
    } catch (error) {
      console.error("Save hero content error:", error);
      toast({
        title: "Error",
        description: `Failed to update hero content: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDashboardStats = async () => {
    setIsLoading(true);
    try {
      // Delete existing stats and insert new ones
      const { error: deleteError } = await supabase
        .from("dashboard_stats")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all existing

      if (deleteError && !deleteError.message.includes('relation "dashboard_stats" does not exist')) {
        throw deleteError;
      }

      const statsToInsert = dashboardStats.map((stat) => ({
        title: stat.title,
        value: stat.value,
        unit: stat.unit
      }));

      const { error } = await supabase
        .from("dashboard_stats")
        .insert(statsToInsert);

      if (error) {
        if (error.message.includes('relation "dashboard_stats" does not exist')) {
          toast({
            title: "Table Missing",
            description: "Please run the database setup script to create the dashboard_stats table.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Dashboard Stats Updated",
          description: "Changes have been saved successfully."
        });
      }
    } catch (error) {
      console.error("Save dashboard stats error:", error);
      toast({
        title: "Error",
        description: `Failed to update dashboard stats: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...dashboardStats];
    newStats[index] = { ...newStats[index], [field]: value };
    setDashboardStats(newStats);
  };

  return (
    <div className="space-y-6">
      {/* Hero Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Hero Section Content
          </CardTitle>
          <CardDescription>
            Edit the main hero section content displayed on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="hero-title">Main Title</Label>
              <Input
                id="hero-title"
                value={heroContent.title}
                onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                placeholder="Enter main title"
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                placeholder="Enter subtitle"
              />
            </div>
            <div>
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                value={heroContent.description}
                onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                placeholder="Enter description"
                rows={4}
              />
            </div>
          </div>
          <Button onClick={saveHeroContent} disabled={isLoading} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Hero Content
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Dashboard Stats Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Dashboard Statistics
          </CardTitle>
          <CardDescription>
            Edit the statistics displayed in the system overview section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <Label htmlFor={`stat-title-${index}`}>Title</Label>
                <Input
                  id={`stat-title-${index}`}
                  value={stat.title}
                  onChange={(e) => updateStat(index, "title", e.target.value)}
                  placeholder="Stat title"
                />
              </div>
              <div>
                <Label htmlFor={`stat-value-${index}`}>Value</Label>
                <Input
                  id={`stat-value-${index}`}
                  value={stat.value}
                  onChange={(e) => updateStat(index, "value", e.target.value)}
                  placeholder="Stat value"
                />
              </div>
              <div>
                <Label htmlFor={`stat-unit-${index}`}>Unit</Label>
                <Input
                  id={`stat-unit-${index}`}
                  value={stat.unit}
                  onChange={(e) => updateStat(index, "unit", e.target.value)}
                  placeholder="Unit (e.g., tons, %)"
                />
              </div>
              {/* Description field removed since it doesn't exist in the table */}
            </div>
          ))}
          <Button onClick={saveDashboardStats} disabled={isLoading} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Dashboard Stats
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}