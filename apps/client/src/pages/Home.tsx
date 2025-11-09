import CodeEditor from "@/components/CodeEditor";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Home = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="min-h-screen bg-navy-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 h-screen flex flex-col">
        <CodeEditor />
      </div>
    </div>
  );
};

export default Home;
