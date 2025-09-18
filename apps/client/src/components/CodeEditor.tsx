import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";
import { Code, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { sendReview } from "@/api/review";
import AnalysisResults from "./AnalysisResults";

const CodeEditor = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: sendReview,
  });

  const [code, setCode] = useState(`function calculateTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
      total += items[i].price * items[i].quantity;
    }
    return total;
  }`);

  const handleAnalyze = () => {
    if (code.trim()) {
      mutate({ code, language: "javascript" });
    }
  };
  

  return (
    <div className="flex gap-6">
      {/* Code Editor */}
      <div className="w-[45vw] h-[90vh] border-2 border-black rounded-md">
        <div className="pb-2 border-b-2 border-black bg-[#2a2a2b] rounded-t-lg">
          <div className="flex justify-between items-center text-[#fbc40d] p-4 pt-6">
            <div className="flex items-center gap-2 text-[#fbc40d]">
              <Code className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Code Editor</h2>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isPending || !code.trim()}
              className="px-6 py-2 border-2 border-black bg-[#fbc40d] text-[#2a2a2b] hover:bg-[#fbc40d]/80"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Analyze Code
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="w-full overflow-hidden h-[calc(100%-80px)] bg-[#beb6b7] border-b-2 border-black p-4">
          <Editor
            className="h-full w-full font-mono text-sm resize-none border-2 border-black bg-white text-[#2a2a2b] p-3 rounded-md"
            height="100%"
            width="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme=""
          />
        </div>
      </div>

      {/* ✅ FIX: Show AnalysisResults always */}
      {/* - If API data exists → show analysis */}
      {/* - If no data → AnalysisResults will show its own "No analysis yet" placeholder */}
      <AnalysisResults
        issues={data?.issues}
        refactoredCode={data?.refactoredCode}
      />
    </div>
  );
};

export default CodeEditor;
