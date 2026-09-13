'use client';

import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

export function GithubCodeSnippet({ githubUrl }: { githubUrl: string }) {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReadme() {
      if (!githubUrl) {
        setCode(`> System Online.\n> Awaiting project URL...`);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) {
          setCode(`$ git clone ${githubUrl}\n$ cd project\n$ npm install\n$ npm start`);
          setLoading(false);
          return;
        }
        
        const owner = match[1];
        const repo = match[2].replace('.git', '');
        
        let res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`);
        if (!res.ok) {
           res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`);
        }
        
        if (res.ok) {
          const text = await res.text();
          // Find first code block
          const codeBlockMatch = text.match(/```[a-z]*\n([\s\S]*?)```/);
          if (codeBlockMatch && codeBlockMatch[1]) {
            setCode(codeBlockMatch[1].trim());
          } else {
            setCode(`$ git clone ${githubUrl}\n$ cd ${repo}\n$ npm install\n$ npm start\n\n> System initialized successfully.`);
          }
        } else {
          setCode(`$ git clone ${githubUrl}\n$ cd ${repo}\n$ npm install\n$ npm start\n\n> Repository found. Initializing...`);
        }
      } catch (e) {
        setCode(`$ git clone ${githubUrl}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReadme();
  }, [githubUrl]);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#1e1e1e]">
      <div className="h-10 bg-[#2d2d2d] border-b border-[#3c3c3c] flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
         </div>
         <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <Terminal size={14} />
            bash
         </div>
      </div>
      <div className="flex-1 p-6 font-mono text-sm text-[#d4d4d4] leading-relaxed overflow-y-auto overflow-x-auto whitespace-pre-wrap">
         {loading ? (
            <span className="animate-pulse text-indigo-400">{'>'} Fetching repository details...</span>
         ) : (
            <code>{code}</code>
         )}
      </div>
    </div>
  );
}
