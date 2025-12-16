import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, MapPin, BookOpen } from "lucide-react";
import AdminSystemOverview from "@/components/Admin/AdminSystemOverview";
import AdminTrainingManager from "@/components/Admin/AdminTrainingManager";
import AdminFacilitiesManager from "@/components/Admin/AdminFacilitiesManager";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <span className="text-sm text-muted-foreground">Waste Management System</span>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>System Administration</CardTitle>
            <CardDescription>
              Manage system content, training modules, and waste facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  System Overview
                </TabsTrigger>
                <TabsTrigger value="training" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Training Modules
                </TabsTrigger>
                <TabsTrigger value="facilities" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Waste Facilities
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <AdminSystemOverview />
              </TabsContent>

              <TabsContent value="training" className="mt-6">
                <AdminTrainingManager />
              </TabsContent>

              <TabsContent value="facilities" className="mt-6">
                <AdminFacilitiesManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}