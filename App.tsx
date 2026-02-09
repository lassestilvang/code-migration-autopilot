import React, { useState } from 'react';
import Header from './components/Header';
import SnippetMigration from './components/SnippetMigration';
import RepoMigration from './components/RepoMigration';
import { Code2, GitBranch } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<'snippet' | 'repo'>('repo');

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-500/30">
      <Header />
      
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-6 flex flex-col gap-6">
        
        {/* Mode Switcher */}
        <div className="flex justify-center">
            <div className="bg-dark-800 p-1 rounded-lg border border-dark-700 inline-flex">
                <button
                    onClick={() => setMode('repo')}
                    className={`
                        flex items-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300
                        ${mode === 'repo' 
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                            : 'text-gray-400 hover:text-white hover:bg-dark-700'}
                    `}
                >
                    <GitBranch className="w-4 h-4" />
                    Repository Autopilot
                </button>
                <button
                    onClick={() => setMode('snippet')}
                    className={`
                        flex items-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300
                        ${mode === 'snippet' 
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                            : 'text-gray-400 hover:text-white hover:bg-dark-700'}
                    `}
                >
                    <Code2 className="w-4 h-4" />
                    Snippet Mode
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
            {mode === 'snippet' ? <SnippetMigration /> : <RepoMigration />}
        </div>

      </main>
    </div>
  );
};

export default App;