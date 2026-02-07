import React from 'react';

interface CodeEditorProps {
  title: string;
  code: string;
  onChange?: (val: string) => void;
  language: string;
  readOnly?: boolean;
  highlight?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ title, code, onChange, language, readOnly = false, highlight = false }) => {
  return (
    <div className={`flex flex-col h-full rounded-xl overflow-hidden border transition-all duration-300 ${highlight ? 'border-brand-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-dark-700'}`}>
      <div className="bg-dark-900 px-4 py-2 border-b border-dark-700 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-300">{title}</span>
        <span className="text-xs px-2 py-0.5 rounded bg-dark-700 text-gray-400 font-mono">{language}</span>
      </div>
      <div className="relative flex-1 bg-dark-800">
        <textarea
          value={code}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          className={`
            w-full h-full p-4 bg-transparent text-sm font-mono leading-relaxed resize-none focus:outline-none
            ${readOnly ? 'text-gray-300' : 'text-gray-100'}
            placeholder-gray-600
          `}
          placeholder={readOnly ? "Waiting for output..." : "Paste your code here..."}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default CodeEditor;