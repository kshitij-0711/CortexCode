import { Routes, Route } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Navbar from "@/components/Navbar" 

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#2a2a2b] font-roboto-slab">
      <Navbar /> 

      <div className="flex-1 flex justify-center items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
