import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export default function AdminHeroEditor() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [form, setForm] = useState<Partial<HeroContent>>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch hero content from supabase (create table hero_content: id, title, subtitle, description)
    const fetchHero = async () => {
      setLoading(true);
      const { data } = await supabase.from("hero_content").select("*").single();
      setHero(data || null);
      setLoading(false);
    };
    fetchHero();
  }, []);

  const handleEdit = () => {
    setForm(hero || {});
    setEditing(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (hero) {
      await supabase.from("hero_content").update(form).eq("id", hero.id);
      setHero({ ...hero, ...form } as HeroContent);
    }
    setEditing(false);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Edit Hero Section</h2>
      {hero && !editing && (
        <Card className="p-6 mb-4">
          <div className="text-3xl font-bold mb-2">{hero.title}</div>
          <div className="text-xl text-muted-foreground mb-2">{hero.subtitle}</div>
          <div className="mb-2">{hero.description}</div>
          <Button onClick={handleEdit}>Edit</Button>
        </Card>
      )}
      {editing && (
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <Input name="title" value={form.title || ''} onChange={handleFormChange} placeholder="Title" required />
          <Input name="subtitle" value={form.subtitle || ''} onChange={handleFormChange} placeholder="Subtitle" required />
          <textarea name="description" value={form.description || ''} onChange={handleFormChange} placeholder="Description" className="input w-full min-h-[80px]" required />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}
