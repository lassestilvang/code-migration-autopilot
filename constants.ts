export const DEFAULT_SOURCE_CODE = `// Example: Legacy jQuery to React Migration
$(document).ready(function() {
  var count = 0;
  
  $('#counter-btn').click(function() {
    count++;
    $('#count-display').text('Count: ' + count);
    
    if (count > 10) {
      $('#message').fadeIn();
    }
  });

  $('#reset-btn').on('click', function() {
    count = 0;
    $('#count-display').text('Count: 0');
    $('#message').hide();
  });
});`;

export const ANALYSIS_PROMPT_TEMPLATE = `
You are an expert Senior Software Architect specializing in legacy code migration.
Analyze the following source code written in {sourceLang}.
Identify the key logic, dependencies, state management patterns, and potential risks when migrating to {targetLang}.

Output strict JSON with this structure:
{
  "summary": "Brief executive summary of the code's purpose",
  "complexity": "Low" | "Medium" | "High",
  "dependencies": ["list", "of", "external", "libs"],
  "patterns": ["list", "of", "coding", "patterns", "identified"],
  "risks": ["list", "of", "potential", "migration", "risks"]
}
`;

export const CONVERSION_PROMPT_TEMPLATE = `
You are an autonomous coding agent.
Convert the following {sourceLang} code to modern, clean, production-ready {targetLang}.
Use the analysis provided below to guide your refactoring decisions.
Ensure the new code follows best practices for {targetLang} (e.g., Hooks for React, Type Safety for TypeScript).

Analysis:
{analysisJson}

Source Code:
{sourceCode}

Output ONLY the converted code. Do not include markdown fences like \`\`\` or explanations outside the code.
`;

export const VERIFICATION_PROMPT_TEMPLATE = `
You are a QA Engineer and Strict Code Reviewer.
Review the following {targetLang} code that was migrated from {sourceLang}.
Check for:
1. Syntax errors.
2. Logic equivalence to the original intent (inferred).
3. Best practices violations (e.g., any, unused vars, potential memory leaks).

If the code is good, return JSON: { "passed": true, "issues": [] }
If there are issues, fix the code and return JSON: { "passed": false, "issues": ["description of issue"], "fixedCode": "FULL_FIXED_CODE_HERE" }

Code to Verify:
{targetCode}
`;