import React from 'react';
import { FileNode } from '../types';
import { Folder, FileCode, ChevronRight, ChevronDown, CheckCircle, Loader2, AlertCircle, Database, Layout } from 'lucide-react';

interface FileExplorerProps {
  files: FileNode[];
  onSelectFile: (path: string) => void;
  selectedFile: string | null;
  activeTree: 'source' | 'target';
  onToggleTree: (mode: 'source' | 'target') => void;
}

const FileItem: React.FC<{ 
  node: FileNode; 
  depth: number; 
  onSelect: (path: string) => void;
  selected: boolean;
}> = ({ node, depth, onSelect, selected }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (node.type === 'dir') {
    return (
      <div>
        <div 
          className="flex items-center gap-1.5 py-1 px-2 hover:bg-dark-800 cursor-pointer text-gray-400 transition-colors select-none"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <Folder className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-medium">{node.name}</span>
        </div>
        {isOpen && node.children && (
          <div>
            {node.children.map(child => (
              <FileItem 
                key={child.path} 
                node={child} 
                depth={depth + 1} 
                onSelect={onSelect}
                selected={selected}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`
        flex items-center justify-between py-1 px-2 cursor-pointer transition-all border-l-2
        ${selected ? 'bg-brand-900/20 border-brand-500 text-brand-100' : 'border-transparent hover:bg-dark-800 text-gray-400'}
      `}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
      onClick={() => onSelect(node.path)}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <FileCode className={`w-3.5 h-3.5 ${selected ? 'text-brand-400' : 'text-gray-500'}`} />
        <span className="text-xs truncate">{node.name}</span>
      </div>
      
      {node.status === 'migrating' && <Loader2 className="w-3 h-3 animate-spin text-brand-400" />}
      {node.status === 'done' && <CheckCircle className="w-3 h-3 text-brand-500" />}
      {node.status === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onSelectFile, selectedFile, activeTree, onToggleTree }) => {
  return (
    <div className="h-full flex flex-col bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
      <div className="px-2 py-2 border-b border-dark-700 bg-dark-900 flex gap-1">
        <button
          onClick={() => onToggleTree('source')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${
            activeTree === 'source' ? 'bg-dark-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Database className="w-3 h-3" />
          Legacy
        </button>
        <button
          onClick={() => onToggleTree('target')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${
            activeTree === 'target' ? 'bg-brand-900/20 text-brand-400 border border-brand-500/20' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Layout className="w-3 h-3" />
          Next.js
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-600 italic">
              {activeTree === 'source' ? 'No legacy files found' : 'Project structure pending...'}
            </p>
          </div>
        ) : (
          files.map(node => (
            <FileItem 
              key={node.path} 
              node={node} 
              depth={0} 
              onSelect={onSelectFile}
              selected={selectedFile === node.path}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FileExplorer;