import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStat {
  id: string;
  label: string;
  value: string;
  unit: string;
}

export default function AdminDashboardStats() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [form, setForm] = useState<Partial<DashboardStat>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch stats from supabase (create table dashboard_stats: id, label, value, unit)
    const fetchStats = async () => {
      setLoading(true);
      const { data } = await supabase.from("dashboard_stats").select("*");
      setStats(data || []);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const handleEdit = (stat: DashboardStat) => {
    setEditingId(stat.id);
    setForm(stat);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    await supabase.from("dashboard_stats").update(form).eq("id", editingId);
    setStats(stats.map(s => s.id === editingId ? { ...s, ...form } as DashboardStat : s));
    setEditingId(null);
    setForm({});
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Edit Dashboard Stats</h2>
      {loading && <div>Loading...</div>}
      <div className="space-y-4">
        {stats.map((stat) => (
          <Card key={stat.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            {editingId === stat.id ? (
              <form className="flex flex-col md:flex-row gap-2 w-full" onSubmit={handleFormSubmit}>
                <Input name="label" value={form.label || ''} onChange={handleFormChange} placeholder="Label" required />
                <Input name="value" value={form.value || ''} onChange={handleFormChange} placeholder="Value" required />
                <Input name="unit" value={form.unit || ''} onChange={handleFormChange} placeholder="Unit" required />
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full">
                <div className="font-semibold">{stat.label}</div>
                <div className="text-lg">{stat.value} {stat.unit}</div>
                <Button size="sm" variant="outline" onClick={() => handleEdit(stat)}>Edit</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
