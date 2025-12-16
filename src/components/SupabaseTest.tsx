import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function SupabaseTest() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .limit(5);

      console.log("Supabase test result:", { data, error });
      setResults({ data, error, success: !error });
    } catch (err) {
      console.error("Connection error:", err);
      setResults({ error: err, success: false });
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      setResults({ currentUser: user, success: true });
    } catch (err) {
      console.error("Auth test error:", err);
      setResults({ error: err, success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={loading}>
            Test Database Connection
          </Button>
          <Button onClick={testAuth} disabled={loading} variant="outline">
            Test Auth
          </Button>
        </div>
        
        {results && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}