export enum AgentStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  PLANNING = 'PLANNING',
  CONVERTING = 'CONVERTING',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AnalysisResult {
  summary: string;
  complexity: 'Low' | 'Medium' | 'High';
  dependencies: string[];
  patterns: string[];
  risks: string[];
}

export interface VerificationResult {
  passed: boolean;
  issues: string[];
  fixedCode?: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  step: AgentStatus;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface MigrationState {
  sourceLang: string;
  targetLang: string;
  sourceCode: string;
  targetCode: string;
  status: AgentStatus;
  logs: LogEntry[];
  analysis: AnalysisResult | null;
  verification: VerificationResult | null;
}

export const LANGUAGES = [
  { id: 'python2', label: 'Python 2' },
  { id: 'python3', label: 'Python 3' },
  { id: 'javascript', label: 'JavaScript (ES5)' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'react', label: 'React (Functional)' },
  { id: 'vue2', label: 'Vue 2' },
  { id: 'vue3', label: 'Vue 3' },
  { id: 'angular', label: 'Angular' },
  { id: 'jquery', label: 'jQuery' },
  { id: 'php', label: 'PHP' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'java', label: 'Java' },
];