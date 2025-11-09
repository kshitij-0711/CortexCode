import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code2, Zap, Loader2 } from "lucide-react";
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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[600px] max-h-[calc(100vh-12rem)]">
      {/* Left Panel = Code Editor */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-0"
      >
        <Card className="flex-1 flex flex-col shadow-xl border-navy-800 bg-[#0f1521] backdrop-blur-sm h-full min-h-0">
          <CardHeader className="pb-0.5 flex-shrink-0">
            <CardTitle className="flex text-white text-2xl items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-500" />
              Code Editor
            </CardTitle>
            <CardDescription className="mt-1 text-gray-300 text-sm">
              Write or paste your code for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pb-4 gap-4 min-h-0">
            <div className="flex-1 border-2 border-gray-700/50 rounded-xl overflow-hidden shadow-inner min-h-0">
              <Editor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  padding: { top: 16, bottom: 16 },
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  renderLineHighlight: "all",
                }}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isPending || !code.trim()}
              className="w-full h-12 shadow-lg hover:shadow-xl hover:bg-blue-800 hover:cursor-pointer transition-all font-semibold bg-blue-600 flex-shrink-0"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Code...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2 " />
                  Analyze Code with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Panel = Analysis Results */}
      <AnalysisResults />
    </div>
  );
};

export default CodeEditor;
