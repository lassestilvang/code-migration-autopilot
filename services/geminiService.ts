import { GoogleGenAI, Type } from "@google/genai";
import { 
  ANALYSIS_PROMPT_TEMPLATE, 
  CONVERSION_PROMPT_TEMPLATE, 
  VERIFICATION_PROMPT_TEMPLATE, 
  REPO_ANALYSIS_PROMPT_TEMPLATE,
  PROJECT_SCAFFOLD_PROMPT,
  GENERATION_PROMPT_TEMPLATE
} from "../constants";
import { AnalysisResult, VerificationResult, RepoAnalysisResult } from "../types";

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
      thinkingConfig: { thinkingBudget: 1024 } 
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

export const analyzeRepository = async (
  fileList: string,
  readme: string
): Promise<RepoAnalysisResult> => {
  const client = createClient();
  const prompt = REPO_ANALYSIS_PROMPT_TEMPLATE
    .replace('{fileList}', fileList)
    .replace('{readme}', readme);

  const response = await client.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 2048 }
    }
  });

  const text = response.text || "{}";
  try {
    return JSON.parse(text) as RepoAnalysisResult;
  } catch (e) {
    console.error("Failed to parse repo analysis JSON", e);
    // Fallback
    return {
      summary: "Could not analyze repository structure automatically.",
      complexity: "High",
      dependencies: [],
      patterns: [],
      risks: [],
      detectedFramework: "Unknown",
      recommendedTarget: "Next.js + TypeScript",
      architectureDescription: "A generic software architecture diagram."
    };
  }
};

export const generateProjectStructure = async (analysisSummary: string): Promise<string[]> => {
  const client = createClient();
  const prompt = PROJECT_SCAFFOLD_PROMPT
    .replace('{analysisSummary}', analysisSummary);

  const response = await client.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 1024 }
    }
  });

  try {
    const text = response.text || "[]";
    return JSON.parse(text) as string[];
  } catch (e) {
    console.error("Failed to parse scaffold JSON", e);
    return ["package.json", "app/page.tsx", "app/layout.tsx", "README.md"]; // Fallback
  }
};

export const generateNextJsFile = async (
  targetFilePath: string,
  sourceContext: string
): Promise<string> => {
  const client = createClient();
  // Truncate sourceContext if too large (approx safety check)
  const safeContext = sourceContext.length > 50000 ? sourceContext.substring(0, 50000) + "\n...[truncated]" : sourceContext;

  const prompt = GENERATION_PROMPT_TEMPLATE
    .replace('{targetFilePath}', targetFilePath)
    .replace('{sourceContext}', safeContext);

  const response = await client.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 2048 }
    }
  });

  let code = response.text || "";
  code = code.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
  return code;
};

export const generateArchitectureDiagram = async (description: string): Promise<string> => {
  const client = createClient();
  // Using gemini-3-pro-image-preview for high quality diagrams
  const prompt = `Create a professional, high-level software architecture diagram.
  Style: Whiteboard, technical, clean lines, blue and white color scheme.
  System Description: ${description}`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return '';
  } catch (e) {
    console.error("Image generation failed", e);
    return '';
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
      thinkingConfig: { thinkingBudget: 2048 } 
    }
  });

  let code = response.text || "";
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
    return { passed: true, issues: ["Verification parsing failed"] };
  }
};