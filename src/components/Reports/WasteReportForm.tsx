import { useState } from "react";
import PhotoUploadWithGeo from "@/components/PhotoUploadWithGeo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Camera, Upload, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WasteReportForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    location: '',
    ward: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  // Remove photo and geo state, handle upload immediately

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to report waste issues.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // No-op: photo upload is handled automatically below
      const { error } = await supabase
        .from('waste_reports')
        .insert({
          user_id: user.id,
          issue_type: formData.issueType as any,
          description: formData.description,
          location: formData.location,
          ward: formData.ward,
          priority_level: formData.priority as any,
        });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Report Submitted!",
          description: "Your waste report has been successfully submitted.",
        });
        // Reset form
        setFormData({
          issueType: '',
          description: '',
          location: '',
          ward: '',
          priority: 'medium'
        });
  // No-op
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-warning/10 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Report Waste Issue</h2>
          <p className="text-sm text-muted-foreground">Help us identify and resolve waste management problems</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Issue Type */}
        <div className="space-y-2">
          <Label htmlFor="issue-type">Issue Type</Label>
          <Select value={formData.issueType} onValueChange={(value) => setFormData({...formData, issueType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="illegal-dump">Illegal Dumping</SelectItem>
              <SelectItem value="overflowing-bin">Overflowing Bin</SelectItem>
              <SelectItem value="missed-collection">Missed Collection</SelectItem>
              <SelectItem value="hazardous-waste">Hazardous Waste</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Enter address or landmark" 
                className="pl-10" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ward">Ward/Area</Label>
            <Select value={formData.ward} onValueChange={(value) => setFormData({...formData, ward: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ward-1">Ward 1 - Central</SelectItem>
                <SelectItem value="ward-2">Ward 2 - North</SelectItem>
                <SelectItem value="ward-3">Ward 3 - South</SelectItem>
                <SelectItem value="ward-4">Ward 4 - East</SelectItem>
                <SelectItem value="ward-5">Ward 5 - West</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            placeholder="Provide details about the waste issue..."
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        {/* Photo Upload with Geo Tag - fully automatic */}
        <div className="space-y-2">
          <Label>Photo Evidence</Label>
          <PhotoUploadWithGeo
            onAutoUpload={async ({ file, latitude, longitude }) => {
              if (!user) return;
              setIsSubmitting(true);
              try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}_${Date.now()}.${fileExt}`;
                const { data: storageData, error: storageError } = await supabase.storage
                  .from('waste-evidence')
                  .upload(fileName, file);
                if (storageError) {
                  toast({ title: "Photo Upload Error", description: storageError.message, variant: "destructive" });
                  return;
                }
                const photoUrl = storageData?.path || null;
                const { error } = await supabase
                  .from('waste_reports')
                  .insert({
                    user_id: user.id,
                    issue_type: formData.issueType as any,
                    description: formData.description,
                    location: formData.location,
                    ward: formData.ward,
                    priority_level: formData.priority as any,
                    photo_url: photoUrl,
                    latitude,
                    longitude,
                  });
                if (error) {
                  toast({ title: "Error", description: error.message, variant: "destructive" });
                } else {
                  toast({ title: "Photo Report Submitted!", description: "Your geo-tagged photo report has been submitted." });
                  setFormData({
                    issueType: '',
                    description: '',
                    location: '',
                    ward: '',
                    priority: 'medium'
                  });
                }
              } catch (err) {
                toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label>Priority Level</Label>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              type="button"
              variant={formData.priority === 'low' ? 'default' : 'outline'} 
              className="h-auto p-4 flex-col"
              onClick={() => setFormData({...formData, priority: 'low'})}
            >
              <div className="w-4 h-4 bg-primary rounded-full mb-2" />
              <span className="text-sm">Low</span>
            </Button>
            <Button 
              type="button"
              variant={formData.priority === 'medium' ? 'default' : 'outline'} 
              className="h-auto p-4 flex-col"
              onClick={() => setFormData({...formData, priority: 'medium'})}
            >
              <div className="w-4 h-4 bg-warning rounded-full mb-2" />
              <span className="text-sm">Medium</span>
            </Button>
            <Button 
              type="button"
              variant={formData.priority === 'high' ? 'default' : 'outline'} 
              className="h-auto p-4 flex-col"
              onClick={() => setFormData({...formData, priority: 'high'})}
            >
              <div className="w-4 h-4 bg-destructive rounded-full mb-2" />
              <span className="text-sm">High</span>
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="eco" 
            className="flex-1" 
            type="submit"
            disabled={isSubmitting || !user}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
          <Button variant="outline" className="flex-1" type="button">
            Save as Draft
          </Button>
        </div>

        {!user && (
          <p className="text-sm text-muted-foreground text-center">
            Please sign in to submit waste reports
          </p>
        )}
      </form>
    </Card>
  );
};

export default WasteReportForm;