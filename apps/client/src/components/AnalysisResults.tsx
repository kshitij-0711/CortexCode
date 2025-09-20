import { CopyIcon } from "@/icons/CopyIcon";
import { Badge, Zap } from "lucide-react";

import { useCodeStore } from "@/store/codeStore"; // Zustand store

const AnalysisResults = () => {
  // Read data directly from Zustand
  const { issues, refactoredCode } = useCodeStore();

  // Helper to style severity badges
  const getSeverityBadge = (severity: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-300 text-xs px-2 py-1",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300 text-xs px-2 py-1",
      low: "bg-blue-100 text-blue-800 border-blue-300 text-xs px-2 py-1",
    };

    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  // Show placeholder if no analysis yet
  if (!issues || issues.length === 0) {
    return (
      <div className="w-[45vw] flex flex-col h-[90.5vh] border-2 border-black rounded-md">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#2a2a2b] border-b-2 border-black px-4 py-7 flex items-center justify-center gap-2 rounded-t-lg">
          <Zap className="h-4 w-4 text-[#fbc40d]" />
          <span className="text-lg font-semibold text-[#fbc40d]">AI Analysis</span>
        </div>

        {/* Body */}
        <div className="flex-1 flex items-center justify-center bg-[#beb6b7] text-[#2a2a2b] text-sm">
          No analysis yet. Write some code and click <b>Analyze</b>.
        </div>
      </div>
    );
  }

  // If issues exist, show them
  return (
    <div className="w-[45vw] flex flex-col h-[90.5vh] border-2 border-black rounded-md overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#2a2a2b] border-b-2 border-black px-4 py-7 flex items-center justify-center gap-2 rounded-t-lg flex-shrink-0">
        <Zap className="h-4 w-4 text-[#fbc40d]" />
        <span className="text-lg font-semibold text-[#fbc40d]">AI Analysis</span>
      </div>

      {/* Issues + Refactored Code */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#beb6b7] min-h-0">
        <div className="flex gap-3 max-w-full">
          <div className="w-7 h-7 rounded-full bg-[#fbc40d] border-2 border-black flex items-center justify-center flex-shrink-0 mt-1">
            <Zap className="h-3.5 w-3.5 text-[#2a2a2b]" />
          </div>

          <div className="flex-1 bg-white border-2 border-black rounded-lg p-4 min-w-0">
            {/* Summary */}
            <p className="text-sm text-[#2a2a2b] mb-4">
              I analyzed your code and found {issues.length} area
              {issues.length > 1 ? "s" : ""} to improve.
            </p>

            {/* Issues List */}
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div
                  key={issue.id || index}
                  className="rounded-md border-2 border-black bg-[#beb6b7] p-3"
                >
                  {/* Issue header (line + severity) */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
                      Line {issue.line}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    {getSeverityBadge(issue.severity)}
                    <span className="text-xs text-gray-600 uppercase tracking-wide">
                      {issue.type}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-[#2a2a2b] leading-relaxed break-words">
                    {issue.message}
                  </p>

                  {/* Optional suggestion */}
                  {issue.suggestion && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-[#2a2a2b] mb-2">Suggestion:</p>
                      <div className="bg-white border-2 border-black rounded p-3 overflow-hidden">
                        <pre className="text-xs font-mono text-[#2a2a2b] whitespace-pre-wrap break-words">
                          {issue.suggestion}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Refactored code */}
            {refactoredCode && (
              <div className="mt-6 pt-4 border-t-2 border-black">
                <p className="text-sm font-medium mb-3 text-[#2a2a2b] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Refactored Version:</span>
                  </div>

                  {/* Copy button */}
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(refactoredCode)}
                    className="p-1 rounded-md cursor-pointer hover:bg-gray-200"
                  >
                    <CopyIcon />
                  </button>
                </p>
                <div className="bg-white border-2 border-black rounded-lg p-4 overflow-hidden">
                  <pre className="font-mono text-xs text-[#2a2a2b] whitespace-pre-wrap break-words leading-relaxed">
                    {refactoredCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
