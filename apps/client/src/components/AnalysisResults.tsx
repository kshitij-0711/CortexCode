import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Copy,
} from "lucide-react";

import { useCodeStore } from "@/store/codeStore"; // Zustand store
import type { JSX } from "react";

const AnalysisResults = () => {
  // Read data directly from Zustand
  const { issues, refactoredCode } = useCodeStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col min-h-0"
    >
      <Card className="flex flex-col shadow-xl border-[#1d2333] bg-[#0f1521] backdrop-blur-sm h-full min-h-0 overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex text-[#f8f9fb] text-2xl items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2563eb]" />
            AI Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="pr-4">
              <AnimatePresence mode="wait">
                {/* Empty State */}
                {(!issues || issues.length === 0) && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex items-center justify-center text-center p-8"
                  >
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="p-6 bg-gradient-to-br from-[#2563eb]/20 to-[#1e1a38]/20 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto">
                          <Sparkles className="w-10 h-10 text-[#2563eb]" />
                        </div>
                        <div className="absolute inset-0 bg-[#2563eb]/20 rounded-2xl blur-xl" />
                      </div>

                      <div>
                        <h3 className="text-lg text-[#f8f9fb] font-semibold mb-2">
                          Ready to Analyze
                        </h3>
                        <p className="text-[#9ba3b4] text-sm max-w-sm mx-auto">
                          Submit your code to receive instant AI-powered insights,
                          bug detection, and optimization recommendations
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Results State */}
                {issues && issues.length > 0 && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4 pb-4"
                  >
                    {/* Summary */}
                    <div className="border-l-4 border-l-[#2563eb] bg-[#2563eb]/5 rounded-lg p-4">
                      <p className="text-sm text-[#f8f9fb]/90">
                        I analyzed your code and found{" "}
                        <strong>{issues.length}</strong> area
                        {issues.length > 1 ? "s" : ""} to improve.
                      </p>
                    </div>

                    {/* Issues List */}
                    {issues.map((issue, index) => (
                      <motion.div
                        key={issue.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <IssueCard issue={issue} />
                      </motion.div>
                    ))}

                    {/* Refactored code */}
                    {refactoredCode && (
                      <Card className="border-l-4 border-l-[#2563eb] bg-[#2563eb]/5">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center justify-between text-[#f8f9fb]">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-[#2563eb]/10 text-[#2563eb]">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              Refactored Version
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigator.clipboard.writeText(refactoredCode)
                              }
                              className="gap-2 text-[#f8f9fb] hover:text-[#2563eb] hover:bg-[#1a1f2e]"
                            >
                              <Copy className="w-4 h-4" />
                              Copy
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-[#1a1f2e]/50 border-2 border-[#1d2333] rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs font-mono text-[#f8f9fb]/90 whitespace-pre-wrap break-words leading-relaxed">
                              {refactoredCode}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface Issue {
  id?: string;
  line: number;
  severity: "high" | "medium" | "low";
  type: string;
  message: string;
  suggestion?: string;
}

const IssueCard = ({ issue }: { issue: Issue }) => {
  const severityConfig: Record<
    "high" | "medium" | "low",
    {
      color: string;
      icon: JSX.Element;
      iconBg: string;
      textColor: string;
    }
  > = {
    high: {
      color: "border-l-[#82221e] bg-[#82221e]/5",
      icon: <AlertTriangle className="w-5 h-5" />,
      iconBg: "bg-[#82221e]/10 text-[#82221e]",
      textColor: "bg-[#82221e] text-[#ffffff]",
    },
    medium: {
      color: "border-l-[#eab308] bg-[#eab308]/5",
      icon: <Lightbulb className="w-5 h-5" />,
      iconBg: "bg-[#eab308]/10 text-[#eab308]",
      textColor: "bg-[#1a1f2e] text-[#f8f9fb]",
    },
    low: {
      color: "border-l-[#2563eb] bg-[#2563eb]/5",
      icon: <CheckCircle2 className="w-5 h-5" />,
      iconBg: "bg-[#2563eb]/10 text-[#2563eb]",
      textColor: "bg-[#1a1f2e] text-[#f8f9fb] border border-[#1d2333]",
    },
  };

  const config = severityConfig[issue.severity] || severityConfig.low;

  return (
    <Card
      className={`border-l-4 ${config.color} hover:shadow-md transition-shadow bg-[#0f1521] border-[#1d2333]`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base flex items-center gap-2 text-[#f8f9fb]">
            <div className={`p-2 rounded-lg ${config.iconBg}`}>
              {config.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-[#1a1f2e] text-[#f8f9fb] px-2 py-1 rounded font-mono">
                  Line {issue.line}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${config.textColor}`}
                >
                  {issue.severity.toUpperCase()}
                </span>
                <span className="text-xs text-[#9ba3b4] uppercase tracking-wide">
                  {issue.type}
                </span>
              </div>
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#f8f9fb]/90 leading-relaxed break-words">
          {issue.message}
        </p>

        {/* Optional suggestion */}
        {issue.suggestion && (
          <div className="mt-3">
            <p className="text-xs font-medium text-[#f8f9fb]/80 mb-2">
              Suggestion:
            </p>
            <div className="bg-[#1a1f2e]/50 border-2 border-[#1d2333] rounded-lg p-3 overflow-x-auto">
              <pre className="text-xs font-mono text-[#f8f9fb]/90 whitespace-pre-wrap break-words">
                {issue.suggestion}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;