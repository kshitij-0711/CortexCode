import axios from "axios"; 
import type { AxiosResponse } from 'axios';

interface ReviewRequest {
  code: string;
  language: string;
}

interface CodeIssue {
  id: string;
  type: "error" | "warning" | "suggestion";
  line: number;
  message: string;
  severity: "high" | "medium" | "low";
  suggestion?: string;
}

export interface ReviewResponse {
  issues: CodeIssue[];
  refactoredCode: string;
}

// Backend response structure (what your API actually returns)
interface BackendResponse {
  success: boolean;
  parsed: ReviewResponse;
  issues: CodeIssue[]; // Direct access
  refactoredCode: string; // Direct access
  raw: string;
}
const API_BASE_URL = "https://cortex-code-server.vercel.app/";

export const sendReview = async (
  payload: ReviewRequest
): Promise<ReviewResponse> => {
  try {
    const { data }: AxiosResponse<BackendResponse> = await axios.post(
      `${API_BASE_URL}/api/review`,
      payload,
      { withCredentials: true }
    );

    console.log("📨 Backend response:", data);

    // Try multiple ways to extract the data
    const result: ReviewResponse = {
      issues: data.issues || data.parsed?.issues || [],
      refactoredCode: data.refactoredCode || data.parsed?.refactoredCode || ""
    };

    console.log("Processed result:", result);
    
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};