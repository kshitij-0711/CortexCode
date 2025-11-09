import { useNavigate } from "react-router-dom";
import { useLoginFormStore } from "@/store/loginStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import config from "../config/api";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Code2, LogOut, Sparkle } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { email } = useLoginFormStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${config.API_URL}/auth/logout`,
        { email },
        { withCredentials: true },
      );
      return res.data;
    },

    onSuccess: () => {
      localStorage.removeItem("token");
      navigate("/auth");
    },
    onError: (err) => {
      console.log("Logout Failed:", err);
    },
  });

  const clearToken = () => {
    mutation.mutate();
  };

  return (
    // <header className="border-b border-slate-800 bg-slate-900/50">
    //   <div className="container mx-auto flex items-center justify-between px-6 py-4">
    //     {/* Left side: Logo + Title */}
    //     <div className="flex items-center gap-3">
    //       <h1 className="text-2xl font-bold text-slate-100">CortexCode</h1>
    //     </div>

    //     {/* Right side: Buttons */}
    //     {token && (
    //       <div>
    //         <Button
    //           onClick={clearToken}
    //           className="px-6 py-2 border-2 border-black bg-[#2a2a2b] text-white hover:bg-[#2a2a2b]/60 hover:cursor-pointer"
    //         >
    //           Log Out
    //         </Button>
    //       </div>
    //     )}
    //   </div>
    // </header>
    <header className="border-b border-[#1e293b99] bg-[#0f1521] backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left side: logo and title */}
        <div className="flex items-center gap-4">
          <motion.div
            className="p-2.5 bg-gradient-to-br from-[#3b82f633] to-[#7c3aed33] rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <Code2 className="w-6 h-6 text-[#3b82f6]" />
          </motion.div>

          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#f8fafc] to-[#94a3b8] bg-clip-text text-transparent">
              AI Code Reviewer
            </h1>
            <p className="text-xs text-[#94a3b8] flex items-center gap-1">
              <Sparkle className="w-3 h-3 text-[#7c3aed]" />
              Powered by Gemini 2.5 Pro
            </p>
          </div>
        </div>

        {/* Right side: Sign Out button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={clearToken}
            className="gap-2 text-[#e5e7eb] hover:text-[#3b82f6] hover:bg-[#1e293b] transition-colors"
          >
            <LogOut className="w-4 h-4 text-[#60a5fa]" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
