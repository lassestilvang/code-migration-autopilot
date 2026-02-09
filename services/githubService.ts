import { FileNode } from '../types';

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

export const parseGitHubUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return {
      owner: parts[0],
      repo: parts[1],
      // For simplicity in this demo, we ignore sub-paths for the root fetch and assume root of repo
      // unless we want to support partial repo fetch. Let's stick to root for "Auto-detect".
      branch: 'main' // default fallback, logic can be enhanced to detect default branch
    };
  } catch {
    return null;
  }
};

const buildFileTree = (items: GitHubTreeItem[]): FileNode[] => {
  const root: FileNode[] = [];
  const map: Record<string, FileNode> = {};

  // Sort by path length to ensure parents are created before children if we were building sequentially,
  // but we use a 2-pass approach so order doesn't strictly matter for existence, but helps.
  items.sort((a, b) => a.path.localeCompare(b.path));

  // 1. Create all nodes
  items.forEach(item => {
    // We only care about blobs (files) and trees (dirs)
    if (item.type !== 'blob' && item.type !== 'tree') return;

    const name = item.path.split('/').pop() || '';
    map[item.path] = {
      name: name,
      path: item.path,
      type: item.type === 'tree' ? 'dir' : 'file',
      status: 'pending',
      children: item.type === 'tree' ? [] : undefined
    };
  });

  // 2. Attach to parents
  items.forEach(item => {
    const node = map[item.path];
    if (!node) return;

    const parts = item.path.split('/');
    if (parts.length === 1) {
      root.push(node);
    } else {
      const parentPath = parts.slice(0, -1).join('/');
      const parent = map[parentPath];
      if (parent && parent.children) {
        parent.children.push(node);
      } else {
        // If parent not found (shouldn't happen with recursive=1 unless truncated), add to root
        root.push(node);
      }
    }
  });

  // 3. Sort nodes (Dirs first, then alphabetical)
  const sortNodes = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'dir' ? -1 : 1;
    });
    nodes.forEach(n => {
      if (n.children) sortNodes(n.children);
    });
  };
  sortNodes(root);

  return root;
};

export const fetchRepoStructure = async (url: string): Promise<FileNode[]> => {
  const repoInfo = parseGitHubUrl(url);
  if (!repoInfo) throw new Error("Invalid GitHub URL");

  // 1. Get the default branch (optional, but good practice. We'll skip and try 'main' then 'master' if failed, or just 'main' for demo)
  // For robustness, we try to fetch the repo details first to get default_branch
  let branch = 'main';
  try {
      const repoDetailsRes = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);
      if (repoDetailsRes.ok) {
          const details = await repoDetailsRes.json();
          branch = details.default_branch || 'main';
      }
  } catch (e) {
      console.warn("Could not fetch repo details, assuming main");
  }

  // 2. Fetch Recursive Tree
  const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/git/trees/${branch}?recursive=1`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
            throw new Error("GitHub API rate limit exceeded.");
        }
        throw new Error(`Failed to fetch repo tree: ${response.statusText}`);
    }
    
    const data: GitHubTreeResponse = await response.json();
    return buildFileTree(data.tree);

  } catch (error) {
    console.error("GitHub fetch error:", error);
    throw error;
  }
};

export const fetchFileContent = async (url: string, path: string): Promise<string> => {
    const repoInfo = parseGitHubUrl(url);
    if (!repoInfo) throw new Error("Invalid URL");
    
    // We try to get the raw content. 
    // Ideally we should use the blob SHA from the tree we fetched earlier to be consistent,
    // but the UI doesn't pass the SHA, just the path.
    // So we use the Contents API or raw domain.
    
    const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${path}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.content && data.encoding === 'base64') {
        // Decode base64, handling newlines and unicode if possible
        try {
            return decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
        } catch (e) {
            return atob(data.content.replace(/\n/g, ''));
        }
    }
    throw new Error("Could not decode file content");
};

// Mock data with nested structure
export const getMockRepo = (): FileNode[] => [
  { 
    name: 'src', 
    path: 'src', 
    type: 'dir', 
    status: 'pending', 
    children: [
      { name: 'components', path: 'src/components', type: 'dir', status: 'pending', children: [
         { name: 'Header.js', path: 'src/components/Header.js', type: 'file', status: 'pending' },
         { name: 'Footer.js', path: 'src/components/Footer.js', type: 'file', status: 'pending' }
      ]},
      { name: 'app.js', path: 'src/app.js', type: 'file', status: 'pending' },
      { name: 'utils.js', path: 'src/utils.js', type: 'file', status: 'pending' },
      { name: 'config.js', path: 'src/config.js', type: 'file', status: 'pending' },
    ]
  },
  { 
    name: 'public', 
    path: 'public', 
    type: 'dir', 
    status: 'pending', 
    children: [
        { name: 'index.html', path: 'public/index.html', type: 'file', status: 'pending' },
        { name: 'favicon.ico', path: 'public/favicon.ico', type: 'file', status: 'pending' }
    ]
  },
  { name: 'package.json', path: 'package.json', type: 'file', status: 'pending' },
  { name: 'README.md', path: 'README.md', type: 'file', status: 'pending' },
  { name: 'styles.css', path: 'styles.css', type: 'file', status: 'pending' },
];

export const getMockReadme = () => `
# Legacy Todo App
This is a simple jQuery based Todo application.
Structure:
- src/app.js: Main logic
`;