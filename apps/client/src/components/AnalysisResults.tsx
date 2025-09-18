import { Badge, Zap } from "lucide-react";

// Interface for the structure of each code issue
interface CodeIssue {
  id: string;
  type: "error" | "warning" | "suggestion";
  line: number;
  message: string;
  severity: "high" | "medium" | "low";
  suggestion?: string; // Optional suggestion for improvement
}

// Interface for the props of the AnalysisResults component
interface AnalysisResultsProps {
  issues?: CodeIssue[]; // Array of code issues
  refactoredCode?: string; // Refactored version of the code, if available
}

const AnalysisResults = ({ issues, refactoredCode }: AnalysisResultsProps) => {
  // Helper function to determine the badge style based on severity
  const getSeverityBadge = (severity: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-300 text-xs px-2 py-1",
      medium:
        "bg-yellow-100 text-yellow-800 border-yellow-300 text-xs px-2 py-1",
      low: "bg-blue-100 text-blue-800 border-blue-300 text-xs px-2 py-1",
    };

    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  // If no issues are provided, display a placeholder
  if (!issues || issues.length === 0) {
    return (
      <div className="w-[45vw] flex flex-col h-[90.5vh] border-2 border-black rounded-md">
        {/* Header Section */}
        <div className="sticky top-0 z-10 bg-[#2a2a2b] border-b-2 border-black px-4 py-7 flex items-center justify-center gap-2 rounded-t-lg">
          <Zap className="h-4 w-4 text-[#fbc40d]" />
          <span className="text-lg font-semibold text-[#fbc40d]">
            AI Analysis
          </span>
        </div>

        {/* Body Section */}
        <div className="flex-1 flex items-center justify-center bg-[#beb6b7] text-[#2a2a2b] text-sm">
          No analysis yet. Write some code and click <b>Analyze</b>.
        </div>
      </div>
    );
  }

  return (
    <div className="w-[45vw] flex flex-col h-[90.5vh] border-2 border-black rounded-md overflow-hidden">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-[#2a2a2b] border-b-2 border-black px-4 py-7 flex items-center justify-center gap-2 rounded-t-lg flex-shrink-0">
        <Zap className="h-4 w-4 text-[#fbc40d]" />
        <span className="text-lg font-semibold text-[#fbc40d]">
          AI Analysis
        </span>
      </div>

      {/* Body Section with Issues */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#beb6b7] min-h-0">
        {/* Assistant's Avatar and Message */}
        <div className="flex gap-3 max-w-full">
          <div className="w-7 h-7 rounded-full bg-[#fbc40d] border-2 border-black flex items-center justify-center flex-shrink-0 mt-1">
            <Zap className="h-3.5 w-3.5 text-[#2a2a2b]" />
          </div>

          <div className="flex-1 bg-white border-2 border-black rounded-lg p-4 min-w-0">
            <p className="text-sm text-[#2a2a2b] mb-4">
              I analyzed your code and found {issues.length} area
              {issues.length > 1 ? "s" : ""} to improve. Here are the details:
            </p>

            {/* List of Issues */}
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div
                  key={issue.id || index}
                  className="rounded-md border-2 border-black bg-[#beb6b7] p-3"
                >
                  {/* Issue Header */}
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

                  {/* Issue Message */}
                  <p className="text-sm text-[#2a2a2b] leading-relaxed break-words">
                    {issue.message}
                  </p>

                  {/* Optional Suggestion for Improvement */}
                  {issue.suggestion && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-[#2a2a2b] mb-2">
                        Suggestion:
                      </p>
                      <div className="bg-white border-2 border-black rounded p-3 overflow-hidden">
                        <pre className="text-xs font-mono text-[#2a2a2b] whitespace-pre-wrap break-words overflow-wrap-anywhere">
                          {issue.suggestion}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Display Refactored Code if available */}
            {refactoredCode && (
              <div className="mt-6 pt-4 border-t-2 border-black">
                <p className="text-sm font-medium mb-3 text-[#2a2a2b] flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Refactored Version:
                </p>
                <div className="bg-white border-2 border-black rounded-lg p-4 overflow-hidden">
                  <pre className="font-mono text-xs text-[#2a2a2b] whitespace-pre-wrap break-words overflow-wrap-anywhere leading-relaxed">
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
