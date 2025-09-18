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

import CodeEditor from "@/components/CodeEditor";
// ❌ Remove this import — it was causing duplicate render
// import AnalysisResults from "@/components/AnalysisResults";

const Home = () => {
  return (
    <div className="flex gap-4 py-4">
      <div className="shadow-xl ">
        <CodeEditor />
      </div>
    </div>
  );
};

export default Home;


