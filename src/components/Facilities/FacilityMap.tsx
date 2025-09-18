import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Recycle, Leaf, Zap, Phone, Clock } from "lucide-react";

interface Facility {
  id: string;
  name: string;
  type: "recycling" | "composting" | "biogas" | "waste-to-energy";
  address: string;
  status: "operational" | "maintenance" | "offline";
  capacity: string;
  contact: string;
  hours: string;
  distance: string;
}

const FacilityMap = () => {
  const facilities: Facility[] = [
    {
      id: "1",
      name: "Central Recycling Hub",
      type: "recycling",
      address: "Block A, Industrial Area, Sector 12",
      status: "operational",
      capacity: "500 tonnes/day",
      contact: "+91 98765 43210",
      hours: "6:00 AM - 8:00 PM",
      distance: "2.3 km"
    },
    {
      id: "2",
      name: "Green Composting Center",
      type: "composting",
      address: "Agricultural Zone, Near Highway",
      status: "operational",
      capacity: "200 tonnes/day",
      contact: "+91 98765 43211",
      hours: "5:00 AM - 6:00 PM",
      distance: "4.1 km"
    },
    {
      id: "3",
      name: "Bio-Gas Generation Plant",
      type: "biogas",
      address: "Industrial Complex, Phase 2",
      status: "maintenance",
      capacity: "150 tonnes/day",
      contact: "+91 98765 43212",
      hours: "24/7",
      distance: "6.8 km"
    },
    {
      id: "4",
      name: "Waste-to-Energy Facility",
      type: "waste-to-energy",
      address: "Power Generation Zone",
      status: "operational",
      capacity: "800 tonnes/day",
      contact: "+91 98765 43213",
      hours: "24/7",
      distance: "12.5 km"
    }
  ];

  const getFacilityIcon = (type: string) => {
    const icons = {
      recycling: <Recycle className="h-5 w-5" />,
      composting: <Leaf className="h-5 w-5" />,
      biogas: <Zap className="h-5 w-5" />,
      "waste-to-energy": <Zap className="h-5 w-5" />
    };
    return icons[type as keyof typeof icons] || <Recycle className="h-5 w-5" />;
  };

  const getFacilityColor = (type: string) => {
    const colors = {
      recycling: "bg-waste-recycling/10 text-waste-recycling",
      composting: "bg-waste-composting/10 text-waste-composting",
      biogas: "bg-warning/10 text-warning",
      "waste-to-energy": "bg-accent/10 text-accent"
    };
    return colors[type as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      operational: "bg-primary/10 text-primary",
      maintenance: "bg-warning/10 text-warning",
      offline: "bg-destructive/10 text-destructive"
    };
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Waste Facilities</h2>
          <p className="text-muted-foreground">Locate nearby waste processing and recycling centers</p>
        </div>
        <Button variant="eco">
          <MapPin className="h-4 w-4 mr-2" />
          View on Map
        </Button>
      </div>

      {/* Map Placeholder */}
      <Card className="p-6 bg-muted/30">
        <div className="h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Interactive Map View</p>
            <p className="text-sm text-muted-foreground">Showing {facilities.length} facilities in your area</p>
          </div>
        </div>
      </Card>

      {/* Facilities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.id} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getFacilityColor(facility.type)}`}>
                  {getFacilityIcon(facility.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{facility.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{facility.type.replace('-', ' ')}</p>
                </div>
              </div>
              <Badge className={getStatusColor(facility.status)}>
                {facility.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">{facility.address}</p>
                  <p className="text-xs text-muted-foreground">{facility.distance} away</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{facility.hours}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{facility.contact}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Capacity:</span> {facility.capacity}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Get Directions
                </Button>
                <Button variant="eco" size="sm" className="flex-1">
                  Contact Facility
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FacilityMap;