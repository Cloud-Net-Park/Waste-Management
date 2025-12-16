import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Plus, Trash2, MapPin, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WasteFacility {
  id?: string;
  name: string;
  address: string;
  type: "Collection Center" | "Recycling Plant" | "Disposal Site" | "Transfer Station";
  status: "Operational" | "Maintenance" | "Offline";
  capacity: string;
  description: string;
  operating_hours: string;
  contact_info: string;
  latitude?: number;
  longitude?: number;
}

export default function AdminFacilitiesManager() {
  const [facilities, setFacilities] = useState<WasteFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingFacility, setEditingFacility] = useState<WasteFacility | null>(null);
  const { toast } = useToast();

  // Map database facility_type enum to component types
  const mapDatabaseTypeToComponent = (dbType: string): WasteFacility["type"] => {
    switch (dbType) {
      case "recycling": return "Recycling Plant";
      case "collection-center": return "Collection Center";
      case "waste-to-energy": 
      case "biogas": return "Disposal Site";
      case "composting": return "Transfer Station";
      default: return "Collection Center";
    }
  };

  // Map component types to database enum
  const mapComponentTypeToDatabase = (componentType: WasteFacility["type"]): string => {
    switch (componentType) {
      case "Recycling Plant": return "recycling";
      case "Collection Center": return "collection-center";
      case "Disposal Site": return "waste-to-energy";
      case "Transfer Station": return "composting";
      default: return "collection-center";
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .order("created_at");

      if (error) throw error;

      if (data) {
        setFacilities(data.map(facility => ({
          id: facility.id,
          name: facility.name,
          address: facility.address,
          type: mapDatabaseTypeToComponent(facility.type),
          status: "Operational", // Default since not in DB yet
          capacity: facility.capacity?.toString() || "",
          description: facility.description || "",
          operating_hours: facility.operating_hours || "",
          contact_info: facility.phone || facility.email || "",
          latitude: facility.latitude,
          longitude: facility.longitude
        })));
      } else {
        // Load default facilities if no data exists
        setFacilities([
          {
            name: "Central Recycling Plant",
            address: "123 Green Valley Rd, Springfield",
            type: "Recycling Plant",
            status: "Operational",
            capacity: "500 tons/day",
            description: "Main recycling facility processing mixed recyclables from the metropolitan area.",
            operating_hours: "6:00 AM - 10:00 PM",
            contact_info: "Phone: (555) 123-4567"
          },
          {
            name: "Northside Collection Center",
            address: "456 Oak Street, Springfield",
            type: "Collection Center",
            status: "Operational",
            capacity: "200 tons/day",
            description: "Community collection point for residential waste and recyclables.",
            operating_hours: "8:00 AM - 6:00 PM",
            contact_info: "Phone: (555) 234-5678"
          },
          {
            name: "Industrial Transfer Station",
            address: "789 Industrial Blvd, Springfield",
            type: "Transfer Station",
            status: "Maintenance",
            capacity: "1000 tons/day",
            description: "Large-scale transfer station for commercial and industrial waste.",
            operating_hours: "24/7",
            contact_info: "Phone: (555) 345-6789"
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading facilities:", error);
    }
  };

  const saveFacility = async (facility: WasteFacility) => {
    setIsLoading(true);
    try {
      // Debug: Check current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user?.id, user?.email);
      
      // Debug: Check user profile
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .single();
        console.log("User profile:", profile);
      }

      // Extract numeric capacity for the database
      const numericCapacity = parseInt(facility.capacity.replace(/[^\d]/g, '')) || null;
      
      const facilityData = {
        name: facility.name,
        address: facility.address,
        type: mapComponentTypeToDatabase(facility.type),
        capacity: numericCapacity,
        operating_hours: facility.operating_hours,
        updated_at: new Date().toISOString()
      };

      // Add optional fields if they exist in database
      if (facility.description) facilityData.description = facility.description;
      if (facility.latitude) facilityData.latitude = facility.latitude;
      if (facility.longitude) facilityData.longitude = facility.longitude;

      console.log("Saving facility data:", facilityData);

      if (facility.id) {
        // Update existing facility
        const { error } = await supabase
          .from("facilities")
          .update(facilityData)
          .eq("id", facility.id);

        if (error) throw error;
      } else {
        // Create new facility
        const { data, error } = await supabase
          .from("facilities")
          .insert(facilityData)
          .select();

        console.log("Insert result:", { data, error });
        if (error) throw error;
      }

      toast({
        title: "Facility Saved",
        description: "Changes have been saved successfully."
      });

      setEditingFacility(null);
      loadFacilities();
    } catch (error) {
      console.error("Save facility error:", error);
      toast({
        title: "Error",
        description: `Failed to save facility: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFacility = async (facilityId: string) => {
    if (!confirm("Are you sure you want to delete this facility?")) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("facilities")
        .delete()
        .eq("id", facilityId);

      if (error) throw error;

      toast({
        title: "Facility Deleted",
        description: "Facility has been removed successfully."
      });

      loadFacilities();
    } catch (error) {
      console.error("Delete facility error:", error);
      toast({
        title: "Error",
        description: `Failed to delete facility: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewFacility = () => {
    setEditingFacility({
      name: "",
      address: "",
      type: "Collection Center",
      status: "Operational",
      capacity: "",
      description: "",
      operating_hours: "",
      contact_info: ""
    });
  };

  const updateEditingFacility = (field: string, value: any) => {
    if (editingFacility) {
      setEditingFacility({ ...editingFacility, [field]: value });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational": return "default";
      case "Maintenance": return "secondary";
      case "Offline": return "destructive";
      default: return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Recycling Plant": return "♻️";
      case "Collection Center": return "📦";
      case "Transfer Station": return "🚛";
      case "Disposal Site": return "🗑️";
      default: return "📍";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Waste Facilities Management</h3>
          <p className="text-sm text-muted-foreground">Manage locations and details of waste facilities</p>
        </div>
        <Button onClick={addNewFacility} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Facility
        </Button>
      </div>

      {/* Facility Editor */}
      {editingFacility && (
        <Card>
          <CardHeader>
            <CardTitle>{editingFacility.id ? "Edit Facility" : "Create New Facility"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facility-name">Facility Name</Label>
                <Input
                  id="facility-name"
                  value={editingFacility.name}
                  onChange={(e) => updateEditingFacility("name", e.target.value)}
                  placeholder="Enter facility name"
                />
              </div>
              <div>
                <Label htmlFor="facility-type">Type</Label>
                <Select
                  value={editingFacility.type}
                  onValueChange={(value) => updateEditingFacility("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Collection Center">Collection Center</SelectItem>
                    <SelectItem value="Recycling Plant">Recycling Plant</SelectItem>
                    <SelectItem value="Disposal Site">Disposal Site</SelectItem>
                    <SelectItem value="Transfer Station">Transfer Station</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="facility-address">Address</Label>
              <Input
                id="facility-address"
                value={editingFacility.address}
                onChange={(e) => updateEditingFacility("address", e.target.value)}
                placeholder="Enter full address"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="facility-capacity">Capacity (tons/day)</Label>
                <Input
                  id="facility-capacity"
                  type="number"
                  value={editingFacility.capacity}
                  onChange={(e) => updateEditingFacility("capacity", e.target.value)}
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <Label htmlFor="facility-hours">Operating Hours</Label>
                <Input
                  id="facility-hours"
                  value={editingFacility.operating_hours}
                  onChange={(e) => updateEditingFacility("operating_hours", e.target.value)}
                  placeholder="e.g., 8:00 AM - 6:00 PM"
                />
              </div>
              <div>
                <Label htmlFor="facility-status">Status (Display Only)</Label>
                <Select
                  value={editingFacility.status}
                  onValueChange={(value) => updateEditingFacility("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="facility-description">Description</Label>
              <Textarea
                id="facility-description"
                value={editingFacility.description}
                onChange={(e) => updateEditingFacility("description", e.target.value)}
                placeholder="Enter facility description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="facility-contact">Contact Information (Display Only)</Label>
              <Input
                id="facility-contact"
                value={editingFacility.contact_info}
                onChange={(e) => updateEditingFacility("contact_info", e.target.value)}
                placeholder="Phone, email, or other contact details"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facility-lat">Latitude (Optional)</Label>
                <Input
                  id="facility-lat"
                  type="number"
                  step="any"
                  value={editingFacility.latitude || ""}
                  onChange={(e) => updateEditingFacility("latitude", parseFloat(e.target.value) || undefined)}
                  placeholder="e.g., 40.7128"
                />
              </div>
              <div>
                <Label htmlFor="facility-lng">Longitude (Optional)</Label>
                <Input
                  id="facility-lng"
                  type="number"
                  step="any"
                  value={editingFacility.longitude || ""}
                  onChange={(e) => updateEditingFacility("longitude", parseFloat(e.target.value) || undefined)}
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => saveFacility(editingFacility)} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {editingFacility.id ? "Update" : "Create"} Facility
              </Button>
              <Button variant="outline" onClick={() => setEditingFacility(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facilities List */}
      <div className="grid gap-4">
        {facilities.map((facility, index) => (
          <Card key={facility.id || index}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getTypeIcon(facility.type)}</div>
                  <div>
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {facility.address}
                      </span>
                      <Badge variant={getStatusColor(facility.status)}>
                        {facility.status}
                      </Badge>
                      <Badge variant="outline">{facility.type}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingFacility(facility)}
                  >
                    Edit
                  </Button>
                  {facility.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteFacility(facility.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">{facility.description}</CardDescription>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{facility.operating_hours || "Hours not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{facility.capacity || "Capacity not specified"}</span>
                </div>
                <div className="text-muted-foreground">
                  {facility.contact_info || "No contact info"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}