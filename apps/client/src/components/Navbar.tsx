import { useNavigate } from "react-router-dom";
import { useLoginFormStore } from "@/store/loginStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import config from "../config/api";
import { Button } from "./ui/button";

const Navbar = () => {
  const token = localStorage.getItem("token");
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
    <header className="border-b border-slate-800 bg-slate-900/50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Left side: Logo + Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-100">CortexCode</h1>
        </div>

        {/* Right side: Buttons */}
        {token && (
          <div>
            <Button
              onClick={clearToken}
              className="px-6 py-2 border-2 border-black bg-[#2a2a2b] text-white hover:bg-[#2a2a2b]/60 hover:cursor-pointer"
            >
              Log Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
