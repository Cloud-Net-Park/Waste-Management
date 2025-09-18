import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "./components/Layout/Navbar";
import HeroSection from "./components/Hero/HeroSection";
import StatsGrid from "./components/Dashboard/StatsGrid";
import WasteChart from "./components/Dashboard/WasteChart";
import WasteReportForm from "./components/Reports/WasteReportForm";
import TrainingModules from "./components/Training/TrainingModules";
import FacilityMap from "./components/Facilities/FacilityMap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const HomePage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    
    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Dashboard Stats */}
      <section id="dashboard">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">System Overview</h2>
          <p className="text-xl text-muted-foreground">Real-time waste management metrics and insights</p>
        </div>
        <StatsGrid />
        <div className="mt-8">
          <WasteChart />
        </div>
      </section>

      {/* Quick Report */}
      <section id="reports">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Report Waste Issues</h2>
          <p className="text-xl text-muted-foreground">Help us identify and resolve problems in your community</p>
        </div>
        <WasteReportForm />
      </section>

      {/* Training */}
      <section id="training">
        <TrainingModules />
      </section>

      {/* Facilities */}
      <section id="facilities">
        <FacilityMap />
      </section>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
