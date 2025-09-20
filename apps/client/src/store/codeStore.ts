import { create } from "zustand";

// Define the shape of one issue (like lint errors/warnings from AI)
type CodeIssue = {
  id: string;
  type: "error" | "warning" | "suggestion"; 
  line: number; 
  message: string; 
  severity: "high" | "medium" | "low"; 
  suggestion?: string; 
};

type CodeStore = {
  code: string;                
  issues: CodeIssue[];
  refactoredCode: string;
  setCode: (code: string) => void;
  setAnalysis: (issues: CodeIssue[], refactoredCode: string) => void; 
  reset: () => void;           // clear issues + refactored code
};

export const useCodeStore = create<CodeStore>((set) => ({
  code: `function calculateTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
      total += items[i].price * items[i].quantity;
    }
    return total;
  }`,  // default code shown when editor loads
  issues: [],
  refactoredCode: "",
  setCode: (code) => set({ code }), // update code
  setAnalysis: (issues, refactoredCode) => set({ issues, refactoredCode }), // update issues + refactored code
  reset: () => set({ issues: [], refactoredCode: "" }), // clear old results
}));
