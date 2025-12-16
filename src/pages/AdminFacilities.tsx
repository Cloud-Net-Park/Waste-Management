import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


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

const initialFacilities: Facility[] = [
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
  }
];

export default function AdminFacilities() {
    const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
    const [editingId, setEditingId] = useState<string|null>(null);
    const [form, setForm] = useState<Partial<Facility>>({});
    const [showForm, setShowForm] = useState(false);

    const handleEdit = (facility: Facility) => {
      setEditingId(facility.id);
      setForm(facility);
      setShowForm(true);
    };

    const handleDelete = (id: string) => {
      setFacilities(facilities.filter(f => f.id !== id));
    };

    const handleAdd = () => {
      setEditingId(null);
      setForm({});
      setShowForm(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId) {
        setFacilities(facilities.map(f => f.id === editingId ? { ...f, ...form } as Facility : f));
      } else {
        setFacilities([...facilities, { ...form, id: Date.now().toString() } as Facility]);
      }
      setShowForm(false);
      setForm({});
      setEditingId(null);
    };

    return (
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Manage Waste Facilities</h2>
        <div className="space-y-4">
          {facilities.map((facility) => (
            <Card key={facility.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{facility.name}</div>
                <div className="text-sm text-muted-foreground">{facility.type} | {facility.status}</div>
                <div className="text-sm">{facility.address}</div>
                <div className="text-xs text-muted-foreground">Capacity: {facility.capacity}</div>
                <div className="text-xs">Contact: {facility.contact} | Hours: {facility.hours}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button size="sm" variant="outline" onClick={() => handleEdit(facility)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(facility.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button onClick={handleAdd}>Add New Facility</Button>
        </div>
        {showForm && (
          <form className="mt-8 space-y-4 bg-card p-6 rounded-lg shadow" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={form.name || ''} onChange={handleFormChange} placeholder="Facility Name" className="input" required />
              <select name="type" value={form.type || ''} onChange={handleFormChange} required>
                <option value="">Type</option>
                <option value="recycling">Recycling</option>
                <option value="composting">Composting</option>
                <option value="biogas">Biogas</option>
                <option value="waste-to-energy">Waste-to-Energy</option>
              </select>
              <input name="address" value={form.address || ''} onChange={handleFormChange} placeholder="Address" className="input" required />
              <select name="status" value={form.status || ''} onChange={handleFormChange} required>
                <option value="">Status</option>
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
              <input name="capacity" value={form.capacity || ''} onChange={handleFormChange} placeholder="Capacity" className="input" required />
              <input name="contact" value={form.contact || ''} onChange={handleFormChange} placeholder="Contact" className="input" required />
              <input name="hours" value={form.hours || ''} onChange={handleFormChange} placeholder="Hours" className="input" required />
              <input name="distance" value={form.distance || ''} onChange={handleFormChange} placeholder="Distance" className="input" required />
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit">{editingId ? 'Update' : 'Add'} Facility</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    );
  }

