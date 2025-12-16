
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, LogIn } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginModal({ isOpen, onOpenChange, onAuth }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("🔐 Attempting login with:", email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log("🔐 Auth response:", { data, error: signInError });
      
      if (signInError || !data.user) {
        console.log("❌ Auth failed:", signInError);
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }
      
      console.log("✅ Auth successful, user ID:", data.user.id);
      console.log("📧 User email:", data.user.email);
      
      // Fetch profile to check admin role
      console.log("🔍 Checking profile for user:", data.user.id);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      
      console.log("👤 Profile query result:", { profile, error: profileError });
      
      if (profileError) {
        console.log("❌ Profile error:", profileError);
        setError(`Profile error: ${profileError.message}`);
        setIsLoading(false);
        return;
      }
      
      if (!profile) {
        console.log("❌ No profile found for user");
        setError("No profile found for this user");
        setIsLoading(false);
        return;
      }
      
      console.log("👤 Profile role:", profile.role);
      
      if (profile.role !== "admin") {
        console.log("❌ User role is not admin:", profile.role);
        setError(`Your role is '${profile.role}', but admin access required`);
        setIsLoading(false);
        return;
      }
      
      console.log("✅ Admin access granted!");
      onAuth();
      onOpenChange(false);
      toast({ title: "Welcome, Admin!", description: "You have been signed in as admin." });
    } catch (e) {
      console.log("💥 Unexpected error:", e);
      setError("Unexpected error during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Admin Login
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button className="w-full" onClick={handleSignIn} disabled={isLoading}>
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
