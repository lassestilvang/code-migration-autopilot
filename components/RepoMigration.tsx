import React, { useState, useEffect, useRef } from 'react';
import { AgentStatus, RepoState, LogEntry, FileNode, RepoAnalysisResult } from '../types';
import { fetchRepoStructure, fetchFileContent, getMockRepo, getMockReadme } from '../services/githubService';
import { analyzeRepository, generateArchitectureDiagram, generateProjectStructure, generateNextJsFile } from '../services/geminiService';
import AgentLogs from './AgentLogs';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import { Github, Play, LayoutTemplate, Layers, ArrowRight, Loader2, GitBranch, Database, Check, Layout } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const RepoMigration: React.FC = () => {
  const [state, setState] = useState<RepoState>({
    url: 'https://github.com/jquery/jquery-migrate',
    branch: 'main',
    status: AgentStatus.IDLE,
    files: [], // Source
    generatedFiles: [], // Target
    selectedFile: null,
    activeTree: 'source',
    logs: [],
    analysis: null,
    diagram: null,
    sourceLang: 'JavaScript',
    targetLang: 'Next.js + TypeScript',
    sourceContext: ''
  });

  const [activeTab, setActiveTab] = useState<'code' | 'diagram'>('code');

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, {
        id: uuidv4(),
        timestamp: new Date(),
        step: prev.status,
        message,
        type
      }]
    }));
  };

  const startRepoProcess = async () => {
    setState(prev => ({ 
      ...prev, 
      status: AgentStatus.ANALYZING, 
      logs: [], 
      files: [], 
      generatedFiles: [],
      analysis: null, 
      diagram: null,
      sourceContext: '',
      activeTree: 'source'
    }));
    addLog(`Cloning repository structure from ${state.url}...`);
    
    try {
      // 1. Fetch Files (Structure)
      let files: FileNode[] = [];
      try {
        files = await fetchRepoStructure(state.url);
      } catch (e) {
        addLog("GitHub API unavailable or rate limited. Engaging Simulation Protocol.", "warning");
        files = getMockRepo();
        await new Promise(r => setTimeout(r, 1000)); // Fake network delay
      }
      setState(prev => ({ ...prev, files }));
      addLog(`File index built: ${flattenFiles(files).length} nodes detected.`, "success");

      // 2. Analyze (Readme + List)
      addLog("Reading README and package configuration...", "info");
      let readme = "No README found.";
      try {
        readme = await fetchFileContent(state.url, 'README.md');
      } catch {
        readme = getMockReadme();
      }
      
      addLog("Engaging Deep Static Analysis (Gemini 3 Pro)...", "info");
      
      // Flatten paths for analysis context
      const allPaths = flattenFiles(files).map(f => f.path);
      // Limit paths to avoid huge prompts if repo is massive, take top 500
      const limitedPaths = allPaths.slice(0, 500);

      const analysis = await analyzeRepository(JSON.stringify(limitedPaths), readme);
      
      setState(prev => ({ 
        ...prev, 
        analysis, 
        sourceLang: analysis.detectedFramework,
        targetLang: "Next.js + TypeScript",
        status: AgentStatus.PLANNING 
      }));
      addLog(`Detected: ${analysis.detectedFramework}. Target locked: Next.js (App Router).`, "success");

      // 3. Generate Diagram Immediately
      if (analysis.architectureDescription) {
        addLog("Generating legacy architecture diagram...", "info");
        
        let hasKey = false;
        if ((window as any).aistudio) {
            try {
                hasKey = await (window as any).aistudio.hasSelectedApiKey();
                if (!hasKey) {
                    addLog("Requesting API Key for visual generation...", "warning");
                    await (window as any).aistudio.openSelectKey();
                    hasKey = await (window as any).aistudio.hasSelectedApiKey();
                }
            } catch (e) {
                console.error("Auth flow error", e);
            }
        }

        if (hasKey) {
             const diagram = await generateArchitectureDiagram(analysis.architectureDescription);
             if (diagram) {
                 setState(prev => ({ ...prev, diagram }));
                 setActiveTab('diagram');
                 addLog("Legacy architecture diagram rendered.", "success");
             } else {
                 addLog("Diagram generation failed (Quota/Permission).", "error");
             }
        } else {
            addLog("Skipping diagram: API Key required.", "warning");
        }
      }

    } catch (e: any) {
      addLog(`Fatal Error: ${e.message}`, "error");
      setState(prev => ({ ...prev, status: AgentStatus.ERROR }));
    }
  };

  const confirmMigration = async () => {
    if (!state.analysis) return;
    
    setState(prev => ({ ...prev, status: AgentStatus.CONVERTING }));
    
    // 4. Ingest Source Code for Context
    addLog("Ingesting key legacy source files for context...", "info");
    const filesToRead = flattenFiles(state.files)
      .filter(f => f.type === 'file' && !f.name.endsWith('.md') && !f.name.endsWith('.json') && !f.name.match(/\.(png|jpg|ico|svg)$/))
      .slice(0, 15); // Limit for demo speed/context size

    let context = "";
    for (const f of filesToRead) {
        try {
            const content = await fetchFileContent(state.url, f.path);
            context += `\n\n--- FILE: ${f.path} ---\n${content}`;
        } catch (e) {
            console.warn(`Failed to read ${f.path}`);
        }
    }
    setState(prev => ({ ...prev, sourceContext: context }));
    addLog(`Context loaded: ${context.length} chars.`, "success");

    // 5. Generate New Project Structure
    addLog("Designing Next.js 14 App Router project structure...", "info");
    const newFilePaths = await generateProjectStructure(state.analysis.summary);
    
    const newFileNodes: FileNode[] = buildTreeFromPaths(newFilePaths);
    setState(prev => ({ 
        ...prev, 
        generatedFiles: newFileNodes,
        activeTree: 'target', // Switch view to target
        status: AgentStatus.CONVERTING
    }));
    addLog(`Project scaffolded: ${newFilePaths.length} files created.`, "success");

    // 6. Generate Content for New Files
    const flatTargetFiles = flattenFiles(newFileNodes).filter(f => f.type === 'file');
    
    for (const file of flatTargetFiles) {
        updateFileStatus(file.path, 'migrating', 'target');
        // Auto select the file being generated
        setState(prev => ({ ...prev, selectedFile: file.path }));
        
        addLog(`Generating ${file.path}...`, "info");
        
        try {
            const content = await generateNextJsFile(file.path, context);
            updateFileContent(file.path, content, 'target');
            updateFileStatus(file.path, 'done', 'target');
        } catch (e) {
            updateFileStatus(file.path, 'error', 'target');
            addLog(`Failed to generate ${file.path}`, "error");
        }
    }

    setState(prev => ({ ...prev, status: AgentStatus.COMPLETED }));
    addLog("Migration Complete. System Ready.", "success");
    setActiveTab('code');
  };

  // --- Helpers ---

  // Build tree from flat path list for Target view
  const buildTreeFromPaths = (paths: string[]): FileNode[] => {
      const root: FileNode[] = [];
      const map: Record<string, FileNode> = {};
      
      paths.sort();
      
      paths.forEach(path => {
          const parts = path.split('/');
          let currentPath = "";
          
          parts.forEach((part, index) => {
              const isFile = index === parts.length - 1;
              const parentPath = currentPath;
              currentPath = currentPath ? `${currentPath}/${part}` : part;
              
              if (!map[currentPath]) {
                  const node: FileNode = {
                      name: part,
                      path: currentPath,
                      type: isFile ? 'file' : 'dir',
                      status: 'pending',
                      children: isFile ? undefined : []
                  };
                  map[currentPath] = node;
                  
                  if (index === 0) {
                      root.push(node);
                  } else {
                      const parent = map[parentPath];
                      if (parent && parent.children) {
                          parent.children.push(node);
                      }
                  }
              }
          });
      });
      return root;
  };

  const flattenFiles = (nodes: FileNode[]): FileNode[] => {
    let result: FileNode[] = [];
    nodes.forEach(node => {
      result.push(node);
      if (node.children) result = result.concat(flattenFiles(node.children));
    });
    return result;
  };

  const updateFileStatus = (path: string, status: FileNode['status'], tree: 'source' | 'target') => {
    setState(prev => {
        const targetTree = tree === 'source' ? prev.files : prev.generatedFiles;
        const updateNode = (nodes: FileNode[]): FileNode[] => {
            return nodes.map(node => {
                if (node.path === path) return { ...node, status };
                if (node.children) return { ...node, children: updateNode(node.children) };
                return node;
            });
        };
        const updatedTree = updateNode(targetTree);
        return tree === 'source' ? { ...prev, files: updatedTree } : { ...prev, generatedFiles: updatedTree };
    });
  };

  const updateFileContent = (path: string, content: string, tree: 'source' | 'target') => {
    setState(prev => {
        const targetTree = tree === 'source' ? prev.files : prev.generatedFiles;
        const updateNode = (nodes: FileNode[]): FileNode[] => {
            return nodes.map(node => {
                if (node.path === path) return { ...node, content }; // For target, content IS the migrated code
                if (node.children) return { ...node, children: updateNode(node.children) };
                return node;
            });
        };
        const updatedTree = updateNode(targetTree);
        return tree === 'source' ? { ...prev, files: updatedTree } : { ...prev, generatedFiles: updatedTree };
    });
  };

  // Get currently selected file data
  const getSelectedFileData = () => {
    if (!state.selectedFile) return null;
    const tree = state.activeTree === 'source' ? state.files : state.generatedFiles;
    return flattenFiles(tree).find(f => f.path === state.selectedFile);
  };

  const selectedNode = getSelectedFileData();

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Search Bar / Input */}
      <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
                type="text" 
                value={state.url}
                onChange={(e) => setState(prev => ({...prev, url: e.target.value}))}
                disabled={state.status !== AgentStatus.IDLE}
                placeholder="https://github.com/username/repository"
                className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-gray-200 focus:border-brand-500 focus:outline-none transition-colors"
            />
        </div>
        
        {state.status === AgentStatus.IDLE ? (
             <button 
                onClick={startRepoProcess}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
             >
                <Play className="w-4 h-4 fill-current" />
                Analyze Repo
             </button>
        ) : state.status === AgentStatus.PLANNING ? (
             <button 
                onClick={confirmMigration}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-6 rounded-lg animate-pulse-fast shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
             >
                <GitBranch className="w-4 h-4" />
                Build Next.js App
             </button>
        ) : (
            <div className="flex items-center gap-2 px-6 py-3 text-brand-400 font-mono text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                {state.status === AgentStatus.ANALYZING ? 'Scanning...' : state.status === AgentStatus.CONVERTING ? 'Building...' : 'Done'}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
        {/* Left Sidebar: File Tree */}
        <div className="lg:col-span-3 flex flex-col gap-4">
            <FileExplorer 
                files={state.activeTree === 'source' ? state.files : state.generatedFiles} 
                selectedFile={state.selectedFile} 
                activeTree={state.activeTree}
                onToggleTree={(mode) => setState(prev => ({ ...prev, activeTree: mode }))}
                onSelectFile={(path) => setState(prev => ({...prev, selectedFile: path}))}
            />
            <div className="flex-1 min-h-[200px]">
                <AgentLogs logs={state.logs} />
            </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 flex flex-col gap-4">
            
            {/* Context Header: Analysis Summary */}
            {state.analysis && (
                <div className="bg-dark-800 rounded-xl border border-dark-700 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-wider mb-1">
                            <span>Legacy: {state.analysis.detectedFramework}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="text-brand-400 font-bold">Target: Next.js 14 (App Router)</span>
                        </div>
                        <p className="text-sm text-gray-200 max-w-2xl truncate">{state.analysis.summary}</p>
                    </div>
                    
                    <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-700 shrink-0">
                        <button 
                            onClick={() => setActiveTab('code')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${activeTab === 'code' ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <LayoutTemplate className="w-3 h-3" /> Workspace
                        </button>
                        <button 
                            onClick={() => setActiveTab('diagram')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${activeTab === 'diagram' ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Layers className="w-3 h-3" /> Legacy Arch
                        </button>
                    </div>
                </div>
            )}

            {/* Viewer */}
            <div className="flex-1 bg-dark-800 rounded-xl border border-dark-700 overflow-hidden relative min-h-[500px]">
                {activeTab === 'diagram' ? (
                    <div className="absolute inset-0 p-4 flex items-center justify-center bg-dark-900">
                        {state.diagram ? (
                            <img src={state.diagram} alt="Architecture Diagram" className="max-w-full max-h-full rounded shadow-2xl border border-dark-600" />
                        ) : (
                            <div className="text-center text-gray-500">
                                <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No diagram generated yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col">
                        {selectedNode && selectedNode.type === 'file' ? (
                            <CodeEditor 
                                title={state.activeTree === 'source' ? `Legacy / ${selectedNode.name}` : `Next.js / ${selectedNode.name}`}
                                language={state.activeTree === 'source' ? state.sourceLang : 'TypeScript'}
                                code={selectedNode.content || (state.activeTree === 'target' ? "// Generating..." : "// Loading...")}
                                readOnly={true}
                                highlight={state.activeTree === 'target' && !!selectedNode.content}
                            />
                        ) : (
                             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
                                <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mb-4">
                                    {state.activeTree === 'source' ? <Database className="w-8 h-8 text-gray-400" /> : <Layout className="w-8 h-8 text-brand-400" />}
                                </div>
                                <h3 className="text-lg font-medium text-gray-300">
                                    {state.activeTree === 'source' ? 'Legacy Codebase' : 'Modern Next.js Project'}
                                </h3>
                                <p className="text-sm max-w-md text-center mt-2">
                                    {state.activeTree === 'source' 
                                        ? "Explore the original file structure here. Use the buttons above to analyze and migrate." 
                                        : "Generated files for the new Next.js architecture will appear here."}
                                </p>
                             </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RepoMigration;