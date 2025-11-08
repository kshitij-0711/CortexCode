// import AnalysisResults from "@/components/AnalysisResults";
// import CodeEditor from "@/components/CodeEditor";


// const Home = () => {
//   return (
//     <div className="flex gap-4 py-4">
//       <div className="shadow-xl shadow-amber-500">
//         <CodeEditor />
//       </div>
//        <div className="shadow-xl shadow-amber-500">
//         <AnalysisResults/>
//        </div>
//     </div>
//   );
// };

// export default Home;

// Home.jsx

import CodeEditor from "@/components/CodeEditor";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  return (
    <div className="flex gap-4 py-4">
      {token ? (
        <div className="shadow-xl">
          <CodeEditor />
        </div>
      ) : (
        <div>Redirecting...</div>
      )}
    </div>
  );
};

export default Home;