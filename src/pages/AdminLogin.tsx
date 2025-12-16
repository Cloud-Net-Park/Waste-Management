import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLoginModal from "@/components/AdminLoginModal";

export default function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleAuth = () => {
    onAuth();
    navigate("/admin/dashboard");
  };

  return (
    <AdminLoginModal isOpen={open} onOpenChange={setOpen} onAuth={handleAuth} />
  );
}
