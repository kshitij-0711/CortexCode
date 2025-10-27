import { Request, Response } from "express";
import config from "../config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { reviewModal } from "../modals/Review";

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(config.GOOGLE_API_KEY);

interface ReviewIssue {
  id: string;
  type: "error" | "warning" | "suggestion";
  line: number | null;
  message: string;
  severity: "high" | "medium" | "low";
  suggestion: string;
}

interface ParsedReview {
  issues: ReviewIssue[];
  refactoredCode: string;
}

export const sendReviewCode = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { code, language } = req.body;
    const userId = req.user?.id;

    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const prompt = `
You are an expert ${language} code reviewer.
Analyze the following code and respond with ONLY valid JSON in this exact format (no markdown, no extra text):

{
  "issues": [
    {
      "id": "unique_id_here",
      "type": "error|warning|suggestion",
      "line": number_or_null,
      "message": "description of the issue",
      "severity": "high|medium|low",
      "suggestion": "how to fix this issue"
    }
  ],
  "refactoredCode": "improved version of the code"
}

Rules:
- Always provide at least 1-3 realistic issues for any code (no code is perfect)
- Generate unique IDs for each issue
- Provide actual line numbers when possible
- Include practical suggestions
- Always provide a refactored version that addresses the issues

Code to analyze:
${code}
`;

    console.log("🔍 Sending request to Gemini...");
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    console.log("📝 Raw Gemini response:", rawText);

    let parsed: ParsedReview = {
      issues: [],
      refactoredCode: "",
    };

    try {
      // Try to parse the raw text directly
      parsed = JSON.parse(rawText);
      console.log("✅ Parsed JSON successfully");
    } catch (parseError) {
      console.log("❌ Direct JSON parse failed, trying to extract from markdown...");
      
      // Try to extract JSON from markdown code block
      const jsonMatch = rawText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonContent = jsonMatch?.[1];

      if (jsonContent) {
        try {
          parsed = JSON.parse(jsonContent);
          console.log("✅ Extracted JSON from markdown successfully");
        } catch (extractError) {
          console.log("❌ Failed to parse extracted JSON, using fallback");
          // Create a fallback response with at least one issue
          parsed = {
            issues: [
              {
                id: "fallback-1",
                type: "suggestion",
                line: 1,
                message: "Code analysis completed but response parsing failed. Consider reviewing your code manually.",
                severity: "low",
                suggestion: "Review the code structure and consider modern JavaScript/TypeScript practices."
              }
            ],
            refactoredCode: code // Return original code as fallback
          };
        }
      } else {
        console.log("❌ No JSON found in response, using fallback");
        // Create a fallback response
        parsed = {
          issues: [
            {
              id: "fallback-1",
              type: "suggestion", 
              line: 1,
              message: "Unable to parse AI response. Manual code review recommended.",
              severity: "low",
              suggestion: "Consider using modern ES6+ syntax and best practices."
            }
          ],
          refactoredCode: code
        };
      }
    }

    // Ensure all issues have proper IDs and line numbers
    parsed.issues = parsed.issues.map((issue, index) => ({
      ...issue,
      id: issue.id || `issue-${index + 1}`,
      line: issue.line ?? 1, // Default to line 1 if null
    }));

    console.log("📊 Final parsed data:", JSON.stringify(parsed, null, 2));

    // SAVE REVIEW TO DATABASE
    try {
      const newReview = new reviewModal({
        userId,
        code,
        language,
        reviewResult: JSON.stringify(parsed), 
      });

      await newReview.save();
      console.log("💾 Review saved to database");
    } catch (dbError) {
      console.error("❌ Failed to save review to DB:", dbError);
    }

    // Return the parsed data directly (this is what frontend expects)
    return res.json({
      success: true,
      parsed: parsed, // Keep this structure for now
      issues: parsed.issues, // Also provide direct access
      refactoredCode: parsed.refactoredCode, // Also provide direct access
      raw: rawText
    });

  } catch (error) {
    console.error("❌ Gemini error:", error);
    return res.status(500).json({ 
      error: "Failed to get response from Gemini",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get all reviews for the authenticated user
export const getReviewCode = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const reviews = await reviewModal.find({ userId }).sort({ createdAt: -1 });

    return res.json({ success: true, reviews });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
};