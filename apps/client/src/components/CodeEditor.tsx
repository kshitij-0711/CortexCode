// CodeEditor.tsx
import Editor from "@monaco-editor/react"; 
import { Button } from "./ui/button"; 
import { Code, Zap } from "lucide-react"; 
import { useMutation } from "@tanstack/react-query"; 
import { sendReview } from "@/api/review"; 
import { useCodeStore } from "@/store/codeStore"; 
import AnalysisResults from "./AnalysisResults"; 

const CodeEditor = () => {
  // Get state + actions from Zustand
  const { code, setCode, setAnalysis } = useCodeStore();

  const { mutate, isPending } = useMutation({
    mutationFn: sendReview, 
    onSuccess: (data) => {
      // When API responds, update Zustand store
      setAnalysis(data.issues, data.refactoredCode);
    },
  });

  // Trigger analysis if code is not empty
  const handleAnalyze = () => {
    if (code.trim()) {
      mutate({ code, language: "javascript" });
    }
  };

  return (
    <div className="flex gap-6">
      {/* Left Panel = Code Editor */}
      <div className="w-[45vw] h-[90vh] border-2 border-black rounded-md">
        {/* Header bar */}
        <div className="pb-2 border-b-2 border-black bg-[#2a2a2b] rounded-t-lg">
          <div className="flex justify-between items-center text-[#fbc40d] p-4 pt-6">
            <div className="flex items-center gap-2 text-[#fbc40d]">
              <Code className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Code Editor</h2>
            </div>

            {/* Analyze button */}
            <Button
              onClick={handleAnalyze}
              disabled={isPending || !code.trim()} // disable while analyzing or if no code
              className="px-6 py-2 border-2 border-black bg-[#fbc40d] text-[#2a2a2b] cursor-pointer hover:bg-[#fbc40d]/80"
            >
              {isPending ? (
                // Loading spinner while analyzing
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Analyzing...
                </>
              ) : (
                // Normal state
                <>
                  <Zap className="h-4 w-4" />
                  Analyze Code
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="w-full overflow-hidden h-[calc(100%-80px)] bg-[#beb6b7] border-b-2 border-black p-4">
          <Editor
            className="h-full w-full font-mono text-sm resize-none border-2 border-black bg-white text-[#2a2a2b] p-3 rounded-md"
            height="100%"
            width="100%"
            defaultLanguage="javascript"
            value={code} // bind to Zustand
            onChange={(value) => setCode(value || "")} // update Zustand
          />
        </div>
      </div>

      {/* Right Panel = Analysis Results */}
      <AnalysisResults />
    </div>
  );
};

export default CodeEditor;
