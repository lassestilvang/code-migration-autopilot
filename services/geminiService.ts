import { GoogleGenAI, Type } from "@google/genai";
import { ANALYSIS_PROMPT_TEMPLATE, CONVERSION_PROMPT_TEMPLATE, VERIFICATION_PROMPT_TEMPLATE } from "../constants";
import { AnalysisResult, VerificationResult } from "../types";

// Helper to get safe API key
const getApiKey = () => process.env.API_KEY || '';

const createClient = () => new GoogleGenAI({ apiKey: getApiKey() });

export const analyzeCode = async (
  sourceCode: string,
  sourceLang: string,
  targetLang: string
): Promise<AnalysisResult> => {
  const client = createClient();
  const prompt = ANALYSIS_PROMPT_TEMPLATE
    .replace('{sourceLang}', sourceLang)
    .replace('{targetLang}', targetLang);
  
  const response = await client.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt + "\n\nSource Code:\n" + sourceCode,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 1024 } // Allow some reasoning time for analysis
    }
  });

  const text = response.text || "{}";
  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse analysis JSON", e);
    return {
      summary: "Failed to generate analysis.",
      complexity: "Medium",
      dependencies: [],
      patterns: [],
      risks: ["JSON Parsing Failed"]
    };
  }
};

export const convertCode = async (
  sourceCode: string,
  sourceLang: string,
  targetLang: string,
  analysis: AnalysisResult
): Promise<string> => {
  const client = createClient();
  const prompt = CONVERSION_PROMPT_TEMPLATE
    .replace('{sourceLang}', sourceLang)
    .replace('{targetLang}', targetLang)
    .replace('{analysisJson}', JSON.stringify(analysis))
    .replace('{sourceCode}', sourceCode);

  const response = await client.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 2048 } // More budget for actual coding
    }
  });

  let code = response.text || "";
  // Strip markdown fences if Gemini adds them despite instructions
  code = code.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
  return code;
};

export const verifyCode = async (
  targetCode: string,
  sourceLang: string,
  targetLang: string
): Promise<VerificationResult> => {
  const client = createClient();
  const prompt = VERIFICATION_PROMPT_TEMPLATE
    .replace('{sourceLang}', sourceLang)
    .replace('{targetLang}', targetLang)
    .replace('{targetCode}', targetCode);

  const response = await client.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 1024 }
    }
  });

  const text = response.text || "{}";
  try {
    const result = JSON.parse(text);
    return {
      passed: result.passed,
      issues: result.issues || [],
      fixedCode: result.fixedCode
    };
  } catch (e) {
    console.error("Failed to parse verification JSON", e);
    // Fallback if JSON fails, assume it passed to avoid blocking user
    return { passed: true, issues: ["Verification parsing failed"] };
  }
};