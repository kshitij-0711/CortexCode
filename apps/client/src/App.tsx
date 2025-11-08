import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "@/components/Navbar";
import Auth from "./pages/AuthPage";

function App() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#2a2a2b] font-roboto-slab">
      {pathname !== "/auth" && <Navbar />}

      <div className={pathname === "/auth" ? "" : "flex-1 flex justify-center items-center"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;